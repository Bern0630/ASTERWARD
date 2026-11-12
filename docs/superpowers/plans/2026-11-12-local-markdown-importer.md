# ASTERWARD Local Markdown Importer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Finder-launchable macOS command that imports one Markdown article into ASTERWARD, validates the site, starts the local Astro server, and opens the imported article in a browser.

**Architecture:** A small Node module owns deterministic content parsing, metadata normalization, slug generation, frontmatter output, and math-delimiter conversion. A separate interactive CLI handles prompts, filesystem writes, build execution, server startup, and browser opening; a thin `.command` wrapper supplies the Finder file picker. Missing site files are recovered from the GitHub remote through an isolated temporary clone without changing the current Git index.

**Tech Stack:** Node.js ESM, Astro 7, TypeScript, macOS AppleScript, `node:test`, remark-math, rehype-katex, KaTeX

**Spec:** `docs/superpowers/specs/2026-11-12-local-markdown-importer-design.md`

## Global Constraints

- Do not run `git add`, commit, push, pull, reset, or deployment commands.
- Do not overwrite an existing article or modify the selected source file.
- Do not expose the Astro development server outside localhost.
- The finished importer must not install or upgrade packages when the user runs it.
- Preserve article body text, citations, links, and disclaimers except the exact standalone `\[` / `\]` to `$$` normalization.
- Recover only missing project files from a temporary remote checkout; preserve all current workspace files and the existing Git index.
- Git operations remain the user's responsibility, so the plan contains no commit steps.

## Review Focus

- A selected Markdown path contains spaces or Chinese characters: import and preview must still succeed.
- The source has no frontmatter, partial frontmatter, or quoted YAML values: metadata defaults must be correct and body text retained once.
- The derived slug already exists: stop before writing and report the exact conflicting destination.
- The build or server fails: show the underlying command error and do not claim that preview opened successfully.
- A stale local Astro server or occupied default port exists: detect a usable localhost URL and avoid starting duplicate servers blindly.

---

### Task 1: Recover the missing Astro site without touching user Git state

**Files:**
- Recover if missing: `.github/workflows/deploy.yml`
- Recover if missing: `public/brand/*`
- Recover if missing: `src/components/*`
- Recover if missing: `src/content/trends/*`
- Recover if missing: `src/data/site.ts`
- Recover if missing: `src/layouts/*`
- Recover if missing: `src/lib/*`
- Recover if missing: `src/pages/*`
- Recover if missing: `src/styles/global.css`
- Recover if missing: `OLD_VERSION/**`

**Interfaces:**
- Consumes: remote `origin` URL from `.git/config`
- Produces: a buildable working tree while preserving all pre-existing files and `.git/index`

- [ ] **Step 1: Record the current safety baseline**

Run `git status --porcelain=v2`, hash `.git/index`, and list missing paths named by the index. Save the outputs under `/private/tmp` so recovery can be compared without writing project files.

- [ ] **Step 2: Inspect the remote without modifying the repository**

Run `git ls-remote origin` and verify that the remote exposes a branch with the complete Astro site. If it does not, stop this task and report that rebuilding the site is outside the approved recovery path.

- [ ] **Step 3: Clone the remote into a temporary directory**

