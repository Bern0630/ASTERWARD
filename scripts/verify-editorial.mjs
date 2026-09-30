import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const collections = ["briefs", "trends", "crossignal", "second-order", "deep-dives"];
const requiredFields = ["title", "date", "type", "summary", "lang", "translationKey"];
let failed = false;

const fail = (message) => {
  console.error(message);
  failed = true;
};

const markdownFiles = (root) => {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
  });
};

const activeFiles = collections.flatMap((collection) => markdownFiles(`src/content/${collection}`));
const archivedFiles = markdownFiles("OLD_VERSION/src/content");

if (archivedFiles.length === 0) {
  fail("OLD_VERSION does not contain the archived article library.");
}
for (const collection of collections) {
  if (!existsSync(`src/content/${collection}`) || !existsSync(`src/content/${collection}/en`)) {
    fail(`Active content structure is incomplete: ${collection}`);
  }
}

const frontmatterValue = (content, field) =>
  content.match(new RegExp(`^${field}:\\s*["']?([^"'\\n]+)["']?`, "m"))?.[1]?.trim();

for (const path of activeFiles) {
  const content = readFileSync(path, "utf8");
  for (const field of requiredFields) {
    if (!frontmatterValue(content, field)) fail(`Missing ${field} in ${path}`);
  }
  if (/placeholder/i.test(content)) fail(`Placeholder text remains in ${path}`);
  if (path.includes("/en/") && /[㐀-鿿]/u.test(content)) {
    fail(`Chinese characters found in English article: ${path}`);
  }

  const translationPath = path.includes("/en/")
    ? join(dirname(dirname(path)), basename(path))
    : join(dirname(path), "en", basename(path));
  if (!existsSync(translationPath)) {
    fail(`Missing translation pair: ${path}`);
    continue;
  }
  const translation = readFileSync(translationPath, "utf8");
  if (frontmatterValue(content, "translationKey") !== frontmatterValue(translation, "translationKey")) {
    fail(`Translation key mismatch: ${path} <-> ${translationPath}`);
  }
}

if (failed) process.exit(1);
console.log(activeFiles.length === 0
  ? `Editorial archive verified: ${archivedFiles.length} articles preserved, no articles published.`
  : `Editorial content verified: ${activeFiles.length} active files.`);
