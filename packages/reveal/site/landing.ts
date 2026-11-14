import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const markup = `<ul data-reveal-stagger="80">
  <li data-reveal>Fast</li>
  <li data-reveal>Typed</li>
  <li data-reveal="zoom">Tiny</li>
</ul>`

const script = `import '@samline/reveal/style.css'
import { autoReveal } from '@samline/reveal'

autoReveal()`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Scroll reveal animations without the flash',
    seoDescription:
      'Scroll reveals with CSS effects, cascades, repeat and a CSS-only scrub mode. Content in view on load is never hidden, and stays visible without JavaScript.',
    kicker: 'Reveal on scroll. Never flash.',
    title: identity.name,
    titleAccent: 'Motion that respects the page.',
    description:
      'Add data-reveal and content fades, slides, zooms or blurs in as it scrolls into view, in cascade when it enters together.',
    descriptionContinuation: 'Install it, scroll the live preview, then read the full reference.',
    footnotes: ['About 2.9 KB gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'ONE SMALL SCRIPT. RIGHT AT HOME IN YOUR STACK.',
    platforms: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte', 'Shopify', 'WordPress'],
  },
  features: {
    eyebrow: '01 / More than a fade-in',
    title: 'Only what is below the fold.',
    titleAccent: 'Nothing else moves.',
    items: {
      dependencies: {
        icon: 'zap',
        title: 'No flash on load',
        description: text(
          'Elements already in view, or above it, are never hidden, so the first paint and anchor links stay intact.'
        ),
      },
      accessibility: {
        icon: 'shield',
        title: 'Safe by default',
        description: text(
          'Without JavaScript, with reduced motion or when printing, every element is visible. The CSS only hides what the script marked.'
        ),
      },
      lifecycle: {
        icon: 'list',
        title: 'Cascades in order',
        description: text(
          'Items that enter together are delayed one after another in document order, per data-reveal-stagger container.'
        ),
      },
      entrypoints: {
        icon: 'repeat',
        title: 'Repeat or once',
        description: text(
          'Reveal once by default, or hide again on leaving with data-reveal-repeat so it plays on every entry.'
        ),
      },
      frameworks: {
        icon: 'sliders',
        title: 'Scrub with CSS only',
        description: text(
          'data-reveal-scrub ties the effect to the scroll position with animation-timeline: view(), no script running.'
        ),
      },
      markup: {
        icon: 'brush',
        title: 'Your styles win',
        description: text(
          'Every rule uses :where(), and effects use translate and scale, so your own transform is never overwritten.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('Attributes first.', 'Script when you need it.'),
    description: 'Configure with attributes or options; one stylesheet holds every effect.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'reveal and autoReveal as ESM or CommonJS.',
      },
      vanilla: {
        label: 'Elements',
        entrypoint: 'reveal(target, options)',
        description: 'Reveal a selector, element or list; returns a cleanup.',
      },
      browser: {
        label: 'Whole page',
        entrypoint: 'autoReveal(options)',
        description: 'Every [data-reveal], including content added later.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.Reveal',
        description: 'A classic script that starts on its own.',
      },
      core: {
        label: 'Effects',
        entrypoint: 'up · down · left · right · fade · zoom · blur',
        description: 'Picked with the value of data-reveal.',
      },
      style: {
        label: 'Stylesheet',
        entrypoint: '@samline/reveal/style.css',
        description: 'Effects, timing variables and the scrub mode.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and reveal',
    heading: heading('One stylesheet.', 'One call.'),
    integrationDescription: 'Reveal a list in cascade as it scrolls into view.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Add attributes', initialize: 'Start revealing' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription:
      'Mark elements with data-reveal and cascade a container with data-reveal-stagger.',
    examples: {
      markup: code('index.html', markup, 'html'),
      script: code('main.js', script, 'javascript'),
    },
    docs: {
      description: 'Continue with every attribute, option and CSS variable.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond a fade',
    title: 'Timing in attributes.',
    titleAccent: 'Effects in CSS.',
    description: 'Three common jobs, without writing a single keyframe.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Slower, further, later',
        context: 'data-reveal-*',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Set duration, delay and distance per element.'),
        code: code(
          'index.html',
          `<h2 data-reveal="left" data-reveal-duration="900" data-reveal-distance="3rem">\n  Slides in from the right\n</h2>`,
          'html'
        ),
      },
      {
        title: 'Play on every entry',
        context: 'repeat',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Hide again on leaving and reveal on the way back.'),
        code: code('main.js', `reveal('.stat', { effect: 'zoom', repeat: true })`, 'javascript'),
      },
      {
        title: 'Your own easing',
        context: 'CSS variables',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Theme every effect from any ancestor.'),
        code: code(
          'style.css',
          `.hero {\n  --reveal-duration: 1s;\n  --reveal-easing: cubic-bezier(0.16, 1, 0.3, 1);\n}`,
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
        question: text('Why is content in view on load not animated?'),
        answer: text(
          'Hiding it would flash the first paint and move content the visitor is already reading. Only elements that start below the fold are hidden until they enter; with repeat, elements above the viewport are hidden too, so they play on the way back.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/style.css and dist/browser/reveal.global.js; it reveals every [data-reveal] on its own. Add data-manual to the script tag to start it yourself with Reveal.auto(). Pin the version in production.'
        ),
      },
      changes: {
        question: text('How do I change the speed or the distance?'),
        answer: text(
          'Per element with data-reveal-duration, data-reveal-delay and data-reveal-distance, per call with the same options, or for the whole site with the --reveal-duration, --reveal-easing, --reveal-distance, --reveal-scale and --reveal-blur CSS variables.'
        ),
      },
      noscript: {
        question: text('What happens without JavaScript?'),
        answer: text(
          'Everything is visible. The stylesheet only hides elements whose data-reveal-state the script set to pending, so a failed or blocked script never leaves a blank page.'
        ),
      },
      motion: {
        question: text('How is reduced motion handled?'),
        answer: text(
          'With prefers-reduced-motion: reduce, nothing is hidden or animated, and turning the preference on while browsing shows hidden content at once.'
        ),
      },
      dynamic: {
        question: text('Does it see content added later?'),
        answer: text(
          'autoReveal and the CDN script watch the page, so elements added by AJAX, infinite scroll or page swaps are revealed and removed elements are released.'
        ),
      },
      scrub: {
        question: text('Which browsers support scrub?'),
        answer: text(
          'Browsers with scroll-driven animations (animation-timeline: view()). Elsewhere, scrub elements simply stay visible.'
        ),
      },
      transform: {
        question: text('Will it break my transforms?'),
        answer: text(
          'No. Effects use the individual translate, scale and filter properties, and the transition only exists while revealing, so your transform and transitions keep working.'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Motion, kept polite',
    heading: heading('Reveal what is next,', 'not what is there.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
