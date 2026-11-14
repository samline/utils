import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const markup = `<p>
  <span data-counter="12480">12,480</span> customers
</p>`

const script = `import { autoCounter } from '@samline/counter'

autoCounter()`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Animated number counters that keep the real value',
    seoDescription:
      'Count numbers up as they scroll into view, with easing, decimals and Intl formatting. The final value stays in the HTML for search and visitors without JS.',
    kicker: 'Count up. Keep the number.',
    title: identity.name,
    titleAccent: 'Numbers that land on the truth.',
    description:
      'Add data-counter to a number and it counts up when it scrolls into view, formatted for the language of the page.',
    descriptionContinuation: 'Install it, watch the live preview, then read the full reference.',
    footnotes: ['About 3 KB gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'ONE SMALL SCRIPT. RIGHT AT HOME IN YOUR STACK.',
    platforms: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte', 'Shopify', 'WordPress'],
  },
  features: {
    eyebrow: '01 / More than a loop',
    title: 'The real value first.',
    titleAccent: 'The animation second.',
    items: {
      dependencies: {
        icon: 'code',
        title: 'Final value in the HTML',
        description: text(
          'You render 12,480; the script counts to it. Search engines, screen readers and visitors without JavaScript always get the real number.'
        ),
      },
      accessibility: {
        icon: 'pause',
        title: 'Reduced motion respected',
        description: text(
          'With prefers-reduced-motion, numbers never move: the rendered value stays, and turning it on mid-count jumps to the end.'
        ),
      },
      lifecycle: {
        icon: 'globe',
        title: 'Formatted for the language',
        description: text(
          'Intl.NumberFormat with the closest lang attribute: 1.234,5 in German, 12,34,567 in India, currencies and compact notation.'
        ),
      },
      entrypoints: {
        icon: 'hash',
        title: 'Decimals that make sense',
        description: text(
          'data-counter="99.95" counts with two decimals all the way; a target written with no decimals counts in whole numbers.'
        ),
      },
      frameworks: {
        icon: 'curve',
        title: 'Time-based easing',
        description: text(
          'Counts by elapsed time, not frames, so it lasts the same on every screen, with ease-out, ease-in-out, linear or your own curve.'
        ),
      },
      markup: {
        icon: 'repeat',
        title: 'Up, down, or again',
        description: text(
          'Start from any value to count down, and data-counter-repeat counts again every time the number comes back.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('Attributes first.', 'Script when you need it.'),
    description: 'Configure with attributes or options; animateNumber works without the DOM.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'counter, autoCounter and animateNumber as ESM or CommonJS.',
      },
      vanilla: {
        label: 'Elements',
        entrypoint: 'counter(target, options)',
        description: 'Count a selector, element or list; returns a cleanup.',
      },
      browser: {
        label: 'Whole page',
        entrypoint: 'autoCounter(options)',
        description: 'Every [data-counter], including content added later.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.Counter',
        description: 'A classic script that starts on its own.',
      },
      core: {
        label: 'Any number',
        entrypoint: 'animateNumber(options)',
        description: 'The eased tween behind it, for charts, canvas or your own UI.',
      },
      style: {
        label: 'Parsing',
        entrypoint: 'parseNumber(text, locale)',
        description: 'Read 1.234,5 or $1,234.50 back into a number.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and count',
    heading: heading('One attribute.', 'One call.'),
    integrationDescription: 'Count a statistic up when it scrolls into view.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Mark the number', initialize: 'Start counting' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription: 'Render the final value and put the plain number in data-counter.',
    examples: {
      markup: code('index.html', markup, 'html'),
      script: code('main.js', script, 'javascript'),
    },
    docs: {
      description: 'Continue with every attribute, option and formatting choice.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond counting up',
    title: 'Formats in options.',
    titleAccent: 'Timing in attributes.',
    description: 'Three common jobs, without writing an animation loop.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Prices in any currency',
        context: 'format',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Pass Intl.NumberFormat options to every number.'),
        code: code(
          'main.js',
          `counter('.price', {\n  locale: 'es-MX',\n  format: { style: 'currency', currency: 'MXN' },\n})`,
          'javascript'
        ),
      },
      {
        title: 'Count down',
        context: 'data-counter-from',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Start above the target and it counts down.'),
        code: code(
          'index.html',
          `<span data-counter="0" data-counter-from="10" data-counter-easing="linear">0</span>`,
          'html'
        ),
      },
      {
        title: 'Animate a chart value',
        context: 'animateNumber',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('The same easing for anything that is not text.'),
        code: code(
          'main.js',
          `animateNumber({\n  to: 72,\n  duration: 800,\n  onUpdate: value => gauge.style.setProperty('--value', value),\n})`,
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
        question: text('Why render the final value in the HTML?'),
        answer: text(
          'So the number is right for search engines, link previews, screen readers and visitors without JavaScript. The script replaces it with the start value only when it is about to animate.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/browser/counter.global.js; it counts every [data-counter] on its own. Add data-manual to the script tag to start it yourself with Counter.auto(). Pin the version in production.'
        ),
      },
      changes: {
        question: text('Can it count currencies, percentages or compact numbers?'),
        answer: text(
          'Yes. Pass Intl.NumberFormat options as format, such as { style: \'currency\', currency: \'EUR\' } or { notation: \'compact\' }; every frame is formatted the same way. For full control, formatter(value, element) returns the text yourself.'
        ),
      },
      prefix: {
        question: text('Where do units, + and % go?'),
        answer: text(
          'Outside the counted element: +<span data-counter="42">42</span>%. For currencies and percentages formatted by Intl, use the format option instead.'
        ),
      },
      width: {
        question: text('How do I stop the text from jumping?'),
        answer: text(
          'Use font-variant-numeric: tabular-nums so every digit has the same width, and give the number an inline-block min-width if it shares a line with other text.'
        ),
      },
      when: {
        question: text('When does counting start?'),
        answer: text(
          'When half of the number is visible (threshold 0.5), in the viewport or in the scroll container you pass as root. Numbers already visible on load start right away.'
        ),
      },
      decimals: {
        question: text('How are decimals decided?'),
        answer: text(
          'From the target: data-counter="99.95" shows two decimals throughout. Set data-counter-decimals or the decimals option to change it.'
        ),
      },
      dynamic: {
        question: text('Does it see numbers added later?'),
        answer: text(
          'autoCounter and the CDN script watch the page, so numbers added by AJAX, infinite scroll or page swaps count too, and removed ones are released.'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Numbers, counted right',
    heading: heading('Count up,', 'land on the truth.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
