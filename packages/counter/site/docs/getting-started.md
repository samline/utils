---
title: Installation
description: Install @samline/counter with a package manager or a script tag and count your first number as it scrolls into view.
locale: en
sidebar:
  group: start
  order: 2
---

## Package / ESM

```sh
npm install @samline/counter
```

```js
import { autoCounter } from '@samline/counter'

autoCounter()
```

```html
<p lang="en">
  <span data-counter="12480">12,480</span> customers ·
  <span data-counter="99.95">99.95</span>% uptime
</p>
```

`autoCounter()` counts every `[data-counter]` in the page, including numbers added later. To count specific elements, call `counter(target, options)`; both return a way to stop. Available as ESM and CommonJS (`require('@samline/counter')`). There is no stylesheet.

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle. It counts every `[data-counter]` as soon as the DOM is ready. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/counter@1.0.0/dist/browser/counter.global.js" defer></script>
```

To pass options, add `data-manual` to the script tag and start it yourself, or call `Counter.auto()` from a script that runs before the DOM is ready (a deferred or inline script after the bundle):

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/counter@1.0.0/dist/browser/counter.global.js" data-manual defer></script>
<script type="module">
  Counter.auto({ duration: 1500, locale: 'es-MX' })
</script>
```

## Requirements

- Any modern browser with `Intl.NumberFormat`. Without IntersectionObserver, numbers count right away.
- On the server, `counter` and `autoCounter` return no-ops and `animateNumber` jumps to the end.
- No runtime dependencies.
