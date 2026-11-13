---
title: Options
description: leading, trailing and maxWait for debounce, and leading and trailing for throttle.
locale: en
sidebar:
  group: reference
  order: 2
---

## `debounce` options

| Option     | Default | Description                                                       |
| ---------- | ------- | ----------------------------------------------------------------- |
| `leading`  | `false` | Invoke on the first call of a burst.                              |
| `trailing` | `true`  | Invoke after the burst with the latest arguments.                 |
| `maxWait`  | –       | Longest delay under continuous calls. Clamped to at least `wait`. |

With `leading` and `trailing` both enabled, a single call runs once, not twice. At least one of them must be enabled.

## `throttle` options

| Option     | Default | Description                                       |
| ---------- | ------- | ------------------------------------------------- |
| `leading`  | `true`  | Invoke on the first call.                         |
| `trailing` | `true`  | Invoke once more after the last call of a window. |

`throttle(fn, wait)` is `debounce(fn, wait, { leading: true, trailing: true, maxWait: wait })`.

## Lifecycle

Pending invocations hold a timer. Call `cancel()` when the owner goes away (a closed dialog, a destroyed component) so `fn` never runs on stale state, and `flush()` when the result is needed now (a form submit). The React, Vue and Svelte adapters cancel automatically.
