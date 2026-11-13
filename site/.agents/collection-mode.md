# Collection mode

Approved by the maintainer on 2026-11-12 (option "Modo colección"). One website
documents several packages of a monorepo (first consumer: samline/utils). The
default `package` mode and every existing single-package site stay unchanged.

## Configuration

```json
{
  "mode": "collection",
  "package": { "name": "Samline Utils", "npmName": "@samline/utils", ... },
  "collection": { "packagesDir": "../packages", "packages": ["debounce", "is-visible"] }
}
```

- `mode` defaults to `"package"`. Collection mode requires `collection`.
- In collection mode `package` describes the collection itself. `npmName` is the
  brand used by logos and collection-level titles. It is not published.
- `packagesDir` is relative to the site root. `packages` fixes the catalog order.
  Each entry is a directory with a `package.json` (real npm identity: name,
  version, description, license) and a `site/` folder (content contract below).

## Package content contract (`<packagesDir>/<pkg>/site/`)

| File               | Purpose                                                                |
| ------------------ | ---------------------------------------------------------------------- |
| `meta.json`        | `title`, `category`, `summary`, `tags`, optional `delivery` (CDN URLs) |
| `landing.ts`       | Default export with the same shape as `landing/.../en/sections.ts`     |
| `Demo.astro`       | Required live preview for the package Home (imports the package)       |
| `examples.ts`      | Examples gallery records: id, title, description, files (html/css/js)  |
| `examples/*.astro` | One live preview per example record, rendered beside its copied files  |
| `docs/**/*.md(x)`  | Articles; same frontmatter schema as `docs/src/content/docs`           |
| `SKILL.md`         | Package integration skill, served at `skills/<unscoped name>/SKILL.md` |

The package `CHANGELOG.md` and `README.md` stay the release and npm sources.

## Routes

| Route                     | Content                                                     |
| ------------------------- | ----------------------------------------------------------- |
| `/`                       | Collection Home: catalog with search and category filter    |
| `/<pkg>/`                 | Package Home (Hero, Features, Runtimes, Getting started, …) |
| `/<pkg>/examples/`        | Package Examples                                            |
| `/docs/`                  | Collection docs overview                                    |
| `/docs/<pkg>/…`           | Package articles and `/docs/<pkg>/changelog/`               |
| `/skills/<name>/SKILL.md` | One skill per package                                       |

## Implementation notes

- Package routes resolve their identity with `identityFor(Astro)` and their copy
  with `getI18n(Astro)`, both keyed by the `package` param (or the first `slug`
  segment in Docs, see `packageSlug`). Shared sections
  keep reading `getI18n`, so they work unchanged in both modes.
- SEO titles: package pages use the package npm name, collection pages use the
  collection brand. `documentTitle` is unchanged.
- Checks (`check-identity`, `check-content`, `check-release`, content audit)
  iterate the collection packages in collection mode.
- Live previews import the real package; copied files are tested in Playwright,
  so previews and copied code cannot drift silently.

## Behaviour decided while implementing (2026-11-12)

- `landing.ts`, `Demo.astro` and `SKILL.md` are required; examples and docs
  articles are optional. A package without `examples.ts` has no Examples page,
  nav item or docs link to it.
- Links to template docs routes (`setup`, `options`, …) fall back to the
  package docs overview when the package has no such article; site-level pages
  of a collection link the docs overview.
- Site-level pages hide package-only links (skill, changelog, npm).
- `/examples/` lists the packages that have examples.
- `scripts/test-collection.mjs` builds `tests/fixtures/collection` (alpha with
  examples and docs, beta minimal) and runs the combined link check.
