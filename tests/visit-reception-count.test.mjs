import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");

function sourceBetween(start, end) {
  const startIndex = appSource.indexOf(start);
  const endIndex = appSource.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing source start: ${start}`);
  assert.notEqual(endIndex, -1, `missing source end: ${end}`);
  return appSource.slice(startIndex, endIndex);
}

const helperSource = sourceBetween("function normalizeVisitReceptionStatus", "async function syncProductionVisitReceptions");
const context = {
  isToday: (value) => String(value || "").startsWith("2026-08-26"),
  getVisitReceptions: () => []
};
vm.runInNewContext(`${helperSource}\nthis.helpers = { isVisitReceptionUnconfirmed, getTodayVisitReceptions, countTodayUnconfirmedVisitReceptions };`, context);
const { isVisitReceptionUnconfirmed, getTodayVisitReceptions, countTodayUnconfirmedVisitReceptions } = context.helpers;

test("未確認と確認待ちと本番pendingを同じ未確認状態として数える", () => {
  assert.equal(isVisitReceptionUnconfirmed({ status: "未確認" }), true);
  assert.equal(isVisitReceptionUnconfirmed({ status: "確認待ち" }), true);
  assert.equal(isVisitReceptionUnconfirmed({ status: "pending" }), true);
  assert.equal(isVisitReceptionUnconfirmed({ status: "来店済み" }), false);
  assert.equal(isVisitReceptionUnconfirmed({ status: "confirmed" }), false);
});

test("管理トップと来店確認画面が本日分の同じ未確認件数を使う", () => {
  const receptions = [
    { receivedAt: "2026-08-26T01:00:00.000Z", status: "未確認" },
    { receivedAt: "2026-08-26T02:00:00.000Z", status: "来店済み" },
    { receivedAt: "2026-08-25T01:00:00.000Z", status: "未確認" }
  ];
  assert.equal(getTodayVisitReceptions(receptions).length, 2);
  assert.equal(countTodayUnconfirmedVisitReceptions(receptions), 1);
});

test("来店確認後は共通件数が0になる", () => {
  const receptions = [{ receivedAt: "2026-08-26T01:00:00.000Z", status: "確認済み" }];
  assert.equal(countTodayUnconfirmedVisitReceptions(receptions), 0);
});

test("管理トップへ戻る操作は本番データを再取得する", () => {
  const navigationSource = sourceBetween("function bindNavigation", "function bindForms");
  assert.match(navigationSource, /appState\.adminTab === "dashboard"/);
  assert.match(navigationSource, /syncProductionAdminSection\(\)/);
});
