import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

const pairedContent = [
  ["src/content/briefs/2026-09-16.md", "src/content/briefs/en/2026-09-16.md"],
  ["src/content/briefs/2026-09-17.md", "src/content/briefs/en/2026-09-17.md"],
  ["src/content/trends/ai-infrastructure-capital-cycle.md", "src/content/trends/en/ai-infrastructure-capital-cycle.md"],
  ["src/content/trends/2026-09-16-ai-capex-financing-test.md", "src/content/trends/en/2026-09-16-ai-capex-financing-test.md"],
  ["src/content/trends/2026-09-17-malaysia-data-center-power-credit.md", "src/content/trends/en/2026-09-17-malaysia-data-center-power-credit.md"],
  ["src/content/crossignal/us-yields-to-taiwan-tech.md", "src/content/crossignal/en/us-yields-to-taiwan-tech.md"],
  ["src/content/second-order/higher-rates-data-center-financing.md", "src/content/second-order/en/higher-rates-data-center-financing.md"],
  ["src/content/deep-dives/malaysia-data-center-economics.md", "src/content/deep-dives/en/malaysia-data-center-economics.md"],
];

const translationKey = (content) => content.match(/^translationKey:\s*["']?([^"'\n]+)["']?/m)?.[1];

for (const [zhPath, enPath] of pairedContent) {
  const zh = read(zhPath);
  const en = read(enPath);
  if (!translationKey(zh) || translationKey(zh) !== translationKey(en)) {
    fail(`Translation key mismatch: ${zhPath} <-> ${enPath}`);
  }
  if (/[㐀-鿿]/u.test(en)) {
    fail(`Chinese characters found in English article: ${enPath}`);
  }
}

const allContent = pairedContent.flat().map(read).join("\n");
if (/placeholder/i.test(allContent)) {
  fail("Placeholder text remains in published content.");
}

const expectedChineseTitles = new Map([
  ["src/content/crossignal/us-yields-to-taiwan-tech.md", "美國公債殖利率如何傳導至台灣科技股估值"],
  ["src/content/second-order/higher-rates-data-center-financing.md", "高利率如何先於晶片需求衝擊資料中心融資"],
  ["src/content/deep-dives/malaysia-data-center-economics.md", "馬來西亞資料中心經濟：從 MW 成長轉向單位報酬"],
]);

for (const [path, title] of expectedChineseTitles) {
  if (!read(path).includes(`title: "${title}"`)) {
    fail(`Expected Chinese title missing from ${path}`);
  }
}

for (const date of ["2026-09-16", "2026-09-17"]) {
  const zh = read(`src/content/briefs/${date}.md`);
  const en = read(`src/content/briefs/en/${date}.md`);
  for (const heading of ["### 已確認發展", "### 市場定價", "### 今晚美股情境", "### 市場影響", "### 下一驗證", "### 籌碼與資金流"]) {
    if (!zh.includes(heading)) fail(`Fixed Chinese section heading missing from brief ${date}: ${heading}`);
  }
  for (const heading of ["### Confirmed Developments", "### Market Pricing", "### Tonight's US Setup", "### Market Impact", "### Next Confirmation", "### Positioning and Flows"]) {
    if (!en.includes(heading)) fail(`Fixed English section heading missing from brief ${date}: ${heading}`);
  }
  if (/^### .*[/／].*$/m.test(zh) || /^### .*[/／].*$/m.test(en)) {
    fail(`Slash-separated section heading remains in brief ${date}`);
  }
  const expectedZhEmphasis = date === "2026-09-16"
    ? "**一碼升息本身已不是主要驚訝**"
    : "**這是一個「成長未斷、通膨迫使政策再收緊」的組合，而不是衰退式升息**";
  const expectedEnEmphasis = date === "2026-09-16"
    ? "**A quarter-point move was therefore no longer the primary surprise**"
    : "**This is a resilient-growth tightening, not a recessionary rate increase**";
  if (!zh.includes(expectedZhEmphasis)) fail(`Substantive bold emphasis missing from Chinese brief ${date}`);
  if (!en.includes(expectedEnEmphasis)) fail(`Substantive bold emphasis missing from English brief ${date}`);
  if (!zh.includes("## 延伸研究")) fail(`Research links missing from Chinese brief ${date}`);
  if (!en.includes("## Further Research")) fail(`Research links missing from English brief ${date}`);
}


const datedBriefs = new Map([
  ["2026-09-16", {
    zh: ["零售與餐飲銷售月增 1.2%", "進口價格月增 0.7%"],
    en: ["retail and food services sales rose 1.2%", "Import prices rose 0.7%"],
  }],
  ["2026-09-17", {
    zh: ["初領失業救濟金降至 19.6 萬人", "費城聯準銀行製造業指數", "新屋開工", "維持重貼現率於 2%", "第 2 戶購屋貸款成數上限由 6 成調升至 7 成", "英格蘭銀行維持 Bank Rate 於 3.75%"],
    en: ["initial jobless claims fell to 196,000", "Philadelphia Fed manufacturing index", "housing starts", "kept the discount rate at 2%", "second-home mortgage LTV cap from 60% to 70%", "Bank of England kept Bank Rate at 3.75%"],
  }],
]);

const operationalLanguage = [
  /15:10/i,
  /21:10/i,
  /首版/,
  /盤後籌碼於.*回補/,
  /資料截點/,
  /本文截點/,
  /截點前/,
  /first-edition/i,
  /post-cutoff/i,
  /at the cutoff/i,
  /21:10 update/i,
];

for (const [date, expected] of datedBriefs) {
  const zh = read(`src/content/briefs/${date}.md`);
  const en = read(`src/content/briefs/en/${date}.md`);
  for (const pattern of operationalLanguage) {
    if (pattern.test(zh) || pattern.test(en)) {
      fail(`Internal production language remains in brief ${date}: ${pattern}`);
    }
  }
  if (/^> /m.test(zh) || /^> /m.test(en)) {
    fail(`Production note blockquote remains in brief ${date}`);
  }
  for (const phrase of expected.zh) {
    if (!zh.includes(phrase)) fail(`Required integrated data missing from Chinese brief ${date}: ${phrase}`);
  }
  for (const phrase of expected.en) {
    if (!en.includes(phrase)) fail(`Required integrated data missing from English brief ${date}: ${phrase}`);
  }
}

const minimumLengths = new Map([
  ["src/content/trends/ai-infrastructure-capital-cycle.md", 3500],
  ["src/content/trends/en/ai-infrastructure-capital-cycle.md", 3500],
  ["src/content/crossignal/us-yields-to-taiwan-tech.md", 3000],
  ["src/content/crossignal/en/us-yields-to-taiwan-tech.md", 3000],
  ["src/content/second-order/higher-rates-data-center-financing.md", 3000],
  ["src/content/second-order/en/higher-rates-data-center-financing.md", 3000],
  ["src/content/deep-dives/malaysia-data-center-economics.md", 5000],
  ["src/content/deep-dives/en/malaysia-data-center-economics.md", 5000],
]);

for (const [path, minimum] of minimumLengths) {
  if (read(path).length < minimum) {
    fail(`Research article is too short (${read(path).length} < ${minimum}): ${path}`);
  }
}

for (const path of ["src/pages/index.astro", "src/pages/deep-dives/index.astro"]) {
  if (read(path).includes("長篇研究")) fail(`Deprecated label remains in ${path}`);
}

if (!process.exitCode) console.log("Editorial content verified.");
