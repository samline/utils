---
title: API reference
description: Every @samline/scroll-spy export, scrollSpy, autoScrollSpy, their types and the window.ScrollSpy browser global.
locale: en
sidebar:
  group: reference
  order: 1
---

## scrollSpy(nav, options?)

```ts
scrollSpy(nav: Element | string, options?: ScrollSpyOptions): ScrollSpy
```

Watches the links inside `nav` (an element or a selector) that point to sections of this page, and marks the one whose section is active.

```js
import { scrollSpy } from '@samline/scroll-spy'

const spy = scrollSpy('#toc', { offset: 96, activeClass: 'is-active' })

spy.active // 'usage', or null
spy.refresh() // after adding or removing links or sections
spy.destroy() // stop and remove every attribute and class it added
```

A link counts when its `href` is `#id`, or points to this same page (same origin, path and query) with a hash, and an element with that id exists. Ids are URL-decoded, so `#caf%C3%A9` finds `id="café"`. Several links may point to the same section; all of them are marked.

`destroy()` removes listeners, `activeClass` and the `aria-current` it set, restoring any `aria-current` value a link had before. Calling it twice is safe. Without a matching navigation, or on the server, `scrollSpy` returns an inert object with `active: null`.

### Changes

`onChange` receives a `ScrollSpyChange` every time the active section changes, including to `null`:

```ts
interface ScrollSpyChange {
  id: string | null // the active section's id
  section: Element | null
  links: HTMLAnchorElement[] // every link to it in this navigation
  previous: string | null
}
```

## autoScrollSpy(options?)

```ts
autoScrollSpy(options?: AutoScrollSpyOptions): { refresh(): void; destroy(): void }
```

Watches every navigation matching `selector` (default `'[data-scroll-spy]'`) inside `scope` (default `document`). With `observe: true` (the default) it also watches navigations added later and cleans up removed ones. `AutoScrollSpyOptions` accepts every [`ScrollSpyOptions`](../configuration/#options) field plus `selector`, `scope` and `observe`.

`ScrollSpy`, `ScrollSpyChange`, `ScrollSpyOptions` and `AutoScrollSpyOptions` are exported as types. `@samline/scroll-spy/vanilla` exports `scrollSpy` as its default export.

## window.ScrollSpy

The browser bundle (`dist/browser/scroll-spy.global.js`) defines `window.ScrollSpy` and watches every `[data-scroll-spy]` as soon as the DOM is ready.

| Member | Description |
| --- | --- |
| `ScrollSpy.scrollSpy(nav, options)` | Same as `scrollSpy` |
| `ScrollSpy.autoScrollSpy(options)` | Same as `autoScrollSpy` |
| `ScrollSpy.auto(options)` | Starts, or restarts, the automatic run with `options` and returns its controller |
| `ScrollSpy.controller` | The controller of the automatic run, or `null` |

Add `data-manual` to the script tag to skip the automatic start. Calling `ScrollSpy.auto()` before the DOM is ready also replaces it, so a deferred or inline script after the bundle can pass its own options.
