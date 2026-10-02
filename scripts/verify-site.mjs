import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const articleSlug = "2026-10-02-ai-optics-cpo-network-power";
const previousArticleSlugs = [
  "2026-10-01-ai-demand-stock-price-investment-return",
  "2026-10-01-ai-glass-core-material-opportunity"
];
const requiredFiles = [
  "dist/index.html",
  "dist/en/index.html",
  "dist/about/index.html",
  "dist/en/about/index.html",
  "dist/briefs/index.html",
  "dist/en/briefs/index.html",
  "dist/trends/index.html",
  "dist/en/trends/index.html",
  `dist/trends/${articleSlug}/index.html`,
  `dist/en/trends/${articleSlug}/index.html`,
  ...previousArticleSlugs.flatMap((slug) => [
    `dist/trends/${slug}/index.html`,
    `dist/en/trends/${slug}/index.html`
  ])
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
const zhResearch = readFileSync("dist/trends/index.html", "utf8");
const enResearch = readFileSync("dist/en/trends/index.html", "utf8");
const zhArticle = readFileSync(`dist/trends/${articleSlug}/index.html`, "utf8");
const enArticle = readFileSync(`dist/en/trends/${articleSlug}/index.html`, "utf8");
const siteData = readFileSync("src/data/site.ts", "utf8");
const header = readFileSync("src/components/Header.astro", "utf8");
const baseLayout = readFileSync("src/layouts/BaseLayout.astro", "utf8");
const globalStyles = readFileSync("src/styles/global.css", "utf8");

for (const [home, latestTitle, previousArticles] of [
  [
    zhHome,
    "AI 不只需要算得快，也需要傳得動",
    [
      ["AI 需求這麼強，股價為什麼可能下跌？", "OCT 01, 2026"],
      ["從 AI 晶片，看見玻璃與化工公司的機會", "SEP 30, 2026"]
    ]
  ],
  [
    enHome,
    "AI Must Move Data, Not Just Compute Faster",
    [
      ["AI Demand Is Strong. Why Can Stock Prices Still Fall?", "OCT 01, 2026"],
      ["From AI Chips to Opportunities in Glass and Specialty Materials", "SEP 30, 2026"]
    ]
  ]
]) {
  if (!home.includes("ASTERWARD") || home.includes("SECURRENT")) {
    console.error("Homepage brand is invalid.");
    process.exit(1);
  }
  if ((home.match(/<article class="hero-feature/g) ?? []).length !== 1) {
    console.error("Homepage does not contain exactly one editorial hero feature.");
    process.exit(1);
  }
  if ((home.match(/<article class="feature-brief/g) ?? []).length !== 2) {
    console.error("Homepage does not contain exactly two previous research cards.");
    process.exit(1);
  }
  const previousCards = Array.from(home.matchAll(/<article class="feature-brief">([\s\S]*?)<\/article>/g))
    .map((match) => match[1])
    .join("\n");
  if (
    previousCards.includes(latestTitle) ||
    previousArticles.some(([title, date]) => !previousCards.includes(title) || !previousCards.includes(date))
  ) {
    console.error("Homepage does not separate the latest and previous research articles.");
    process.exit(1);
  }
  if (!home.includes('class="hero-intro"')) {
    console.error("Homepage editorial hero introduction is missing.");
    process.exit(1);
  }
  if (!home.includes("fonts.googleapis.com/css2?family=Noto+Sans+TC")) {
    console.error("Homepage does not load Noto Sans TC.");
    process.exit(1);
  }
}

if (!/font-family:\s*"Noto Sans TC"/.test(globalStyles) || globalStyles.includes('"Noto Serif TC"')) {
  console.error("Site typography is not consistently based on Noto Sans TC.");
  process.exit(1);
}

if (!/\.hero-feature h2 a\s*\{[^}]*display:\s*block;[^}]*width:\s*100%;/s.test(globalStyles)) {
  console.error("Homepage feature title hover line does not span the full column width.");
  process.exit(1);
}

if (!zhHome.includes("AI 不只需要算得快，也需要傳得動")) {
  console.error("Chinese homepage does not feature the new research.");
  process.exit(1);
}
if (!enHome.includes("AI Must Move Data, Not Just Compute Faster")) {
  console.error("English homepage does not feature the new research.");
  process.exit(1);
}
if (!zhResearch.includes("AI 不只需要算得快，也需要傳得動") || !enResearch.includes("AI Must Move Data, Not Just Compute Faster")) {
  console.error("Research index is missing a translation of the new article.");
  process.exit(1);
}

if (
  !zhArticle.includes("更省電，不等於總用電一定下降。") ||
  !zhArticle.includes("公司可能已受惠於高速光通訊，但 CPO 新增營收仍待驗證。") ||
  !enArticle.includes("Better efficiency does not guarantee lower total power consumption.") ||
  !enArticle.includes("A company may already benefit from high-speed optical networking while its incremental CPO revenue remains unproven.")
) {
  console.error("A published article is incomplete.");
  process.exit(1);
}
if (zhArticle.includes('class="label-row"') || enArticle.includes('class="label-row"')) {
  console.error("Daily market labels are visible on a long-form research article.");
  process.exit(1);
}

const forbiddenBriefRoutes = filesUnder("dist/briefs")
  .filter((path) => relative("dist/briefs", path).split("/").length > 1)
  .concat(
    filesUnder("dist/en/briefs")
      .filter((path) => relative("dist/en/briefs", path).split("/").length > 1)
  );
if (forbiddenBriefRoutes.length > 0) {
  console.error("Archived brief routes are still public:\n" + forbiddenBriefRoutes.join("\n"));
  process.exit(1);
}

for (const collection of ["crossignal", "second-order", "deep-dives"]) {
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

if (!siteData.includes('{ label: "研究", href: "/trends/" }') || !siteData.includes('{ label: "Research", href: "/trends/" }')) {
  console.error("Primary navigation does not point to the current research index.");
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

console.log("Current bilingual research publication verified; archived articles remain private.");
