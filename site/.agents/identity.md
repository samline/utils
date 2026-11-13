# Package identity and README convention

This is the maintained identity contract for the template and its adaptations.
The samline family uses the same structure and presentation across Forms,
Notify, Ticker, Drawer and Formatter. The maintainer chose `samline` for footer
credit on 2026-11-06. Preserve package-specific meaning inside this structure.

## Public README

The executable check is `scripts/lib/identity-checks.mjs`; the proposal asset is
`scripts/package-readme-template.md` (the same files may live in `site-tools/`
when embedded). `configure` writes a reviewable `brief/readme-proposal.md` and
never overwrites or executes the source package README.

Keep this order: Table of contents, Installation, Quick start, optional HTML /
CDN, Capabilities, API at a glance, Documentation, Changelog, AI agent skill,
License. The TOC repeats the exact section labels/order with working anchors.

- Identity: exact npm-name H1, a verified description and the Demo / Examples /
  Documentation / Changelog resource row. Preserve meaningful old anchors.
- Installation: separate `sh` blocks for npm install, pnpm add and bun add;
  explain real engines, required CSS and optional peers.
- Quick start: the smallest real package integration and its ownership/cleanup.
  Keep advanced examples in the relevant capability/API subsections.
- HTML / CDN: only for an actual supported standalone build. Pin real assets
  and explain the real global, CSS and lifecycle; do not invent a global.
- API at a glance starts with `API | Purpose`, followed by `### Entrypoints`
  and its `Entrypoint | When to use` table. Package-specific details follow as H3s.
- Documentation starts with a consistent guide/gallery introduction and a
  `Guide | What it covers` table of real routes in learning order.
- Changelog links one root CHANGELOG.md and the published history; an Upgrading
  subsection is appropriate only when there is a real migration to explain.
- AI agent skill links both the maintained repository source and the matching
  website download. Keep the same project-install example and agent-dependent
  discovery explanation; teach the actual package API, not website maintenance.
- License links LICENSE.md. Website architecture and test reports belong in
  SITE.md/app maintenance docs rather than the runtime package guide.

The private template follows the same H2/table roles but describes configuration
files/commands, uses npm ci and links its adaptation skill. It does not invent
a published runtime, npm install command or a standalone CDN build.

## Document titles

`shared/lib/site-identity.mjs` owns `documentTitle(subject, npmName)`. The shared
SEO component is the composition boundary. Home and Examples catalogs provide
an unbranded subject; Docs supplies the article title. Never add another brand
prefix/suffix in a page, Docs wrapper or translated `titleSuffix`.

- Home: `<descriptive capability> — @samline/<package>`.
- Examples: `Examples — @samline/<package>`.
- Docs: `<article title> — @samline/<package>`.

Document title, og:title and twitter:title must agree; og:site_name uses the
npm name. Display H1s/accents remain editorial and need not be document titles.
Keep descriptions useful/unique and route canonicals unchanged.

## Footer and header

`site.credit` is the explicit public credit, independent of package.author.
`footerCredit(site.credit)` supplies the shared English wording:
`© <year> samline · Made for the open web.` The year belongs to the footer.
The importer preserves an approved credit for the same repository owner,
derives the owner handle for a new owner, or accepts `--credit` explicitly.
Review that identity in a new adaptation; never rewrite npm author metadata to
make a footer look right. Ticker's earlier catalog-based architecture retains
its explicit footerAuthor value rather than introducing a second site config.

Home and Examples share the exact footer and link roles. Docs keeps its reading
navigation rather than gaining an unrelated marketing footer. GitHub/Get started
remain visible on desktop: 64rem–75rem uses icon-only GitHub and a compact version
badge. Test the configured name as well as the longest real sibling, all three
destinations, both themes and enlarged/narrow layouts.

## Validation and ports

Run `check:identity` on the built combined artifact and before release. Keep it
in verify, CI and deployment/release gates when embedding. The check validates
README structure beyond H2s, rendered title/social agreement and both branded
footers. Unit cases must demonstrate rejection of real drift, not merely assert
that a source file contains a rule. Browser checks still establish usable layout.

Port the identity helper, checker/library, README proposal asset and importer
changes together. Update owning instructions/skill and record intentional local
differences. Keep the single canonical policy here; do not accumulate copies of
the same lesson in every entry document. A green structural check cannot prove
that an API claim, copied integration or visual composition is correct.
