var TEAM_LINK_WEB_PUSH_SUBSCRIPTION_HEADERS_ = [
  "subscriptionId", "endpoint", "p256dh", "auth", "deviceLabel", "adminId",
  "createdAt", "updatedAt", "enabled", "lastSuccessAt", "lastErrorAt", "lastError"
];
var TEAM_LINK_WEB_PUSH_LOG_HEADERS_ = [
  "notificationId", "eventKey", "eventType", "targetId", "title", "body", "url",
  "status", "sentCount", "failedCount", "attemptCount", "lastError", "createdAt", "updatedAt"
];
var TEAM_LINK_WEB_PUSH_TRIGGER_HANDLER_ = "dispatchTeamLinkWebPushNotifications_";

function routeTeamLinkWebPushAction_(action, payload, sessionToken) {
  switch (String(action || "")) {
    case "getWebPushConfig":
      return getWebPushConfig_(sessionToken);
    case "getWebPushSubscriptionStatus":
      return getWebPushSubscriptionStatus_(payload, sessionToken);
    case "saveWebPushSubscription":
      return saveWebPushSubscription_(payload, sessionToken);
    case "disableWebPushSubscription":
      return disableWebPushSubscription_(payload, sessionToken);
    default:
      return null;
  }
}

function getWebPushSubscriptionStatus_(payload, sessionToken) {
  requireAdminRole_(sessionToken, "staff");
  var endpoint = String(payload && payload.endpoint || "").trim();
  if (!/^https:\/\//.test(endpoint)) {
    throwApiError_("VALIDATION_ERROR", "Push Subscriptionを特定できません");
  }
  var subscriptionId = webPushSubscriptionId_(endpoint);
  var existing = getWebPushSubscriptions_().find(function(row) {
    return String(row.subscriptionId || "") === subscriptionId;
  });
  return apiSuccess_({
    subscription: {
      registered: Boolean(existing),
      enabled: Boolean(existing && isTruthy_(existing.enabled)),
      subscriptionId: existing ? subscriptionId : "",
      provider: webPushEndpointProvider_(endpoint),
      updatedAt: existing && existing.updatedAt || "",
      lastSuccessAt: existing && existing.lastSuccessAt || "",
      lastErrorAt: existing && existing.lastErrorAt || "",
      lastError: existing && existing.lastError || ""
    }
  }, "Web Push端末登録を確認しました");
}

function getWebPushConfig_(sessionToken) {
  requireAdminRole_(sessionToken, "staff");
  var properties = PropertiesService.getScriptProperties();
  var publicKey = String(properties.getProperty("TEAM_LINK_WEB_PUSH_VAPID_PUBLIC_KEY") || "").trim();
  var relayUrl = String(properties.getProperty("TEAM_LINK_WEB_PUSH_RELAY_URL") || "").trim();
  var relaySecret = String(properties.getProperty("TEAM_LINK_WEB_PUSH_RELAY_SECRET") || "").trim();
  var subscriptions = getWebPushSubscriptions_().filter(function(row) { return isTruthy_(row.enabled); });
  return apiSuccess_({
    config: {
      enabled: Boolean(publicKey && relayUrl && relaySecret),
      publicKey: publicKey,
      subscriptionCount: subscriptions.length
    }
  }, "Web Push設定を取得しました");
}

function saveWebPushSubscription_(payload, sessionToken) {
  requireAdminRole_(sessionToken, "staff");
  var endpoint = String(payload && payload.endpoint || "").trim();
  var keys = payload && payload.keys || {};
  var p256dh = String(keys.p256dh || "").trim();
  var auth = String(keys.auth || "").trim();
  if (!/^https:\/\//.test(endpoint) || !p256dh || !auth) {
    throwApiError_("VALIDATION_ERROR", "Push Subscriptionの形式が正しくありません");
  }
  if (endpoint.length > 2048 || p256dh.length > 256 || auth.length > 128) {
    throwApiError_("VALIDATION_ERROR", "Push Subscriptionが長すぎます");
  }
  var ss = getTeamLinkSpreadsheet_();
  ensureWebPushSheets_(ss);
  var now = now_();
  var subscriptionId = webPushSubscriptionId_(endpoint);
  var existing = getSheetObjects_(ss, "PushSubscriptions").find(function(row) {
    return String(row.subscriptionId || "") === subscriptionId;
  }) || {};
  var record = {
    subscriptionId: subscriptionId,
    endpoint: endpoint,
    p256dh: p256dh,
    auth: auth,
    deviceLabel: String(payload.deviceLabel || existing.deviceLabel || "TEAM LINK管理端末").trim().slice(0, 80),
    adminId: getOperatorName_(sessionToken),
    createdAt: existing.createdAt || now,
    updatedAt: now,
    enabled: "TRUE",
    lastSuccessAt: existing.lastSuccessAt || "",
    lastErrorAt: "",
    lastError: ""
  };
  upsertRecord_(ss, "PushSubscriptions", "subscriptionId", subscriptionId, record);
  return apiSuccess_({ subscriptionId: subscriptionId, enabled: true }, "この端末の通知をONにしました");
}

