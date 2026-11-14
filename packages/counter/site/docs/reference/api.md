---
title: 'API reference'
titleAccent: 'reference'
description: Every @samline/counter export, counter, autoCounter, animateNumber, parseNumber, EASINGS and the window.Counter browser global.
locale: en
sidebar:
  group: reference
  order: 1
---

## counter(target?, options?)

```ts
counter(target?: ElementTarget, options?: CounterOptions): () => void
```

Counts `target` when it scrolls into view and returns a cleanup. `target` is a selector, an element, a NodeList or an array, and defaults to `'[data-counter]'`. Elements without a final value (no number in `data-counter`, no `to` option and no number in the text) are left alone.

```js
import { counter } from '@samline/counter'

const stop = counter('.stat', { duration: 1500, easing: 'ease-in-out' })
// Later: stop counting and put the original text back.
stop()
```

The cleanup cancels any running count, restores each element's original text and removes `data-counter-state`. Calling it twice is safe. On the server, or with no matching elements, `counter` returns a no-op.

## autoCounter(options?)

```ts
autoCounter(options?: AutoCounterOptions): { refresh(): void; destroy(): void }
```

Counts every element matching `selector` (default `'[data-counter]'`) inside `scope` (default `document`). With `observe: true` (the default) it also counts matching elements added later and cleans up elements that are removed.

`AutoCounterOptions` accepts every [`CounterOptions`](../configuration/#options) field plus `selector`, `scope` and `observe`.

## animateNumber(options)

```ts
animateNumber(options: AnimateNumberOptions): () => void
```

The eased tween behind `counter`, for anything that is not text: charts, canvas, CSS variables. Returns a function that cancels it.

```js
import { animateNumber } from '@samline/counter'

const cancel = animateNumber({
  from: 0,
  to: 72,
  duration: 800, // ms, default 2000
  delay: 0,
  easing: 'ease-out', // 'linear', 'ease-in-out' or (progress) => eased
  onUpdate: value => gauge.style.setProperty('--value', value),
  onComplete: () => console.log('done'),
})
```

It is time-based, so it lasts the same at any frame rate. `onUpdate` receives `to` exactly on the last call; `onComplete` is not called when cancelled. Without `requestAnimationFrame`, or with `duration: 0`, it jumps to `to` at once.

## parseNumber(text, locale?)

```ts
parseNumber(text: string, locale?: string): { value: number; decimals: number } | null
```

Reads a number written for people in `locale`: `parseNumber('1.234,5 €', 'de')` returns `{ value: 1234.5, decimals: 1 }`. Grouping, currency symbols and spaces are ignored; a leading `-` or `−` makes it negative. Returns `null` when there is no digit. `counter` uses it when `data-counter` is empty.

## EASINGS

```js
import { EASINGS } from '@samline/counter'
// { linear, 'ease-out', 'ease-in-out' }: functions from progress to eased progress
```

`Easing`, `EasingName`, `CounterState`, `CounterOptions`, `AutoCounterOptions` and `AnimateNumberOptions` are exported as types. `@samline/counter/vanilla` exports `counter` as its default export.

## window.Counter

The browser bundle (`dist/browser/counter.global.js`) defines `window.Counter` and counts every `[data-counter]` as soon as the DOM is ready.

| Member | Description |
| --- | --- |
| `Counter.counter(target, options)` | Same as `counter` |
| `Counter.autoCounter(options)` | Same as `autoCounter` |
| `Counter.animateNumber(options)` | Same as `animateNumber` |
| `Counter.auto(options)` | Starts, or restarts, the automatic run with `options` and returns its controller |
| `Counter.controller` | The controller of the automatic run, or `null` |

Add `data-manual` to the script tag to skip the automatic start. Calling `Counter.auto()` before the DOM is ready also replaces it, so a deferred or inline script after the bundle can pass its own options. To count elements with different options, give them a class instead of `data-counter` and call `Counter.counter('.price', options)`, so the automatic run does not count them too.
