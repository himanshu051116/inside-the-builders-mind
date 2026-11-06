# V14.8 — Accessibility and Reflow Refinements

- Continued the V14 checklist from 49/73 to **50/73 locally verified** (V14-056).
- Added `v14-8.css` to the single compiled stylesheet. It improves focus visibility, Windows High Contrast selected states, and dark-theme instructional labels.
- Corrected initial ML-role preload to use the author-supplied **EarthBridge evaluation screenshot**. Reported metrics are static repository figures, not live inference.
- Made the `<main>` skip-link destination programmatically focusable.
- Tests: 116/116; build/audits passed; sampled Chromium reflow checks 15/15 without clipping, under-24px visible controls or JS exceptions.
- Publication unchanged. The full WCAG contrast, axe and assistive screen-reader audits, hosted performance testing and the genuine EarthBridge ranked query remain blocked/open.

## Release safety

This ZIP is **not** a production acceptance certificate. Keep V13 production unchanged until V14 preview QA is approved. Do not publish privately identifying records or invite codes.
