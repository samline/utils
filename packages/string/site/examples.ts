// Copyable files load the published browser bundle (window.SamlineString);
// the previews in examples/*.astro import the package itself.
export default [
  {
    id: 'slug',
    tab: 'Slug field',
    title: 'Fill a URL slug from the title',
    description:
      'The slug follows the title until the user edits it. trim: false keeps a trailing separator while typing; the final value is trimmed.',
    files: {
      html: `<label for="title">Title</label>
<input id="title" type="text" value="Café & Té: Guía 2026" />
<label for="slug">Slug</label>
<input id="slug" type="text" />`,
      css: `label { display: block; margin-top: 0.75rem; font-weight: 600; }
input { width: 100%; max-width: 28rem; padding: 0.5rem; font: inherit; }`,
      js: `const { slugify } = window.SamlineString
const title = document.querySelector('#title')
const slug = document.querySelector('#slug')
let edited = false

const sync = () => {
  if (!edited) slug.value = slugify(title.value, { replacements: { '&': 'y' } })
}
title.addEventListener('input', sync)
slug.addEventListener('input', () => {
  edited = true
  slug.value = slugify(slug.value, { trim: false })
})
// blur, not change: Safari skips change when a script edited the value during input.
slug.addEventListener('blur', () => (slug.value = slugify(slug.value)))
sync()`,
    },
  },
  {
    id: 'keys',
    tab: 'Data keys',
    title: 'Normalize keys from an API',
    description:
      'Convert snake_case API fields to camelCase for JavaScript and back to snake_case before sending.',
    files: {
      html: `<pre id="output"></pre>`,
      css: `pre { padding: 1rem; background: #f4f4f2; }`,
      js: `const { camelCase, snakeCase } = window.SamlineString
const mapKeys = (object, convert) =>
  Object.fromEntries(Object.entries(object).map(([key, value]) => [convert(key), value]))

const fromApi = { user_id: 7, first_name: 'Ana', last_login_at: '2026-11-13' }
const forJs = mapKeys(fromApi, camelCase)
const back = mapKeys(forJs, snakeCase)

document.querySelector('#output').textContent = JSON.stringify({ forJs, back }, null, 2)`,
    },
  },
  {
    id: 'cards',
    tab: 'Cards',
    title: 'Avatars and excerpts for a list',
    description:
      'initials builds avatar letters and truncate shortens text at a word boundary without splitting accents or emoji.',
    files: {
      html: `<ul id="people"></ul>`,
      css: `ul { list-style: none; padding: 0; display: grid; gap: 0.75rem; }
li { display: flex; gap: 0.75rem; align-items: center; }
.avatar { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; background: #c54936; color: white; font-weight: 600; }`,
      js: `const { initials, truncate } = window.SamlineString
const people = [
  { name: 'Samuel Olvera', bio: 'Builds small, framework-agnostic utilities for the open web.' },
  { name: 'ana maría lópez', bio: 'Diseña interfaces accesibles y escribe sobre tipografía en español.' },
]

document.querySelector('#people').replaceChildren(
  ...people.map(person => {
    const item = document.createElement('li')
    const avatar = Object.assign(document.createElement('span'), {
      className: 'avatar',
      textContent: initials(person.name),
    })
    const text = Object.assign(document.createElement('span'), {
      textContent: truncate(person.bio, 40),
    })
    item.append(avatar, text)
    return item
  })
)`,
    },
  },
] as const
