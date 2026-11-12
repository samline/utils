# AGENTS

Operating rules for AI agents working in this monorepo. Public documentation (READMEs, site, changesets) is written in English.

## Before changing code

- Read the package's `README.md` and tests first. The README is also its documentation page on the site.
- Code brought in from other projects is never copied as-is. Audit it, optimize it, document it and test it.
- Before proposing a new package, check that an existing `@samline/*` package (formatter, forms, drawer, notify, ticker, autocomplete) does not already cover it.

## Package rules

- Framework-agnostic core in JS, CSS and HTML. Framework adapters only when they add an idiomatic API, as optional peers.
- No DOM access at import time. Without a DOM, calls are no-ops.
- Respect `prefers-reduced-motion`. Content must stay visible without JavaScript.
- Reuse the primitives: `@samline/is-visible` for IntersectionObserver, `@samline/debounce` for timing, `@samline/internal` for auto-init, `data-*` readers and targets. Bundle them with `noExternal` so published packages stay dependency-free.
- Every public entry gets a size budget in `package.json` → `size`.
- Hybrid CSS/JS packages test both paths (forced `mode`) in Playwright.

## Checks

`bun run check` must pass: typecheck, unit tests with coverage thresholds, build, size budgets, and e2e in Chromium, Firefox and WebKit.

## Releases

- Every user-facing change needs a changeset (`bun run changeset`) with the correct semver bump.
- Publishing runs in CI with `NPM_TOKEN`. Do not add `--provenance` unless trusted publishing is configured end to end.
- Before a release, update pinned CDN URLs in READMEs to the new versions.
- Never add AI attribution to commits, tags or pull requests.
