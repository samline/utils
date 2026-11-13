---
title: API reference
description: debounce, throttle, rafThrottle and the cancel, flush and pending controls of their returned functions.
locale: en
sidebar:
  group: reference
  order: 1
---

## `debounce(fn, wait?, options?)`

Returns a function that delays `fn` until `wait` milliseconds have passed without another call. See [options](../configuration/) for `leading`, `trailing` and `maxWait`.

```js
const save = debounce(value => api.save(value), 500, { maxWait: 2000 })
```

Throws a `TypeError` when `fn` is not a function, and an `Error` when both `leading` and `trailing` are `false`. Invalid or negative `wait` values become `0`.

## `throttle(fn, wait?, options?)`

Returns a function that invokes `fn` at most once every `wait` milliseconds. With the defaults (`leading: true`, `trailing: true`) the first call runs immediately and the latest arguments run at the end of each window.

```js
const track = throttle(position => analytics.send(position), 1000)
```

## `rafThrottle(fn)`

Returns a function that invokes `fn` at most once per animation frame, with the latest arguments. Without `requestAnimationFrame` (server rendering, tests) it falls back to a 16 ms timer.

```js
const onScroll = rafThrottle(() => header.classList.toggle('compact', scrollY > 80))
window.addEventListener('scroll', onScroll, { passive: true })
```

## Returned function

| Member         | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `(...args)`    | Schedules `fn`. Returns the result of the last invocation, if any.     |
| `cancel()`     | Drops the pending invocation.                                          |
| `flush()`      | Runs the pending invocation now and returns its result.                |
| `pending()`    | `true` while an invocation is scheduled.                               |

`this` is forwarded, so the returned function works as an object method.

## Browser global

The CDN bundle defines `window.Debounce` with `debounce`, `throttle`, `rafThrottle` and the deprecated `createDebounce` alias of `debounce`.

## Types

`DebounceOptions`, `ThrottleOptions`, `DebouncedFunction<F>`, `ThrottledFunction<F>`, `RafThrottledFunction<F>` and `Controlled<F>` are exported from every entry.
