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

test("未確定予約だけに対応終了を表示し、終了済みは通常一覧から分離する", () => {
  const listSource = sourceBetween("function renderAdminBookings", "function bookingCard");
  const cardSource = sourceBetween("function bookingCard", "function renderAdminBookingResponseModal");
  assert.match(listSource, /normalizeBookingStatus\(booking\.status \|\| booking\.currentStatus\) !== "対応完了"/);
  assert.match(listSource, /終了済みを見る/);
  assert.match(cardSource, /const canCloseHandling = canDateRespond && !isCancellationRequest/);
  assert.match(cardSource, /data-admin-action="closeBookingHandling"/);
});

test("対応終了は確認後にdoneを保存し、LINE通知文言を使わない", async () => {
  const closeSource = sourceBetween("async function closeBookingHandling", "function buildDefaultBookingProposalMessage");
  let statusCall = null;
  const context = {
    window: { confirm: () => true },
    runBookingStatusAction: async (...args) => { statusCall = args; return true; }
  };
  vm.runInNewContext(`${closeSource}\nthis.closeBookingHandling = closeBookingHandling;`, context);
  const button = {};
  assert.equal(await context.closeBookingHandling(button, "BR-1"), true);
  assert.equal(statusCall[1], "BR-1");
  assert.equal(statusCall[2], "done");
  assert.doesNotMatch(closeSource, /LINE/);
});

test("確定済みのLINE通知失敗を管理画面で明示する", () => {
  const labelSource = sourceBetween("function getBookingLineNotificationLabel", "function getBookingEmailNotificationLabel");
  const context = {
    normalizeBookingStatus: (value) => value === "confirmed" ? "予約確定" : value
  };
  vm.runInNewContext(`${labelSource}\nthis.getBookingLineNotificationLabel = getBookingLineNotificationLabel;`, context);
  assert.equal(context.getBookingLineNotificationLabel({ status: "confirmed", lineNotificationStatus: "failed" }), "予約確定済み・通知失敗");
  assert.equal(context.getBookingLineNotificationLabel({ status: "confirmed", lineNotificationStatus: "sent" }), "送信済み");
});

test("予約確定APIの応答喪失時はサーバー保存済み状態を再照合する", () => {
  const updateSource = sourceBetween("async function updateBookingStatus", "async function recoverBookingUpdateAfterApiFailure");
  const recoverySource = sourceBetween("async function recoverBookingUpdateAfterApiFailure", "function openBookingResponseModal");
  assert.match(updateSource, /recoverBookingUpdateAfterApiFailure\(requestId, status, error\)/);
  assert.match(recoverySource, /apiRequest\("listBookingRequests", \{\}\)/);
  assert.match(recoverySource, /normalizeBookingStatus\(serverBooking\.status \|\| serverBooking\.currentStatus\)/);
  assert.match(recoverySource, /lineNotificationError/);
});

test("対応終了はキャンセル日時を新規設定せず、予約中クーポンを解放する", () => {
  const updateSource = sourceBetween("async function updateBookingStatus", "async function recoverBookingUpdateAfterApiFailure");
  assert.match(updateSource, /\["キャンセル", "対応完了"\]\.includes\(normalizedTargetStatus\)/);
  assert.match(updateSource, /releaseBookingPlannedCouponsRemote/);
  assert.match(updateSource, /if \(normalizedTargetStatus === "キャンセル"\) \{\s*booking\.cancelledAt/s);
});
