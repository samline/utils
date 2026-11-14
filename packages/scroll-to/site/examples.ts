// Copyable files are complete pages: they load the published browser bundle
// (window.ScrollTo handles links on its own) and scroll the page itself. The
// previews in examples/*.astro import the package and scroll inside a box.
const sections = (ids: string[]) =>
  ids
    .map(
      id =>
        `  <section id="${id}">\n    <h2>${id[0]!.toUpperCase()}${id.slice(1)}</h2>\n  </section>`
    )
    .join('\n')

export default [
  {
    id: 'header',
    tab: 'Fixed header',
    title: 'Anchors that land below a fixed header',
    description:
      'Same-page links scroll smoothly and stop below the header, move focus to the section and add a history entry, so Back works. The header height is read live.',
    files: {
      html: `<header id="header">
  <nav>
    <a href="#features">Features</a>
    <a href="#pricing">Pricing</a>
    <a href="#faq">FAQ</a>
  </nav>
</header>
<main>
${sections(['features', 'pricing', 'faq'])}
  <button type="button" data-scroll-to="top">Back to top</button>
</main>`,
      css: `body { margin: 0; font-family: system-ui, sans-serif; }
header { position: fixed; inset: 0 0 auto; z-index: 1; padding: 1rem 1.5rem; background: #fff; border-bottom: 1px solid #ddd; }
nav { display: flex; gap: 1rem; }
main { padding: 5rem 1.5rem 50vh; }
section { min-height: 70vh; border-top: 1px solid #ddd; }
section:focus { outline: none; }`,
      js: `// Called before the DOM is ready, this replaces the automatic start.
ScrollTo.auto({ offset: '#header' })`,
      esm: `import { autoScrollTo, scrollTo } from '@samline/scroll-to'

autoScrollTo({ offset: '#header' })`,
    },
  },
  {
    id: 'tabs',
    tab: 'Centered tabs',
    title: 'Keep the selected tab in the middle',
    description:
      'Inside a horizontal strip, data-scroll-to-container and data-scroll-to-inline="center" scroll only the strip, never the page.',
    files: {
      html: `<div class="tabs" id="tabs" role="tablist">
${Array.from({ length: 12 }, (_, i) => `  <button type="button" role="tab" id="tab-${i + 1}" aria-selected="${i === 0}">Topic ${i + 1}</button>`).join('\n')}
</div>`,
      css: `body { font-family: system-ui, sans-serif; }
.tabs { display: flex; gap: 0.5rem; max-width: 32rem; overflow-x: auto; padding: 0.5rem; border: 1px solid #ddd; }
.tabs button { flex: none; padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 999px; background: #fff; }
.tabs [aria-selected='true'] { background: #bf4532; border-color: #bf4532; color: #fff; }`,
      js: `const tabs = document.querySelector('#tabs')

tabs.addEventListener('click', event => {
  const tab = event.target.closest('[role="tab"]')
  if (!tab) return
  tabs.querySelector('[aria-selected="true"]').setAttribute('aria-selected', 'false')
  tab.setAttribute('aria-selected', 'true')
  ScrollTo.scrollTo(tab, { container: tabs, inline: 'center', block: 'nearest' })
})`,
      esm: `import { autoScrollTo, scrollTo } from '@samline/scroll-to'

const tabs = document.querySelector('#tabs')

tabs.addEventListener('click', event => {
  const tab = event.target.closest('[role="tab"]')
  if (!tab) return
  tabs.querySelector('[aria-selected="true"]').setAttribute('aria-selected', 'false')
  tab.setAttribute('aria-selected', 'true')
  scrollTo(tab, { container: tabs, inline: 'center', block: 'nearest' })
})`,
    },
  },
  {
    id: 'await',
    tab: 'Wait for arrival',
    title: 'Do something once it arrives',
    description:
      'scrollTo returns a promise: true when it arrives, false when the visitor took over. Here the answer is highlighted only after the scroll ends.',
    files: {
      html: `<button type="button" id="show">Show the answer to question 4</button>
<main>
${Array.from({ length: 6 }, (_, i) => `  <article id="q${i + 1}"><h2>Question ${i + 1}</h2><p>Answer ${i + 1}.</p></article>`).join('\n')}
</main>
<p id="status" aria-live="polite"></p>`,
      css: `body { font-family: system-ui, sans-serif; }
#show { position: fixed; top: 1rem; right: 1rem; }
#status { position: fixed; bottom: 1rem; right: 1rem; margin: 0; }
article { min-height: 60vh; padding: 1rem; border-top: 1px solid #ddd; transition: background 0.6s; }
article.flash { background: #fff6c2; }`,
      js: `const status = document.querySelector('#status')

document.querySelector('#show').addEventListener('click', async () => {
  const answer = document.querySelector('#q4')
  const arrived = await ScrollTo.scrollTo(answer, { offset: 16, duration: 900 })
  status.textContent = arrived ? 'Arrived' : 'Interrupted'
  if (arrived) {
    answer.classList.add('flash')
    setTimeout(() => answer.classList.remove('flash'), 1200)
  }
})`,
      esm: `import { autoScrollTo, scrollTo } from '@samline/scroll-to'

const status = document.querySelector('#status')

document.querySelector('#show').addEventListener('click', async () => {
  const answer = document.querySelector('#q4')
  const arrived = await scrollTo(answer, { offset: 16, duration: 900 })
  status.textContent = arrived ? 'Arrived' : 'Interrupted'
  if (arrived) {
    answer.classList.add('flash')
    setTimeout(() => answer.classList.remove('flash'), 1200)
  }
})`,
    },
  },
]
