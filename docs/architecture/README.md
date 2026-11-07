# Architecture and source ownership

**This is a browser-native, static portfolio.** It is not a running copy of the projects it showcases. Code, original captures and engineering claims are intentionally distinguishable from local-only demonstrations.

## Build and run model

```text
Source HTML, JS and CSS
       │
       ├─ content.js → project metadata and links
       ├─ case-dossiers.js → source-backed engineering decisions
       ├─ public/evidence/manifest.json → saved interface captures
       ├─ v207-route.js ↔ v20-workspace.js → committed navigation state
       ├─ career-modes.js → career-specific presentation
       ├─ v19-milestone-video.js → source recording and muted preview
       └─ workbench-*.js → local deterministic evaluation exercise
       │
       ▼
scripts/build.mjs
       │
       ▼
dist/ (HTML, bundled CSS, JS modules, screenshots, videos, PDFs)
       │
       ▼
Static hosting over HTTPS
```

## Module responsibilities

| Source | Primary responsibility |
|---|---|
| `index.html` | Entry HTML, canonical and social metadata, no-JS fallback |
| `site.js` | Composition and initialization of portfolio sections |
| `content.js` | Profile, five featured projects and secondary work |
| `career-modes.js` | Three presentation tracks and matching résumés |
| `case-dossiers.js` | Design decision, trade-off, expected behavior, evidence, validation boundary |
| `v20-workspace.js` | Selected project explorer, inspector tabs and archive disclosure behavior |
| `v207-route.js` | Validated, shareable role/project/panel/stage/capture URL |
| `v21-interactions.js` | Pointer/keyboard navigation previews; not committed history |
| `v25-section-sync.js` | Read-only section highlighting |
| `v19-milestone-video.js` | In-view silent excerpt, original audible dialog, playback controls |
| `workbench-data.js`, `workbench-logic.js`, `workbench-ui.js` | Sample rubric-review exercise, not an inference service |
| `evidence-media.js`, `public/evidence/` | Original screenshot assets and provenance-related metadata |
| `scripts/build.mjs` | Deterministic static build, cascading CSS layers and asset copying |

## URL and interaction contract

- **Committed actions:** project selection, career role, panel, screenshot, architecture stage and explicit archive navigation.
- **Preview-only actions:** short hover previews. They can be cancelled, must not create History entries and must not silently commit.
- **Deep links:** encoded role/project/panel/stage/capture and meaningful hashes should restore corresponding visible state.
- **Archive:** ten compact headings, no hover opening, one open section at a time; opened content uses **page scrolling**, not a nested scroll container.

See the [detailed navigation contract](../../V25_NAVIGATION_CONTRACT.md).

## Data authenticity and limits

The evidence manifest records optimized public screenshots, their captions and hashes. A screenshot only proves a recorded interface appearance—not reliable backend operation, privacy/security, or a research accuracy metric. Recorded Mulyankan video is authentic source media with original audio; preview/autoplay does not change the file.

The OHS-style preview, NewsSources trace, synthetic retrieval experiments and local Evidence Workbench are clearly designated demonstrations. Source links in the project dossiers are inspection pathways, not independent validation of external services.

## Deferred refactoring

Many files retain version prefixes because the working site depends on their cascade and import order. A broad rename or bundler migration is **not** included in the documentation polish. Any consolidation should be staged with browser regression checks and preserved source media.
