# SECURRENT Three-Market Daily Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace SECURRENT's current global research-heavy daily flow with one bilingual, two-update daily product focused only on the United States, Taiwan, and Malaysia.

**Architecture:** Add an explicit `briefFormat` discriminator so new two-panel briefs coexist with untouched legacy three-panel articles. Make the Chinese article the researched source of truth, translate it faithfully to English, keep complete source ledgers outside the public content collections, and update the existing paused heartbeat only after all static verification passes.

**Tech Stack:** Astro 5 Content Collections, TypeScript, Astro components, Markdown, CSS, Node.js verification scripts, Codex heartbeat automation.

**Spec:** `docs/superpowers/specs/2026-09-22-three-market-daily-intelligence-design.md`

## Global Constraints

- Work only in `/Users/bernardc/Desktop/SECURRENT`; do not create another project copy.
- Public coverage is limited to the United States, Taiwan, and Malaysia.
- Weekday publishing uses one bilingual article and one URL per language, updated at 08:10 and 21:10 Asia/Taipei.
- The Chinese article contains 2,000-3,000 Han characters, with morning approximately 40% and evening approximately 60%.
- Each article has one primary thesis and no more than two secondary signals.
- Each scheduled run uses no more than three search batches, eight effective sources, and one retry for a failed datum.
- English is a faithful translation of finalized Chinese content and does not trigger a second research pass.
- Existing research articles and legacy daily URLs remain available, but research categories disappear from the homepage and main navigation.
- Do not start a development or preview server, deploy, commit, push, or rewrite daily articles before 2026-09-22.
- Use `apply_patch` for every manual file edit.

## Review Focus

- A legacy brief without `briefFormat` must still render three tabs and keep its global panel.
- A `three-market-v1` brief with only two H2 boundaries must create exactly two accessible tabpanels and keep overview content outside both panels.
- Duplicate H3 labels such as two `失效條件` headings must receive distinct Astro slugs while remaining in the correct tab.
- A weekday where one market is closed must explicitly show the closure and must not reuse stale data as current-day data.
- Hiding research categories from navigation and the homepage must not remove their routes, content collections, or direct URLs.

---

### Task 1: Establish the new editorial contract and migrate the 2026-09-22 brief

**Files:**
- Modify: `scripts/verify-editorial.mjs`
- Modify: `src/content/config.ts`
- Modify: `src/content/briefs/2026-09-22.md`
- Modify: `src/content/briefs/en/2026-09-22.md`
- Create: `research-notes/2026-09-22.md`

**Interfaces:**
- Consumes: Existing paired-content verification and the factual corpus already present in the 2026-09-22 Chinese and English briefs.
- Produces: `briefFormat: "three-market-v1"`; legacy default `briefFormat: "legacy-three-panel"`; two-section bilingual content accepted by the editorial verifier.

- [ ] **Step 1: Replace the 9/22 legacy expectations with failing three-market contract checks**

Keep dates through 2026-09-21 in the legacy loop. Validate 2026-09-22 separately with helpers equivalent to:

```js
const bodyWithoutFrontmatter = (content) => content.replace(/^---[\s\S]*?---\s*/, "");
const h2s = (content) => [...content.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
const hanCount = (content) => (bodyWithoutFrontmatter(content).match(/\p{Script=Han}/gu) ?? []).length;
const sectionBetween = (content, start, end) => {
  const startIndex = content.indexOf(`## ${start}`);
  const endIndex = end ? content.indexOf(`## ${end}`, startIndex) : content.length;
  return content.slice(startIndex, endIndex);
};

const threeMarketHeadings = {
  zh: ["早間市場推演", "晚間市場推演"],
  en: ["Morning Market Outlook", "Evening Market Outlook"],
};

