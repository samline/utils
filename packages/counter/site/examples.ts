// Copyable files load the published browser bundle (window.Counter starts on
// its own); the previews in examples/*.astro import the package itself.
export default [
  {
    id: 'stats',
    tab: 'Stats band',
    title: 'Count a stats band when it scrolls in',
    description:
      'The HTML holds the final values, so they read correctly without JavaScript. Each number counts once, when half of it is visible, with the decimals of its target.',
    files: {
      html: `<div id="page">
  <p class="spacer">Scroll down</p>
  <dl class="stats">
    <div><dt>Customers</dt><dd><span data-counter="12480">12,480</span></dd></div>
    <div><dt>Uptime</dt><dd><span data-counter="99.95">99.95</span>%</dd></div>
    <div><dt>Countries</dt><dd>+<span data-counter="42">42</span></dd></div>
  </dl>
</div>`,
      css: `#page { height: 16rem; overflow-y: auto; padding: 1rem; border: 1px solid #ccc; }
.spacer { min-height: 20rem; margin: 0; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr)); gap: 1rem; margin: 0; }
dd { margin: 0; font-size: 2rem; font-weight: 600; font-variant-numeric: tabular-nums; }`,
      js: `// The box scrolls instead of the page, so pass it as the root.
// Called before the DOM is ready, this replaces the automatic start.
Counter.auto({ root: document.querySelector('#page') })`,
    },
  },
  {
    id: 'locales',
    tab: 'Locales',
    title: 'Currencies and number formats per language',
    description:
      'Without data-counter, the final value is read from the text in the language of the element. Intl.NumberFormat options add currencies, and grouping follows the locale.',
    files: {
      html: `<ul class="prices">
  <li lang="en-US"><span id="usd">$1,234.50</span> en-US</li>
  <li lang="de-DE"><span class="plain">1.234.567,89</span> de-DE</li>
  <li lang="fr-FR"><span class="plain">1 234 567</span> fr-FR</li>
  <li lang="en-IN"><span class="plain">12,34,567</span> en-IN</li>
</ul>`,
      css: `.prices { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.prices span { display: inline-block; min-width: 9rem; font-size: 1.5rem; font-variant-numeric: tabular-nums; }`,
      js: `Counter.counter('#usd', { format: { style: 'currency', currency: 'USD' } })
Counter.counter('.plain')`,
    },
  },
  {
    id: 'repeat',
    tab: 'Repeat',
    title: 'Count down, and again on every visit',
    description:
      'data-counter-from larger than the target counts down. data-counter-repeat resets the number when it leaves and counts again when it comes back.',
    files: {
      html: `<div id="page">
  <p class="spacer">Scroll down, then back up</p>
  <p class="row"><span data-counter="0" data-counter-from="10" data-counter-repeat data-counter-easing="linear">0</span> seconds left</p>
  <p class="row"><span data-counter="365" data-counter-repeat data-counter-duration="1200">365</span> days a year</p>
</div>`,
      css: `#page { height: 16rem; overflow-y: auto; padding: 1rem; border: 1px solid #ccc; }
.spacer { min-height: 20rem; margin: 0; }
.row span { font-size: 2rem; font-weight: 600; font-variant-numeric: tabular-nums; }`,
      js: `Counter.auto({ root: document.querySelector('#page') })`,
    },
  },
]
