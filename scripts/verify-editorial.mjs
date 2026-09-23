import { readFileSync, readdirSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

const pairedContent = [
  ["src/content/briefs/2026-09-23.md", "src/content/briefs/en/2026-09-23.md"],
  ["src/content/briefs/2026-09-22.md", "src/content/briefs/en/2026-09-22.md"],
  ["src/content/briefs/2026-09-21.md", "src/content/briefs/en/2026-09-21.md"],
  ["src/content/briefs/2026-09-18.md", "src/content/briefs/en/2026-09-18.md"],
  ["src/content/briefs/2026-09-16.md", "src/content/briefs/en/2026-09-16.md"],
  ["src/content/briefs/2026-09-17.md", "src/content/briefs/en/2026-09-17.md"],
  ["src/content/trends/ai-infrastructure-capital-cycle.md", "src/content/trends/en/ai-infrastructure-capital-cycle.md"],
  ["src/content/trends/2026-09-16-ai-capex-financing-test.md", "src/content/trends/en/2026-09-16-ai-capex-financing-test.md"],
  ["src/content/trends/2026-09-17-malaysia-data-center-power-credit.md", "src/content/trends/en/2026-09-17-malaysia-data-center-power-credit.md"],
  ["src/content/crossignal/us-yields-to-taiwan-tech.md", "src/content/crossignal/en/us-yields-to-taiwan-tech.md"],
  ["src/content/second-order/higher-rates-data-center-financing.md", "src/content/second-order/en/higher-rates-data-center-financing.md"],
  ["src/content/deep-dives/malaysia-data-center-economics.md", "src/content/deep-dives/en/malaysia-data-center-economics.md"],
  ["src/content/trends/2026-09-18-ai-leadership-under-tightening.md", "src/content/trends/en/2026-09-18-ai-leadership-under-tightening.md"],
  ["src/content/crossignal/2026-09-18-yen-taiwan-flows.md", "src/content/crossignal/en/2026-09-18-yen-taiwan-flows.md"],
  ["src/content/second-order/2026-09-18-cash-futures-hedge.md", "src/content/second-order/en/2026-09-18-cash-futures-hedge.md"],
  ["src/content/deep-dives/2026-09-18-asia-ai-capital-structure.md", "src/content/deep-dives/en/2026-09-18-asia-ai-capital-structure.md"],
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

const productionCutoffLanguage = [
  /資料更新至/,
  /資料截點/,
  /截點/,
  /\bcutoff\b/i,
  /data updated through/i,
  /(?:15:00|15:10|21:10)\s*(?:（|\()?Asia.Taipei/i,
];

for (const path of pairedContent.flat()) {
  const content = read(path);
  for (const pattern of productionCutoffLanguage) {
    if (pattern.test(content)) {
      fail("Internal cutoff language remains in published content: " + path + " (" + pattern + ")");
    }
  }
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

const requiredBriefH2 = {
  zh: [
    "台股盤前",
    "主要市場晚間更新",
    "全球市場與研究",
    "全球跨市場傳導",
    "今日五大市場風險",
    "未來七天重要事件",
    "市場可能尚未充分注意的情報",
    "延伸研究",
    "資料來源",
  ],
  en: [
    "Taiwan Pre-Market",
    "Core Markets Evening Update",
    "Global Markets and Research",
    "Cross-Market Transmission",
    "Top Five Market Risks",
    "Seven-Day Event Calendar",
    "What the Market May Be Missing",
    "Further Research",
    "Sources",
  ],
};

const assertHeadingOrder = (content, headings, path) => {
  let cursor = -1;
  for (const heading of headings) {
    const index = content.indexOf(`## ${heading}`);
    if (index === -1 || index <= cursor) {
      fail(`Required H2 is missing or out of order in ${path}: ${heading}`);
      return;
    }
    cursor = index;
  }
};

const assertGlobalMarketDepth = (content, globalHeading, transmissionHeading, labels, path) => {
  const start = content.indexOf(`## ${globalHeading}`);
  const end = content.indexOf(`## ${transmissionHeading}`, start);
  const globalSection = content.slice(start, end);
  const marketHeadings = [...globalSection.matchAll(/^### (.+)$/gm)];
  if (marketHeadings.length === 0) {
    fail(`Global markets section has no country or market entries in ${path}`);
    return;
  }
  marketHeadings.forEach((match, index) => {
    const bodyStart = match.index + match[0].length;
    const bodyEnd = index + 1 < marketHeadings.length ? marketHeadings[index + 1].index : globalSection.length;
    const body = globalSection.slice(bodyStart, bodyEnd).trim();
    const paragraphs = body.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() && !paragraph.startsWith("#"));
    if (paragraphs.length < 3) fail(`Global market entry needs at least three substantive paragraphs in ${path}: ${match[1]}`);
    for (const label of labels) {
      if (!body.includes(label)) fail(`Global market entry is missing ${label} in ${path}: ${match[1]}`);
    }
  });
};

for (const date of ["2026-09-16", "2026-09-17", "2026-09-18", "2026-09-21"]) {
  const zh = read(`src/content/briefs/${date}.md`);
  const en = read(`src/content/briefs/en/${date}.md`);
  const zhPreMarket = zh.indexOf("## 台股盤前");
  const zhPostMarket = zh.indexOf("## 主要市場晚間更新");
  const zhGlobal = zh.indexOf("## 全球市場與研究");
  const enPreMarket = en.indexOf("## Taiwan Pre-Market");
  const enPostMarket = en.indexOf("## Core Markets Evening Update");
  const enGlobal = en.indexOf("## Global Markets and Research");

  if (zhPreMarket === -1 || zhPostMarket === -1 || zhGlobal === -1 || zhPreMarket >= zhPostMarket || zhPostMarket >= zhGlobal) {
    fail(`Chinese three-panel structure is missing or out of order in brief ${date}`);
  }
  if (enPreMarket === -1 || enPostMarket === -1 || enGlobal === -1 || enPreMarket >= enPostMarket || enPostMarket >= enGlobal) {
    fail(`English three-panel structure is missing or out of order in brief ${date}`);
  }
  const zhEvening = zh.slice(zhPostMarket, zhGlobal);
  const enEvening = en.slice(enPostMarket, enGlobal);
  if (!zhEvening.includes("### 盤前判斷回顧")) {
    fail(`Chinese pre-market scorecard is missing from the post-market section in brief ${date}`);
  }
  if (!enEvening.includes("### Pre-Market Scorecard")) {
    fail(`English pre-market scorecard is missing from the post-market section in brief ${date}`);
  }
  for (const heading of ["## 台灣市場", "## 馬來西亞市場", "## 美國市場"]) {
    if (!zhEvening.includes(heading)) fail(`Core-market navigation heading missing from Chinese brief ${date}: ${heading}`);
  }
  for (const heading of ["## Taiwan Market", "## Malaysia Market", "## United States Market"]) {
    if (!enEvening.includes(heading)) fail(`Core-market navigation heading missing from English brief ${date}: ${heading}`);
  }
  assertHeadingOrder(zh, requiredBriefH2.zh, `src/content/briefs/${date}.md`);
  assertHeadingOrder(en, requiredBriefH2.en, `src/content/briefs/en/${date}.md`);
  assertGlobalMarketDepth(zh, "全球市場與研究", "全球跨市場傳導", ["**事件與事實：**", "**市場如何定價：**", "**跨市場傳導與下一驗證：**"], `src/content/briefs/${date}.md`);
  assertGlobalMarketDepth(en, "Global Markets and Research", "Cross-Market Transmission", ["**Event and Facts:**", "**Market Pricing:**", "**Transmission and Next Confirmation:**"], `src/content/briefs/en/${date}.md`);
  for (const heading of ["### 已確認發展", "### 市場定價", "### 今晚美股情境", "### 市場影響", "### 下一驗證", "### 籌碼與資金流"]) {
    if (!zh.includes(heading)) fail(`Fixed Chinese section heading missing from brief ${date}: ${heading}`);
  }
  for (const heading of ["### Confirmed Developments", "### Market Pricing", "### Tonight's US Setup", "### Market Impact", "### Next Confirmation", "### Positioning and Flows"]) {
    if (!en.includes(heading)) fail(`Fixed English section heading missing from brief ${date}: ${heading}`);
  }
  if (/^### .*[/／].*$/m.test(zh) || /^### .*[/／].*$/m.test(en)) {
    fail(`Slash-separated section heading remains in brief ${date}`);
  }
  if (["2026-09-16", "2026-09-17"].includes(date)) {
    const expectedZhEmphasis = date === "2026-09-16"
      ? "**一碼升息本身已不是主要驚訝**"
      : "**這是一個「成長未斷、通膨迫使政策再收緊」的組合，而不是衰退式升息**";
    const expectedEnEmphasis = date === "2026-09-16"
      ? "**A quarter-point move was therefore no longer the primary surprise**"
      : "**This is a resilient-growth tightening, not a recessionary rate increase**";
    if (!zh.includes(expectedZhEmphasis)) fail(`Substantive bold emphasis missing from Chinese brief ${date}`);
    if (!en.includes(expectedEnEmphasis)) fail(`Substantive bold emphasis missing from English brief ${date}`);
  }
  if (!zh.includes("## 延伸研究")) fail(`Research links missing from Chinese brief ${date}`);
  if (!en.includes("## Further Research")) fail(`Research links missing from English brief ${date}`);
}

const currentZh = read("src/content/briefs/2026-09-22.md");
const currentEn = read("src/content/briefs/en/2026-09-22.md");
const bodyWithoutFrontmatter = (content) => content.replace(/^---[\s\S]*?---\s*/, "");
const h2s = (content) => [...content.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
const hanCount = (content) => (bodyWithoutFrontmatter(content).match(/\p{Script=Han}/gu) ?? []).length;
const sectionBetween = (content, start, end) => {
  const startIndex = content.indexOf(`## ${start}`);
  const endIndex = end ? content.indexOf(`## ${end}`, startIndex) : content.length;
  return startIndex >= 0 ? content.slice(startIndex, endIndex >= 0 ? endIndex : content.length) : "";
};
const sourceListCount = (content, heading) => {
  const start = content.indexOf(`### ${heading}`);
  return start >= 0 ? (content.slice(start).match(/^- /gm) ?? []).length : 0;
};

const threeMarketHeadings = {
  zh: ["早間市場推演", "晚間市場推演"],
  en: ["Morning Market Outlook", "Evening Market Outlook"],
};

const latestBriefFile = readdirSync("src/content/briefs")
  .filter((name) => /^\d{4}-\d{2}-\d{2}\.md$/.test(name))
  .sort()
  .at(-1);
const latestBriefDate = latestBriefFile.replace(/\.md$/, "");
const latestZh = read(`src/content/briefs/${latestBriefFile}`);
const latestEn = read(`src/content/briefs/en/${latestBriefFile}`);
const latestZhMorning = sectionBetween(latestZh, "早間市場推演", "晚間市場推演");
const latestZhEvening = sectionBetween(latestZh, "晚間市場推演");
const latestEnMorning = sectionBetween(latestEn, "Morning Market Outlook", "Evening Market Outlook");
const latestEnEvening = sectionBetween(latestEn, "Evening Market Outlook");
const h3s = (content) => [...content.matchAll(/^### (.+)$/gm)].map((match) => match[1]);
const subsectionBetween = (content, start, end) => {
  const startIndex = content.indexOf(`### ${start}`);
  const endIndex = end ? content.indexOf(`### ${end}`, startIndex) : content.length;
  return startIndex >= 0 ? content.slice(startIndex, endIndex >= 0 ? endIndex : content.length) : "";
};

const transmissionHeadings = {
  zhMorning: ["傳導主線", "昨日美國訊號", "昨日馬來西亞訊號", "台灣基本面與技術面", "台灣籌碼面", "今日台股推演", "失效條件", "核心資料來源"],
  enMorning: ["Transmission Thesis", "Previous US Signals", "Previous Malaysia Signals", "Taiwan Fundamentals and Technicals", "Taiwan Positioning", "Taiwan Session Outlook", "Invalidation Conditions", "Core Sources"],
  zhEvening: ["早間判斷回顧", "今日台灣訊號", "台灣籌碼面收盤確認", "今日馬來西亞訊號", "美國盤前條件", "今夜美股推演", "失效條件", "核心資料來源"],
  enEvening: ["Pre-Market Scorecard", "Taiwan Closing Signal", "Taiwan Positioning Confirmation", "Malaysia Closing Signal", "US Pre-Market Conditions", "US Session Outlook", "Invalidation Conditions", "Core Sources"],
};

for (const [actual, expected, label] of [
  [h3s(latestZhMorning), transmissionHeadings.zhMorning, "Chinese morning"],
  [h3s(latestEnMorning), transmissionHeadings.enMorning, "English morning"],
  [h3s(latestZhEvening), transmissionHeadings.zhEvening, "Chinese evening"],
  [h3s(latestEnEvening), transmissionHeadings.enEvening, "English evening"],
]) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${latestBriefDate} ${label} headings must follow the transmission-led structure`);
  }
}

const morningSubstance = subsectionBetween(latestZhMorning, "傳導主線", "核心資料來源");
const morningTaiwan = subsectionBetween(latestZhMorning, "台灣基本面與技術面", "失效條件");
const morningTaiwanShare = hanCount(morningTaiwan) / hanCount(morningSubstance);
if (morningTaiwanShare < 0.55) {
  fail(`${latestBriefDate} Taiwan content must be at least 55% of substantive morning content; received ${(morningTaiwanShare * 100).toFixed(1)}%`);
}

const eveningSubstance = subsectionBetween(latestZhEvening, "早間判斷回顧", "核心資料來源");
const eveningUnitedStates = subsectionBetween(latestZhEvening, "美國盤前條件", "失效條件");
const eveningUnitedStatesShare = hanCount(eveningUnitedStates) / hanCount(eveningSubstance);
if (eveningUnitedStatesShare < 0.5) {
  fail(`${latestBriefDate} US content must be at least 50% of substantive evening content; received ${(eveningUnitedStatesShare * 100).toFixed(1)}%`);
}

const latestTaiwanPositioning = [
  subsectionBetween(latestZhMorning, "台灣籌碼面", "今日台股推演"),
  subsectionBetween(latestZhEvening, "台灣籌碼面收盤確認", "今日馬來西亞訊號"),
];
for (const [index, section] of latestTaiwanPositioning.entries()) {
  for (const term of ["外資", "投信", "自營商", "台指期", "選擇權", "融資", "借券"]) {
    if (!section.includes(term)) fail(`${latestBriefDate} Taiwan positioning section ${index + 1} is missing ${term}`);
  }
}

if (!currentZh.includes('briefFormat: "three-market-v1"')) fail("9/22 Chinese brief needs three-market-v1");
if (!currentEn.includes('briefFormat: "three-market-v1"')) fail("9/22 English brief needs three-market-v1");
if (JSON.stringify(h2s(currentZh)) !== JSON.stringify(threeMarketHeadings.zh)) fail("9/22 Chinese brief must have exactly two H2 panels");
if (JSON.stringify(h2s(currentEn)) !== JSON.stringify(threeMarketHeadings.en)) fail("9/22 English brief must have exactly two H2 panels");

for (const heading of ["### 盤前判斷回顧", "### 台灣市場", "### 馬來西亞市場", "### 美國盤前與今夜推演"]) {
  if (!currentZh.includes(heading)) fail(`9/22 Chinese brief is missing ${heading}`);
}
for (const heading of ["### Pre-Market Scorecard", "### Taiwan Market", "### Malaysia Market", "### US Pre-Market and Session Outlook"]) {
  if (!currentEn.includes(heading)) fail(`9/22 English brief is missing ${heading}`);
}
for (const retired of ["全球市場與研究", "全球跨市場傳導", "今日五大市場風險", "未來七天重要事件", "市場可能尚未充分注意的情報", "延伸研究"]) {
  if (currentZh.includes(retired)) fail(`Retired 9/22 section remains: ${retired}`);
}
for (const retired of ["Global Markets and Research", "Cross-Market Transmission", "Top Five Market Risks", "Seven-Day Event Calendar", "What the Market May Be Missing", "Further Research"]) {
  if (currentEn.includes(retired)) fail(`Retired English 9/22 section remains: ${retired}`);
}

const currentHanCount = hanCount(currentZh);
if (currentHanCount < 2000 || currentHanCount > 3000) fail(`9/22 Chinese brief must contain 2,000-3,000 Han characters; received ${currentHanCount}`);
if ((currentZh.match(/\*\*主論點：\*\*/g) ?? []).length !== 1) fail("9/22 Chinese brief needs exactly one primary thesis");
if ((currentZh.match(/\*\*次要訊號[一二]：\*\*/g) ?? []).length > 2) fail("9/22 Chinese brief has more than two secondary signals");
if ((currentEn.match(/\*\*Primary thesis:\*\*/g) ?? []).length !== 1) fail("9/22 English brief needs exactly one primary thesis");
if ((currentEn.match(/\*\*Secondary signal [12]:\*\*/g) ?? []).length > 2) fail("9/22 English brief has more than two secondary signals");

const currentZhMorning = sectionBetween(currentZh, "早間市場推演", "晚間市場推演");
const currentZhEvening = sectionBetween(currentZh, "晚間市場推演");
const currentEnMorning = sectionBetween(currentEn, "Morning Market Outlook", "Evening Market Outlook");
const currentEnEvening = sectionBetween(currentEn, "Evening Market Outlook");
const morningShare = hanCount(currentZhMorning) / (hanCount(currentZhMorning) + hanCount(currentZhEvening));
if (morningShare < 0.35 || morningShare > 0.45) fail(`9/22 morning share must be 35%-45%; received ${(morningShare * 100).toFixed(1)}%`);
for (const [section, heading, label] of [
  [currentZhMorning, "核心資料來源", "Chinese morning"],
  [currentZhEvening, "核心資料來源", "Chinese evening"],
  [currentEnMorning, "Core Sources", "English morning"],
  [currentEnEvening, "Core Sources", "English evening"],
]) {
  const count = sourceListCount(section, heading);
  if (count < 1 || count > 8) fail(`${label} core sources must contain 1-8 entries; received ${count}`);
}

const morningZh = read("src/content/briefs/2026-09-23.md");
const morningEn = read("src/content/briefs/en/2026-09-23.md");
if (!morningZh.includes('briefFormat: "three-market-v1"')) fail("9/23 Chinese brief needs three-market-v1");
if (!morningEn.includes('briefFormat: "three-market-v1"')) fail("9/23 English brief needs three-market-v1");
if (JSON.stringify(h2s(morningZh)) !== JSON.stringify(threeMarketHeadings.zh)) fail("9/23 Chinese brief must expose morning and evening tabs");
if (JSON.stringify(h2s(morningEn)) !== JSON.stringify(threeMarketHeadings.en)) fail("9/23 English brief must expose morning and evening tabs");
for (const heading of ["### 傳導主線", "### 昨日美國訊號", "### 昨日馬來西亞訊號", "### 台灣基本面與技術面", "### 台灣籌碼面", "### 今日台股推演", "### 失效條件", "### 核心資料來源"]) {
  if (!morningZh.includes(heading)) fail(`9/23 Chinese morning brief is missing ${heading}`);
}
for (const heading of ["### Transmission Thesis", "### Previous US Signals", "### Previous Malaysia Signals", "### Taiwan Fundamentals and Technicals", "### Taiwan Positioning", "### Taiwan Session Outlook", "### Invalidation Conditions", "### Core Sources"]) {
  if (!morningEn.includes(heading)) fail(`9/23 English morning brief is missing ${heading}`);
}
if ((morningZh.match(/\*\*主論點：\*\*/g) ?? []).length !== 1) fail("9/23 Chinese brief needs exactly one primary thesis");
if ((morningZh.match(/\*\*次要訊號[一二]：\*\*/g) ?? []).length > 2) fail("9/23 Chinese brief has more than two secondary signals");
if ((morningEn.match(/\*\*Primary thesis:\*\*/g) ?? []).length !== 1) fail("9/23 English brief needs exactly one primary thesis");
if ((morningEn.match(/\*\*Secondary signal [12]:\*\*/g) ?? []).length > 2) fail("9/23 English brief has more than two secondary signals");
for (const retired of ["全球市場與研究", "全球跨市場傳導", "今日五大市場風險", "未來七天重要事件", "市場可能尚未充分注意的情報", "延伸研究"]) {
  if (morningZh.includes(retired)) fail(`Retired 9/23 section remains: ${retired}`);
}
const morningZhSection = sectionBetween(morningZh, "早間市場推演", "晚間市場推演");
const morningEnSection = sectionBetween(morningEn, "Morning Market Outlook", "Evening Market Outlook");
for (const [section, heading, label] of [
  [morningZhSection, "核心資料來源", "9/23 Chinese morning"],
  [morningEnSection, "Core Sources", "9/23 English morning"],
]) {
  const count = sourceListCount(section, heading);
  if (count < 1 || count > 8) fail(`${label} core sources must contain 1-8 entries; received ${count}`);
}

const finalZhEvening = sectionBetween(morningZh, "晚間市場推演");
const finalEnEvening = sectionBetween(morningEn, "Evening Market Outlook");
for (const heading of ["### 早間判斷回顧", "### 今日台灣訊號", "### 台灣籌碼面收盤確認", "### 今日馬來西亞訊號", "### 美國盤前條件", "### 今夜美股推演", "### 失效條件", "### 核心資料來源"]) {
  if (!finalZhEvening.includes(heading)) fail(`9/23 Chinese evening brief is missing ${heading}`);
}
for (const heading of ["### Pre-Market Scorecard", "### Taiwan Closing Signal", "### Taiwan Positioning Confirmation", "### Malaysia Closing Signal", "### US Pre-Market Conditions", "### US Session Outlook", "### Invalidation Conditions", "### Core Sources"]) {
  if (!finalEnEvening.includes(heading)) fail(`9/23 English evening brief is missing ${heading}`);
}

const finalHanCount = hanCount(morningZh);
if (finalHanCount < 2000 || finalHanCount > 3000) fail(`9/23 Chinese brief must contain 2,000-3,000 Han characters; received ${finalHanCount}`);
const finalMorningShare = hanCount(morningZhSection) / (hanCount(morningZhSection) + hanCount(finalZhEvening));
if (finalMorningShare < 0.35 || finalMorningShare > 0.45) fail(`9/23 morning share must be 35%-45%; received ${(finalMorningShare * 100).toFixed(1)}%`);
for (const [section, heading, label] of [
  [finalZhEvening, "核心資料來源", "9/23 Chinese evening"],
  [finalEnEvening, "Core Sources", "9/23 English evening"],
]) {
  const count = sourceListCount(section, heading);
  if (count < 1 || count > 8) fail(`${label} core sources must contain 1-8 entries; received ${count}`);
}

if (!finalZhEvening.includes("| 淨空單增加 516 口至 76,084 口 | 失效 |")) fail("9/23 Chinese scorecard must resolve the futures-hedging call");
if (!finalEnEvening.includes("| Net short increased by 516 to 76,084 | Failed |")) fail("9/23 English scorecard must resolve the futures-hedging call");
if (finalZhEvening.includes("尚待驗證") || finalEnEvening.includes("| Pending |")) fail("9/23 scorecard still contains a resolved pending state");

for (const phrase of ["48,157.29", "389.22 億元", "10,855 口", "86,939 口", "76,084 口", "6,063.68 億元", "323.43 億股", "95.84%", "1,676.43", "4.0780/4.0825", "4.957%"]) {
  if (!finalZhEvening.includes(phrase)) fail(`Required 9/23 Chinese evening data missing: ${phrase}`);
}
for (const phrase of ["48,157.29", "TWD 38.92 billion", "10,855 long", "86,939 short", "net short of 76,084", "TWD 606.37 billion", "32.34 billion shares", "95.84%", "1,676.43", "4.0780/4.0825", "4.957%"]) {
  if (!finalEnEvening.includes(phrase)) fail(`Required 9/23 English evening data missing: ${phrase}`);
}


const datedBriefs = new Map([
  ["2026-09-22", {
    zh: ["費城半導體指數上漲約 4.3%", "台積電 ADR 上漲 2.41%", "淨空單 75,568 口", "外資及陸資買超 453.21 億元", "FBM KLCI 上漲 16.56 點", "投標倍數 2.17 倍", "布蘭特原油跌至 98.29 美元"],
    en: ["Philadelphia Semiconductor Index rose about 4.3%", "TSMC ADRs increased 2.41%", "net short of 75,568", "Foreign investors bought TWD 45.32 billion", "FBM KLCI gained 16.56 points", "2.17 bid-to-cover ratio", "Brent moved near USD 98.29"],
  }],
  ["2026-09-21", {
    zh: ["加權指數上漲 538.09 點", "外資及陸資買超 203.76 億元", "淨空單 74,081 口", "FBM KLCI 上漲 1.38 點", "S&P 500 期貨上漲約 0.7%"],
    en: ["The Taiex gained 538.09 points", "TWD 20.38 billion from foreign investors", "net short of 74,081 contracts", "The FBM KLCI gained 1.38 points", "S&P 500 futures rose about 0.7%"],
  }],
  ["2026-09-18", {
    zh: ["S&P 500 上漲 1.14%", "費城半導體指數上漲 3.12%", "台積電 ADR 上漲 2.81%", "外資台指期淨空單 78,674 口"],
    en: ["S&P 500 rose 1.14%", "Philadelphia Semiconductor Index rose 3.12%", "TSMC ADR gained 2.81%", "foreign investors held a net short of 78,674 Taiwan index futures contracts"],
  }],
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
  ["src/content/trends/2026-09-18-ai-leadership-under-tightening.md", 3000],
  ["src/content/trends/en/2026-09-18-ai-leadership-under-tightening.md", 3500],
  ["src/content/crossignal/2026-09-18-yen-taiwan-flows.md", 3000],
  ["src/content/crossignal/en/2026-09-18-yen-taiwan-flows.md", 3500],
  ["src/content/second-order/2026-09-18-cash-futures-hedge.md", 3000],
  ["src/content/second-order/en/2026-09-18-cash-futures-hedge.md", 3500],
  ["src/content/deep-dives/2026-09-18-asia-ai-capital-structure.md", 5000],
  ["src/content/deep-dives/en/2026-09-18-asia-ai-capital-structure.md", 5500],
]);

for (const [path, minimum] of minimumLengths) {
  if (read(path).length < minimum) {
    fail(`Research article is too short (${read(path).length} < ${minimum}): ${path}`);
  }
}

const contentPrompt = read("docs/GPT_CONTENT_PROMPT.md");
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
for (const retiredRequirement of [
  "交易日版必須依序使用以下 H2，讓網站自動建立三個分頁",
  "每週五研究包包含四個分類",
]) {
  if (contentPrompt.includes(retiredRequirement)) fail(`Content prompt still mandates retired workflow: ${retiredRequirement}`);
}

const fridayResearchPairs = [
  ["src/content/trends/2026-09-18-ai-leadership-under-tightening.md", "src/content/trends/en/2026-09-18-ai-leadership-under-tightening.md"],
  ["src/content/crossignal/2026-09-18-yen-taiwan-flows.md", "src/content/crossignal/en/2026-09-18-yen-taiwan-flows.md"],
  ["src/content/second-order/2026-09-18-cash-futures-hedge.md", "src/content/second-order/en/2026-09-18-cash-futures-hedge.md"],
  ["src/content/deep-dives/2026-09-18-asia-ai-capital-structure.md", "src/content/deep-dives/en/2026-09-18-asia-ai-capital-structure.md"],
];
const fridayResearchSpine = {
  zh: ["研究命題", "事實與市場定價", "傳導機制", "偏多情境", "偏空情境", "領先指標", "推翻條件", "下一驗證", "資料來源"],
  en: ["Research Thesis", "Evidence and Market Pricing", "Transmission Mechanism", "Bull Case", "Bear Case", "Leading Indicators", "Falsification", "Next Confirmation", "Sources"],
};

for (const [zhPath, enPath] of fridayResearchPairs) {
  assertHeadingOrder(read(zhPath), fridayResearchSpine.zh, zhPath);
  assertHeadingOrder(read(enPath), fridayResearchSpine.en, enPath);
}

for (const path of ["src/pages/index.astro", "src/pages/deep-dives/index.astro"]) {
  if (read(path).includes("長篇研究")) fail(`Deprecated label remains in ${path}`);
}

if (!process.exitCode) console.log("Editorial content verified.");
