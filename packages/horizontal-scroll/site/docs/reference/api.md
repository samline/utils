---
title: API reference
description: Every @samline/horizontal-scroll export, horizontalScroll, autoHorizontalScroll, their types and the window.HorizontalScroll global.
locale: en
sidebar:
  group: reference
  order: 1
---

## horizontalScroll(section, options?)

```ts
horizontalScroll(section: Element | string, options?: HorizontalScrollOptions): HorizontalScroll
```

Pins `section` (an element or a selector) and moves its track sideways with the scroll. See [Options](../configuration/) for every option.

```js
import { horizontalScroll } from '@samline/horizontal-scroll'

const scroller = horizontalScroll('#gallery', {
  top: 64,
  onProgress: ({ progress }) => console.log(Math.round(progress * 100) + '%'),
})
```

It returns:

| Member | Description |
| --- | --- |
| `active` | `true` while the section is pinned (read-only) |
| `progress` | From 0 to 1 (read-only) |
| `refresh()` | Measure again, and pick up a replaced track. Size changes inside the track and window resizes are handled on their own. |
| `destroy()` | Stop, restore the styles it changed and remove the state attribute |

Without a DOM, or when the section is not found, it returns an inert object.

## autoHorizontalScroll(options?)

```ts
autoHorizontalScroll(options?: AutoHorizontalScrollOptions): { refresh(): void; destroy(): void }
```

Calls `horizontalScroll` for every `[data-horizontal-scroll]` in `scope` (default `document`) with the same options, sets up sections added later and cleans up sections that are removed. Pass `observe: false` to skip watching for changes, and `selector` to match other sections.

## onProgress

```ts
interface HorizontalScrollProgress {
  progress: number // 0 to 1
  x: number // current translate, 0 or negative
  distance: number // total travel in pixels
}
```

Called whenever the progress changes, and with `progress: 0` when the effect turns off. The same value is on the section as the CSS variable `--horizontal-scroll-progress`, which the track and its children inherit:

```css
.progress {
  transform-origin: left;
  transform: scaleX(var(--horizontal-scroll-progress, 0));
}
```

## Constants

| Export | Value |
| --- | --- |
| `ATTRIBUTE` | `'data-horizontal-scroll'` |
| `TRACK_ATTRIBUTE` | `'data-horizontal-scroll-track'` |
| `STATE_ATTRIBUTE` | `'data-horizontal-scroll-state'` |
| `PROGRESS_PROPERTY` | `'--horizontal-scroll-progress'` |

Types: `HorizontalScroll`, `HorizontalScrollOptions`, `HorizontalScrollProgress`, `AutoHorizontalScrollOptions`, `AutoInitController` and `ElementTarget`. The default export is `horizontalScroll`; `@samline/horizontal-scroll/vanilla` exports the same API.

## window.HorizontalScroll

The browser bundle (`dist/browser/horizontal-scroll.global.js`) defines:

| Member | Description |
| --- | --- |
| `HorizontalScroll.horizontalScroll` | Same as the package export |
| `HorizontalScroll.autoHorizontalScroll` | Same as the package export |
| `HorizontalScroll.auto(options?)` | Start (or restart) the automatic setup with options; returns the controller |
| `HorizontalScroll.controller` | The controller of the automatic run, or `null` |

It starts on its own when the DOM is ready. With `data-manual` on the script tag it waits for `HorizontalScroll.auto()`; a call made before the DOM is ready also replaces the automatic start.
