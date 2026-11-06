# Editorial V15 — project-led UI refinement

The hero headlines now introduce three actual engineering projects rather than broad AI marketing. The case-record rail links directly into existing accessible technical dossiers, and the original interactive evidence viewer remains intact.

## Interface changes
- New role-specific editorial visual system: warm paper for Full-Stack, slate for Software Systems, and deep violet for ML.
- More restrained header and typographic hierarchy, concrete CTA labels, and consistent real screenshot frames.
- Full-size, two-column project index on desktop and readable single-column cards on mobile, without clipping project descriptions.
- A case-record rail links directly to OHS, NewsSources, and EarthBridge source-backed dossiers.
- Source code and known validation limits remain visible; simulation content remains identified as simulated.
- Keyboard focus, reduced-motion, and forced-colors treatments preserved.

## Accuracy and publication
No external product claims, model metrics, or availability assertions were added. The EarthBridge performance figures remain explicitly repository-reported. Existing V14 screenshots retain their publication/privacy review requirements; this styling work does **not** certify them for a public production release.

## Verification
Run `npm test && npm run audit:local && npm run audit:metadata` and check the preview at `?view=fullstack`, `?view=software`, and `?view=ml` at desktop/tablet/mobile widths. Production is not changed by this branch.
