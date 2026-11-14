---
title: 'Configuration options'
titleAccent: 'options'
description: inOut, once, root, rootMargin, threshold and fallback, and how shared observers work.
locale: en
sidebar:
  group: reference
  order: 2
  label: Configuration
---

| Option       | Default     | Description                                                                                  |
| ------------ | ----------- | -------------------------------------------------------------------------------------------- |
| `inOut`      | `false`     | Also report leaving (`notVisible`) and later re-entries.                                     |
| `once`       | `false`     | Stop observing each element after its first `visible`.                                       |
| `root`       | viewport    | Scroll container to observe against.                                                         |
| `rootMargin` | `'0px'`     | Grow or shrink the root box, for example `'0px 0px 200px 0px'` to fire early.                |
| `threshold`  | `0`         | Share of the element (`0`–`1`) that must be visible. Arrays are accepted; the smallest counts. |
| `fallback`   | `'visible'` | Behaviour without `IntersectionObserver` (see below).                                        |

## Threshold tolerance

A ratio within 0.001 of the threshold counts as reached, because some engines report `0.4999` for `0.5`.

## Shared observers

Every call with the same `root`, `rootMargin` and `threshold` shares one `IntersectionObserver`. An element is unobserved when no call needs it, and the observer disconnects when it watches nothing.

## Fallback

Without `IntersectionObserver`, `fallback: 'visible'` (the default) calls `visible(null, element)` once for each element, so revealed content is never left hidden. `fallback: 'none'` does nothing.

## Deprecated `options`

The 0.x `options: { root, rootMargin, threshold }` object still works. Prefer the top-level options.
