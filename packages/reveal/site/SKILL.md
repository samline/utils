---
name: reveal
description: Use @samline/reveal to reveal elements as they scroll into view with CSS effects, cascades, repeat or a CSS-only scrub mode, in vanilla JS, any framework or plain HTML, without hiding content already on screen.
package-version: '1.0.0'
---

# @samline/reveal

Build against the installed version; this skill describes 1.0.0.

- **Install:** `npm install @samline/reveal`, then load `@samline/reveal/style.css` once. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/reveal@1.0.0/dist/style.css` and `https://cdn.jsdelivr.net/npm/@samline/reveal@1.0.0/dist/browser/reveal.global.js`; it reveals every `[data-reveal]` on its own (`data-manual` on the script tag, then `Reveal.auto(options)`, to pass options).
- **Markup first:** `data-reveal` (empty = `up`, or `down`, `left`, `right`, `fade`, `zoom`, `blur`), `data-reveal-duration`, `data-reveal-delay` (ms), `data-reveal-distance` (CSS length), `data-reveal-repeat`, `data-reveal-stagger="80"` on a container, `data-reveal-scrub` for a CSS-only scroll-linked effect. Attributes win over options.
- **Script:** `autoReveal(options)` for a whole page (also picks up elements added later; returns `{ refresh, destroy }`), or `const stop = reveal(target, { effect, duration, delay, distance, stagger, repeat, root, rootMargin, threshold, onReveal, onHide })`. Call `stop()` on unmount.
- **Semantics:** only elements below the fold on load are hidden (`data-reveal-state="pending"`), then `revealing` and `revealed`. In-view content never flashes. Reduced motion, print and no-JS keep everything visible.
- **Styling:** theme with `--reveal-duration`, `--reveal-delay`, `--reveal-easing`, `--reveal-distance`, `--reveal-scale`, `--reveal-blur`, `--reveal-range`. Custom starting points: style `[data-reveal-state='pending']`; rules use `:where()` so yours win. Effects use `translate`/`scale`/`filter`, not `transform`.
- **Do not** hide `[data-reveal]` elements in your own CSS before the script runs, add your own IntersectionObserver for the same elements, or call `reveal` on elements `autoReveal` already handles.
