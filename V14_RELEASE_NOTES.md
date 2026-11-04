# Inside the Builder's Mind V14 — Development milestone 1

V14 keeps the 73-task acceptance criteria in `V14_PROGRESS.md`. 29 tasks are marked locally verified; the rest remain open.

## Implemented
- Recruiter-first introduction and compact, accessible role buttons.
- One primary case-study CTA and one secondary role-specific résumé CTA.
- Genuine OHS and NewsSources screenshots as the lead project evidence.
- Source-backed EarthBridge evaluation panel — not represented as a model-results screenshot.
- Direct links that reveal detailed project notes; source evidence appears before the expanded gallery.
- Optional Interactive Lab for simulations and explanatory experiments.
- V14 scoped styling, shared tokens and explicitly loaded DM Sans/Space Grotesk fonts with fallbacks.
- Redacted Mulyankan history/overview proposal details; regenerated WebP assets and SHA-256 manifest.
- Redesigned three ATS-readable public PDF résumés, with ~10.2–10.3 pt main text and working embedded PDF link annotations.
- Default all-projects grid rather than relying on swipe interaction.

## Verification in this release
- `npm test`: 70/70 passed.
- `npm run build`: passed.
- `npm run audit:local`: passed, 0 reminders.
- Headless Chromium inline-hosted browser emulation at widths 320, 390, 768, 1366 and 1440 for all three modes: 15/15; no horizontal overflow or JS exceptions.
- One-click case-study deep link and optional Interactive Lab behavior checked.
- 3 public résumé PDFs: 1 page each, fonts and link annotations inspected; visual render review.

## NOT yet completed
- EarthBridge genuine evaluation screenshots, exact metrics, independent model validation.
- Current external URLs, canonical SchoolBuddies site and live preview availability not checked.
- Live Vercel browser verification, measured Core Web Vitals, formal WCAG AA testing and screen-reader acceptance.
- Legacy stylesheet cleanup and comprehensive accessibility refactoring.
- GitHub/Vercel/AWS writes: **none**.
