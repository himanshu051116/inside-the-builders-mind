# V20.8 — Quality and Interaction Contract

**Baseline:** V20.7 deployment commit `59c5e0c`. **Working branch:** `design/v20-8-quality-hover`.

## Product priorities
1. Hero = identity, education, direct contact, working résumé choices, and original Mulyankan proof/video. It is not a second project directory.
2. Selected Work = the primary project selector. The detailed archive remains available; do not delete source records, case studies, screenshots, demonstrations, or technical caveats.
3. Three specialization tracks remain: Full-Stack, Software Systems, Applied ML. All three public résumé PDF paths must keep working.
4. Plain, evidence-backed writing; no generic claims such as "revolutionary AI-powered platform" or invented metrics.
5. No large decorative headings, repeated intro text, excessive text walls, misleading actions or passive "click to fit" controls.

## Pointer and keyboard contract
- **Hover-capable desktop:** Hovering a project, specialization, tab, architecture stage, or capture previews it after approximately 145 ms. No click required for a preview.
- **Navigation history:** Hover previews use `replaceState`; explicit clicks may create `pushState` entries. Back navigation should not step through incidental pointer movement.
- **Focus:** Hover must not steal keyboard focus or automatically scroll the page. Tab, Shift+Tab, Enter, Space and tablist arrow keys retain their existing behavior.
- **Touch:** Taps continue to select. Never rely on hover-only access to content or links.
- **Media safety:** Moving the pointer must not automatically play a video, open an external site, or download a résumé.
- **Pointer light:** Restrained single-panel tracking, throttled by `requestAnimationFrame`, only on fine-hover devices when reduced motion is not requested.
- **Accessibility:** Visible selection state, usable focus ring, adequate contrast, reduced-motion and forced-colors behavior.

## Visual quality contract
- Maintain paper / teal / terracotta identity and the original proof card rather than redesigning the site.
- Reduce redundant navigation and long introductory copy; retain important content in its proper section.
- Use consistent type scale, spacing, image containment, card radii and color contrast. Images and presenter recordings must never be stretched or cropped.
- At 320, 375, 768, 1024 and 1440 CSS-pixel widths, avoid horizontal body overflow, overlapping controls, truncated buttons and inaccessible project names.
- Prefer subtle state changes to continuous animation; no global cursor gimmick or hover-driven layout shift.

## Release gates
1. `npm run verify` succeeds and the Vercel preview reports READY.
2. Verify first view at 100% zoom, hover/focus/tap across all three tracks and project panels, the three résumé PDFs, original video with audio, archive anchors, and direct links `?view=...&project=...&panel=...`.
3. Test `prefers-reduced-motion: reduce`, touch emulation, keyboard-only flow, and slow network media fallbacks.
4. Publish/merge only after actual visual and interaction smoke tests; successful static build alone is not proof of browser readiness.

This is an additive quality pass. The V20.7 deployment remains unchanged until this branch is intentionally promoted.
