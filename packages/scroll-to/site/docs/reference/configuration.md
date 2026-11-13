---
title: Options
description: Every @samline/scroll-to option and data-scroll-to attribute, with defaults and how targets, offsets and alignment are read.
locale: en
sidebar:
  group: reference
  order: 2
---

## Options

`scrollTo`, `scrollPosition` and `autoScrollTo` take the same options.

| Option | Default | Description |
| --- | --- | --- |
| `container` | the page | What scrolls: an element or a selector. Use it for boxes, tab strips and carousels. |
| `offset` | `0` | Space kept above the target: pixels (`80` or `'80px'`), a percentage of the container height (`'10%'`), or an element or selector whose height is used (`'#header'`) |
| `block` | `'start'` | Vertical alignment: `start`, `center`, `end` or `nearest` (only scrolls when the target is not fully visible) |
| `inline` | `'nearest'` | Horizontal alignment, same values |
| `duration` | `'auto'` | Milliseconds, or `'auto'`: half a millisecond per pixel, from 300 to 1000 |
| `easing` | `'ease-in-out'` | `'ease-in-out'`, `'ease-out'`, `'linear'` or a function from 0–1 to 0–1 |
| `behavior` | `'smooth'` | `'instant'` jumps. Reduced motion always jumps. |
| `interruptible` | `true` | Stop when the visitor scrolls with the wheel, touches, clicks or presses a key |
| `focus` | `false` (`true` for `autoScrollTo`) | Move keyboard focus to the target on arrival. Targets that cannot take focus get `tabindex="-1"`. |
| `hash` | `false` (`'push'` for `autoScrollTo`) | Write the target's `#id` to the URL on arrival: `'push'` adds a history entry, `'replace'` does not |

`autoScrollTo` also takes:

| Option | Default | Description |
| --- | --- | --- |
| `selector` | `'[data-scroll-to], a[href^="#"]'` | Triggers to handle. Use `'[data-scroll-to]'` to leave plain links alone, or add `'a[href*="#"]'` for full URLs to this page. |
| `scope` | `document` | Where clicks are listened to |
| `initialHash` | `true` | With an `offset`, align the URL's `#id` once the page loads, since the browser's own jump ignores the offset |

## Targets

| Value | Scrolls to |
| --- | --- |
| An element | That element |
| `'#pricing'` | The element with that id (ids with special characters work) |
| A selector | The first match |
| `'top'`, `'#top'` or `'#'` | The top |
| A number | That vertical position, in pixels |

## Attributes

Set them on a trigger. They win over the options given to `autoScrollTo`.

| Attribute | Value | Description |
| --- | --- | --- |
| `data-scroll-to` | target | The target. Empty on a link: its `href` is used. |
| `data-scroll-to-offset` | pixels, `%` or a selector | `offset` |
| `data-scroll-to-container` | selector | `container` |
| `data-scroll-to-block` | `start`, `center`, `end`, `nearest` | `block` |
| `data-scroll-to-inline` | `start`, `center`, `end`, `nearest` | `inline` |
| `data-scroll-to-duration` | milliseconds | `duration` |

Clicks with a modifier key or a middle button, and clicks whose default another script already prevented, are left alone. Links to other pages and to ids that do not exist keep their normal behavior.
