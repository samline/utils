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

| File               | Purpose                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------- |
| `meta.json`        | `title`, `category`, `summary`, `tags`, optional `delivery` (CDN URLs, `cdnScriptHead`) |
| `landing.ts`       | Default export with the same shape as `landing/.../en/sections.ts`                      |
| `Demo.astro`       | Required live preview for the package Home (imports the package)                        |
| `examples.ts`      | Examples gallery records: id, title, description, files (html/css/js)                   |
| `examples/*.astro` | One live preview per example record, rendered beside its copied files                   |
| `docs/**/*.md(x)`  | Articles; same frontmatter schema as `docs/src/content/docs`                            |
| `SKILL.md`         | Package integration skill, served at `skills/<unscoped name>/SKILL.md`                  |

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
- `/examples/` is not generated in collection mode; Home owns the catalog.
- Collection-level navigation offers Packages and Docs. Examples are linked from
  catalog cards and package menus.
- `scripts/test-collection.mjs` builds `tests/fixtures/collection` (alpha with
  examples and docs, beta minimal) and runs the combined link check.

## Package docs conventions (2026-11-13)

Package articles follow the same structure as the single-package sites
(Ticker, Drawer, Notify, Autocomplete), so every section reads alike:

- `index.mdx`: titled with the package name (identity-parity checks it, so it
  has no accent) and labelled `Overview`; it ends with a `Choose your next step`
  CardGrid.
- `getting-started.mdx`: `Getting started` (label `Installation`) with
  Requirements, the shared `<Installer />` tabs (npm, pnpm, yarn, bun and the
  CDN), Package / ESM, HTML / CDN, `Working starter files` (the first example's
  `PackagePreview`) and a `Next steps` CardGrid. Home's "Copy complete working
  files" links that section.
- `guides/examples.mdx`: `Working examples` (label `Examples`, first guide)
  renders every example with `PackagePreview`, as on Examples.
- Every other article has a `titleAccent`; frameworks, configuration and API pages use
  the template titles.
- `delivery.cdnScriptHead: true` in `meta.json` marks a script that must run
  before the first paint (Theme): the installer's CDN tab omits `defer`.

## Custom previews in package mode (2026-11-13)

The same `site/` contract works for a single package: when the site root has
`site/Demo.astro`, Home shows it instead of the scenario tabs; when it has
`site/examples.ts` with `site/examples/*.astro`, Examples (and a docs guide via
`examplesFor()`) render `PackagePreview` items with their copyable files. An
embedded package imports itself by npm name (Vite alias to the site root, which
resolves through its exports: build it first). Scenario-only browser specs skip
themselves through `e2e/custom-previews.ts`; such a package tests its copied
files in its own spec. First consumer: samline/autocomplete.

## Collection examples index removal (2026-11-14)

Home is the only collection catalog. The global Examples route and its footer
and Docs links are omitted; package Examples routes remain available from cards.
Verified: Astro checks, 57 site unit tests, collection fixture build, combined
build (3,166 links across 90 pages), identity/content audits, three browser
checks covering every route's metadata/layout, package downloads and no-JS,
and 174 package e2e tests across Chromium, Firefox and WebKit. Package typecheck,
coverage, build and size budgets passed. Browser tests required execution outside
the filesystem sandbox. The auxiliary adaptation test cannot build its copied
collection because its temporary directory lacks the sibling packages.

## Copied example loading modes

`files.js` is the classic CDN behavior; `files.esm` is the complete module source, including package imports, styles and explicit mounting. Both are required. PackageCode displays the available HTML / CDN and Package / ESM tabs and installation instructions for the current identity. Use `filesFor(slug, example, mode)` for either complete or split files. CDN availability follows that package's delivery configuration.