if (!currentZh.includes('briefFormat: "three-market-v1"')) fail("9/22 Chinese brief needs three-market-v1");
if (!currentEn.includes('briefFormat: "three-market-v1"')) fail("9/22 English brief needs three-market-v1");
if (JSON.stringify(h2s(currentZh)) !== JSON.stringify(threeMarketHeadings.zh)) fail("9/22 Chinese brief must have exactly two H2 panels");
if (JSON.stringify(h2s(currentEn)) !== JSON.stringify(threeMarketHeadings.en)) fail("9/22 English brief must have exactly two H2 panels");
```

Also require:

```js
for (const heading of ["### 盤前判斷回顧", "### 台灣市場", "### 馬來西亞市場", "### 美國盤前與今夜推演"]) {
  if (!currentZh.includes(heading)) fail(`9/22 Chinese brief is missing ${heading}`);
}
for (const heading of ["### Pre-Market Scorecard", "### Taiwan Market", "### Malaysia Market", "### US Pre-Market and Session Outlook"]) {
  if (!currentEn.includes(heading)) fail(`9/22 English brief is missing ${heading}`);
}
for (const retired of ["全球市場與研究", "全球跨市場傳導", "今日五大市場風險", "未來七天重要事件", "市場可能尚未充分注意的情報", "延伸研究"]) {
  if (currentZh.includes(retired)) fail(`Retired 9/22 section remains: ${retired}`);
}
if (hanCount(currentZh) < 2000 || hanCount(currentZh) > 3000) fail("9/22 Chinese brief must contain 2,000-3,000 Han characters");
```

Count one `**主論點：**`, no more than two `**次要訊號` labels, and the matching English labels. Check each morning/evening `### 核心資料來源` or `### Core Sources` block has at most eight Markdown list items. Check the morning Han-character share is between 35% and 45% of the two panels combined. Preserve translation-key and no-Chinese-in-English checks.

- [ ] **Step 2: Run the verifier and record the expected failure**

Run:

```bash
node scripts/verify-editorial.mjs
```

Expected: non-zero exit identifying the missing `three-market-v1` format or the old three-panel 9/22 structure.

- [ ] **Step 3: Add the backward-compatible schema discriminator**

Extend the briefs schema in `src/content/config.ts`:

```ts
const briefs = defineCollection({
  type: "content",
  schema: baseSchema.extend({
    type: z.literal("daily"),
    edition: z.enum(["trading-day", "market-closed"]).default("trading-day"),
    briefFormat: z.enum(["legacy-three-panel", "three-market-v1"]).default("legacy-three-panel")
  })
});
```

Do not add `briefFormat` to older Markdown files; their schema default is the compatibility contract.

- [ ] **Step 4: Rewrite the Chinese 9/22 brief to the approved format**

Use this exact outer structure:

```md
---
title: "三市場情報：台股高檔換手，馬股反彈，美股等待利率與油價確認"
date: 2026-09-22
type: "daily"
edition: "trading-day"
briefFormat: "three-market-v1"
summary: "台股現貨買盤與期貨避險並存，馬股價格、廣度與成交同步改善；美股開盤前則由油價與長債殖利率回落提供估值支撐。"
tags:
  - 美國
  - 台灣
  - 馬來西亞
  - 籌碼
  - 利率
lang: "zh"
translationKey: "brief-2026-09-22"
---

**主論點：** ...

**次要訊號一：** ...

**次要訊號二：** ...

| 市場 | 目前狀態 | 核心證據 | 下一門檻 |
| --- | --- | --- | --- |
| 台灣 | ... | ... | ... |
| 馬來西亞 | ... | ... | ... |
| 美國 | ... | ... | ... |

## 早間市場推演
### 美國前一交易日
### 台灣前一交易日
### 今日台股推演
### 今日美股盤前推演
### 失效條件
### 核心資料來源

## 晚間市場推演
### 盤前判斷回顧
### 台灣市場
### 馬來西亞市場
### 美國盤前與今夜推演
### 失效條件
### 核心資料來源
```

Retain only the already sourced figures needed to support the thesis: prior US close and semiconductor breadth; Taiwan cash, futures, options, margin and lending; Taiwan 9/22 close and flows; FBM KLCI, breadth, ringgit and MGS auction; US pre-market futures, Treasury yield and oil. Do not repeat the former China-US and Middle East sections; mention those facts only inside a core-market paragraph when they directly alter the stated inference.

- [ ] **Step 5: Create the internal 9/22 source ledger**

Create `research-notes/2026-09-22.md` with two sections, each containing no more than eight effective sources:

