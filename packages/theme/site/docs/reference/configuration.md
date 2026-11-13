---
title: Options
description: Every @samline/theme option, data-theme control and script tag attribute, with defaults and how modes, themes and storage are read.
locale: en
sidebar:
  group: reference
  order: 2
---

## Options

| Option               | Default             | Description                                                                                                                        |
| -------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `themes`             | `['light', 'dark']` | Themes that can be chosen, besides `'system'`                                                                                      |
| `defaultMode`        | `'system'`          | Mode used when nothing is stored: a theme name or `'system'`                                                                       |
| `attribute`          | `'data-theme'`      | Attribute that receives the theme name, or `'class'` to add it as a class (other theme classes are removed)                        |
| `target`             | `<html>`            | Element or selector that receives the theme, for widgets and previews                                                              |
| `storageKey`         | `'theme'`           | `localStorage` key, or `false` to not remember the choice                                                                          |
| `colorScheme`        | `true`              | Set `color-scheme` on the target for `light` and `dark`, so scrollbars and form controls follow                                    |
| `themeColor`         | none                | Browser UI color per theme, such as `{ light: '#fff', dark: '#111' }`, written to `<meta name="theme-color">` (created if missing) |
| `disableTransitions` | `true`              | Turn CSS transitions off while switching, so the page swaps at once                                                                |
| `controls`           | `true`              | Handle the `data-theme-*` controls below                                                                                           |
| `scope`              | `document`          | Where controls are looked for and listened to                                                                                      |
| `onChange`           | none                | Called with `{ mode, theme }` on every change                                                                                      |

A stored value that is not a known theme or `'system'` is ignored, and `defaultMode` is used. `'auto'` is read as `'system'`.

## Controls

| Markup                                       | Behavior                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| `<button data-theme-set="dark">`             | Chooses that mode; gets `aria-pressed="true"` while it is the mode             |
| `<input type="radio" data-theme-set="dark">` | Chooses that mode when checked; is checked while it is the mode                |
| `<button data-theme-toggle>`                 | Switches light and dark; `aria-pressed="true"` while dark is in effect         |
| `<select data-theme-select>`                 | Chooses its value; shows the current mode. Give it `system` and theme options. |

Clicks and changes are delegated from `scope`, so controls added later work. Every control is synced on each change and once the DOM is ready.

## Script tag attributes

For the browser bundle (`theme.global.js`):

| Attribute                        | Option                                   |
| -------------------------------- | ---------------------------------------- |
| `data-themes="light dark sepia"` | `themes` (spaces or commas)              |
| `data-default="light"`           | `defaultMode`                            |
| `data-attribute="class"`         | `attribute`                              |
| `data-storage-key="site-theme"`  | `storageKey` (`"false"` to not remember) |
| `data-manual`                    | Do not start; call `Theme.auto(options)` |
