// Scenario behavior, shared verbatim by the live preview and the copied files.
// shared/lib/demo-source.ts copies each `#region` below into the generated
// main.js (without `export`), so the preview cannot drift from copied code.
// Keep each region self-contained plain JavaScript: no types, classes or `this`,
// and no references outside the region except identifiers the scenario's
// loading-mode import line provides. An adaptation replaces these neutral
// transforms with calls to the real package API.

// #region slug
/** @param {string} value @param {string} separator */
export const slug = (value, separator) => {
  const result = value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join(separator)
  return { slug: result || '—', length: String(result.length) }
}
// #endregion slug

// #region limit
/** @param {string} value @param {string} limit */
export const limit = (value, limit) => {
  const max = Number(limit)
  const used = [...value].length
  const left = max - used
  return {
    used: `${used} / ${max}`,
    remaining: left >= 0 ? `${left} left` : `${-left} over the limit`,
  }
}
// #endregion limit

// #region textCase
/** @param {string} value @param {string} mode */
export const textCase = (value, mode) => {
  const lower = value.toLowerCase()
  const result =
    mode === 'upper'
      ? value.toUpperCase()
      : mode === 'lower'
        ? lower
        : mode === 'title'
          ? lower.replace(/(^|\s)(\S)/g, (_, space, letter) => space + letter.toUpperCase())
          : lower.replace(/^\s*\S/, letter => letter.toUpperCase())
  return { result: result || '—' }
}
// #endregion textCase
