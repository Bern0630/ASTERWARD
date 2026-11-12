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
  "src/data/site.ts",
  "src/components/Header.astro",
  "src/layouts/BaseLayout.astro",
  "src/styles/global.css",
  "public/brand/asterward-icon.png",
  "OLD_VERSION/README.md",
  ...previousArticleSlugs.flatMap((slug) => [
    `dist/trends/${slug}/index.html`,
    `dist/en/trends/${slug}/index.html`
  ])
];

export function verifyGeneratedSite(rootDir) {
  const failures = [];
  const absolute = (path) => join(rootDir, path);
  const exists = (path) => existsSync(absolute(path));
  const read = (path) => exists(path) ? readFileSync(absolute(path), "utf8") : undefined;
  const fail = (name, message) => failures.push(`${name}: ${message}`);

  const filesUnder = (relativeRoot) => {
    const root = absolute(relativeRoot);
    if (!existsSync(root)) return [];
    return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
      const relativePath = join(relativeRoot, entry.name);
      return entry.isDirectory() ? filesUnder(relativePath) : [relativePath];
    });
  };

  const missing = requiredFiles.filter((file) => !exists(file));
  if (missing.length > 0) fail("required-files", `missing required files:\n${missing.join("\n")}`);

  const chineseArticleFiles = filesUnder("src/content/trends")
    .filter((path) => path.endsWith(".md") && !path.split(/[\\/]/).includes("en"));
  for (const sourcePath of chineseArticleFiles) {
    const slug = sourcePath.split(/[\\/]/).at(-1).replace(/\.md$/, "");
    const html = read(`dist/trends/${slug}/index.html`);
    if (html === undefined) continue;
    const hasEnglishSource = exists(`src/content/trends/en/${slug}.md`);
    const hasEnglishLink = html.includes(`/en/trends/${slug}/`);
    if (hasEnglishSource !== hasEnglishLink) {
      fail("language-switch", `${slug} translation source=${hasEnglishSource}, generated link=${hasEnglishLink}`);
    }
  }

  const zhHome = read("dist/index.html");
  const enHome = read("dist/en/index.html");
  const zhResearch = read("dist/trends/index.html");
  const enResearch = read("dist/en/trends/index.html");
  const zhArticle = read(`dist/trends/${articleSlug}/index.html`);
  const enArticle = read(`dist/en/trends/${articleSlug}/index.html`);
  const siteData = read("src/data/site.ts");
  const header = read("src/components/Header.astro");
  const baseLayout = read("src/layouts/BaseLayout.astro");
  const globalStyles = read("src/styles/global.css");

  for (const [lang, home, latestTitle, previousArticles] of [
    ["zh", zhHome, "當加密交易所也能買美股：RWA、百倍槓桿如何牽動華爾街？", [
      ["2008 全球金融風暴：從房貸泡沫到全球銀行救援的完整歷史", "NOV 08, 2026"],
      ["前三季成長仍在，第四季市場為什麼開始重估風險？", "OCT 16, 2026"]
    ]],
    ["en", enHome, "When Crypto Exchanges Offer U.S. Stocks: How RWAs and 100x Leverage Reach Wall Street", [
      ["The 2008 Global Financial Crisis: From the Housing Bubble to a Worldwide Bank Rescue", "NOV 08, 2026"],
      ["Growth Held Through Q3. Why Is the Market Repricing Risk in Q4?", "OCT 16, 2026"]
    ]]
  ]) {
    if (home === undefined) continue;
    if (!home.includes("ASTERWARD") || home.includes("SECURRENT")) fail(`homepage-${lang}-brand`, "brand is invalid");
    const heroCount = (home.match(/<article class="hero-feature/g) ?? []).length;
    if (heroCount !== 1) fail(`homepage-${lang}-hero`, `expected 1 hero feature, found ${heroCount}`);
    const previousCount = (home.match(/<article class="feature-brief/g) ?? []).length;
    if (previousCount !== 2) fail(`homepage-${lang}-previous-count`, `expected 2 previous cards, found ${previousCount}`);
    const previousCards = Array.from(home.matchAll(/<article class="feature-brief">([\s\S]*?)<\/article>/g))
      .map((match) => match[1]).join("\n");
    const missingPrevious = previousArticles
      .filter(([title, date]) => !previousCards.includes(title) || !previousCards.includes(date))
      .map(([title, date]) => `${title} (${date})`);
    if (previousCards.includes(latestTitle) || missingPrevious.length > 0) {
      fail(`homepage-${lang}-ordering`, `latest in previous=${previousCards.includes(latestTitle)}; missing=${missingPrevious.join(" | ") || "none"}`);
    }
    if (!home.includes('class="hero-intro"')) fail(`homepage-${lang}-intro`, "editorial hero introduction is missing");
    if (!home.includes("fonts.googleapis.com/css2?family=Noto+Sans+TC")) fail(`homepage-${lang}-font`, "Noto Sans TC link is missing");
  }

  if (globalStyles !== undefined) {
    if (!/font-family:\s*"Noto Sans TC"/.test(globalStyles) || globalStyles.includes('"Noto Serif TC"')) fail("typography", "site typography is not consistently based on Noto Sans TC");
    if (!/\.article-header h1\s*\{[^}]*font-size:\s*clamp\(2rem,\s*5vw,\s*3\.1rem\);/s.test(globalStyles)) fail("article-title-size", "article title sizing does not prevent orphaned final words");
    if (!/\.hero-feature h2 a\s*\{[^}]*display:\s*block;[^}]*width:\s*100%;/s.test(globalStyles)) fail("homepage-hover-line", "feature title hover line does not span the full column width");
  }

  if (zhHome !== undefined && !zhHome.includes("當加密交易所也能買美股：RWA、百倍槓桿如何牽動華爾街？")) fail("homepage-zh-feature", "latest research title is missing");
  if (enHome !== undefined && !enHome.includes("When Crypto Exchanges Offer U.S. Stocks: How RWAs and 100x Leverage Reach Wall Street")) fail("homepage-en-feature", "latest research title is missing");
  if (zhResearch !== undefined && !zhResearch.includes("2008 全球金融風暴：從房貸泡沫到全球銀行救援的完整歷史")) fail("research-index-zh", "new research title is missing");
  if (enResearch !== undefined && !enResearch.includes("The 2008 Global Financial Crisis: From the Housing Bubble to a Worldwide Bank Rescue")) fail("research-index-en", "new research title is missing");

  if (zhArticle !== undefined) {
    if (!zhArticle.includes("單日大跌不是需求反轉的證明，卻是一場估值壓力測試。") || !zhArticle.includes("成長仍在，但市場不再只為成長本身付錢。")) fail("article-zh-content", `${articleSlug} is incomplete`);
    if (zhArticle.includes('class="label-row"')) fail("article-zh-labels", "daily market labels are visible on long-form research");
  }
  if (enArticle !== undefined) {
    if (!enArticle.includes("A one-day selloff does not prove that demand has reversed. It does, however, reveal how sensitive valuations have become.") || !enArticle.includes("Growth remains intact, but growth alone is no longer enough to support every valuation.")) fail("article-en-content", `${articleSlug} is incomplete`);
    if (enArticle.includes('class="label-row"')) fail("article-en-labels", "daily market labels are visible on long-form research");
  }

  for (const collection of ["briefs", "crossignal", "second-order", "deep-dives"]) {
    const publicFiles = filesUnder(`dist/${collection}`).concat(filesUnder(`dist/en/${collection}`));
    if (publicFiles.length > 0) fail(`paused-${collection}`, `routes are still public:\n${publicFiles.join("\n")}`);
  }

  const archiveFiles = filesUnder("OLD_VERSION/src/content").filter((path) => path.endsWith(".md"));
  if (!exists("OLD_VERSION/README.md") || archiveFiles.length === 0) fail("archive", `README exists=${exists("OLD_VERSION/README.md")}; markdown files=${archiveFiles.length}`);
  if (siteData !== undefined && (!siteData.includes('{ label: "研究", href: "/trends/" }') || !siteData.includes('{ label: "Research", href: "/trends/" }'))) fail("navigation", "primary navigation does not point to the research index");
  if (header !== undefined && (!header.includes('class="brand-logo"') || !header.includes('class="brand-name"'))) fail("header-brand", "ASTERWARD header branding is incomplete");
  if (baseLayout !== undefined && (!baseLayout.includes("/brand/asterward-icon.png") || !exists("public/brand/asterward-icon.png"))) fail("brand-icon", "ASTERWARD brand icon is missing");

  return failures;
}
