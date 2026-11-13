---
title: Options
description: Every @samline/scroll-spy attribute and JavaScript option, with defaults and which one wins.
locale: en
sidebar:
  group: reference
  order: 2
---

## Attributes

Set them on the navigation. Attributes win over options.

| Attribute | Value | Description |
| --- | --- | --- |
| `data-scroll-spy` | — | Marks a navigation for `autoScrollSpy` and the CDN script |
| `data-scroll-spy-offset` | pixels (`96`) or a percentage (`30%`) | Where the activation line sits |
| `data-scroll-spy-class` | class name | Class added to active links |
| `data-scroll-spy-lock` | `false` | Turn off locking a clicked link |
| `data-scroll-spy-follow` | `false` | Do not scroll the navigation to the active link |
| `data-scroll-spy-hash` | present, or `false` | Keep the URL hash in sync |

## Options

| Option | Default | Description |
| --- | --- | --- |
| `offset` | `'25%'` | Activation line from the top of the viewport or `root`: pixels (number or `'96px'`) or a percentage of its height. Invalid values use 25%. |
| `root` | viewport | Scroll container holding the sections |
| `links` | `'a[href*="#"]'` | Links to watch inside the navigation |
| `ariaCurrent` | `'true'` | `aria-current` value for active links, for example `'location'`, or `false` for none |
| `activeClass` | — | Class added to active links |
| `lockOnClick` | `true` | Keep a clicked link active until scrolling has been quiet for 150ms |
| `followActive` | `true` | When the navigation (or a box inside it) scrolls, scroll it so the active link is in view. Never scrolls the page. Instant with reduced motion. |
| `updateHash` | `false` | Replace the URL hash with the active id, without adding history entries |
| `onChange(change)` | — | The active section changed: `{ id, section, links, previous }` |
| `selector`, `scope`, `observe` | `'[data-scroll-spy]'`, `document`, `true` | `autoScrollSpy` only |

## What the script changes

| On | Change |
| --- | --- |
| Active links | `aria-current="true"` (or your value) and `activeClass` |
| Other links | `aria-current` removed, `activeClass` removed |
| The URL | Only with `updateHash`, through `history.replaceState` |

Nothing else in the page is touched, and `destroy()` reverts all of it.
