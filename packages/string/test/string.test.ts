import { describe, expect, it } from 'vitest'

import {
  camelCase,
  capitalize,
  constantCase,
  dotCase,
  initials,
  kebabCase,
  pascalCase,
  removeAccents,
  sentenceCase,
  slugify,
  snakeCase,
  titleCase,
  truncate,
  uncapitalize,
  words,
} from '../src/index.js'

describe('words', () => {
  it.each([
    ['hello world', ['hello', 'world']],
    ['helloWorld', ['hello', 'World']],
    ['HelloWorld', ['Hello', 'World']],
    ['XMLHttpRequest', ['XML', 'Http', 'Request']],
    ['getHTTPResponseCode', ['get', 'HTTP', 'Response', 'Code']],
    ['version2Beta', ['version2', 'Beta']],
    ['snake_case-and.dot/path', ['snake', 'case', 'and', 'dot', 'path']],
    ['  --leading and trailing__  ', ['leading', 'and', 'trailing']],
    ['añoNuevo ÉXITO', ['año', 'Nuevo', 'ÉXITO']],
    ['', []],
  ])('%s', (input, expected) => {
    expect(words(input)).toEqual(expected)
  })

  it('ignores non-strings', () => {
    expect(words(undefined as never)).toEqual([])
  })
})

describe('case conversion', () => {
  const input = 'XMLHttp request_id'

  it('converts to every case', () => {
    expect(camelCase(input)).toBe('xmlHttpRequestId')
    expect(pascalCase(input)).toBe('XmlHttpRequestId')
    expect(kebabCase(input)).toBe('xml-http-request-id')
    expect(snakeCase(input)).toBe('xml_http_request_id')
    expect(dotCase(input)).toBe('xml.http.request.id')
    expect(constantCase(input)).toBe('XML_HTTP_REQUEST_ID')
  })

  it('round-trips between cases', () => {
    expect(camelCase(kebabCase('someLongName'))).toBe('someLongName')
    expect(pascalCase(snakeCase('SomeLongName'))).toBe('SomeLongName')
  })

  it('handles accents and locales', () => {
    expect(camelCase('año nuevo')).toBe('añoNuevo')
    expect(constantCase('istanbul', { locale: 'tr' })).toBe('İSTANBUL')
  })

  it('title cases while keeping punctuation and optional small words', () => {
    expect(titleCase('the lord of the rings')).toBe('The Lord Of The Rings')
    expect(titleCase('the lord of the rings', { smallWords: ['of', 'the'] })).toBe(
      'The Lord of the Rings'
    )
    expect(titleCase('el señor de los anillos', { smallWords: ['de', 'los'] })).toBe(
      'El Señor de los Anillos'
    )
    expect(titleCase("it's 2 o'CLOCK")).toBe("It'S 2 O'Clock")
  })

  it('sentence cases, capitalizes and uncapitalizes', () => {
    expect(sentenceCase('HELLO World')).toBe('Hello world')
    expect(capitalize('hello World')).toBe('Hello World')
    expect(capitalize('élan')).toBe('Élan')
    expect(uncapitalize('Hello World')).toBe('hello World')
    expect(capitalize('')).toBe('')
    expect(sentenceCase(undefined as never)).toBe('')
    expect(uncapitalize(undefined as never)).toBe('')
    expect(capitalize(undefined as never)).toBe('')
  })
})

describe('removeAccents', () => {
  it('removes diacritics and transliterates common letters', () => {
    expect(removeAccents('Ñandú Straße')).toBe('Nandu Strasse')
    expect(removeAccents('Æsir Øresund Łódź œuvre þorn')).toBe('AEsir Oresund Lodz oeuvre thorn')
    expect(removeAccents(undefined as never)).toBe('')
  })
})

describe('slugify', () => {
  it('builds URL slugs', () => {
    expect(slugify('¡Hola, Ñandú & Café!')).toBe('hola-nandu-cafe')
    expect(slugify('  Multiple   spaces -- and___symbols  ')).toBe('multiple-spaces-and-symbols')
    expect(slugify('Straße 42')).toBe('strasse-42')
  })

  it('supports separators, case and replacements', () => {
    expect(slugify('Hello World', { separator: '_' })).toBe('hello_world')
    expect(slugify('Hello World', { lower: false })).toBe('Hello-World')
    expect(slugify('Pan & Café', { replacements: { '&': 'y' } })).toBe('pan-y-cafe')
    expect(slugify('Hello World', { separator: '' })).toBe('helloworld')
    expect(slugify('ISTANBUL', { locale: 'tr' })).toBe('istanbul')
  })

  it('keeps a trailing separator while typing with trim: false', () => {
    expect(slugify('hello ', { trim: false })).toBe('hello-')
    expect(slugify(' hello world ', { trim: false })).toBe('hello-world-')
    expect(slugify('hello ', { trim: false, separator: '' })).toBe('hello')
  })

  it('cuts at a separator with maxLength', () => {
    expect(slugify('the quick brown fox', { maxLength: 12 })).toBe('the-quick')
    expect(slugify('the quick brown fox', { maxLength: 9 })).toBe('the-quick')
    expect(slugify('supercalifragilistic', { maxLength: 5 })).toBe('super')
    expect(slugify('abc', { maxLength: Number.NaN })).toBe('abc')
  })
})

describe('truncate', () => {
  it('cuts at a word boundary with an ellipsis', () => {
    expect(truncate('The quick brown fox jumps', 15)).toBe('The quick…')
    expect(truncate('The quick brown fox jumps', 15, { wordBoundary: false })).toBe(
      'The quick brow…'
    )
    expect(truncate('Short', 10)).toBe('Short')
    expect(truncate('Hello, world', 9, { ellipsis: '...' })).toBe('Hello...')
    // No whole word fits: cut mid-word rather than return only the ellipsis.
    expect(truncate('Hello, world', 7, { ellipsis: '...' })).toBe('Hell...')
  })

  it('never splits emoji or accents and ignores invalid lengths', () => {
    expect(truncate('😀😀😀😀', 3, { ellipsis: '' })).toBe('😀😀😀')
    expect(truncate('abc', Number.NaN)).toBe('abc')
    expect(truncate(undefined as never, 3)).toBe('')
    expect(truncate('abcdef', 1)).toBe('…')
  })
})

describe('initials', () => {
  it('takes the first letter of the first words', () => {
    expect(initials('Samuel Olvera')).toBe('SO')
    expect(initials('ana maría lópez', { max: 3 })).toBe('AML')
    expect(initials('élodie')).toBe('É')
    expect(initials('')).toBe('')
    expect(initials('a b', { max: -1 })).toBe('')
  })
})
