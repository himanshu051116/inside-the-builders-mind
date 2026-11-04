# V13 — Inspectable Evidence Reader

## What changed

1. Expanded the genuine 16-image gallery into an evidence reader. Every capture documents a visible claim and a validation boundary, avoiding deceptive statements about backend operation or performance.
2. Added non-modal Previous/Next screenshot controls and keyboard Left/Right/Home/End when thumbnails are focused.
3. Each capture can be linked directly using `#proof/<group>/<image>`, retaining any `?view=` specialization. The link can be copied through browser Clipboard API (with truthful manual-copy fallback).
4. Added an "Open full image" action for each capture.
5. Added image counter, progress text and type labels, and improved responsive layouts and mobile tap targets.
6. Recorded image dimensions and SHA-256 checksums in `public/evidence/manifest.json` and reserved intrinsic width/height to reduce visual shifts.
7. Preserved all existing V12 interactions, including the separate toy/simulated ML playground, source-linked case studies, three public PDF resumes, command palette, and interactive workbench.

## Validation and boundaries

- `npm test`: 63/63 pass.
- `npm run build`: pass.
- `npm run audit:local`: 0 reminders.
- Inline browser checks include all modes at 320/390/768/1440px, with no JS errors or horizontal overflow under the prior image-remapping harness; a further, image-loaded 390/1440px inspection passed the new controls, and a direct screenshot deep-link test passed.
- Visual previews are real screenshot pixels in a local simulated page. The browser cannot navigate the external production domain through the available test environment.
- No GitHub commit, Vercel production update, AWS deploy or externally hosted app change has been made for V13.
- EarthBridge screenshots, trained-model retrieval output and independently verified performance reports remain pending.

## Files

- `evidence-media.js`: annotated screenshot reader, controls, permalinks and clipboard feedback.
- `portfolio.css`: reader composition and touch/contrast improvements.
- `site.js`: updated version footer, reserved hero image dimensions and high-priority loading.
- `public/evidence/manifest.json`: integrity and dimensions metadata.
- `tests/v13.test.mjs`: new checks for source assets, evidence captions, navigation and non-fabrication.

- Explicit `height:auto` on actual hero screenshots: prevents a layout shift from the newly reserved intrinsic dimensions.
