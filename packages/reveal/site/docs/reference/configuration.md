---
title: 'Configuration options'
titleAccent: 'options'
description: Every @samline/reveal attribute, JavaScript option, CSS custom property and state, with defaults and which one wins.
locale: en
sidebar:
  group: reference
  order: 2
  label: Configuration
---

## Attributes

Attributes win over options, so one call can set defaults and each element can override them.

| Attribute | Value | Description |
| --- | --- | --- |
| `data-reveal` | `up` (empty), `down`, `left`, `right`, `fade`, `zoom`, `blur` | Marks the element and picks the effect. An unknown value uses the `effect` option. |
| `data-reveal-duration` | milliseconds | Transition length |
| `data-reveal-delay` | milliseconds | Delay before the transition |
| `data-reveal-distance` | CSS length | How far `up`, `down`, `left` and `right` travel |
| `data-reveal-repeat` | present, or `false` | Hide again on leaving, reveal on every entry |
| `data-reveal-stagger` | milliseconds, on a container | Cascade the elements inside it that enter together |
| `data-reveal-scrub` | present | Follow the scroll position with CSS only; the script skips it |

## Options

| Option | Default | Description |
| --- | --- | --- |
| `effect` | `'up'` | Effect for elements whose `data-reveal` is empty or unknown |
| `duration` | CSS (`600`) | Transition length in milliseconds |
| `delay` | CSS (`0`) | Delay in milliseconds |
| `distance` | CSS (`'0.75rem'`) | CSS length for the directional effects |
| `stagger` | `0` | Milliseconds added per element when several are revealed together, in document order |
| `repeat` | `false` | Hide again after leaving and reveal on every entry |
| `root` | viewport | Scroll container to observe against |
| `rootMargin` | `'0px 0px 64px 0px'` | Grows the root so reveals start just before entering |
| `threshold` | `0` | Share of the element that must be visible, `0` to `1` |
| `onReveal(element)` | — | When an element is shown: its transition starts, or right away if it was in view on load |
| `onHide(element)` | — | When a `repeat` element is hidden again |
| `selector`, `scope`, `observe` | `'[data-reveal]'`, `document`, `true` | `autoReveal` only |

Elements cascade with the others of their closest `data-reveal-stagger` container; elements outside any container cascade with the others of the same call that share the `stagger` value. Only elements revealed in the same frame cascade, so content scrolled in one by one is never delayed.

## CSS custom properties

Set them on the element or on any ancestor. `duration`, `delay` and `distance` set the first three inline.

| Property | Default | Used by |
| --- | --- | --- |
| `--reveal-duration` | `600ms` | Every effect |
| `--reveal-delay` | `0ms` | Every effect; cascades add to it |
| `--reveal-easing` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Every effect |
| `--reveal-distance` | `0.75rem` | `up`, `down`, `left`, `right` |
| `--reveal-scale` | `0.94` | `zoom` |
| `--reveal-blur` | `8px` | `blur` |
| `--reveal-range` | `entry 0% entry 100%` | Scrub mode |

## States

The script sets `data-reveal-state` on each element:

| State | Meaning |
| --- | --- |
| `pending` | Hidden, waiting to enter |
| `revealing` | The transition is running |
| `revealed` | Shown; no transition is applied any more |

The transition only exists in `revealing`, so your own transitions on the element keep working once it is `revealed`. Every rule in the stylesheet uses `:where()`, so any selector of yours wins.
