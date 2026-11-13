# Changelog

## Unreleased

### Changed

- Compose every document/Open Graph/Twitter title as `<subject> — <npm name>` at one shared SEO boundary; Home/Examples subjects and Docs article titles stay unbranded.
- Footer credit is explicit site identity, separate from npm author metadata; the samline family uses `samline`.
- Generate a reviewable README proposal from one maintained asset and validate TOC, resources, installation, API/guide table roles, entrypoints and skill links, not only H2 order.
- Route concise project instructions to identity/performance policies and relevant historical lessons; keep the portable adaptation skill aligned with those owners.

### Configuration

- `site.credit` is now required. Add the approved public footer identity to an existing config, or review the importer's `--credit`/owner-derived proposal. Copy package-readme-template.md beside configure.mjs when embedding tooling.

### Tests

- Identity checks reject README drift, double branding, inconsistent social titles and author-derived footer variants. Header tests cover the actual configured identity before the longest sibling at all desktop widths.

## [Unreleased]

This is the template release-note source. Replace this introduction with the package's verified changelog before publishing a package website. Do not infer release history from a current version number.

### Breaking changes

Record incompatible public API changes here, with the affected version and replacement. Delete this instructional paragraph when there are real release notes; do not report it as a breaking package release.

Template changes from the Formatter adaptation review (2026-11-05), relevant when updating an adapted site from this template:

- The demo is a scenario catalog. `shared/i18n/translations/en/demo.ts` now exports `scenarios`, `homePresets`, `loadingModes` and `demoModes`; `Playground` takes `preset`, `showCode` and `framed`; behavior lives in `shared/lib/demo-behavior.js`. Counter strings and `data-add` hooks are gone.
- The `skills/package-site/SKILL.md` website endpoint was removed. Sites serve `skills/<name>/SKILL.md` through `landing/src/pages/skills/[skill]/SKILL.md.ts`, and the build fails when that file is missing.
- `check:release` also runs the release content checks against `landing/dist`; build first.

### Features and fixes

Describe user-visible changes. Distinguish changed defaults or behavior from removed or incompatible APIs.

- Shared `Select` (custom chevron, `appearance: none`, pointer cursor, hover/focus/disabled) and visible-label `Field` controls.
- `hero.seoTitle`/`seoDescription` for Home and `examples.seoTitle`/`seoDescription` for Examples; longer template descriptions; "Configuration options" title.
- Long scoped package names wrap in the logo. Between 64rem and 75rem the landing header shows GitHub as an icon and hides the version badge, so it stays on one row at 1024px.
- `Field` honors a passed `type` (password and email fields rendered as text); `mountElements` isolates a failing setup so later elements still mount; Docs example guides render each preview with its code.
- Footer matches the Drawer composition, with a config-driven `<Name> skill for AI agents` link.
- `dev.landingPort`, `dev.docsPort` and `dev.testPort` in `project.config.json` drive dev, preview, redirects and browser tests.
- `configure` skips an embedded site's own directories and scaffolds the package skill.
- `npm run check:content` (in `verify`): titles, descriptions, starter copy, default icons, FAQ depth, package skill, README H2 parity and root conventions.
- Examples gallery: one section per scenario, navigation columns derived from the count; Docs examples show each preview with its copyable files.
- Browser tests are parametrized from `project.config.json`, execute every scenario's copied files in each loading mode by routed navigation, and check select styling and the skill download.
- `npm run migrate:starlight` with `scripts/doc-migration.json`; `assemble.mjs` emits redirect pages for retired routes.
- Hero and section defaults use the sibling voice (kicker, promise accent, three actions, numbered eyebrows, closing pair); the voice table is in the sibling-parity review and the placeholders are scanned by `check:content`.
- `npm run accent` derives accessible light/dark accent pairs; `e2e/demo-routing.ts` serves copied files against local IIFE/ESM builds, covered by a simulated-build test; a header regression test at 1024–1440 px; Getting started gains Requirements and Next steps sections.
- Skill references: sibling-parity review, README template and Starlight migration procedure.
