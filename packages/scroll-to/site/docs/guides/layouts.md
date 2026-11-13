---
title: Layouts
description: Use @samline/scroll-to with fixed headers, skip links, scroll containers, horizontal tab strips, history and reduced motion.
locale: en
sidebar:
  group: guides
  order: 1
---

## Fixed headers

Pass the header as the offset. Its height is measured on every scroll, so a header that shrinks or wraps still clears:

```js
autoScrollTo({ offset: '#header' })
```

With an offset, links from other pages that land on `#section` are aligned once the page loads (`initialHash`). For jumps the script does not handle, such as the browser's find-in-page or `:target` navigation without JavaScript, also set CSS:

```css
html {
  scroll-padding-top: 5rem;
}
```

## Skip links and focus

Links move focus to their target on arrival, so keyboard and screen reader users continue from there. A skip link needs nothing else:

```html
<a class="skip" href="#main">Skip to content</a>
<main id="main">…</main>
```

Targets that cannot take focus get `tabindex="-1"`. To hide the focus ring on them, style `[tabindex='-1']:focus { outline: none; }`.

## Scroll containers

When a panel scrolls instead of the page, pass it as `container`, in code or on the trigger:

```html
<button type="button" data-scroll-to="#step-3" data-scroll-to-container="#wizard">Step 3</button>
```

The offset and the alignment are measured inside the container.

## Horizontal strips

Center the selected tab, chip or slide without moving the page:

```js
scrollTo(tab, { container: tabs, inline: 'center', block: 'nearest' })
```

`block: 'nearest'` keeps the vertical position unless the strip is cut off.

## History

Links push their `#id` like a native jump, so Back returns to the previous section. Use `hash: 'replace'` to update the address without history entries, or `hash: false` to leave it alone.

## Reduced motion

When the visitor prefers reduced motion, every scroll jumps at once. The promise still resolves to `true`, and focus and the hash still change.
