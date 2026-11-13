# @samline/reveal

## 1.0.0

### Major Changes

- First release: `reveal` and `autoReveal` reveal elements as they scroll into view with seven CSS effects (`up`, `down`, `left`, `right`, `fade`, `zoom`, `blur`), cascades per `data-reveal-stagger` container, `repeat`, per-element duration, delay and distance, and a CSS-only scrub mode on `animation-timeline: view()`. Content in view on load is never hidden; without JavaScript, with reduced motion or when printing, everything stays visible. ESM, CommonJS, `style.css` and a browser global (`window.Reveal`) that starts on its own.
