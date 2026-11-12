# Samline Utils

Small, framework-agnostic utilities built on JavaScript, CSS and HTML. Each one is published to npm on its own, and every package is documented, with live examples, on one site: [samline.github.io/utils](https://samline.github.io/utils/).

## Table of contents

- [Packages](#packages)
- [Principles](#principles)
- [Repository map](#repository-map)
- [Development](#development)
- [Releasing](#releasing)
- [License](#license)

## Packages

| Package                                      | What it does                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| [`@samline/debounce`](packages/debounce)     | `debounce`, `throttle` and `rafThrottle` with `cancel`, `flush` and `pending`. |
| [`@samline/is-visible`](packages/is-visible) | Enter and leave callbacks for many elements on shared IntersectionObservers.   |

## Principles

- **Agnostic first.** The core is plain JavaScript, CSS and HTML. React, Vue and Svelte adapters exist only when they add an idiomatic API, and are optional peer dependencies.
- **Progressive enhancement.** Content stays visible and usable without JavaScript, and in browsers without the modern API.
- **Accessible by default.** Packages respect `prefers-reduced-motion`, keyboard use and assistive technology.
- **Safe on the server.** No DOM access at import time. Without a DOM, calls return no-op cleanups.
- **Small and measured.** Every entry point has a gzip size budget enforced in CI.
- **Reused internally.** Packages build on each other (for example `is-visible` for visibility). Shared helpers from `packages/internal` are bundled at build time, so published packages stay dependency-free.

## Repository map

```text
packages/
  internal/      Private helpers (auto-init, data-* readers, reduced motion, targets). Never published.
  debounce/      @samline/debounce
  is-visible/    @samline/is-visible
site/            Astro catalog and docs, generated from each package's package.json, site.json and README.md
tests/e2e/       Playwright tests in Chromium, Firefox and WebKit against the built browser bundles
scripts/         Size budgets and repository checks
.changeset/      Pending release notes
```

Each package contains `src/` (`core`, `vanilla`, `browser`, optional framework adapters), `test/`, `README.md`, `site.json` (catalog metadata) and its own size budget in `package.json`.

## Development

Requires Bun 1.4+ and Node 20+.

```sh
bun install
bun run check        # typecheck, unit tests with coverage, build, size budgets, e2e
bun run site:dev     # http://127.0.0.1:4360/utils/
```

The first e2e run needs the browsers: `bunx playwright install chromium firefox webkit`.

## Releasing

1. Add a changeset with every user-facing change: `bun run changeset`.
2. Merging to `main` opens or updates a **Version Packages** pull request.
3. Merging that pull request publishes the new versions to npm (it needs the `NPM_TOKEN` secret) and deploys the site.

Before merging the Version Packages pull request, check that every pinned CDN URL in the READMEs matches the new versions.

## License

MIT © Samuel Olvera (samline)
