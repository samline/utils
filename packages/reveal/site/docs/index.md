---
title: Reveal
description: What @samline/reveal does, which elements it hides and when, and how effects, cascades, repeat and scrub fit together.
locale: en
sidebar:
  group: start
  order: 1
  label: Overview
---

`@samline/reveal` reveals elements as they scroll into view. Mark them with `data-reveal`, load the stylesheet and call `autoReveal()` (or load the CDN script). The script only decides **when**; the stylesheet does the animation.

## What is hidden, and when

| Element on load | Without `repeat` | With `repeat` |
| --- | --- | --- |
| In view | Shown, never hidden | Shown, hidden after it leaves |
| Below the fold | Hidden, revealed on entry | Hidden, revealed on every entry |
| Above the viewport | Shown | Hidden, revealed on the way back |
| No box (`display: none`) | Shown | Shown |

Without JavaScript, without IntersectionObserver, with `prefers-reduced-motion: reduce` or when printing, every element is visible.

## Pieces

| Job | How |
| --- | --- |
| Pick an effect | `data-reveal="up"` (default), `down`, `left`, `right`, `fade`, `zoom` or `blur` |
| Time one element | `data-reveal-duration`, `data-reveal-delay`, `data-reveal-distance` |
| Cascade a group | `data-reveal-stagger="80"` on the container |
| Play every time | `data-reveal-repeat` |
| Follow the scroll | `data-reveal-scrub` (CSS only) |
| Theme everything | `--reveal-duration`, `--reveal-easing` and the other CSS variables |

- [Installation](getting-started/) — npm, CDN and the first reveal.
- [API reference](reference/api/) — `reveal`, `autoReveal` and `window.Reveal`.
- [Options](reference/configuration/) — attributes, options, CSS variables and states.
- [Effects and timing](guides/effects/) — custom effects, cascades and repeat.
- [Scrub mode](guides/scrub/) — scroll-driven reveals without JavaScript.
- [Frameworks](guides/frameworks/) — React, Vue, Svelte, Astro and page swaps.
