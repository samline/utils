---
title: 'Configuration options'
titleAccent: 'options'
description: Options for slugify, titleCase, truncate and initials, and the locale option shared by every case function.
locale: en
sidebar:
  group: reference
  order: 2
  label: Configuration
---

## Locale

Every case function, `slugify` and `initials` accept `locale` for upper and lower casing, for example `{ locale: 'tr' }` so `istanbul` becomes `İSTANBUL`.

## slugify

| Option | Default | Description |
| --- | --- | --- |
| `separator` | `'-'` | Word separator. `''` joins words. |
| `lower` | `true` | Lower-case the result. |
| `replacements` | `{}` | Literal replacements applied first, for example `{ '&': 'y' }`. |
| `maxLength` | – | Maximum length; cuts at a separator when possible. |
| `trim` | `true` | Remove leading and trailing separators. Use `false` while the user types. |
| `locale` | – | Locale for lower-casing. |

## titleCase

| Option | Default | Description |
| --- | --- | --- |
| `smallWords` | `[]` | Words kept lower case unless first, for example `['of', 'the']` or `['de', 'la', 'y']`. |
| `locale` | – | Locale for casing. |

## truncate

| Option | Default | Description |
| --- | --- | --- |
| `ellipsis` | `'…'` | Appended when cut; it counts toward `length`. |
| `wordBoundary` | `true` | Cut at the last whole word. When no whole word fits, the word is cut. |

## initials

| Option | Default | Description |
| --- | --- | --- |
| `max` | `2` | Maximum number of letters. |
| `locale` | – | Locale for upper-casing. |
