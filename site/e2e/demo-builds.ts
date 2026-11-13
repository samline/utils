/**
 * Local package builds that the copied-file test substitutes for published
 * assets, so copied examples run against this checkout instead of npm/CDN:
 *
 * - `iife`: the built standalone script, served when a document requests
 *   project.config.json `delivery.cdnScript`. Test the real built IIFE as a
 *   classic script; source-level unit tests do not prove the browser global.
 * - `esm`: the built ESM entry, mapped from the bare `npmName` import through an
 *   import map injected into the routed document.
 *
 * Paths are relative to the project root, e.g. 'dist/browser/global.global.js'.
 * The ESM entry must be one self-contained file: an import map covers only the
 * bare package specifier, so a dist entry that imports chunks or optional peers
 * needs bundling first (for example with esbuild inside readBuild).
 * The neutral template scenarios have no dependency, so both are null.
 */
export const localBuilds = { iife: null as string | null, esm: null as string | null }
