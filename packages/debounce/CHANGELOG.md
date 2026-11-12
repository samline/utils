# @samline/debounce

## 1.0.0

### Major Changes

- e9a41c7: Move to the `samline/utils` monorepo and release 1.0.

  - New `throttle`, `rafThrottle` and React/Vue `useThrottledCallback`.
  - Every helper returns a function with `cancel()`, `flush()` and `pending()`. It forwards `this` and returns the last result.
  - `maxWait` lower than `wait` is now clamped to `wait`, and invalid waits become `0`.
  - Svelte `createDebouncedStore` fixes chained `update` calls and adds `flush()` and `cancel()`.
  - React `useDebouncedCallback` now follows changes to `wait` and options.
  - CommonJS build, minified browser bundle and `./browser` export. `createDebounce` is deprecated in favour of `debounce`.
