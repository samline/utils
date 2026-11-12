# @samline/is-visible

Know when elements enter and leave the viewport. One call watches one element, a selector or a list. Observers are shared between calls with the same settings, `visible` fires once per entry, and content is never left hidden in browsers without IntersectionObserver. Includes React, Vue and Svelte adapters and a browser global for plain HTML.

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
npm install @samline/is-visible
pnpm add @samline/is-visible
yarn add @samline/is-visible
bun add @samline/is-visible
```

## CDN / Browser

For pages without a build step (Shopify, WordPress, plain HTML templates), load the browser bundle with a classic script tag. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/is-visible@1.0.0/dist/browser/is-visible.global.js"></script>
<script>
  window.isVisible('[data-track]', {
    once: true,
    visible: (entry, element) => element.classList.add('is-visible'),
  })
</script>
```

The bundle defines `window.isVisible(target, options)` and `window.IsVisible` with `isVisible`, `observe` (same function, kept from 0.x) and `observeVisibility`.

## Entrypoints

| Import                        | Exposes                                                           |
| ----------------------------- | ----------------------------------------------------------------- |
| `@samline/is-visible`         | `isVisible` (default and named), `observeVisibility`              |
| `@samline/is-visible/vanilla` | Same as the root, as an explicit subpath                          |
| `@samline/is-visible/react`   | Root API + `useIsVisible`, `VisibilityObserver`                   |
| `@samline/is-visible/vue`     | Root API + `useIsVisible`, `VisibilityObserver`                   |
| `@samline/is-visible/svelte`  | Root API + `useIsVisible`, `createVisibilityAction`               |
| `@samline/is-visible/browser` | Classic script exposing `window.isVisible` and `window.IsVisible` |

React, Vue and Svelte are optional peer dependencies: install only the one you use. From CommonJS, use the named export: `const { isVisible } = require('@samline/is-visible')`.

## Quick start

```ts
import isVisible from '@samline/is-visible'

// Lazy work: run once, when each card is 200px from entering.
isVisible('.card', {
  once: true,
  rootMargin: '0px 0px 200px 0px',
  visible: (entry, card) => card.classList.add('is-ready'),
})

// Pause a video while it is off-screen.
const stop = isVisible(video, {
  inOut: true,
  threshold: 0.5,
  visible: () => video.play(),
  notVisible: () => video.pause(),
})

stop() // stops observing every element of this call
```

## API

### `isVisible(target, options?)` → `() => void`

`target` is an element, a CSS selector, a `NodeList`, an `HTMLCollection` or an array of elements. The returned function stops observing every element of the call. Without a DOM (SSR) or with an empty target it returns a no-op.

| Option       | Default     | Description                                                                                           |
| ------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `visible`    | –           | `(entry, element)` when an element becomes visible. Fires once per entry, never while it stays.       |
| `notVisible` | –           | `(entry, element)` when a visible element leaves. Requires `inOut`.                                   |
| `inOut`      | `false`     | Report leaving and later re-entries.                                                                  |
| `once`       | `false`     | Stop observing each element after its first `visible`.                                                |
| `root`       | viewport    | Scroll container to observe against.                                                                  |
| `rootMargin` | `'0px'`     | Grow or shrink the root box, for example `'0px 0px 200px 0px'` to fire early.                         |
| `threshold`  | `0`         | Share of the element (`0`–`1`) that must be visible. Arrays are accepted; the smallest one counts.    |
| `fallback`   | `'visible'` | Without IntersectionObserver, `'visible'` calls `visible(null, element)` once; `'none'` does nothing. |

`observeVisibility(target, options)` is the same function with an extra `onChange(entry, element)` that receives every raw entry.

### Behaviour

- **Shared observers:** every call with the same `root`, `rootMargin` and `threshold` shares one `IntersectionObserver`. An element is unobserved when no call needs it, and the observer is disconnected when it watches nothing.
- **No false "left" events:** `notVisible` only fires after the element was visible.
- **Threshold tolerance:** a ratio within 0.001 of the threshold counts as reached, because some engines report `0.4999` for `0.5`.

### Frameworks

- **React:** `const { ref, isVisible, entry } = useIsVisible(options)`; attach `ref` to the element. Callbacks always read their latest value, and the observer is recreated only when the element or the observation settings change. `<VisibilityObserver as="section" once>{({ isVisible }) => …}</VisibilityObserver>` renders a wrapper.
- **Vue:** `const { target, isVisible, entry } = useIsVisible(options)`; bind `ref="target"`. Options may be a ref or getter. `<VisibilityObserver>` passes `{ isVisible, entry }` to its default slot.
- **Svelte:** `const { action, isVisible, entry } = useIsVisible(options)`; use `use:action` or `use:action={options}`. `isVisible` and `entry` are readable stores.

In every adapter `isVisible` turns `false` when the element leaves, even without `inOut`. Your `notVisible` still runs only with `inOut`.

## Supported locales

Not applicable: the package has no locale-dependent behaviour.

## Migrating from 0.x

- **Behaviour:** `notVisible` no longer fires on the first observation of an element that was never visible, and `visible` no longer repeats while the element stays visible (for example with several thresholds).
- **Callbacks** now receive `(entry, element)`. Callbacks that take no arguments keep working.
- **Targets** may be selectors and lists, not only one element.
- **Options:** `options: { root, rootMargin, threshold }` is deprecated in favour of top-level `root`, `rootMargin` and `threshold`. It still works.
- **New:** shared observers, `fallback`, a CommonJS build and the `./browser` export.

## Documentation

Guides and live examples: [samline.github.io/utils/is-visible](https://samline.github.io/utils/is-visible/).

## License

MIT © Samuel Olvera (samline)
