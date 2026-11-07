# V12 local quality assurance

- 58/58 Node automated tests passed.
- Dependency-free production build passed.
- Asset and content audit: 0 reminders (external URLs not checked).
- 12 local Chromium viewport-mode combinations (320, 390, 768, 1440 px × fullstack/software/ml): 0 JS exceptions; 0 horizontal overflows.
- In both the Full-Stack and Software modes: verified author-supplied hero screenshots load and are selected by default; the interactive demos can still be activated.
- Lightbox: Mulyankan screenshots, next-image with right arrow and Escape-to-close verified at desktop and mobile widths.
- Screenshot originals provided by author; optimized WebP versions embedded in portfolio. OHS invite code solidly redacted before inclusion.
- ML research illustration still synthetic; real EarthBridge imagery and measured results pending.

**Limits:** This was a local inline-browser QA run. It does not certify live production Vercel, AWS, external links, security, or server-side backend functions.
