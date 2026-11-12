import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const cli = new URL("./import-markdown.mjs", import.meta.url).pathname;

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "asterward importer 中文 "));
  const contentDir = join(root, "content with spaces");
  await mkdir(contentDir);
  const source = join(root, "市場文章 測試.md");
  await writeFile(source, "# 市場結構測試\n\n這是摘要段落。\n", "utf8");
  return { root, contentDir, source };
}

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    env: { ...process.env, ASTERWARD_SKIP_PREVIEW: "1" }
  });
}

test("dry run prints metadata and writes nothing for a path with spaces", async () => {
  const { contentDir, source } = await fixture();
  const result = run([source, "--dry-run", "--yes", "--content-dir", contentDir]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /標題：市場結構測試/);
  assert.match(result.stdout, /日期：\d{4}-\d{2}-\d{2}/);
  assert.match(result.stdout, /摘要：這是摘要段落。/);
  assert.match(result.stdout, /標籤：（無）/);
  assert.match(result.stdout, /網址：\d{4}-\d{2}-\d{2}-article/);
  await assert.rejects(readFile(join(contentDir, result.stdout.match(/網址：(\S+)/)[1] + ".md")));
});

test("refuses to overwrite an existing destination during dry run", async () => {
  const { contentDir, source } = await fixture();
  const date = new Date();
  const dateText = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  const destination = join(contentDir, `${dateText}-article.md`);
  await writeFile(destination, "原有文章", "utf8");

  const result = run([source, "--dry-run", "--yes", "--content-dir", contentDir]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /已有同名文章/);
  assert.equal(await readFile(destination, "utf8"), "原有文章");
});

test("writes a transformed article atomically when build succeeds", async () => {
  const { contentDir, source } = await fixture();
  const result = run([
    source,
    "--yes",
    "--content-dir",
    contentDir,
    "--build-command",
    `${process.execPath} -e "process.exit(0)"`
  ]);

  assert.equal(result.status, 0, result.stderr);
  const destination = result.stdout.match(/已匯入：(.+\.md)/)?.[1];
  assert.ok(destination);
  const output = await readFile(destination, "utf8");
  assert.match(output, /^---\ntitle: "市場結構測試"/);
  assert.match(output, /translationKey: "\d{4}-\d{2}-\d{2}-article"/);
  assert.equal((output.match(/這是摘要段落。/g) ?? []).length, 2);
  assert.match(result.stdout, /英文版尚未建立/);
  assert.match(result.stdout, /Codex.*HumanWriting/);
});

test("removes only the new article when build fails", async () => {
  const { contentDir, source } = await fixture();
  const result = run([
    source,
    "--yes",
    "--content-dir",
    contentDir,
    "--build-command",
    `${process.execPath} -e "process.exit(7)"`
  ]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /網站建置失敗/);
  const date = new Date();
  const dateText = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  await assert.rejects(readFile(join(contentDir, `${dateText}-article.md`)));
});
