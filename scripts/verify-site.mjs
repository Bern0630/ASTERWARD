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

if (!/class="session-switcher"[^>]*role="tablist"[\s\S]*role="tab"[\s\S]*台股盤前[\s\S]*台股盤後・美股盤前[\s\S]*全球市場與研究/.test(zhArticle)) {
  console.error("Chinese Daily Brief is missing the three-session tab list.");
  process.exit(1);
}

if (!/class="session-switcher"[^>]*role="tablist"[\s\S]*role="tab"[\s\S]*Taiwan Pre-Market[\s\S]*Taiwan Post-Market and US Pre-Market[\s\S]*Global Markets and Research/.test(enArticle)) {
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

console.log("Bilingual site output verified.");
