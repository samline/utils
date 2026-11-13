import behaviorSource from './demo-behavior.js?raw'
import demo, {
  scenarios,
  loadingModes,
  type DemoMode,
  type DemoPreset,
} from '../i18n/translations/en/demo'
import { project } from './project.mjs'

export type { DemoMode }

const escape = (value: string) =>
  value.replace(
    /[&<>"]/g,
    character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]!
  )

/** The exact behavior region from demo-behavior.js, without its `export`. */
export const behaviorFor = (preset: DemoPreset) => {
  const name = scenarios[preset].behavior
  const match = behaviorSource.match(
    new RegExp(`// #region ${name}\\n([\\s\\S]*?)// #endregion ${name}`)
  )
  if (!match) throw new Error(`demo-behavior.js has no #region ${name}`)
  return match[1].replace(/^export /m, '').trim()
}

export const htmlFor = (preset: DemoPreset) => {
  const item = scenarios[preset]
  const { field } = item
  const choice =
    'choice' in item
      ? `
  <label for="${item.choice.id}">${escape(item.choice.label)}</label>
  <select id="${item.choice.id}">
${item.choice.choices.map(([value, label]) => `    <option value="${escape(value)}"${value === item.choice.initial ? ' selected' : ''}>${escape(label)}</option>`).join('\n')}
  </select>`
      : ''
  return `<section class="demo-scenario" aria-labelledby="${field.id}-title">
  <h1 id="${field.id}-title">${escape(item.title)}</h1>${choice}
  <label for="${field.id}">${escape(field.label)}</label>
  <input
    id="${field.id}"
    type="text"
    inputmode="${field.inputmode}"
    autocomplete="off"
    placeholder="${escape(field.placeholder)}"
    value="${escape(field.value)}"
  >
  <dl aria-live="polite">
${item.readouts.map(readout => `    <dt>${escape(readout.label)}</dt>\n    <dd><output data-readout="${readout.id}">${demo.empty}</output></dd>`).join('\n')}
  </dl>
</section>`
}

export const stylesFor = (_preset?: DemoPreset) => `.demo-scenario {
  display: grid;
  gap: 0.5rem;
  max-width: 28rem;
  padding: 1.5rem;
  border: 0.0625rem solid #c6bdcf;
  border-radius: 1rem;
  font: 1rem/1.6 system-ui, sans-serif;
}
.demo-scenario h1 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}
.demo-scenario label {
  font-weight: 600;
}
.demo-scenario input,
.demo-scenario select {
  padding: 0.75rem 0.875rem;
  border: 0.0625rem solid #8f8499;
  border-radius: 0.5rem;
  font: inherit;
}
.demo-scenario select {
  cursor: pointer;
}
.demo-scenario input:focus-visible,
.demo-scenario select:focus-visible {
  outline: 0.125rem solid ${project.accentLight};
  outline-offset: 0.125rem;
}
.demo-scenario dl {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.25rem 1rem;
  margin: 0.5rem 0 0;
}
.demo-scenario dd {
  margin: 0;
  font-family: ui-monospace, monospace;
  overflow-wrap: anywhere;
}`

export const javascriptFor = (preset: DemoPreset, mode: DemoMode = 'esm') => {
  const item = scenarios[preset]
  const importLine = loadingModes[mode].importLine
  const choice = 'choice' in item ? item.choice : null
  return [
    ...(importLine ? [importLine, ''] : []),
    behaviorFor(preset),
    '',
    `const field = document.querySelector('#${item.field.id}')`,
    ...(choice ? [`const choice = document.querySelector('#${choice.id}')`] : []),
    "const outputs = document.querySelectorAll('[data-readout]')",
    '// One controller removes every listener when the page is really left.',
    'const lifecycle = new AbortController()',
    'const { signal } = lifecycle',
    '',
    'const update = () => {',
    `  const result = ${item.behavior}(field.value${choice ? ', choice.value' : ''})`,
    '  for (const output of outputs) output.value = result[output.dataset.readout]',
    '}',
    '',
    "field.addEventListener('input', update, { signal })",
    ...(choice ? ["choice.addEventListener('change', update, { signal })"] : []),
    "window.addEventListener('pagehide', event => {",
    '  if (!event.persisted) lifecycle.abort()',
    '}, { signal })',
    'update()',
  ].join('\n')
}
