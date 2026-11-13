# @samline/scroll-to

Smooth scrolling to anchors, elements and positions that lands where it should: below fixed headers, centered in strips or at the nearest edge, with easing, interruption, focus, history and a promise for when it arrives. For vanilla JavaScript, any framework and plain HTML.

[Demo](https://samline.github.io/utils/scroll-to/) · [Examples](https://samline.github.io/utils/scroll-to/examples/) · [Documentation](https://samline.github.io/utils/docs/scroll-to/) · [Changelog](CHANGELOG.md)

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [HTML / CDN](#html--cdn)
- [Capabilities](#capabilities)
- [API at a glance](#api-at-a-glance)
- [Documentation](#documentation)
- [Changelog](#changelog)
- [AI agent skill](#ai-agent-skill)
- [License](#license)

## Installation

```sh
npm install @samline/scroll-to
```

```sh
pnpm add @samline/scroll-to
```

```sh
bun add @samline/scroll-to
```

Any modern browser; without JavaScript, links still jump to their sections. On the server, every function is inert. No runtime dependencies.

## Quick start

```js
import { autoScrollTo } from '@samline/scroll-to'

autoScrollTo({ offset: '#header' })
```

```html
<header id="header">
  <a href="#pricing">Pricing</a>
</header>

<section id="pricing">…</section>
<button type="button" data-scroll-to="top">Back to top</button>
```

From your own code:

```js
import { scrollTo } from '@samline/scroll-to'

const arrived = await scrollTo('#faq', { offset: '#header', duration: 600 })
```

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle. It handles same-page `#id` links and `[data-scroll-to]` as soon as the DOM is ready. Pin the version in production.

```html
<script
  src="https://cdn.jsdelivr.net/npm/@samline/scroll-to@1.0.0/dist/browser/scroll-to.global.js"
  defer
></script>
```

The bundle defines `window.ScrollTo`. Add `data-manual` to the script tag and call `ScrollTo.auto(options)` to start it with your own options.

## Capabilities

### Lands where it should

Keep space for a fixed header with `offset` (pixels, a percentage, or the header element measured live), align to the start, center, end or nearest edge on both axes, and land precisely even when images load on the way: the destination is measured on every frame.

### Accessible like a native jump

Links move keyboard focus to their target on arrival and push the `#id` to the URL, so Tab continues from there and Back returns. Reduced motion jumps instead of animating.

### The visitor stays in control

A wheel, a touch or a key press stops the scroll at once, and a new scroll replaces the running one. Every scroll returns a promise of `true` (arrived) or `false` (interrupted).

### Any container

Scroll the page or any box, and center the selected tab of a horizontal strip without moving the page. Triggers can carry their own offset, container, alignment and duration as attributes.

## API at a glance

| API                                | Purpose                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| `autoScrollTo(options?)`           | Handle same-page links and `[data-scroll-to]` with one listener. Returns `{ destroy }`. |
| `scrollTo(target, options?)`       | Scroll to an element, `#id`, selector, `'top'` or position. Resolves `true` on arrival. |
| `scrollPosition(target, options?)` | Where it would scroll, without moving.                                                  |
| `cancelScroll(container?)`         | Stop the running scroll.                                                                |

### Entrypoints

| Entrypoint                   | When to use                                    |
| ---------------------------- | ---------------------------------------------- |
| `@samline/scroll-to`         | ESM or CommonJS, every function.               |
| `@samline/scroll-to/vanilla` | `scrollTo` as the default export.              |
| `@samline/scroll-to/browser` | Classic script that defines `window.ScrollTo`. |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/scroll-to/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/scroll-to/examples/) with complete and separate source files.

| Guide                                                                              | What it covers                                                                      |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/scroll-to/getting-started/)    | npm, CDN and the first links.                                                       |
| [API reference](https://samline.github.io/utils/docs/scroll-to/reference/api/)     | `scrollTo`, `scrollPosition`, `cancelScroll`, `autoScrollTo` and `window.ScrollTo`. |
| [Options](https://samline.github.io/utils/docs/scroll-to/reference/configuration/) | Options, targets and attributes.                                                    |
| [Layouts](https://samline.github.io/utils/docs/scroll-to/guides/layouts/)          | Fixed headers, skip links, containers, tabs and history.                            |
| [Frameworks](https://samline.github.io/utils/docs/scroll-to/guides/frameworks/)    | React, Vue, Svelte, Astro and client-side routers.                                  |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/scroll-to/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [Scroll To skill](https://samline.github.io/utils/skills/scroll-to/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/scroll-to/SKILL.md) into a `scroll-to/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/scroll-to
curl --fail --location https://samline.github.io/utils/skills/scroll-to/SKILL.md \
  --output .agents/skills/scroll-to/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
