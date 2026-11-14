---
title: 'Layouts and fallbacks'
titleAccent: 'fallbacks'
description: Use @samline/horizontal-scroll with fixed headers, native fallbacks, keyboard focus, scroll containers and ancestors that break sticky.
locale: en
sidebar:
  group: guides
  order: 2
---

## Full-height rows

Make the track as tall as the viewport and center the cards in it, so the pinned row fills the screen:

```css
.row {
  display: flex;
  gap: 1.5rem;
  height: 100vh;
  align-items: center;
  padding: 0 1.5rem;
  box-sizing: border-box;
}
```

A shorter track works too: it pins at `top` and the space below it stays empty while it crosses.

## Fixed headers

Pin the row below the header with `top`, and subtract it from the row height:

```html
<section data-horizontal-scroll data-horizontal-scroll-top="64">
  <div data-horizontal-scroll-track class="row">…</div>
</section>
```

```css
.row {
  height: calc(100vh - 64px);
}
```

## Fallbacks

When the effect is not running, the section is yours. A native carousel on phones, with the pinned version on wide screens:

```html
<section data-horizontal-scroll data-horizontal-scroll-media="(min-width: 48rem)">…</section>
```

```css
[data-horizontal-scroll] {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
[data-horizontal-scroll] .card {
  scroll-snap-align: center;
}
[data-horizontal-scroll-state='active'] {
  scroll-snap-type: none;
}
```

The same fallback applies with reduced motion, unless you pass `respectReducedMotion: false`. A vertical stack is another option: style `[data-horizontal-scroll-state='inactive'] .row` with `flex-direction: column`.

## Keyboard focus

Make the cards focusable (links, buttons or `tabindex="0"`). When focus lands on one that is off to the side, the page scrolls until it is fully in view. Turn this off with `followFocus: false` or `data-horizontal-scroll-focus="false"`.

## Scroll containers

When a panel scrolls instead of the page, pass it as `root`. `top` is then measured from the top of the panel, and percentages from its height:

```js
horizontalScroll('#gallery', { root: document.querySelector('.panel') })
```

## When the row does not pin

`position: sticky` sticks to the nearest ancestor that scrolls. An ancestor with `overflow: hidden`, `auto` or `scroll` between the section and the page stops it. Use `overflow: clip` on that ancestor to clip without scrolling, or pass it as `root` when it really is the element that scrolls.

Content with a known size avoids jumps: give images a `width` and `height` (or an `aspect-ratio`). Size changes inside the track are measured again on their own anyway.
