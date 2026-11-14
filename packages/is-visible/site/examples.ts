// Copyable files for each example. They load the published browser bundle
// (window.isVisible); the live previews in examples/*.astro use the package.
export default [
  {
    id: 'reveal',
    tab: 'Reveal',
    title: 'Reveal sections once as they enter',
    description:
      'once stops observing after the first entry. Without JavaScript or IntersectionObserver the content stays visible.',
    files: {
      html: `<div id="list">
  <section class="reveal">First section</section>
  <section class="reveal">Second section</section>
  <section class="reveal">Third section</section>
</div>`,
      css: `#list { height: 14rem; overflow-y: auto; display: grid; gap: 6rem; padding: 1rem; border: 1px solid #ccc; }
.js .reveal { opacity: 0; transform: translateY(0.75rem); transition: opacity 0.6s, transform 0.6s; }
.js .reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .js .reveal { transition: none; } }`,
      js: `document.documentElement.classList.add('js')
const list = document.querySelector('#list')

window.isVisible(list.querySelectorAll('.reveal'), {
  root: list,
  once: true,
  threshold: 0.2,
  visible: (entry, section) => section.classList.add('is-visible'),
})`,
    },
  },
  {
    id: 'lazy',
    tab: 'Lazy load',
    title: 'Load content just before it is needed',
    description:
      'rootMargin starts loading 200px before an item scrolls in. Each item loads exactly once.',
    files: {
      html: `<div id="feed">
  <article data-src="Story 1">Loading…</article>
  <article data-src="Story 2">Loading…</article>
  <article data-src="Story 3">Loading…</article>
  <article data-src="Story 4">Loading…</article>
  <article data-src="Story 5">Loading…</article>
</div>`,
      css: `#feed { height: 14rem; overflow-y: auto; display: grid; gap: 10rem; padding: 1rem; border: 1px solid #ccc; }`,
      js: `const feed = document.querySelector('#feed')

window.isVisible(feed.querySelectorAll('[data-src]'), {
  root: feed,
  once: true,
  rootMargin: '0px 0px 200px 0px',
  visible: (entry, article) => {
    article.textContent = \`\${article.dataset.src} loaded\`
  },
})`,
    },
  },
  {
    id: 'pause',
    tab: 'Pause off-screen',
    title: 'Run work only while it is on screen',
    description:
      'inOut reports leaving too: a counter runs while half of its panel is visible and pauses when it leaves.',
    files: {
      html: `<div id="box">
  <p>Scroll down to the panel.</p>
  <div id="panel">Running: <output id="ticks">0</output></div>
  <p style="height: 20rem"></p>
</div>`,
      css: `#box { height: 12rem; overflow-y: auto; padding: 1rem; border: 1px solid #ccc; }
#panel { margin-top: 14rem; padding: 1rem; border: 1px solid #bf4532; }`,
      js: `const box = document.querySelector('#box')
const panel = document.querySelector('#panel')
const ticks = document.querySelector('#ticks')
let timer = null

window.isVisible(panel, {
  root: box,
  inOut: true,
  threshold: 0.5,
  visible: () => {
    timer = setInterval(() => (ticks.textContent = String(Number(ticks.textContent) + 1)), 200)
  },
  notVisible: () => clearInterval(timer),
})`,
    },
  },
] as const
