// Copyable files are complete pages that load the published browser bundle in
// <head> without defer (cdnScript.head), so the theme applies before the first
// paint and window.Theme starts on its own. The previews in examples/*.astro
// theme a box instead of this page.

// Runs before the first paint, like on a real site.
const head = { head: true } as const
const palette = `:root { --bg: #ffffff; --fg: #18181b; --card: #f4f4f5; --accent: #6b4fd8; }
[data-theme='dark'] { --bg: #18181b; --fg: #f4f4f5; --card: #27272a; --accent: #b9aee0; }
body { margin: 0; min-height: 100vh; background: var(--bg); color: var(--fg); font-family: system-ui, sans-serif; }
main { display: grid; gap: 1rem; max-width: 32rem; margin: 0 auto; padding: 2rem 1rem; }
.card { padding: 1rem; border-radius: 0.75rem; background: var(--card); }`

export default [
  {
    id: 'toggle',
    tab: 'Dark mode toggle',
    cdnScript: head,
    title: 'One button for dark mode',
    description:
      'A data-theme-toggle button switches between light and dark from the theme in effect and reports its state with aria-pressed. The choice is remembered.',
    files: {
      html: `<button type="button" class="toggle" data-theme-toggle>
  <span aria-hidden="true">◐</span> Dark mode
</button>
<div class="card">
  <h1>Hello</h1>
  <p>Reload the page: your choice stays. Change your system theme: nothing moves until you go back to it.</p>
</div>`,
      css: `${palette}
.toggle { justify-self: start; padding: 0.5rem 1rem; border: 1px solid currentColor; border-radius: 999px; background: none; color: inherit; font: inherit; cursor: pointer; }
.toggle[aria-pressed='true'] { background: var(--accent); border-color: var(--accent); color: var(--bg); }`,
      js: `// Nothing to call: the script applies the theme and handles [data-theme-toggle].`,
    },
  },
  {
    id: 'picker',
    tab: 'Light, dark or system',
    cdnScript: head,
    title: 'Let visitors follow their system',
    description:
      'Buttons with data-theme-set offer light, dark and system, a select offers the same, and both stay in sync. A themechange event reports every change.',
    files: {
      html: `<div class="group" role="group" aria-label="Theme">
  <button type="button" data-theme-set="light">Light</button>
  <button type="button" data-theme-set="system">System</button>
  <button type="button" data-theme-set="dark">Dark</button>
</div>
<label>
  Theme
  <select data-theme-select>
    <option value="system">System</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</label>
<p class="card" id="status" aria-live="polite"></p>`,
      css: `${palette}
.group { display: inline-flex; justify-self: start; border: 1px solid currentColor; border-radius: 999px; overflow: hidden; }
.group button { padding: 0.5rem 1rem; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
.group [aria-pressed='true'] { background: var(--accent); color: var(--bg); }
select { margin-left: 0.5rem; font: inherit; }`,
      js: `const status = document.querySelector('#status')
const show = ({ mode, theme }) => {
  status.textContent = mode === 'system' ? \`Following the system: \${theme}\` : \`Chosen: \${theme}\`
}

show(Theme.controller)
document.addEventListener('themechange', event => show(event.detail))`,
    },
  },
  {
    id: 'custom',
    tab: 'Custom themes',
    // The script tag names the themes, so a stored sepia applies before the first paint.
    cdnScript: {
      head: true,
      attributes: { 'data-themes': 'light dark sepia', 'data-default': 'light', 'data-attribute': 'class' },
    },
    title: 'More than light and dark',
    description:
      'Any number of named themes, written as a class. The script tag names them so a stored choice applies before the first paint, and Theme.auto adds a browser UI color for each one. color-scheme is set for light and dark only.',
    files: {
      html: `<fieldset>
  <legend>Theme</legend>
  <label><input type="radio" name="theme" data-theme-set="light" /> Light</label>
  <label><input type="radio" name="theme" data-theme-set="dark" /> Dark</label>
  <label><input type="radio" name="theme" data-theme-set="sepia" /> Sepia</label>
</fieldset>
<div class="card"><p>Radios are checked for you, and the address bar matches on mobile.</p></div>`,
      css: `:root { --bg: #ffffff; --fg: #18181b; --card: #f4f4f5; }
.dark { --bg: #18181b; --fg: #f4f4f5; --card: #27272a; }
.sepia { --bg: #f4ecd8; --fg: #433422; --card: #eadfc4; }
body { margin: 0; min-height: 100vh; background: var(--bg); color: var(--fg); font-family: Georgia, serif; }
main { display: grid; gap: 1rem; max-width: 32rem; margin: 0 auto; padding: 2rem 1rem; }
fieldset { display: flex; gap: 1rem; border-radius: 0.75rem; }
.card { padding: 1rem; border-radius: 0.75rem; background: var(--card); }`,
      js: `// Restart with the options a script tag cannot hold. The data-* options
// on the script tag still apply, so the theme on the page does not change.
Theme.auto({
  themeColor: { light: '#ffffff', dark: '#18181b', sepia: '#f4ecd8' },
})`,
    },
  },
]
