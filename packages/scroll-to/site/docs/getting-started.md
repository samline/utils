---
title: Installation
description: Install @samline/scroll-to with a package manager or a script tag and make your same-page links scroll smoothly below a fixed header.
locale: en
sidebar:
  group: start
  order: 2
---

## Package / ESM

```sh
npm install @samline/scroll-to
```

```js
import { autoScrollTo } from '@samline/scroll-to'

autoScrollTo({ offset: '#header' })
```

```html
<header id="header">
  <a href="#pricing">Pricing</a>
</header>

<section id="pricing">…</section>
<button type="button" data-scroll-to="top">Back to top</button>
```

`autoScrollTo()` handles clicks on same-page `#id` links and `[data-scroll-to]` elements with one delegated listener, so links added later work too. It returns `{ destroy }`. To scroll from your own code, `await scrollTo(target, options)`. Available as ESM and CommonJS (`require('@samline/scroll-to')`). There is no stylesheet.

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle. It handles links as soon as the DOM is ready. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/scroll-to@1.0.0/dist/browser/scroll-to.global.js" defer></script>
```

To pass options, add `data-manual` to the script tag and start it yourself, or call `ScrollTo.auto()` from a script that runs before the DOM is ready (a deferred or inline script after the bundle):

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/scroll-to@1.0.0/dist/browser/scroll-to.global.js" data-manual defer></script>
<script type="module">
  ScrollTo.auto({ offset: '#header', duration: 600 })
</script>
```

## Requirements

- Any modern browser. Without JavaScript, links still jump to their sections.
- On the server, `scrollTo` resolves to `false` and `autoScrollTo` does nothing.
- No runtime dependencies.
