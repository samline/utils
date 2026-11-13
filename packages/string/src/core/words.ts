/**
 * Split any identifier or phrase into words.
 *
 * Handles separators (spaces, `-`, `_`, `.`, `/`, punctuation), camelCase,
 * PascalCase and acronyms (`XMLHttpRequest` → `XML`, `Http`, `Request`), keeps
 * digits attached to their word (`version2` stays one word) and works with any
 * script (`añoNuevo` → `año`, `Nuevo`).
 */
export const words = (input: string): string[] => {
  if (typeof input !== 'string' || input === '') return []
  return (
    input
      // fooBar → foo Bar, foo2Bar → foo2 Bar
      .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2')
      // XMLHttp → XML Http
      .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
  )
}
