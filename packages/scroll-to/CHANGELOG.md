# @samline/scroll-to

## 1.0.0

### Major Changes

- First release: `scrollTo` animates the page or any container to an element, `#id`, selector, `'top'` or position, with `offset` (pixels, percentages or a live element such as a fixed header), `block` and `inline` alignment, `duration` and `easing`, a destination measured on every frame, interruption by the visitor, reduced motion, focus and URL hash handling, and a promise that tells whether it arrived. `scrollPosition` measures without moving, `cancelScroll` stops a scroll, and `autoScrollTo` handles same-page links and `[data-scroll-to]` triggers with one delegated listener, aligning the URL hash on load. ESM, CommonJS and a browser global (`window.ScrollTo`) that starts on its own.
