// Copyable files are complete pages: they load the published browser bundle
// (window.HorizontalScroll starts on its own) and scroll the page itself. The
// previews in examples/*.astro import the package and scroll inside a box.
const cards = (count: number, className = 'card') =>
  Array.from(
    { length: count },
    (_, i) => `      <article class="${className}" tabindex="0">Card ${i + 1}</article>`
  ).join('\n')

const fallback = `/* Without JavaScript, or when it is off, the row scrolls natively. */
[data-horizontal-scroll] { overflow-x: auto; }`

export default [
  {
    id: 'gallery',
    tab: 'Pinned gallery',
    title: 'Scroll down, move sideways',
    description:
      'The section pins to the top while its row of cards crosses the screen, then the page carries on. Tab through the cards: the page follows the focus.',
    files: {
      html: `<p class="spacer">Scroll down</p>
<section data-horizontal-scroll aria-label="Gallery">
  <div data-horizontal-scroll-track class="track">
${cards(6)}
  </div>
</section>
<p class="spacer">The end</p>`,
      css: `${fallback}
body { margin: 0; font-family: system-ui, sans-serif; }
.spacer { height: 80vh; display: grid; place-items: center; margin: 0; }
.track { display: flex; gap: 1.5rem; height: 100vh; align-items: center; padding: 0 1.5rem; box-sizing: border-box; }
.card { flex: 0 0 min(70vw, 28rem); height: 60vh; display: grid; place-items: center; border-radius: 1rem; background: #efeafd; font-size: 1.5rem; }
.card:focus-visible { outline: 3px solid #6b4fd8; outline-offset: 4px; }`,
      js: `// Nothing to call: the script sets up every [data-horizontal-scroll] on its own.`,
    },
  },
  {
    id: 'progress',
    tab: 'Progress bar',
    title: 'Under a fixed header, with progress',
    description:
      'top keeps the pinned row below a 64px header, speed crosses it in less scrolling, and the --horizontal-scroll-progress variable drives a bar in CSS.',
    files: {
      html: `<header class="bar-header">Timeline<span class="progress"></span></header>
<p class="spacer">Scroll down</p>
<section data-horizontal-scroll aria-label="Timeline">
  <ol data-horizontal-scroll-track class="track">
${Array.from({ length: 8 }, (_, i) => `    <li class="step" tabindex="0">${2017 + i}</li>`).join('\n')}
  </ol>
</section>
<p class="spacer">The end</p>`,
      css: `${fallback}
body { margin: 0; font-family: system-ui, sans-serif; }
.bar-header { position: fixed; inset: 0 0 auto; z-index: 1; height: 64px; display: flex; align-items: center; padding: 0 1.5rem; background: #fff; border-bottom: 1px solid #ddd; }
.progress { position: absolute; left: 0; bottom: -1px; width: 100%; height: 3px; background: #6b4fd8; transform-origin: left; transform: scaleX(var(--progress, 0)); }
.spacer { height: 80vh; display: grid; place-items: center; margin: 0; }
.track { display: flex; gap: 1rem; height: calc(100vh - 64px); align-items: center; margin: 0; padding: 0 1.5rem; list-style: none; box-sizing: border-box; }
.step { flex: 0 0 18rem; height: 12rem; display: grid; place-items: center; border-left: 3px solid #6b4fd8; background: #f5f3fb; font-size: 2rem; }`,
      js: `// Called before the DOM is ready, this replaces the automatic start.
HorizontalScroll.auto({
  top: 64,
  speed: 1.5,
  onProgress: ({ progress }) =>
    document.querySelector('.progress').style.setProperty('--progress', progress),
})`,
    },
  },
  {
    id: 'responsive',
    tab: 'Wide screens only',
    title: 'A swipeable carousel on phones',
    description:
      'With data-horizontal-scroll-media the effect only runs on wide screens. Elsewhere, and with reduced motion, your CSS takes over: here a snapping carousel.',
    files: {
      html: `<p class="spacer">Scroll down</p>
<section data-horizontal-scroll data-horizontal-scroll-media="(min-width: 48rem)" aria-label="Products">
  <div data-horizontal-scroll-track class="track">
${cards(5, 'card')}
  </div>
</section>
<p class="spacer">The end</p>`,
      css: `/* Phones and reduced motion: a native, snapping carousel. */
[data-horizontal-scroll] { overflow-x: auto; scroll-snap-type: x mandatory; }
.card { scroll-snap-align: center; }
/* Pinned: no snapping, the page scroll drives the row. */
[data-horizontal-scroll-state='active'] { scroll-snap-type: none; }
body { margin: 0; font-family: system-ui, sans-serif; }
.spacer { height: 80vh; display: grid; place-items: center; margin: 0; }
.track { display: flex; gap: 1rem; padding: 2rem 1.5rem; }
[data-horizontal-scroll-state='active'] .track { height: 100vh; align-items: center; box-sizing: border-box; }
.card { flex: 0 0 min(80vw, 24rem); height: 18rem; display: grid; place-items: center; border-radius: 1rem; background: #e6f4ea; font-size: 1.5rem; }`,
      js: `// Nothing to call: the media query comes from the attribute.`,
    },
  },
]
