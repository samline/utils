# Samline Utils website

The website of the [samline/utils](../README.md) monorepo, built with [package-landing-docs](https://github.com/samline/package-landing-docs) in **collection mode**: a catalog Home, then one Home, one Examples page and one docs section per package. See `.agents/collection-mode.md` for the content contract.

## Where content lives

| Content                                   | Source                                                          |
| ----------------------------------------- | --------------------------------------------------------------- |
| Catalog order, collection identity, theme | `project.config.json`                                           |
| Catalog card, CDN URL                     | `../packages/<package>/site/meta.json`                          |
| Package Home copy                         | `../packages/<package>/site/landing.ts`                         |
| Live Home preview                         | `../packages/<package>/site/Demo.astro`                         |
| Examples and their copyable files         | `../packages/<package>/site/examples.ts` and `examples/*.astro` |
| Docs articles                             | `../packages/<package>/site/docs/`                              |
| Release notes                             | `../packages/<package>/CHANGELOG.md`                            |
| Agent skill                               | `../packages/<package>/site/SKILL.md`                           |
| Source/API review evidence                | `content-audit.json`                                            |

## Commands

Run from the monorepo root after `bun install` and `bun run site:install`:

```sh
bun run site:dev      # builds the packages, then http://127.0.0.1:4360/utils/
bun run site:build    # builds the packages, then the combined site in site/landing/dist
```

Inside `site/`: `npm run check`, `npm test`, `npm run check:identity`, `npm run check:content` and `npm run check:release`. Previews import the built packages, so build them first.

## Updating from the template

This directory is a copy of package-landing-docs. Port template changes deliberately and keep `project.config.json`, `content-audit.json` and this README.
