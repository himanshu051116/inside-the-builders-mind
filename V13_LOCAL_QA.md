# V13 Local QA — 2026-11-04

- Source-level Node tests: **63 passed, 0 failed**.
- Production build: **passed**.
- Local asset and content audit: **0 reminders**; external links not checked.
- Inline Chromium mode/viewport test: **12/12** (fullstack/software/ml × 320/390/768/1440), no JavaScript exceptions, no horizontal overflow or wrong role selected; *this initial pass did not load dynamically constructed image URLs in its harness*.
- After correcting test image URL handling, image-loaded Chromium checks: **22/22** for Full-Stack at 390px and 1440px, covering reader notes, navigation, clipboard feedback, lightbox next/close, and no overflow/JS exceptions.
- At 1440px, a further pass verified both the NewsSources gallery deep-link selection and specific `news-claims` image selection after hash navigation.
- Screenshot preview files in `/mnt/data/Inside_the_Builders_Mind_V13/` are browser captures of this local V13 source, not of Vercel.
- Integrity hash checks: all 16 optimized WebP screenshot assets verified against their manifest SHA-256 and exact byte sizes.
- EarthBridge has no real screenshot added. No inference or evaluation metrics were fabricated.

**Limitations:** Cannot navigate to localhost or Vercel via Chromium because navigation is blocked by the execution environment. Inline harness substitutes a browser document populated with actual project CSS/JavaScript and screenshot pixels. It validates client-side behavior but not production hosting, authentication, third-party dependencies or independently measured accessibility scores. No deployment was performed.

- A final hero visual regression check identified and fixed a CSS layout bug introduced by intrinsic image height attributes (`height:auto` now prevents tall empty padding). The corrected hero preview is `V13_Hero_1440.png`.
