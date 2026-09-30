# ASTERWARD

ASTERWARD is a bilingual, content-first market research publication built with Astro.

## Current editorial state

The original daily intelligence library has been removed from the public build while the research format is redesigned. No archived article is deleted. The complete first version is preserved under:

```text
OLD_VERSION/
```

New public research continues to use the existing Astro Content Collection structure:

```text
src/content/briefs/
src/content/trends/
src/content/crossignal/
src/content/second-order/
src/content/deep-dives/
```

Do not move files from `OLD_VERSION` back into `src/content` unless an archived article is intentionally republished after editorial review.

## Architecture

- Astro
- TypeScript
- Astro Content Collections
- Markdown / MDX-ready
- Static GitHub Pages deployment

## Local development

```bash
pnpm install
pnpm run dev
```

## Verification

```bash
node scripts/verify-editorial.mjs
pnpm run build
pnpm run verify
```

## Publishing principle

A new article begins with a market question that is interesting enough to investigate. Evidence from the United States, Taiwan, and Malaysia is used only when it changes the answer. Research is not published merely to fill a daily schedule.
