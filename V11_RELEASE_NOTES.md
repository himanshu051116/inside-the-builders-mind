# V11 — Evidence Desk release

Built as an incremental upgrade to V10. The previous deployment was **not** changed by this release build.

## Changes

- Added a source-linked, accessible, four-project **Evidence Desk** for OHS, NewsSources, Mulyankan and EarthBridge. The selected record follows the portfolio specialization automatically; users can navigate it independently with tabs or arrow keys.
- Each record now separates **engineering problem**, **decision**, **inspectable repository locations**, and **limits**. Mulyankan's genuine public screenshot is requested from its source repository, with a clickable offline fallback; other records show an explicitly *decorative source tree*, not a fabricated product capture.
- Added compact **role-specific source shortcuts** directly below the hero, pointing to shipped applications, code, technical notes or validation scripts.
- Made long-form case notes collapsible; the main Evidence Desk acts as a skimmable overview. The original detailed descriptions, project gallery and resume-aligned secondary archive remain accessible.
- Added a keyboard-accessible **Command Palette**: `Ctrl+K` / `Cmd+K`, search projects, switch specialization, jump to the Evidence Workbench, open contact, or download one of the three public résumés. `Esc` and the close button dismiss the dialog. It uses local DOM state: no remote search or analytics.
- Fixed an accessible-dialog Escape issue, a 320px header overflow, and case-specific anchor navigation that previously could point at collapsed details.
- Retained the single consolidated production stylesheet and all 3 résumé PDFs from V10; added targeted V11 regression tests.

## Local verification

- `npm test`: 52/52 passed.
- `npm run build`: passed; output is `dist/`.
- `npm run audit:local`: passed with zero reminders (links not fetched).
- Playwright/Chromium inline-source checks passed for 3 specialization modes at 320, 390, 768 and 1440px. Source tabs, expandable notes, keyboard search and 320px overflow checks were tested. These are **not real-domain tests**.

## Known limitations and interpretation

- Most of the large hero scenes are deliberately labeled browser simulations, not real application screenshots.
- Only Mulyankan has a linked genuine project capture in this release; loading that capture depends on access to the public source image endpoint. On failure, the direct source link remains visible.
- OHS needs legitimate access for private room features; NewsSources does not have a public live backend; the EarthBridge front-end demonstration uses synthetic embeddings and does **not** display measured model predictions.
- No independent Lighthouse/WCAG certificate, production end-to-end results, public API latency or ML accuracy benchmark is claimed.
- GitHub, Vercel and AWS are **unchanged**. Deploy to a Vercel preview and conduct real-hosted checks before promoting; use Amplify separately for the AWS challenge if required.
