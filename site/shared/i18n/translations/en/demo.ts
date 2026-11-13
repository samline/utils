import { project } from '../../../lib/project.mjs'

/**
 * One typed catalog owns every demo scenario. Home tabs, the Examples gallery,
 * the Docs examples guide and the generated HTML / CDN and Package / ESM files
 * all render from these records, so the live preview and the copied code share
 * their field, choice, readouts and samples.
 *
 * The three scenarios below are neutral template infrastructure (plain string
 * transforms with no dependency). An adaptation replaces them with one record
 * per distinct package task, chosen from a capability inventory, and replaces
 * shared/lib/demo-behavior.js with calls to the real public API.
 */
export interface ScenarioChoice {
  readonly id: string
  readonly label: string
  readonly initial: string
  readonly choices: readonly (readonly [value: string, label: string])[]
}

export interface Scenario {
  /** Short tab and navigation label. */
  readonly tab: string
  /** The visitor's task, used as the Examples section heading. */
  readonly title: string
  readonly description: string
  /** One practical detail shown under the preview. */
  readonly hint: string
  /** The real API call shown inside the panel, e.g. `format(value, 'phone', { country })`. */
  readonly call?: string
  /** Exported function in shared/lib/demo-behavior.js that computes every readout. */
  readonly behavior: 'slug' | 'limit' | 'textCase'
  readonly field: {
    readonly id: string
    readonly label: string
    readonly value: string
    readonly placeholder: string
    readonly inputmode: 'text' | 'numeric' | 'decimal' | 'tel' | 'email'
  }
  readonly choice?: ScenarioChoice
  /** Ordered outputs; keys match the behavior's returned object. */
  readonly readouts: readonly { readonly id: string; readonly label: string }[]
  readonly samples: readonly {
    readonly label: string
    readonly value: string
    readonly choice?: string
  }[]
}

export const scenarios = {
  slug: {
    tab: 'Slug',
    title: 'Turn an article title into a URL slug',
    description:
      'Accents, punctuation and repeated spaces collapse into one readable path segment as you type.',
    hint: 'Neutral template scenario: plain JavaScript with no dependency. Replace it with a real package task.',
    behavior: 'slug',
    field: {
      id: 'article-title',
      label: 'Article title',
      value: 'Café opening hours, 2026!',
      placeholder: 'Type a title',
      inputmode: 'text',
    },
    choice: {
      id: 'separator',
      label: 'Separator',
      initial: '-',
      choices: [
        ['-', 'Hyphen (-)'],
        ['_', 'Underscore (_)'],
      ],
    },
    readouts: [
      { id: 'slug', label: 'Slug' },
      { id: 'length', label: 'Characters' },
    ],
    samples: [
      { label: 'Long title', value: '  Ten   tips for faster, calmer releases  ' },
      { label: 'Underscores', value: 'Quarterly report — Q3', choice: '_' },
    ],
  },
  limit: {
    tab: 'Character limit',
    title: 'Count a message against a character limit',
    description:
      'The counter reports used and remaining characters, and says clearly when the text is over the limit.',
    hint: 'Neutral template scenario: emoji count as one character because the count uses code points.',
    behavior: 'limit',
    field: {
      id: 'message',
      label: 'Message',
      value: 'Doors open at nine. Bring your ticket.',
      placeholder: 'Type a message',
      inputmode: 'text',
    },
    choice: {
      id: 'limit',
      label: 'Limit',
      initial: '40',
      choices: [
        ['40', '40 characters'],
        ['80', '80 characters'],
        ['140', '140 characters'],
      ],
    },
    readouts: [
      { id: 'used', label: 'Used' },
      { id: 'remaining', label: 'Remaining' },
    ],
    samples: [
      {
        label: 'Over the limit',
        value: 'This message is deliberately longer than forty characters.',
      },
      { label: 'Emoji', value: 'See you there 🎉', choice: '80' },
    ],
  },
  textCase: {
    tab: 'Text case',
    title: 'Change the case of a heading',
    description:
      'Switch between sentence, title, upper and lower case without retyping the original text.',
    hint: 'Neutral template scenario: the original field value is never modified; only the result changes.',
    behavior: 'textCase',
    field: {
      id: 'heading',
      label: 'Heading',
      value: 'release notes for the spring update',
      placeholder: 'Type a heading',
      inputmode: 'text',
    },
    choice: {
      id: 'case',
      label: 'Case',
      initial: 'title',
      choices: [
        ['sentence', 'Sentence case'],
        ['title', 'Title Case'],
        ['upper', 'UPPER CASE'],
        ['lower', 'lower case'],
      ],
    },
    readouts: [{ id: 'result', label: 'Result' }],
    samples: [
      { label: 'Shouting', value: 'PLEASE READ BEFORE INSTALLING', choice: 'sentence' },
      { label: 'Lower case', value: 'Getting Started With The API', choice: 'lower' },
    ],
  },
} as const satisfies Record<string, Scenario>

export type DemoPreset = keyof typeof scenarios
export const presetIds = Object.keys(scenarios) as DemoPreset[]
/** Home tabs: one representative scenario per distinct task. */
export const homePresets = ['slug', 'limit', 'textCase'] as const satisfies readonly DemoPreset[]

/**
 * Loading modes for copied files. `importLine` provides the identifiers the
 * behavior code uses; the template's neutral behavior has no dependency, so both
 * are null. An adaptation sets, for example,
 * `import { format } from '${npmName}'` and `const { format } = window.Formatter`.
 * HTML / CDN is offered only when project.config.json names a real cdnScript.
 */
export const loadingModes = {
  cdn: {
    label: 'HTML / CDN',
    importLine: null as string | null,
    note: 'Save these files in one folder and open index.html. The CDN script loads before main.js; no build step is needed.',
  },
  esm: {
    label: 'Package / ESM',
    importLine: null as string | null,
    note: project.template
      ? 'Template scenario with no dependency. Serve the folder with any static server (module scripts do not run from file://). An adaptation adds the real package import here.'
      : `Install ${project.npmName} and serve these files with your bundler or dev server. The package import replaces the CDN script.`,
  },
}
export type DemoMode = keyof typeof loadingModes
export const demoModes: readonly DemoMode[] = project.delivery.cdnScript ? ['cdn', 'esm'] : ['esm']

export default {
  label: `${project.name} studio`,
  previewTagline: 'Live preview',
  tabs: homePresets.map(id => ({ id, label: scenarios[id].tab })),
  empty: '—',
  samplesLabel: 'Try a value',
  reset: 'Reset',
  noscript:
    'Enable JavaScript to update the preview as you type. The example source files remain readable below.',
  openCode: 'Explore the code',
  modeLabel: 'Loading mode',
  copyComplete: 'Copy the complete example',
} as const
