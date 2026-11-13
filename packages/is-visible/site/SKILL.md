---
name: is-visible
description: Use @samline/is-visible to run code when elements enter or leave the viewport or a scroll container, in vanilla JS, React, Vue, Svelte or plain HTML.
package-version: '1.0.0'
---

# @samline/is-visible

Build against the installed version; this skill describes 1.0.0.

- **Install:** `npm install @samline/is-visible`. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/is-visible@1.0.0/dist/browser/is-visible.global.js` and call `window.isVisible`.
- **Call:** `const stop = isVisible(target, { visible, notVisible, inOut, once, root, rootMargin, threshold, fallback })`. `target` may be an element, a selector, a NodeList or an array. `stop()` releases everything.
- **Semantics:** `visible(entry, element)` fires once per entry; `notVisible` only with `inOut` and only after the element was visible. Calls with the same root, rootMargin and threshold share one observer.
- **Progressive enhancement:** hide content only after JavaScript runs (for example a `.js` class), and keep `fallback: 'visible'` so old browsers show it.
- **Frameworks:** `@samline/is-visible/react` and `/vue` (`useIsVisible`, `VisibilityObserver`), `/svelte` (`useIsVisible`, `createVisibilityAction`).
- **Do not** create your own IntersectionObserver beside it for the same elements, or call isVisible again on every render.
