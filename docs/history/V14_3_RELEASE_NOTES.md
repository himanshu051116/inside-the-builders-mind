# V14.3 — Accessibility and Metadata Maintenance

Based on local V14.2 source (production remains V13).

- Added V14.3 small-text/touch-target/focus polish with no new client-side dependency.
- Repaired narrow project-state labels and inline source links identified by Chromium inspection.
- Improved Full-Stack eyebrow contrast on the light background.
- Preloads only initial flagship image, not all three role visuals.
- Role-specific social share cards now have matching descriptions, image alt, dimensions and Twitter image meta.
- New `npm run audit:metadata` verifies share-page markup, 1200×630 PNG headers, sitemap and JSON-LD.
- 90/90 tests, 15/15 responsive checks, 29/29 feature checks, 36/36 keyboard checks, build and local asset audit pass.
- Sampled visible controls below 24px: 0 across three role views at 390px and 1440px.
- WCAG certification, real social crawlers, real hosted-browsing and full zoom/screen-reader tests are pending.
- No GitHub, Vercel or AWS changes made.
