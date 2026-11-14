---
title: 'API reference'
titleAccent: 'reference'
description: Every @samline/scroll-to export, scrollTo, scrollPosition, cancelScroll, autoScrollTo, their types and the window.ScrollTo global.
locale: en
sidebar:
  group: reference
  order: 1
---

## scrollTo(target, options?)

```ts
scrollTo(target: Element | string | number, options?: ScrollToOptions): Promise<boolean>
```

Scrolls the page (or `options.container`) to `target`. See [Options](../configuration/) for targets and options.

```js
import { scrollTo } from '@samline/scroll-to'

const arrived = await scrollTo('#faq', { offset: '#header', duration: 600 })
if (arrived) document.querySelector('#faq').classList.add('flash')
```

Resolves to `true` when it arrives, and `false` when the visitor interrupts it, another scroll on the same container replaces it, or the target does not exist. Focus and hash changes only happen on arrival.

## scrollPosition(target, options?)

```ts
scrollPosition(target, options?): { top: number; left: number } | null
```

Where the container would scroll to, clamped to what it can scroll, without moving. `null` when the target does not exist or there is no DOM.

## cancelScroll(container?)

Stops the scroll running on `container` (the page by default). Its promise resolves to `false`.

## autoScrollTo(options?)

```ts
autoScrollTo(options?: AutoScrollToOptions): { destroy(): void }
```

Handles clicks on same-page `#id` links and `[data-scroll-to]` triggers in `scope` with one delegated listener, with `focus: true` and `hash: 'push'` unless you change them. `destroy()` removes the listener.

## EASINGS

The named easing functions: `linear`, `ease-out` and `ease-in-out`. Pass your own function as `easing` for anything else.

## Types and constants

`ScrollToOptions`, `AutoScrollToOptions`, `ScrollToController`, `ScrollTarget`, `Align` and `Easing`. `ATTRIBUTE` is `'data-scroll-to'`. The default export is `scrollTo`; `@samline/scroll-to/vanilla` exports the same API.

## window.ScrollTo

The browser bundle (`dist/browser/scroll-to.global.js`) defines:

| Member | Description |
| --- | --- |
| `ScrollTo.scrollTo`, `ScrollTo.scrollPosition`, `ScrollTo.cancelScroll`, `ScrollTo.autoScrollTo` | Same as the package exports |
| `ScrollTo.auto(options?)` | Start (or restart) handling clicks with options; returns the controller |
| `ScrollTo.controller` | The controller of the automatic run, or `null` |

It starts on its own when the DOM is ready. With `data-manual` on the script tag it waits for `ScrollTo.auto()`; a call made before the DOM is ready also replaces the automatic start.
