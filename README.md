# ASTERWARD

ASTERWARD is a content-first static research publication for global market intelligence.

Brand tagline:

> Cross-market signals. Second-order effects.

Positioning:

> Global Market Intelligence & Research

## Architecture

- Astro
- TypeScript
- Astro Content Collections
- Markdown / MDX-ready
- Lightweight CSS
- GitHub Pages deployment with GitHub Actions

No database, CMS, authentication, analytics, trackers or market-data API is included in v1.

## Prerequisites

Install Node.js 20 or newer, then enable pnpm:

```bash
corepack enable
corepack prepare pnpm@10 --activate
```

If `corepack` is unavailable, install pnpm with:

```bash
npm install -g pnpm
```

## Install

```bash
pnpm install
```

## Local

```bash
pnpm run dev
```

## Build

```bash
pnpm run build
```

## Content folders

```text
src/content/briefs/
src/content/trends/
src/content/crossignal/
src/content/second-order/
src/content/deep-dives/
```

## Publish Daily Brief

Create:

```text
src/content/briefs/2026-09-17.md
```

Then:

```bash
git add .
git commit -m "publish: daily brief 2026-09-17"
git push
```

The homepage automatically finds the latest brief by `date`.

## Publish Trend Explorer

Create:

```text
src/content/trends/my-new-trend.md
```

Use:

```text
templates/trend-explorer.md
```

## Publish Crossignal

Create:

```text
src/content/crossignal/my-cross-market-signal.md
```

Use:

```text
templates/crossignal.md
```

## Publish Second Order

Create:

```text
src/content/second-order/my-second-order-note.md
```

Use:

```text
templates/second-order.md
```

## Publish Deep Dive

Create:

```text
src/content/deep-dives/my-deep-dive.md
```

Use:

```text
templates/deep-dive.md
```

## Frontmatter

Every article must include:

```yaml
---
title: "Article Title"
date: 2026-09-17
type: "daily"
summary: "Short summary for archive pages and SEO."
tags: ["Rates", "Credit"]
---
```

Allowed `type` values:

- `daily`
- `trend`
- `crossignal`
- `second-order`
- `deep-dive`

## GitHub Pages

The workflow is:

```text
.github/workflows/deploy.yml
```

It runs on every push to `main`:

1. Checkout
2. Install dependencies with `pnpm install --frozen-lockfile`
3. Build with `pnpm run build`
4. Upload `dist`
5. Deploy to GitHub Pages

## Repo base path

For a repository named `securrent`, GitHub Pages commonly serves the site at:

```text
https://username.github.io/securrent/
```

The deploy workflow sets:

```text
BASE_PATH=/{repository-name}
```

If your repo name changes, update the repository variable:

```text
BASE_PATH=/new-repo-name
```

If publishing to a user or organization root domain such as:

```text
https://username.github.io/
```

set:

```text
BASE_PATH=/
```

## Site URL

Set the GitHub repository variable:

```text
SITE=https://username.github.io/securrent
```

For local builds, the default placeholder is `https://example.com`.

## Custom domain

When using a custom domain:

1. Configure the custom domain in GitHub Pages settings.
2. Set the repository variable:

```text
SITE=https://securrent.com
BASE_PATH=/
```

3. If needed, add a `public/CNAME` file containing:

```text
securrent.com
```

## Edit brand tagline

Edit:

```text
src/data/site.ts
```

## Edit About content

Edit:

```text
src/pages/about.astro
```

## Templates

```text
templates/daily-brief.md
templates/trend-explorer.md
templates/crossignal.md
templates/second-order.md
templates/deep-dive.md
```


## Bilingual Publishing

Chinese is the primary language. English versions live under an `en/` folder inside each content collection.

Daily Brief example:

```text
src/content/briefs/2026-09-17.md
src/content/briefs/en/2026-09-17.md
```

Both files should share the same `translationKey`:

```yaml
lang: "zh"
translationKey: "brief-2026-09-17"
```

English version:

```yaml
lang: "en"
translationKey: "brief-2026-09-17"
```

The site automatically links matching translations when both versions exist.

## GPT Content Prompt

Use this file to ask GPT to generate SECURRENT-ready bilingual Markdown:

```text
docs/GPT_CONTENT_PROMPT.md
```
