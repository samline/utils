import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const markup = `<nav data-scroll-spy aria-label="On this page">
  <a href="#install">Install</a>
  <a href="#usage">Usage</a>
</nav>

<section id="install">…</section>
<section id="usage">…</section>`

const script = `import { autoScrollSpy } from '@samline/scroll-spy'

autoScrollSpy()`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Scroll spy for tables of contents and one-page menus',
    seoDescription:
      'Highlight the navigation link of the section in view with aria-current, keep clicked links steady while scrolling, and follow along in long tables of contents.',
    kicker: 'Know where the reader is.',
    title: identity.name,
    titleAccent: 'The right link, lit at the right time.',
    description:
      'Add data-scroll-spy to a navigation and the link of the section being read gets aria-current, in the page or any scroll container.',
    descriptionContinuation: 'Install it, scroll the live preview, then read the full reference.',
    footnotes: ['About 2.4 KB gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'Works with',
    platforms: ['Vanilla JS', 'TypeScript', 'Any framework', 'Plain HTML', 'Docs and blogs'],
  },
  features: {
    eyebrow: '01 / More than an observer',
    title: 'The section you read.',
    titleAccent: 'Not the one passing by.',
    items: {
      dependencies: {
        title: 'One activation line',
        description: text(
          'A section is active once its top crosses a line at 25% of the view, so short and very tall sections both behave.'
        ),
      },
      accessibility: {
        title: 'aria-current built in',
        description: text(
          'The active link gets aria-current="true", which screen readers announce and your CSS can target, with an optional class.'
        ),
      },
      lifecycle: {
        title: 'Steady on click',
        description: text(
          'A clicked link lights up at once and stays lit while the page scrolls to it, instead of flickering through every section on the way.'
        ),
      },
      entrypoints: {
        title: 'The end is reachable',
        description: text(
          'At the bottom of the page the last section in view becomes active, even when it is too short to reach the line.'
        ),
      },
      frameworks: {
        title: 'Long tables of contents',
        description: text(
          'When the navigation scrolls itself, the active link is kept in view by scrolling the navigation, never the page.'
        ),
      },
      markup: {
        title: 'Any scroll container',
        description: text(
          'Watch the page or a scrolling panel with root, and optionally keep the URL hash in sync without history entries.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('Links first.', 'Script when you need it.'),
    description: 'Your navigation stays plain links that work without JavaScript.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'scrollSpy and autoScrollSpy as ESM or CommonJS.',
      },
      vanilla: {
        label: 'One navigation',
        entrypoint: 'scrollSpy(nav, options)',
        description: 'Returns { active, refresh, destroy }.',
      },
      browser: {
        label: 'Whole page',
        entrypoint: 'autoScrollSpy(options)',
        description: 'Every [data-scroll-spy], including navigations added later.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.ScrollSpy',
        description: 'A classic script that starts on its own.',
      },
      core: {
        label: 'Changes',
        entrypoint: 'onChange({ id, section, links })',
        description: 'React to the active section, for progress bars or analytics.',
      },
      style: {
        label: 'Styling',
        entrypoint: '[aria-current]',
        description: 'No stylesheet: style the active link your way.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and follow',
    heading: heading('One attribute.', 'One call.'),
    integrationDescription: 'Highlight the table of contents entry of the section in view.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Mark the navigation', initialize: 'Start watching' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription: 'Plain links to the ids of your sections, inside a [data-scroll-spy] element.',
    examples: {
      markup: code('index.html', markup, 'html'),
      script: code('main.js', script, 'javascript'),
    },
    docs: {
      description: 'Continue with every option, the activation line and scroll containers.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond a highlight',
    title: 'Plain links.',
    titleAccent: 'Precise state.',
    description: 'Three common jobs, without measuring a single section yourself.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Below a sticky header',
        context: 'offset',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Move the activation line under your header.'),
        code: code('index.html', `<nav data-scroll-spy data-scroll-spy-offset="96">…</nav>`, 'html'),
      },
      {
        title: 'Style it your way',
        context: 'aria-current',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Target the active link from CSS.'),
        code: code(
          'style.css',
          `nav a[aria-current] {\n  color: var(--accent);\n  border-inline-start-color: currentColor;\n}`,
          'css'
        ),
      },
      {
        title: 'Reading progress',
        context: 'onChange',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Show where the reader is, outside the navigation.'),
        code: code(
          'main.js',
          `scrollSpy('#toc', {\n  onChange: ({ section }) => {\n    label.textContent = section?.querySelector('h2')?.textContent ?? ''\n  },\n})`,
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
        question: text('When is a section active?'),
        answer: text(
          'When its top has crossed the activation line, 25% down the viewport by default, and it is the last one that has. Before the first section nothing is active; at the bottom of the page, the last section in view is.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/browser/scroll-spy.global.js; it watches every [data-scroll-spy] on its own. Add data-manual to the script tag to start it yourself with ScrollSpy.auto(). Pin the version in production.'
        ),
      },
      changes: {
        question: text('How are releases documented?'),
        answer: text(
          'CHANGELOG.md is the single release history and is published in the docs. Breaking and behavior changes are called out explicitly.'
        ),
      },
      header: {
        question: text('I have a sticky header. What offset do I use?'),
        answer: text(
          'Anything below the header works, for example data-scroll-spy-offset="96" for a 80px header. Also set scroll-padding-top on html so clicked sections land below it.'
        ),
      },
      observer: {
        question: text('Why not IntersectionObserver?'),
        answer: text(
          'Thresholds misreport very tall and very short sections. scroll-spy reads section positions once per frame while scrolling, which stays cheap and always agrees with what the reader sees.'
        ),
      },
      smooth: {
        question: text('Does it work with smooth scrolling?'),
        answer: text(
          'Yes, with CSS scroll-behavior or your own scripted scroll. Clicks whose default you prevent still lock the link until scrolling settles.'
        ),
      },
      nojs: {
        question: text('What happens without JavaScript?'),
        answer: text(
          'The navigation is plain links, so it still jumps to each section. Only the highlight is missing.'
        ),
      },
      dynamic: {
        question: text('Does it see navigations added later?'),
        answer: text(
          'autoScrollSpy and the CDN script watch the page for new navigations. When links or sections change inside one, call refresh().'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Navigation that follows',
    heading: heading('Show where they are,', 'every step of the way.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
