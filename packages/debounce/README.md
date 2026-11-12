# @samline/debounce

Tiny `debounce`, `throttle` and `rafThrottle` with `cancel()`, `flush()` and `pending()`. They forward `this`, return the last result and never throw outside the browser. Includes hooks for React, composables for Vue, a store for Svelte and a browser global for plain HTML.

## Table of contents

- [Installation](#installation)
- [CDN / Browser](#cdn--browser)
- [Entrypoints](#entrypoints)
- [Quick start](#quick-start)
- [API](#api)
- [Supported locales](#supported-locales)
- [Migrating from 0.x](#migrating-from-0x)
- [Documentation](#documentation)
- [License](#license)

## Installation

```sh
npm install @samline/debounce
pnpm add @samline/debounce
yarn add @samline/debounce
bun add @samline/debounce
```

## CDN / Browser

For pages without a build step (Shopify, WordPress, plain HTML templates), load the browser bundle with a classic script tag. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/debounce@1.0.0/dist/browser/debounce.global.js"></script>
<script>
  const { debounce, throttle, rafThrottle } = window.Debounce

  const search = debounce(query => console.log('search', query), 250)
  document.querySelector('input').addEventListener('input', event => search(event.target.value))
</script>
```

The bundle defines `window.Debounce` with `debounce`, `throttle`, `rafThrottle` and the deprecated `createDebounce` alias.

## Entrypoints

| Import                      | Exposes                                                                        |
| --------------------------- | ------------------------------------------------------------------------------ |
| `@samline/debounce`         | `debounce`, `throttle`, `rafThrottle`                                          |
| `@samline/debounce/vanilla` | Same as the root, as an explicit subpath                                       |
| `@samline/debounce/react`   | Root API + `useDebouncedCallback`, `useThrottledCallback`, `useDebouncedValue` |
| `@samline/debounce/vue`     | Root API + `useDebouncedCallback`, `useThrottledCallback`, `useDebouncedRef`   |
| `@samline/debounce/svelte`  | Root API + `createDebouncedStore`                                              |
| `@samline/debounce/browser` | Classic script exposing `window.Debounce`                                      |

React, Vue and Svelte are optional peer dependencies: install only the one you use.

## Quick start

```ts
import { debounce, rafThrottle, throttle } from '@samline/debounce'

// Search 250 ms after the user stops typing.
const search = debounce((query: string) => fetchResults(query), 250)
input.addEventListener('input', () => search(input.value))
form.addEventListener('submit', () => search.flush()) // do not wait
window.addEventListener('pagehide', () => search.cancel())

// Save at most once per second while dragging.
const save = throttle(() => persist(state), 1000)

// Measure once per frame, whatever the event rate.
const measure = rafThrottle(() => updateLayout(element.getBoundingClientRect()))
window.addEventListener('scroll', measure, { passive: true })
```

## API

### `debounce(fn, wait?, options?)`

Delays `fn` until `wait` ms have passed without another call.

| Option     | Default | Description                                                       |
| ---------- | ------- | ----------------------------------------------------------------- |
| `leading`  | `false` | Invoke on the first call of a burst.                              |
| `trailing` | `true`  | Invoke after the burst with the latest arguments.                 |
| `maxWait`  | –       | Longest delay under continuous calls. Clamped to at least `wait`. |

Invalid or negative `wait` values become `0`. At least one of `leading` or `trailing` must be enabled.

### `throttle(fn, wait?, options?)`

Invokes `fn` at most once every `wait` ms. `leading` and `trailing` default to `true`: the first call runs immediately and the latest arguments run at the end of each window.

### `rafThrottle(fn)`

Invokes `fn` at most once per animation frame with the latest arguments. Use it for scroll, resize, pointer and `ResizeObserver` handlers. Without `requestAnimationFrame` (SSR, tests) it falls back to a ~16 ms timer.

### Returned function

Every helper returns a function with the same `this` and parameters as `fn`, plus:

| Method      | Description                                           |
| ----------- | ----------------------------------------------------- |
| `cancel()`  | Drop the pending invocation.                          |
| `flush()`   | Run the pending invocation now and return its result. |
| `pending()` | `true` while an invocation is scheduled.              |

Calling the debounced or throttled function returns the result of the last invocation (`undefined` before the first one).

### Frameworks

- **React:** `useDebouncedCallback(cb, wait, options)` and `useThrottledCallback(cb, wait, options)` return a stable function that always calls the latest `cb`. It is recreated only when `wait` or an option changes, and cancelled on unmount. `useDebouncedValue(value, wait)` returns the value once it settles.
- **Vue:** `useDebouncedCallback`, `useThrottledCallback` and `useDebouncedRef(source, wait)`. Pending calls are cancelled when the effect scope is disposed.
- **Svelte:** `createDebouncedStore(initial, wait)` is a writable store whose `set` and `update` land after `wait`, with `flush()` and `cancel()`. Chained `update` calls see the latest pending value.

## Supported locales

Not applicable: the package has no locale-dependent behaviour.

## Migrating from 0.x

- `createDebounce` still works but is deprecated; use `debounce`.
- `debounce` now forwards `this`, returns the last result and adds `pending()`.
- `maxWait` lower than `wait` is clamped to `wait` (it used to fire early).
- Svelte's `createDebouncedStore` fixes chained `update` calls and adds `flush()` and `cancel()`.
- React's `useDebouncedCallback` now picks up changes to `wait` and options.
- New: `throttle`, `rafThrottle`, `useThrottledCallback` and a CommonJS build.

## Documentation

Guides and live examples: [samline.github.io/utils/debounce](https://samline.github.io/utils/debounce/).

## License

MIT © Samuel Olvera (samline)
