# Pages CI Diagnostics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the GitHub Pages verification step expose every failed assertion with enough evidence to identify the macOS/Ubuntu difference.

**Architecture:** Move verification behavior into a small importable module that collects named failures. Retain `scripts/verify-site.mjs` as the production CLI gate so the workflow and deploy architecture remain unchanged.

**Tech Stack:** Node.js 22, built-in `node:test`, Astro static output, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-12-pages-ci-diagnostics-design.md`

## Global Constraints

- Do not weaken, remove, or bypass publication checks.
- Do not modify articles, routes, styling, or GitHub Pages settings.
- Add no dependency.
- Do not commit or push.

## Review Focus

- Multiple simultaneous failures must all appear in one result.
- A clean generated site must produce no failures.
- Missing files must be named precisely.
- File-system traversal must behave consistently on macOS and Ubuntu.
- The CLI must exit 1 on failure and 0 on success.

---

### Task 1: Structured generated-site verification

**Files:**
- Create: `scripts/verify-site-lib.mjs`
- Create: `scripts/verify-site.test.mjs`
- Modify: `scripts/verify-site.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: a repository root containing `dist`, `src`, `public`, and `OLD_VERSION`.
- Produces: `verifyGeneratedSite(rootDir): string[]`, returning complete human-readable failures.

- [x] **Step 1: Write failing tests**

Add tests proving a controlled broken fixture returns multiple named failures, a missing required file includes its path, and a valid repository returns an empty failure array.

- [x] **Step 2: Run tests and verify RED**

Run: `node --test scripts/verify-site.test.mjs`

Expected: FAIL because `verifyGeneratedSite` does not exist.

- [x] **Step 3: Implement the minimal collector**

Move current checks behind `verifyGeneratedSite(rootDir)`. Replace early `process.exit(1)` calls with named failure collection. Keep the CLI responsible for printing and exit status.

- [x] **Step 4: Run focused and full tests**

Run: `node --test scripts/verify-site.test.mjs`

Run: `pnpm run test:importer`

Expected: all tests pass.

- [x] **Step 5: Run the production build and verifier**

Run: `SITE='https://Bern0630.github.io' BASE_PATH='/ASTERWARD' pnpm run build`

Run: `pnpm run verify`

Expected: build succeeds and verification prints the existing success message.

- [x] **Step 6: Review the diff without committing**

Run: `git diff --check && git status --short`

Expected: only the spec, plan, verifier implementation, verifier tests, and package test command are changed.

