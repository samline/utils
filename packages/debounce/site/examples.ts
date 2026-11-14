// Copyable files for each example. They load the published browser bundle
// (window.Debounce); the live previews in examples/*.astro use the package.
export default [
  {
    id: 'search',
    tab: 'Search',
    title: 'Search after the user stops typing',
    description:
      'debounce waits 300 ms of quiet, Enter runs the pending search at once with flush(), and Escape drops it with cancel().',
    files: {
      html: `<label for="search">Search a fruit</label>
<input id="search" type="text" autocomplete="off" />
<p id="status" aria-live="polite">Type to search.</p>
<ul id="results"></ul>`,
      css: `ul { padding-left: 1.25rem; }
#status { color: #666; }`,
      js: `const { debounce } = window.Debounce
const fruits = ['apple', 'apricot', 'banana', 'blueberry', 'cherry', 'grape', 'mango', 'melon', 'orange', 'peach', 'pear', 'plum']
const input = document.querySelector('#search')
const status = document.querySelector('#status')
const results = document.querySelector('#results')

const search = debounce(query => {
  const matches = fruits.filter(fruit => fruit.includes(query.trim().toLowerCase()))
  results.replaceChildren(...matches.map(fruit => Object.assign(document.createElement('li'), { textContent: fruit })))
  status.textContent = query.trim() ? \`\${matches.length} results for “\${query.trim()}”\` : 'Type to search.'
}, 300)

input.addEventListener('input', () => search(input.value))
input.addEventListener('keydown', event => {
  if (event.key === 'Enter') search.flush()
  if (event.key === 'Escape') search.cancel()
})`,
      esm: `import { debounce } from '@samline/debounce'

const fruits = ['apple', 'apricot', 'banana', 'blueberry', 'cherry', 'grape', 'mango', 'melon', 'orange', 'peach', 'pear', 'plum']
const input = document.querySelector('#search')
const status = document.querySelector('#status')
const results = document.querySelector('#results')

const search = debounce(query => {
  const matches = fruits.filter(fruit => fruit.includes(query.trim().toLowerCase()))
  results.replaceChildren(...matches.map(fruit => Object.assign(document.createElement('li'), { textContent: fruit })))
  status.textContent = query.trim() ? \`\${matches.length} results for “\${query.trim()}”\` : 'Type to search.'
}, 300)

input.addEventListener('input', () => search(input.value))
input.addEventListener('keydown', event => {
  if (event.key === 'Enter') search.flush()
  if (event.key === 'Escape') search.cancel()
})`,
    },
  },
  {
    id: 'autosave',
    tab: 'Autosave',
    title: 'Autosave at most once per second',
    description:
      'throttle saves immediately, then at most once per second while typing, and once more with the final text.',
    files: {
      html: `<label for="note">Note</label>
<textarea id="note" rows="4"></textarea>
<p id="saved" aria-live="polite">Not saved yet.</p>`,
      css: `textarea { width: 100%; }`,
      js: `const { throttle } = window.Debounce
const note = document.querySelector('#note')
const saved = document.querySelector('#saved')
let saves = 0

const save = throttle(() => {
  saves += 1
  saved.textContent = \`Saved \${saves} times · \${note.value.length} characters\`
}, 1000)

note.addEventListener('input', save)`,
      esm: `import { throttle } from '@samline/debounce'

const note = document.querySelector('#note')
const saved = document.querySelector('#saved')
let saves = 0

const save = throttle(() => {
  saves += 1
  saved.textContent = \`Saved \${saves} times · \${note.value.length} characters\`
}, 1000)

note.addEventListener('input', save)`,
    },
  },
  {
    id: 'progress',
    tab: 'Scroll progress',
    title: 'Update a progress bar once per frame',
    description: 'rafThrottle turns a burst of scroll events into one update per animation frame.',
    files: {
      html: `<div id="bar" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
<div id="article">
  <p>Scroll this box.</p>
  <p style="height: 60rem">A long article.</p>
</div>`,
      css: `#article { height: 12rem; overflow-y: auto; border: 1px solid #ccc; }
#bar { height: 0.375rem; width: 0; background: #bf4532; }`,
      js: `const { rafThrottle } = window.Debounce
const article = document.querySelector('#article')
const bar = document.querySelector('#bar')

const update = rafThrottle(() => {
  const max = article.scrollHeight - article.clientHeight
  const progress = max > 0 ? Math.round((article.scrollTop / max) * 100) : 0
  bar.style.width = progress + '%'
  bar.setAttribute('aria-valuenow', String(progress))
})

article.addEventListener('scroll', update, { passive: true })`,
      esm: `import { rafThrottle } from '@samline/debounce'

const article = document.querySelector('#article')
const bar = document.querySelector('#bar')

const update = rafThrottle(() => {
  const max = article.scrollHeight - article.clientHeight
  const progress = max > 0 ? Math.round((article.scrollTop / max) * 100) : 0
  bar.style.width = progress + '%'
  bar.setAttribute('aria-valuenow', String(progress))
})

article.addEventListener('scroll', update, { passive: true })`,
    },
  },
] as const
