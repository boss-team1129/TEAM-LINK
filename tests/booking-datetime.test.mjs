import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
const htmlSource = await readFile(new URL("../index.html", import.meta.url), "utf8");

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
vm.runInNewContext(`${helperSource}\nthis.bookingHelpers = { decideBookingDateTimeAction, decideBookingResponseAction, getBookingDisplayDateTime, getBookingDisplayDateTimeLabel, getCustomerBookingProposalView };`, context);
const { decideBookingDateTimeAction, decideBookingResponseAction, getBookingDisplayDateTime, getBookingDisplayDateTimeLabel, getCustomerBookingProposalView } = context.bookingHelpers;

const booking = {
  firstDateTime: "2026-08-29T09:00",
  secondDateTime: "2026-08-29T11:00",
  thirdDateTime: "2026-08-30T10:00"
};

test("第1・第2・第3希望はいずれも確定日時として判定する", () => {
  assert.deepEqual(
    [booking.firstDateTime, booking.secondDateTime, booking.thirdDateTime].map((dateTime) => {
      const result = decideBookingDateTimeAction(booking, dateTime);
      return [result.status, result.confirmedChoice];
    }),
    [["confirmed", "第1希望"], ["confirmed", "第2希望"], ["confirmed", "第3希望"]]
  );
});

test("本番APIのUTC日時を日本時間の入力値へ変換する", () => {
  const serverBooking = {
    firstDateTime: "2026-09-02T01:00:00.000Z",
    secondDateTime: "2026-09-02T02:00:00.000Z",
    thirdDateTime: "2026-09-02T03:00:00.000Z"
  };
  assert.deepEqual(
    [serverBooking.firstDateTime, serverBooking.secondDateTime, serverBooking.thirdDateTime]
      .map((dateTime) => decideBookingDateTimeAction(serverBooking, dateTime).dateTime),
    ["2026-09-02T10:00", "2026-09-02T11:00", "2026-09-02T12:00"]
  );
});

test("希望外日時は proposed として判定し、希望日時を変更しない", () => {
  const original = structuredClone(booking);
  const result = decideBookingDateTimeAction(booking, "2026-08-29T14:00");
  assert.equal(result.status, "proposed");
  assert.equal(result.confirmedChoice, "");
  assert.deepEqual(booking, original);
});

test("通常確定では第1・第2・第3希望をすべて確定できる", () => {
  assert.deepEqual(
    [booking.firstDateTime, booking.secondDateTime, booking.thirdDateTime].map((dateTime) => {
      const result = decideBookingResponseAction(booking, dateTime, "confirm");
      return [result.ok, result.status, result.confirmedChoice];
    }),
    [[true, "confirmed", "第1希望"], [true, "confirmed", "第2希望"], [true, "confirmed", "第3希望"]]
  );
});

test("別日の案内は希望日時を上書きせず proposed になる", () => {
  const original = structuredClone(booking);
  const result = decideBookingResponseAction(booking, "2026-08-29T14:00", "needs_change");
  assert.equal(result.ok, true);
  assert.equal(result.status, "proposed");
  assert.deepEqual(booking, original);
});

test("提案日時は変更・再送でき、最新提案を確定できる", () => {
  const proposed = { ...booking, proposedDateTime: "2026-08-29T14:00", status: "proposed" };
  const changed = decideBookingResponseAction(proposed, "2026-08-29T14:30", "needs_change");
  assert.equal(changed.status, "proposed");
  const accepted = decideBookingResponseAction({ ...proposed, proposedDateTime: changed.dateTime }, changed.dateTime, "confirm");
  assert.equal(accepted.status, "confirmed");
  assert.equal(accepted.confirmedChoice, "店舗提案（了承済み）");
});

test("提案済み予約はLINE了承後に最終調整日時でも確定できる", () => {
  const proposed = { ...booking, proposedDateTime: "2026-08-29T14:00", status: "proposed" };
  const adjusted = decideBookingResponseAction(proposed, "2026-08-29T14:30", "confirm");
  assert.equal(adjusted.ok, true);
  assert.equal(adjusted.status, "confirmed");
  assert.equal(adjusted.confirmedChoice, "店舗調整（了承済み）");
});

test("希望外日時を通常確定から直接確定できない", () => {
  const result = decideBookingResponseAction(booking, "2026-08-29T14:00", "confirm");
  assert.equal(result.ok, false);
  assert.match(result.message, /別日の案内/);
});

test("お客様画面は確定後に confirmedDateTime を優先する", () => {
  const confirmed = { ...booking, status: "confirmed", confirmedDateTime: booking.secondDateTime };
  assert.equal(getBookingDisplayDateTime(confirmed), booking.secondDateTime);
  assert.equal(getBookingDisplayDateTimeLabel(confirmed), "確定日時");
});

test("提案中は proposedDateTime、未確定は第1希望を表示する", () => {
  const proposed = { ...booking, status: "proposed", proposedDateTime: "2026-08-29T14:00" };
  assert.equal(getBookingDisplayDateTime(proposed), "2026-08-29T14:00");
  assert.equal(getBookingDisplayDateTimeLabel(proposed), "店舗提案日時");
  assert.equal(getBookingDisplayDateTime({ ...booking, status: "pending" }), booking.firstDateTime);
});

test("お客様の提案表示は希望・提案・店舗メッセージを分離する", () => {
  const view = getCustomerBookingProposalView({
    ...booking,
    status: "proposed",
    proposedDateTime: "2026-08-29T14:00",
    adminReply: "14時はいかがでしょうか？"
  });
  assert.equal(view.isProposed, true);
  assert.equal(view.requestedDateTime, booking.firstDateTime);
  assert.equal(view.proposedDateTime, "2026-08-29T14:00");
  assert.equal(view.message, "14時はいかがでしょうか？");
});

test("既存の確定予約は confirmedDateTime がなくても従来日時を表示する", () => {
  assert.equal(getBookingDisplayDateTime({ ...booking, status: "confirmed", confirmedDateTime: "" }), booking.firstDateTime);
});

test("フォームとAPI payloadが第3希望・提案日時・確定日時を分離している", () => {
  assert.match(htmlSource, /name="thirdDateTime"/);
  assert.match(appSource, /thirdDateTime:\s*String\(form\.get\("thirdDateTime"\)/);
  assert.match(appSource, /proposedDateTime:\s*booking\.proposedDateTime/);
  assert.match(appSource, /confirmedDateTime:\s*booking\.confirmedDateTime/);
  assert.match(appSource, /apiRequest\("getMyBookingRequests"/);
  assert.match(appSource, /この日時をお客様へ送る/);
  assert.match(appSource, /この日時をお客様へ再送する/);
  assert.match(appSource, /この日時で予約を確定してLINE通知/);
  assert.match(appSource, /予約相談あり・未対応/);
});