function disableWebPushSubscription_(payload, sessionToken) {
  requireAdminRole_(sessionToken, "staff");
  var endpoint = String(payload && payload.endpoint || "").trim();
  if (!endpoint) throwApiError_("VALIDATION_ERROR", "Push Subscriptionを特定できません");
  var ss = getTeamLinkSpreadsheet_();
  ensureWebPushSheets_(ss);
  var subscriptionId = webPushSubscriptionId_(endpoint);
  var existing = getSheetObjects_(ss, "PushSubscriptions").find(function(row) {
    return String(row.subscriptionId || "") === subscriptionId;
  });
  if (existing) {
    existing.enabled = "FALSE";
    existing.updatedAt = now_();
    upsertRecord_(ss, "PushSubscriptions", "subscriptionId", subscriptionId, existing);
  }
  return apiSuccess_({ subscriptionId: subscriptionId, enabled: false }, "この端末の通知をOFFにしました");
}

function installTeamLinkWebPushTrigger() {
  var ss = getTeamLinkSpreadsheet_();
  ensureWebPushSheets_(ss);
  seedExistingWebPushEventsAsSeen_(ss);
  var existing = ScriptApp.getProjectTriggers().find(function(trigger) {
    return trigger.getHandlerFunction() === TEAM_LINK_WEB_PUSH_TRIGGER_HANDLER_;
  });
  if (!existing) {
    existing = ScriptApp.newTrigger(TEAM_LINK_WEB_PUSH_TRIGGER_HANDLER_).timeBased().everyMinutes(1).create();
  }
  return { success: true, handler: existing.getHandlerFunction(), triggerId: existing.getUniqueId() };
}

function dispatchTeamLinkWebPushNotifications_() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { success: true, skipped: "locked" };
  try {
    var ss = getTeamLinkSpreadsheet_();
    ensureWebPushSheets_(ss);
    var subscriptions = getWebPushSubscriptions_(ss).filter(function(row) { return isTruthy_(row.enabled); });
    if (!subscriptions.length) return { success: true, eventCount: 0, subscriptionCount: 0 };
    var logs = getSheetObjects_(ss, "PushNotificationLog");
    var events = collectPendingWebPushEvents_(ss);
    var delivered = 0;
    events.forEach(function(event) {
      var previous = logs.find(function(row) { return String(row.eventKey || "") === event.eventKey; });
      var attemptCount = Number(previous && previous.attemptCount || 0);
      if (previous && (["sent", "seeded"].includes(String(previous.status)) || attemptCount >= 3)) return;
      var result = sendWebPushEventToSubscriptions_(ss, subscriptions, event);
      var now = now_();
      var logRecord = {
        notificationId: previous && previous.notificationId || createId_("WEBPUSH"),
        eventKey: event.eventKey,
        eventType: event.eventType,
        targetId: event.targetId,
        title: event.title,
        body: event.body,
        url: event.url,
        status: result.sentCount > 0 ? "sent" : "failed",
        sentCount: result.sentCount,
        failedCount: result.failedCount,
        attemptCount: attemptCount + 1,
        lastError: result.lastError || "",
        createdAt: previous && previous.createdAt || now,
        updatedAt: now
      };
      upsertRecord_(ss, "PushNotificationLog", "eventKey", event.eventKey, logRecord);
      if (result.sentCount > 0) delivered += 1;
    });
    return { success: true, eventCount: events.length, delivered: delivered, subscriptionCount: subscriptions.length };
  } finally {
    lock.releaseLock();
  }
}

