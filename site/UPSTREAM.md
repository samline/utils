# Reviewed Ticker changes

Source: https://github.com/samline/ticker, local sibling ../ticker. Previous reference c74ec91; reviewed performance revision 4d18f4a78d48d7a4a7c2918a0bcd19341f76d08a, plus the synchronization fix at 8a30c9ca8486953fdc2801f0ceff8b17d0cb5615. The visual/code review spans four upstream commits; the synchronization fix and explicitly requested working-tree policy review are recorded separately below. This is not a claim of exhaustive repository auditing.

| Commit  | Review and template application                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a5ed5ae | Closing Heading owns centered margins and width instead of conflicting utility margins. Feature cards wrap long text. Gallery/browser checks retain title geometry and enlarged text.                                                                                                                                                                                                                                                                                      |
| 24b4c19 | Local licensed WOFF2 faces and heading preloads, live-code clipboard ownership, reserved initial tab/copy geometry, and centered gallery hero/index. Social TTF inputs stay separate.                                                                                                                                                                                                                                                                                      |
| a4c2899 | Shared insertion/removal mounting with closure setup; all template classes and this removed. Reinserted Drawer roots release locks. Neutral files use one formatted generator and abortable listeners that survive persisted pagehide. Public package imports, runtime stylesheet ownership and separated recipe generation are adaptation rules; Ticker-specific controllers, content editor, aliases and copied recipes are not imported into a dependency-free counter. |
| 4d18f4a | CSS below 40 KiB can inline through one shared policy; larger CSS stays cacheable. Reveal uses IntersectionObserver snapshots, tabs do not animate initial selection, and recipe frames retain compact spacing and one divider.                                                                                                                                                                                                                                            |

The graph identified mountElements and inlineSmallStylesheets; checked path coverage had no recorded gaps. Source/diff reads supplied Astro/CSS details and validated applicability. The template is not indexed in the current graph, so its comparison uses actual source. No import-count or graph absence was used to delete assets/tests.

Intentional template differences remain documented in REFERENCE.md/design-reference.json: metadata/catalogs, neutral counter, generic configuration, named code groups, long-copy wrapping and accessible footer sizing. Preserve template audit/importer and root/nested deployment checks. Do not replace them with Ticker-only tests or claims.

Regression validation belongs to npm run verify: both app diagnostics, convention parsing, fingerprints, alternate identity/base builds, complete link audit, browser themes/responsive/enlarged text, exact/live/failed copying, executable formatted files, persisted-page cleanup, delayed controls, local fonts, reveal, active navigation and reinserted scopes. Record actual results in the change summary; upstream benchmark numbers are not measurements of this template.

Synchronization found and repaired one additional integration issue in both repositories: Drawer destruction closes/unlocks its native modal but does not call the application open-change callback. Cleanup now resets the application-owned trigger aria-expanded for Home menu, Docs menu and Search. Regression checks verify same-batch reinsertion, modal isolation/overflow release, reopening and Escape/focus. This does not replace Drawer behavior or change its API. CSS inlining also exposed a template-only equal-specificity Header/Button display rule; the documented contextual selector preserves intended visibility.

At the user's explicit request, also reviewed the new PageSpeed memory in Ticker's working tree on 2026-10-19. Ported its reusable targets, loading/layout/motion rules, measurement and deployment workflow into the root AGENTS contract, referenced by all app/shared instructions, README, adaptation guide and repository skill. Ticker-specific scores, report IDs, hosting observations and measurement environments remain upstream evidence; no template score was claimed. This policy addition is separate from the pinned committed visual-source review.

Final reference 8a30c9ca8486953fdc2801f0ceff8b17d0cb5615 includes the shared Drawer ARIA cleanup discovered during this synchronization, with regressions in Landing and Docs. The four upstream commits remain recorded above; the separately requested PageSpeed memory review is explicitly distinguished from them.

