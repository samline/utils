# @samline/is-visible

Know when elements enter and leave the viewport or any scroll container. One call watches an element, a selector or a list, on IntersectionObservers shared across the page, for vanilla JavaScript, React, Vue, Svelte and plain HTML.

[Demo](https://samline.github.io/utils/is-visible/) · [Examples](https://samline.github.io/utils/is-visible/examples/) · [Documentation](https://samline.github.io/utils/docs/is-visible/) · [Changelog](CHANGELOG.md)

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
npm install @samline/is-visible
```

```sh
pnpm add @samline/is-visible
```

```sh
bun add @samline/is-visible
```

Works in any modern browser; browsers without IntersectionObserver get the `fallback`. No runtime dependencies; React, Vue and Svelte are optional peers, needed only for their adapters. From CommonJS use the named export: `const { isVisible } = require('@samline/is-visible')`.

## Quick start

```js
import { isVisible } from '@samline/is-visible'

// Load each image 200px before it scrolls in, once.
isVisible('img[data-src]', {
  once: true,
  rootMargin: '0px 0px 200px 0px',
  visible: (entry, image) => {
    image.src = image.dataset.src
  },
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

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle with a classic script tag. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/is-visible@1.0.1/dist/browser/is-visible.global.js"></script>
<script>
  window.isVisible('[data-track]', {
    once: true,
    visible: (entry, element) => element.classList.add('is-visible'),
  })
</script>
```

The bundle defines `window.isVisible(target, options)` and `window.IsVisible` with `isVisible`, `observe` (the same function, kept from 0.x) and `observeVisibility`.

## Capabilities

### Any target, one cleanup

Pass an element, a CSS selector, a `NodeList`, an `HTMLCollection` or an array. The returned function stops observing every element of that call. Without a DOM or with an empty target it is a no-op.

### Honest transitions

`visible(entry, element)` fires once per entry, never repeatedly while the element stays visible. `notVisible` fires only with `inOut` and only after the element was visible. A ratio within 0.001 of the threshold counts as reached.

### Shared observers

Calls with the same `root`, `rootMargin` and `threshold` share one IntersectionObserver. Elements are unobserved when no call needs them and the observer disconnects when it watches nothing.

### Never stuck hidden

Without IntersectionObserver, `fallback: 'visible'` (the default) reports every element visible once; `'none'` does nothing.

### Framework adapters

- **React:** `const { ref, isVisible, entry } = useIsVisible(options)` and `<VisibilityObserver>` with a render-prop child.
- **Vue:** `const { target, isVisible, entry } = useIsVisible(options)` (options may be a ref or getter) and `<VisibilityObserver>` with a default slot.
- **Svelte:** `const { action, isVisible, entry } = useIsVisible(options)` with `use:action`, plus `createVisibilityAction`.

In every adapter `isVisible` turns `false` when the element leaves, even without `inOut`; your `notVisible` still runs only with `inOut`.

### Migrating from 0.x

- `notVisible` no longer fires for an element that was never visible, and `visible` no longer repeats while the element stays visible.
- Callbacks receive `(entry, element)`; callbacks without arguments keep working.
- Targets may be selectors and lists.
- `options: { root, rootMargin, threshold }` is deprecated in favour of top-level options. It still works.
- New: shared observers, `fallback`, a CommonJS build and the `./browser` export.

## API at a glance

| API                                                            | Purpose                                                                       |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `isVisible(target, options?)`                                  | Watch elements and get `visible` / `notVisible` callbacks; returns a cleanup. |
| `observeVisibility(target, options?)`                          | The same, plus `onChange(entry, element)` for every raw entry.                |
| `inOut`, `once`, `root`, `rootMargin`, `threshold`, `fallback` | Observation options.                                                          |

### Entrypoints

| Entrypoint                    | When to use                                                               |
| ----------------------------- | ------------------------------------------------------------------------- |
| `@samline/is-visible`         | ESM or CommonJS: `isVisible` (default and named) and `observeVisibility`. |
| `@samline/is-visible/vanilla` | The same API as an explicit subpath.                                      |
| `@samline/is-visible/react`   | `useIsVisible` and `VisibilityObserver`.                                  |
| `@samline/is-visible/vue`     | `useIsVisible` and `VisibilityObserver`.                                  |
| `@samline/is-visible/svelte`  | `useIsVisible` and `createVisibilityAction`.                              |
| `@samline/is-visible/browser` | Classic script that defines `window.isVisible` and `window.IsVisible`.    |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/is-visible/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/is-visible/examples/) with complete and separate source files.

| Guide                                                                               | What it covers                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/is-visible/getting-started/)    | npm, CDN and the first lazy image.                                  |
| [API reference](https://samline.github.io/utils/docs/is-visible/reference/api/)     | `isVisible`, `observeVisibility`, callbacks and the browser global. |
| [Options](https://samline.github.io/utils/docs/is-visible/reference/configuration/) | Every option, shared observers and the fallback.                    |
| [Frameworks](https://samline.github.io/utils/docs/is-visible/guides/frameworks/)    | React, Vue and Svelte adapters.                                     |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/is-visible/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [Is Visible skill](https://samline.github.io/utils/skills/is-visible/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/is-visible/SKILL.md) into an `is-visible/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/is-visible
curl --fail --location https://samline.github.io/utils/skills/is-visible/SKILL.md \
  --output .agents/skills/is-visible/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
