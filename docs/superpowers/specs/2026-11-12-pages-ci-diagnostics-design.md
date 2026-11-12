# Pages CI Diagnostics Design

## Intent

Find the exact reason GitHub Pages stops at `Verify generated site`, while keeping article content, presentation, and the deployment architecture unchanged.

## Goals

- Make every generated-site assertion report its own name and relevant evidence.
- Report all failed assertions in one CI run instead of stopping at the first failure.
- Keep a non-zero exit status whenever any assertion fails.
- Preserve the current successful local verification message and deployment gate.

## Non-goals

- Do not weaken or remove publication checks.
- Do not change articles, routes, styling, or GitHub Pages settings.
- Do not commit or push; the user will do that through GitHub Desktop.

## Constraints

- Use Node.js built-ins only; add no dependency.
- The output must be useful on both macOS and Ubuntu.
- Existing successful local builds must continue to pass.

## Approaches

1. **Structured assertion collector (selected):** collect named failures and print all of them at the end. This gives one complete diagnostic run while preserving the gate.
2. Add ad-hoc `console.log` calls around suspected ordering checks. Faster to write, but incomplete and likely to require repeated pushes.
3. Remove environment-sensitive checks. Rejected because it could allow a broken site to deploy.

## Design

Extract the generated-site checks into an importable verifier that returns named failures. Keep `scripts/verify-site.mjs` as the CLI entry point: it prints the failures and exits with code 1, or prints the existing success message. Tests create controlled fixtures that prove multiple failures are reported together and success still exits cleanly.