Validation of this synchronization: both Astro checks had zero diagnostics; six Node tests and all 20 template browser tests passed; root/nested alternate-package builds and 274 links across nine pages passed; the 46-component style/source contract and formatting passed. Ticker passed both app checks (17 Landing Node tests), its 1,882-link/41-page combined build, 51 Landing browser tests and 29 combined Docs browser tests for the shared ARIA fix. Browser tests include simulated persisted pagehide, not a native history-cache benchmark. No new template Lighthouse/PageSpeed measurement or package release was performed.

## Drawer adaptation corrective review — 2026-10-20

The sibling Drawer adaptation exposed gaps that style fingerprints alone could not detect. The repository skill now requires recording an explicitly supplied accent or asking for it when absent, reviewing useful package-specific compositions beside Ticker, and executing actual rendered ESM and CDN sources. Preserve Ticker's presentation, not its package-specific number of entrypoints or lifecycle recipes. Drawer-specific runtime and content remain in that package.

Reusable repairs include complete semantic custom-accent tokens with reliable CSS precedence, development routes that keep each Astro compiler's modules on its owning origin, deliberate dynamic entrypoint inventories, and bounded wrapping for long API descriptions and breadcrumbs. Expanded code disclosures use a zero-minimum grid track so intrinsic source width cannot expand the page. PageTitle/ArticleHeader accessibility exceptions are explicitly documented; the remaining protected presentation is preserved.

Final validation: both Astro checks had zero diagnostics; eight Node tests and all 23 Chromium browser tests passed; the combined build checked 274 links across nine pages. Earlier root/nested alternate adaptation builds passed. Browser article inventory is derived from authored content, tests use an isolated production port, and new regressions cover custom-accent delivery plus narrow/enlarged-text headings and expanded code. The public skill is generated from its repository source. No new PageSpeed score, package runtime release or deployed-site result is claimed.

## Second adaptation content review — 2026-10-20

Drawer's follow-up exposed a content-depth gap: distribution labels did not explain host integrations, direction variants missed practical workflows, and a complete CDN document inside initialization tabs caused unnecessary page growth. The template now keeps the short initializer separate from complete runnable files and requires capability-review evidence before release. Its importer discovers nested example/examples documentation, with a regression fixture, and its skill carries a focused content-completeness reference covering framework ownership, useful scenarios, SEO/accessibility states and semantic/fragment migration before legacy-app retirement. Custom theme-color metadata and a single charset/viewport declaration are shared fixes. Drawer-specific examples and framework test compilers stay in Drawer; no irrelevant runtime or fixed twelve-example quota is imported into the neutral template.

Second review validation: eight Node tests, both root/nested alternate adaptations, the style contract and all 24 template Chromium tests passed; the build checked 277 links across nine pages after adding the actual starter-file destination. The new browser regression follows the compact initializer's link and checks the complete source viewer; metadata checks enforce one charset and viewport. No new PageSpeed benchmark was collected.

## Integration and identity parity — 2026-10-20

Keep Framework integrations as a first-class guide for packages that support browser hosts. Provide real React/Vue/Svelte component lifecycle examples and Astro, Shopify and WordPress guidance when applicable; omit unsupported claims rather than inventing adapters. FrameworkExamples composes shared Tabs/CodeFiles and receives source groups; it must not contain one package's API. CMS examples need single asset loading, independent instances, host lifecycle cleanup and explicit support scope. Compile copied framework files and execute CMS output; Liquid/PHP fixtures are not real hosted deployments.

Use package.npmName for shared header/menu/footer branding and package.name for editorial copy. Preserve Ticker's original Hero compatibility composition: language/host labels with its existing wrapping and gaps. Do not add an unapproved extra Hero CTA merely to link integration guidance; use the existing onboarding/sidebar destinations. Check rendered identity, DOM composition and narrow/enlarged-text geometry as well as style fingerprints.

Validation for the integration/identity pass: zero Astro diagnostics, eight Node tests, alternate-package adaptation, 333 local links across ten pages and all 25 browser tests passed. The maintained skill validates and its downloadable copy matches source. The guide is explicitly a conditional scaffold; no neutral fake API is presented as a usable framework integration.

