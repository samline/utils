---
title: API reference
description: Every @samline/string function with its input and output, from camelCase and slugify to truncate, initials and words.
locale: en
sidebar:
  group: reference
  order: 1
---

## Identifiers

| Function | `'XMLHttp request_id'` becomes |
| --- | --- |
| `camelCase(text, options?)` | `xmlHttpRequestId` |
| `pascalCase(text, options?)` | `XmlHttpRequestId` |
| `kebabCase(text, options?)` | `xml-http-request-id` |
| `snakeCase(text, options?)` | `xml_http_request_id` |
| `dotCase(text, options?)` | `xml.http.request.id` |
| `constantCase(text, options?)` | `XML_HTTP_REQUEST_ID` |

These functions rebuild the text from its [words](../../guides/words/), so separators and punctuation are dropped and accents are kept: `camelCase('año nuevo')` is `añoNuevo`.

## Human text

| Function | Example |
| --- | --- |
| `titleCase(text, options?)` | `'the lord of the rings'` → `'The Lord Of The Rings'` |
| `sentenceCase(text, options?)` | `'HELLO World'` → `'Hello world'` |
| `capitalize(text, options?)` | `'hello World'` → `'Hello World'` (rest untouched) |
| `uncapitalize(text, options?)` | `'Hello World'` → `'hello World'` (rest untouched) |

`titleCase` keeps the original spacing and punctuation; pass `smallWords` to keep words such as *of* or *de* lower case.

## URLs and search

- `slugify(text, options?)`: `'¡Hola, Ñandú & Café!'` → `'hola-nandu-cafe'`. See [options](../configuration/#slugify).
- `removeAccents(text)`: `'Ñandú Straße'` → `'Nandu Strasse'`. Removes diacritics and transliterates ß, æ, œ, ø, đ, ł, þ, ð and ı.

## Display

- `truncate(text, length, options?)`: `('The quick brown fox jumps', 15)` → `'The quick…'`. Counts code points, so emoji and accents are never split.
- `initials(text, options?)`: `'Samuel Olvera'` → `'SO'`.

## Building blocks

- `words(text)`: `'XMLHttpRequest'` → `['XML', 'Http', 'Request']`.

## Browser global

The CDN bundle defines `window.SamlineString` with every function above.

## Types

`CaseOptions`, `TitleCaseOptions`, `SlugifyOptions`, `TruncateOptions` and `InitialsOptions`.
