---
title: Installation
description: Install @samline/scroll-spy with a package manager or a script tag and highlight the section in view in your first navigation.
locale: en
sidebar:
  group: start
  order: 2
---

## Package / ESM

```sh
npm install @samline/scroll-spy
```

```js
import { autoScrollSpy } from '@samline/scroll-spy'

autoScrollSpy()
```

```html
<nav data-scroll-spy aria-label="On this page">
  <a href="#install">Install</a>
  <a href="#usage">Usage</a>
</nav>

<section id="install">…</section>
<section id="usage">…</section>
```

```css
nav a[aria-current] {
  font-weight: 600;
}
```

`autoScrollSpy()` watches every `[data-scroll-spy]` in the page, including navigations added later. To watch one navigation, call `scrollSpy(nav, options)`; it returns `{ active, refresh, destroy }`. Available as ESM and CommonJS (`require('@samline/scroll-spy')`). There is no stylesheet.

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle. It watches every `[data-scroll-spy]` as soon as the DOM is ready. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/scroll-spy@1.0.0/dist/browser/scroll-spy.global.js" defer></script>
```

To pass options, add `data-manual` to the script tag and start it yourself, or call `ScrollSpy.auto()` from a script that runs before the DOM is ready (a deferred or inline script after the bundle):

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/scroll-spy@1.0.0/dist/browser/scroll-spy.global.js" data-manual defer></script>
<script type="module">
  ScrollSpy.auto({ offset: 96, activeClass: 'is-active' })
</script>
```

## Requirements

- Any modern browser. Without JavaScript the links still jump to their sections.
- On the server, `scrollSpy` returns an inert object and `autoScrollSpy` does nothing.
- No runtime dependencies.
