import assert from "node:assert/strict";
import { chromium } from "/Users/bernardc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl = process.env.SECURRENT_TEST_URL ?? "http://127.0.0.1:4322";
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

try {
  await page.goto(`${baseUrl}/briefs/2026-09-17/`, { waitUntil: "networkidle" });

  const tabs = page.getByRole("tab");
  assert.equal(await tabs.count(), 3, "Daily Brief should expose three session tabs");
  assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true");

  const panels = page.locator('[role="tabpanel"]');
  assert.equal(await panels.count(), 3, "Daily Brief should expose three session panels");
  assert.equal(await panels.nth(0).isVisible(), true, "Pre-market panel should be visible by default");
  assert.equal(await panels.nth(1).isVisible(), false, "Post-market panel should be hidden by default");
  assert.equal(await panels.nth(2).isVisible(), false, "Global research panel should be hidden by default");

  await tabs.nth(1).click();
  assert.equal(await panels.nth(0).isVisible(), false, "Pre-market panel should hide after switching tabs");
  assert.equal(await panels.nth(1).isVisible(), true, "Post-market panel should become visible");
  assert.equal(await page.locator(".desktop-toc li:not([hidden]) a", { hasText: "籌碼與資金流" }).count(), 1);
  assert.equal(await page.locator(".desktop-toc li:not([hidden]) a", { hasText: "其他重要市場" }).count(), 0);

  await page.locator(".desktop-toc li:not([hidden]) a", { hasText: "籌碼與資金流" }).click();
  const headingTop = await page.locator("#籌碼與資金流").evaluate((heading) => heading.getBoundingClientRect().top);
  assert.ok(headingTop >= 88, `TOC target should remain visible below the sticky header; received ${headingTop}px`);

  await tabs.nth(2).click();
  assert.equal(await panels.nth(1).isVisible(), false, "Post-market panel should hide after switching tabs");
  assert.equal(await panels.nth(2).isVisible(), true, "Global research panel should become visible");
  assert.equal(await page.locator(".desktop-toc li:not([hidden]) a", { hasText: "其他重要市場" }).count(), 1);

  await tabs.nth(2).press("ArrowLeft");
  assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true", "Arrow keys should switch tabs");

  const mobileGap = async (route, beforeSelector, afterSelector, minimum, label) => {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const gap = await page.evaluate(
      ({ beforeSelector, afterSelector }) => {
        const before = document.querySelector(beforeSelector);
        const after = document.querySelector(afterSelector);
        if (!before || !after) return null;
        return Math.round(after.getBoundingClientRect().top - before.getBoundingClientRect().bottom);
      },
      { beforeSelector, afterSelector },
    );
    assert.notEqual(gap, null, `${label} elements should exist`);
    assert.ok(gap >= minimum, `${label} should be at least ${minimum}px; received ${gap}px`);
  };

  await page.setViewportSize({ width: 390, height: 844 });
  await mobileGap(
    "/briefs/2026-09-18/",
    ".article-header .label-row",
    ".mobile-toc",
    28,
    "Research labels to mobile contents spacing",
  );
  await mobileGap(
    "/trends/ai-infrastructure-capital-cycle/",
    ".article-header .label-row",
    ".mobile-toc",
    28,
    "Research article labels to mobile contents spacing",
  );
  await mobileGap(
    "/briefs/2026-09-17/",
    ".session-switcher",
    ".mobile-toc",
    20,
    "Session tabs to mobile contents spacing",
  );
  await mobileGap(
    "/briefs/2026-09-18/",
    ".mobile-toc",
    ".article-body > :first-child",
    48,
    "Mobile contents to article spacing",
  );

  await page.goto(`${baseUrl}/briefs/2026-09-17/`, { waitUntil: "networkidle" });
  const mobileTabHeight = await page.locator(".session-switcher").evaluate((element) =>
    Math.round(element.getBoundingClientRect().height),
  );
  assert.ok(mobileTabHeight <= 56, `Mobile tab control should stay slim; received ${mobileTabHeight}px`);
  assert.deepEqual(
    await page.locator(".tab-label-compact").allTextContents(),
    ["盤前", "盤後・美股前", "全球研究"],
    "Mobile tabs should use compact labels",
  );
  assert.deepEqual(
    await page.getByRole("tab").evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label"))),
    ["台股盤前", "台股盤後・美股盤前", "全球市場與研究"],
    "Compact mobile tabs should keep their complete accessible names",
  );

  const mobileToc = page.locator(".mobile-toc");
  const mobileTocHeight = await mobileToc.evaluate((element) => Math.round(element.getBoundingClientRect().height));
  assert.ok(mobileTocHeight <= 46, `Collapsed mobile section navigation should stay compact; received ${mobileTocHeight}px`);
  assert.match(
    await mobileToc.locator("summary").innerText(),
    /章節導覽/,
    "Mobile contents should use the section-navigation label",
  );
  const articleTopBeforeToc = await page.locator(".article-body").evaluate((element) =>
    Math.round(element.getBoundingClientRect().top),
  );
  await mobileToc.locator("summary").click();
  const articleTopAfterToc = await page.locator(".article-body").evaluate((element) =>
    Math.round(element.getBoundingClientRect().top),
  );
  assert.equal(articleTopAfterToc, articleTopBeforeToc, "Opening mobile section navigation should not push the article");
  await mobileToc.locator("li:not([hidden]) a").nth(1).click();
  assert.equal(await mobileToc.getAttribute("open"), null, "Selecting a section should close mobile navigation");

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/", "/briefs/", "/briefs/2026-09-17/", "/trends/ai-infrastructure-capital-cycle/", "/about/"]) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      assert.ok(
        dimensions.content <= dimensions.viewport,
        `${route} should not overflow at ${width}px; received ${dimensions.content}px`,
      );
    }
  }

  console.log("Daily Brief tab behavior verified.");
} finally {
  await browser.close();
}