## Published Drawer 5.0.2 integration — 2026-10-21

Ported the bounded consumer migration alongside Ticker: the two app dependencies and three integrations now use the published root createDrawer API, content factories cloning existing DOM and direct owned-controller destroy. Preserved callback ARIA, same-batch reconnection, abortable application listeners, scoped native CSS, menu/search composition and all visual fingerprints. The former browser builder and id-based destructor were removed in Drawer 5; do not reintroduce them through template adaptation. Ticker remains the committed visual reference; this port changes package integration without repinning unrelated visual work.

Validation: clean npm ci resolved the published 5.0.2 package; both Astro checks, unchanged visual fingerprints, eight Node tests, formatting and all 25 browser tests passed. The combined artifact audited 333 links across ten pages. Browser coverage includes all three modal scopes, same-batch reconnection, focus/scroll, responsive themes, code copying and automated accessibility checks. No new performance measurement or package-runtime API change is claimed.

## Published Drawer 5.1.1 update — 2026-11-05

Both apps now pin the published @samline/drawer 5.1.1 (5.1.0 behavior changes plus the soft-keyboard inline height/bottom restore fix). No integration code changed. Docs search sets handleOnly without snap points, so Drawer now renders its handle as a pointer-only, aria-hidden affordance and ignores handleAriaLabel; the dismiss close button remains the accessible control.

Validation: npm install resolved 5.1.1; npm run check, format:check, 12 Node tests, adaptation build, both Astro builds and the combined artifact (333 links across ten pages) passed; all 28 browser tests passed on a dedicated port (PACKAGE_SITE_TEST_PORT=4361). The first npm run verify browser stage timed out waiting for its default web server and was rerun separately; the cause was not investigated.

## Published Drawer 5.1.2 update — 2026-11-05

