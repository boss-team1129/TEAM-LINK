import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const helperSource = await readFile(new URL("../apps-script/LineWebhookPerformance.gs", import.meta.url), "utf8");
const patchSource = await readFile(new URL("../apps-script/LineWebhookPerformance.integration.patch", import.meta.url), "utf8");

test("LINE計測ログは秘密値・識別子・イベント本文を受け取らない", () => {
  assert.match(helperSource, /TEAM LINK LINE PERF/);
  assert.doesNotMatch(helperSource, /LINE_CHANNEL_ACCESS_TOKEN|LINE_CHANNEL_SECRET|replyToken|lineUserId|messageText|payload/);
  assert.match(helperSource, /stepMs/);
  assert.match(helperSource, /totalMs/);
});

test("本人メニューPushを来店受付の後処理より前へ移し二重送信しない", () => {
  const earlyPush = patchSource.indexOf("const linePush = sendLinkedMemberMenu_");
  const reception = patchSource.indexOf('"RECEPTION_RECONCILED"');
  assert.ok(earlyPush >= 0 && earlyPush < reception);
  assert.equal(patchSource.match(/^\+  const linePush = sendLinkedMemberMenu_/gm)?.length, 1);
  assert.match(patchSource, /existing VisitHistory\/VisitReceptions reconciliation continues/);
});

test("名前送信は来店記録を作らず既存のPushと来店処理を再利用する", () => {
  assert.match(patchSource, /visitRecorded: false/);
  assert.match(patchSource, /buildLinkedMemberMenu_\(member\)/);
  assert.match(patchSource, /sendLinkedMemberMenu_\(lineUserId, member, personalMenu\)/);
  assert.doesNotMatch(patchSource, /appendRecord_\([^\n]*VisitHistory/);
  assert.doesNotMatch(patchSource, /customerCheckIn_\(/);
});
