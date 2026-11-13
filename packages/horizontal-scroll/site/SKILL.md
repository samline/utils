---
name: horizontal-scroll
description: Use @samline/horizontal-scroll to pin a section and move a wide row sideways as the page scrolls down, for galleries, timelines and showcases, in vanilla JS, any framework or plain HTML.
package-version: '1.0.0'
---

# @samline/horizontal-scroll

Build against the installed version; this skill describes 1.0.0.

- **Install:** `npm install @samline/horizontal-scroll`. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/horizontal-scroll@1.0.0/dist/browser/horizontal-scroll.global.js`; it sets up every `[data-horizontal-scroll]` on its own (`data-manual` on the script tag, then `HorizontalScroll.auto(options)`, to pass options). No stylesheet.
- **Markup:** `<section data-horizontal-scroll>` around a track (`data-horizontal-scroll-track`, or the first child) that is wider than the section: a flex row whose children overflow, or `width: max-content`. Attributes on the section: `data-horizontal-scroll-top` (px or `%`), `-speed`, `-media`, `-focus="false"`.
- **Script:** `autoHorizontalScroll(options)` (also picks up sections added later; returns `{ refresh, destroy }`), or `const s = horizontalScroll(section, { track, top, speed, root, media, respectReducedMotion, followFocus, onProgress })` returning `{ active, progress, refresh, destroy }`.
- **Semantics:** while active the section gets a height of track + travel / speed, `overflow-x: clip` and `--horizontal-scroll-progress` (0–1); the track gets `position: sticky` and a `translate`. Off without JS, outside `media` and with reduced motion: then only `data-horizontal-scroll-state="inactive"`, so give the section `overflow-x: auto` as the fallback.
- **Layouts:** set `top` under fixed headers; pass `root` when a panel scrolls instead of the page; ancestors with `overflow: hidden/auto` break sticky (use `overflow: clip`); make cards focusable, focus is followed.
- **Do not** add your own scroll listeners that set `scrollLeft` or `transform` on the track, set the section height yourself, or hijack wheel events.
