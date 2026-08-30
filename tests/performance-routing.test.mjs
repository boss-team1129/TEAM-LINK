import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
const htmlSource = await readFile(new URL("../index.html", import.meta.url), "utf8");
const cssSource = await readFile(new URL("../styles.css", import.meta.url), "utf8");

function sourceBetween(start, end) {
  const startIndex = appSource.indexOf(start);
  const endIndex = appSource.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing source start: ${start}`);
  assert.notEqual(endIndex, -1, `missing source end: ${end}`);
  return appSource.slice(startIndex, endIndex);
}

test("初期URLの目的画面をDOMContentLoadedより前に確定する", () => {
  const routePreparation = appSource.indexOf("prepareInitialViewFromLocation();");
  const domReady = appSource.indexOf('document.addEventListener("DOMContentLoaded"');
  assert.ok(routePreparation >= 0 && routePreparation < domReady);
  assert.doesNotMatch(appSource, /if \(await reloadIfFrontendBuildIsStale\(\)\) return/);
  assert.doesNotMatch(appSource, /setTimeout\([^)]*1080/);
});

test("未検証の署名付き会員URLでは以前の会員データを先に描画しない", () => {
  const startupSource = sourceBetween("async function startTeamLinkApplication", "function getInitialRouteState");
  assert.match(startupSource, /const deferPrivateRender = requiresLinkedIdentityVerification\(\)/);
  assert.match(startupSource, /deferPrivateRender && identityVerified/);
  assert.match(startupSource, /deferPrivateRender && !identityVerified\) return/);
});

test("初期表示は指定ルートだけを描画する", () => {
  const renderAppSource = sourceBetween("function renderApp()", "function renderGachaCollectionViews");
  assert.match(renderAppSource, /renderCurrentView\(routeKey\)/);
  assert.doesNotMatch(renderAppSource, /renderHome\(\);\s*renderReservationStatus\(\);/);
  ["reservation", "booking", "fortune", "coupons", "gacha", "mypage", "admin"].forEach((route) => {
    assert.match(renderAppSource, new RegExp(`routeKey === ["']${route}["']`));
  });
});

test("本番同期は予約・カタログを並列化しガチャは画面に応じて先読みする", () => {
  const syncSource = sourceBetween("async function syncProductionState()", "async function syncProductionBookingCatalog");
  const bookings = syncSource.indexOf("customerBookingsPromise");
  const catalog = syncSource.indexOf("catalogPromise");
  const firstAwait = syncSource.indexOf("await Promise.allSettled([customerBookingsPromise, catalogPromise])");
  assert.ok(bookings >= 0 && catalog > bookings && firstAwait > catalog);
  assert.match(syncSource, /TEAM_LINK_GACHA_ROUTE_KEYS\.has\(getCurrentRouteKey\(\)\)/);
  assert.match(syncSource, /prioritizeGacha \? ensureProductionGachaState\(\) : null/);
  assert.match(syncSource, /else scheduleProductionGachaStateSync\(\)/);
  assert.match(syncSource, /getCurrentRouteKey\(\) !== "home"\) return/);
});

test("同一の読取APIは進行中リクエストを再利用する", () => {
  const apiSource = sourceBetween("async function apiRequest", "async function submitBookingRequestSafely");
  assert.match(apiSource, /TEAM_LINK_DEDUPED_API_ACTIONS\.has\(action\)/);
  assert.match(apiSource, /teamLinkApiInFlight\.get\(dedupeKey\)/);
  assert.match(apiSource, /teamLinkApiInFlight\.delete\(dedupeKey\)/);
  assert.doesNotMatch(appSource.slice(0, appSource.indexOf("const viewMap")), /submitBookingRequest|drawMonthlyGacha/);
});

test("ガチャはタッチのpointerupで1回だけ開始し連打をロックする", () => {
  const navigationSource = sourceBetween("function bindNavigation()", "function bindForms()");
  const gachaSource = sourceBetween("async function selectGachaCard", "function waitForGachaInteractionPaint");
  assert.match(navigationSource, /addEventListener\("pointerup"/);
  assert.match(navigationSource, /gachaPointerHandledAt/);
  assert.match(gachaSource, /gachaChoiceInProgress = true/);
  assert.match(gachaSource, /aria-busy/);
  assert.match(cssSource, /@media \(hover: hover\) and \(pointer: fine\)/);
});

test("計測ログはperf=1の時だけ有効で、配布ファイルの版が一致する", () => {
  assert.match(appSource, /get\("perf"\) === "1"/);
  assert.match(appSource, /if \(!TEAM_LINK_PERF_ENABLED\) return/);
  const build = appSource.match(/TEAM_LINK_FRONTEND_BUILD = "([^"]+)"/)?.[1];
  assert.ok(build);
  assert.match(htmlSource, new RegExp(`app\\.js\\?v=${build}`));
  assert.match(htmlSource, new RegExp(`styles\\.css\\?v=${build}`));
});

test("予約カタログの短時間キャッシュは会員ごとに分離する", () => {
  const catalogSource = sourceBetween("async function syncProductionBookingCatalog", "async function syncProductionCustomerBookings");
  assert.match(catalogSource, /lastSyncedFor === String\(userKey \|\| ""\)/);
  assert.match(catalogSource, /TEAM_LINK_BOOKING_CATALOG_TTL_MS/);
  assert.match(catalogSource, /bookingCatalogSyncedFor/);
  assert.match(catalogSource, /bookingCatalogCacheMeta/);
  assert.match(catalogSource, /cacheShapeMatches/);
  assert.match(catalogSource, /Number\(cacheMeta\.menuCount\) === storedMenus\.length/);
  assert.match(catalogSource, /Number\(cacheMeta\.couponCount\) === storedCoupons\.length/);
  assert.match(catalogSource, /Number\(cacheMeta\.memberCouponCount\) === storedMemberCoupons\.length/);
});

test("本番起動時に有効な予約カタログを空配列で上書きしない", () => {
  const ensureSource = sourceBetween("function ensureDemoState()", "function getApiTimeoutMs");
  assert.doesNotMatch(ensureSource, /isProductionApiMode\(\)\) \{\s*writeJson\(STORAGE_KEYS\.reservationMenus, \[\]\)/);
  assert.doesNotMatch(ensureSource, /isProductionApiMode\(\)\) \{\s*writeJson\(STORAGE_KEYS\.adminCoupons, \[\]\)/);
  assert.match(ensureSource, /!localStorage\.getItem\(STORAGE_KEYS\.reservationMenus\)/);
  assert.match(ensureSource, /!localStorage\.getItem\(STORAGE_KEYS\.adminCoupons\)/);
});

test("予約画面はカタログ取得中を0件表示と区別し取得後に再描画する", () => {
  const mySelectionSource = sourceBetween("function renderBookingMySelectionChoices", "function syncMySelectionCheckboxToBooking");
  const syncSource = sourceBetween("async function syncProductionState()", "function scheduleProductionGachaStateSync");
  assert.match(appSource, /通常メニューを取得しています…/);
  assert.match(appSource, /クーポン情報を取得しています…/);
  assert.match(mySelectionSource, /マイクーポンを読み込んでいます…/);
  assert.match(syncSource, /await Promise\.allSettled\(\[customerBookingsPromise, catalogPromise\]\)/);
  assert.match(syncSource, /renderBookingMenuChoices\(\)/);
  assert.match(syncSource, /renderBookingCouponChoices\(\)/);
  assert.match(syncSource, /renderBookingMySelectionChoices\(\)/);
});
