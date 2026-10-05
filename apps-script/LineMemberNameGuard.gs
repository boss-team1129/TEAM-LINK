/**
 * Guards LINE member registration against rich-menu and feature commands.
 * This file contains no shop- or customer-specific values.
 */
function normalizeLineSystemCommandText_(value) {
  return String(value || "")
    .replace(/[\s　]+/g, "")
    .trim()
    .toLowerCase();
}

function getKnownLineSystemCommandTexts_() {
  var commands = [
    "予約", "予約をする", "予約確認", "予約相談", "空き時間を見る",
    "クーポン", "lineクーポンを見る", "マイクーポン", "水木限定クーポン",
    "ガチャ", "今月のガチャ", "ガチャを引く", "獲得済み景品",
    "占い", "今日の占い", "守護どうぶつを見る", "相性を見る",
    "来店", "来店しました", "マイページ", "マイページを開く",
    "ご縁", "ご縁ラウンジ", "おすすめ商品"
  ];
  if (typeof getLineKeywordMenuDefinitions_ === "function") {
    var definitions = getLineKeywordMenuDefinitions_() || {};
    Object.keys(definitions).forEach(function(keyword) {
      commands.push(keyword);
      var routes = Array.isArray(definitions[keyword].routes) ? definitions[keyword].routes : [];
      routes.forEach(function(route) {
        if (route && route.label) commands.push(route.label);
      });
    });
  }
  return commands.map(normalizeLineSystemCommandText_).filter(Boolean);
}

function isKnownLineSystemCommandText_(value) {
  var normalized = normalizeLineSystemCommandText_(value);
  if (!normalized) return false;
  if (/^(?:https?:\/\/|www\.)/i.test(normalized)) return true;
  if (/^(?:action|view|feature|couponid|menuid)=/i.test(normalized)) return true;
  if (getKnownLineSystemCommandTexts_().indexOf(normalized) >= 0) return true;
  return [
    "予約", "クーポン", "ガチャ", "占い", "来店", "マイページ",
    "ご縁", "ラウンジ", "キャンセル", "日時変更", "予約変更",
    "メニューを開く", "おすすめ商品"
  ].some(function(term) {
    return normalized.indexOf(normalizeLineSystemCommandText_(term)) >= 0;
  });
}

function isCorruptedLineMemberName_(member) {
  var names = [member && member.realName, member && member.nickname]
    .map(function(value) { return String(value || "").trim(); })
    .filter(Boolean);
  return names.length > 0 && names.every(isKnownLineSystemCommandText_);
}

function repairCorruptedLineMemberName_(ss, member, candidateName, nowValue) {
  if (!member || !member.memberId || !isCorruptedLineMemberName_(member)) return member;
  var normalizedCandidate = String(candidateName || "").trim();
  if (!normalizedCandidate || isKnownLineSystemCommandText_(normalizedCandidate)) return member;

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var latest = getSheetObjects_(ss, "Members").find(function(row) {
      return String(row.memberId || "") === String(member.memberId || "");
    }) || null;
    if (!latest || !isCorruptedLineMemberName_(latest)) return latest || member;

    if (!String(latest.realName || "").trim() || isKnownLineSystemCommandText_(latest.realName)) {
      latest.realName = normalizedCandidate;
    }
    if (!String(latest.nickname || "").trim() || isKnownLineSystemCommandText_(latest.nickname)) {
      latest.nickname = normalizedCandidate;
    }
    latest.identityStatus = "line_name_confirmed";
    latest.updatedAt = nowValue || now_();
    upsertRecord_(ss, "Members", "memberId", latest.memberId, latest);
    SpreadsheetApp.flush();
    return latest;
  } finally {
    lock.releaseLock();
  }
}
