---
name: counter
description: Use @samline/counter to animate numbers counting up or down as they scroll into view, with easing, decimals and Intl formatting, in vanilla JS, any framework or plain HTML, while keeping the real value in the HTML.
package-version: '1.0.0'
---

# @samline/counter

Build against the installed version; this skill describes 1.0.0.

- **Install:** `npm install @samline/counter`. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/counter@1.0.0/dist/browser/counter.global.js`; it counts every `[data-counter]` on its own (`data-manual` on the script tag, then `Counter.auto(options)`, to pass options). No stylesheet.
- **Markup first:** render the final value and put the plain number in the attribute: `<span data-counter="12480">12,480</span>`. Empty `data-counter` reads the text in the element's `lang`. Also `data-counter-from` (higher counts down), `-duration`, `-delay` (ms), `-easing` (`ease-out`, `ease-in-out`, `linear`), `-decimals`, `-locale`, `-repeat`. Attributes win over options.
- **Script:** `autoCounter(options)` for a whole page (also picks up elements added later; returns `{ refresh, destroy }`), or `const stop = counter(target, { from, to, duration, delay, easing, decimals, locale, format, formatter, repeat, root, rootMargin, threshold, onStart, onUpdate, onComplete })`. `stop()` restores the original text.
- **Formatting:** `format` takes `Intl.NumberFormat` options (currency, compact, unit). Percent: write fractions (`0.25`). Keep units, `+` and `%` outside the counted element; use `font-variant-numeric: tabular-nums`.
- **Without DOM:** `animateNumber({ from, to, duration, easing, onUpdate, onComplete })` returns a cancel function; `parseNumber(text, locale)`.
- **Semantics:** starts when half the number is visible; states `pending`, `counting`, `done` in `data-counter-state`; reduced motion keeps the rendered value.
- **Do not** leave the element empty in the HTML, count with `setInterval`, or call `counter` on elements `autoCounter` already handles.
