# @samline/scroll-spy

Highlight the navigation link of the section being read, for tables of contents, docs sidebars and one-page menus, with `aria-current`, steady clicks, scroll containers and long navigations that follow along. For vanilla JavaScript, any framework and plain HTML.

[Demo](https://samline.github.io/utils/scroll-spy/) · [Examples](https://samline.github.io/utils/scroll-spy/examples/) · [Documentation](https://samline.github.io/utils/docs/scroll-spy/) · [Changelog](CHANGELOG.md)

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
npm install @samline/scroll-spy
```

```sh
pnpm add @samline/scroll-spy
```

```sh
bun add @samline/scroll-spy
```

Any modern browser; without JavaScript the links still jump to their sections. On the server, every function is inert. No runtime dependencies.

## Quick start

```js
import { autoScrollSpy } from '@samline/scroll-spy'

autoScrollSpy()
```

```html
<nav data-scroll-spy aria-label="On this page">
  <a href="#install">Install</a>
  <a href="#usage">Usage</a>
</nav>

<section id="install">…</section>
<section id="usage">…</section>
```

```css
nav a[aria-current] {
  font-weight: 600;
}
```

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle. It watches every `[data-scroll-spy]` as soon as the DOM is ready. Pin the version in production.

```html
<script
  src="https://cdn.jsdelivr.net/npm/@samline/scroll-spy@1.0.0/dist/browser/scroll-spy.global.js"
  defer
></script>
```

The bundle defines `window.ScrollSpy`. Add `data-manual` to the script tag and call `ScrollSpy.auto(options)` to start it with your own options.

## Capabilities

### The section you are reading

A section is active once its top crosses an activation line, 25% down the view by default, so very short and very tall sections both behave. Before the first section nothing is active, and at the bottom of the page the last section in view is, even when it is too short to reach the line.

### Accessible state

The active link gets `aria-current="true"` (or your value), announced by screen readers and easy to target in CSS, plus an optional class. Every link to the same section is marked.

### Steady on click

A clicked link lights up at once and stays lit while the page scrolls to it, with CSS smooth scrolling or your own scripted scroll, instead of flickering through every section on the way.

### Any layout

Watch the page or a scroll container (`root`), move the line below a sticky header (`offset`), keep long navigations scrolled to the active link without moving the page, and optionally keep the URL hash in sync without history entries.

## API at a glance

| API                            | Purpose                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| `autoScrollSpy(options?)`      | Watch every `[data-scroll-spy]`, including navigations added later. |
| `scrollSpy(nav, options?)`     | Watch one navigation. Returns `{ active, refresh, destroy }`.       |
| `onChange(change)`             | The active section changed: `{ id, section, links, previous }`.     |
| `data-scroll-spy-*` attributes | Offset, class, click lock, follow and hash per navigation.          |

### Entrypoints

| Entrypoint                    | When to use                                       |
| ----------------------------- | ------------------------------------------------- |
| `@samline/scroll-spy`         | ESM or CommonJS, `scrollSpy` and `autoScrollSpy`. |
| `@samline/scroll-spy/vanilla` | `scrollSpy` as the default export.                |
| `@samline/scroll-spy/browser` | Classic script that defines `window.ScrollSpy`.   |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/scroll-spy/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/scroll-spy/examples/) with complete and separate source files.

| Guide                                                                               | What it covers                                                        |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/scroll-spy/getting-started/)    | npm, CDN and the first navigation.                                    |
| [API reference](https://samline.github.io/utils/docs/scroll-spy/reference/api/)     | `scrollSpy`, `autoScrollSpy` and `window.ScrollSpy`.                  |
| [Options](https://samline.github.io/utils/docs/scroll-spy/reference/configuration/) | Attributes and options.                                               |
| [Layouts](https://samline.github.io/utils/docs/scroll-spy/guides/layouts/)          | Sticky headers, scroll containers, smooth scrolling and nested lists. |
| [Frameworks](https://samline.github.io/utils/docs/scroll-spy/guides/frameworks/)    | React, Vue, Svelte, Astro and page swaps.                             |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/scroll-spy/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [Scroll Spy skill](https://samline.github.io/utils/skills/scroll-spy/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/scroll-spy/SKILL.md) into a `scroll-spy/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/scroll-spy
curl --fail --location https://samline.github.io/utils/skills/scroll-spy/SKILL.md \
  --output .agents/skills/scroll-spy/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