function sendWebPushEventToSubscriptions_(ss, subscriptions, event) {
  var sentCount = 0;
  var failedCount = 0;
  var lastError = "";
  subscriptions.forEach(function(subscription) {
    try {
      var result = sendWebPushViaRelay_(subscription, event);
      subscription.updatedAt = now_();
      if (result.success) {
        sentCount += 1;
        subscription.lastSuccessAt = subscription.updatedAt;
        subscription.lastErrorAt = "";
        subscription.lastError = "";
      } else {
        failedCount += 1;
        lastError = String(result.error || "Push送信に失敗しました").slice(0, 240);
        subscription.lastErrorAt = subscription.updatedAt;
        subscription.lastError = lastError;
        if (result.expired) subscription.enabled = "FALSE";
      }
    } catch (error) {
      failedCount += 1;
      lastError = String(error && error.message || error).slice(0, 240);
      subscription.updatedAt = now_();
      subscription.lastErrorAt = subscription.updatedAt;
      subscription.lastError = lastError;
      console.error("[TEAM LINK WEB PUSH FAILED]", subscription.subscriptionId, lastError);
    }
    upsertRecord_(ss, "PushSubscriptions", "subscriptionId", subscription.subscriptionId, subscription);
  });
  return { sentCount: sentCount, failedCount: failedCount, lastError: lastError };
}

function sendWebPushViaRelay_(subscription, event) {
  var properties = PropertiesService.getScriptProperties();
  var relayUrl = String(properties.getProperty("TEAM_LINK_WEB_PUSH_RELAY_URL") || "").trim();
  var relaySecret = String(properties.getProperty("TEAM_LINK_WEB_PUSH_RELAY_SECRET") || "").trim();
  if (!relayUrl || !relaySecret) throw new Error("Web Push relay is not configured");
  var body = JSON.stringify({
    subscription: {
      endpoint: String(subscription.endpoint || ""),
      keys: { p256dh: String(subscription.p256dh || ""), auth: String(subscription.auth || "") }
    },
    event: event
  });
  var signatureBytes = Utilities.computeHmacSha256Signature(body, relaySecret, Utilities.Charset.UTF_8);
  var signature = Utilities.base64EncodeWebSafe(signatureBytes).replace(/=+$/g, "");
  var response = UrlFetchApp.fetch(relayUrl, {
    method: "post",
    contentType: "application/json",
    payload: body,
    headers: { "X-Team-Link-Signature": signature },
    muteHttpExceptions: true
  });
  var httpStatus = response.getResponseCode();
  var parsed = {};
  try { parsed = JSON.parse(response.getContentText() || "{}"); } catch (ignore) {}
  return {
    success: httpStatus >= 200 && httpStatus < 300 && parsed.success === true,
    expired: parsed.expired === true,
    httpStatus: httpStatus,
    error: parsed.error || (httpStatus >= 200 && httpStatus < 300 ? "" : "relay_http_" + httpStatus)
  };
}

function collectPendingWebPushEvents_(ss) {
  var bookings = getSheetObjects_(ss, "BookingRequests");
  var bookingById = {};
  bookings.forEach(function(booking) {
    bookingById[String(booking.bookingRequestId || booking.requestId || "")] = booking;
  });
  var events = [];
  bookings.forEach(function(booking) {
    var bookingId = String(booking.bookingRequestId || booking.requestId || "");
    var status = String(booking.currentStatus || booking.status || "").toLowerCase();
    if (!bookingId || webPushIsTestRow_(booking) || !["pending", "booking_requested", "予約希望", "確認待ち"].includes(status)) return;
    events.push(webPushBookingEvent_(booking, "new_booking", "TEAM LINK｜新しい予約", "予約内容を確認してください"));
  });
  getSheetObjects_(ss, "BookingConsultations").forEach(function(consultation) {
    if (String(consultation.status || "").toLowerCase() !== "pending" || webPushIsTestRow_(consultation)) return;
    var bookingId = String(consultation.bookingRequestId || "");
    var booking = bookingById[bookingId] || {};
    var type = String(consultation.consultationType || "");
    var eventType = type === "キャンセルしたい" ? "cancel_requested" : "change_requested";
    var title = eventType === "cancel_requested" ? "TEAM LINK｜キャンセル依頼" : "TEAM LINK｜日時変更相談";
    var customerName = String(booking.customerName || "お客様");
    events.push({
      eventKey: bookingId + ":" + eventType + ":" + String(consultation.consultationId || ""),
      eventType: eventType,
      targetId: bookingId,
      title: title,
      body: customerName + "様から" + (eventType === "cancel_requested" ? "キャンセル依頼" : "予約変更の相談") + "があります。",
      url: TEAM_LINK_ADMIN_URL + "&section=bookings&requestId=" + encodeURIComponent(bookingId),
      tag: "team-link-" + eventType + "-" + bookingId
    });
  });
  getSheetObjects_(ss, "VisitReceptions").forEach(function(reception) {
    if (String(reception.status || "").toLowerCase() !== "pending" || webPushIsTestRow_(reception)) return;
    var receptionId = String(reception.receptionId || "");
    if (!receptionId) return;
    var customerName = String(reception.registeredName || reception.sentName || reception.lineDisplayName || "お客様");
    events.push({
      eventKey: receptionId + ":visit_pending",
      eventType: "visit_pending",
      targetId: receptionId,
      title: "TEAM LINK｜来店確認",
      body: customerName + "様の来店確認が必要です。",
      url: TEAM_LINK_ADMIN_URL + "&section=visits",
      tag: "team-link-visit-" + receptionId
    });
  });
  return events;
}

