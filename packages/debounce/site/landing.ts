import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const searchMarkup = `<label for="search">Search</label>
<input id="search" type="search" autocomplete="off" />
<p id="status">Type to search.</p>`

const searchScript = `import { debounce } from '@samline/debounce'

const input = document.querySelector('#search')
const status = document.querySelector('#status')

const search = debounce(query => {
  status.textContent = query ? \`Searching for “\${query}”…\` : 'Type to search.'
}, 300)

input.addEventListener('input', () => search(input.value))`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Debounce, throttle and rafThrottle',
    seoDescription:
      'Debounce, throttle and rafThrottle for JavaScript with cancel, flush and pending, React, Vue and Svelte adapters and a browser global.',
    kicker: 'Fewer calls. Same result.',
    title: identity.name,
    titleAccent: 'Call less, do more.',
    description:
      'Debounce input, throttle work and run layout code once per frame with one small, dependency-free package.',
    descriptionContinuation: 'Install it, try the live counter, then read the full reference.',
    footnotes: ['764 B gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'ONE SMALL SCRIPT. RIGHT AT HOME IN YOUR STACK.',
    platforms: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte', 'Shopify', 'WordPress'],
  },
  features: {
    eyebrow: '01 / More than a timer',
    title: 'Control every call.',
    titleAccent: 'Not just delay it.',
    items: {
      dependencies: {
        icon: 'sliders',
        title: 'Three tools, one API',
        description: text(
          'debounce waits for quiet, throttle keeps a steady rate and rafThrottle runs once per animation frame.'
        ),
      },
      accessibility: {
        icon: 'clock',
        title: 'Cancel, flush and pending',
        description: text(
          'Drop a pending call when a dialog closes, run it now on submit, or check whether one is scheduled.'
        ),
      },
      lifecycle: {
        icon: 'curve',
        title: 'Predictable edges',
        description: text(
          'leading, trailing and maxWait follow the well-known lodash semantics, with this and the last result forwarded.'
        ),
      },
      entrypoints: {
        icon: 'shield',
        title: 'Safe everywhere',
        description: text(
          'Invalid waits become 0 and rafThrottle falls back to a timer without requestAnimationFrame, so SSR never throws.'
        ),
      },
      frameworks: {
        icon: 'branches',
        title: 'Idiomatic adapters',
        description: text(
          'React hooks, Vue composables and a Svelte store keep the latest callback and cancel on unmount.'
        ),
      },
      markup: {
        icon: 'feather',
        title: 'Tiny and measured',
        description: text(
          'Every entry point has a gzip budget checked in CI. The core is under 1 KB.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('One package.', 'Every runtime.'),
    description: 'Import only what you need: the root entry tree-shakes, adapters are subpaths.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'debounce, throttle and rafThrottle as ESM or CommonJS.',
      },
      vanilla: {
        label: 'React',
        entrypoint: `${identity.npmName}/react`,
        description: 'useDebouncedCallback, useThrottledCallback and useDebouncedValue.',
      },
      browser: {
        label: 'Vue',
        entrypoint: `${identity.npmName}/vue`,
        description: 'useDebouncedCallback, useThrottledCallback and useDebouncedRef.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.Debounce',
        description: 'A classic script for pages without a build step.',
      },
      core: {
        label: 'Svelte',
        entrypoint: `${identity.npmName}/svelte`,
        description: 'createDebouncedStore with flush and cancel.',
      },
      style: {
        label: 'Types',
        entrypoint: 'DebouncedFunction',
        description: 'Typed options and returned functions, no CSS required.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and debounce',
    heading: heading('One install.', 'One quieter input.'),
    integrationDescription:
      'Debounce a search field so the request runs once the user stops typing.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Add markup', initialize: 'Debounce the handler' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription: 'A field and a status line. No special attributes are required.',
    examples: {
      markup: code('index.html', searchMarkup, 'html'),
      script: code('main.js', searchScript, 'javascript'),
    },
    docs: {
      description: 'Continue with leading, trailing, maxWait and the returned controls.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond search',
    title: 'Pick the right tool.',
    titleAccent: 'Keep the call count low.',
    description: 'Three common jobs, each with the right tool.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Submit without waiting',
        context: 'flush()',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Run the pending search immediately when the form is submitted.'),
        code: code(
          'main.js',
          `form.addEventListener('submit', () => search.flush())`,
          'javascript'
        ),
      },
      {
        title: 'Autosave at a steady pace',
        context: 'throttle',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Save at most once per second while the user keeps typing.'),
        code: code(
          'main.js',
          `const save = throttle(() => persist(editor.value), 1000)\neditor.addEventListener('input', save)`,
          'javascript'
        ),
      },
      {
        title: 'Measure once per frame',
        context: 'rafThrottle',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Coalesce scroll events into one layout read per animation frame.'),
        code: code(
          'main.js',
          `const update = rafThrottle(() => bar.style.width = progress() + '%')\nwindow.addEventListener('scroll', update, { passive: true })`,
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
        question: text('When should I use throttle instead of debounce?'),
        answer: text(
          'Use debounce when only the final value matters, like search. Use throttle when the work must keep happening during a burst, like autosave or progress updates.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/browser/debounce.global.js with a classic script tag and use window.Debounce. Pin the version in production.'
        ),
      },
      changes: {
        question: text('What changed in 1.0?'),
        answer: text(
          'throttle, rafThrottle and pending() are new, debounce forwards this, maxWait is clamped to wait and the Svelte store fixes chained updates. The changelog lists every change.'
        ),
      },
      extra1: {
        question: text('Is there a React hook?'),
        answer: text(
          'Yes. useDebouncedCallback and useThrottledCallback from @samline/debounce/react return a stable function that always calls the latest callback and cancels on unmount; useDebouncedValue debounces a value.'
        ),
      },
      extra2: {
        question: text('How do I stop a pending call when a component or dialog closes?'),
        answer: text(
          'Call cancel() on the returned function. The React, Vue and Svelte adapters do it for you on unmount or scope disposal.'
        ),
      },
      extra3: {
        question: text('Does the debounced function return a value?'),
        answer: text(
          'It returns the result of the last invocation, and flush() returns the result of the call it runs. Before the first invocation the result is undefined.'
        ),
      },
      extra4: {
        question: text('Is it safe to import during server rendering?'),
        answer: text(
          'Yes. Nothing touches the DOM at import time, and rafThrottle falls back to a 16 ms timer when requestAnimationFrame does not exist.'
        ),
      },
      extra5: {
        question: text('How big is it?'),
        answer: text(
          'The root entry is under 1 KB gzip and has no dependencies. Every entry point has a size budget checked in CI.'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Fewer calls, less work',
    heading: heading('Make every call', 'count.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
