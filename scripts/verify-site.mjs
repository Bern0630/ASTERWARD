import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "dist/index.html",
  "dist/en/index.html",
  "dist/briefs/2026-09-16/index.html",
  "dist/en/briefs/2026-09-16/index.html",
  "dist/briefs/2026-09-18/index.html",
  "dist/en/briefs/2026-09-18/index.html",
  "dist/briefs/2026-09-21/index.html",
  "dist/en/briefs/2026-09-21/index.html",
  "dist/briefs/2026-09-22/index.html",
  "dist/en/briefs/2026-09-22/index.html",
  "dist/briefs/2026-09-23/index.html",
  "dist/en/briefs/2026-09-23/index.html"
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error("Missing generated files:\\n" + missing.join("\\n"));
  process.exit(1);
}

const zhArticle = readFileSync("dist/briefs/2026-09-16/index.html", "utf8");
const enArticle = readFileSync("dist/en/briefs/2026-09-16/index.html", "utf8");
const zhHome = readFileSync("dist/index.html", "utf8");
const enHome = readFileSync("dist/en/index.html", "utf8");
const zhAbout = readFileSync("dist/about/index.html", "utf8");
const enAbout = readFileSync("dist/en/about/index.html", "utf8");
const siteData = readFileSync("src/data/site.ts", "utf8");

const countHomepageBriefs = (html) =>
  (html.match(/<article class="feature-brief/g) ?? []).length;

if (countHomepageBriefs(zhHome) !== 3 || countHomepageBriefs(enHome) !== 3) {
  console.error("Chinese and English homepages must each show the latest three briefs.");
  process.exit(1);
}

for (const retiredLabel of ["趨勢探索", "跨市場訊號", "二階效應", "深度研究", "Trend Explorer", "Crossignal", "Second Order", "Deep Dives"]) {
  if (zhHome.includes(retiredLabel) || enHome.includes(retiredLabel)) {
    console.error(`Homepage still exposes pending research: ${retiredLabel}`);
    process.exit(1);
  }
}

if (!siteData.includes('{ label: "每日簡報", href: "/briefs/" }') || !siteData.includes('{ label: "關於", href: "/about/" }')) {
  console.error("Chinese primary navigation does not contain the approved two destinations.");
  process.exit(1);
}

if (/趨勢探索|跨市場訊號|二階效應|深度研究/.test(siteData) || /Trend Explorer|Crossignal|Second Order|Deep Dives/.test(siteData)) {
  console.error("Primary navigation still exposes pending research categories.");
  process.exit(1);
}

if (zhAbout.includes("延伸研究範圍") || enAbout.includes("Additional coverage")) {
  console.error("About pages still describe the retired extended-market scope.");
  process.exit(1);
}

for (const path of [
  "dist/trends/2026-09-18-ai-leadership-under-tightening/index.html",
  "dist/crossignal/2026-09-18-yen-taiwan-flows/index.html",
  "dist/second-order/2026-09-18-cash-futures-hedge/index.html",
  "dist/deep-dives/2026-09-18-asia-ai-capital-structure/index.html",
]) {
  if (!existsSync(path)) {
    console.error(`Preserved research route is missing: ${path}`);
    process.exit(1);
  }
}

if (!/class="session-switcher"[^>]*role="tablist"[\s\S]*role="tab"[\s\S]*台股盤前[\s\S]*主要市場晚間更新[\s\S]*全球市場與研究/.test(zhArticle)) {
  console.error("Chinese Daily Brief is missing the three-session tab list.");
  process.exit(1);
}

if (!/class="session-switcher"[^>]*role="tablist"[\s\S]*role="tab"[\s\S]*Taiwan Pre-Market[\s\S]*Core Markets Evening Update[\s\S]*Global Markets and Research/.test(enArticle)) {
  console.error("English Daily Brief is missing the three-session tab list.");
  process.exit(1);
}

if (!/data-brief-tabs/.test(zhArticle) || !/data-session-panel="global"/.test(zhArticle)) {
  console.error("Daily Brief does not expose synchronized session metadata for tabs and contents.");
  process.exit(1);
}
const globalCss = readFileSync("src/styles/global.css", "utf8");
const header = readFileSync("src/components/Header.astro", "utf8");

if (!zhArticle.includes("/en/briefs/2026-09-16/")) {
  console.error("Chinese article does not link to its English translation.");
  process.exit(1);
}

if (!enArticle.includes("/briefs/2026-09-16/")) {
  console.error("English article does not link back to its Chinese translation.");
  process.exit(1);
}

if (!/\.editorial-grid \.research-column\s*\{[^}]*display:\s*grid;[^}]*grid-template-rows:\s*auto 1fr;/s.test(globalCss)) {
  console.error("Homepage research columns do not stretch their content lists to equal height.");
  process.exit(1);
}

if (!/\.editorial-grid \.content-item\s*\{[^}]*grid-template-rows:\s*auto auto 1fr auto;/s.test(globalCss)) {
  console.error("Homepage research-card tags are not anchored to a shared bottom edge.");
  process.exit(1);
}

if (!/\.article-body strong\s*\{[^}]*font-weight:\s*800;[^}]*box-shadow:\s*inset 0 -0\.28em 0 var\(--accent-soft\);/s.test(globalCss)) {
  console.error("Article emphasis does not use the approved editorial highlight treatment.");
  process.exit(1);
}

