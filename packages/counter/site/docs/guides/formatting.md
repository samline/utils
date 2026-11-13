---
title: Formatting
description: Format @samline/counter numbers for any language with currencies, percentages, compact notation or a formatter, and keep the layout steady.
locale: en
sidebar:
  group: guides
  order: 1
---

Numbers are formatted with `Intl.NumberFormat` in the language of the element: the closest `lang` attribute, `data-counter-locale` or the `locale` option. Write the HTML the same way, so the text is identical before and after counting.

```html
<html lang="de">
  …
  <span data-counter="12345.5">12.345,5</span>
```

## Currencies, units and compact numbers

Pass `Intl.NumberFormat` options with `format`:

```js
counter('.price', { locale: 'es-MX', format: { style: 'currency', currency: 'MXN' } })
counter('.followers', { format: { notation: 'compact' } }) // 12K, 1.2M
counter('.speed', { format: { style: 'unit', unit: 'kilometer-per-hour' } })
```

Fraction digits in `format` win over the decimals taken from the target.

For percentages, write fractions in `data-counter` (`0.25` for 25%); the decimals of the target are reduced by two, so `0.25` shows `25%` and `0.255` shows `25.5%`.

## Your own text

`formatter` replaces formatting entirely:

```js
counter('.duration', {
  formatter: minutes => `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}m`,
})
```

## Prefixes and suffixes

Keep signs and units that never change outside the counted element, so they stay put while the number changes:

```html
+<span data-counter="42">42</span>% <span data-counter="4.9">4.9</span> / 5
```

## A steady layout

Digits have different widths in most fonts, so a number can wobble while it counts. Use tabular figures; when the number shares a line with other text, also reserve its final width:

```css
[data-counter] {
  font-variant-numeric: tabular-nums;
}
.stat [data-counter] {
  display: inline-block;
  min-width: 6ch;
  text-align: end;
}
```

## Reading text in any language

With an empty `data-counter`, the final value is read from the text with `parseNumber`, using the decimal separator of the element's language. `1.234` is one thousand two hundred thirty-four in German and one point two three four in English, so set `lang` (or `data-counter-locale`) whenever the text is not in the page's language, or put the plain number in `data-counter`.