Use `mktemp -d` and a shallow, read-only clone. Confirm the checkout contains `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, and `src/content/trends/` before copying anything.

- [ ] **Step 4: Restore missing files only**

Copy each required file from the temporary checkout only when its workspace destination does not exist. Never replace existing workspace content.

- [ ] **Step 5: Verify recovery safety and baseline build**

Run `pnpm run build`, compare the `.git/index` hash with Step 1, and verify the user-authored humanized Markdown remains byte-identical. Expected: build succeeds and the index hash is unchanged.

### Task 2: Implement and test deterministic article transformation

**Files:**
- Create: `scripts/lib/article-importer.mjs`
- Create: `scripts/article-importer.test.mjs`

**Interfaces:**
- Consumes: `sourceText: string`, `sourcePath: string`, optional metadata overrides
- Produces: `parseArticle(sourceText)`, `normalizeDisplayMath(body)`, `deriveDefaults(parsed, sourcePath, now)`, `slugifyArticle(title, date)`, and `serializeArticle(metadata, body)`

- [ ] **Step 1: Write failing parser and preservation tests**

Use `node:test` to assert that files with no, partial, and complete frontmatter produce one body copy; quoted YAML titles are unquoted; citations, links, and disclaimers remain byte-for-byte unchanged.

- [ ] **Step 2: Run parser tests and confirm failure**

Run: `node --test scripts/article-importer.test.mjs`

Expected: FAIL because `scripts/lib/article-importer.mjs` does not exist.

- [ ] **Step 3: Implement `parseArticle(sourceText: string)`**

Return `{ frontmatter: Record<string, unknown>, body: string }`. Parse only the simple scalar/list fields used by ASTERWARD; do not introduce a runtime YAML dependency.

- [ ] **Step 4: Write failing math normalization tests**

Assert that standalone `\[` and `\]` lines become `$$`, inline LaTeX remains untouched, fenced code blocks remain untouched, and already-correct `$$` blocks do not change.

- [ ] **Step 5: Implement `normalizeDisplayMath(body: string): string`**

Track fenced-code state and normalize only standalone display-math delimiter lines outside fences.

- [ ] **Step 6: Write failing metadata, slug, and serialization tests**

Assert required values `type: trend` and `lang: zh`; infer the first H1 as title; use the first substantive paragraph as a bounded summary; preserve supplied tags; create ASCII date-based slugs for Chinese titles; escape YAML quotes and colons safely.

- [ ] **Step 7: Implement defaults, slugging, and serialization**

Implement `deriveDefaults(parsed, sourcePath, now)`, `slugifyArticle(title, date)`, and `serializeArticle(metadata, body)` with the exact required schema from the spec.

- [ ] **Step 8: Run transformation tests**

Run: `node --test scripts/article-importer.test.mjs`

Expected: all tests pass, including paths with spaces and Chinese characters.

### Task 3: Build the interactive importer and safe write path

**Files:**
- Create: `scripts/import-markdown.mjs`
- Create: `scripts/import-markdown.integration.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: source path from `process.argv[2]`, Task 2 transformation functions, interactive terminal input
- Produces: `src/content/trends/<slug>.md`; exit code `0` only after content validation and build succeed

- [ ] **Step 1: Write failing dry-run integration tests**

Run the CLI against temporary fixtures and a temporary content directory. Assert output preview includes title, date, summary, tags, and slug; `--dry-run` writes nothing; paths with spaces work; an existing destination returns nonzero without changing it.

- [ ] **Step 2: Run CLI integration tests and confirm failure**

Run: `node --test scripts/import-markdown.integration.test.mjs`

Expected: FAIL because the CLI does not exist.

- [ ] **Step 3: Implement CLI arguments and interactive confirmation**

Support `node scripts/import-markdown.mjs <source>`, plus test-only `--dry-run`, `--yes`, and `--content-dir <path>`. Show defaults for title, date, summary, comma-separated tags, and slug; allow each value to be accepted or edited.

- [ ] **Step 4: Implement collision-safe writing and cleanup**

Write through a temporary sibling file and rename only after validation. If the destination already exists, exit nonzero. If build validation fails, remove only the newly imported destination and retain the source.

- [ ] **Step 5: Add package scripts**

Add `test:importer` for both Node test files and `import:article` for the CLI. Do not alter existing build, preview, or verify commands.

- [ ] **Step 6: Run importer tests**

Run: `pnpm run test:importer`

Expected: all unit and integration tests pass.

### Task 4: Add math rendering to the Astro site

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `astro.config.mjs`
- Modify: `src/layouts/BaseLayout.astro` or the active global stylesheet entry point

**Interfaces:**
- Consumes: Markdown display math normalized to `$$...$$`
- Produces: KaTeX-rendered formulas in built article HTML

- [ ] **Step 1: Add a failing rendering assertion**

Extend the importer integration fixture or site verification to build a sample article and assert its generated HTML contains KaTeX markup and does not display raw `\frac` source.

