# V25 Navigation & Evidence Contract

**Status:** preview branch only; not a production promotion.
**Baseline:** V24 `design/v24-performance-clarity`.
**Implementation branch:** `design/v25-navigation-sync`.

## What belongs to a URL

A committed selection consists of:
- `view`: fullstack, software, ml
- `project`: stable project slug
- `panel`: overview, media, architecture, evidence
- `stage`: optional slug of an actual architecture stage (e.g. `persistence`)
- `capture`: optional manifest ID of an actual saved screenshot (e.g. `ohs-together`)
- `#hash`: visible section target (workspace, case studies, exact case, archive, etc.)

The V20 workspace is the owner of committed selections; `v207-route.js` is the only URL-serialization helper. Use one atomic History API write, preserving unrelated query parameters and state. Never invent screenshot IDs or evaluation results. Validate tokens and keep legacy deep links working.

## Preview versus commit

A fine-pointer hover after the configured dwell changes the visible preview **without writing browser history**. A preview-only banner offers **Keep this view**. A click, keyboard activation or explicit share action commits a selection. Buttons must remain mounted under a hovering pointer so a subsequent click works. On navigating away from a preview, restore the last committed project, role, panel and detail token.

- `pushState`: deliberate project, role, tab, stage, capture or archive navigation.
- `replaceState`: normalize the current native case hash and its related query without manufacturing another Back step.
- `popstate`: restore role, project, panel and stable stage/capture; synchronize the source-evidence drawer without a new URL write.
- Native anchors and direct visits: reveal ancestor archive groups, then scroll after layout, not to a collapsed target's old geometry.
- URL writes alone do not fire `hashchange` or `popstate`. Emit explicit committed-navigation events to mirror other views.
- Header active indicators use only read-only scroll/section observation; they never rewrite routes.
- Touch and keyboard do not depend on hover.

## Project detail contract

`content.js` holds public project identity, status, links and case-study summary. `case-dossiers.js` holds deeper source-backed engineering decisions, trade-offs, inspection instructions, and exact test/source paths. The existing evidence manifest provides original captures. V25's optional overview disclosure **reuses** the dossier; never duplicate independently maintained engineering claims or force these paragraphs into the default viewport.

Clearly distinguish a deployed application, a demonstrated prototype, research results reported by a repository, and an in-development system. Do not claim unavailable services or independently reproduced metrics.

## Ownership map

| Responsibility | Owner |
|---|---|
| Route parsing, validation, URL writes | `v207-route.js` |
| Project/role/tab/stage/capture selection and preview | `v20-workspace.js` |
| Career-mode visual presentation | `career-modes.js`, mirrored from the workspace |
| Source/evidence-drawer selection | `v11-experience.js`, listening to committed route events |
| Global hover previews | `v21-interactions.js`, information only |
| Scroll-based header highlighting | `v25-section-sync.js`, read-only |
| Expandable source-backed technical record | `case-dossiers.js`, rendered in the workspace |

## Release gates

1. `npm run verify` passes, including `tests/v25-navigation.test.mjs`.
2. Browser Back/Forward restores the selected project and associated source record.
3. Hovering a project or specialization changes the preview but not the URL; deliberate selection changes both.
4. Direct URL with `stage=persistence` or `capture=ohs-together` restores that exact record.
5. Clicking Case studies opens its actual accordion, scrolls to its content and highlights Case studies in the header.
6. Clicking a case tab in the Evidence Desk updates the workspace; the reverse holds for committed workspace navigation.
7. Copy-link copies the exact current committed route.
8. Keyboard and touch actions, screenshots, original video and three résumé PDFs remain usable.
9. At 320, 390, 768, 850, 1065 and 1440 CSS pixels, no horizontal document overflow, navigation trap or browser JavaScript errors.
10. Production promotion requires a separate explicit request and a final preview comparison with V24.

## V25.1 — Preview rollback and linked engineering context

- Preview changes are provisional. The first preview saves the committed role, project, panel, capture, architecture stage and all per-project selection maps. Subsequent hovers must **not** overwrite this checkpoint.
- An explicit **Return** button or Escape restores the saved state and the legacy career presentation without changing the URL. Leaving the entire workspace restores the committed view after a 550 ms grace period; moving within the workspace does not.
- Clicking **Keep this view**, a project, a role, a tab, a stage or a screenshot commits the visible selection and discards the snapshot.
- Browser Back/Forward, external archive navigation and hash transitions restore a pending preview checkpoint before processing the new committed route.
- The expanded engineering record uses the existing `caseDossiers` fields `decision`, `tradeoff`, `reproducible`, `expected`, `state` and `evidence`; it adds direct internal buttons for Architecture, Screens and Verification without duplicating source claims.
- The default workspace remains compact: all additional explanation stays inside a native `details` element, and source screenshots remain original, not illustrative substitutes.

Additional V25.1 browser gates: hover a role, restore with Escape, inspect role-specific stylesheet and résumé, hover multiple projects and return, cross the workspace boundary and verify automatic rollback, test modal Escape conflict avoidance, and verify detail-to-tab links work by click, keyboard and touch.
