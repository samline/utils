---
title: API reference
description: Every @samline/reveal export, reveal, autoReveal, REVEAL_EFFECTS and the window.Reveal browser global, with their arguments and return values.
locale: en
sidebar:
  group: reference
  order: 1
---

## reveal(target?, options?)

```ts
reveal(target?: ElementTarget, options?: RevealOptions): () => void
```

Reveals `target` as it scrolls into view and returns a cleanup. `target` is a selector, an element, a NodeList or an array, and defaults to `'[data-reveal]'`. Elements with `data-reveal-scrub` are skipped: CSS handles them.

```js
import { reveal } from '@samline/reveal'

const stop = reveal('.card', { effect: 'zoom', stagger: 60 })
// Later: stop observing and remove every attribute and variable reveal added.
stop()
```

The cleanup removes `data-reveal-state`, restores the `data-reveal` value and the custom properties it set, cancels timers and releases the observers. Calling it twice is safe. On the server, or with no matching elements, `reveal` returns a no-op.

## autoReveal(options?)

```ts
autoReveal(options?: AutoRevealOptions): { refresh(): void; destroy(): void }
```

Reveals every element matching `selector` (default `'[data-reveal]'`) inside `scope` (default `document`). With `observe: true` (the default) it also reveals matching elements added later and cleans up elements that are removed.

```js
import { autoReveal } from '@samline/reveal'

const controller = autoReveal({ stagger: 80 })
controller.refresh() // pick up elements added while observe is false
controller.destroy() // stop everything
```

`AutoRevealOptions` accepts every [`RevealOptions`](../configuration/#options) field plus `selector`, `scope` and `observe`.

## REVEAL_EFFECTS

```js
import { REVEAL_EFFECTS } from '@samline/reveal'
// ['up', 'down', 'left', 'right', 'fade', 'zoom', 'blur']
```

`RevealEffect`, `RevealState`, `RevealOptions` and `AutoRevealOptions` are exported as types. `@samline/reveal/vanilla` exports `reveal` as its default export.

## window.Reveal

The browser bundle (`dist/browser/reveal.global.js`) defines `window.Reveal` and reveals every `[data-reveal]` as soon as the DOM is ready.

| Member | Description |
| --- | --- |
| `Reveal.reveal(target, options)` | Same as `reveal` |
| `Reveal.autoReveal(options)` | Same as `autoReveal` |
| `Reveal.auto(options)` | Starts, or restarts, the automatic run with `options` and returns its controller |
| `Reveal.controller` | The controller of the automatic run, or `null` |
| `Reveal.effects` | `REVEAL_EFFECTS` |

Add `data-manual` to the script tag to skip the automatic start. Calling `Reveal.auto()` before the DOM is ready also replaces it, so a deferred or inline script after the bundle can pass its own options.
