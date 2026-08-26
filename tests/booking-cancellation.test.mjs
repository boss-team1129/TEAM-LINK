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

const helperSource = [
  sourceBetween("function combineBookingDateTime", "function syncBookingDateTimeFields"),
  sourceBetween("function normalizeBookingStatus", "function formatReceptionTime")
].join("\n");
const context = { Date, Number, Intl };
vm.runInNewContext(`${helperSource}\nthis.helpers = { getBookingCancellationView, isBookingUnresolved };`, context);
const { getBookingCancellationView, isBookingUnresolved } = context.helpers;

test("キャンセル依頼は確定日時とキャンセル相談を専用表示へ渡す", () => {
  const booking = {
    status: "cancel_requested",
    firstDateTime: "2026-08-29T09:00",
    proposedDateTime: "2026-08-29T09:30",
    confirmedDateTime: "2026-08-29T10:00",
    bookingConsultations: [{
      consultationId: "BC-TEST-CANCEL",
      consultationType: "キャンセルしたい",
      consultationComment: "予定が変わったためキャンセルしたいです",
      status: "pending",
      sentAt: "2026-08-26T01:00:00.000Z"
    }]
  };
  const original = structuredClone(booking);
  const view = getBookingCancellationView(booking);
  assert.equal(view.isCancellationRequest, true);
  assert.equal(view.dateTime, booking.confirmedDateTime);
  assert.equal(view.consultation, "予定が変わったためキャンセルしたいです");
  assert.equal(view.consultationId, "BC-TEST-CANCEL");
  assert.deepEqual(booking, original);
});

test("キャンセル完了で未処理件数が1減る", () => {
  const bookings = [{ status: "pending" }, { status: "cancel_requested" }, { status: "proposed" }];
  assert.equal(bookings.filter(isBookingUnresolved).length, 3);
  bookings[1] = { ...bookings[1], status: "cancelled" };
  assert.equal(bookings.filter(isBookingUnresolved).length, 2);
});

test("キャンセル依頼は日時確定ボタンではなく専用操作を表示する", () => {
  const cardSource = sourceBetween("function bookingCard", "function renderAdminBookingResponseModal");
  assert.match(cardSource, /const isCancellationRequest = status === "キャンセル依頼"/);
  assert.match(cardSource, /data-admin-action="openCancelBooking"/);
  assert.match(cardSource, /キャンセル依頼を確認する/);
  assert.doesNotMatch(cardSource.match(/const canDateRespond = \[[^\]]+\]/)?.[0] || "", /キャンセル依頼/);
});

test("専用画面とキャンセル完了処理が必要項目だけを更新する", () => {
  const modalSource = sourceBetween("function renderAdminBookingResponseModal", "function renderAdminReservationMenus");
  const submitSource = sourceBetween("async function submitBookingCancellation", "function buildDefaultBookingProposalMessage");
  assert.match(modalSource, /キャンセル依頼対応/);
  assert.match(modalSource, /予約をキャンセルしてLINE通知/);
  assert.match(modalSource, /キャンセルせず戻る/);
  assert.match(submitSource, /"cancelled"/);
  assert.match(submitSource, /cancelledAt/);
  assert.match(submitSource, /cancelledBy/);
  assert.doesNotMatch(submitSource, /firstDateTime|secondDateTime|thirdDateTime|proposedDateTime|confirmedDateTime/);
});

test("お客様の予約確認にキャンセル済みを表示する", () => {
  const renderSource = sourceBetween("function renderReservationStatus", "function renderBookingConsultationForm");
  assert.match(renderSource, /予約はキャンセル済みです/);
  assert.match(renderSource, /キャンセルした予約日時/);
});
