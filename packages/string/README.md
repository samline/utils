# @samline/string

Case conversion, URL slugs, accent removal, truncation and initials for JavaScript, TypeScript and plain HTML, all built on one Unicode-aware word splitter, so every case agrees.

[Demo](https://samline.github.io/utils/string/) · [Examples](https://samline.github.io/utils/string/examples/) · [Documentation](https://samline.github.io/utils/docs/string/) · [Changelog](CHANGELOG.md)

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [HTML / CDN](#html--cdn)
- [Capabilities](#capabilities)
- [API at a glance](#api-at-a-glance)
- [Documentation](#documentation)
- [Changelog](#changelog)
- [AI agent skill](#ai-agent-skill)
- [License](#license)

## Installation

```sh
npm install @samline/string
```

```sh
pnpm add @samline/string
```

```sh
bun add @samline/string
```

Pure functions with no DOM access: browsers, Node 20 or newer, workers and edge runtimes. No runtime dependencies.

## Quick start

```js
import { camelCase, kebabCase, slugify, titleCase, truncate } from '@samline/string'

camelCase('XMLHttp request_id') // 'xmlHttpRequestId'
kebabCase('someLongName') // 'some-long-name'
titleCase('el señor de los anillos', { smallWords: ['de', 'los'] }) // 'El Señor de los Anillos'
slugify('¡Hola, Ñandú & Café!', { replacements: { '&': 'y' } }) // 'hola-nandu-y-cafe'
truncate('The quick brown fox jumps', 15) // 'The quick…'
```

## HTML / CDN

For Shopify, WordPress or plain HTML pages without a build step, load the browser bundle with a classic script tag. Pin the version in production.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/string@1.0.0/dist/browser/string.global.js"></script>
<script>
  const { slugify } = window.SamlineString
  console.log(slugify('Café & Té')) // 'cafe-te'
</script>
```

The bundle defines `window.SamlineString` with every function.

## Capabilities

### One word splitter

`words()` splits on any non-letter, non-digit character, on lower-to-upper transitions and before the last capital of an acronym (`XMLHttpRequest` → `XML`, `Http`, `Request`). Digits stay with their word and letters from any script count, so every case function agrees.

### Every case

`camelCase`, `pascalCase`, `kebabCase`, `snakeCase`, `dotCase` and `constantCase` for identifiers; `titleCase` (with `smallWords`), `sentenceCase`, `capitalize` and `uncapitalize` for human text. Every function takes a `locale`, so Turkish İ and ı convert correctly.

### Slugs and accents

`slugify` removes accents, transliterates ß, æ, œ, ø, đ, ł and þ, applies your `replacements`, collapses separators and cuts at a separator with `maxLength`. `trim: false` keeps a trailing separator for live slug fields. `removeAccents` gives accent-insensitive text for search.

### Display helpers

`truncate` counts code points, so emoji and accents are never split, and cuts at the last whole word; `initials` builds avatar letters.

## API at a glance

| API                                                                            | Purpose                         |
| ------------------------------------------------------------------------------ | ------------------------------- |
| `camelCase`, `pascalCase`, `kebabCase`, `snakeCase`, `dotCase`, `constantCase` | Identifier cases.               |
| `titleCase`, `sentenceCase`, `capitalize`, `uncapitalize`                      | Human-readable casing.          |
| `slugify(text, options?)`, `removeAccents(text)`                               | URL slugs and accent-free text. |
| `truncate(text, length, options?)`, `initials(text, options?)`                 | Display helpers.                |
| `words(text)`                                                                  | The shared word splitter.       |

### Entrypoints

| Entrypoint                | When to use                                         |
| ------------------------- | --------------------------------------------------- |
| `@samline/string`         | ESM or CommonJS, every function.                    |
| `@samline/string/vanilla` | The same API as an explicit subpath.                |
| `@samline/string/browser` | Classic script that defines `window.SamlineString`. |

## Documentation

Read the [documentation](https://samline.github.io/utils/docs/string/) for the full guides and API contracts, and explore [working examples](https://samline.github.io/utils/string/examples/) with complete and separate source files.

| Guide                                                                           | What it covers                                      |
| ------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Installation](https://samline.github.io/utils/docs/string/getting-started/)    | npm, CDN and the first conversions.                 |
| [API reference](https://samline.github.io/utils/docs/string/reference/api/)     | Every function with examples.                       |
| [Options](https://samline.github.io/utils/docs/string/reference/configuration/) | slugify, titleCase, truncate, initials and locales. |
| [Word splitting](https://samline.github.io/utils/docs/string/guides/words/)     | Exactly how words are detected.                     |

## Changelog

Read [CHANGELOG.md](CHANGELOG.md) or the [published changelog](https://samline.github.io/utils/docs/string/changelog/) for release history and explicitly marked breaking and behavior changes. Review the notes before upgrading.

## AI agent skill

The [String skill](https://samline.github.io/utils/skills/string/SKILL.md) teaches verified package integration. Its maintained [repository source](site/SKILL.md) and website download are the same file. Verify the installed package version before applying its guidance.

Download [SKILL.md](https://samline.github.io/utils/skills/string/SKILL.md) into a `string/` folder in your agent's supported skill directory. For agents that discover project skills from `.agents/skills/`:

```sh
mkdir -p .agents/skills/string
curl --fail --location https://samline.github.io/utils/skills/string/SKILL.md \
  --output .agents/skills/string/SKILL.md
```

Keep the filename `SKILL.md`; discovery paths and invocation syntax depend on the agent.

## License

MIT — [LICENSE.md](LICENSE.md).
