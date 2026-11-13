---
title: Installation
description: Install @samline/is-visible with a package manager or a script tag and watch your first elements.
locale: en
sidebar:
  group: start
  order: 2
---

## Package / ESM

```sh
npm install @samline/is-visible
```

```js
import { isVisible } from '@samline/is-visible'

isVisible('img[data-src]', {
  once: true,
  rootMargin: '0px 0px 200px 0px',
  visible: (entry, image) => {
    image.src = image.dataset.src
  },
})
```

The default export is the same `isVisible` function. From CommonJS use the named export: `const { isVisible } = require('@samline/is-visible')`.

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle with a classic script tag. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/is-visible@1.0.0/dist/browser/is-visible.global.js"></script>
<script>
  window.isVisible('.card', {
    once: true,
    visible: (entry, card) => card.classList.add('is-visible'),
  })
</script>
```

## Requirements

- Any modern browser. Older browsers without `IntersectionObserver` get the [fallback](../reference/configuration/#fallback).
- No runtime dependencies. React, Vue and Svelte are optional peers, only for their adapters.
