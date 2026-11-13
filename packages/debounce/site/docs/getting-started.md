---
title: Installation
description: Install @samline/debounce with a package manager or a script tag and debounce your first handler.
locale: en
sidebar:
  group: start
  order: 2
---

## Package / ESM

```sh
npm install @samline/debounce
```

```js
import { debounce } from '@samline/debounce'

const search = debounce(query => fetchResults(query), 300)
input.addEventListener('input', () => search(input.value))
```

The root entry also exports `throttle` and `rafThrottle`. It is ESM and CommonJS (`require('@samline/debounce')`).

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle with a classic script tag. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/debounce@1.0.0/dist/browser/debounce.global.js"></script>
<script>
  const { debounce, throttle, rafThrottle } = window.Debounce
</script>
```

## Requirements

- Any modern browser. Node 20 or newer for server-side use.
- No runtime dependencies. React, Vue and Svelte are optional peers, only for their adapters.
