# Migrating a Starlight docs site

Use `npm run migrate:starlight` with `scripts/doc-migration.json` instead of writing a one-off converter. It moves content; it does not verify it. Review every converted page against the package source.

## Manifest

```json
{
  "source": "../pkg/docs/src/content/docs",
  "pages": [
    {
      "source": "guides/install.mdx",
      "destination": "getting-started",
      "title": "Install the package",
      "titleAccent": "the package",
      "group": "start",
      "order": 2
    }
  ],
  "redirects": {
    "guides/install": "getting-started"
  }
}
```

- List every source page; the inventory in `content-audit.json` must give each one a reviewed destination.
- `titleAccent` is required and chosen by hand: a meaningful trailing phrase of the title (PageTitle rejects anything else), never the whole title and never the last word by default. Give single-word titles a second word.
- `base` (optional, e.g. `"/forms/"`) is the old site's base path; absolute links that include it are resolved like root-relative links.
- `description` may override the source; anything under 70 characters is reported.
- `redirects` maps old public routes (relative to the site root) to new docs routes. `assemble.mjs` writes a redirect page per entry that preserves the fragment.

## Conversion rules

- Relative links resolve against the **parent directory of the source page**: Starlight authors wrote file-relative links (`./options` in `guides/install.mdx` means `guides/options`). Each target maps through the manifest to a link relative to the new page URL, so it stays valid at any base path. Unmapped links are reported and must be fixed.
- `:::note`, `:::tip`, `:::caution`, `:::danger` asides (with an optional `[Title]`) become the shared `Callout`.
- Starlight `Tabs`/`TabItem` become shared `Tabs`/`TabPanel` with dedented content; `syncKey` becomes the tab group label.
- Starlight `CardGrid` becomes the shared CardGrid, `LinkCard` the shared LinkCard (its description becomes the body), `Card` a `Surface` article with a bold title, and `Steps` unwraps to its ordered list.
- Imports from `@astrojs/starlight/components` are removed; shared component imports are added with the right relative depth, followed by a blank line (MDX fails to parse otherwise). Attribute values are emitted as JSX expressions.

## After conversion

1. `npm run build`: the link audit verifies every local link and fragment, including redirect targets.
2. Read every page beside the source package: update stale APIs, remove duplicated installation prose, and move exhaustive internals to reference pages.
3. Preserve meaningful public fragments: add explicit ids where headings changed.
4. Retire the old Starlight app only within the maintainer's authorized scope, keeping Git history as evidence.

Same-origin sibling links (for example `owner.github.io/other-package/`) fail the link audit as "outside deployment base". Link to the sibling repository instead, or pass the exact path to `checkLinks({ externalPaths })` in `scripts/check-site.mjs` with a comment explaining why.
