import sections from './sections'
import { footerCredit } from '../../../../../shared/lib/site-identity.mjs'
import common from '../../../../../shared/i18n/translations/en/common'
import controls from '../../../../../shared/i18n/translations/en/controls'
import { project } from '../../../../../shared/lib/project.mjs'

type Named = { name: string; description: string; credit: string }

/** Navigation copy for one identity: the package, or a package of a collection. */
export const navigationFor = (project: Named) =>
  ({
    mainLabel: 'Main navigation',
    skipContent: 'Skip to content',
    mobile: {
      title: `Explore ${project.name}`,
      introduction: 'A starting point, a working example, and the details when you need them.',
      resources: 'Around the project',
      label: 'Mobile navigation',
      open: 'Open navigation menu',
      close: 'Close navigation menu',
    },
    footer: {
      description: project.description,
      label: 'Footer navigation',
      explore: 'Explore',
      project: 'Project',
      setup: 'Installation guide',
      examples: 'Working examples',
      skill: `${project.name} skill for AI agents`,
      changelog: 'Changelog',
      backToTop: 'Back to top',
      credit: footerCredit(project.credit),
    },
    items: [
      {
        href: '#features',
        label: 'Overview',
        description: 'Understand the problem and the approach.',
      },
      {
        href: '#how',
        label: 'Get started',
        description: 'Choose your setup and follow the first steps.',
      },
      {
        href: '#recipes',
        label: 'Recipes',
        description: 'Useful patterns and integration context.',
      },
      { href: '#faq', label: 'FAQ', description: 'Find the practical details.' },
      { page: 'examples', label: 'Examples', description: 'Try a preview and explore its code.' },
      {
        docsRoute: 'overview',
        label: 'Docs',
        description: 'Read guides and the complete reference.',
      },
    ],
  }) as const

/** Examples page copy for one identity. */
export const examplesFor = (project: Named) =>
  ({
    exploreAction: 'Try the example',
    installAction: 'Installation guide',
    eyebrow: 'Examples',
    title: `${project.name} examples.`,
    // Document metadata is separate from the display heading and its period.
    seoTitle: 'Examples',
    seoDescription: `Try live ${project.name} previews of distinct scenarios, then copy separate HTML, CSS and JavaScript files or one complete runnable document.`,
    accent: 'examples.',
    description:
      'Live previews of distinct scenarios, each with independently copyable files. The same demos and controls are used on Home and in Docs.',
    possibilities:
      'These examples show a few possibilities. The next ideas are yours: combine the package’s capabilities with your own content, design and interactions to create the experience your project needs.',
    guide: 'Read the example guide',
    navigation: 'Choose an example',
    accessibility: 'Keep previews readable and provide accessible controls for the real package.',
    skill: `Download the ${project.name} skill for AI agents`,
  }) as const

/** Collection mode Home: the catalog of every package (see .agents/collection-mode.md). */
export const collection = {
  seoTitle: 'Utilities, examples and documentation',
  seoDescription: project.description,
  eyebrow: 'Catalog',
  // PageTitle requires the accent to end the title; the catalog sets it on its own line.
  title: `${project.name} Pick what you need.`,
  accent: 'Pick what you need.',
  description: project.description,
  search: 'Search packages',
  searchPlaceholder: 'Search by name, purpose or tag',
  category: 'Category',
  allCategories: 'All categories',
  results: '{count} packages shown',
  empty: 'No package matches your search. Clear the search or choose another category.',
  docs: 'Docs',
  examples: 'Examples',
  version: 'Version {version}',
  highlights: '{name} highlights',
} as const

// Collection-level navigation separates package discovery from documentation.
// Examples stay on each package, reached from the Home catalog.
const collectionNavigation = {
  ...navigationFor(project),
  mobile: {
    ...navigationFor(project).mobile,
    introduction: 'Find a package, try its examples, and read its documentation.',
  },
  items: [
    { href: '#catalog', label: 'Packages', description: 'Browse every package of the collection.' },
    { docsRoute: 'overview', label: 'Docs', description: 'Guides and references per package.' },
  ],
} as const

export default {
  collection,
  sections,
  common,
  controls,
  navigation: project.mode === 'collection' ? collectionNavigation : navigationFor(project),
  examples: examplesFor(project),
} as const
