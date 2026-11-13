# @samline/horizontal-scroll

Pin a section and move its row of content sideways as the page scrolls down, for galleries, timelines and showcases, with keyboard focus, media queries, reduced motion and a native scroll fallback. For vanilla JavaScript, any framework and plain HTML.

[Demo](https://samline.github.io/utils/horizontal-scroll/) · [Examples](https://samline.github.io/utils/horizontal-scroll/examples/) · [Documentation](https://samline.github.io/utils/docs/horizontal-scroll/) · [Changelog](CHANGELOG.md)

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
npm install @samline/horizontal-scroll
```

```sh
pnpm add @samline/horizontal-scroll
```

```sh
bun add @samline/horizontal-scroll
```

Any modern browser with `position: sticky`; without JavaScript the row keeps your CSS. On the server, every function is inert. No runtime dependencies.

## Quick start

```js
import { autoHorizontalScroll } from '@samline/horizontal-scroll'

autoHorizontalScroll()
```

```html
<section data-horizontal-scroll aria-label="Gallery">
  <div data-horizontal-scroll-track class="row">
    <article class="card">…</article>
    <article class="card">…</article>
    <article class="card">…</article>
  </div>
</section>
```

```css
/* The fallback: a native horizontal scroll. */
[data-horizontal-scroll] {
  overflow-x: auto;
}
.row {
  display: flex;
  gap: 1.5rem;
  height: 100vh;
  align-items: center;
}
.card {
  flex: 0 0 min(70vw, 28rem);
}
```

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle. It sets up every `[data-horizontal-scroll]` as soon as the DOM is ready. Pin the version in production.

```html
<script
  src="https://cdn.jsdelivr.net/npm/@samline/horizontal-scroll@1.0.0/dist/browser/horizontal-scroll.global.js"
  defer
></script>
```

The bundle defines `window.HorizontalScroll`. Add `data-manual` to the script tag and call `HorizontalScroll.auto(options)` to start it with your own options.

## Capabilities

### Pinned, without hijacking the scroll

The section grows exactly tall enough to cross its row, the row pins with `position: sticky`, and its `translate` follows the page scroll once per frame. Wheel, touch, keys and scrollbars keep working as usual; at the end, the page carries on.

### A real fallback

Without JavaScript, outside your `media` query or when the visitor prefers reduced motion, nothing is pinned or resized and the section is left to your CSS, such as a native swipeable row. `data-horizontal-scroll-state` tells the two states apart.

### Keyboard friendly

When focus lands on a card that is off to the side, the page scrolls until it is fully in view, so keyboard users never lose track of focus.

### Any layout

Pin below a fixed header (`top`), cross faster or slower (`speed`), work inside a scroll container (`root`), and drive progress bars with the `--horizontal-scroll-progress` variable or `onProgress`. Images and fonts that change the row's size are measured again on their own.

## API at a glance

| API                                   | Purpose                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `autoHorizontalScroll(options?)`      | Set up every `[data-horizontal-scroll]`, including sections added later. |
| `horizontalScroll(section, options?)` | Set up one section. Returns `{ active, progress, refresh, destroy }`.    |
| `onProgress(state)`                   | The progress changed: `{ progress, x, distance }`.                       |
| `data-horizontal-scroll-*` attributes | Track, top, speed, media and focus per section.                          |

### Entrypoints

| Entrypoint                           | When to use                                                     |
| ------------------------------------ | --------------------------------------------------------------- |
| `@samline/horizontal-scroll`         | ESM or CommonJS, `horizontalScroll` and `autoHorizontalScroll`. |
| `@samline/horizontal-scroll/vanilla` | `horizontalScroll` as the default export.                       |
| `@samline/horizontal-scroll/browser` | Classic script that defines `window.HorizontalScroll`.          |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/horizontal-scroll/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/horizontal-scroll/examples/) with complete and separate source files.

| Guide                                                                                      | What it covers                                                            |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/horizontal-scroll/getting-started/)    | npm, CDN and the first section.                                           |
| [API reference](https://samline.github.io/utils/docs/horizontal-scroll/reference/api/)     | `horizontalScroll`, `autoHorizontalScroll` and `window.HorizontalScroll`. |
| [Options](https://samline.github.io/utils/docs/horizontal-scroll/reference/configuration/) | Attributes and options.                                                   |
| [Layouts](https://samline.github.io/utils/docs/horizontal-scroll/guides/layouts/)          | Headers, fallbacks, focus, scroll containers and sticky pitfalls.         |
| [Frameworks](https://samline.github.io/utils/docs/horizontal-scroll/guides/frameworks/)    | React, Vue, Svelte, Astro and page swaps.                                 |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/horizontal-scroll/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [Horizontal Scroll skill](https://samline.github.io/utils/skills/horizontal-scroll/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/horizontal-scroll/SKILL.md) into a `horizontal-scroll/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/horizontal-scroll
curl --fail --location https://samline.github.io/utils/skills/horizontal-scroll/SKILL.md \
  --output .agents/skills/horizontal-scroll/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