```md
# 2026-09-22 Research Ledger

## Morning Run

| Source | Market | Claim supported | Status |
| --- | --- | --- | --- |
| U.S. Treasury Daily Treasury Par Yield Curve Rates | US | 2Y, 10Y and 30Y closing yields | Official |
| Taiwan Stock Exchange market statistics | Taiwan | Index, turnover and institutional cash flow | Official |
| Taiwan Futures Exchange institutional positions | Taiwan | Foreign index-futures position and put/call ratios | Official |
| TWSE margin trading report | Taiwan | Margin financing and short balances | Official |
| TWSE securities lending report | Taiwan | Securities-borrowing and short-sale balance | Official |
| Associated Press US market close | US | Major-index and sector close | Secondary |
| Reuters market close | US | Semiconductor and breadth context | Secondary |

## Evening Run

| Source | Market | Claim supported | Status |
| --- | --- | --- | --- |
| Taiwan Stock Exchange market statistics | Taiwan | 9/22 close, breadth and institutional flow | Official |
| Taiwan Futures Exchange institutional positions | Taiwan | 9/22 futures and options positioning | Official |
| Ministry of Economic Affairs export orders | Taiwan | August export orders | Official |
| DGBAS employment statistics | Taiwan | August unemployment | Official |
| Bernama Bursa close | Malaysia | KLCI close, breadth and turnover | Secondary |
| Bernama KLCI futures close | Malaysia | Futures basis and open interest | Secondary |
| Bank Negara Malaysia auction result | Malaysia | Seven-year MGS auction | Official |
| Associated Press US pre-market | US | Futures, oil and yield setup | Secondary |

## Excluded Material

- Duplicate confirmations of an official number were not used.
- Global background without a direct effect on the three-market thesis was excluded from publication.
```

Add the exact URLs already present in the old article beneath the corresponding source names. The ledger is not added to `src/content/config.ts` and receives no public route.

- [ ] **Step 6: Rewrite English as a faithful translation**

Mirror the Chinese order and evidence using these exact structural labels:

```md
**Primary thesis:** ...
**Secondary signal 1:** ...
**Secondary signal 2:** ...

## Morning Market Outlook
### Previous US Session
### Previous Taiwan Session
### Taiwan Session Outlook
### US Pre-Market Outlook
### Invalidation Conditions
### Core Sources

## Evening Market Outlook
### Pre-Market Scorecard
### Taiwan Market
### Malaysia Market
### US Pre-Market and Session Outlook
### Invalidation Conditions
### Core Sources
```

Keep every figure, conclusion, bold emphasis and invalidation condition aligned with the Chinese version. Do not introduce a source or claim absent from Chinese.

- [ ] **Step 7: Run the editorial contract to green**

Run:

```bash
node scripts/verify-editorial.mjs
```

Expected: `Editorial content verified.`

Review gate: inspect `git diff -- src/content/config.ts scripts/verify-editorial.mjs src/content/briefs/2026-09-22.md src/content/briefs/en/2026-09-22.md research-notes/2026-09-22.md` and confirm no older article changed.

---

### Task 2: Render two-tab briefs while preserving legacy three-tab articles

**Files:**
- Modify: `scripts/verify-site.mjs`
- Modify: `src/pages/briefs/[slug].astro`
- Modify: `src/pages/en/briefs/[slug].astro`
- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `entry.data.briefFormat` from Task 1.
- Produces: `ArticleLayout` prop `briefFormat?: "legacy-three-panel" | "three-market-v1"`; dynamic two- or three-tab rendering; `data-tab-count` styling hook.

- [ ] **Step 1: Change site verification to require new and legacy tab modes**

Update 9/22 assertions to require exactly two labels and no global tab:

```js
const countTabs = (html) => (html.match(/role="tab"/g) ?? []).length;
if (countTabs(zhLatestArticle) !== 2 || !zhLatestArticle.includes("早間市場推演") || !zhLatestArticle.includes("晚間市場推演")) {
  console.error("September 22 Chinese brief does not expose two three-market tabs.");
  process.exit(1);
}
if (zhLatestArticle.includes('data-session-key="global"')) {
  console.error("September 22 Chinese brief still exposes the retired global tab.");
  process.exit(1);
}
```

Add equivalent English checks. Keep the 9/21 checks requiring three tabs and a global session. Require the 9/22 overview table text to appear before the first `role="tabpanel"`, and require `data-session-panel="evening"` on Taiwan, Malaysia and US TOC entries.

Pin duplicate H3 slug handling as well:

