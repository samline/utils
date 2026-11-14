---
title: 'Configuration options'
titleAccent: 'options'
description: Every @samline/horizontal-scroll attribute and JavaScript option, with defaults, which one wins and what the script changes.
locale: en
sidebar:
  group: reference
  order: 2
  label: Configuration
---

## Attributes

Set them on the section. Attributes win over options.

| Attribute | Value | Description |
| --- | --- | --- |
| `data-horizontal-scroll` | — | Marks a section for `autoHorizontalScroll` and the CDN script |
| `data-horizontal-scroll-track` | — | Marks the track inside the section. Without it, the first child is the track. |
| `data-horizontal-scroll-top` | pixels (`64`) or a percentage (`10%`) | Where the track pins |
| `data-horizontal-scroll-speed` | number (`1.5`) | Horizontal pixels per vertical pixel |
| `data-horizontal-scroll-media` | media query | Only run while it matches |
| `data-horizontal-scroll-focus` | `false` | Do not follow keyboard focus |

## Options

| Option | Default | Description |
| --- | --- | --- |
| `track` | `[data-horizontal-scroll-track]`, or the first child | The row that moves: a selector inside the section or an element |
| `top` | `0` | Pin position from the top of the viewport or `root`: pixels (number or `'64px'`) or a percentage of its height. Invalid values use 0. |
| `speed` | `1` | Horizontal pixels moved per vertical pixel scrolled. `2` needs half the scrolling. Values of 0 or less use 1. |
| `root` | viewport | Scroll container holding the section |
| `media` | always | Media query that turns the effect on, for example `'(min-width: 48rem)'`. Followed live. |
| `respectReducedMotion` | `true` | Turn the effect off while the visitor prefers reduced motion. Followed live. |
| `followFocus` | `true` | When an element of the track gets focus off to the side, scroll the page so it is in view |
| `onProgress(state)` | — | The progress changed: `{ progress, x, distance }` |
| `selector`, `scope`, `observe` | `'[data-horizontal-scroll]'`, `document`, `true` | `autoHorizontalScroll` only |

## What the script changes

While active:

| On | Change |
| --- | --- |
| The section | `height` (track height plus travel), `overflow-x: clip` (or `contain: paint` in older engines), `--horizontal-scroll-progress` from 0 to 1, `data-horizontal-scroll-state="active"` |
| The track | `position: sticky`, `top`, `translate` and `will-change: translate` |

While inactive the section only gets `data-horizontal-scroll-state="inactive"`. Inline styles you had set on those properties are put back when it turns off, and `destroy()` also removes the state attribute.
