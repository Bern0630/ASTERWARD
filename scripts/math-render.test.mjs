import test from "node:test";
import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

test("Astro renders display math as KaTeX instead of raw LaTeX", async () => {
  const source = resolve("src/content/trends/2099-01-01-math-render-test.md");
  const output = resolve("dist/trends/2099-01-01-math-render-test/index.html");
  await writeFile(source, `---
title: "Math render test"
date: 2099-01-01
type: "trend"
summary: "Temporary math rendering fixture."
tags: []
lang: "zh"
---

$$
\\frac{a}{b}
$$
`, "utf8");

  try {
    const result = spawnSync(process.execPath, ["node_modules/astro/bin/astro.mjs", "build"], {
      cwd: resolve("."),
      encoding: "utf8",
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" }
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const html = await readFile(output, "utf8");
    assert.match(html, /class="katex"/);
    assert.doesNotMatch(html, /<p>\$\$/);
  } finally {
    await rm(source, { force: true });
  }
});
