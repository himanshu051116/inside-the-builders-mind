# Changelog

This changelog highlights substantive portfolio releases. Older implementation notes and QA snapshots are retained under [docs/history](docs/history/README.md), not presented as current deployment status.

## V25.5 — Compact archive close control
- Replaced the large full-width sticky archive header with a compact, right-aligned Close chip.
- Kept natural full-height scrolling, keyboard closing, and ten independently discoverable archive sections (only one open at a time).
- Preserved the original recordings, project screens, and three public résumés.

## V25.4 — Natural archive scrolling
- Removed the capped inner scrollbar from expanded archive content.
- Restored normal document scrolling and a reliable return-to-heading close behavior.

## V25.3 — Focused archive directory
- Compressed the archive to two columns on desktop and a one-column mobile directory.
- Removed accidental archive opening from pointer hover while keeping hover previews elsewhere.

## V25.2 — Smart recorded-video preview
- Added an opt-in-to-sound full-video experience and a short silent excerpt that starts when visible.
- Respected reduced motion, browser visibility, and data-saving preferences; kept the original recorded audio.
- Added a replay action to the full recording.

## V25.0–V25.1 — Navigation synchronization and evidence
- Separated temporary hover previews from committed, shareable navigation.
- Synchronized projects, roles, inspection tabs, browser history, deep links, and source-evidence navigation.
- Added expandable, source-backed engineering detail and reversible preview controls.

## V24 and earlier — Foundation
- Three career perspectives, original captures, source-grounded case studies, Evidence Desk, evidence-review workbench, and a static bundle.
- Earlier release-specific claims are historical, not proof of current real-world performance or AWS hosting.

## Deployment status

The latest tested V25.5 build is available as a [Vercel preview](https://inside-the-builders-mind-fvahtlv7c.vercel.app/). **AWS hosting has not yet been established** because the connected account explicitly restricts the required services. Do not update deployment, domain or uptime claims until verified.
