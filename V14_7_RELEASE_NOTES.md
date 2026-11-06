# V14.7 — Accessibility and Motion Hardening

Status: local development build only. Neither GitHub nor Vercel nor AWS has been changed.

## Changed
- Corrected a stale hardcoded **16 captures** label in the search palette. The label now derives from the real evidence registry (currently 20).
- Search palette: keyboard Arrow Up/Down, Home/End navigation across current filtered actions; focus restores on close; filtered result count announces through an ARIA live region.
- Improved light-theme small brand subtitle readability (10px, stronger foreground color).
- Added optional offscreen suspension for decorative infinite CSS animations using IntersectionObserver. Motion resumes when visible and honors reduced-motion. Interaction state, user-triggered events and simulated playback remain unaffected.
- Added six source tests (`tests/v14-7.test.mjs`) and expanded browser checks.

## Acceptance
- 111/111 automated tests after build
- Production build, asset audit and metadata audit passed
- 15 role/viewport responsive checks at 320, 390, 768, 1366, 1440 CSS pixels
- 12 semantic/tap-target spot checks (320, 390, 768, 1440)
- Search palette focus, filtered search, arrow/Home/End, Escape and zero-result behavior tested at 390 and 1440 CSS pixels
- Offscreen-motion pause/recovery and `prefers-reduced-motion` branch tested in Chromium
- No observed JavaScript errors or horizontal overflow in those sampled views

## Important qualifications
- V14-065 is the sole newly verified checklist item: 49/73 completed locally, 24 outstanding.
- V14-055, 056, 058, 059 still require broader contrast/zoom/axe/screen reader evaluations.
- V14-016 remains blocked: EarthBridge needs an actual executed query showing ranked retrieved images and ground-truth context.
- V14-018 is not complete: publication authorization and a complete sensitivity inspection are still needed.
- V14-032–038 and 060 remain open until an explicitly authorized preview is hosted and audited; Core Web Vitals have not been measured.
- Neither Vercel production nor AWS deployment was modified.
