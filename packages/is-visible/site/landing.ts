import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const markup = `<img data-src="photo.jpg" alt="A mountain lake" width="640" height="400" />`

const script = `import { isVisible } from '@samline/is-visible'

isVisible('img[data-src]', {
  once: true,
  rootMargin: '0px 0px 200px 0px',
  visible: (entry, image) => {
    image.src = image.dataset.src
  },
})`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Visibility callbacks for many elements',
    seoDescription:
      'Know when elements enter and leave the viewport, on shared IntersectionObservers, for vanilla JS, React, Vue, Svelte and plain HTML.',
    kicker: 'See it. React to it.',
    title: identity.name,
    titleAccent: 'Know what is on screen.',
    description:
      'Run code when elements enter or leave the viewport, for one element or a whole selector, on observers shared across your page.',
    descriptionContinuation: 'Install it, scroll the live preview, then read the full reference.',
    footnotes: ['About 1 KB gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'Works with',
    platforms: ['Vanilla JS', 'TypeScript', 'React', 'Vue', 'Svelte', 'Plain HTML'],
  },
  features: {
    eyebrow: '01 / More than an observer',
    title: 'One call per idea.',
    titleAccent: 'Not one per element.',
    items: {
      dependencies: {
        title: 'Any target',
        description: text(
          'Pass an element, a selector, a NodeList or an array. One cleanup stops them all.'
        ),
      },
      accessibility: {
        title: 'Content never stuck hidden',
        description: text(
          'Without IntersectionObserver every element is reported visible once, so reveal effects degrade to visible content.'
        ),
      },
      lifecycle: {
        title: 'Honest transitions',
        description: text(
          'visible fires once per entry and notVisible only after the element was visible: no false "left" events on load.'
        ),
      },
      entrypoints: {
        title: 'Shared observers',
        description: text(
          'Calls with the same root, rootMargin and threshold share one IntersectionObserver that disconnects when unused.'
        ),
      },
      frameworks: {
        title: 'Idiomatic adapters',
        description: text(
          'useIsVisible for React and Vue, an action and stores for Svelte, and a VisibilityObserver component.'
        ),
      },
      markup: {
        title: 'Safe on the server',
        description: text(
          'No DOM access at import time. Without a DOM every call returns a no-op cleanup.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('One package.', 'Every runtime.'),
    description: 'The root entry covers vanilla JavaScript; adapters are subpaths.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'isVisible and observeVisibility as ESM or CommonJS.',
      },
      vanilla: {
        label: 'React',
        entrypoint: `${identity.npmName}/react`,
        description: 'useIsVisible and the VisibilityObserver component.',
      },
      browser: {
        label: 'Vue',
        entrypoint: `${identity.npmName}/vue`,
        description: 'useIsVisible and the VisibilityObserver component.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.isVisible',
        description: 'A classic script for pages without a build step.',
      },
      core: {
        label: 'Svelte',
        entrypoint: `${identity.npmName}/svelte`,
        description: 'useIsVisible stores and createVisibilityAction.',
      },
      style: {
        label: 'Types',
        entrypoint: 'IsVisibleOptions',
        description: 'Typed options and callbacks, no CSS required.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and watch',
    heading: heading('One install.', 'Lazy images.'),
    integrationDescription: 'Load each image when it is 200px from entering the viewport.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Add markup', initialize: 'Watch the images' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription: 'Keep the real URL in data-src. Width and height avoid layout shifts.',
    examples: {
      markup: code('index.html', markup, 'html'),
      script: code('main.js', script, 'javascript'),
    },
    docs: {
      description: 'Continue with roots, thresholds and the fallback behaviour.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond lazy images',
    title: 'Same call, new jobs.',
    titleAccent: 'Pause, scope, clean up.',
    description: 'Three common jobs built on the same call.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Pause media off-screen',
        context: 'inOut',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Play a video while half of it is visible and pause it when it leaves.'),
        code: code(
          'main.js',
          `isVisible(video, {\n  inOut: true,\n  threshold: 0.5,\n  visible: () => video.play(),\n  notVisible: () => video.pause(),\n})`,
          'javascript'
        ),
      },
      {
        title: 'Observe inside a scroll box',
        context: 'root',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text(
          'Track items against their own scroll container instead of the viewport.'
        ),
        code: code(
          'main.js',
          `isVisible(list.children, { root: list, visible: (entry, item) => item.classList.add('seen') })`,
          'javascript'
        ),
      },
      {
        title: 'Clean up on teardown',
        context: 'cleanup',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Every call returns one function that stops observing all its elements.'),
        code: code(
          'main.js',
          `const stop = isVisible('.card', { visible })\n// later\nstop()`,
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
        question: text('Why does notVisible not fire on page load?'),
        answer: text(
          'Since 1.0, notVisible only fires after an element was visible. An element that starts off-screen is simply not visible yet.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/browser/is-visible.global.js with a classic script tag and call window.isVisible. Pin the version in production.'
        ),
      },
      changes: {
        question: text('What changed in 1.0?'),
        answer: text(
          'Shared observers, selector and list targets, (entry, element) callbacks, top-level root, rootMargin and threshold, and a fallback for old browsers. The changelog lists every change.'
        ),
      },
      extra1: {
        question: text('Can I observe elements inside a scroll container?'),
        answer: text(
          'Yes. Pass the container as root; rootMargin and threshold apply to it instead of the viewport.'
        ),
      },
      extra2: {
        question: text('How do I fire before an element scrolls in?'),
        answer: text(
          "Use a positive bottom rootMargin, for example '0px 0px 200px 0px', to start loading 200px early."
        ),
      },
      extra3: {
        question: text('Is there a React hook?'),
        answer: text(
          'Yes. useIsVisible from @samline/is-visible/react returns { ref, isVisible, entry }; attach ref to the element. VisibilityObserver wraps it as a component.'
        ),
      },
      extra4: {
        question: text('Does it create one observer per element?'),
        answer: text(
          'No. Calls with the same root, rootMargin and threshold share one IntersectionObserver, which disconnects when it watches nothing.'
        ),
      },
      extra5: {
        question: text('What happens in browsers without IntersectionObserver?'),
        answer: text(
          "With the default fallback every element is reported visible once, so content revealed by your code is never left hidden. Use fallback: 'none' to do nothing instead."
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Only what is on screen',
    heading: heading('Do the work', 'when it is seen.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
