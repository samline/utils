// Copyable files load the published browser bundle (window.ScrollSpy starts
// on its own); the previews in examples/*.astro import the package itself.
const sections = (ids: string[], height = '12rem') =>
  ids
    .map(
      id =>
        `  <section id="${id}" style="min-height: ${height}">\n    <h2>${id[0]!.toUpperCase()}${id.slice(1)}</h2>\n  </section>`
    )
    .join('\n')

export default [
  {
    id: 'toc',
    tab: 'Table of contents',
    title: 'Highlight the section you are reading',
    description:
      'Links to #id sections get aria-current="true" once their section crosses the line at 25% of the box. A clicked link stays highlighted while the box scrolls to it.',
    files: {
      html: `<div class="layout">
  <nav data-scroll-spy aria-label="On this page">
    <a href="#overview">Overview</a>
    <a href="#install">Install</a>
    <a href="#usage">Usage</a>
    <a href="#faq">FAQ</a>
  </nav>
  <div id="article">
${sections(['overview', 'install', 'usage'])}
${sections(['faq'], '4rem')}
  </div>
</div>`,
      css: `.layout { display: grid; grid-template-columns: 9rem 1fr; gap: 1rem; }
nav { display: grid; align-content: start; gap: 0.25rem; }
nav a { padding: 0.25rem 0.5rem; border-left: 2px solid #ddd; color: #555; text-decoration: none; }
nav a[aria-current] { border-color: #6b4fd8; color: #111; font-weight: 600; }
#article { height: 16rem; overflow-y: auto; scroll-behavior: smooth; padding: 0 1rem; border: 1px solid #ccc; }`,
      js: `// The article scrolls instead of the page, so pass it as the root.
// Called before the DOM is ready, this replaces the automatic start.
ScrollSpy.auto({ root: document.querySelector('#article') })`,
    },
  },
  {
    id: 'menu',
    tab: 'One-page menu',
    title: 'A one-page menu with a class and the URL hash',
    description:
      'activeClass styles the current item, and updateHash keeps the address shareable without adding history entries.',
    files: {
      html: `<div id="page">
  <nav class="menu" data-scroll-spy>
    <a href="#home">Home</a>
    <a href="#work">Work</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
${sections(['home', 'work', 'about', 'contact'], '14rem')}
</div>`,
      css: `#page { height: 16rem; overflow-y: auto; scroll-behavior: smooth; border: 1px solid #ccc; }
.menu { position: sticky; top: 0; display: flex; gap: 1rem; padding: 0.75rem 1rem; background: #fff; border-bottom: 1px solid #ddd; }
.menu a { color: #555; text-decoration: none; }
.menu a.is-active { color: #111; font-weight: 600; text-decoration: underline; }
section { padding: 0 1rem; scroll-margin-top: 3rem; }`,
      js: `ScrollSpy.auto({
  root: document.querySelector('#page'),
  activeClass: 'is-active',
  updateHash: true,
})`,
    },
  },
  {
    id: 'long',
    tab: 'Long contents',
    title: 'A long table of contents that follows along',
    description:
      'When the navigation scrolls itself, the active link is kept in view by scrolling the navigation only, never the page.',
    files: {
      html: `<div class="layout">
  <nav data-scroll-spy aria-label="Chapters">
${Array.from({ length: 12 }, (_, i) => `    <a href="#chapter-${i + 1}">Chapter ${i + 1}</a>`).join('\n')}
  </nav>
  <div id="book">
${Array.from({ length: 12 }, (_, i) => `    <section id="chapter-${i + 1}"><h2>Chapter ${i + 1}</h2></section>`).join('\n')}
  </div>
</div>`,
      css: `.layout { display: grid; grid-template-columns: 9rem 1fr; gap: 1rem; }
nav { display: grid; align-content: start; height: 16rem; overflow-y: auto; }
nav a { padding: 0.375rem 0.5rem; color: #555; text-decoration: none; }
nav a[aria-current] { background: #efeafd; color: #111; }
#book { height: 16rem; overflow-y: auto; padding: 0 1rem; border: 1px solid #ccc; }
section { min-height: 10rem; }`,
      js: `ScrollSpy.auto({ root: document.querySelector('#book') })`,
    },
  },
]
