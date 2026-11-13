---
title: Options
description: Every @samline/counter attribute, JavaScript option and state, with defaults and which one wins.
locale: en
sidebar:
  group: reference
  order: 2
---

## Attributes

Attributes win over options, so one call can set defaults and each number can override them.

| Attribute | Value | Description |
| --- | --- | --- |
| `data-counter` | number, or empty | The final value as a plain number (`12480`, `99.95`, `-3`). Empty reads it from the text. |
| `data-counter-from` | number | Start value. Higher than the target counts down. |
| `data-counter-duration` | milliseconds | How long counting takes |
| `data-counter-delay` | milliseconds | Wait before counting |
| `data-counter-easing` | `ease-out`, `ease-in-out`, `linear` | Curve of the count |
| `data-counter-decimals` | number | Decimals to show |
| `data-counter-locale` | BCP 47 tag | Language for formatting and for reading the text |
| `data-counter-repeat` | present, or `false` | Reset on leaving, count again on every entry |

## Options

| Option | Default | Description |
| --- | --- | --- |
| `from` | `0` | Start value |
| `to` | — | Final value when `data-counter` has no number; by default it is read from the text |
| `duration` | `2000` | Milliseconds |
| `delay` | `0` | Milliseconds before counting |
| `easing` | `'ease-out'` | A name or a function from progress (`0`–`1`) to eased progress |
| `decimals` | from the target | Decimals to show |
| `locale` | closest `lang` | BCP 47 locale; an invalid one falls back to the browser's |
| `format` | — | `Intl.NumberFormat` options, for example `{ style: 'currency', currency: 'EUR' }` |
| `formatter(value, element)` | — | Returns the text yourself; replaces `locale`, `decimals` and `format` |
| `repeat` | `false` | Count again every time the number enters |
| `root` | viewport | Scroll container to observe against |
| `rootMargin` | `'0px'` | Grows or shrinks the root |
| `threshold` | `0.5` | Share of the number that must be visible to start |
| `onStart(element)` | — | Counting starts |
| `onUpdate(value, element)` | — | Every frame, with the unformatted value |
| `onComplete(element)` | — | The final value is shown (also right away with reduced motion) |
| `selector`, `scope`, `observe` | `'[data-counter]'`, `document`, `true` | `autoCounter` only |

## Final value and decimals

The final value comes from the first of these that holds a number:

1. `data-counter="1234.5"`, a plain number with a `.` for decimals;
2. the `to` option;
3. the element's text, read in its language: `1.234,5` in German, `$1,234.50` in English.

Decimals come from how the target is written: `data-counter="12.50"` shows two decimals all the way. With `format: { style: 'percent' }`, write fractions (`0.25` for 25%); two decimals are taken off for the percentage.

## States

The script sets `data-counter-state` on each number:

| State | Meaning |
| --- | --- |
| `pending` | Showing the start value, waiting to be visible |
| `counting` | Counting |
| `done` | Showing the final value |

Use them in CSS, for example to highlight a number while it counts:

```css
[data-counter-state='counting'] {
  color: var(--accent);
}
```
