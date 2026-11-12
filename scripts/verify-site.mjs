import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const articleSlug = "2026-10-16-us-taiwan-market-q4-outlook";
const previousArticleSlugs = [
  "2026-10-02-ai-optics-cpo-network-power",
  "2026-10-01-ai-demand-stock-price-investment-return",
  "2026-10-01-ai-glass-core-material-opportunity"
];
const requiredFiles = [
  "dist/index.html",
  "dist/en/index.html",
  "dist/about/index.html",
  "dist/en/about/index.html",
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

const chineseArticleFiles = filesUnder("src/content/trends")
  .filter((path) => path.endsWith(".md") && !path.includes("/en/"));
for (const sourcePath of chineseArticleFiles) {
  const slug = sourcePath.split("/").at(-1).replace(/\.md$/, "");
  const generatedPath = `dist/trends/${slug}/index.html`;
  if (!existsSync(generatedPath)) continue;
  const html = readFileSync(generatedPath, "utf8");
  const hasEnglishSource = existsSync(`src/content/trends/en/${slug}.md`);
  const hasEnglishLink = html.includes(`/en/trends/${slug}/`);
  if (hasEnglishSource !== hasEnglishLink) {
    console.error(`Language switch does not match translation availability: ${slug}`);
    process.exit(1);
  }
}

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
    "2008 全球金融風暴：從房貸泡沫到全球銀行救援的完整歷史",
    [
      ["當加密交易所也能買美股：RWA、百倍槓桿如何牽動華爾街？", "NOV 12, 2026"],
      ["前三季成長仍在，第四季市場為什麼開始重估風險？", "OCT 16, 2026"],
    ]
  ],
  [
    enHome,
    "The 2008 Global Financial Crisis: From the Housing Bubble to a Worldwide Bank Rescue",
    [
      ["When Crypto Exchanges Offer U.S. Stocks: How RWAs and 100x Leverage Reach Wall Street", "NOV 12, 2026"],
      ["Growth Held Through Q3. Why Is the Market Repricing Risk in Q4?", "OCT 16, 2026"],
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

if (!/\.article-header h1\s*\{[^}]*font-size:\s*clamp\(2rem,\s*5vw,\s*3\.1rem\);/s.test(globalStyles)) {
  console.error("Article title sizing does not prevent orphaned final words.");
  process.exit(1);
}

if (!/\.hero-feature h2 a\s*\{[^}]*display:\s*block;[^}]*width:\s*100%;/s.test(globalStyles)) {
  console.error("Homepage feature title hover line does not span the full column width.");
  process.exit(1);
}

if (!zhHome.includes("2008 全球金融風暴：從房貸泡沫到全球銀行救援的完整歷史")) {
  console.error("Chinese homepage does not feature the new research.");
  process.exit(1);
}
if (!enHome.includes("The 2008 Global Financial Crisis: From the Housing Bubble to a Worldwide Bank Rescue")) {
  console.error("English homepage does not feature the new research.");
  process.exit(1);
}
if (
  !zhResearch.includes("2008 全球金融風暴：從房貸泡沫到全球銀行救援的完整歷史") ||
  !enResearch.includes("The 2008 Global Financial Crisis: From the Housing Bubble to a Worldwide Bank Rescue")
) {
  console.error("Research index is missing a translation of the new article.");
  process.exit(1);
}

if (
  !zhArticle.includes("單日大跌不是需求反轉的證明，卻是一場估值壓力測試。") ||
  !zhArticle.includes("成長仍在，但市場不再只為成長本身付錢。") ||
  !enArticle.includes("A one-day selloff does not prove that demand has reversed. It does, however, reveal how sensitive valuations have become.") ||
  !enArticle.includes("Growth remains intact, but the market is no longer paying for growth alone.")
) {
  console.error("A published article is incomplete.");
  process.exit(1);
}
if (zhArticle.includes('class="label-row"') || enArticle.includes('class="label-row"')) {
  console.error("Daily market labels are visible on a long-form research article.");
  process.exit(1);
}

for (const collection of ["briefs", "crossignal", "second-order", "deep-dives"]) {
  const publicFiles = filesUnder(`dist/${collection}`).concat(filesUnder(`dist/en/${collection}`));
  if (publicFiles.length > 0) {
    console.error(`Paused ${collection} routes are still public:\n` + publicFiles.join("\n"));
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
