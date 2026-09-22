# SECURRENT Research Notes

This directory is an unpublished evidence ledger. It is intentionally outside Astro Content Collections and must never receive a public route.

Create one file per publishing date: `research-notes/YYYY-MM-DD.md`.

## Required Structure

```md
# YYYY-MM-DD Research Ledger

## Morning Run

| Source | URL | Market | Claim supported | Published/fetched date | Status | Used publicly |
| --- | --- | --- | --- | --- | --- | --- |

## Evening Run

| Source | URL | Market | Claim supported | Published/fetched date | Status | Used publicly |
| --- | --- | --- | --- | --- | --- | --- |

## Excluded Material

- Record duplicate confirmations, irrelevant facts, and unavailable fields that were intentionally excluded.
```

## Status Values

- `Official`: exchange, regulator, central bank, government agency, or company filing.
- `Secondary`: credible reporting used when a primary source is unavailable or for market context.
- `Unconfirmed`: one credible secondary source exists, but official confirmation is unavailable after one retry.
- `Unavailable`: the field could not be retrieved after one retry and was not inferred.

Each run may contain no more than eight effective sources. Once an official figure is recorded, do not add duplicate confirmations of the same figure. `Used publicly` is `Yes` only when the source supports a conclusion that appears in the public article.

