# @samline/theme

## 1.0.0

### Major Changes

- First release: `createTheme` manages light, dark and system themes, or any named themes, written on `<html>` (or any `target`) as `data-theme` or a class, with `color-scheme`, an optional `<meta name="theme-color">`, a choice remembered in `localStorage` (errors ignored), live system changes while in system mode, sync across tabs, transitions paused while switching, `subscribe`, a `themechange` event and delegated `data-theme-set`, `data-theme-toggle` and `data-theme-select` controls with `aria-pressed` and checked state. `themeScript` returns an inline `<head>` snippet that applies the stored theme before the first paint on server-rendered pages. ESM, CommonJS and a browser global (`window.Theme`) that applies the theme as soon as it loads in `<head>`.
