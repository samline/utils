---
title: Installation
description: Install @samline/string with a package manager or a script tag and convert your first text in the browser or on the server.
locale: en
sidebar:
  group: start
  order: 2
---

## Package / ESM

```sh
npm install @samline/string
```

```js
import { camelCase, slugify, truncate } from '@samline/string'

camelCase('user_first_name') // 'userFirstName'
slugify('¡Hola, Ñandú & Café!') // 'hola-nandu-cafe'
truncate('The quick brown fox', 12) // 'The quick…'
```

Every function is tree-shakeable and available from ESM and CommonJS (`require('@samline/string')`).

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle with a classic script tag. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/string@1.0.0/dist/browser/string.global.js"></script>
<script>
  const { slugify, titleCase } = window.SamlineString
</script>
```

## Requirements

- Any modern browser, Node 20 or newer, workers and edge runtimes. No DOM access.
- No runtime dependencies.
