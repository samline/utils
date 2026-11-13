---
title: String
description: What @samline/string does, how it splits words and which function to use for each case, slug and text job.
locale: en
sidebar:
  group: start
  order: 1
  label: Overview
---

`@samline/string` converts text between cases, builds URL slugs, removes accents, truncates and builds initials. Every function relies on the same word splitter, so `XMLHttpRequest`, `xml-http-request` and `xml_http_request` always agree.

| Job | Functions |
| --- | --- |
| Identifiers | `camelCase`, `pascalCase`, `kebabCase`, `snakeCase`, `dotCase`, `constantCase` |
| Human text | `titleCase`, `sentenceCase`, `capitalize`, `uncapitalize` |
| URLs and search | `slugify`, `removeAccents` |
| Display | `truncate`, `initials` |
| Building blocks | `words` |

- [Installation](getting-started/) — npm, CDN and the first slug.
- [API reference](reference/api/) — every function with examples.
- [Options](reference/configuration/) — `slugify`, `titleCase`, `truncate`, `initials` and locales.
- [Word splitting](guides/words/) — exactly how words are detected.
