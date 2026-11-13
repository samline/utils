---
title: Scrub mode
description: Tie a @samline/reveal effect to the scroll position with a CSS scroll-driven animation, set its range and know what other browsers show.
locale: en
sidebar:
  group: guides
  order: 2
---

`data-reveal-scrub` plays the effect along the scroll position instead of on entry: halfway through the range, the element is halfway revealed, and scrolling back reverses it. It is a CSS scroll-driven animation (`animation-timeline: view()`); the script ignores these elements, so it works with the stylesheet alone.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@samline/reveal@1.0.0/dist/style.css">

<figure data-reveal="zoom" data-reveal-scrub>…</figure>
```

## Range

`--reveal-range` sets when the animation runs, as an [`animation-range`](https://developer.mozilla.org/docs/Web/CSS/animation-range) value. The default, `entry 0% entry 100%`, reveals the element while it enters the viewport.

```css
figure {
  /* Start as it enters, finish when 40% of the way through the viewport. */
  --reveal-range: entry 0% cover 40%;
}
```

The effect variables still apply: `--reveal-distance`, `--reveal-scale` and `--reveal-blur`. Durations and easing do not, because the scroll position drives the animation.

## Support

- Browsers with scroll-driven animations play the scrub.
- Other browsers, and visitors with `prefers-reduced-motion: reduce`, see the element as is.
- Inside a scroll container, the closest scrolling ancestor drives the animation.

To detect support in JavaScript, use `CSS.supports('animation-timeline: view()')`.
