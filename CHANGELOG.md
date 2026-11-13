# Changelog

Changes to the `samline/utils` monorepo itself (tooling, website, conventions). Each package has its own CHANGELOG.md.

## 2026-11-12

- Website rebuilt on package-landing-docs in collection mode: catalog, one Home, Examples page and docs section per package, and one agent skill per package.
- Package READMEs follow the canonical @samline structure.
- Publishing to npm is manual; CI verifies and deploys the website.

## 2026-11-12 (initial)

- Monorepo with Bun workspaces, Changesets, tsup, Vitest, Playwright and gzip size budgets.
- `@samline/debounce` 1.0.0 and `@samline/is-visible` 1.0.0 migrated into the monorepo.
