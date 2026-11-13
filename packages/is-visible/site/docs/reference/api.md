---
title: API reference
description: isVisible, observeVisibility, their visible and notVisible callbacks, targets and the browser global.
locale: en
sidebar:
  group: reference
  order: 1
---

## `isVisible(target, options?)`

Watches `target` and returns a function that stops observing every element of this call.

| `target`                                   | Elements watched                        |
| ------------------------------------------ | --------------------------------------- |
| `Element`                                  | That element                            |
| CSS selector                               | Every match in the document             |
| `NodeList`, `HTMLCollection`, array        | Every element, without duplicates       |
| `null`, `undefined` or no match            | None: returns a no-op cleanup           |

```js
const stop = isVisible('.card', {
  inOut: true,
  visible: (entry, card) => card.classList.add('in-view'),
  notVisible: (entry, card) => card.classList.remove('in-view'),
})
stop()
```

## Callbacks

| Callback                         | When                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `visible(entry, element)`        | The element becomes visible. Fires once per entry. `entry` is `null` in the fallback. |
| `notVisible(entry, element)`     | A visible element leaves. Requires `inOut`.                                        |

## `observeVisibility(target, options?)`

The same function, plus `onChange(entry, element)`, which receives every raw `IntersectionObserverEntry` before visibility is evaluated.

## Browser global

The CDN bundle defines `window.isVisible` and `window.IsVisible` with `isVisible`, `observe` (the same function, kept from 0.x) and `observeVisibility`.

## Types

`IsVisibleOptions`, `ObserveVisibilityOptions`, `VisibilityCallbacks`, `VisibilityObserverOptions` and `ElementTarget` are exported from every entry.
