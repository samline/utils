---
title: Installation
description: Install @samline/reveal with a package manager or a script tag, load the stylesheet and reveal your first elements.
locale: en
sidebar:
  group: start
  order: 2
---

## Package / ESM

```sh
npm install @samline/reveal
```

```js
import '@samline/reveal/style.css'
import { autoReveal } from '@samline/reveal'

autoReveal()
```

```html
<section data-reveal>Slides up</section>
<ul data-reveal-stagger="80">
  <li data-reveal="fade">One</li>
  <li data-reveal="fade">Two</li>
</ul>
```

`autoReveal()` reveals every `[data-reveal]` in the page, including elements added later. To reveal specific elements, call `reveal(target, options)`; both return a way to stop. Available as ESM and CommonJS (`require('@samline/reveal')`); the stylesheet is `@samline/reveal/style.css` (or `dist/style.css`).

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the stylesheet and the browser bundle. It reveals every `[data-reveal]` as soon as the DOM is ready. Pin the version in production.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@samline/reveal@1.0.0/dist/style.css">
<script src="https://cdn.jsdelivr.net/npm/@samline/reveal@1.0.0/dist/browser/reveal.global.js" defer></script>
```

To pass options, add `data-manual` to the script tag and start it yourself, or call `Reveal.auto()` from a script that runs before the DOM is ready (a deferred or inline script after the bundle):

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/reveal@1.0.0/dist/browser/reveal.global.js" data-manual defer></script>
<script type="module">
  Reveal.auto({ stagger: 60, rootMargin: '0px 0px -10% 0px' })
</script>
```

## Requirements

- Any modern browser. Without IntersectionObserver, content simply stays visible.
- Scrub mode needs scroll-driven animations (`animation-timeline: view()`); elsewhere scrub elements stay visible.
- On the server, `reveal` and `autoReveal` return no-ops.
- No runtime dependencies.
