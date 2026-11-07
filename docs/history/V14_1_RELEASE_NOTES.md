# V14.1 — Canonical engineering dossiers (local development release)

This release continues the existing V14 checklist, without replacing the V13 live website.

## Feature changes

- Four comprehensive, source-grounded project case studies. Each includes constraint/failure mode, engineering choice, trade-off, inspection steps, expected test behavior, limits, and exact repository links.
- NewsSources includes a concrete tested scenario: reclaim expired crawling lease and reject stale writer. This is evidence of a written integration test; the database-backed test itself has not been executed in the portfolio environment.
- Case readers expand across the available desktop width and wrap long test identifiers on narrow screens.
- Cross-project Evidence Desk moved behind an optional disclosure to reduce duplicate navigation routes.
- Removed duplicate case-note source-link row.
- Per-project broken-image recovery now navigates to a corresponding repository instead of incorrectly opening Mulyankan for any project.

## Verification

- `npm test`: **76/76 passing**.
- `npm run build`: **passed**.
- `npm run audit:local`: **passed, zero reminders**; outbound URLs were not network-checked.
- Inline-browser Chromium: 15 mode/viewport checks across 1440,1366,768,390,320 px; no horizontal overflow, JavaScript exceptions or hero image failures.
- Dossier inspection: NewsSources record visible at 1440px and 390px, with three source-link controls; full width on desktop.
- Missing-image recovery: four project-specific fallbacks checked.

## Honest limitations

- No live V14/V14.1 preview or deployment was created. Existing V13 production is unchanged.
- No remote PostgreSQL integration test was executed.
- Real EarthBridge output is still unavailable; the site only links genuine evaluation code.
- Screenshot authorization, external URL HTTP health, live-hosted browser testing, screen readers, formal WCAG tests and production performance measurements remain pending.
- Vercel confirms SchoolBuddies project aliases exist and deployment is READY; direct public URL reachability has not been independently established here.

The task tracker is `V14_PROGRESS.md` and the machine-readable state is `V14_STATUS.json`.