function webPushBookingEvent_(booking, eventType, title, suffix) {
  var bookingId = String(booking.bookingRequestId || booking.requestId || "");
  var customerName = String(booking.customerName || "お客様");
  var dateTime = webPushFormatDateTime_(booking.firstDateTime);
  return {
    eventKey: bookingId + ":" + eventType,
    eventType: eventType,
    targetId: bookingId,
    title: title,
    body: customerName + "さん\n" + (dateTime ? dateTime + " 希望\n" : "") + suffix,
    url: TEAM_LINK_ADMIN_URL + "&section=bookings&requestId=" + encodeURIComponent(bookingId),
    tag: "team-link-" + eventType + "-" + bookingId
  };
}

function seedExistingWebPushEventsAsSeen_(ss) {
  var existing = getSheetObjects_(ss, "PushNotificationLog");
  var known = {};
  existing.forEach(function(row) { known[String(row.eventKey || "")] = true; });
  collectPendingWebPushEvents_(ss).forEach(function(event) {
    if (known[event.eventKey]) return;
    var now = now_();
    appendRecord_(ss, "PushNotificationLog", {
      notificationId: createId_("WEBPUSH"),
      eventKey: event.eventKey,
      eventType: event.eventType,
      targetId: event.targetId,
      title: event.title,
      body: event.body,
      url: event.url,
      status: "seeded",
      sentCount: 0,
      failedCount: 0,
      attemptCount: 0,
      lastError: "",
      createdAt: now,
      updatedAt: now
    });
  });
}

function getWebPushSubscriptions_(ss) {
  var spreadsheet = ss || getTeamLinkSpreadsheet_();
  ensureWebPushSheets_(spreadsheet);
  return getSheetObjects_(spreadsheet, "PushSubscriptions");
}

function ensureWebPushSheets_(ss) {
  registerWebPushSheetSchemas_();
  ensureSheet_(ss, "PushSubscriptions", TEAM_LINK_WEB_PUSH_SUBSCRIPTION_HEADERS_);
  ensureSheet_(ss, "PushNotificationLog", TEAM_LINK_WEB_PUSH_LOG_HEADERS_);
}

function registerWebPushSheetSchemas_() {
  if (typeof TEAM_LINK_SHEETS !== "object" || !TEAM_LINK_SHEETS) {
    throw new Error("TEAM_LINK_SHEETS is not available");
  }
  TEAM_LINK_SHEETS.PushSubscriptions = TEAM_LINK_WEB_PUSH_SUBSCRIPTION_HEADERS_.slice();
  TEAM_LINK_SHEETS.PushNotificationLog = TEAM_LINK_WEB_PUSH_LOG_HEADERS_.slice();
}

function webPushSubscriptionId_(endpoint) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, endpoint, Utilities.Charset.UTF_8);
  return "WPS-" + bytes.map(function(value) { return ((value + 256) % 256).toString(16).padStart(2, "0"); }).join("").slice(0, 24).toUpperCase();
}

function webPushEndpointProvider_(endpoint) {
  var match = String(endpoint || "").match(/^https:\/\/([^\/:?#]+)/i);
  var host = match ? String(match[1]).toLowerCase() : "";
  if (host === "fcm.googleapis.com" || host.endsWith(".googleapis.com")) return "fcm";
  if (host === "web.push.apple.com" || host.endsWith(".push.apple.com")) return "apple";
  return "webpush";
}

function webPushIsTestRow_(row) {
  if (isTruthy_(row && row.isTest)) return true;
  var text = [row && row.requestId, row && row.bookingRequestId, row && row.consultationId, row && row.receptionId, row && row.customerName].join(" ");
  return /(^|[^A-Z])TEST([^-A-Z]|$)|【TEST】|テスト/i.test(text);
}

function webPushFormatDateTime_(value) {
  var text = String(value || "").trim();
  var match = text.match(/(\d{4})[-\/]?(\d{1,2})[-\/]?(\d{1,2})[^\d]?(\d{1,2}):(\d{2})/);
  if (match) return Number(match[2]) + "月" + Number(match[3]) + "日 " + String(match[4]).padStart(2, "0") + ":" + match[5];
  return text.slice(0, 40);
}
