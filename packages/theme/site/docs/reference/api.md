---
title: 'API reference'
titleAccent: 'reference'
description: Every @samline/theme export, createTheme, themeScript, the Theme controller, the themechange event, their types and the window.Theme global.
locale: en
sidebar:
  group: reference
  order: 1
---

## createTheme(options?)

```ts
createTheme(options?: ThemeOptions): Theme
```

Reads the stored mode, applies the theme at once and starts following the system, other tabs and controls. See [Options](../configuration/).

```js
import { createTheme } from '@samline/theme'

const theme = createTheme({ themes: ['light', 'dark', 'sepia'] })
theme.set('sepia')
```

## The controller

| Member                | Description                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `mode`                | What was chosen: a theme name or `'system'`                                                         |
| `theme`               | The theme in effect: `'system'` resolved to `'light'` or `'dark'`                                   |
| `set(mode)`           | Choose a theme name or `'system'`; stores it. Unknown names are ignored. `'auto'` means `'system'`. |
| `toggle()`            | Switch between light and dark, from the theme in effect                                             |
| `subscribe(listener)` | Called with `{ mode, theme }` on every change; returns an unsubscribe function                      |
| `destroy()`           | Stop following the system, other tabs and controls. The theme stays applied.                        |

Listeners and the event are not called for the first apply, only for changes.

## themechange

A `CustomEvent` dispatched on the target (`<html>` by default) on every change. It bubbles, so `document` hears it too.

```js
document.addEventListener('themechange', event => {
  console.log(event.detail.mode, event.detail.theme)
})
```

## themeScript(options?)

```ts
themeScript(options?): string
```

A small inline script for `<head>` that applies the stored theme before the page paints. It takes `themes`, `defaultMode`, `attribute`, `storageKey`, `colorScheme` and `themeColor`, and always writes on `<html>`. The string is safe to place inside a `<script>` element. It applies the theme only; call `createTheme` later for changes and controls.

## Types and constants

`Theme`, `ThemeOptions`, `ThemeState` and `ThemeMode`. `SYSTEM` is `'system'` and `EVENT` is `'themechange'`. The default export is `createTheme`; `@samline/theme/vanilla` exports the same API.

## window.Theme

The browser bundle (`dist/browser/theme.global.js`) defines:

| Member                                   | Description                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `Theme.createTheme`, `Theme.themeScript` | Same as the package exports                                                           |
| `Theme.auto(options?)`                   | Start (or restart) with options, merged over the script tag's; returns the controller |
| `Theme.controller`                       | The running controller, or `null`                                                     |
| `Theme.set(mode)`, `Theme.toggle()`      | Shortcuts to the running controller                                                   |

It starts as soon as it runs, so load it in `<head>` without `defer`. With `data-manual` on the script tag it waits for `Theme.auto()`.
