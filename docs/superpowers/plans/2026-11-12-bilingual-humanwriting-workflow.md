# ASTERWARD Bilingual HumanWriting Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a safe Chinese-first bilingual publishing workflow and create the paired HumanWriting English edition of the current RWA article.

**Architecture:** The importer always writes a stable translation key and prints a Codex/HumanWriting handoff message. Article pages expose a language switch only when `findTranslation()` returns a real counterpart. The English RWA edition is a separate content-collection file with matching identity metadata.

**Tech Stack:** Node.js ESM, Astro 7, Markdown content collections, CSS, HumanWriting editorial workflow

**Spec:** `docs/superpowers/specs/2026-11-12-bilingual-humanwriting-workflow-design.md`

## Global constraints

- Do not call an external translation API.
- Do not run Git commit, push, pull, reset, or deployment commands.
- Preserve every technical claim, number, source URL, formula, caveat, and disclaimer.
- Do not display a language link unless the translated file exists.

## Review focus

- Chinese-only article must not render a broken EN link.
- Paired articles must link to each other in both directions.
- Importing an article with existing frontmatter must emit exactly one translation key.
- English Markdown must preserve all eight reference URLs and the KaTeX equation.
- HumanWriting edits must not turn hypotheses or possible transmission paths into confirmed causation.

### Task 1: Translation-aware language navigation

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `scripts/verify-site.mjs`

- [ ] Add failing verification for hiding language links on unpaired article pages and showing them for paired pages.
- [ ] Change Header rendering so article language links require `alternateUrl`; keep language switching on non-article pages.
- [ ] Build and run site verification.

### Task 2: Importer translation metadata and handoff

**Files:**
- Modify: `scripts/lib/article-importer.mjs`
- Modify: `scripts/article-importer.test.mjs`
- Modify: `scripts/import-markdown.mjs`
- Modify: `scripts/import-markdown.integration.test.mjs`
- Modify: `README.md`

- [ ] Add failing tests for `translationKey` serialization and the HumanWriting handoff output.
- [ ] Generate `translationKey` from the confirmed slug and serialize it once.
- [ ] Print the Chinese source path and exact next step after successful import.
- [ ] Document the bilingual workflow and run importer tests.

### Task 3: Current RWA English edition

**Files:**
- Modify: `src/content/trends/2026-11-12-rwa.md`
- Create: `src/content/trends/en/2026-11-12-rwa.md`

- [ ] Add `translationKey: "2026-11-12-rwa"` to the Chinese article.
- [ ] Translate and revise the full article using HumanWriting, preserving structure, tables, formula, references, and disclaimer.
- [ ] Run structural checks for headings, URLs, references, and paired metadata.

### Task 4: End-to-end bilingual verification

**Files:**
- Modify if required: `scripts/verify-site.mjs`

- [ ] Run all importer tests, Astro check/build, editorial verification, and site verification.
- [ ] Inspect both generated pages for one H1, KaTeX output, and reciprocal language URLs.
- [ ] Verify the Git index hash is unchanged and report any deferred minor warnings.

