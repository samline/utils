# @samline/reveal

Reveal elements as they scroll into view, with CSS effects, cascades, repeat and a CSS-only scrub mode, for vanilla JavaScript, any framework and plain HTML. Content already in view on load is never hidden, and everything stays visible without JavaScript, with reduced motion or when printing.

[Demo](https://samline.github.io/utils/reveal/) · [Examples](https://samline.github.io/utils/reveal/examples/) · [Documentation](https://samline.github.io/utils/docs/reveal/) · [Changelog](CHANGELOG.md)

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
npm install @samline/reveal
```

```sh
pnpm add @samline/reveal
```

```sh
bun add @samline/reveal
```

Any modern browser; without IntersectionObserver, content simply stays visible. On the server, every function returns a no-op. No runtime dependencies.

## Quick start

```js
import '@samline/reveal/style.css'
import { autoReveal } from '@samline/reveal'

autoReveal()
```

```html
<h2 data-reveal>Slides up</h2>
<ul data-reveal-stagger="80">
  <li data-reveal="fade">Fades in first</li>
  <li data-reveal="fade">80ms later</li>
</ul>
<figure data-reveal="zoom" data-reveal-repeat>Zooms in on every entry</figure>
```

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the stylesheet and the browser bundle. It reveals every `[data-reveal]` as soon as the DOM is ready. Pin the version in production.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@samline/reveal@1.0.0/dist/style.css" />
<script
  src="https://cdn.jsdelivr.net/npm/@samline/reveal@1.0.0/dist/browser/reveal.global.js"
  defer
></script>
```

The bundle defines `window.Reveal`. Add `data-manual` to the script tag and call `Reveal.auto(options)` to start it with your own options.

## Capabilities

### No flash on load

Only elements below the fold are hidden until they enter. Elements in view, or above it, are shown as they are, so the first paint and anchor links stay intact.

### Safe by default

The stylesheet only hides elements the script marked `data-reveal-state="pending"`. Without JavaScript, with `prefers-reduced-motion: reduce` or when printing, every element is visible.

### Effects in CSS

Seven effects (`up`, `down`, `left`, `right`, `fade`, `zoom`, `blur`) tuned with attributes or custom properties. Every rule uses `:where()`, and effects use `translate`, `scale` and `filter`, so your own styles and `transform` always win.

### Cascades, repeat and scrub

`data-reveal-stagger` cascades a container's elements that enter together, in document order. `data-reveal-repeat` plays on every entry. `data-reveal-scrub` follows the scroll position with a CSS scroll-driven animation, no script running.

## API at a glance

| API                            | Purpose                                                                   |
| ------------------------------ | ------------------------------------------------------------------------- |
| `autoReveal(options?)`         | Reveal every `[data-reveal]`, including elements added later.             |
| `reveal(target?, options?)`    | Reveal a selector, element or list. Returns a cleanup.                    |
| `REVEAL_EFFECTS`               | The effect names.                                                         |
| `data-reveal-*` attributes     | Effect, duration, delay, distance, repeat, stagger and scrub per element. |
| `--reveal-*` custom properties | Duration, delay, easing, distance, scale, blur and scrub range.           |

### Entrypoints

| Entrypoint                  | When to use                                  |
| --------------------------- | -------------------------------------------- |
| `@samline/reveal`           | ESM or CommonJS, `reveal` and `autoReveal`.  |
| `@samline/reveal/vanilla`   | `reveal` as the default export.              |
| `@samline/reveal/style.css` | Effects, timing variables and scrub mode.    |
| `@samline/reveal/browser`   | Classic script that defines `window.Reveal`. |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/reveal/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/reveal/examples/) with complete and separate source files.

| Guide                                                                             | What it covers                                 |
| --------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/reveal/getting-started/)      | npm, CDN and the first reveal.                 |
| [API reference](https://samline.github.io/utils/docs/reveal/reference/api/)       | `reveal`, `autoReveal` and `window.Reveal`.    |
| [Options](https://samline.github.io/utils/docs/reveal/reference/configuration/)   | Attributes, options, CSS variables and states. |
| [Effects and timing](https://samline.github.io/utils/docs/reveal/guides/effects/) | Custom effects, cascades and repeat.           |
| [Scrub mode](https://samline.github.io/utils/docs/reveal/guides/scrub/)           | Scroll-driven reveals without JavaScript.      |
| [Frameworks](https://samline.github.io/utils/docs/reveal/guides/frameworks/)      | React, Vue, Svelte, Astro and page swaps.      |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/reveal/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [Reveal skill](https://samline.github.io/utils/skills/reveal/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/reveal/SKILL.md) into a `reveal/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/reveal
curl --fail --location https://samline.github.io/utils/skills/reveal/SKILL.md \
  --output .agents/skills/reveal/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
