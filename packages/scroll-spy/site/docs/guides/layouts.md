---
title: 'Layouts and containers'
titleAccent: 'containers'
description: Use @samline/scroll-spy with sticky headers, scroll containers, smooth scrolling, nested tables of contents and long navigations.
locale: en
sidebar:
  group: guides
  order: 2
---

## Sticky headers

Put the activation line below the header, and let the browser land clicked sections below it too:

```css
html {
  scroll-padding-top: 5rem; /* the header height plus a little room */
}
```

```html
<nav data-scroll-spy data-scroll-spy-offset="96">…</nav>
```

The line must be at or below where clicked sections land (`scroll-padding-top`), or a clicked section would not count as reached. The default, 25% of the viewport, is below most headers.

## Scroll containers

When the sections scroll inside a panel instead of the page, pass the panel as `root`. The offset is measured from the panel's top:

```js
scrollSpy('#toc', { root: document.querySelector('.panel'), offset: 40 })
```

Links to `#id` still jump inside the panel without JavaScript.

## Smooth scrolling

Use CSS `scroll-behavior: smooth` on the scrolling element (respect reduced motion), or scroll with your own script. Either way, the clicked link stays active until scrolling has been quiet for 150ms. Clicks whose default you prevent still count, so a scripted scroll keeps the link steady too.

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

## Nested tables of contents

Nest lists as deep as you like; every link is watched and only the deepest section crossing the line is active. To highlight the parent of an active child, use `:has()`:

```css
.toc li:has(> ul [aria-current]) > a {
  color: var(--text);
}
```

## Long navigations

When the navigation scrolls itself (a sidebar with `overflow: auto`), the active link is centered in it as the reader moves on. Only the navigation scrolls, never the page. Turn it off with `followActive: false` or `data-scroll-spy-follow="false"`.

## Content that changes

`autoScrollSpy` picks up navigations that are added or removed. When links or sections change inside a watched navigation (sections loaded later, a filtered list), call `refresh()` on its spy, or restart the automatic run with `ScrollSpy.auto()`.
