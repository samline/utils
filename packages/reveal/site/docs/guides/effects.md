---
title: 'Effects and timing'
titleAccent: 'timing'
description: Tune the built-in @samline/reveal effects, write your own starting point in CSS, cascade groups and replay elements on every entry.
locale: en
sidebar:
  group: guides
  order: 2
---

## Tune an effect

Every effect starts from a hidden state and transitions to the element's normal style. Change how far, how long and how it eases with attributes or custom properties:

```html
<h2 data-reveal="left" data-reveal-distance="3rem" data-reveal-duration="900">Title</h2>
```

```css
.hero {
  --reveal-duration: 1s;
  --reveal-easing: cubic-bezier(0.16, 1, 0.3, 1);
  --reveal-scale: 0.8; /* zoom */
  --reveal-blur: 16px; /* blur */
}
```

## Your own starting point

Elements waiting to enter have `data-reveal-state="pending"`. Style that state to change where an effect starts. The stylesheet uses `:where()`, so your rule wins without `!important`:

```css
.card[data-reveal-state='pending'] {
  opacity: 0;
  translate: 0 2rem;
  scale: 0.9;
  filter: saturate(0);
}
```

During the reveal, the stylesheet transitions `opacity`, `translate`, `scale` and `filter`. To animate other properties, add them while revealing:

```css
.card[data-reveal-state='pending'] {
  rotate: -4deg;
}
.card[data-reveal-state='revealing'] {
  transition-property: opacity, translate, scale, filter, rotate;
}
```

Effects use the individual `translate`, `scale` and `filter` properties, never `transform`, so an element's own `transform` keeps working.

## Cascades

Put `data-reveal-stagger` on a container to delay each element that enters together with the others, in document order:

```html
<ul data-reveal-stagger="80">
  <li data-reveal>First, no delay</li>
  <li data-reveal>Second, 80ms</li>
  <li data-reveal data-reveal-delay="100">Third, 100ms + 160ms</li>
</ul>
```

The cascade adds to each element's own delay. Elements that enter in different frames are not delayed, so content scrolled in one by one appears right away. Without a container, the `stagger` option cascades the elements of one call.

## Replay on every entry

`data-reveal-repeat` (or `repeat: true`) hides an element again when it leaves, and reveals it each time it comes back, from either direction. Elements above the viewport on load are hidden too, so they play on the way back up.

```js
reveal('.stat', {
  effect: 'zoom',
  repeat: true,
  onReveal: stat => stat.classList.add('is-counting'),
  onHide: stat => stat.classList.remove('is-counting'),
})
```

## When reveals start

By default a reveal starts 64px before the element enters (`rootMargin: '0px 0px 64px 0px'`), so it is moving by the time it is visible. To wait until part of it is in view, shrink the root or raise the threshold:

```js
autoReveal({ rootMargin: '0px 0px -10% 0px', threshold: 0.2 })
```

Inside a scroll container, pass it as `root`.
