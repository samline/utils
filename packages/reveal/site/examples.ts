// Copyable files load the published browser bundle and stylesheet
// (window.Reveal starts on its own); the previews in examples/*.astro import
// the package itself.
export default [
  {
    id: 'cascade',
    tab: 'Cascade',
    title: 'Cascade a grid as it scrolls in',
    description:
      'data-reveal-stagger on the container delays each item that enters with the others, in document order. Items already in view on load are never hidden.',
    files: {
      html: `<div id="page">
  <p class="spacer">Scroll down</p>
  <ul class="grid" data-reveal-stagger="90">
    <li data-reveal>Fast</li>
    <li data-reveal>Typed</li>
    <li data-reveal>Tiny</li>
    <li data-reveal>Accessible</li>
    <li data-reveal>Printable</li>
    <li data-reveal>Framework-free</li>
  </ul>
</div>`,
      css: `#page { height: 16rem; overflow-y: auto; padding: 1rem; border: 1px solid #ccc; }
.spacer { min-height: 24rem; margin: 0; }
.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr)); gap: 0.75rem; }
.grid li { padding: 1.25rem; border: 1px solid #ccc; }`,
      js: `// The box scrolls instead of the page, so pass it as the root.
// Called before the DOM is ready, this replaces the automatic start.
Reveal.auto({ root: document.querySelector('#page') })`,
      esm: `import { autoReveal } from '@samline/reveal'
import '@samline/reveal/style.css'

// The box scrolls instead of the page, so pass it as the root.
autoReveal({ root: document.querySelector('#page') })`,
    },
  },
  {
    id: 'effects',
    tab: 'Effects',
    title: 'Every effect, replayed on each entry',
    description:
      'The value of data-reveal picks the effect. data-reveal-repeat hides an element again when it leaves, so it plays every time it comes back.',
    files: {
      html: `<div id="page">
  <p class="spacer">Scroll down, then back up</p>
  <div class="item" data-reveal="up" data-reveal-repeat>up</div>
  <div class="item" data-reveal="down" data-reveal-repeat>down</div>
  <div class="item" data-reveal="left" data-reveal-repeat>left</div>
  <div class="item" data-reveal="right" data-reveal-repeat>right</div>
  <div class="item" data-reveal="fade" data-reveal-repeat>fade</div>
  <div class="item" data-reveal="zoom" data-reveal-repeat>zoom</div>
  <div class="item" data-reveal="blur" data-reveal-repeat data-reveal-duration="900">blur, 900ms</div>
</div>`,
      css: `#page { height: 16rem; overflow-y: auto; display: grid; gap: 0.75rem; padding: 1rem; border: 1px solid #ccc; }
.spacer { min-height: 24rem; margin: 0; }
.item { padding: 1.25rem; border: 1px solid #ccc; --reveal-distance: 1.5rem; }`,
      js: `Reveal.auto({ root: document.querySelector('#page') })`,
      esm: `import { autoReveal } from '@samline/reveal'
import '@samline/reveal/style.css'

autoReveal({ root: document.querySelector('#page') })`,
    },
  },
  {
    id: 'scrub',
    tab: 'Scrub',
    title: 'Follow the scroll position with CSS only',
    description:
      'data-reveal-scrub ties the effect to the scroll position with a scroll-driven animation, no JavaScript involved. Browsers without animation-timeline show the content as is.',
    files: {
      html: `<div id="page">
  <p class="spacer">Scroll slowly</p>
  <div class="item" data-reveal="zoom" data-reveal-scrub>zoom</div>
  <div class="item" data-reveal="left" data-reveal-scrub>left</div>
  <div class="item" data-reveal="blur" data-reveal-scrub>blur</div>
  <p class="spacer"></p>
</div>
<p id="support"></p>`,
      css: `#page { height: 16rem; overflow-y: auto; display: grid; gap: 0.75rem; padding: 1rem; border: 1px solid #ccc; }
.spacer { min-height: 24rem; margin: 0; }
.item { padding: 1.25rem; border: 1px solid #ccc; --reveal-range: entry 0% cover 40%; }`,
      js: `document.querySelector('#support').textContent = CSS.supports('animation-timeline: view()')
  ? 'Scroll-driven animations are supported here.'
  : 'This browser has no scroll-driven animations, so the content stays visible.'`,
      esm: `import { autoReveal } from '@samline/reveal'
import '@samline/reveal/style.css'

document.querySelector('#support').textContent = CSS.supports('animation-timeline: view()')
  ? 'Scroll-driven animations are supported here.'
  : 'This browser has no scroll-driven animations, so the content stays visible.'`,
    },
  },
]
