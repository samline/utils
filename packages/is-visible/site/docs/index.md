---
title: Is Visible
description: What @samline/is-visible does, how its transitions and shared observers behave, and where to start.
locale: en
sidebar:
  group: start
  order: 1
  label: Overview
---

`@samline/is-visible` reports when elements enter and leave the viewport, or any scroll container. It wraps `IntersectionObserver` with the details people usually get wrong:

- **Any target:** an element, a selector, a `NodeList` or an array, with one cleanup for all of them.
- **Honest transitions:** `visible` fires once per entry; `notVisible` only after the element was visible.
- **Shared observers:** calls with the same `root`, `rootMargin` and `threshold` share one observer.
- **Never stuck hidden:** without `IntersectionObserver`, every element is reported visible once.
- **Safe on the server:** without a DOM, every call returns a no-op cleanup.

- [Installation](getting-started/) — npm, CDN and the first lazy image.
- [API reference](reference/api/) — `isVisible`, `observeVisibility` and their callbacks.
- [Options](reference/configuration/) — `inOut`, `once`, `root`, `rootMargin`, `threshold` and `fallback`.
- [Frameworks](guides/frameworks/) — React, Vue and Svelte adapters.
