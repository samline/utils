import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const markup = `<header id="header">
  <a href="#pricing">Pricing</a>
</header>

<section id="pricing">…</section>
<button type="button" data-scroll-to="top">Back to top</button>`

const script = `import { autoScrollTo } from '@samline/scroll-to'

autoScrollTo({ offset: '#header' })`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Smooth scrolling to anchors with fixed header offsets',
    seoDescription:
      'Smooth scrolling to anchors, elements and positions with fixed header offsets, alignment, easing, focus, history and a promise for when it arrives.',
    kicker: 'Get there, and land right.',
    title: identity.name,
    titleAccent: 'Smooth scrolling that stops where it should.',
    description:
      'Same-page links and data-scroll-to triggers glide to their target, stop below your fixed header and hand focus to what they reveal.',
    descriptionContinuation: 'Install it, try the live preview, then read the full reference.',
    footnotes: ['About 2.4 KB gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'Works with',
    platforms: ['Vanilla JS', 'TypeScript', 'Any framework', 'Plain HTML', 'Landing pages'],
  },
  features: {
    eyebrow: '01 / More than scrollIntoView',
    title: 'The scroll you meant.',
    titleAccent: 'The details it skips.',
    items: {
      dependencies: {
        title: 'Offsets that stay right',
        description: text(
          'Pixels, a percentage, or the header element itself, measured on each scroll, so a header that changes height still clears.'
        ),
      },
      accessibility: {
        title: 'Focus follows',
        description: text(
          'Links move keyboard focus to their target once it arrives, so the next Tab continues from there, as a native jump would.'
        ),
      },
      lifecycle: {
        title: 'Lands on target',
        description: text(
          'The destination is measured on every frame, so images loading on the way never leave it short or past the section.'
        ),
      },
      entrypoints: {
        title: 'You stay in control',
        description: text(
          'A wheel, a touch or a key stops it at once. Reduced motion jumps instead of animating.'
        ),
      },
      frameworks: {
        title: 'Any container, both axes',
        description: text(
          'Scroll the page or a box, align to the start, center, end or nearest edge, and center tabs in a horizontal strip.'
        ),
      },
      markup: {
        title: 'Know when it arrives',
        description: text(
          'Every scroll returns a promise: true when it arrives, false when interrupted, ready for highlights and analytics.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('Links first.', 'Script when you need it.'),
    description: 'Your links stay plain #id links that jump without JavaScript.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'scrollTo, scrollPosition and autoScrollTo as ESM or CommonJS.',
      },
      vanilla: {
        label: 'One scroll',
        entrypoint: 'scrollTo(target, options)',
        description: 'Returns a promise of true (arrived) or false.',
      },
      browser: {
        label: 'Whole page',
        entrypoint: 'autoScrollTo(options)',
        description: 'Every #id link and [data-scroll-to], with one listener.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.ScrollTo',
        description: 'A classic script that starts on its own.',
      },
      core: {
        label: 'Measure only',
        entrypoint: 'scrollPosition(target, options)',
        description: 'Where it would scroll, without moving.',
      },
      style: {
        label: 'Styling',
        entrypoint: 'No stylesheet',
        description: 'Nothing to style: it only moves the scroll position.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and glide',
    heading: heading('Plain links.', 'One call.'),
    integrationDescription: 'Make same-page links scroll smoothly below a fixed header.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Write your links', initialize: 'Start it' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription:
      'Plain #id links, or any element with data-scroll-to and a target: an #id, a selector or top.',
    examples: {
      markup: code('index.html', markup, 'html'),
      script: code('main.js', script, 'javascript'),
    },
    docs: {
      description: 'Continue with every option, alignment and scroll containers.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond anchors',
    title: 'One function.',
    titleAccent: 'Every kind of scroll.',
    description: 'Three common jobs, without measuring a single element yourself.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Back to top',
        context: 'data-scroll-to',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Any element can trigger a scroll.'),
        code: code('index.html', `<button type="button" data-scroll-to="top">Back to top</button>`, 'html'),
      },
      {
        title: 'Center the active tab',
        context: 'inline: center',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Scroll a strip, never the page.'),
        code: code(
          'main.js',
          `scrollTo(activeTab, {\n  container: tabs,\n  inline: 'center',\n  block: 'nearest',\n})`,
          'javascript'
        ),
      },
      {
        title: 'Highlight on arrival',
        context: 'await',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Act once the scroll is over.'),
        code: code(
          'main.js',
          `if (await scrollTo('#faq-4', { offset: 80 })) {\n  faq.classList.add('flash')\n}`,
          'javascript'
        ),
      },
    ],
  },
  faq: {
    eyebrow: '05 / Before you build',
    heading: heading('A few details.', 'Clearly answered.'),
    items: {
      docs: {
        question: text('Why not CSS scroll-behavior: smooth?'),
        answer: text(
          'Use it when it is enough. scroll-to adds what CSS cannot: offsets from a live element, durations and easing, interruption, focus, a promise and targets that move while content loads.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/browser/scroll-to.global.js; it handles #id links and [data-scroll-to] on its own. Add data-manual to the script tag to start it yourself with ScrollTo.auto(). Pin the version in production.'
        ),
      },
      changes: {
        question: text('How are releases documented?'),
        answer: text(
          'CHANGELOG.md is the single release history and is published in the docs. Breaking and behavior changes are called out explicitly.'
        ),
      },
      header: {
        question: text('What about links that open a page with a #hash?'),
        answer: text(
          'With an offset, autoScrollTo aligns the URL hash once the page loads, so a fixed header does not cover the section the visitor came for.'
        ),
      },
      observer: {
        question: text('Does it break the Back button?'),
        answer: text(
          'No. Links push their hash like a native jump, so Back returns to the previous section. Use hash: replace or false to change that.'
        ),
      },
      smooth: {
        question: text('What if the visitor scrolls while it moves?'),
        answer: text(
          'It stops at once and the promise resolves to false. Set interruptible: false for scrolls that must finish.'
        ),
      },
      nojs: {
        question: text('What happens without JavaScript?'),
        answer: text(
          'Links still jump to their sections natively. Elements with only data-scroll-to do nothing, so prefer links where you can.'
        ),
      },
      dynamic: {
        question: text('Do links added later work?'),
        answer: text(
          'Yes. autoScrollTo listens with one delegated click handler, so links and triggers added at any time are handled.'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Scrolling with intent',
    heading: heading('Every jump,', 'landed precisely.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
