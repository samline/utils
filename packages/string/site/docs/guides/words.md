---
title: Word splitting
description: Exactly how @samline/string splits text into words, with separators, camelCase, acronyms, digits and any script.
locale: en
sidebar:
  group: guides
  order: 1
---

Every case function starts from `words(text)`. The rules, in order:

1. A lower-case letter or digit followed by an upper-case letter starts a new word: `fooBar` → `foo`, `Bar`; `version2Beta` → `version2`, `Beta`.
2. An acronym ends before its last capital when a lower-case letter follows: `XMLHttpRequest` → `XML`, `Http`, `Request`.
3. Any character that is not a letter or a digit separates words: spaces, `-`, `_`, `.`, `/` and punctuation.
4. Letters from any script count as letters, so `añoNuevo` → `año`, `Nuevo`.

| Input | Words |
| --- | --- |
| `getHTTPResponseCode` | `get`, `HTTP`, `Response`, `Code` |
| `snake_case-and.dot/path` | `snake`, `case`, `and`, `dot`, `path` |
| `  --leading and trailing__  ` | `leading`, `and`, `trailing` |
| `version2Beta` | `version2`, `Beta` |

Digits stay attached to the word before them, so `v2` and `iPhone15` do not break into pieces.
