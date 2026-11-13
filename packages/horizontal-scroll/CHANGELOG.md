# @samline/horizontal-scroll

## 1.0.0

### Major Changes

- First release: `horizontalScroll` and `autoHorizontalScroll` pin a section while its track moves sideways with the vertical scroll, using `position: sticky` and a measured section height, with `top` for fixed headers, `speed`, `media` queries, reduced motion, keyboard focus that scrolls the page to off-screen items, scroll containers (`root`), a `--horizontal-scroll-progress` variable and `onProgress`. When it is not running the section is left to your CSS. ESM, CommonJS and a browser global (`window.HorizontalScroll`) that starts on its own.