```js
const invalidationIds = [...zhLatestArticle.matchAll(/id="失效條件(?:-\d+)?"/g)].map((match) => match[0]);
if (new Set(invalidationIds).size !== 2) {
  console.error("Morning and evening invalidation headings do not have distinct IDs.");
  process.exit(1);
}
```

- [ ] **Step 2: Build and confirm the new site test fails**

Run:

```bash
npm run build
npm run verify
```

Expected: build succeeds, while `npm run verify` fails because `ArticleLayout` still requires the old three-panel structure.

- [ ] **Step 3: Pass the format discriminator through both language routes**

Add to each `ArticleLayout` call:

```astro
briefFormat={entry.data.briefFormat}
```

- [ ] **Step 4: Generalize `ArticleLayout` tab definitions and panel mapping**

Add the prop type:

```ts
briefFormat?: "legacy-three-panel" | "three-market-v1";
```

Build tab definitions from the format. `three-market-v1` uses keys `morning` and `evening`; legacy uses `pre`, `post`, `global`. Set `hasBriefTabs` only when `edition === "trading-day"` and every required heading exists.

Replace the fixed three-index panel assignment with ordered boundaries:

```ts
const tabStarts = briefTabs.map((tab) => ({
  key: tab.key,
  index: headingIndexes.get(tab.slug) ?? -1,
}));
const tocEntries = toc.map((heading) => {
  const index = headingIndexes.get(heading.slug) ?? -1;
  const owner = [...tabStarts].reverse().find((start) => index >= start.index);
  return { ...heading, panel: owner?.key };
});
```

Render `data-tab-count={briefTabs.length}` on `.session-switcher`. In the inline script, replace `tabs.length !== 3` with `tabs.length < 2`, build boundaries and panels from all tabs, and default to `tabs[0].dataset.sessionKey` instead of the literal `pre`. Preserve hash activation, keyboard arrows, Home/End and synchronized TOC filtering.

Overview nodes before the first tab boundary must remain direct children of `.article-body`; only nodes from the first H2 onward move into tabpanels.

- [ ] **Step 5: Make tab sizing dynamic and restore visible emphasis**

Use a CSS custom property for desktop and a two-column mobile override for new briefs:

```css
.session-switcher {
  --session-tab-count: 3;
  grid-template-columns: repeat(var(--session-tab-count), minmax(0, 1fr));
}

.session-switcher[data-tab-count="2"] {
  --session-tab-count: 2;
}

@media (max-width: 759px) {
  .session-switcher[data-tab-count="2"] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

Remove `display: none` from `.article-body strong`; retain the existing font weight and inset highlight. Apply the stronger internal market divider to both legacy `post` and new `evening` panels:

```css
.brief-session-panel:is([data-session-key="post"], [data-session-key="evening"]) > h2:not(:first-child) { ... }
```

- [ ] **Step 6: Build and verify both modes**

Run:

```bash
npm run build
npm run verify
```

Expected: build reports zero Astro errors; verifier confirms 9/22 has two tabs and 9/21 retains three.

Review gate: inspect generated `dist/briefs/2026-09-22/index.html` and `dist/briefs/2026-09-21/index.html` with `rg -n 'role="tab"|data-session-key|data-session-panel'`.

---

### Task 3: Reduce public navigation and homepage to the three-market daily product

**Files:**
- Modify: `scripts/verify-site.mjs`
- Modify: `src/data/site.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/briefs/index.astro`
- Modify: `src/pages/en/briefs/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/en/about.astro`

**Interfaces:**
- Consumes: Existing `NAV_ITEMS`, `SITE`, `SITE_COPY`, brief collection and preserved research routes.
- Produces: Two-item bilingual navigation, daily-brief-only homepage, three-market product copy.

- [ ] **Step 1: Add failing navigation and homepage assertions**

In `scripts/verify-site.mjs`, load `dist/index.html`, `dist/en/index.html`, and source `src/data/site.ts`. Require:

```js
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
```

Also assert that generated legacy research files such as `dist/trends/2026-09-18-ai-leadership-under-tightening/index.html` still exist. Load both generated About pages and fail if they still expose `延伸研究範圍`, `Additional coverage`, or a fourth geographic market.

- [ ] **Step 2: Run the verifier and confirm it fails on current exposure**

Run:

```bash
npm run verify
```

Expected: failure naming a pending research label on the homepage or in `NAV_ITEMS`.

- [ ] **Step 3: Reduce `NAV_ITEMS` without deleting routes**

Use exactly:

```ts
export const NAV_ITEMS = {
  zh: [
    { label: "每日簡報", href: "/briefs/" },
    { label: "關於", href: "/about/" }
  ],
  en: [
    { label: "Briefs", href: "/briefs/" },
    { label: "About", href: "/about/" }
  ]
} satisfies Record<Lang, { label: string; href: string }[]>;
```

Change the site description and homepage copy from global transmission research to concise US/Taiwan/Malaysia daily intelligence. Keep the SECURRENT wordmark and language control unchanged.

Use the following site-level positioning:

```ts
export const SITE = {
  name: "SECURRENT",
  eyebrow: "Three-Market Daily Intelligence",
  tagline: "United States. Taiwan. Malaysia.",
  description: "Twice-daily market intelligence for the United States, Taiwan, and Malaysia, built from fundamentals, technicals, positioning, and explicit invalidation conditions.",
  // Keep url, socialImage and accent unchanged.
};

