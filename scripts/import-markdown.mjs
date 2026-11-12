#!/usr/bin/env node

import { execSync, spawnSync } from "node:child_process";
import { constants } from "node:fs";
import { access, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import {
  deriveDefaults,
  parseArticle,
  serializeArticle,
  slugifyArticle
} from "./lib/article-importer.mjs";
import { articleUrl, findPreviewServer, startPreviewServer } from "./local-preview.mjs";

function parseArguments(argv) {
  const options = {
    source: argv[0],
    dryRun: false,
    yes: false,
    contentDir: resolve("src/content/trends"),
    buildCommand: `${JSON.stringify(process.execPath)} node_modules/astro/bin/astro.mjs check && ${JSON.stringify(process.execPath)} node_modules/astro/bin/astro.mjs build`
  };
  for (let index = 1; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--dry-run") options.dryRun = true;
    else if (value === "--yes") options.yes = true;
    else if (value === "--content-dir") options.contentDir = resolve(argv[++index]);
    else if (value === "--build-command") options.buildCommand = argv[++index];
    else throw new Error(`不支援的參數：${value}`);
  }
  return options;
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function askMetadata(defaults) {
  const prompt = createInterface({ input: stdin, output: stdout });
  const ask = async (label, value) => (await prompt.question(`${label} [${value}]：`)).trim() || value;
  try {
    const title = await ask("標題", defaults.title);
    const date = await ask("日期", defaults.date);
    const summary = await ask("摘要", defaults.summary);
    const tagsText = await ask("標籤建議（逗號分隔，可直接按 Enter 採用）", defaults.tags.join(", "));
    const slug = await ask("網址", slugifyArticle(title, date));
    return {
      ...defaults,
      title,
      date,
      summary,
      tags: tagsText.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean),
      slug
    };
  } finally {
    prompt.close();
  }
}

function showMetadata(metadata) {
  console.log(`標題：${metadata.title}`);
  console.log(`日期：${metadata.date}`);
  console.log(`摘要：${metadata.summary}`);
  console.log(`標籤：${metadata.tags.length ? metadata.tags.join("、") : "（無）"}`);
  console.log(`網址：${metadata.slug}`);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (!options.source || !/\.mdx?$/i.test(options.source)) {
    throw new Error("請選擇一個 .md 或 .mdx 檔案。");
  }

  const sourcePath = resolve(options.source);
  const sourceText = await readFile(sourcePath, "utf8");
  const parsed = parseArticle(sourceText);
  const defaults = deriveDefaults(parsed, sourcePath);
  const metadata = options.yes
    ? { ...defaults, slug: slugifyArticle(defaults.title, defaults.date) }
    : await askMetadata(defaults);

  if (!metadata.title || !metadata.date || !metadata.summary || !metadata.slug) {
    throw new Error("標題、日期、摘要與網址都不能留空。");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) {
    throw new Error("網址只能使用小寫英文字母、數字與連字號。");
  }
  metadata.translationKey = metadata.slug;

  showMetadata(metadata);
  await mkdir(options.contentDir, { recursive: true });
  const destination = join(options.contentDir, `${metadata.slug}.md`);
  if (await exists(destination)) throw new Error(`已有同名文章：${destination}`);
  if (options.dryRun) {
    console.log("試跑完成，未寫入任何檔案。");
    return;
  }

  const temporary = join(dirname(destination), `.${metadata.slug}.${process.pid}.tmp`);
  const output = serializeArticle(metadata, parsed.body);
  await writeFile(temporary, output, { encoding: "utf8", flag: "wx" });
  await rename(temporary, destination);

  try {
    execSync(options.buildCommand, {
      cwd: resolve(new URL("..", import.meta.url).pathname),
      stdio: "inherit",
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
      shell: true
    });
  } catch (error) {
    await rm(destination, { force: true });
    throw new Error(`網站建置失敗，已移除本次匯入檔案。\n${error.message}`);
  }

  console.log(`已匯入：${destination}`);
  console.log(`ARTICLE_SLUG=${metadata.slug}`);
  console.log("英文版尚未建立。");
  console.log(`下一步：在 Codex 指定 HumanWriting，將 ${destination} 翻譯並建立英文配對稿。`);

  if (process.env.ASTERWARD_SKIP_PREVIEW !== "1") {
    const existingServer = await findPreviewServer();
    const baseUrl = existingServer ?? (await startPreviewServer()).baseUrl;
    const previewUrl = articleUrl(baseUrl, metadata.slug);
    const opened = spawnSync("open", [previewUrl], { stdio: "inherit" });
    if (opened.status !== 0) throw new Error(`無法開啟瀏覽器：${previewUrl}`);
    console.log(`本機預覽：${previewUrl}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
