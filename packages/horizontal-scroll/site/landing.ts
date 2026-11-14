import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const markup = `<section data-horizontal-scroll>
  <div data-horizontal-scroll-track class="row">
    <article>…</article>
    <article>…</article>
    <article>…</article>
  </div>
</section>`

const script = `import { autoHorizontalScroll } from '@samline/horizontal-scroll'

autoHorizontalScroll()`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Pinned horizontal scroll sections for galleries and timelines',
    seoDescription:
      'Pin a section and move its content sideways as the page scrolls down, with keyboard focus, media queries, reduced motion and a native scroll fallback.',
    kicker: 'Scroll down, travel sideways.',
    title: identity.name,
    // A non-breaking space keeps the last two words together, so no word wraps alone.
    titleAccent: 'A row that crosses the screen as you\u00a0scroll.',
    description:
      'Add data-horizontal-scroll to a section and its row pins to the top while the page scroll moves it sideways, then lets the page carry on.',
    descriptionContinuation: 'Install it, scroll the live preview, then read the full reference.',
    footnotes: ['About 2.5 KB gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'ONE SMALL SCRIPT. RIGHT AT HOME IN YOUR STACK.',
    platforms: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte', 'Shopify', 'WordPress'],
  },
  features: {
    eyebrow: '01 / More than a sticky row',
    title: 'The scroll you expect.',
    titleAccent: 'The details you forget.',
    items: {
      dependencies: {
        icon: 'ruler',
        title: 'Sized for you',
        description: text(
          'The section grows exactly tall enough to cross its row, and measures again when images, fonts or the window change.'
        ),
      },
      accessibility: {
        icon: 'keyboard',
        title: 'Keyboard friendly',
        description: text(
          'Tab to a card that is off to the side and the page scrolls until it is in view, so focus never disappears.'
        ),
      },
      lifecycle: {
        icon: 'shield',
        title: 'A real fallback',
        description: text(
          'Without JavaScript, outside your media query or with reduced motion, the row is left to your CSS, such as a native swipe.'
        ),
      },
      entrypoints: {
        icon: 'hand',
        title: 'No scroll hijacking',
        description: text(
          'The page keeps its own scrolling: wheel, touch, keys and scrollbars all work. Only the row position follows it.'
        ),
      },
      frameworks: {
        icon: 'zap',
        title: 'Smooth on every frame',
        description: text(
          'One read per frame and a GPU-friendly translate, with sticky positioning doing the pinning instead of JavaScript.'
        ),
      },
      markup: {
        icon: 'gauge',
        title: 'Progress for free',
        description: text(
          'A --horizontal-scroll-progress variable and an onProgress callback drive bars, counters and effects.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('A row first.', 'Motion when it fits.'),
    description: 'Your content stays a plain row that scrolls natively without JavaScript.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'horizontalScroll and autoHorizontalScroll as ESM or CommonJS.',
      },
      vanilla: {
        label: 'One section',
        entrypoint: 'horizontalScroll(section, options)',
        description: 'Returns { active, progress, refresh, destroy }.',
      },
      browser: {
        label: 'Whole page',
        entrypoint: 'autoHorizontalScroll(options)',
        description: 'Every [data-horizontal-scroll], including sections added later.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.HorizontalScroll',
        description: 'A classic script that starts on its own.',
      },
      core: {
        label: 'Progress',
        entrypoint: 'onProgress({ progress, x })',
        description: 'From 0 to 1, for bars, counters and analytics.',
      },
      style: {
        label: 'Styling',
        entrypoint: '[data-horizontal-scroll-state]',
        description: 'No stylesheet: style the active and fallback states your way.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and pin',
    heading: heading('One attribute.', 'One call.'),
    integrationDescription: 'Turn a row of cards into a pinned horizontal section.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Mark the section', initialize: 'Start it' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription:
      'A section with data-horizontal-scroll around a row (the track) that is wider than the screen.',
    examples: {
      markup: code('index.html', markup, 'html'),
      script: code('main.js', script, 'javascript'),
    },
    docs: {
      description: 'Continue with every option, the fallback and scroll containers.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond a gallery',
    title: 'Plain markup.',
    titleAccent: 'Precise motion.',
    description: 'Three common jobs, without measuring a single card yourself.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Below a fixed header',
        context: 'top',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Pin the row under your header.'),
        code: code(
          'index.html',
          `<section data-horizontal-scroll data-horizontal-scroll-top="64">…</section>`,
          'html'
        ),
      },
      {
        title: 'Only on wide screens',
        context: 'media',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Keep a native swipe on phones.'),
        code: code(
          'index.html',
          `<section\n  data-horizontal-scroll\n  data-horizontal-scroll-media="(min-width: 48rem)"\n>…</section>`,
          'html'
        ),
      },
      {
        title: 'A progress bar',
        context: '--horizontal-scroll-progress',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Show how far along the row is, in CSS.'),
        code: code(
          'style.css',
          `.progress {\n  transform-origin: left;\n  transform: scaleX(var(--horizontal-scroll-progress, 0));\n}`,
          'css'
        ),
      },
    ],
  },
  faq: {
    eyebrow: '05 / Before you build',
    heading: heading('A few details.', 'Clearly answered.'),
    items: {
      docs: {
        question: text('How does it work?'),
        answer: text(
          'The section gets a height of the row plus its overflow, the row becomes position: sticky, and on every scroll frame its translate follows how far the section has been scrolled.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/browser/horizontal-scroll.global.js; it sets up every [data-horizontal-scroll] on its own. Add data-manual to the script tag to start it yourself with HorizontalScroll.auto(). Pin the version in production.'
        ),
      },
      changes: {
        question: text('Can it run only on wide screens?'),
        answer: text(
          'Yes. Set media, or data-horizontal-scroll-media, to a query such as (min-width: 48rem). It is followed live: outside it the section is released and the row is left to your CSS, such as a native swipe.'
        ),
      },
      header: {
        question: text('The row is not pinning. Why?'),
        answer: text(
          'An ancestor with overflow: hidden or auto stops position: sticky. Use overflow: clip there, or pass that ancestor as root when it is the element that scrolls.'
        ),
      },
      observer: {
        question: text('What about reduced motion?'),
        answer: text(
          'By default the effect turns off when the visitor prefers reduced motion, and the row falls back to your CSS. Set respectReducedMotion: false to keep it.'
        ),
      },
      smooth: {
        question: text('Can I change the speed?'),
        answer: text(
          'speed sets how many horizontal pixels move per vertical pixel scrolled. 2 crosses the row in half the scrolling; 0.5 takes twice as long.'
        ),
      },
      nojs: {
        question: text('What happens without JavaScript?'),
        answer: text(
          'Nothing is pinned or resized. Add overflow-x: auto to the section in your CSS and the row scrolls sideways natively.'
        ),
      },
      dynamic: {
        question: text('Does it see content added later?'),
        answer: text(
          'autoHorizontalScroll and the CDN script set up new sections. Size changes inside a row are measured on their own; after replacing the track, call refresh().'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Sideways, on your terms',
    heading: heading('Let the page scroll,', 'and the row travel.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