export const SITE_COPY = {
  zh: {
    eyebrow: "三市場每日情報",
    tagline: "美國、台灣、馬來西亞。",
    coverageLabel: "分析維度",
    topics: ["美國", "台灣", "馬來西亞", "基本面", "技術面", "籌碼"]
  },
  en: {
    eyebrow: "Three-Market Daily Intelligence",
    tagline: "United States. Taiwan. Malaysia.",
    coverageLabel: "Analysis dimensions",
    topics: ["United States", "Taiwan", "Malaysia", "Fundamentals", "Technicals", "Positioning"]
  }
};
```

- [ ] **Step 4: Remove research queries and sections from both homepages**

Delete the collection reads for `trends`, `crossignal`, `second-order`, and `deep-dives`, remove the unused `ContentList` import, and remove the two research sections. Keep the hero and the latest Daily Brief feature.

Set the Chinese positioning copy to:

```ts
const copy = {
  latestBrief: "最新簡報",
  daily: "美國、台灣、馬來西亞每日市場情報",
  allBriefs: "全部簡報 →",
  readLatest: "閱讀最新簡報 →",
  readFull: "閱讀全文 →",
  lede: "每日兩次整理美國、台灣與馬來西亞的基本面、技術面與資金訊號，提出可驗證的市場推演。"
};
```

Use the equivalent English copy: `Daily market intelligence for the United States, Taiwan, and Malaysia, updated twice each weekday with explicit evidence and invalidation conditions.`

- [ ] **Step 5: Update the brief archive description**

Replace global-market and second-order language with the same three-market scope in `src/pages/briefs/index.astro` and `src/pages/en/briefs/index.astro`. Do not change archive behavior or older entries.

Update both About pages at the same time: describe the twice-daily three-market product, retain only the United States/Taiwan/Malaysia market list, replace the additional-coverage list with the morning/evening workflow, and change the method line to `事實 → 定價 → 推演 → 驗證／Fact → Pricing → Outlook → Verification`. Keep the investment-advice disclaimer.

- [ ] **Step 6: Build and verify navigation plus preserved routes**

Run:

```bash
npm run build
npm run verify
```

Expected: both commands pass; research detail files still exist in `dist`, while research labels are absent from both homepages and primary navigation.

---

### Task 4: Replace the generation prompt and document the internal research ledger

**Files:**
- Modify: `docs/GPT_CONTENT_PROMPT.md`
- Create: `research-notes/README.md`
- Modify: `scripts/verify-editorial.mjs`

**Interfaces:**
- Consumes: `three-market-v1` content contract and source ledger from Task 1.
- Produces: The single authoritative prompt used by both manual generation and automation; an unpublished ledger template.

- [ ] **Step 1: Add prompt-contract checks before editing the prompt**

Require `docs/GPT_CONTENT_PROMPT.md` to contain all of these exact policy anchors:

```js
const promptRequirements = [
  "只研究美國、台灣、馬來西亞",
  "最多三批搜尋",
  "最多八個有效來源",
  "失敗資料只重試一次",
  "先完成中文",
  "英文不得重新搜尋",
  'briefFormat: "three-market-v1"',
  "## 早間市場推演",
  "## 晚間市場推演",
  "部分市場休市",
  "暫停趨勢探索、跨市場訊號、二階效應與深度研究",
];
for (const requirement of promptRequirements) {
  if (!contentPrompt.includes(requirement)) fail(`Content prompt is missing policy: ${requirement}`);
}
```

Also fail if the prompt still mandates `全球市場與研究`, `今日五大市場風險`, `未來七天重要事件`, or `每週五研究包`.

- [ ] **Step 2: Run the editorial verifier and confirm prompt-policy failure**

Run:

```bash
node scripts/verify-editorial.mjs
```

Expected: non-zero exit identifying the first missing policy anchor or a retired mandatory section.

- [ ] **Step 3: Rewrite `docs/GPT_CONTENT_PROMPT.md` as the authoritative concise prompt**

The document must define:

```text
角色：SECURRENT 三市場研究編輯。
範圍：只研究美國、台灣、馬來西亞；其他國際事件僅在直接改變這三個市場判斷時嵌入對應段落。
節奏：週一至週五 08:10 建立同一日期文章，21:10 更新同一篇文章；週末不發布。
研究上限：每次最多三批搜尋、八個有效來源、失敗資料只重試一次。官方數字取得後停止重複搜尋；缺值不得推估或用舊值冒充。
結論上限：一個主論點、最多兩個次要訊號、最多三個風險與三個相關事件。情境分析只在分歧足以改變判斷時使用。
中文先行：中文完成後才翻譯英文；英文不得重新搜尋、增加事實或改變結論。
公開篇幅：中文 2,000 至 3,000 個中文字，早間約 40%，晚間約 60%。完整來源帳寫入 research-notes/YYYY-MM-DD.md，公開文章只保留核心來源。
暫停項目：暫停趨勢探索、跨市場訊號、二階效應與深度研究，不建立週五研究包。
```

Include the exact frontmatter, overview labels, two H2 structures and morning/evening H3 structures from Task 1. Include market-specific data requirements and the weekday partial-closure rule. Remove all retired global/research package instructions.

- [ ] **Step 4: Document the unpublished ledger format**

Create `research-notes/README.md` with this required row schema:

```md
| Source | URL | Market | Claim supported | Published/fetched date | Status | Used publicly |
| --- | --- | --- | --- | --- | --- | --- |
```

Define `Status` as `Official`, `Secondary`, `Unconfirmed`, or `Unavailable`; require separate `Morning Run`, `Evening Run`, and `Excluded Material` sections; state that the directory is intentionally outside Astro Content Collections.

- [ ] **Step 5: Run prompt and content verification**

Run:

```bash
node scripts/verify-editorial.mjs
```

Expected: `Editorial content verified.`

---

### Task 5: Align the optional browser regression script and complete static verification

**Files:**
- Modify: `scripts/verify-brief-tabs.mjs`
- Modify: `scripts/verify-site.mjs`

**Interfaces:**
- Consumes: Dynamic tabs, generated HTML, navigation and mobile styles from Tasks 2-3.
- Produces: A non-stale optional Playwright script plus authoritative static checks that require no running server.

- [ ] **Step 1: Update browser-script expectations without running a server**

Change the primary route to `/briefs/2026-09-22/`, expect two tabs with accessible names `早間市場推演` and `晚間市場推演`, and verify the evening tab exposes `台灣市場`, `馬來西亞市場`, and `美國盤前與今夜推演`. Add a second visit to `/briefs/2026-09-21/` that expects the legacy three tabs. Keep the mobile overflow, compact navigation, keyboard and sticky-header checks.

- [ ] **Step 2: Syntax-check the optional browser script**

Run:

```bash
node --check scripts/verify-brief-tabs.mjs
```

Expected: exit code 0. Do not start the dev or preview server, so do not execute this Playwright script in this implementation.

- [ ] **Step 3: Add static ARIA and overview placement checks**

In `scripts/verify-site.mjs`, require:

```js
if (!/data-tab-count="2"/.test(zhLatestArticle)) {
  console.error("9/22 switcher does not declare two tabs");
  process.exit(1);
}
if ((zhLatestArticle.match(/role="tabpanel"/g) ?? []).length !== 2) {
  console.error("9/22 does not render two tabpanels");
  process.exit(1);
}
if (!/aria-controls="brief-panel-morning"/.test(zhLatestArticle) || !/aria-controls="brief-panel-evening"/.test(zhLatestArticle)) {
  console.error("9/22 tab ARIA controls are incomplete");
  process.exit(1);
}
```

Use the script's existing `console.error` plus `process.exit(1)` style rather than introducing a new test framework. Confirm the overview labels and table appear before `brief-panel-morning` in the generated HTML.

- [ ] **Step 4: Run the complete local verification set**

Run in order:

```bash
node scripts/verify-editorial.mjs
npm run build
npm run verify
node --check scripts/verify-brief-tabs.mjs
git diff --check
```

Expected: editorial and site verification success messages, Astro build with zero errors, JavaScript syntax success, and no whitespace errors.

---

### Task 6: Update and activate the existing heartbeat only after verification

**Files:**
- Inspect: `/Users/bernardc/.codex/automations/securrent-daily-research-publishing/automation.toml`
- No repository file changes.

**Interfaces:**
- Consumes: The authoritative rules in `docs/GPT_CONTENT_PROMPT.md` and all green verification evidence from Task 5.
- Produces: One active heartbeat named `SECURRENT Daily Research & Publishing`, preserving the existing weekday 08:10 and 21:10 Asia/Taipei schedule and target thread.

- [ ] **Step 1: Re-read the automation immediately before mutation**

Use `automation_update` in view mode for ID `securrent-daily-research-publishing`, then read its `automation.toml`. Confirm it is still `PAUSED`, points to `/Users/bernardc/Desktop/SECURRENT`, and no second SECURRENT automation exists.

- [ ] **Step 2: Update the existing automation with the concise operating prompt**

Preserve the existing name, heartbeat kind, target thread and recurrence. Replace the prompt with instructions that:

```text
- Operate only Monday-Friday in /Users/bernardc/Desktop/SECURRENT.
- Never create a second project, article for the same date, commit, push or deploy.
- At 08:10 create/update the three-market-v1 Chinese brief first: previous US fundamentals and approved technical set; previous Taiwan fundamentals, technicals and full positioning; infer Taiwan's session and the US pre-market; state invalidation conditions.
- After Chinese is finalized, publish a faithful English translation without another research pass.
- At 21:10 update the same article: score the morning call; add current Taiwan close/fundamentals/technicals/positioning; Malaysia close/industry/FX/rates/fundamentals; US futures/Treasuries/USD/oil and the upcoming US-session inference; state invalidation conditions.
- Keep one primary thesis and at most two secondary signals; Chinese total 2,000-3,000 Han characters at roughly 40% morning and 60% evening.
- Use no more than three search batches, eight effective sources and one failed-data retry per run. Prefer official sources, stop duplicate confirmation after an official figure, mark unresolved data unconfirmed, and never infer missing values.
- Record complete source ledgers in research-notes/YYYY-MM-DD.md; publish only conclusion-critical sources.
- Do not create global research sections, extension research, five-risk lists, seven-day calendars or Friday research packages. Keep Trend Explorer, Crossignal, Second Order and Deep Dives pending.
- Do not run on weekends. Do not backfill 2026-09-22; the first automated use of this prompt is 2026-09-23.
- Before finishing each run, execute node scripts/verify-editorial.mjs, npm run build and npm run verify. Leave the automation run unsuccessful when verification fails rather than publishing an invalid update.
```

Set status to `ACTIVE` only in this same update after the Task 5 checks are green.

- [ ] **Step 3: Verify the single automation state**

View the automation again and inspect `automation.toml`. Confirm:

- ID remains `securrent-daily-research-publishing`.
- Status is `ACTIVE`.
- Weekday 08:10 and 21:10 Asia/Taipei timing is unchanged.
- Prompt contains the three-market, two-update, source-cap and pending-research rules.
- No duplicate SECURRENT automation directory or task was created.

- [ ] **Step 4: Final repository and product sanity check**

Run:

```bash
git status --short
git diff --check
node scripts/verify-editorial.mjs
npm run build
npm run verify
```

Expected: only planned files are modified or added; all checks pass; no server process is running; no commit, push or deployment has occurred.

Final review gate: compare every changed file against `docs/superpowers/specs/2026-09-22-three-market-daily-intelligence-design.md`, then report the rewritten 9/22 article, two-tab compatibility, simplified navigation, paused research categories, and active existing heartbeat separately.
