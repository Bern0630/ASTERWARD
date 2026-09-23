import assert from "node:assert/strict";
import { chromium } from "/Users/bernardc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl = process.env.SECURRENT_TEST_URL ?? "http://127.0.0.1:4322";
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

try {
  await page.goto(`${baseUrl}/briefs/2026-09-23/`, { waitUntil: "networkidle" });

  const tabs = page.getByRole("tab");
  assert.equal(await tabs.count(), 2, "Three-market Daily Brief should expose two session tabs");
  assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true");

  const panels = page.locator('[role="tabpanel"]');
  assert.equal(await panels.count(), 2, "Three-market Daily Brief should expose two session panels");
  assert.equal(await panels.nth(0).isVisible(), true, "Morning panel should be visible by default");
  assert.equal(await panels.nth(1).isVisible(), false, "Evening panel should be hidden by default");

  await tabs.nth(1).click();
  assert.equal(await panels.nth(0).isVisible(), false, "Morning panel should hide after switching tabs");
  assert.equal(await panels.nth(1).isVisible(), true, "Evening panel should become visible");
  for (const country of ["台灣市場", "馬來西亞市場", "美國盤前與今夜推演"]) {
    assert.equal(await page.locator(".desktop-toc li:not([hidden]) a", { hasText: country }).count(), 1, `Evening navigation should expose ${country}`);
  }
  assert.equal(await page.locator(".desktop-toc li:not([hidden]) a", { hasText: "全球市場與研究" }).count(), 0);

  await page.locator(".desktop-toc li:not([hidden]) a", { hasText: "馬來西亞市場" }).click();
  const headingTop = await page.locator("#馬來西亞市場").evaluate((heading) => heading.getBoundingClientRect().top);
  assert.ok(headingTop >= 88, `Market navigation target should remain visible below the sticky header; received ${headingTop}px`);

  await tabs.nth(1).press("ArrowLeft");
  assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true", "Arrow keys should switch tabs");

  await page.goto(`${baseUrl}/briefs/2026-09-21/`, { waitUntil: "networkidle" });
  assert.equal(await page.getByRole("tab").count(), 3, "Legacy Daily Brief should retain three session tabs");
  assert.deepEqual(
    await page.getByRole("tab").evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label"))),
    ["台股盤前", "主要市場晚間更新", "全球市場與研究"],
    "Legacy tab labels should remain unchanged",
  );

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
    "/briefs/2026-09-23/",
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

  await page.goto(`${baseUrl}/briefs/2026-09-23/`, { waitUntil: "networkidle" });
  const mobileTabHeight = await page.locator(".session-switcher").evaluate((element) =>
    Math.round(element.getBoundingClientRect().height),
  );
  assert.ok(mobileTabHeight <= 56, `Mobile tab control should stay slim; received ${mobileTabHeight}px`);
  assert.deepEqual(
    await page.locator(".tab-label-compact").allTextContents(),
    ["早間", "晚間"],
    "Mobile tabs should use compact labels",
  );
  assert.deepEqual(
    await page.getByRole("tab").evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label"))),
    ["早間市場推演", "晚間市場推演"],
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
    for (const route of ["/", "/briefs/", "/briefs/2026-09-23/", "/trends/ai-infrastructure-capital-cycle/", "/about/"]) {
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
