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

const storage = new Map();
const localStorage = {
  getItem: (key) => storage.has(key) ? storage.get(key) : null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key)
};
const helpers = [
  sourceBetween("const adminUsers =", "const adminTabs ="),
  sourceBetween("function createAdminSession", "function getAdminCounts"),
  sourceBetween("function readJson", "function createId")
].join("\n");
const context = { localStorage, Date, Number, JSON, Map };
vm.runInNewContext(`
  const STORAGE_KEYS = { adminSession: "teamLinkAdminSession" };
  ${helpers}
  this.sessionHelpers = { ADMIN_PASSCODE, ADMIN_SESSION_TTL_MS, saveAdminSession, getAdminSession, clearAdminSession };
`, context);
const { ADMIN_PASSCODE, ADMIN_SESSION_TTL_MS, saveAdminSession, getAdminSession, clearAdminSession } = context.sessionHelpers;

test("共通管理パスコードは0000", () => {
  assert.equal(ADMIN_PASSCODE, "0000");
  assert.match(appSource, /password !== ADMIN_PASSCODE/);
});

test("ログイン状態を30日間保持する", () => {
  storage.clear();
  const now = Date.parse("2026-08-25T00:00:00+09:00");
  saveAdminSession("boss", now);
  assert.equal(getAdminSession(now + ADMIN_SESSION_TTL_MS - 1)?.adminId, "boss");
  assert.equal(getAdminSession(now + ADMIN_SESSION_TTL_MS), null);
  assert.equal(localStorage.getItem("teamLinkAdminSession"), null);
});

test("保存済みスタッフの権限は既存定義から復元する", () => {
  storage.clear();
  const now = Date.parse("2026-08-25T00:00:00+09:00");
  saveAdminSession("staff-kanda", now);
  const tampered = JSON.parse(localStorage.getItem("teamLinkAdminSession"));
  tampered.role = "admin";
  localStorage.setItem("teamLinkAdminSession", JSON.stringify(tampered));
  const restored = getAdminSession(now + 1000);
  assert.equal(restored.role, "staff");
  assert.equal(restored.adminId, "staff-kanda");
});

test("ログアウトで保存済みセッションを削除する", () => {
  storage.clear();
  saveAdminSession("boss", Date.now());
  clearAdminSession();
  assert.equal(getAdminSession(), null);
});

test("ログアウトUIは管理画面内にあり一般ナビには管理導線がない", () => {
  assert.match(htmlSource, /<section class="admin-cockpit"[\s\S]*id="adminLogoutButton">ログアウト<\/button>/);
  const bottomNav = htmlSource.match(/<nav class="bottom-nav"[\s\S]*?<\/nav>/)?.[0] || "";
  assert.doesNotMatch(bottomNav, /data-view="admin"/);
});
