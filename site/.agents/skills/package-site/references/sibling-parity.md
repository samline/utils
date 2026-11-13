# Sibling-parity and quality review

Automated checks prove structure, not quality. The Formatter adaptation (2026-11-05) passed `site:verify`, `check:release`, axe, link checks and design fingerprints, and the maintainer still found nine classes of defects. Complete this review before reporting an adaptation as done. `npm run check:content` and `check:release` automate the parts that can be automated; the rest needs eyes.

## 1. Before writing anything: inventory the latest sibling

Open the most recently adapted sibling (Drawer is the embedded-adaptation reference; Ticker is the pinned visual reference; Notify and Formatter are further examples) and list:

- Root files: `README.md`, `CHANGELOG.md`, `LICENSE.md` (not `LICENSE`), `SITE-LICENSE.md` when the theme license differs, committed `AGENTS.md` as the single project memory (`shared/AGENTS.md` links to `../AGENTS.md`), `SITE.md`, `content-audit.json`, `skills/<name>/SKILL.md`.
- `package.json`: `packageManager`, a runtime-only `files` allowlist, `test:package` (an `npm pack --json` manifest assertion plus execution of the built ESM, CommonJS and IIFE bundles), `site:*` commands. Never merge the template's root `postinstall` into a published package; site commands already run `assets.mjs`.
- README structure beyond H2s: exact TOC/resource roles, installation blocks, API/guide tables, entrypoints and skill source/download (see [readme-template.md](readme-template.md)).
- Footer links: Docs, Installation guide, Working examples, `<Name> skill for AI agents`, GitHub, Changelog, npm, License → `LICENSE.md`.
- The skill location, endpoint (`landing/src/pages/skills/[skill]/SKILL.md.ts`) and Examples resources link.
- Dev ports in `project.config.json` `dev` that do not collide with siblings (Ticker/template 4330, Drawer 4340, Formatter 4350).

Match them. Differences need a recorded reason.

## 2. Content review per page

For Home, Examples and every Docs page:

- `<title>`: `<unbranded subject> — <npm name>`, composed once by shared SEO. Home uses hero.seoTitle; Examples uses examples.seoTitle/seoDescription; Docs passes its article title directly. Document, Open Graph and Twitter titles agree. See the canonical identity contract for footer credit and README rules.
- Meta description: 70–160 characters, unique across the site.
- H1 and title accent: the accent is the title's trailing phrase (PageTitle enforces it), and how much of that ending to accent is chosen by hand per page ("Getting _started_", "Configuration _options_", "Format a _phone number_"). Single-word titles get a meaningful second word. Never pick the last word mechanically: accent the phrase that carries the meaning.
- No template copy remains (`check:content` lists known defaults; also read the page).
- FAQ: at least eight real integration questions, adapted per package (which value to submit, prefill, paste, caret/focus, input types, validation, regions/locales, frameworks/CMS, server use, size, errors, upgrades), each answer verified against source.
- Overview icons: each icon depicts its card. Keeping a default needs `content-audit.json.iconReview.kept` with a reason.
- Examples breadth: built from a capability inventory (every option and helper mapped to a realistic task), not one demo per type. Building real scenarios is a test activity; probe every quoted output through the built package.

### Section copy voice

Rewrite every hero and section string in the voice Drawer, Notify and Formatter share; the template's defaults are placeholders in that voice, and `check:content` flags them until replaced:

| Slot             | Pattern                                                        | Sibling examples                                                         |
| ---------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Hero kicker      | Two short sentences                                            | "Small library. Clean input."                                            |
| Hero accent      | A promise                                                      | "Make room for what’s next." · "Keep every field readable."              |
| Hero description | One sentence, then three concrete actions                      | "Group a phone, price a total, or store a date as ISO."                  |
| Footnotes        | `<trait> · JavaScript & TypeScript · MIT licensed`             | "One pure function · JavaScript & TypeScript · MIT licensed"             |
| 01               | "More than <the obvious>", then a two-sentence pair            | "01 / More than an open state" · "A natural interaction. / A clear API." |
| 02               | "02 / Fit it into your stack" · "Two ways in. One <API>."      | "Two ways in. / One format() call."                                      |
| 03               | "03 / From install to <result>" · a concrete pair              | "A button. / A drawer." · "One field. / Two clean values."               |
| 04               | "04 / After the first <result>"                                | "After the first open. / Keep the flow."                                 |
| 05               | "05 / Before you build" · "A few details. / Clearly answered." | shared verbatim                                                          |
| Closing          | Eyebrow phrase plus a "Make … / a … one." style pair           | "Make every field / a clean one."                                        |

Keep the slot structure and rhythm; write the words for the package. Do not copy a sibling's package-specific promise.

## 3. Visual review beside a sibling

Screenshot Home, Examples and one Docs article at 375, 1024 and 1440 pixels in both themes, beside the same routes of the sibling. Check:

- Header stays on one row at 1024 with the real configured name and the longest actual sibling name; the logo stays usable at 320 px and 200% text. Preserve icon-only GitHub and compact version from 64rem to 75rem.
- Home/Examples footer credit is the explicit site.credit (samline for this family), not a differing npm author string. Keep the shared link roles and wording.
- Every control is styled: selects use shared `Select` (custom chevron, `appearance: none`, `cursor: pointer`), inputs use `Field`, buttons show hover/focus/disabled states.
- Panel chrome does not repeat itself: the panel label is the tab name; show the real API call inside the panel instead of an eyebrow repeating the section eyebrow.
- Accent pairs are accessible: a named color usually needs a darker light-theme accent and a brighter dark-theme accent (lime green: `#4d7c0f` / `#a3e635`). `npm run accent -- '#84cc16'` derives the pair; `check-config` verifies 4.5:1 text and primary-button contrast in both themes.

## 4. Package behavior

- Test the built IIFE as a classic script (a default export plus `globalName` produced `window.Name = { default }` in Formatter 2.0.x while unit tests passed). Point `e2e/demo-builds.ts` at the built files so copied examples run against them.
- Test idempotence of any reformatting API: `f(f(x).output)` must equal `f(x)` where the contract says so.
- Existing tests can lock bugs. Distinguish documented contracts (keep) from contradictions of the documented contract (fix, with changelog notes).

## 5. Report

Record dated evidence: commands run, routes and widths reviewed, differences from the sibling with reasons, and what could not be verified (npm/CDN publication, live PageSpeed). Never claim "all reviewed" from automated checks alone.
