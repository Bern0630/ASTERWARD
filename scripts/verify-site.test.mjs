import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { verifyGeneratedSite } from "./verify-site-lib.mjs";

test("a broken repository reports multiple named failures in one run", () => {
  const root = mkdtempSync(join(tmpdir(), "asterward-verify-broken-"));

  try {
    const failures = verifyGeneratedSite(root);

    assert.ok(failures.length > 1);
    assert.ok(failures.some((failure) => failure.startsWith("required-files:")));
    assert.ok(failures.some((failure) => failure.startsWith("archive:")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("a missing required file is reported with its repository-relative path", () => {
  const root = mkdtempSync(join(tmpdir(), "asterward-verify-missing-"));

  try {
    const failures = verifyGeneratedSite(root);

    assert.ok(
      failures.some((failure) => failure.includes("dist/index.html")),
      failures.join("\n")
    );
    assert.ok(
      failures.some((failure) => failure.includes("src/styles/global.css")),
      failures.join("\n")
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("the current generated site has no verification failures", () => {
  assert.deepEqual(verifyGeneratedSite(process.cwd()), []);
});