if (!/\.article-body table\s*\{[^}]*display:\s*table;[^}]*table-layout:\s*fixed;[^}]*overflow:\s*visible;[^}]*white-space:\s*normal;/s.test(globalCss)) {
  console.error("Article tables are not constrained to the article width without horizontal scrolling.");
  process.exit(1);
}

if (!/\.article-body th,[\s\S]*?\.article-body td\s*\{[^}]*overflow-wrap:\s*anywhere;/s.test(globalCss)) {
  console.error("Article table cells do not wrap long content.");
  process.exit(1);
}

if (!/\.article-body h2\s*\{[^}]*border-top:\s*1px solid var\(--border-strong\);/s.test(globalCss)) {
  console.error("Article section headings do not have a strong section divider.");
  process.exit(1);
}

if (!/\.article-body h3\s*\{[^}]*border-bottom:\s*1px solid var\(--border\);[^}]*color:\s*var\(--text\);/s.test(globalCss)) {
  console.error("Article subsection headings do not use the neutral editorial hierarchy.");
  process.exit(1);
}

if (!/:is\(\.text-link, \.content-item h3 a, \.feature-brief h3 a\)::after\s*\{[^}]*transform:\s*scaleX\(0\);/s.test(globalCss)) {
  console.error("Editorial links do not share a center-out underline foundation.");
  process.exit(1);
}

if (!/\.brief-grid \.feature-brief h3 a\s*\{[^}]*display:\s*block;[^}]*width:\s*100%;/s.test(globalCss)) {
  console.error("Homepage brief-title hover line does not span the full title column.");
  process.exit(1);
}

if (!/:is\(\.text-link, \.content-item h3 a, \.feature-brief h3 a\):(?:hover|focus-visible)::after[^}]*transform:\s*scaleX\(1\);/s.test(globalCss)) {
  console.error("Editorial links do not share the same center-out hover treatment.");
  process.exit(1);
}

if (header.includes("brand-kicker") || header.includes("SITE_COPY")) {
  console.error("Header brand still includes the secondary market-intelligence line.");
  process.exit(1);
}

if (!header.includes("brandLetters.map") || !header.includes('class="brand-letter"')) {
  console.error("SECURRENT brand is not split into letters for the current-wave interaction.");
  process.exit(1);
}

if (!/\.brand:(?:hover|focus-visible)::after[^}]*transform:\s*scaleX\(1\);/s.test(globalCss)) {
  console.error("Brand home link does not reveal its center-out current line.");
  process.exit(1);
}

if (!/@keyframes brand-current-wave[\s\S]*?translateY\(-3px\)/.test(globalCss)) {
  console.error("Brand letters do not use the approved current-wave motion.");
  process.exit(1);
}

if (!/\.article-header > \.article-summary\s*\{[^}]*margin-top:\s*20px;/s.test(globalCss)) {
  console.error("Article title and summary spacing is not defined.");
  process.exit(1);
}

if (!/\.article-header > \.tags\s*\{[^}]*margin-top:\s*16px;/s.test(globalCss)) {
  console.error("Article summary and topic-tag spacing is not defined.");
  process.exit(1);
}