- [ ] **Step 2: Run the rendering assertion and confirm failure**

Run the targeted test/build command chosen in Step 1.

Expected: FAIL because Astro has no math remark/rehype plugins configured.

- [ ] **Step 3: Add pinned math-rendering dependencies**

Add `remark-math`, `rehype-katex`, and `katex` to project dependencies using pnpm; this is implementation-time setup, not behavior of the finished `.command`.

- [ ] **Step 4: Configure Astro Markdown rendering and KaTeX CSS**

Register `remarkMath` and `rehypeKatex` in `astro.config.mjs`, and load the KaTeX stylesheet from the active global layout or stylesheet entry point.

- [ ] **Step 5: Verify math rendering and full build**

Run the targeted rendering test and `pnpm run build`.

Expected: KaTeX markup is present, raw display delimiters are absent, and the complete site build passes.

### Task 5: Create the Finder-launchable command and local-preview orchestration

**Files:**
- Create: `匯入文章到ASTERWARD.command`
- Create: `scripts/local-preview.mjs`
- Create: `scripts/local-preview.test.mjs`
- Modify: `scripts/import-markdown.mjs`

**Interfaces:**
- Consumes: selected Markdown path and imported `{ destination, slug }`
- Produces: a localhost Astro server URL and browser navigation to `/trends/<slug>/`

- [ ] **Step 1: Write failing preview orchestration tests**

Test free-port selection, detection of an already-responsive ASTERWARD server, timeout/error reporting for a failed child server, and URL generation with encoded slugs.

- [ ] **Step 2: Run preview tests and confirm failure**

Run: `node --test scripts/local-preview.test.mjs`

Expected: FAIL because `scripts/local-preview.mjs` does not exist.

- [ ] **Step 3: Implement local preview orchestration**

Export `findPreviewServer()`, `startPreviewServer(options)`, `waitUntilReady(url, timeoutMs)`, and `articleUrl(baseUrl, slug)`. Bind Astro to `127.0.0.1`; reuse only a server that responds as ASTERWARD.

- [ ] **Step 4: Integrate preview startup with successful import**

After build success, start or reuse the server and open the article URL with macOS `open`. If build or server startup fails, exit nonzero and do not open a misleading page.

- [ ] **Step 5: Create the `.command` wrapper**

Resolve the project directory relative to the wrapper, use `osascript` to choose one `.md` or `.mdx` file, quote the POSIX path safely, invoke the Node CLI, keep Terminal open on error, and exit cleanly on user cancellation.

- [ ] **Step 6: Make the wrapper executable and run automated tests**

Run `chmod +x '匯入文章到ASTERWARD.command'` and `pnpm run test:importer`.

Expected: all transformation, CLI, and preview tests pass.

### Task 6: End-to-end acceptance with the supplied article

**Files:**
- Import: `asterward_rwa_us_stocks_market_structure_20261112_humanized.md`
- Create: `src/content/trends/<confirmed-slug>.md`

**Interfaces:**
- Consumes: the complete Finder/CLI workflow from Tasks 1–5
- Produces: a verified local ASTERWARD article page for the supplied market-structure article

- [ ] **Step 1: Run the command with the supplied article**

Invoke the `.command` workflow with the article path containing the project directory context. Confirm the displayed metadata and accept the defaults unless they conflict with the article.

- [ ] **Step 2: Inspect the generated article source**

Verify required frontmatter, one copy of the body, preserved citations and disclaimer, and converted display-math delimiters.

- [ ] **Step 3: Run all project verification**

Run `pnpm run test:importer`, `pnpm run build`, and any restored project-specific verification that remains compatible with a newly added Chinese-only article.

Expected: importer tests and Astro build pass; legacy bilingual checks are either updated to accept an intentional Chinese-only article or reported separately if they encode an obsolete requirement.

- [ ] **Step 4: Visually verify the browser result**

Open the generated localhost article URL and confirm title, headings, tables, code blocks, references, and the effective-leverage equation render correctly.

- [ ] **Step 5: Confirm Git boundaries**

Run `git status --short` and verify no commit or push occurred and `.git/index` still matches the recorded baseline hash.

