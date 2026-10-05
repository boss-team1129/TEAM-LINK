import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const guardSource = await readFile(new URL("../apps-script/LineMemberNameGuard.gs", import.meta.url), "utf8");
const patchSource = await readFile(new URL("../apps-script/LineMemberNameGuard.integration.patch", import.meta.url), "utf8");

function createContext() {
  const context = {
    getLineKeywordMenuDefinitions_: () => ({
      "予約": { routes: [{ label: "予約をする" }] },
      "クーポン": { routes: [{ label: "マイクーポン" }] }
    })
  };
  vm.runInNewContext(`${guardSource}\nthis.guard = { isKnownLineSystemCommandText_, isCorruptedLineMemberName_ };`, context);
  return context.guard;
}

test("リッチメニューと機能コマンドを氏名候補から除外する", () => {
  const guard = createContext();
  [
    "水木限定クーポン", "予約をする", "今月のガチャ", "来店しました",
    "マイページ", "ご縁ラウンジ", "action=customerCheckIn"
  ].forEach((value) => assert.equal(guard.isKnownLineSystemCommandText_(value), true, value));
});

test("日本語・英字・空白を含む通常氏名はコマンド扱いしない", () => {
  const guard = createContext();
  ["村松 剛好", "John Smith", "マリア・サントス", "山田　花子"].forEach((value) => {
    assert.equal(guard.isKnownLineSystemCommandText_(value), false, value);
  });
});

test("既知コマンドだけが保存された会員だけを復旧対象にする", () => {
  const guard = createContext();
  assert.equal(guard.isCorruptedLineMemberName_({ realName: "水木限定クーポン", nickname: "水木限定クーポン" }), true);
  assert.equal(guard.isCorruptedLineMemberName_({ realName: "村松 剛好", nickname: "水木限定クーポン" }), false);
  assert.equal(guard.isCorruptedLineMemberName_({ realName: "John Smith", nickname: "John" }), false);
});

test("本番receiveLineMessageへ再案内・復旧・新規登録防止を統合する", () => {
  assert.match(patchSource, /!member \|\| memberNameIsCorrupted/);
  assert.match(patchSource, /repairCorruptedLineMemberName_\(ss, member, repairName, now\)/);
  assert.match(patchSource, /!member && isKnownLineSystemCommandText_\(messageText\)/);
  assert.match(patchSource, /isKnownLineSystemCommandText_\(candidate\)/);
});

test("誤登録済み会員の氏名だけを修復しIDと正常会員を維持する", () => {
  const records = [{ memberId: "test-member", lineUserId: "test-line", realName: "水木限定クーポン", nickname: "水木限定クーポン", visitCount: 3 }];
  let writes = 0;
  const context = {
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    SpreadsheetApp: { flush() {} },
    getSheetObjects_: () => records.map((row) => ({ ...row })),
    upsertRecord_: (_ss, sheet, key, id, record) => {
      assert.equal(sheet, "Members");
      assert.equal(key, "memberId");
      assert.equal(id, "test-member");
      records[0] = { ...record };
      writes += 1;
    }
  };
  vm.runInNewContext(guardSource, context);
  const repaired = context.repairCorruptedLineMemberName_({}, records[0], "山田 花子", "2026-10-05");
  assert.equal(repaired.realName, "山田 花子");
  assert.equal(repaired.nickname, "山田 花子");
  assert.equal(repaired.memberId, "test-member");
  assert.equal(repaired.lineUserId, "test-line");
  assert.equal(repaired.visitCount, 3);
  assert.equal(repaired.identityStatus, "line_name_confirmed");
  assert.equal(writes, 1);
  context.repairCorruptedLineMemberName_({}, records[0], "別の名前", "2026-10-05");
  assert.equal(records[0].realName, "山田 花子");
  assert.equal(writes, 1);
});
