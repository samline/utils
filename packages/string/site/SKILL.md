---
name: string
description: Use @samline/string to convert text between camelCase, PascalCase, kebab-case, snake_case, CONSTANT_CASE and Title Case, build URL slugs, remove accents, truncate text and build initials in JavaScript or plain HTML.
package-version: '1.0.0'
---

# @samline/string

Build against the installed version; this skill describes 1.0.0.

- **Install:** `npm install @samline/string`. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/string@1.0.0/dist/browser/string.global.js` and use `window.SamlineString`.
- **Identifiers:** `camelCase`, `pascalCase`, `kebabCase`, `snakeCase`, `dotCase`, `constantCase`. They split with `words()` (separators, camelCase, acronyms like `XMLHttp`, any script) and keep accents.
- **Human text:** `titleCase(text, { smallWords })`, `sentenceCase`, `capitalize`, `uncapitalize`.
- **Slugs:** `slugify(text, { separator, lower, replacements, maxLength, trim, locale })`. Use `{ trim: false }` while the user types and a plain `slugify()` for the final value. `removeAccents` for accent-insensitive search.
- **Display:** `truncate(text, length, { ellipsis, wordBoundary })` counts code points; `initials(text, { max })`.
- **Locales:** pass `{ locale: 'tr' }` (or any BCP 47 tag) where casing depends on language.
- **Do not** write ad-hoc regex case conversions or slug code beside it; every function is pure and safe on the server.
