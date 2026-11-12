import test from "node:test";
import assert from "node:assert/strict";

import {
  deriveDefaults,
  normalizeDisplayMath,
  parseArticle,
  serializeArticle,
  slugifyArticle
} from "./lib/article-importer.mjs";

test("parses Markdown without frontmatter and keeps the body once", () => {
  const source = "# 測試文章\n\n本文有[引用](https://example.com)。\n\n> 免責聲明：僅供研究。\n";
  const parsed = parseArticle(source);

  assert.deepEqual(parsed.frontmatter, {});
  assert.equal(parsed.body, source);
});

test("parses simple frontmatter and removes YAML quotes", () => {
  const source = `---
title: "有冒號：測試文章"
tags: ["美股", "RWA"]
featured: true
---

正文保留。
`;
  const parsed = parseArticle(source);

  assert.equal(parsed.frontmatter.title, "有冒號：測試文章");
  assert.deepEqual(parsed.frontmatter.tags, ["美股", "RWA"]);
  assert.equal(parsed.frontmatter.featured, true);
  assert.equal(parsed.body, "\n正文保留。\n");
});

test("normalizes display math outside code fences only", () => {
  const body = `公式：

\\[
\\frac{a}{b}
\\]

行內 \\(x\\) 不變。

\`\`\`markdown
\\[
code
\\]
\`\`\`

$$
x+y
$$
`;
  const normalized = normalizeDisplayMath(body);

  assert.match(normalized, /\$\$\n\\frac\{a\}\{b\}\n\$\$/);
  assert.match(normalized, /行內 \\\(x\\\) 不變/);
  assert.match(normalized, /```markdown\n\\\[\ncode\n\\\]\n```/);
  assert.equal((normalized.match(/^\$\$$/gm) ?? []).length, 4);
});

test("derives required metadata from a Chinese article", () => {
  const source = "# 當加密交易所也能買美股\n\n第一段是摘要來源，說明文章真正研究的市場問題與交易結構。\n\n## 下一節\n";
  const parsed = parseArticle(source);
  const metadata = deriveDefaults(
    parsed,
    "/tmp/我的文章.md",
    new Date("2026-11-12T08:00:00+08:00")
  );

  assert.equal(metadata.title, "當加密交易所也能買美股");
  assert.equal(metadata.date, "2026-11-12");
  assert.equal(metadata.type, "trend");
  assert.equal(metadata.lang, "zh");
  assert.equal(metadata.summary, "第一段是摘要來源，說明文章真正研究的市場問題與交易結構。");
  assert.deepEqual(metadata.tags, []);
});

test("creates stable ASCII slugs for Chinese and English titles", () => {
  assert.equal(slugifyArticle("當加密交易所也能買美股", "2026-11-12"), "2026-11-12-article");
  assert.equal(slugifyArticle("RWA & U.S. Stocks: Market Structure", "2026-11-12"), "2026-11-12-rwa-u-s-stocks-market-structure");
});

test("serializes valid frontmatter and escapes quoted values", () => {
  const output = serializeArticle(
    {
      title: '市場的「新結構」：RWA',
      date: "2026-11-12",
      type: "trend",
      summary: '包含 "引號" 的摘要',
      tags: ["美股", "RWA"],
      lang: "zh",
      translationKey: "2026-11-12-rwa",
      author: "ASTERWARD"
    },
    "\n正文。\n"
  );

  assert.match(output, /^---\ntitle: "市場的「新結構」：RWA"/);
  assert.match(output, /summary: "包含 \\"引號\\" 的摘要"/);
  assert.match(output, /tags: \["美股", "RWA"\]/);
  assert.equal((output.match(/translationKey:/g) ?? []).length, 1);
  assert.match(output, /translationKey: "2026-11-12-rwa"/);
  assert.equal((output.match(/正文。/g) ?? []).length, 1);
});

test("removes only the leading H1 when it duplicates the page title", () => {
  const output = serializeArticle(
    {
      title: "市場結構測試",
      date: "2026-11-12",
      type: "trend",
      summary: "摘要",
      tags: [],
      lang: "zh"
    },
    "# 市場結構測試\n\n正文中的 # 符號保留。\n\n# 另一個標題\n"
  );

  assert.doesNotMatch(output, /^# 市場結構測試$/m);
  assert.match(output, /正文中的 # 符號保留。/);
  assert.match(output, /^# 另一個標題$/m);
});
