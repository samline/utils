const emptyUnreleased = /^## \[?Unreleased\]?[ \t]*\n\s*(?=^## |(?![\s\S]))/m

/**
 * A published site never shows an empty "Unreleased" heading, nor its compare
 * link. Unreleased notes with content stay visible.
 * @param {string} changelog
 */
export const withoutEmptyUnreleased = changelog =>
  emptyUnreleased.test(changelog)
    ? changelog.replace(emptyUnreleased, '').replace(/^\[Unreleased\]:.*\n?/m, '')
    : changelog
