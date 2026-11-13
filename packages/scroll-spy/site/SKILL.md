---
name: scroll-spy
description: Use @samline/scroll-spy to highlight the navigation link of the section in view, for tables of contents, docs sidebars and one-page menus, in vanilla JS, any framework or plain HTML.
package-version: '1.0.0'
---

# @samline/scroll-spy

Build against the installed version; this skill describes 1.0.0.

- **Install:** `npm install @samline/scroll-spy`. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/scroll-spy@1.0.0/dist/browser/scroll-spy.global.js`; it watches every `[data-scroll-spy]` on its own (`data-manual` on the script tag, then `ScrollSpy.auto(options)`, to pass options). No stylesheet.
- **Markup:** a navigation of plain `#id` links with `data-scroll-spy`; sections need matching ids. Attributes on the navigation: `data-scroll-spy-offset` (px or `%`), `-class`, `-lock="false"`, `-follow="false"`, `-hash`.
- **Script:** `autoScrollSpy(options)` (also picks up navigations added later; returns `{ refresh, destroy }`), or `const spy = scrollSpy(nav, { offset, root, links, ariaCurrent, activeClass, lockOnClick, followActive, updateHash, onChange })` returning `{ active, refresh, destroy }`.
- **Semantics:** active = last section whose top crossed the line (25% of the view by default); none before the first; last in view at the page bottom. Active links get `aria-current="true"`; style `a[aria-current]`. Clicked links stay active until scrolling settles, also when you `preventDefault()` and scroll with JS.
- **Layouts:** set `offset` below sticky headers and `scroll-padding-top` on html; pass `root` for scroll containers; call `refresh()` after links or sections change.
- **Do not** compute active sections with your own IntersectionObserver beside it, toggle `aria-current` yourself, or call `scrollSpy` on navigations `autoScrollSpy` already handles.
