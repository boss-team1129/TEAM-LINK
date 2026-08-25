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
const context = {};
vm.runInNewContext(`${helperSource}\nthis.bookingHelpers = { decideBookingDateTimeAction, getBookingDisplayDateTime, getBookingDisplayDateTimeLabel };`, context);
const { decideBookingDateTimeAction, getBookingDisplayDateTime, getBookingDisplayDateTimeLabel } = context.bookingHelpers;

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

test("希望外日時は proposed として判定し、希望日時を変更しない", () => {
  const original = structuredClone(booking);
  const result = decideBookingDateTimeAction(booking, "2026-08-29T14:00");
  assert.equal(result.status, "proposed");
  assert.equal(result.confirmedChoice, "");
  assert.deepEqual(booking, original);
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

test("既存の確定予約は confirmedDateTime がなくても従来日時を表示する", () => {
  assert.equal(getBookingDisplayDateTime({ ...booking, status: "confirmed", confirmedDateTime: "" }), booking.firstDateTime);
});

test("フォームとAPI payloadが第3希望・提案日時・確定日時を分離している", () => {
  assert.match(htmlSource, /name="thirdDateTime"/);
  assert.match(appSource, /thirdDateTime:\s*String\(form\.get\("thirdDateTime"\)/);
  assert.match(appSource, /proposedDateTime:\s*booking\.proposedDateTime/);
  assert.match(appSource, /confirmedDateTime:\s*booking\.confirmedDateTime/);
  assert.match(appSource, /apiRequest\("getMyBookingRequests"/);
});
