---
title: Counter
description: What @samline/counter does, why the final value stays in the HTML, and how counting, formatting and repeat fit together.
locale: en
sidebar:
  group: start
  order: 1
  label: Overview
---

`@samline/counter` counts numbers up (or down) as they scroll into view. Render the final value, put the plain number in `data-counter` and call `autoCounter()` (or load the CDN script).

```html
<p><span data-counter="12480">12,480</span> customers</p>
```

## How it behaves

1. The HTML holds the real value, so it is right without JavaScript, for search engines and for screen readers.
2. When the script runs, each number shows its start value (`0` by default), formatted for its language.
3. When half of it is visible, it counts to the final value over two seconds with an ease-out curve, and ends exactly on it.
4. With `prefers-reduced-motion: reduce`, the rendered value never changes.

## Pieces

| Job | How |
| --- | --- |
| Final value | `data-counter="12480"`, or read from the text when the attribute is empty |
| Start value | `data-counter-from` (count down by starting higher) |
| Timing | `data-counter-duration`, `data-counter-delay`, `data-counter-easing` |
| Decimals | Taken from the target; `data-counter-decimals` to change |
| Language | The closest `lang` attribute, or `data-counter-locale` |
| Currencies, compact | The `format` option (`Intl.NumberFormat` options) or a `formatter` |
| Count again | `data-counter-repeat` |
| Any number, no DOM | `animateNumber()` |

- [Installation](getting-started/) — npm, CDN and the first counter.
- [API reference](reference/api/) — `counter`, `autoCounter`, `animateNumber`, `parseNumber` and `window.Counter`.
- [Options](reference/configuration/) — attributes, options and states.
- [Formatting](guides/formatting/) — locales, currencies, percentages and layout.
- [Frameworks](guides/frameworks/) — React, Vue, Svelte, Astro and page swaps.
