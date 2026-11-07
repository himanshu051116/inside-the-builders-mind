# V14.5 — CSS delivery and accessibility QA

V14.5 continues the 73-item V14 roadmap. **47/73 verified locally.**

### Code changes

- 347 apparently unreferenced CSS rules removed from source-owned modules, with audit ledger `CSS_REMOVAL_AUDIT.json`.
- All four previous production CSS requests consolidated into one dependency-free `portfolio.css` build, keeping editable, readable source modules.
- Conservative CSS minifier added to `scripts/minify-css.mjs`: respects quoted strings, `calc()` whitespace and selector combinators.
- Dark-theme persistent navigation contrast improved; reduced-motion transitions remain disabled in relevant controls.
- Added six regression tests for bundled CSS, source cleanup, safety, evidence assets and color-scoped styles.

### Benchmarks (CSS transfer size only)

| Measurement | V14.4 | V14.5 | Difference |
| --- | ---: | ---: | ---: |
| CSS HTTP assets | 4 | 1 | −3 requests |
| CSS bytes | 212,050 | 178,829 | −15.7% |
| CSS gzip bytes (summed) | 51,642 | 39,762 | −23.0% |
| Automated source tests | 95 | 101 | +6 tests |

These results do not imply measured loading-speed improvements on the production Vercel domain.

### Browser checks

- 15/15 responsive checks over 3 roles × 5 widths; no page overflow or browser errors in the inline Chromium harness.
- 12/12 semantic, target-size and 320 CSS-pixel reflow smoke checks; nav foreground contrast (Software/ML) >= 13:1 against the tested solid dark header background.
- Six baseline V14.4-to-cleaned CSS snapshots were pixel-identical before deliberate navigation-color corrections.
- No full axe, screen-reader, deployed-browser, actual browser-zoom or field performance audit was run.

### Release policy

Local development package only. Live Vercel remains V13. No GitHub push, Vercel preview/production deployment or AWS operation was carried out.
