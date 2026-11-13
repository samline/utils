---
title: Installation
description: Install @samline/horizontal-scroll with a package manager or a script tag and pin your first horizontally scrolling section.
locale: en
sidebar:
  group: start
  order: 2
---

## Package / ESM

```sh
npm install @samline/horizontal-scroll
```

```js
import { autoHorizontalScroll } from '@samline/horizontal-scroll'

autoHorizontalScroll()
```

```html
<section data-horizontal-scroll aria-label="Gallery">
  <div data-horizontal-scroll-track class="row">
    <article class="card">…</article>
    <article class="card">…</article>
    <article class="card">…</article>
  </div>
</section>
```

```css
/* The fallback: a native horizontal scroll. */
[data-horizontal-scroll] {
  overflow-x: auto;
}
.row {
  display: flex;
  gap: 1.5rem;
  height: 100vh;
  align-items: center;
}
.card {
  flex: 0 0 min(70vw, 28rem);
}
```

`autoHorizontalScroll()` sets up every `[data-horizontal-scroll]` in the page, including sections added later. To set up one section, call `horizontalScroll(section, options)`; it returns `{ active, progress, refresh, destroy }`. Available as ESM and CommonJS (`require('@samline/horizontal-scroll')`). There is no stylesheet.

The track is the `[data-horizontal-scroll-track]` element, or the section's first child. It must be wider than the section: either its children overflow it (a flex row), or it is wider itself (`width: max-content`).

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle. It sets up every `[data-horizontal-scroll]` as soon as the DOM is ready. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/horizontal-scroll@1.0.0/dist/browser/horizontal-scroll.global.js" defer></script>
```

To pass options, add `data-manual` to the script tag and start it yourself, or call `HorizontalScroll.auto()` from a script that runs before the DOM is ready (a deferred or inline script after the bundle):

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/horizontal-scroll@1.0.0/dist/browser/horizontal-scroll.global.js" data-manual defer></script>
<script type="module">
  HorizontalScroll.auto({ top: 64, media: '(min-width: 48rem)' })
</script>
```

## Requirements

- Any modern browser with `position: sticky`. Without JavaScript the row keeps your CSS.
- On the server, `horizontalScroll` returns an inert object and `autoHorizontalScroll` does nothing.
- No runtime dependencies.