Both apps now pin the published @samline/drawer 5.1.2, which only changes closing so focus returns to the trigger with preventScroll (drawer issue #4). No integration code changed.

Validation: npm install resolved 5.1.2; npm run check, format:check, Node tests, adaptation build, both Astro builds and the combined artifact (333 links across ten pages) passed; all 28 browser tests passed on a dedicated port (PACKAGE_SITE_TEST_PORT=4362).

## Formatter adaptation review — 2026-11-05

Applied the template findings from formatter/.agents/reports/2026-11-05-formatter-adaptation-review.md (template 54822b6 → this branch). Template code: shared Select/Field, scenario catalog demo with generated HTML / CDN and Package / ESM files, hero/examples SEO fields, Drawer footer composition with config-driven package skill, skills/<name>/SKILL.md endpoint and starter, configurable dev ports, importer site-directory exclusion and skill scaffolding, tests parametrized from project.config.json, check:content, Starlight migration helper and assemble redirects. Protected styles: MobileMenu (an 80rem breakpoint, reverted on 2026-11-06; see below) and ExamplesGallery (derived navigation columns) fingerprints updated deliberately; see REFERENCE.md. Ticker remains pinned at 8a30c9c; nothing was imported from a newer Ticker revision.

Propagation to the embedded sites (ticker, drawer, notify, formatter) is a separate, per-repository task: the header/mobile-menu breakpoint, logo wrapping, footer skill link, Select/Field, SEO title fields, content checks and dev ports. A read-only run of the new release content checks against the existing Formatter and Drawer builds reported descriptions outside 70–160 characters, short Examples titles, retained "Small examples." / "A few details." / old changelog copy, a default Overview icon and a missing packageManager (Drawer).

### Follow-up closure — 2026-11-06

- Docs header: measured at 1024, 1100 and 1280 pixels with the template name and `@samline/formatter`; it stays one row (81 px) at its existing 64rem breakpoint, so only the landing header changed. `e2e/identity.spec.ts` now checks both headers at 1024, 1280 and 1440 with a long scoped name (all header controls share one line within 8 px; the pre-fix landing header spread 49 px).
- Copied-file substitution: routing moved to `e2e/demo-routing.ts`; `e2e/demo-routing.spec.ts` runs simulated IIFE and ESM builds through the same helper in both modes and both documents, and proves a `{ default }`-shaped global (the Formatter 2.0.x bug) fails the copied CDN files.
- Accents: `npm run accent -- '#84cc16'` derives an accessible pair (lime → `#527e0e` / `#84cc16`) from `shared/lib/contrast.mjs`, which `check-config` now shares.
- Root checks: Ticker and Notify have no `SITE-LICENSE.md`, so it stays "when the theme license differs", not a release failure. Sibling `test:package` scripts differ (node script, vitest, smoke test); the release check requires the script, and the parity review describes what it must cover.
- Visual review: production builds of the template and Drawer (`../drawer/landing/dist`, read-only) captured full-page at 375, 1024 and 1440 pixels in both themes for Home, Examples and Getting started, compared side by side. Composition, spacing, controls and palette hierarchy match. Differences: Drawer's header wraps to two rows at 1024 (fixed here, pending propagation); Drawer's Getting started has Requirements and Next steps sections, now added to the template article. Screenshots were kept outside the repository.

## Forms adaptation findings — 2026-11-06

Reported by the Forms adaptation session (Forms was embedded from 6b3209e):

- Header: the 80rem move was half applied. Button re-shows `.btn.hidden` only for `lg:inline-flex`, so GitHub and Get started never appeared; Tailwind's xl is 75rem, so between 75 and 80rem both inline links and the menu showed. Reverted to the siblings' 64rem (Header and MobileMenu match 54822b6; fingerprint cf74e971 restored). The 1024px wrap is fixed by an icon-only GitHub and a hidden version badge between 64rem and 75rem. The header browser test now also asserts GitHub, Get started and Docs are visible.
- Field: a passed `type` was shadowed by a literal `type="text"` before the spread (the browser keeps the first duplicate), so password fields showed text. Fixed; a convention test rejects a literal `type` before a spread on any native control.
- mountElements: one throwing setup stopped every later element from mounting. Each setup now runs in try/catch with console.error; covered by a Node test. Fingerprint updated (source kind) after review.
- Docs example guides render `<Playground preset showCode />` instead of linking to Examples for code; `check:content` rejects `/examples/#` links from Docs example pages.
- Embedded tooling: the starter skill template moved beside configure.mjs (`scripts/package-skill-template.md`) because packages never carry the adaptation skill; `test:adaptation` reconfigures its copy with `--force`; `check:content` runs starter sentinels only where `.agents/skills/package-site/SKILL.md` exists. E2E no longer assumes the starter: visible copy frames and code viewers only, the ToC test uses the article's second heading, the reinsertion test awaits the sampled readout. `e2e/demo-builds.ts` documents single-file ESM builds.
- ADAPTATION.md documents Bun hoisting overrides (parse5 ^8.1.0, @emnapi/runtime 1.11.3) and the one-field scenario model's limits.
- migrate-starlight: blank line after imports, old base stripped from absolute links (manifest `base`), Card/LinkCard/CardGrid/Steps conversion, JSX-safe attribute values, accents must be trailing phrases as PageTitle enforces.

Siblings (Ticker, Drawer, Notify, Formatter) keep 64rem and have no Field, so items 1 and 2 need no propagation beyond the optional 1024px compaction.

## Cross-package identity contract — 2026-11-06

The maintainer requested README, meta-title and footer parity across Forms,
Notify, Ticker, Drawer and Formatter, then chose samline as footer credit.
The template now owns the reusable identity helper, rendered/README validation,
README proposal asset and importer behavior. The existing 61cc0d8 compact header
fix is retained and its regression now tests the actual configured name first.
Project memory is routed through concise AGENTS.md to identity/performance
policies and task-relevant lessons, with upstream skill trees/licenses preserved.
This is a website/tooling convention change, not a package-runtime release.
