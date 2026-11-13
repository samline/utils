# @samline/counter

Count numbers up (or down) as they scroll into view, with easing, decimals and `Intl` formatting, for vanilla JavaScript, any framework and plain HTML. The final value stays in the HTML, so it is right without JavaScript, for search engines and with reduced motion.

[Demo](https://samline.github.io/utils/counter/) · [Examples](https://samline.github.io/utils/counter/examples/) · [Documentation](https://samline.github.io/utils/docs/counter/) · [Changelog](CHANGELOG.md)

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
npm install @samline/counter
```

```sh
pnpm add @samline/counter
```

```sh
bun add @samline/counter
```

Any modern browser with `Intl.NumberFormat`; without IntersectionObserver, numbers count right away. On the server, every function returns a no-op. No runtime dependencies.

## Quick start

```js
import { autoCounter } from '@samline/counter'

autoCounter()
```

```html
<p lang="en">
  <span data-counter="12480">12,480</span> customers · <span data-counter="99.95">99.95</span>%
  uptime · <span data-counter="0" data-counter-from="10">0</span> seconds left
</p>
```

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle. It counts every `[data-counter]` as soon as the DOM is ready. Pin the version in production.

```html
<script
  src="https://cdn.jsdelivr.net/npm/@samline/counter@1.0.0/dist/browser/counter.global.js"
  defer
></script>
```

The bundle defines `window.Counter`. Add `data-manual` to the script tag and call `Counter.auto(options)` to start it with your own options.

## Capabilities

### The real value first

You render `12,480`; the script shows the start value and counts back to it when the number is half visible. Search engines, link previews, screen readers and visitors without JavaScript always get the real number. With reduced motion, it never changes.

### Formatted for the language

`Intl.NumberFormat` in the closest `lang`: `12.345,5` in German, `12,34,567` in India. Add currencies, compact notation or units with `format`, or return your own text with `formatter`. Decimals follow the target, and empty `data-counter` reads the value back from localized text.

### Time-based easing

Counts by elapsed time, not frames, with `ease-out`, `ease-in-out`, `linear` or your own curve, and ends exactly on the target. Start higher to count down; `data-counter-repeat` counts again on every visit.

### Beyond text

`animateNumber` is the same eased tween for charts, canvas and CSS variables, and `parseNumber` reads `1.234,5 €` back into a number.

## API at a glance

| API                          | Purpose                                                            |
| ---------------------------- | ------------------------------------------------------------------ |
| `autoCounter(options?)`      | Count every `[data-counter]`, including numbers added later.       |
| `counter(target?, options?)` | Count a selector, element or list. Returns a cleanup.              |
| `animateNumber(options)`     | Eased, time-based tween of any number. Returns a cancel function.  |
| `parseNumber(text, locale?)` | Read a localized number back into a value and its decimals.        |
| `data-counter-*` attributes  | Start value, duration, delay, easing, decimals, locale and repeat. |

### Entrypoints

| Entrypoint                 | When to use                                   |
| -------------------------- | --------------------------------------------- |
| `@samline/counter`         | ESM or CommonJS, every function.              |
| `@samline/counter/vanilla` | `counter` as the default export.              |
| `@samline/counter/browser` | Classic script that defines `window.Counter`. |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/counter/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/counter/examples/) with complete and separate source files.

| Guide                                                                            | What it covers                                                  |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/counter/getting-started/)    | npm, CDN and the first counter.                                 |
| [API reference](https://samline.github.io/utils/docs/counter/reference/api/)     | `counter`, `autoCounter`, `animateNumber` and `window.Counter`. |
| [Options](https://samline.github.io/utils/docs/counter/reference/configuration/) | Attributes, options and states.                                 |
| [Formatting](https://samline.github.io/utils/docs/counter/guides/formatting/)    | Locales, currencies, percentages and a steady layout.           |
| [Frameworks](https://samline.github.io/utils/docs/counter/guides/frameworks/)    | React, Vue, Svelte, Astro and page swaps.                       |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/counter/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [Counter skill](https://samline.github.io/utils/skills/counter/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/counter/SKILL.md) into a `counter/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/counter
curl --fail --location https://samline.github.io/utils/skills/counter/SKILL.md \
  --output .agents/skills/counter/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
