import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

globalThis.crypto ||= webcrypto;
const workerModule = await import("../workers/web-push-relay/worker.mjs");
const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
const serviceWorkerSource = await readFile(new URL("../service-worker.js", import.meta.url), "utf8");
const appsScriptSource = await readFile(new URL("../apps-script/WebPush.gs", import.meta.url), "utf8");
const integrationPatch = await readFile(new URL("../apps-script/Code.gs.integration.patch", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8"));

function sourceBetween(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing source start: ${start}`);
  assert.notEqual(endIndex, -1, `missing source end: ${end}`);
  return source.slice(startIndex, endIndex);
}

function base64Url(bytes) {
  return Buffer.from(bytes).toString("base64url");
}

async function hkdf(ikm, salt, info, length) {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, length * 8));
}

test("manifestはMacのDock追加用standalone管理画面を定義する", () => {
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./?view=admin");
  assert.equal(manifest.scope, "./");
  assert.deepEqual(manifest.icons.map((icon) => icon.sizes), ["192x192", "512x512"]);
});

test("通知ON・OFF・拒否表示を明確に分ける", () => {
  const displaySource = sourceBetween(appSource, "function getWebPushBrowserInfo", "function renderAdminWebPushSettings");
  const context = { appState: { webPush: {} } };
  vm.runInNewContext(`${displaySource}\nthis.getState = getWebPushDisplayState;\nthis.getBrowser = getWebPushBrowserInfo;`, context);
  assert.equal(context.getBrowser({ navigator: { userAgent: "Mozilla/5.0 Chrome/109.0.0.0 Safari/537.36" } }).name, "Chrome");
  assert.equal(context.getBrowser({ navigator: { userAgent: "Mozilla/5.0 Version/16.1 Safari/605.1.15" } }).name, "Safari");
  assert.equal(context.getState({ supported: true, permission: "granted", status: "on", registered: true, browserName: "Chrome" }).label, "Chrome通知ON");
  assert.equal(context.getState({ supported: true, permission: "granted", status: "on", registered: false, browserName: "Chrome" }).label, "Chrome通知OFF");
  const denied = context.getState({ supported: true, permission: "denied", status: "off", browserName: "Chrome" });
  assert.equal(denied.label, "Chrome通知OFF");
  assert.equal(denied.action, "");
});

test("通知許可は管理画面ボタン操作時だけ要求する", () => {
  const enableSource = sourceBetween(appSource, "async function enableWebPushNotifications", "async function disableWebPushNotifications");
  const initSource = sourceBetween(appSource, "async function initializeAdminWebPush", "async function refreshAdminWebPushState");
  assert.match(enableSource, /Notification\.requestPermission\(\)/);
  assert.doesNotMatch(initSource, /requestPermission/);
  assert.match(enableSource, /saveWebPushSubscription/);
  assert.match(enableSource, /getWebPushSubscriptionStatus/);
  assert.match(sourceBetween(appSource, "async function refreshAdminWebPushState", "async function enableWebPushNotifications"), /serverStatus\.registered === true && serverStatus\.enabled === true/);
});

test("Service Workerは通知生成と該当管理画面へのクリック遷移を処理する", async () => {
  const listeners = {};
  let shown = null;
  let navigated = "";
  let focused = false;
  const context = {
    URL,
    self: {
      location: { origin: "https://boss-team1129.github.io" },
      skipWaiting: () => Promise.resolve(),
      addEventListener: (name, handler) => { listeners[name] = handler; },
      registration: { showNotification: async (title, options) => { shown = { title, options }; } },
      clients: {
        claim: () => Promise.resolve(),
        matchAll: async () => [{
          url: "https://boss-team1129.github.io/TEAM-LINK/?view=admin",
          navigate: async (url) => { navigated = url; },
          focus: async () => { focused = true; }
        }],
        openWindow: async () => null
      }
    }
  };
  vm.runInNewContext(serviceWorkerSource, context);
  let pushPromise;
  listeners.push({
    data: { json: () => ({ title: "TEAM LINK｜Chrome通知テスト", body: "顧客データを使用しない通知テスト", url: "https://boss-team1129.github.io/TEAM-LINK/?view=admin&section=bookings", eventKey: "TEST-CHROME-PUSH-20260826" }) },
    waitUntil: (promise) => { pushPromise = promise; }
  });
  await pushPromise;
  assert.equal(shown.title, "TEAM LINK｜Chrome通知テスト");
  assert.equal(shown.options.tag, "TEST-CHROME-PUSH-20260826");
  let clickPromise;
  listeners.notificationclick({ notification: { data: shown.options.data, close() {} }, waitUntil: (promise) => { clickPromise = promise; } });
  await clickPromise;
  assert.match(navigated, /section=bookings/);
  assert.equal(focused, true);
});

test("Web Push payloadはRFC8291 aes128gcm形式で暗号化・復号できる", async () => {
  const subscriberKeys = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const subscriberPublic = new Uint8Array(await crypto.subtle.exportKey("raw", subscriberKeys.publicKey));
  const auth = crypto.getRandomValues(new Uint8Array(16));
  const vapidKeys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const vapidPublic = new Uint8Array(await crypto.subtle.exportKey("raw", vapidKeys.publicKey));
  const vapidPrivateJwk = await crypto.subtle.exportKey("jwk", vapidKeys.privateKey);
  const event = { title: "TEAM LINK｜新しい予約", body: "村松さん", url: "https://boss-team1129.github.io/TEAM-LINK/?view=admin&section=bookings", eventType: "new_booking", eventKey: "REQ-1:new_booking" };
  const result = await workerModule.buildWebPushRequest({
    endpoint: "https://push.example.test/subscription/1",
    keys: { p256dh: base64Url(subscriberPublic), auth: base64Url(auth) }
  }, event, {
    WEB_PUSH_VAPID_PUBLIC_KEY: base64Url(vapidPublic),
    WEB_PUSH_VAPID_PRIVATE_KEY: vapidPrivateJwk.d,
    WEB_PUSH_CONTACT: "mailto:admin@example.test"
  }, 1_700_000_000);
  assert.equal(result.headers["Content-Encoding"], "aes128gcm");
  assert.match(result.headers.Authorization, /^vapid t=.+, k=.+$/);

  const body = new Uint8Array(result.body);
  const salt = body.slice(0, 16);
  assert.equal(new DataView(body.buffer, body.byteOffset + 16, 4).getUint32(0, false), 4096);
  const serverPublicLength = body[20];
  const serverPublic = body.slice(21, 21 + serverPublicLength);
  const ciphertext = body.slice(21 + serverPublicLength);
  const serverKey = await crypto.subtle.importKey("raw", serverPublic, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: serverKey }, subscriberKeys.privateKey, 256));
  const info = Buffer.concat([Buffer.from("WebPush: info\0"), Buffer.from(subscriberPublic), Buffer.from(serverPublic)]);
  const ikm = await hkdf(sharedSecret, auth, info, 32);
  const cek = await hkdf(ikm, salt, new TextEncoder().encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(ikm, salt, new TextEncoder().encode("Content-Encoding: nonce\0"), 12);
  const aesKey = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]);
  const plaintext = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, aesKey, ciphertext));
  assert.equal(plaintext.at(-1), 2);
  assert.deepEqual(JSON.parse(new TextDecoder().decode(plaintext.slice(0, -1))), workerModule.normalizeEvent(event));
});

test("relay署名は正しい秘密だけを受け付ける", async () => {
  const body = JSON.stringify({ event: { eventKey: "REQ-1:new_booking" } });
  const signature = await workerModule.createRelaySignature(body, "test-secret");
  assert.equal(await workerModule.verifyRelaySignature(body, signature, "test-secret"), true);
  assert.equal(await workerModule.verifyRelaySignature(body, signature, "wrong-secret"), false);
});

test("Apps Script追加処理はイベントを分離しテストデータを除外する", () => {
  const context = {
    TEAM_LINK_ADMIN_URL: "https://boss-team1129.github.io/TEAM-LINK/?view=admin",
    isTruthy_: (value) => value === true || String(value).toUpperCase() === "TRUE",
    encodeURIComponent
  };
  vm.runInNewContext(appsScriptSource, context);
  assert.equal(context.webPushIsTestRow_({ requestId: "TEST-BOOKING-1", isTest: "TRUE" }), true);
  assert.equal(context.webPushIsTestRow_({ requestId: "REQ-1", customerName: "通常のお客様" }), false);
  const bookingEvent = context.webPushBookingEvent_({ requestId: "REQ-1", customerName: "村松剛好", firstDateTime: "2026-09-01 11:00" }, "new_booking", "TEAM LINK｜新しい予約", "予約内容を確認してください");
  assert.equal(bookingEvent.eventKey, "REQ-1:new_booking");
  assert.match(bookingEvent.body, /9月1日 11:00/);
  assert.match(bookingEvent.url, /section=bookings/);
  assert.match(integrationPatch, /routeTeamLinkWebPushAction_/);
  assert.equal(context.webPushEndpointProvider_("https://fcm.googleapis.com/fcm/send/example"), "fcm");
  assert.equal(context.webPushEndpointProvider_("https://web.push.apple.com/example"), "apple");
});

test("本番Subscription照合はendpointの秘密値を返さず登録状態だけを返す", () => {
  let returned = null;
  const context = {
    TEAM_LINK_ADMIN_URL: "https://boss-team1129.github.io/TEAM-LINK/?view=admin",
    requireAdminRole_() {},
    getWebPushSubscriptions_: () => [{ subscriptionId: "WPS-TEST", enabled: "TRUE", updatedAt: "2026-08-26 17:00:00", lastSuccessAt: "" }],
    webPushSubscriptionId_: () => "WPS-TEST",
    isTruthy_: (value) => String(value).toUpperCase() === "TRUE",
    apiSuccess_: (data) => { returned = data; return data; },
    throwApiError_: (_code, message) => { throw new Error(message); },
    encodeURIComponent
  };
  vm.runInNewContext(appsScriptSource, context);
  context.webPushSubscriptionId_ = () => "WPS-TEST";
  context.getWebPushSubscriptions_ = () => [{ subscriptionId: "WPS-TEST", enabled: "TRUE", updatedAt: "2026-08-26 17:00:00", lastSuccessAt: "" }];
  const result = context.getWebPushSubscriptionStatus_({ endpoint: "https://fcm.googleapis.com/fcm/send/private-token" }, "SESSION");
  assert.equal(result.subscription.registered, true);
  assert.equal(result.subscription.enabled, true);
  assert.equal(result.subscription.provider, "fcm");
  assert.equal(JSON.stringify(result).includes("private-token"), false);
  assert.equal(returned.subscription.subscriptionId, "WPS-TEST");
});

test("新規予約・日時変更・キャンセル・来店確認を別イベントとして生成する", () => {
  const sheets = {
    BookingRequests: [
      { requestId: "REQ-NEW", customerName: "新規予約", firstDateTime: "2026-09-01 11:00", status: "pending" },
      { requestId: "REQ-CHANGE", customerName: "日時変更", firstDateTime: "2026-09-02 10:00", status: "confirmed" },
      { requestId: "REQ-CANCEL", customerName: "キャンセル", firstDateTime: "2026-09-03 10:00", status: "confirmed" }
    ],
    BookingConsultations: [
      { consultationId: "BC-CHANGE", bookingRequestId: "REQ-CHANGE", consultationType: "日時を変更したい", status: "pending" },
      { consultationId: "BC-CANCEL", bookingRequestId: "REQ-CANCEL", consultationType: "キャンセルしたい", status: "pending" }
    ],
    VisitReceptions: [{ receptionId: "VISIT-1", registeredName: "来店確認", status: "pending" }]
  };
  const context = {
    TEAM_LINK_ADMIN_URL: "https://boss-team1129.github.io/TEAM-LINK/?view=admin",
    getSheetObjects_: (_ss, name) => sheets[name] || [],
    isTruthy_: (value) => value === true || String(value).toUpperCase() === "TRUE",
    encodeURIComponent
  };
  vm.runInNewContext(appsScriptSource, context);
  const events = context.collectPendingWebPushEvents_({});
  assert.deepEqual([...events.map((event) => event.eventType)], ["new_booking", "change_requested", "cancel_requested", "visit_pending"]);
  assert.match(events.find((event) => event.eventType === "cancel_requested").url, /requestId=REQ-CANCEL/);
  assert.match(events.find((event) => event.eventType === "visit_pending").url, /section=visits/);
});

test("Push送信失敗は例外を外へ出さず購読ログだけを更新する", () => {
  const updates = [];
  const context = {
    TEAM_LINK_ADMIN_URL: "https://boss-team1129.github.io/TEAM-LINK/?view=admin",
    isTruthy_: () => false,
    encodeURIComponent,
    now_: () => "2026-08-26 15:00:00",
    upsertRecord_: (_ss, sheet, key, id, row) => updates.push({ sheet, key, id, row }),
    console: { error() {} }
  };
  vm.runInNewContext(appsScriptSource, context);
  context.sendWebPushViaRelay_ = () => { throw new Error("relay unavailable"); };
  const result = context.sendWebPushEventToSubscriptions_({}, [{ subscriptionId: "WPS-1", enabled: "TRUE" }], { eventKey: "REQ-1:new_booking" });
  assert.equal(result.sentCount, 0);
  assert.equal(result.failedCount, 1);
  assert.equal(updates.length, 1);
  assert.equal(updates[0].row.enabled, "TRUE");
});

test("Pushは予約・メール・LINE処理と別トリガーで実行する", () => {
  assert.match(appsScriptSource, /ScriptApp\.newTrigger\(TEAM_LINK_WEB_PUSH_TRIGGER_HANDLER_\)/);
  assert.match(appsScriptSource, /everyMinutes\(1\)/);
  assert.match(appsScriptSource, /\["sent", "seeded"\]/);
  assert.doesNotMatch(sourceBetween(appSource, "async function submitBookingRequestSafely", "function getApiTimeoutMs"), /WebPush|webPush/);
});