if (!/\.article-header > \.label-row\s*\{[^}]*margin-top:\s*28px;/s.test(globalCss)) {
  console.error("Topic tags and research-label spacing is not defined.");
  process.exit(1);
}

if (!header.includes('class="hamburger-line"') || header.includes('>Menu</summary>')) {
  console.error("Mobile navigation does not use a real hamburger icon.");
  process.exit(1);
}

if (!/\.mobile-nav summary\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s.test(globalCss)) {
  console.error("Mobile navigation control does not have a stable 44px target.");
  process.exit(1);
}

if (!/\.mobile-nav\[open\] \.hamburger-line:first-of-type\s*\{[^}]*transform:\s*translateY\([^)]*\) rotate\(45deg\);/s.test(globalCss)) {
  console.error("Hamburger icon does not morph into a close icon.");
  process.exit(1);
}

if (!/\.mobile-nav-panel\s*\{[^}]*background:\s*var\(--surface\);/s.test(globalCss)) {
  console.error("Mobile navigation panel is not opaque enough to separate it from page content.");
  process.exit(1);
}

if (!/\.mobile-nav\[open\] \.mobile-nav-panel\s*\{[^}]*opacity:\s*1;[^}]*transform:\s*translateY\(0\) scale\(1\);/s.test(globalCss)) {
  console.error("Mobile navigation panel does not animate into place.");
  process.exit(1);
}

const zhFallbackArticle = readFileSync("dist/briefs/2026-09-18/index.html", "utf8");
const enFallbackArticle = readFileSync("dist/en/briefs/2026-09-18/index.html", "utf8");
const zhCurrentArticle = readFileSync("dist/briefs/2026-09-21/index.html", "utf8");
const enCurrentArticle = readFileSync("dist/en/briefs/2026-09-21/index.html", "utf8");
const zhLatestArticle = readFileSync("dist/briefs/2026-09-23/index.html", "utf8");
const enLatestArticle = readFileSync("dist/en/briefs/2026-09-23/index.html", "utf8");
const articleLayout = readFileSync("src/layouts/ArticleLayout.astro", "utf8");
const countTabs = (html) => (html.match(/<button[^>]*role="tab"/g) ?? []).length;

if (!/class="session-switcher"[^>]*role="tablist"[\s\S]*台股盤前[\s\S]*主要市場晚間更新[\s\S]*全球市場與研究/.test(zhFallbackArticle)) {
  console.error("Chinese 9/18 brief does not use the fallback three-session tabs.");
  process.exit(1);
}

if (!/class="session-switcher"[^>]*role="tablist"[\s\S]*Taiwan Pre-Market[\s\S]*Core Markets Evening Update[\s\S]*Global Markets and Research/.test(enFallbackArticle)) {
  console.error("English 9/18 brief does not use the fallback three-session tabs.");
  process.exit(1);
}

if (!/class="session-switcher"[^>]*role="tablist"[\s\S]*台股盤前[\s\S]*主要市場晚間更新[\s\S]*全球市場與研究/.test(zhCurrentArticle)) {
  console.error("Chinese 9/21 brief does not expose the three-session tabs.");
  process.exit(1);
}

if (!/class="session-switcher"[^>]*role="tablist"[\s\S]*Taiwan Pre-Market[\s\S]*Core Markets Evening Update[\s\S]*Global Markets and Research/.test(enCurrentArticle)) {
  console.error("English 9/21 brief does not expose the three-session tabs.");
  process.exit(1);
}

for (const heading of ["台灣市場", "馬來西亞市場", "美國市場"]) {
  if (!zhCurrentArticle.includes(heading)) {
    console.error(`Chinese 9/21 brief is missing the core-market section: ${heading}`);
    process.exit(1);
  }
}

for (const heading of ["Taiwan Market", "Malaysia Market", "United States Market"]) {
  if (!enCurrentArticle.includes(heading)) {
    console.error(`English 9/21 brief is missing the core-market section: ${heading}`);
    process.exit(1);
  }
}

if (!zhCurrentArticle.includes("/en/briefs/2026-09-21/") || !enCurrentArticle.includes("/briefs/2026-09-21/")) {
  console.error("September 21 brief does not preserve reciprocal language navigation.");
  process.exit(1);
}

