# @samline/theme

Light, dark and system themes that are on the page before it paints, with a remembered choice, live system changes, sync across tabs and accessible controls. For vanilla JavaScript, any framework and plain HTML.

[Demo](https://samline.github.io/utils/theme/) · [Examples](https://samline.github.io/utils/theme/examples/) · [Documentation](https://samline.github.io/utils/docs/theme/) · [Changelog](CHANGELOG.md)

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
npm install @samline/theme
```

```sh
pnpm add @samline/theme
```

```sh
bun add @samline/theme
```

Any modern browser; without JavaScript, your default CSS applies. On the server, `createTheme` is inert. No runtime dependencies.

## Quick start

```js
import { createTheme } from '@samline/theme'

const theme = createTheme()
```

```html
<button type="button" data-theme-toggle>Dark mode</button>
```

```css
:root {
  --bg: #fff;
  --fg: #111;
}
[data-theme='dark'] {
  --bg: #111;
  --fg: #eee;
}
```

A bundled module runs after the first paint. To avoid a flash, inline the snippet in `<head>` too:

```js
import { themeScript } from '@samline/theme'

const head = `<script>${themeScript()}</script>`
```

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle in `<head>`, without `defer`, so the theme applies before the page paints. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/theme@1.0.0/dist/browser/theme.global.js"></script>
```

The bundle defines `window.Theme`. Pass options as `data-themes`, `data-default`, `data-attribute` and `data-storage-key` on the script tag, or add `data-manual` and call `Theme.auto(options)`.

## Capabilities

### No flash on load

The classic script, or `themeScript()` inlined in `<head>`, writes the stored theme before the first paint, so a dark page never shows light first.

### Light, dark, system and your own themes

Choose a theme or `'system'`, which follows `prefers-color-scheme` and updates live when the visitor changes it. Name as many themes as you need, written as `data-theme` or a class, with `color-scheme` and a `theme-color` per theme.

### Remembered and in sync

The choice is stored in `localStorage` and reaches every open tab. Blocked storage never throws; the theme simply is not remembered.

### Accessible controls without code

`data-theme-set` buttons get `aria-pressed`, radios are checked, `data-theme-toggle` reports dark mode and `select[data-theme-select]` shows the mode, all delegated, so controls added later work.

### A clean switch

CSS transitions pause while the theme changes, so the page swaps at once. Listen with `subscribe()`, `onChange` or the `themechange` event.

## API at a glance

| API                                                        | Purpose                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `createTheme(options?)`                                    | Apply, remember and follow the theme. Returns `{ mode, theme, set, toggle, subscribe, destroy }`. |
| `themeScript(options?)`                                    | Inline `<head>` snippet that applies the stored theme before the first paint.                     |
| `data-theme-set`, `data-theme-toggle`, `data-theme-select` | Controls handled without code.                                                                    |
| `themechange`                                              | Event with `{ mode, theme }` on every change.                                                     |

### Entrypoints

| Entrypoint               | When to use                                              |
| ------------------------ | -------------------------------------------------------- |
| `@samline/theme`         | ESM or CommonJS, every export.                           |
| `@samline/theme/vanilla` | `createTheme` as the default export.                     |
| `@samline/theme/browser` | Classic script for `<head>` that defines `window.Theme`. |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/theme/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/theme/examples/) with complete and separate source files.

| Guide                                                                          | What it covers                                                   |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/theme/getting-started/)    | npm, CDN and the first toggle.                                   |
| [API reference](https://samline.github.io/utils/docs/theme/reference/api/)     | `createTheme`, `themeScript`, the controller and `window.Theme`. |
| [Options](https://samline.github.io/utils/docs/theme/reference/configuration/) | Options, controls and script attributes.                         |
| [Layouts](https://samline.github.io/utils/docs/theme/guides/layouts/)          | CSS, custom themes, server rendering, widgets and transitions.   |
| [Frameworks](https://samline.github.io/utils/docs/theme/guides/frameworks/)    | React, Vue, Svelte, Astro and Next.js.                           |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/theme/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [Theme skill](https://samline.github.io/utils/skills/theme/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/theme/SKILL.md) into a `theme/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/theme
curl --fail --location https://samline.github.io/utils/skills/theme/SKILL.md \
  --output .agents/skills/theme/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
