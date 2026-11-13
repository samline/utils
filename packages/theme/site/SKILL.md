---
name: theme
description: Use @samline/theme for light, dark and system themes applied before the first paint, with a remembered choice, live system changes, other tabs and data-theme controls, in vanilla JS, any framework or plain HTML.
package-version: '1.0.0'
---

# @samline/theme

Build against the installed version; this skill describes 1.0.0.

- **Install:** `npm install @samline/theme`. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/theme@1.0.0/dist/browser/theme.global.js` in `<head>` **without** `defer`/`async`; it applies the theme at once and handles controls. Script attributes: `data-themes`, `data-default`, `data-attribute`, `data-storage-key` (`"false"`), `data-manual` (then `Theme.auto(options)`). No stylesheet.
- **Markup:** `data-theme-set="light|dark|system|<name>"` on buttons (aria-pressed) or radios (checked), `data-theme-toggle` (light/dark, aria-pressed while dark), `select[data-theme-select]`. Delegated from `scope`.
- **Script:** `createTheme({ themes, defaultMode, attribute, target, storageKey, colorScheme, themeColor, disableTransitions, controls, scope, onChange })` returns `{ mode, theme, set, toggle, subscribe, destroy }`. `themeScript(options)` returns an inline `<head>` snippet for SSR (same options, always `<html>`). `themechange` CustomEvent bubbles from the target with `{ mode, theme }`.
- **Semantics:** mode is a theme or `'system'` (`'auto'` accepted); theme is the resolved name. Writes `data-theme` (or a class) on `<html>`, `color-scheme` for light/dark, optional `meta[name=theme-color]`. Follows `prefers-color-scheme` live in system mode and other tabs via `storage`. Storage errors are ignored. Listeners skip the first apply.
- **Styling:** CSS variables under `:root` and `[data-theme='dark']` (or `.dark` with `attribute: 'class'`).
- **Do not** load the bundle with `defer` or from the end of `<body>` (it flashes), read `localStorage` or `matchMedia` yourself, or toggle classes on `<html>` behind the controller's back; use `set()`. In React SSR add `suppressHydrationWarning` on `<html>`.
