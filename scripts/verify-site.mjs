import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const requiredFiles = [
  "dist/index.html",
  "dist/en/index.html",
  "dist/about/index.html",
  "dist/en/about/index.html",
  "dist/briefs/index.html",
  "dist/en/briefs/index.html"
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error("Missing generated files:\n" + missing.join("\n"));
  process.exit(1);
}

const filesUnder = (root) => {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
};

const zhHome = readFileSync("dist/index.html", "utf8");
const enHome = readFileSync("dist/en/index.html", "utf8");
const zhResearch = readFileSync("dist/briefs/index.html", "utf8");
const enResearch = readFileSync("dist/en/briefs/index.html", "utf8");
const siteData = readFileSync("src/data/site.ts", "utf8");
const header = readFileSync("src/components/Header.astro", "utf8");
const baseLayout = readFileSync("src/layouts/BaseLayout.astro", "utf8");

for (const home of [zhHome, enHome]) {
  if (!home.includes("ASTERWARD") || home.includes("SECURRENT")) {
    console.error("Homepage brand is invalid.");
    process.exit(1);
  }
  if ((home.match(/<article class="feature-brief/g) ?? []).length !== 0) {
    console.error("Archived research is still visible on a homepage.");
    process.exit(1);
  }
}

if (!zhHome.includes("目前沒有公開研究") || !enHome.includes("No research is currently public")) {
  console.error("Public reset state is missing from a homepage.");
  process.exit(1);
}

if (!zhResearch.includes("目前沒有公開研究") || !enResearch.includes("No research is currently public")) {
  console.error("Public reset state is missing from a research index.");
  process.exit(1);
}

const forbiddenPublicRoutes = filesUnder("dist/briefs")
  .filter((path) => relative("dist/briefs", path).split("/").length > 1)
  .concat(
    filesUnder("dist/en/briefs")
      .filter((path) => relative("dist/en/briefs", path).split("/").length > 1)
  );
if (forbiddenPublicRoutes.length > 0) {
  console.error("Archived brief routes are still public:\n" + forbiddenPublicRoutes.join("\n"));
  process.exit(1);
}

for (const collection of ["trends", "crossignal", "second-order", "deep-dives"]) {
  const articleFiles = filesUnder(`dist/${collection}`).filter((path) => relative(`dist/${collection}`, path).split("/").length > 1);
  const englishArticleFiles = filesUnder(`dist/en/${collection}`).filter((path) => relative(`dist/en/${collection}`, path).split("/").length > 1);
  if (articleFiles.length > 0 || englishArticleFiles.length > 0) {
    console.error(`Archived ${collection} routes are still public.`);
    process.exit(1);
  }
}

if (!existsSync("OLD_VERSION/README.md") || filesUnder("OLD_VERSION/src/content").filter((path) => path.endsWith(".md")).length === 0) {
  console.error("OLD_VERSION archive is incomplete.");
  process.exit(1);
}

if (!siteData.includes('{ label: "研究", href: "/briefs/" }') || !siteData.includes('{ label: "Research", href: "/briefs/" }')) {
  console.error("Primary navigation does not use the reset research labels.");
  process.exit(1);
}

if (!header.includes('class="brand-logo"') || !header.includes('class="brand-name"')) {
  console.error("ASTERWARD header branding is incomplete.");
  process.exit(1);
}

if (!baseLayout.includes("/brand/asterward-icon.png") || !existsSync("public/brand/asterward-icon.png")) {
  console.error("ASTERWARD brand icon is missing.");
  process.exit(1);
}

console.log("Public reset verified: archived articles are preserved and no longer published.");
