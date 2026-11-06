# Inside the Builder's Mind

Himanshu Shukla’s portfolio of software, data systems, and applied ML work. The site uses static HTML, CSS, and browser-native JavaScript.

- The Work gallery (`/work/`) presents six project case studies and opens the ranked explorer on demand.
- The Lab (`/lab/`) contains local demonstrations for evidence review, article ingestion, and vector retrieval.
- The evidence index (`/evidence/`) links each project to its documented results, sources, and limits.
- The three original specialization showcases are available at `/legacy/`.

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

## Legacy showcase and evidence desk

The **case-study records** are the primary source-backed project tour. The optional Evidence Desk: four tabs let a recruiter inspect the engineering question, architecture decision, directly linked files and constraints for each flagship project. It follows the selected résumé track. Long-form case notes are opt-in, rather than a wall of text. Use **Ctrl+K / Cmd+K** to search projects, switch modes, jump to a section or open the correct public résumé. The Command Palette is local-only.

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
- `case-dossiers.js` — source-grounded engineering decisions, exact test references, trade-offs and limits
- `content.js` — person, primary projects and transparent archive
- `career-modes.js` — three specialization modes, project ordering, header metadata, Studio/Systems navigation
- `v8-interactions.js` — sole owner of toy ML ranking renderer, plus simulated chat/playback and fictional ingestion trace
- `v10-experience.js` — project grid switch, case-study ordering and source-image fallback
- `v11-experience.js` — evidence tabs, track-linked proof routes, keyboard search, expanded notes, and source-image fallback
- `workbench-*` — local deterministic review exercise and audit export
- `portfolio.css` — consolidated production stylesheet (replaces seven V9 stylesheets)
- `public/social-*.png` and `public/share/*/index.html` — individual social-preview share routes
- `tests/` — 76 automated source and logic checks
- `public/sitemap.xml`, `robots.txt`, JSON-LD, and canonical metadata for discovery

## Historical deployment notes

The V10–V14 release notes below describe historical checkpoints. Use the Vercel deployment details to confirm which commit the production domain serves.

After deployment, test all three routes, the public PDFs, source images, share redirects, external links, and screen-reader/keyboard flows on the actual domain. Confirm canonical project URLs before submitting to AWS. A production performance or WCAG score has not been measured.


## V12 — Authentic interface evidence

The portfolio now embeds 16 author-provided captures across Our Hidden Universe, NewsSources, Mulyankan and SchoolBuddies. Full-Stack and Software hero panels default to a genuine screenshot, with a separate opt-in local interactive simulation. A keyboard-accessible image gallery links to original project repositories; public OHS invite codes are redacted. EarthBridge is deliberately pending real experiment imagery; no performance metric has been invented. See `public/evidence/manifest.json`.


## V13 — Inspectable screenshot records and deep links

Each of the 16 actual author-supplied screenshots now has two explicit, image-specific annotations:

- **What is visible:** factual properties of the screenshot itself.
- **Validation boundary:** what cannot be concluded from the screenshot alone.

The gallery provides image-by-image previous/next controls outside the modal, keyboard navigation for thumbnails, a direct full-image link and a copyable site deep link. A shared link such as `?view=software#proof/news/news-claims` opens the chosen screenshot and section. Each WebP is recorded in `public/evidence/manifest.json` with its byte size, dimensions, source filename and a SHA-256 **of the optimized public WebP** (not of the original uploaded image).

The Full-Stack and Software leads reserve image dimensions and prioritize loading of their actual screenshot. No fabricated EarthBridge imagery or evaluation numbers are added. The original synthetic ML playground stays separate from the source-backed evidence.

Run `npm test && npm run build && npm run audit:local` before deployment. Local Chromium testing in the restricted sandbox uses an inline-script/browser harness because direct HTTP navigation to localhost is blocked; **it does not prove the published website is working**. See `V13_LOCAL_QA.md`.


## V14.5 local release

`V14_4_RELEASE_NOTES.md` documents the mobile evidence-first layout, unclipped jump shortcuts, role history, full-screen image viewer, corrected ML research methodology, and validation. This source is not deployed on GitHub or Vercel.


## V14.5 CSS maintenance checkpoint

The editable source is organized in `styles/*.css` and `v14*.css` correction modules; `npm run build` compiles these in a stable order into **one minified** `dist/portfolio.css` file. The build is dependency-free. `CSS_REMOVAL_AUDIT.json` documents 347 pruned rules that appeared unreferenced in the current JavaScript/HTML source. `V14_5_RELEASE_NOTES.md` records size and QA evidence; production and external audits are still pending.
