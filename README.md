# Inside the Builder's Mind — V11

Three specialization-aware portfolio experiences for Himanshu Shukla (B.Tech Mathematics & Computing, MITS Gwalior): **Full-Stack Studio**, **Systems Console**, and **ML Research Lab**. Built with browser-native JavaScript, HTML and CSS, with an interactive Evidence Workbench.

## Run

Requires Node.js 22+ for the scripts. No npm runtime dependencies.

```bash
npm test
npm run audit:local
npm run dev
npm run build
npm run preview
```

The production build is in `dist/`. Deploy the root source repository on Vercel using **build command `npm run build`** and **output directory `dist`**. AWS Amplify configuration is in `amplify.yml`; use the same source repository and do not treat Vercel as AWS challenge submission hosting.

## V11 additions

The **Evidence Desk** is the main source-backed project tour: four tabs let a recruiter inspect the engineering question, architecture decision, directly linked files and constraints for each flagship project. It follows the selected résumé track. Long-form case notes are opt-in, rather than a wall of text. Use **Ctrl+K / Cmd+K** to search projects, switch modes, jump to a section or open the correct public résumé. The Command Palette is local-only.

See `V11_RELEASE_NOTES.md` for the implementation and test details.

## Genuine evidence versus demonstration

- The Mulyankan project card and case study reference **genuine published screenshots** in `himanshu051116/Algonauts-Mulyankan/docs/assets/screenshots/`. Those images are optional external requests to public GitHub; a source link is shown when the browser cannot load the remote image. No project screenshots have been invented.
- The OHS proof panel links to the **deployed product**, public UI and chat source code. The simulated room/playback interaction is **local only** and is not a live Firebase/WebRTC session.
- The NewsSources case file links to published architecture and a PostgreSQL integration test. The interactive trace uses fictional sample input; it is not a live crawler or a production log.
- EarthBridge proof links point to its metric-evaluation and 128-pair overfit-gate scripts. The displayed nearest-neighbor rankings are calculated from **toy synthetic vectors**, not trained EarthBridge inference. A previously reported internal accuracy percentage is intentionally not featured without a verified metric protocol.
- IrisTrack, Coal Governance and Mulyankan Spatial Lab appear in the secondary project archive, explicitly labeled by stage. Coal Governance and Spatial Lab have no public-demo link in this release.

## Résumés

Three rebuilt A4 one-page public PDFs under `public/resumes/`, with contact formatting corrected, the telephone number omitted and claims aligned to the portfolio. Preserve a phone-inclusive private version only for channels you personally approve.

## Architecture

- `site.js` — portfolio content, views and case-study markup
- `content.js` — person, primary projects and transparent archive
- `career-modes.js` — three specialization modes, project ordering, header metadata, Studio/Systems navigation
- `v8-interactions.js` — sole owner of toy ML ranking renderer, plus simulated chat/playback and fictional ingestion trace
- `v10-experience.js` — project grid switch, case-study ordering and source-image fallback
- `v11-experience.js` — evidence tabs, track-linked proof routes, keyboard search, expanded notes, and source-image fallback
- `workbench-*` — local deterministic review exercise and audit export
- `portfolio.css` — consolidated production stylesheet (replaces seven V9 stylesheets)
- `public/social-*.png` and `public/share/*/index.html` — individual social-preview share routes
- `tests/` — 52 automated source and logic checks
- `public/sitemap.xml`, `robots.txt`, JSON-LD, and canonical metadata for discovery

## Live deployment limitations

V11 was tested locally, not pushed to GitHub or deployed to Vercel/AWS. The current production Vercel URL still serves the earlier V9 release unless independently updated. In this execution environment, direct Chromium requests to localhost and the external Vercel pages are blocked; V10 screenshots and interaction tests use the **same code in a controlled inline-browser environment**. They do not substitute for live end-to-end tests.

After deployment, test all three routes, the public PDFs, source images, share redirects, external links, and screen-reader/keyboard flows on the actual domain. Confirm canonical project URLs before submitting to AWS. A production performance or WCAG score has not been measured.


## V12 — Authentic interface evidence

The portfolio now embeds 16 author-provided captures across Our Hidden Universe, NewsSources, Mulyankan and SchoolBuddies. Full-Stack and Software hero panels default to a genuine screenshot, with a separate opt-in local interactive simulation. A keyboard-accessible image gallery links to original project repositories; public OHS invite codes are redacted. EarthBridge is deliberately pending real experiment imagery; no performance metric has been invented. See `public/evidence/manifest.json`.