if (!zhLatestArticle.includes("/en/briefs/2026-09-23/") || !enLatestArticle.includes("/briefs/2026-09-23/")) {
  console.error("September 23 brief does not preserve reciprocal language navigation.");
  process.exit(1);
}

if (countTabs(zhLatestArticle) !== 2 || !zhLatestArticle.includes("早間市場推演") || !zhLatestArticle.includes("晚間市場推演")) {
  console.error("September 23 Chinese brief does not expose two three-market tabs.");
  process.exit(1);
}

if (countTabs(enLatestArticle) !== 2 || !enLatestArticle.includes("Morning Market Outlook") || !enLatestArticle.includes("Evening Market Outlook")) {
  console.error("September 23 English brief does not expose two three-market tabs.");
  process.exit(1);
}

if (zhLatestArticle.includes('data-session-key="global"') || enLatestArticle.includes('data-session-key="global"')) {
  console.error("September 23 brief still exposes the retired global tab.");
  process.exit(1);
}

if (!/data-tab-count="2"/.test(zhLatestArticle) || !/data-tab-count="2"/.test(enLatestArticle)) {
  console.error("September 23 switcher does not declare two tabs.");
  process.exit(1);
}

if (!/aria-controls="brief-panel-morning"/.test(zhLatestArticle) || !/aria-controls="brief-panel-evening"/.test(zhLatestArticle)) {
  console.error("September 23 tab ARIA controls are incomplete.");
  process.exit(1);
}

for (const heading of ["台灣市場", "馬來西亞市場", "美國盤前與今夜推演", "盤前判斷回顧"]) {
  if (!zhLatestArticle.includes(heading)) {
    console.error(`Chinese 9/23 brief is missing the completed evening section: ${heading}`);
    process.exit(1);
  }
}

for (const heading of ["Taiwan Market", "Malaysia Market", "US Pre-Market and Tonight’s Outlook", "Pre-Market Scorecard"]) {
  if (!enLatestArticle.includes(heading)) {
    console.error(`English 9/23 brief is missing the completed evening section: ${heading}`);
    process.exit(1);
  }
}

for (const heading of ["台灣市場", "馬來西亞市場", "美國盤前與今夜推演"]) {
  const pattern = new RegExp(`data-session-panel="evening"[\\s\\S]*?href="#${heading}"`);
  if (!pattern.test(zhLatestArticle)) {
    console.error(`Chinese 9/23 contents do not assign ${heading} to the evening panel.`);
    process.exit(1);
  }
}

const thesisIndex = zhLatestArticle.indexOf("主論點");
const morningHeadingIndex = zhLatestArticle.indexOf('<h2 id="早間市場推演"');
if (thesisIndex < 0 || morningHeadingIndex < 0 || thesisIndex >= morningHeadingIndex) {
  console.error("September 23 overview does not remain before the first panel boundary.");
  process.exit(1);
}

const invalidationIds = [...zhLatestArticle.matchAll(/id="失效條件(?:-\d+)?"/g)].map((match) => match[0]);
if (new Set(invalidationIds).size !== 2) {
  console.error("Morning and evening invalidation headings do not have distinct IDs.");
  process.exit(1);
}

if (existsSync("templates/weekend-brief.md")) {
  console.error("Weekend brief template must not exist because SECURRENT does not publish on weekends.");
  process.exit(1);
}

const contentConfig = readFileSync("src/content/config.ts", "utf8");
const contentPrompt = readFileSync("docs/GPT_CONTENT_PROMPT.md", "utf8");

if (/edition:\s*z\.enum\(\[[^\]]*["']weekend["']/s.test(contentConfig)) {
  console.error("Brief content schema still accepts the retired weekend edition.");
  process.exit(1);
}

if (!contentPrompt.includes("週六、週日不建立、不更新任何文章")) {
  console.error("Content prompt does not explicitly prohibit weekend publishing.");
  process.exit(1);
}

if (!articleLayout.includes("\"trading-day\"") || !articleLayout.includes("edition === \"trading-day\"")) {
  console.error("Article layout does not guard session tabs with the brief edition.");
  process.exit(1);
}

console.log("Bilingual site output verified.");
