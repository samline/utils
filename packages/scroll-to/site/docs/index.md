---
title: Scroll To
description: What @samline/scroll-to does, how a scroll is aimed, animated and finished, and how links, triggers and containers fit together.
locale: en
sidebar:
  group: start
  order: 1
  label: Overview
---

`@samline/scroll-to` scrolls smoothly to anchors, elements and positions, and stops where it should: below a fixed header, centered in a strip, or at the nearest edge. Call `autoScrollTo()` (or load the CDN script) and same-page `#id` links and `[data-scroll-to]` triggers use it.

```html
<a href="#pricing">Pricing</a>
<button type="button" data-scroll-to="top">Back to top</button>
```

## How a scroll works

1. The target is resolved: an element, an `#id`, a selector, `'top'` or a position in pixels.
2. Its destination is computed for the container (the page by default), the alignment (`block`, `inline`) and the `offset`, and clamped to what can scroll.
3. The scroll is animated with `duration` and `easing`. The destination is measured again on every frame, so images that load on the way do not make it land in the wrong place.
4. A wheel, touch, key press or a new scroll on the same container stops it. Reduced motion jumps instead.
5. On arrival, links move keyboard focus to the target and push its `#id` to the URL, like a native jump.

`scrollTo()` returns a promise of `true` when it arrives and `false` when it was interrupted, replaced or the target does not exist.

## Pieces

| Job | How |
| --- | --- |
| Smooth anchor links | `autoScrollTo()`, or the CDN script |
| Any element as a trigger | `data-scroll-to="#id"`, a selector or `top` |
| Clear a fixed header | `offset`: pixels, a percentage, or the header element |
| Align | `block` and `inline`: `start`, `center`, `end`, `nearest` |
| Scroll a box or strip | `container` |
| Speed and feel | `duration` and `easing` |
| From code | `await scrollTo(target, options)` |
| Measure only | `scrollPosition(target, options)` |

- [Installation](getting-started/) — npm, CDN and the first links.
- [API reference](reference/api/) — `scrollTo`, `scrollPosition`, `cancelScroll`, `autoScrollTo` and `window.ScrollTo`.
- [Options](reference/configuration/) — options and attributes.
- [Layouts](guides/layouts/) — fixed headers, skip links, containers, tabs and history.
- [Frameworks](guides/frameworks/) — React, Vue, Svelte, Astro and client-side routers.
