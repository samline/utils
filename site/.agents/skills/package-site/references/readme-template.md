# Public README convention

The maintained, executable proposal is
[scripts/package-readme-template.md](../../../../scripts/package-readme-template.md).
The importer fills its identity/links and writes brief/readme-proposal.md without
modifying the source README. Use that file as the structural starting point for
new projects and rewrite the API-specific content from evidence; do not create
another competing README scaffold in a skill or project memory.

The canonical rules are in [.agents/identity.md](../../../identity.md), with the
checker in scripts/lib/identity-checks.mjs. Preserve the exact H2 order and TOC,
resource row, three sh installation blocks, API/Purpose and Guide/What it covers
tables, Entrypoints subsection, changelog source, skill source/download and
LICENSE.md link. Add package-specific details as subsections. A CDN section is
conditional on a real supported standalone build. The private template describes
configuration/commands rather than pretending to be a published runtime.

Review actual API behavior, copied snippets, Node/browser support and the site's
real URLs. Preserve meaningful old anchors. Applying the shared structure does
not authorize discarding package contracts or copying another package's prose.
Run check:identity after the site build; it rejects an unfinished proposal marker,
a mismatched TOC, missing manager commands, divergent table roles, missing
entrypoints and broken source/download conventions in addition to H2 drift.
