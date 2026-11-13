# @samline/utils

Small, framework-agnostic JavaScript, CSS and HTML utilities. Each one is published to npm on its own and documented with live examples in one place.

[Demo](https://samline.github.io/utils/) · [Examples](https://samline.github.io/utils/examples/) · [Documentation](https://samline.github.io/utils/docs/) · [Changelog](CHANGELOG.md)

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Capabilities](#capabilities)
- [API at a glance](#api-at-a-glance)
- [Documentation](#documentation)
- [Changelog](#changelog)
- [AI agent skill](#ai-agent-skill)
- [License](#license)

## Installation

Install only the packages you need:

```sh
npm install @samline/counter @samline/debounce @samline/is-visible @samline/reveal @samline/scroll-spy @samline/string
```

```sh
pnpm add @samline/counter @samline/debounce @samline/is-visible @samline/reveal @samline/scroll-spy @samline/string
```

```sh
bun add @samline/counter @samline/debounce @samline/is-visible @samline/reveal @samline/scroll-spy @samline/string
```

Every package works in modern browsers and Node 20 or newer, has no runtime dependencies and ships a classic browser script for pages without a build step.

### From source

Requires Bun 1.4+ for the packages and Node 22.12+ for the website.

```sh
bun install
bun run site:install
bun run check
bun run site:dev
```

`bun run check` runs typecheck, unit tests with coverage, the build, size budgets and end-to-end tests in Chromium, Firefox and WebKit. The first e2e run needs `bunx playwright install chromium firefox webkit`.

## Quick start

```js
import { debounce } from '@samline/debounce'
import { isVisible } from '@samline/is-visible'

const search = debounce(query => fetchResults(query), 300)
input.addEventListener('input', () => search(input.value))

isVisible('img[data-src]', {
  once: true,
  rootMargin: '0px 0px 200px 0px',
  visible: (entry, image) => (image.src = image.dataset.src),
})
```

## Capabilities

### Agnostic first

The core of every package is plain JavaScript, CSS and HTML. React, Vue and Svelte adapters exist only when they add an idiomatic API, as optional peer dependencies.

### Progressive enhancement and accessibility

Content stays visible without JavaScript and in browsers without the modern API. Packages respect `prefers-reduced-motion`, keyboard use and assistive technology.

### Safe on the server

No DOM access at import time. Without a DOM, calls return no-op cleanups.

### Small and measured

Every entry point has a gzip size budget enforced in CI. Shared helpers from `packages/internal` are bundled at build time, so published packages stay dependency-free.

## API at a glance

| API                                          | Purpose                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| [`@samline/counter`](packages/counter)       | Numbers that count as they scroll into view, from the value in the HTML.       |
| [`@samline/debounce`](packages/debounce)     | `debounce`, `throttle` and `rafThrottle` with `cancel`, `flush` and `pending`. |
| [`@samline/is-visible`](packages/is-visible) | Enter and leave callbacks for many elements on shared IntersectionObservers.   |
| [`@samline/reveal`](packages/reveal)         | Scroll reveals with CSS effects, cascades, repeat and a CSS-only scrub mode.   |
| [`@samline/scroll-spy`](packages/scroll-spy) | Highlights the navigation link of the section in view, with aria-current.      |
| [`@samline/string`](packages/string)         | Case conversion, slugify, accents, truncate and initials on one word splitter. |

### Entrypoints

| Entrypoint                                    | When to use                                    |
| --------------------------------------------- | ---------------------------------------------- |
| `@samline/<package>`                          | ESM or CommonJS root API.                      |
| `@samline/<package>/react`, `/vue`, `/svelte` | Framework adapters, when the package has them. |
| `@samline/<package>/style.css`                | Stylesheet, when the package has one.          |
| `@samline/<package>/browser`                  | Classic script for HTML / CDN use.             |

## Documentation

The [website](https://samline.github.io/utils/) has a Home, live examples and complete docs for each package.

| Guide                                                               | What it covers                                                                   |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [Counter docs](https://samline.github.io/utils/docs/counter/)       | Installation, attributes, options and formatting of `@samline/counter`.          |
| [Debounce docs](https://samline.github.io/utils/docs/debounce/)     | Installation, API, options and framework adapters of `@samline/debounce`.        |
| [Is Visible docs](https://samline.github.io/utils/docs/is-visible/) | Installation, API, options and framework adapters of `@samline/is-visible`.      |
| [Reveal docs](https://samline.github.io/utils/docs/reveal/)         | Installation, attributes, options, CSS variables and scrub of `@samline/reveal`. |
| [Scroll Spy docs](https://samline.github.io/utils/docs/scroll-spy/) | Installation, options, layouts and frameworks of `@samline/scroll-spy`.          |
| [String docs](https://samline.github.io/utils/docs/string/)         | Every function, the options and how words are split in `@samline/string`.        |
| [Examples](https://samline.github.io/utils/examples/)               | Live previews with complete and separate source files.                           |

### Repository map

```text
packages/
  internal/      Private helpers (auto-init, data-* readers, reduced motion, targets). Never published.
  counter/       @samline/counter: src, tests, README, CHANGELOG and site/ content
  debounce/      @samline/debounce: src, tests, README, CHANGELOG and site/ content
  is-visible/    @samline/is-visible: src, tests, README, CHANGELOG and site/ content
  reveal/        @samline/reveal: src, tests, README, CHANGELOG and site/ content
  scroll-spy/    @samline/scroll-spy: src, tests, README, CHANGELOG and site/ content
  string/        @samline/string: src, tests, README, CHANGELOG and site/ content
site/            Website from package-landing-docs in collection mode
tests/e2e/       Playwright tests in Chromium, Firefox and WebKit against the built bundles
scripts/         Size budgets and repository checks
.changeset/      Pending release notes
```

Each package's `site/` folder holds its catalog metadata, Home copy, live demo, examples, docs articles and agent skill. The website builds one Home, one Examples page and one docs section per package from them.

## Changelog

Each package keeps its own `CHANGELOG.md`, generated from changesets: [counter](packages/counter/CHANGELOG.md), [debounce](packages/debounce/CHANGELOG.md), [is-visible](packages/is-visible/CHANGELOG.md), [reveal](packages/reveal/CHANGELOG.md), [scroll-spy](packages/scroll-spy/CHANGELOG.md) and [string](packages/string/CHANGELOG.md). This repository's [CHANGELOG.md](CHANGELOG.md) records changes to the monorepo itself.

### Releasing

Publishing to npm is manual, as in the other `@samline` packages; CI only verifies the code and deploys the website.

1. Add a changeset with every user-facing change: `bun run changeset`.
2. Apply pending changesets: `bun run version-packages`.
3. Update pinned CDN URLs in the READMEs, docs and skills, then commit and push. Pushing to `main` deploys the site.
4. Publish from your machine, logged in to npm: `bun run release`.
5. Push the tags: `git push --follow-tags`.

## AI agent skill

Each package has an integration skill for AI agents, maintained in its `site/SKILL.md` and served by the website:

- [Counter skill](https://samline.github.io/utils/skills/counter/SKILL.md) — source: [packages/counter/site/SKILL.md](packages/counter/site/SKILL.md)
- [Debounce skill](https://samline.github.io/utils/skills/debounce/SKILL.md) — source: [packages/debounce/site/SKILL.md](packages/debounce/site/SKILL.md)
- [Is Visible skill](https://samline.github.io/utils/skills/is-visible/SKILL.md) — source: [packages/is-visible/site/SKILL.md](packages/is-visible/site/SKILL.md)
- [Reveal skill](https://samline.github.io/utils/skills/reveal/SKILL.md) — source: [packages/reveal/site/SKILL.md](packages/reveal/site/SKILL.md)
- [Scroll Spy skill](https://samline.github.io/utils/skills/scroll-spy/SKILL.md) — source: [packages/scroll-spy/site/SKILL.md](packages/scroll-spy/site/SKILL.md)
- [String skill](https://samline.github.io/utils/skills/string/SKILL.md) — source: [packages/string/site/SKILL.md](packages/string/site/SKILL.md)

Download a `SKILL.md` into a folder with the package name in your agent's supported skill directory, for example `.agents/skills/debounce/SKILL.md`. Discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
