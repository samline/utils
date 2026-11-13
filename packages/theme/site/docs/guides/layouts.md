---
title: Layouts
description: Style themes with CSS variables, add custom themes, avoid the flash on server-rendered pages, theme a single widget and handle transitions.
locale: en
sidebar:
  group: guides
  order: 1
---

## CSS variables

Define your colors once and override them per theme. Every component that uses the variables follows:

```css
:root {
  --bg: #ffffff;
  --fg: #18181b;
}
[data-theme='dark'] {
  --bg: #18181b;
  --fg: #f4f4f5;
}
body {
  background: var(--bg);
  color: var(--fg);
}
```

To also honor the system without JavaScript, repeat the dark values in `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { … } }`.

## Custom themes

Any names work. With `attribute: 'class'`, the theme is added as a class and the other theme classes are removed:

```js
createTheme({
  themes: ['light', 'dark', 'sepia'],
  attribute: 'class',
  themeColor: { light: '#ffffff', dark: '#18181b', sepia: '#f4ecd8' },
})
```

`toggle()` still switches light and dark. `color-scheme` is only set for `light` and `dark`; set it in CSS for other themes.

## Server-rendered pages

A bundled module runs after the first paint. Inline `themeScript()` in `<head>` so the stored theme is written first, then call `createTheme` with the same options from your bundle:

```js
import { themeScript } from '@samline/theme'

const options = { themes: ['light', 'dark'], storageKey: 'theme' }
const head = `<script>${themeScript(options)}</script>`
```

The server does not know the stored theme, so `<html>` differs between the server markup and the page. Frameworks that compare them, such as React, need `suppressHydrationWarning` on `<html>`.

## A themed widget

Pass `target` and `scope` to theme one element, with its own controls and storage, leaving the page alone:

```js
createTheme({
  target: '#preview',
  scope: document.querySelector('#preview-panel'),
  storageKey: 'preview-theme',
})
```

## Transitions

While switching, transitions are turned off for one frame, so a page with `transition: background 0.3s` swaps at once instead of fading every element. Set `disableTransitions: false` if you want the fade.

## Other tabs

A choice made in one tab reaches the others through the `storage` event. With `storageKey: false` nothing is stored or shared.
