# Inside the Builder's Mind — V9 / Visual Depth Release

## Design changes

V9 is a visual upgrade built on V8, keeping the real interactive behavior and the same lightweight static architecture. It adds:

- **Full-Stack Studio:** a custom cosmos-themed OHS room backdrop, layered orbital scenes, overlapping product-spec card, improved interface chrome, and visual polish around the existing working local message and playback simulator.
- **Systems Console:** a directly clickable four-stage source → normalization → deduplication → storage topology. The graph reflects the existing synthetic NewsSources pipeline inspector and terminal; no real network traffic, crawling, or database connection is simulated as live.
- **ML Research Lab:** three original deterministic SVG terrain illustrations for optical, SAR, and multispectral examples, a synthetic contact sheet, viewport HUD, scan line, sensor-specific palettes, and toy-neighbor labels synchronized with the existing calculation.
- **Shared visual design:** refined typography, a contextual identity watermark, animated navigation highlights, visual texture, mode-specific backgrounds, richer conceptual project art, larger tap targets/focus rings, and tighter mobile hero composition.

## Original art and factual integrity

The terrain SVGs in `public/visuals/` are drawn programmatically for this portfolio. **They are synthetic art, not satellite photographs, real EarthBridge inputs, or measured retrieval output.** The OHS-inspired room is a conceptual product display, not a live session. Systems trace records are fictional. Project cards retain prototype/deployment status labels.

## Verification

- `npm test`: **36/36 tests passed**, including four V9 source/asset smoke tests.
- `npm run build`: passed; static assets and `scene-v9.css` / `scene-v9.js` are copied into `dist`.
- `npm run audit:local`: completed with a reminder to set the new portfolio GitHub repository URL.
- Inline Chromium browser testing at **320, 390, 768 and 1440 px**, covering three modes at each viewport: no JavaScript exceptions; document width did not exceed the viewport.
- Manual browser interactions: Full-Stack scene switching, Systems stage 03 activation, ML SAR selection. Additional source/browser checks confirmed the gallery, workbench, and embedded artwork rendered.
- Browser testing uses an inline assembly of the **same CSS/JS and embedded SVG artwork** because browser localhost navigation is blocked by the test environment. **This is not a live AWS deployment test.**

## To run

```bash
npm run dev
npm test
npm run build
npm run preview
npm run audit:local
```

## Before submission

Create and link a new GitHub repository, verify all external project links, personally review the three public résumé PDFs, upload/deploy to AWS Amplify, and capture genuine screenshots of the AWS console and the public website. A strong next improvement would be inserting actual application screenshots in addition to the clearly labeled conceptual diagrams.
