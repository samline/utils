/** Letters that Unicode normalization does not decompose into ASCII. */
const TRANSLITERATIONS: Record<string, string> = {
  ß: 'ss',
  ẞ: 'SS',
  æ: 'ae',
  Æ: 'AE',
  œ: 'oe',
  Œ: 'OE',
  ø: 'o',
  Ø: 'O',
  đ: 'd',
  Đ: 'D',
  ł: 'l',
  Ł: 'L',
  þ: 'th',
  Þ: 'TH',
  ð: 'd',
  Ð: 'D',
  ı: 'i',
}
const SPECIAL = new RegExp(`[${Object.keys(TRANSLITERATIONS).join('')}]`, 'g')

/** Remove diacritics and transliterate common Latin letters: `Ñandú Straße` → `Nandu Strasse`. */
export const removeAccents = (input: string): string =>
  String(input ?? '')
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .replace(SPECIAL, char => TRANSLITERATIONS[char] ?? char)
