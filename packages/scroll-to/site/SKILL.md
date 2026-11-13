---
name: scroll-to
description: Use @samline/scroll-to for smooth scrolling to anchors, elements and positions with fixed header offsets, alignment, easing, focus and history, in vanilla JS, any framework or plain HTML.
package-version: '1.0.0'
---

# @samline/scroll-to

Build against the installed version; this skill describes 1.0.0.

- **Install:** `npm install @samline/scroll-to`. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/scroll-to@1.0.0/dist/browser/scroll-to.global.js`; it handles same-page `#id` links and `[data-scroll-to]` on its own (`data-manual` on the script tag, then `ScrollTo.auto(options)`, to pass options). No stylesheet.
- **Markup:** plain `<a href="#id">` links, or any element with `data-scroll-to="#id" | selector | top`. Per-trigger attributes: `data-scroll-to-offset`, `-container`, `-block`, `-inline`, `-duration`.
- **Script:** `autoScrollTo({ offset, container, block, inline, duration, easing, behavior, interruptible, focus, hash, selector, scope, initialHash })` returns `{ destroy }`; `await scrollTo(target, options)` resolves `true` on arrival, `false` when interrupted or replaced; `scrollPosition(target, options)` measures only; `cancelScroll(container)`.
- **Semantics:** `offset` takes px, `%` or an element/selector whose height is used; destination re-measured each frame; wheel/touch/key interrupts; reduced motion jumps. `autoScrollTo` defaults to `focus: true` and `hash: 'push'`; plain `scrollTo` changes neither unless asked.
- **Layouts:** pass `container` for scrolling boxes and `inline: 'center', block: 'nearest'` to center tabs in a strip; add `scroll-padding-top` in CSS for jumps the script does not handle.
- **Do not** add another click handler that calls `scrollIntoView` on the same links, compute offsets with `offsetTop` yourself, or use `<span>` click targets where a link works.
