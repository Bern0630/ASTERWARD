import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "dist/index.html",
  "dist/en/index.html",
  "dist/briefs/2026-09-16/index.html",
  "dist/en/briefs/2026-09-16/index.html"
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error("Missing generated files:\\n" + missing.join("\\n"));
  process.exit(1);
}

const zhArticle = readFileSync("dist/briefs/2026-09-16/index.html", "utf8");
const enArticle = readFileSync("dist/en/briefs/2026-09-16/index.html", "utf8");

if (!zhArticle.includes("/en/briefs/2026-09-16/")) {
  console.error("Chinese article does not link to its English translation.");
  process.exit(1);
}

if (!enArticle.includes("/briefs/2026-09-16/")) {
  console.error("English article does not link back to its Chinese translation.");
  process.exit(1);
}

console.log("Bilingual site output verified.");
