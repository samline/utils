# @samline/is-visible

## 1.0.0

### Major Changes

- e9a41c7: Move to the `samline/utils` monorepo and release 1.0.

  - **Breaking:** `notVisible` no longer fires for an element that was never visible, and `visible` no longer repeats while the element stays visible.
  - Callbacks receive `(entry, element)`. Targets may be an element, a selector, a `NodeList` or an array.
  - Calls with the same `root`, `rootMargin` and `threshold` share one `IntersectionObserver`.
  - Top-level `root`, `rootMargin` and `threshold` options. The nested `options` object is deprecated but still supported.
  - `fallback: 'visible' | 'none'` for browsers without IntersectionObserver, so content is never left hidden.
  - React, Vue and Svelte adapters share one engine, and `isVisible` resets when the element leaves.
  - CommonJS build, minified browser bundle and `./browser` export.
