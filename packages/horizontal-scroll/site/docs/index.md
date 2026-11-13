---
title: Horizontal Scroll
description: What @samline/horizontal-scroll does, how a pinned section moves sideways, and how the fallback, focus and progress fit together.
locale: en
sidebar:
  group: start
  order: 1
  label: Overview
---

`@samline/horizontal-scroll` pins a section while its row of content moves sideways with the vertical page scroll. Put `data-horizontal-scroll` on a section that wraps a wide row (the track) and call `autoHorizontalScroll()` (or load the CDN script).

```html
<section data-horizontal-scroll>
  <div data-horizontal-scroll-track class="row">
    <article>…</article>
    <article>…</article>
    <article>…</article>
  </div>
</section>
```

## How it works

1. The track is measured: how far it overflows the section is the distance to travel.
2. The section gets a height of the track plus that distance (divided by `speed`), so the page scrolls exactly long enough to cross it.
3. The track becomes `position: sticky` at `top`, so the browser pins it with no JavaScript in the loop.
4. On each scroll frame, the track's `translate` follows how far the section has been scrolled, from 0 to the full distance.
5. Once the end is reached, the section ends and the page carries on.

The page keeps its own scrolling: wheel, touch, keyboard and scrollbars all behave normally. Only the row's position follows them.

## When it does not run

Without JavaScript, outside `media`, or when the visitor prefers reduced motion, nothing is pinned or resized and the section is left to your CSS. Give it `overflow-x: auto` and the row scrolls sideways natively:

```css
[data-horizontal-scroll] {
  overflow-x: auto;
}
```

The section's `data-horizontal-scroll-state` is `active` or `inactive`, so each state can be styled.

## Pieces

| Job | How |
| --- | --- |
| Pin a section | `data-horizontal-scroll`, or `horizontalScroll(section, options)` |
| Clear a fixed header | `top` / `data-horizontal-scroll-top` |
| Cross faster or slower | `speed` / `data-horizontal-scroll-speed` |
| Wide screens only | `media` / `data-horizontal-scroll-media` |
| Inside a scrolling panel | `root` |
| Progress bars | `--horizontal-scroll-progress`, or `onProgress({ progress, x, distance })` |

- [Installation](getting-started/) — npm, CDN and the first section.
- [API reference](reference/api/) — `horizontalScroll`, `autoHorizontalScroll` and `window.HorizontalScroll`.
- [Options](reference/configuration/) — attributes and options.
- [Layouts](guides/layouts/) — headers, fallbacks, focus, scroll containers and sticky pitfalls.
- [Frameworks](guides/frameworks/) — React, Vue, Svelte, Astro and page swaps.
