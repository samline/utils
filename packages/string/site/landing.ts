import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const markup = `<label for="title">Title</label>
<input id="title" type="text" />
<p>Slug: <output id="slug"></output></p>`

const script = `import { slugify } from '@samline/string'

const title = document.querySelector('#title')
const slug = document.querySelector('#slug')

title.addEventListener('input', () => {
  slug.textContent = slugify(title.value)
})`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Case conversion, slugify and text helpers',
    seoDescription:
      'camelCase, kebab-case, snake_case, Title Case, slugify, accent removal, truncate and initials for JavaScript, built on one Unicode-aware word splitter.',
    kicker: 'Every case. One splitter.',
    title: identity.name,
    titleAccent: 'Text in the shape you need.',
    description:
      'Convert between every case, build URL slugs, remove accents, truncate and get initials, with words split the same way everywhere.',
    descriptionContinuation: 'Install it, type in the live preview, then read the full reference.',
    footnotes: ['About 1.2 KB gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'ONE SMALL SCRIPT. RIGHT AT HOME IN YOUR STACK.',
    platforms: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Vue', 'Svelte', 'WordPress'],
  },
  features: {
    eyebrow: '01 / More than toUpperCase',
    title: 'One splitter.',
    titleAccent: 'Every case agrees.',
    items: {
      dependencies: {
        icon: 'scissors',
        title: 'Words split once, correctly',
        description: text(
          'XMLHttpRequest becomes XML, Http, Request; camel, Pascal, snake, kebab and any punctuation are understood the same way.'
        ),
      },
      accessibility: {
        icon: 'globe',
        title: 'Unicode and locales',
        description: text(
          'Accents and any script are kept as letters, and every function takes a locale, so Turkish İ and ı convert correctly.'
        ),
      },
      lifecycle: {
        icon: 'link',
        title: 'Slugs that read well',
        description: text(
          'slugify removes accents, transliterates ß, æ, ø, œ and ł, applies your replacements and cuts at a separator with maxLength.'
        ),
      },
      entrypoints: {
        icon: 'keyboard',
        title: 'Safe while typing',
        description: text(
          'slugify with trim: false keeps a trailing separator, so live slug fields never fight the space key.'
        ),
      },
      frameworks: {
        icon: 'type',
        title: 'Text that fits',
        description: text(
          'truncate cuts at a word boundary without splitting emoji or accents; initials builds avatar letters.'
        ),
      },
      markup: {
        icon: 'feather',
        title: 'Pure and tiny',
        description: text(
          'Pure functions with no DOM, safe on the server and in workers, about 1.2 KB gzip for everything.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('Pure functions.', 'Any runtime.'),
    description: 'No DOM access: use it in browsers, Node, workers and every framework.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'Every function as ESM or CommonJS, tree-shakeable.',
      },
      vanilla: {
        label: 'Case',
        entrypoint: 'camelCase · kebabCase · titleCase',
        description: 'camel, Pascal, kebab, snake, dot, constant, title and sentence case.',
      },
      browser: {
        label: 'Slugs',
        entrypoint: 'slugify · removeAccents',
        description: 'URL slugs and accent-free text with replacements and limits.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.SamlineString',
        description: 'A classic script for pages without a build step.',
      },
      core: {
        label: 'Text',
        entrypoint: 'truncate · initials · words',
        description: 'Shorten text, build initials or get the words themselves.',
      },
      style: {
        label: 'Types',
        entrypoint: 'SlugifyOptions',
        description: 'Typed options for every function, no CSS required.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and convert',
    heading: heading('One install.', 'One live slug.'),
    integrationDescription: 'Show the slug of a title while the user types.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Add markup', initialize: 'Convert on input' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription: 'Any input and any place to show the result.',
    examples: {
      markup: code('index.html', markup, 'html'),
      script: code('main.js', script, 'javascript'),
    },
    docs: {
      description: 'Continue with every function and its options.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond slugs',
    title: 'Every case you need.',
    titleAccent: 'Consistent everywhere.',
    description: 'Three common jobs, all built on the same word splitter.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Map API keys',
        context: 'camelCase',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Convert snake_case fields to camelCase and back.'),
        code: code(
          'main.js',
          `const toCamel = object =>\n  Object.fromEntries(Object.entries(object).map(([key, value]) => [camelCase(key), value]))`,
          'javascript'
        ),
      },
      {
        title: 'Titles in your language',
        context: 'titleCase',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('Keep short words lower case with smallWords.'),
        code: code(
          'main.js',
          `titleCase('el señor de los anillos', { smallWords: ['de', 'los'] })\n// 'El Señor de los Anillos'`,
          'javascript'
        ),
      },
      {
        title: 'Constants from labels',
        context: 'constantCase',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Turn human labels into event or enum names.'),
        code: code('main.js', `constantCase('order shipped') // 'ORDER_SHIPPED'`, 'javascript'),
      },
    ],
  },
  faq: {
    eyebrow: '05 / Before you build',
    heading: heading('A few details.', 'Clearly answered.'),
    items: {
      docs: {
        question: text('How are words detected?'),
        answer: text(
          'Any character that is not a letter or digit separates words, a lower-case letter followed by an upper-case one starts a new word, and acronyms end before their last capital (XMLHttp is XML and Http). Digits stay with their word.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/browser/string.global.js with a classic script tag and use window.SamlineString. Pin the version in production.'
        ),
      },
      changes: {
        question: text('Which locale is used for upper and lower case?'),
        answer: text(
          'The runtime\'s default locale, which can differ between your server and the browser. Pass locale, such as \'tr\' or \'de\', wherever the result must be the same everywhere; Turkish İ and ı need it.'
        ),
      },
      accents: {
        question: text('Are accents removed by the case functions?'),
        answer: text(
          'No. camelCase and the other case functions keep accents (año nuevo becomes añoNuevo). slugify and removeAccents remove them.'
        ),
      },
      slugLanguage: {
        question: text('How do I translate & or % in slugs?'),
        answer: text(
          "Pass replacements, for example { '&': 'y' } in Spanish or { '&': 'and' } in English. They apply before anything else."
        ),
      },
      typing: {
        question: text('Can I slugify while the user types?'),
        answer: text(
          'Yes. Use slugify(value, { trim: false }) on input so a trailing space becomes a separator, and slugify(value) on blur for the final value.'
        ),
      },
      emoji: {
        question: text('Does truncate split emoji or accents?'),
        answer: text(
          'No. It counts code points, so characters are never cut in half, and by default it cuts at the last whole word.'
        ),
      },
      server: {
        question: text('Can I use it on the server?'),
        answer: text(
          'Yes. Every function is pure, with no DOM access, so it works in Node, edge runtimes, workers and build scripts.'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Text, shaped once',
    heading: heading('Every case,', 'one call away.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
