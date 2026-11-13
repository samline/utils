# @samline/debounce

Tiny `debounce`, `throttle` and `rafThrottle` with `cancel()`, `flush()` and `pending()`, for vanilla JavaScript, React, Vue, Svelte and plain HTML. They forward `this`, return the last result and never throw outside the browser.

[Demo](https://samline.github.io/utils/debounce/) · [Examples](https://samline.github.io/utils/debounce/examples/) · [Documentation](https://samline.github.io/utils/docs/debounce/) · [Changelog](CHANGELOG.md)

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [HTML / CDN](#html--cdn)
- [Capabilities](#capabilities)
- [API at a glance](#api-at-a-glance)
- [Documentation](#documentation)
- [Changelog](#changelog)
- [AI agent skill](#ai-agent-skill)
- [License](#license)

## Installation

```sh
npm install @samline/debounce
```

```sh
pnpm add @samline/debounce
```

```sh
bun add @samline/debounce
```

Works in any modern browser and in Node 20 or newer. No runtime dependencies; React, Vue and Svelte are optional peers, needed only for their adapters.

## Quick start

```js
import { debounce, rafThrottle, throttle } from '@samline/debounce'

// Search 250 ms after the user stops typing.
const search = debounce(query => fetchResults(query), 250)
input.addEventListener('input', () => search(input.value))
form.addEventListener('submit', () => search.flush()) // do not wait
window.addEventListener('pagehide', () => search.cancel())

// Save at most once per second while typing.
const save = throttle(() => persist(state), 1000)

// Measure once per frame, whatever the event rate.
const measure = rafThrottle(() => updateLayout(element.getBoundingClientRect()))
window.addEventListener('scroll', measure, { passive: true })
```

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle with a classic script tag. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/debounce@1.0.0/dist/browser/debounce.global.js"></script>
<script>
  const { debounce, throttle, rafThrottle } = window.Debounce
  const search = debounce(query => console.log('search', query), 250)
  document.querySelector('input').addEventListener('input', event => search(event.target.value))
</script>
```

The bundle defines `window.Debounce` with `debounce`, `throttle`, `rafThrottle` and the deprecated `createDebounce` alias.

## Capabilities

### Three tools, one control surface

`debounce` waits for quiet, `throttle` keeps a steady rate and `rafThrottle` runs once per animation frame. Every returned function has `cancel()`, `flush()` and `pending()`, forwards `this` and returns the last result.

### Predictable options

`leading`, `trailing` and `maxWait` follow the lodash semantics. `maxWait` lower than `wait` is clamped to `wait`, invalid waits become `0`, and a single call with both edges enabled runs once.

### Framework adapters

- **React:** `useDebouncedCallback` and `useThrottledCallback` return a stable function that calls the latest callback, is recreated only when `wait` or an option changes, and is cancelled on unmount. `useDebouncedValue(value, wait)` returns the settled value.
- **Vue:** `useDebouncedCallback`, `useThrottledCallback` and `useDebouncedRef(source, wait)`, cancelled when the effect scope is disposed.
- **Svelte:** `createDebouncedStore(initial, wait)` with `flush()` and `cancel()`; chained `update` calls see the latest pending value.

### Migrating from 0.x

- `createDebounce` still works but is deprecated; use `debounce`.
- `debounce` now forwards `this`, returns the last result and adds `pending()`.
- `maxWait` lower than `wait` is clamped to `wait` (it used to fire early).
- Svelte's `createDebouncedStore` fixes chained `update` calls and adds `flush()` and `cancel()`.
- React's `useDebouncedCallback` now picks up changes to `wait` and options.
- New: `throttle`, `rafThrottle`, `useThrottledCallback` and a CommonJS build.

## API at a glance

| API                                                   | Purpose                                          |
| ----------------------------------------------------- | ------------------------------------------------ |
| `debounce(fn, wait?, { leading, trailing, maxWait })` | Run `fn` once the calls stop for `wait` ms.      |
| `throttle(fn, wait?, { leading, trailing })`          | Run `fn` at most once every `wait` ms.           |
| `rafThrottle(fn)`                                     | Run `fn` at most once per animation frame.       |
| `.cancel()` / `.flush()` / `.pending()`               | Drop, run now or inspect the pending invocation. |

### Entrypoints

| Entrypoint                  | When to use                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| `@samline/debounce`         | ESM or CommonJS: `debounce`, `throttle`, `rafThrottle`.              |
| `@samline/debounce/vanilla` | The same API as an explicit subpath.                                 |
| `@samline/debounce/react`   | `useDebouncedCallback`, `useThrottledCallback`, `useDebouncedValue`. |
| `@samline/debounce/vue`     | `useDebouncedCallback`, `useThrottledCallback`, `useDebouncedRef`.   |
| `@samline/debounce/svelte`  | `createDebouncedStore`.                                              |
| `@samline/debounce/browser` | Classic script that defines `window.Debounce`.                       |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/debounce/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/debounce/examples/) with complete and separate source files.

| Guide                                                                             | What it covers                                           |
| --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/debounce/getting-started/)    | npm, CDN and the first debounced handler.                |
| [API reference](https://samline.github.io/utils/docs/debounce/reference/api/)     | Every function, its return value and the browser global. |
| [Options](https://samline.github.io/utils/docs/debounce/reference/configuration/) | `leading`, `trailing`, `maxWait` and the lifecycle.      |
| [Frameworks](https://samline.github.io/utils/docs/debounce/guides/frameworks/)    | React, Vue and Svelte adapters.                          |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/debounce/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [Debounce skill](https://samline.github.io/utils/skills/debounce/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/debounce/SKILL.md) into a `debounce/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/debounce
curl --fail --location https://samline.github.io/utils/skills/debounce/SKILL.md \
  --output .agents/skills/debounce/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
