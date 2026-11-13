---
title: Installation
description: Install @samline/theme with a package manager or a script tag, apply the theme before the first paint and add your first dark mode toggle.
locale: en
sidebar:
  group: start
  order: 2
---

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle in `<head>`, **without** `defer` or `async`, so the theme is written before the page paints. Pin the version in production.

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/@samline/theme@1.0.0/dist/browser/theme.global.js"></script>
</head>
<body>
  <button type="button" data-theme-toggle>Dark mode</button>
</body>
```

Options go on the script tag:

```html
<script
  src="https://cdn.jsdelivr.net/npm/@samline/theme@1.0.0/dist/browser/theme.global.js"
  data-themes="light dark sepia"
  data-default="light"
  data-attribute="class"
></script>
```

For options a tag cannot hold, such as `themeColor`, add `data-manual` and start it yourself right after, still in `<head>`:

```html
<script
  src="https://cdn.jsdelivr.net/npm/@samline/theme@1.0.0/dist/browser/theme.global.js"
  data-manual
></script>
<script>
  Theme.auto({ themeColor: { light: '#ffffff', dark: '#111111' } })
</script>
```

## Package / ESM

```sh
npm install @samline/theme
```

```js
import { createTheme } from '@samline/theme'

const theme = createTheme()
theme.toggle()
```

A bundled module runs after the page paints, so on its own it can flash. Pair it with the inline snippet in `<head>`, which applies the stored theme first:

```js
import { themeScript } from '@samline/theme'

const head = `<script>${themeScript()}</script>`
```

Pass the same `themes`, `defaultMode`, `attribute` and `storageKey` to both. Available as ESM and CommonJS (`require('@samline/theme')`). There is no stylesheet: style `[data-theme]` in your own CSS.

## Requirements

- Any modern browser. Without JavaScript, your default CSS applies.
- On the server, `createTheme` returns an inert controller with the default mode, and `themeScript` returns a string.
- No runtime dependencies.
