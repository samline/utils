import type { LandingFactory } from '../../../site/landing/src/i18n/kit'

const markup = `<button type="button" data-theme-toggle>Dark mode</button>`

const script = `import { createTheme } from '@samline/theme'

// Style [data-theme='dark'] in your CSS.
createTheme()`

const landing: LandingFactory = ({ identity, text, heading, code }) => ({
  hero: {
    seoTitle: 'Dark mode and themes without a flash on load',
    seoDescription:
      'Light, dark and system themes applied before the first paint, with a remembered choice, live system changes, other tabs and accessible controls.',
    kicker: 'Dark mode, done once.',
    title: identity.name,
    titleAccent: 'Themes that never flash.',
    description:
      'The stored theme is on the page before it paints, follows the system while visitors want it to, and stays in sync across tabs and controls.',
    descriptionContinuation: 'Install it, try the live preview, then read the full reference.',
    footnotes: ['About 1.8 KB gzip', 'Zero dependencies', `${identity.license} licensed`],
    compatibilityLabel: 'ONE SMALL SCRIPT. RIGHT AT HOME IN YOUR STACK.',
    platforms: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte', 'Shopify', 'WordPress'],
  },
  features: {
    eyebrow: '01 / More than a class toggle',
    title: 'The switch is easy.',
    titleAccent: 'The rest is not.',
    items: {
      dependencies: {
        icon: 'zap',
        title: 'No flash on load',
        description: text(
          'A classic script in the head, or a small inline snippet for SSR, writes the theme before the first paint.'
        ),
      },
      accessibility: {
        icon: 'accessibility',
        title: 'Accessible controls',
        description: text(
          'Buttons get aria-pressed, radios are checked and selects show the mode, with no extra code.'
        ),
      },
      lifecycle: {
        icon: 'monitor',
        title: 'Follows the system',
        description: text(
          'In system mode, a change in the operating system appearance updates the page at once.'
        ),
      },
      entrypoints: {
        icon: 'tabs',
        title: 'Every tab agrees',
        description: text(
          'A choice made in one tab reaches the others, and broken storage never throws.'
        ),
      },
      frameworks: {
        icon: 'palette',
        title: 'Your themes, your CSS',
        description: text(
          'Any number of named themes, as data-theme or a class, with color-scheme and theme-color set for you.'
        ),
      },
      markup: {
        icon: 'pause',
        title: 'No animated switch',
        description: text(
          'Transitions pause while the theme changes, so the page swaps at once instead of fading every element.'
        ),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('One script tag.', 'Or one function.'),
    description: 'Your CSS stays in charge: the package only writes the theme name.',
    items: {
      main: {
        label: 'Package',
        entrypoint: identity.npmName,
        description: 'createTheme and themeScript as ESM or CommonJS.',
      },
      vanilla: {
        label: 'Controller',
        entrypoint: 'createTheme(options)',
        description: 'mode, theme, set, toggle, subscribe and destroy.',
      },
      browser: {
        label: 'SSR head',
        entrypoint: 'themeScript(options)',
        description: 'An inline snippet for your server-rendered head.',
      },
      global: {
        label: 'HTML / CDN',
        entrypoint: 'window.Theme',
        description: 'A classic script for the head that applies at once.',
      },
      core: {
        label: 'Controls',
        entrypoint: 'data-theme-*',
        description: 'Buttons, radios, toggles and selects, without code.',
      },
      style: {
        label: 'Styling',
        entrypoint: 'Your CSS variables',
        description: 'Style [data-theme] or a class; no stylesheet ships.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / Install and switch',
    heading: heading('One button.', 'One call.'),
    integrationDescription: 'Add a remembered dark mode to any page, without a flash.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Add a control', initialize: 'Start it' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription:
      'A data-theme-toggle button switches dark mode and reports it with aria-pressed. Inline themeScript() in the head too, so the theme is on the page before it paints.',
    examples: {
      markup: code('index.html', markup, 'html'),
      script: code('main.js', script, 'javascript'),
    },
    docs: {
      description: 'Continue with every option, custom themes and server rendering.',
      label: 'Explore the options',
    },
  },
  recipes: {
    eyebrow: '04 / Beyond light and dark',
    title: 'One controller.',
    titleAccent: 'Every kind of theme.',
    description: 'Three common jobs, without touching storage or media queries yourself.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Light, dark or system',
        context: 'data-theme-set',
        docsRoute: 'options' as const,
        docsLabel: 'Read the options',
        description: text('A three-way picker in plain HTML.'),
        code: code(
          'index.html',
          `<button type="button" data-theme-set="light">Light</button>\n<button type="button" data-theme-set="system">System</button>\n<button type="button" data-theme-set="dark">Dark</button>`,
          'html'
        ),
      },
      {
        title: 'Server-rendered pages',
        context: 'themeScript',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Inline the snippet in your head.'),
        code: code(
          'head.js',
          `import { themeScript } from '@samline/theme'\n\nconst head = \`<script>\${themeScript()}</script>\``,
          'javascript'
        ),
      },
      {
        title: 'React to changes',
        context: 'subscribe',
        docsRoute: 'api' as const,
        docsLabel: 'Read the API',
        description: text('Repaint a chart when the theme changes.'),
        code: code(
          'main.js',
          `import { createTheme } from '@samline/theme'\n\nconst theme = createTheme()\ntheme.subscribe(({ theme }) => chart.setTheme(theme))`,
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
        question: text('Why does the page flash light before going dark?'),
        answer: text(
          'The theme was applied after the page painted. Load the browser script in the head without defer or async, or inline themeScript() there, so the theme is written first.'
        ),
      },
      copy: {
        question: text('Does it work without a bundler?'),
        answer: text(
          'Yes. Load dist/browser/theme.global.js in the head; it applies the theme and handles data-theme-* controls. Options go on the script tag, or add data-manual and call Theme.auto(). Pin the version in production.'
        ),
      },
      header: {
        question: text('What does system mode do?'),
        answer: text(
          'It follows prefers-color-scheme and updates live when the visitor changes it. Choosing light or dark stops following it until system is chosen again.'
        ),
      },
      observer: {
        question: text('Can I have more than two themes?'),
        answer: text(
          'Yes. Pass any theme names; each can have a theme-color for the browser UI. color-scheme is only set for light and dark, and the toggle always switches between light and dark.'
        ),
      },
      changes: {
        question: text('Can I theme only part of a page?'),
        answer: text(
          'Yes. Pass target to write the theme on a widget instead of <html>, scope to limit which controls it listens to, and its own storageKey so it does not share the page choice.'
        ),
      },
      smooth: {
        question: text('What if storage is blocked?'),
        answer: text(
          'The theme still works for the page; it is just not remembered. Set storageKey: false to never store it.'
        ),
      },
      nojs: {
        question: text('What happens without JavaScript?'),
        answer: text(
          'Your default CSS applies. Style the system preference with a prefers-color-scheme media query if you want dark without JavaScript too.'
        ),
      },
      dynamic: {
        question: text('Do controls added later work?'),
        answer: text(
          'Yes. Clicks and changes are delegated, so controls added at any time work, and every control is synced again on each change.'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'Themes with care',
    heading: heading('Every visit,', 'the right theme.'),
    description: 'Try the examples or follow the first steps.',
    docs: {
      description: 'Guides, the complete API and release notes, in one place.',
      label: 'Read the documentation',
    },
  },
})

export default landing
