# V26 — Navigation Core (Phase 1)

**Branch:** `design/v26-navigation-core`  
**Baseline:** `design/v25-1-preview-restore`  
**Scope:** architecture consolidation, role context memory, preserved public UI/media.

## Changes implemented

1. **Pure role-navigation session:** `v26-navigation-session.js` stores independent project, inspection panel, selected screenshot and architecture stage for Full-Stack, Software Systems and Applied ML. It has deterministic validation, immutable reads and all-or-nothing preview rollback.
2. **No synthetic role-button clicks:** `v20-workspace.js` dispatches `portfolio:apply-role-view` rather than calling `.click()` on a legacy UI button.
3. **Presentation adapter:** `career-modes.js` listens to that event and updates theme, highlighted projects, résumé presentation and role visuals without URL mutations. Legacy user clicks continue to dispatch role requests into the workspace.
4. **Source-evidence synchronization:** `v11-experience.js` updates role-specific evidence visibility on the presentation event. Project-specific source selection remains synchronized through committed navigation events; switching visual mode does not independently choose a case.
5. **One configuration:** `v26-project-data.js` provides shared role defaults, project ordering, public résumé paths, and existing explanatory architecture stages. `v207-route.js` and the workspace import from this same module.
6. **Preview fidelity:** The preview snapshot also preserves the workspace search input and role-session memory; Escape/Return rollback recovers the prior selection without rewriting the URL.
7. **Repeatable integration QA:** `scripts/browser-v26.mjs` is an optional Playwright browser runner, with `npm run test:browser`. The normal `npm run verify` remains dependency-free.

## How to verify

```sh
npm run verify
npm install --no-save --no-package-lock playwright@1.65.0
npx playwright install chromium
npm run test:browser
```

The browser script serves only the locally built `dist/` via a temporary loopback HTTP server, checks role-switching and browser history, verifies the original three résumé routes, and checks 320–1440 px viewports.

## Explicitly retained

- Original Mulyankan presenter video and original audio
- Actual saved project screenshots, including SchoolBuddies and the four technical project galleries
- Three role-specific public résumé PDFs and original project source links
- Hover preview, touch and keyboard behavior, deep links, archive disclosures, case studies and engineering evidence
- V25.1 visual layout; **no new versioned CSS layer**

## Not yet claimed

This is **Phase 1**, not a completed rewrite of the entire navigation renderer. The workspace still owns the active project and renders its inspector HTML. V27 work should extract renderer and evidence presentation behind stable state subscriptions, replacing the remaining coupled UI operations only after the new browser integration gate is consistently green.

The code audit and local tests do **not** independently revalidate external repository metrics or backend services. A preview deployment does not imply production promotion.
