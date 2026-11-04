# V14.4 — Corrective Release (LOCAL ONLY)

This version corrects the specific problems detected in the V14.3 visual audit, without replacing the live portfolio.

## Corrections

- All four mobile jump shortcuts fit without clipping; moved after the early evidence panel.
- Mobile ordering is identity → compact role selector → role headline → original screenshot or clearly labeled research methodology → context and CTAs.
- Real OHS and NewsSources hero images open a large accessible dialog; a separate visible link opens the matching case study. The dialog retains Escape and focus restoration.
- Role switches write navigable browser history. Back/Forward changes the selected role and `?view=`.
- EarthBridge lead panel uses a 3-step evaluation methodology, not metrics that resemble performance results; no real retrieval images are claimed.
- Only the currently selected role's screenshot gets an eager/high-priority load; a matching image is preloaded based on initial URL.
- The search button displays Ctrl+K on non-Mac platforms and ⌘K on Mac devices.
- Removed the low-information three-metric headline strip, replacing it with a small documented milestone line.
- Desktop ML lead content is aligned so its main CTA remains within a 1366×768 first viewport.

## Validation

- 95/95 automated Node tests passed.
- `npm run build`, `npm run audit:local`, and `npm run audit:metadata` passed.
- 15/15 isolated Chromium role/viewport checks (320,390,768,1366,1440 widths); no JS exceptions, outer overflow, or mobile shortcut clipping.
- Two screenshot-zoom/Escape/focus-restoration tests and Back/Back/Forward role history test passed in the isolated browser harness.
- The full-size image test used the exact local screenshot bytes to substitute the network image inside the isolated about:blank QA context. This is not a live CDN/hosted download test.
- Existing V14 regression screenshots and user-supplied image integrity checks remain in place.

## Outstanding gates

- Genuine EarthBridge retrieval/evaluation screenshots and results.
- Confirmation that every published capture is authorized or anonymized.
- Full CSS rule cleanup, axe + screen-reader audit, and live Core Web Vitals.
- Real Vercel preview browser testing, release acceptance, and AWS Amplify publishing.

**GitHub, Vercel, AWS remain untouched by this local release.**
