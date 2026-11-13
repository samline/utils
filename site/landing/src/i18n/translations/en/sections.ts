import { demoFiles } from '../../../../../shared/lib/demo-files'
import { project } from '../../../../../shared/lib/project.mjs'
const text = (value: string) => [{ kind: 'text' as const, value }]
const heading = (prefix: string, accent: string) => [
  { kind: 'text' as const, value: prefix + ' ' },
  { kind: 'emphasis' as const, value: accent },
]
const code = (filename: string, source: string, language: 'html' | 'javascript' | 'bash') => ({
  filename,
  code: source,
  language,
})
const source = await demoFiles
export default {
  hero: {
    // The document <title> for Home: a descriptive phrase, never the bare package name.
    seoTitle: 'Package websites and documentation',
    // 70–160 characters; package.json descriptions are often shorter.
    seoDescription: project.description,
    kicker: 'Small library. Clear purpose.',
    title: project.name,
    titleAccent: 'Make the first step easy.',
    description: project.description,
    // Sibling voice: one-sentence description, then three concrete actions.
    descriptionContinuation: 'Install it, try a working example, then read the complete reference.',
    footnotes: ['One clear purpose', 'JavaScript & TypeScript', `${project.license} licensed`],
    compatibilityLabel: 'Describe only verified compatibility',
    platforms: ['Supported environments', 'Actual integrations', 'Real constraints'],
  },
  features: {
    eyebrow: '01 / More than the basics',
    title: 'Thoughtful by default.',
    titleAccent: 'Clear in every detail.',
    items: {
      dependencies: {
        title: 'The problem it solves',
        description: text('Explain a concrete problem and show the result.'),
      },
      accessibility: {
        title: 'Accessibility responsibilities',
        description: text(
          'Describe what the package provides and what the application must supply.'
        ),
      },
      lifecycle: {
        title: 'A clear lifecycle',
        description: text('Document initialization, updates and cleanup where applicable.'),
      },
      entrypoints: {
        title: 'Supported integrations',
        description: text('Show actual exports and supported environments.'),
      },
      frameworks: {
        title: 'Fits your workflow',
        description: text('Describe integrations verified against the package.'),
      },
      markup: {
        title: 'Useful examples',
        description: text('Replace neutral demos with real, runnable package recipes.'),
      },
    },
  },
  runtimes: {
    eyebrow: '02 / Fit it into your stack',
    heading: heading('Two ways in.', 'One clear API.'),
    description:
      'Replace each instructional entry with verified distribution and integration information.',
    items: {
      main: {
        label: 'Package',
        entrypoint: project.npmName,
        description: 'Document the primary package import and its supported exports.',
      },
      vanilla: {
        label: 'Browser',
        entrypoint: 'Client integration',
        description: 'Verify browser support and client initialization requirements.',
      },
      browser: {
        label: 'Ownership',
        entrypoint: 'Lifecycle',
        description: 'Explain who owns the instance and releases resources.',
      },
      global: {
        label: 'Delivery',
        entrypoint: 'Script / CDN',
        description: 'Include this alternative only if a standalone build actually exists.',
      },
      core: {
        label: 'Types',
        entrypoint: 'Public declarations',
        description: 'Inventory real public types and their roles.',
      },
      style: {
        label: 'Styles',
        entrypoint: 'Stylesheet requirements',
        description: 'State whether the package needs CSS and how to load it.',
      },
    },
  },
  gettingStarted: {
    eyebrow: '03 / From install to result',
    heading: heading('One install.', 'One working result.'),
    integrationDescription:
      'The neutral example illustrates the template. Replace it with the shortest supported package integration.',
    integrationLabel: 'Read the installation guide',
    steps: { install: 'Install', markup: 'Add markup', initialize: 'Initialize' },
    installLabel: 'Installation method',
    installTabs: [],
    fullExampleLabel: 'Copy complete working files',
    markupDescription:
      'Keep the original content readable. Introduce only markup required by the actual package.',
    examples: {
      markup: code('index.html', source.markup, 'html'),
      script: code('main.js', source.files[2].code, 'javascript'),
    },
    docs: {
      description: 'Continue with configuration and lifecycle details when you need them.',
      label: 'Explore the configuration reference',
    },
  },
  recipes: {
    eyebrow: '04 / After the first result',
    title: 'Keep the basics simple.',
    titleAccent: 'Grow from there.',
    description:
      'Use these shapes for distinct, verified package use cases. The neutral starter code is plain browser JavaScript.',
    examplesLabel: 'Explore working examples',
    items: [
      {
        title: 'Start with one interaction',
        context: 'First integration',
        docsRoute: 'setup' as const,
        docsLabel: 'Read the first steps',
        description: text('Explain the purpose and initial state before showing the code.'),
        code: code('main.js', source.files[2].code, 'javascript'),
      },
      {
        title: 'Keep the source understandable',
        context: 'Content and state',
        docsRoute: 'examples' as const,
        docsLabel: 'Explore example files',
        description: text('Separate markup, styling and behavior without duplicating the runtime.'),
        code: code('index.html', source.markup, 'html'),
      },
      {
        title: 'Explain ownership',
        context: 'Lifecycle',
        docsRoute: 'lifecycle' as const,
        docsLabel: 'Read configuration and ownership',
        description: text('Replace this note with the package’s real update and cleanup contract.'),
        code: code('main.js', source.files[2].code, 'javascript'),
      },
    ],
  },
  faq: {
    eyebrow: '05 / Before you build',
    heading: heading('A few details.', 'Clearly answered.'),
    items: {
      docs: {
        question: text('Where is the full documentation?'),
        answer: text(
          'The documentation includes installation, examples, configuration, API reference and release notes. Replace starter prose with verified package information.'
        ),
      },
      copy: {
        question: text('Can I copy the examples?'),
        answer: text(
          'The neutral example works without a dependency. Copy separate files or a complete document; replace it with a real package integration before launch.'
        ),
      },
      changes: {
        question: text('How are changes documented?'),
        answer: text(
          'Keep one authoritative changelog and clearly label breaking changes. Update examples, references and package integration skills with releases.'
        ),
      },
    },
  },
  callToAction: {
    eyebrow: 'A clear start goes a long way',
    heading: heading('Make the next step', 'a clear one.'),
    description: 'Try a working example or follow the first steps.',
    docs: {
      description: 'Guides, reference and verified release notes, in one place.',
      label: 'Read the documentation',
    },
  },
} as const
