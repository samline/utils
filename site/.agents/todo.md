# Current work

## Collection mode (in progress, 2026-11-12)

Design: [collection-mode.md](collection-mode.md). Branch `collection-mode`.
First consumer: samline/utils (debounce, is-visible). Single-package sites must
not change. Steps: config + registry → landing routes → docs routes → nav/SEO →
checks/tests → utils adoption. Record progress here as each step lands.

README structure, document/social titles, explicit footer credit and real-name
header validation follow [the identity contract](identity.md). The importer owns
a reviewable README proposal; maintain that scaffold and its executable checks
together. Cross-repository ports, package releases and deployment verification
belong to their owning repositories rather than a second task ledger here.
