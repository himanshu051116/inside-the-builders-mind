# Inside the Builder’s Mind — V14 Master Upgrade Checklist

**Baseline:** V13 production version. **State:** V14 development build (local only). Checked tasks were verified within the limits described below; hosted-production verification is not claimed. Existing V13 features are not marked complete simply because similar functions exist.  
**Status convention:** `[ ]` outstanding, `[x]` completed **and independently checked**.  
**Publishing policy:** Preserve V13 until V14 passes preview acceptance. GitHub/Vercel/AWS remain unchanged until requested/authorized.  
**Important dependencies:** User approval or anonymization of sensitive captured data (V14-018–020); a real ranked EarthBridge query with ground truth (V14-016); AWS access only when deploying (V14-073).

> **Implementation checkpoint:** 50/73 tasks locally verified; 23 remain open. This is a development build, not production acceptance.
> **Local verification:** 116 automated tests, successful static build, 15 responsive role checks, 12 semantic/tap-target spot checks, zero reported browser JS errors or horizontal overflow, one-page PDFs with embedded links.
> **Important limits:** No public V14 browser audit, four authentic EarthBridge UI captures (no successful query-and-ranked-results image yet), no independent SchoolBuddies URL verification, and no Vercel/AWS deployment.

## Release completion gates

- [ ] **P0 gate:** All V14-001–038 complete (or a documented blocker approved).
- [ ] **P1 gate:** All V14-039–059 complete (or a documented deferral).
- [ ] **P2 gate:** All V14-060–068 complete (or a documented deferral).
- [ ] **Release gate:** V14-069–072 complete before claiming production release.
- [ ] **AWS gate:** V14-073 complete only if separately approved.

## Task checklist

### A. First-screen identity and visual hierarchy · P0
- [x] **V14-001** — Show name, Mathematics & Computing background and selected specialization immediately.  
  **Done when:** Identity visible in initial viewport in all three modes.
- [x] **V14-002** — Replace oversized three-card selector with compact, accessible mode tabs.  
  **Done when:** All three modes reachable by mouse, touch and keyboard; clear active state.
- [x] **V14-003** — Replace vague lead headlines with role-specific engineering value propositions.  
  **Done when:** Each hero names a concrete problem area, not only creative slogans.
- [x] **V14-004** — Feature one authentic, relevant flagship screenshot per mode.  
  **Done when:** Screenshot attribution, status and context appear with image.
- [x] **V14-005** — Keep primary CTA above fold at common laptop screen sizes.  
  **Done when:** Primary CTA visible at 1366x768 and 1440x900 without scrolling.
- [x] **V14-006** — Reduce simultaneous hero buttons, badges and captions.  
  **Done when:** One primary and one secondary CTA, with nonessential labels minimized.

### B. Flagship case studies and evidence quality · P0
- [x] **V14-007** — Build canonical OHS case study.  
  **Done when:** Problem, architecture, code paths, evidence, tests, limitations, and links documented.
- [x] **V14-008** — Build canonical NewsSources case study.  
  **Done when:** Includes acquisition through persistence/versioning and a tested failure/retry scenario.
- [x] **V14-009** — Build canonical Mulyankan case study.  
  **Done when:** Includes document gate, rubric/evidence, human review and actual screenshots.
- [x] **V14-010** — Build canonical EarthBridge case study.  
  **Done when:** Include documented implementation and evaluation protocol; do not invent model outputs.
- [x] **V14-011** — Add at least one real technical challenge and trade-off per case study.  
  **Done when:** Clear why/approach/outcome/limitation for every flagship.
- [x] **V14-012** — Map technical claims to source paths, artifacts or verified demos.  
  **Done when:** Every flagship has direct links that support its strongest claims.
- [x] **V14-013** — Distinguish captured UI, source evidence, synthetic examples, and research results.  
  **Done when:** Each media element has an accurate evidence-type label.
- [x] **V14-014** — Move the full 16-image gallery behind a concise evidence preview.  
  **Done when:** Case studies are usable without scrolling through every screenshot.
- [x] **V14-015** — Add authentic NewsSources extraction/versioning evidence.  
  **Done when:** One inspectable record or reproducible test; no fictional demo represented as actual ingest.
- [ ] **V14-016** — Add EarthBridge real query and retrieval examples when received.  
  **Done when:** Ground truth, ranked candidates and modality labels documented; otherwise stays pending.
- [x] **V14-017** — Document EarthBridge metrics precisely or avoid numerical headline.  
  **Done when:** Dataset, split, cutoff, metric and observed value traceable to a report.

### C. Screenshot permissions, accuracy and privacy · P0
- [ ] **V14-018** — Review every uploaded screenshot for names, private records and account identifiers.  
  **Done when:** Public-safe assets only; redact or remove uncertain fields.
- [x] **V14-019** — Confirm permission to show Mulyankan proposal and review data.  
  **Done when:** Authorized or anonymized before publication.
- [x] **V14-020** — Keep OHS couple codes and personal chat data fully redacted.  
  **Done when:** No readable invite code or personal messages in originals or derivatives.
- [x] **V14-021** — Classify SchoolBuddies poster as outreach material, not product telemetry.  
  **Done when:** Poster and workshop outcomes never conflated.
- [x] **V14-022** — Label Mulyankan Spatial Lab as an explanatory, non-live architecture demo.  
  **Done when:** Visible status anywhere those screenshots appear.
- [ ] **V14-023** — Resolve SchoolBuddies canonical site URL in poster, portfolio and résumé.  
  **Done when:** All public links checked and point to the chosen valid address.

### D. Three public résumé PDFs · P0
- [x] **V14-024** — Increase typical résumé body text to approximately 10–10.5 pt.  
  **Done when:** All PDFs remain one A4 page and readable at 100% zoom.
- [x] **V14-025** — Use unused lower-page space for breathing room and clearer project separation.  
  **Done when:** Balanced page fill without padding with irrelevant claims.
- [x] **V14-026** — Improve visual hierarchy: name, role, projects, skills and outcomes.  
  **Done when:** Consistent section headers, spacing and clickable link styling.
- [x] **V14-027** — Tailor Full-Stack résumé toward OHS, Mulyankan and SchoolBuddies.  
  **Done when:** Lead projects align with Full-Stack mode.
- [x] **V14-028** — Tailor Software résumé toward NewsSources and documented systems work.  
  **Done when:** Emphasize backend boundaries, reliability, tests and status.
- [x] **V14-029** — Tailor ML résumé toward EarthBridge evaluation and IrisTrack status.  
  **Done when:** No unqualified 90% accuracy claim; limitations clearly stated.
- [ ] **V14-030** — Ensure all three PDFs use consistent, verified contact and canonical project links.  
  **Done when:** Valid GitHub/LinkedIn/email/project links; public-safe personal details.
- [ ] **V14-031** — Validate résumé extraction, visual rendering and embedded links.  
  **Done when:** Selectable text, no clipping, correct one-page format and working URLs.

### E. Real production end-to-end and release gates · P0
- [ ] **V14-032** — Create non-production Vercel preview from the V14 branch.  
  **Done when:** Production V13 unaffected during acceptance.
- [ ] **V14-033** — Test all three hosted role routes and mode switching.  
  **Done when:** Correct selected mode after navigation, reload and browser back.
- [ ] **V14-034** — Test all hosted résumé PDFs and direct downloads.  
  **Done when:** HTTP success, valid PDF response, correct variant.
- [ ] **V14-035** — Test project links, source links, screenshot deep links and canonical URLs.  
  **Done when:** No broken URLs, dead anchors, or unexpected 404s.
- [ ] **V14-036** — Test gallery, evidence desk, command palette, dialog focus and Escape handling.  
  **Done when:** Critical interactions pass in real hosted browser.
- [ ] **V14-037** — Test on mobile/tablet/desktop and reduced motion.  
  **Done when:** No horizontal overflow or unusable controls at 320, 390, 768, 1366, 1440 px.
- [ ] **V14-038** — Capture browser console/network errors and report findings honestly.  
  **Done when:** No blocking errors; any warnings documented.

### F. Information architecture and project navigation · P1
- [x] **V14-039** — Make case studies accessible in one click from hero and navigation.  
  **Done when:** Shortest path to flagship proof is direct.
- [x] **V14-040** — Simplify duplicate Evidence Desk, gallery, project reel and workbench entry points.  
  **Done when:** One clear primary project path; supporting tools remain optional.
- [x] **V14-041** — Provide an accessible all-projects grid and meaningful filters.  
  **Done when:** Visitors can find IrisTrack, Coal Governance and Spatial Lab.
- [x] **V14-042** — Show current project state and role tags consistently.  
  **Done when:** Live, prototype, research and demo statuses not mixed.
- [x] **V14-043** — Keep experiments in a distinct Interactive Lab section.  
  **Done when:** Simulations clearly separate from real project screenshots.
- [x] **V14-044** — Improve narrow-screen order and jump navigation.  
  **Done when:** Hero can lead directly to evidence without passing all other sections.

### G. CSS architecture and fonts · P1
- [x] **V14-045** — Define shared design tokens for surfaces, type, spacing, radii and states.  
  **Done when:** All three themes derive from documented tokens.
- [ ] **V14-046** — Remove redundant override layers and unused legacy selectors.  
  **Done when:** New component stylesheet organized by responsibility.
- [x] **V14-047** — Load intended fonts explicitly and provide robust fallbacks.  
  **Done when:** No reliance on visitors having DM Sans/Space Grotesk installed.
- [ ] **V14-048** — Standardize component states and responsive breakpoints.  
  **Done when:** Common button, card, tooltip, nav and focus patterns.
- [x] **V14-049** — Regression-test appearance after CSS refactor.  
  **Done when:** Screenshots reviewed at all target sizes and modes.

### H. Meaningful career-mode differentiation · P1
- [x] **V14-050** — Full-Stack: show OHS real product flow and React/Firebase architecture.  
  **Done when:** Working product evidence prioritized, simulation is optional.
- [x] **V14-051** — Software: show NewsSources ingestion provenance and failure resilience.  
  **Done when:** Real code/tests and meaningful architecture shown first.
- [x] **V14-052** — ML: show EarthBridge research protocol and code before illustrative visuals.  
  **Done when:** Clearly separates synthetic nearest-neighbor toy from trained results.
- [x] **V14-053** — Use role-specific project order, case studies, skills and résumé CTAs.  
  **Done when:** Modes differ in evidence and navigation, not only color.

### I. Accessibility and responsive quality · P1
- [x] **V14-054** — Increase essential secondary text and ensure readable body text.  
  **Done when:** Body approximately 16px; essential secondary generally 13–14px.
- [ ] **V14-055** — Run WCAG 2.2 AA contrast audit, including dark and light themes.  
  **Done when:** Normal text reaches 4.5:1 or documented applicable exception.
- [x] **V14-056** — Review tap target dimensions, spacing and zoom behavior.  
  **V14.8 local verification:** 15 role/reflow checks (320, 390, 640, 1366 and 1440 CSS pixels), zero visible small (<24px) or clipped controls in sampled views, plus full-document target-size sampling at 390px. Full hosted screen-reader and native zoom audits remain open.  
  **Done when:** Targets follow accessible sizing and avoid accidental taps.
- [x] **V14-057** — Test keyboard traversal, focus visibility, modals and search.  
  **Done when:** Complete key journeys without mouse and no focus traps.
- [ ] **V14-058** — Check semantic landmarks, alt text, accessible names and status messages.  
  **Done when:** Automated axe scan plus targeted manual review.
- [ ] **V14-059** — Test with mobile and desktop screen readers.  
  **Done when:** Major flows announced and navigable; report remaining problems.

### J. Performance, SEO and metadata · P2
- [ ] **V14-060** — Measure real mobile LCP, INP and CLS on hosted site.  
  **Done when:** Compare with targets 2.5s, 200ms, 0.1; do not invent scores.
- [x] **V14-061** — Prioritize flagship image and lazy-load nonessential galleries.  
  **Done when:** Lead imagery gets priority, offscreen media defers.
- [x] **V14-062** — Optimize screenshot formats/sizes and respect intrinsic dimensions.  
  **Done when:** No image distortion or layout shifts across modes.
- [x] **V14-063** — Validate Open Graph cards, canonical tags, sitemap and structured data.  
  **Done when:** Shared preview and search metadata match portfolio content.
- [x] **V14-064** — Measure and trim unnecessary JS/CSS without sacrificing features.  
  **Done when:** Before/after bundle figures and no behavior regression.

### K. Restrained motion and finishing polish · P2
- [x] **V14-065** — Reduce ornamental animations that compete with main evidence.  
  **V14.7 verification:** IntersectionObserver pauses decorative loops offscreen, resumes when visible; CSS reduce-motion remains authoritative, tested in Chromium.
  **Done when:** Purposeful transitions only.
- [ ] **V14-066** — Use transitions to clarify mode changes and reader navigation.  
  **Done when:** Motion communicates state; no hidden delays.
- [x] **V14-067** — Honor prefers-reduced-motion in every new animated control.  
  **Done when:** All tasks usable with animation disabled.
- [ ] **V14-068** — Inspect visual consistency and polish microcopy in all themes.  
  **Done when:** Crisp spacing and honest statuses without clutter.

### L. Final handoff and deployment · RELEASE
- [x] **V14-069** — Run source tests, build, asset audit and image-integrity scan.  
  **Done when:** All checks pass before release.
- [x] **V14-070** — Generate final desktop/mobile screenshots and test report.  
  **Done when:** Screenshots reviewed; blockers documented.
- [ ] **V14-071** — Publish V14 preview and verify exact Git commit/deployment link.  
  **Done when:** Preview tied to expected source tree.
- [ ] **V14-072** — Promote V14 to production only after acceptance.  
  **Done when:** GitHub main / Vercel production refer to verified release.
- [ ] **V14-073** — Deploy to AWS Amplify after Vercel approval.  
  **Done when:** AWS environment explicitly authorized and tested; no secrets shared.

## Execution order & ownership

1. **Track A:** Finish hero, navigation and typography (V14-001–006, 039–049) before visual polish.
2. **Track B:** Build evidence-based flagship case studies and privacy review (V14-007–023). The user must clear any sensitive content before public publishing.
3. **Track C:** Rebuild and validate public résumé PDFs (V14-024–031).
4. **Track D:** Implement differentiated experiences and accessibility (V14-050–059).
5. **Track E:** Measure hosted performance, verify metadata, refine motion (V14-060–068).
6. **Track F:** Preview, test, publish and optionally move to AWS (V14-032–038, 069–073).

**Release notes to capture:** Baseline commit, V14 commit, tests, browser platform/version, issues still open, preview URL, production URL, AWS state.

**Blocking user inputs:** Approve or anonymize Mulyankan data; supply real EarthBridge evaluation screenshots/reports when ready; approve production/AWS deployment at release time. All other tasks can be drafted using the existing source.

## Current blockers and partial work

- **V14-004**: EarthBridge has no actual retrieval screenshot; the ML hero uses a labeled source-backed protocol panel.
- **V14-016**: Awaiting EarthBridge query/retrieval outputs.
- **V14-023**: Canonical SchoolBuddies domain must be verified before publishing QR or links.
- **V14-032**: User has not requested a V14 Vercel preview deployment.
- **V14-060**: Cannot measure production V14 performance until preview hosting.

Other unchecked tasks remain open under their existing acceptance criteria, including production tests, CSS-debt removal, accessibility contrast/screen-reader testing, verified source-linked failure demonstrations and Core Web Vitals. A source test passing is **not** a substitute for live-browser verification.

## V14.1 continuation — source-backed case studies

**Eight additional tasks verified locally:** V14-007, V14-008, V14-009, V14-010, V14-011, V14-012, V14-015 and V14-040.

- Every flagship now includes an inspectable technical constraint, a design decision, a downside/trade-off, a clearly scoped expected test result, project-stage disclosure and direct source links. Read `case-dossiers.js` and expand the relevant case note.
- NewsSources specifically references `test_expired_candidate_is_reclaimed_and_old_writer_is_rejected`, which needs an isolated PostgreSQL test database (`NEWSINTEL_TEST_DATABASE_URL`); the portfolio does not claim to have run that database-backed test.
- The cross-project Evidence Desk now lives in a secondary expandable area, while direct project links open the main case notes; project screenshot galleries remain supporting evidence.
- Mismatched image-fallback destinations were corrected. A broken OHS, NewsSources, Mulyankan or SchoolBuddies screenshot now leads to its own appropriate source instead of always Mulyankan.
- A detailed open case spans the full desktop content width; long technical identifiers wrap and the record remains responsive at 390 px.
- Vercel ownership metadata confirms both `schoolbuddiesindia.vercel.app` and `schoolbuddies-six.vercel.app` are aliases of the same `schoolbuddies` project, whose latest production deployment was READY. This does not constitute independent HTTP verification of both public aliases, so V14-023 remains open for final canonical-URL/QR review.
- Source checks: 76/76 passing. Inline Chromium checks: 15 role/viewport checks, 2 detailed-dossier screenshots, 4 broken-image fallback cases. Build and local asset audit passed.

**Still blocked or pending:** genuine EarthBridge model output (V14-004, V14-016), public screenshot permissions (V14-018), all hosted Vercel tests (V14-032–038), external URL/browser verification, legacy CSS cleanup, full accessibility audit, field Core Web Vitals and release authorization.

No new branch, GitHub push, Vercel preview, production promotion or AWS action was performed.


## V14.2 continuation — discoverability, keyboard access and CSS ownership

**Five new tasks locally verified:** V14-041, 042, 044, 049, 061. **Overall 42/73 verified; 31 remain open**, including in-progress items and external blockers.

- Secondary-project archive: added All / Full-Stack / Software / ML filters with correct visible results, pressed states and polite result announcement; verified mouse and keyboard operation.
- Featured card statuses: consistent stage terminology while preserving the source's explicit progress and caveats.
- Mobile: short, horizontally scrollable navigation links straight to case studies, projects, archive and contact (no forced two-line header).
- Images: prioritize only the initially visible hero screenshot; lazy-load other role images and offscreen gallery media.
- CSS: original 182 KB historical stylesheet split into eleven feature-owned source modules; build regenerates legacy `portfolio.css` identically. This improves maintenance but does NOT yet eliminate all obsolete rules; V14-046 remains open.
- Keyboard and contrast: 29 targeted interactions passed. Computed-color spot checks are not equivalent to full axe or WCAG compliance testing. V14-055–059 remain open.
- Regression: 84/84 Node tests; production build, content/asset audit, 15 responsive role/viewport checks (320/390/768/1366/1440); no detected horizontal overflow or page JS exceptions. Browser checks used an inline local harness with assets embedded, NOT a live Vercel browser session.
- EarthBridge real outputs and sensitive-screenshot approval remain blockers. No GitHub/Vercel/AWS changes.


## V14.3 continuation — measured accessibility and metadata

**Three newly verified local tasks:** V14-054, 057, 063. **Overall 46/73 verified; 27 remain open.**

- Chromium baseline: 5–9 visible controls smaller than 24 CSS pixels in sampled 390px/1440px role views; V14.3 now reports zero in all six sampled views. This covers the rendered pages in the inline local browser harness, not every possible state or browser.
- Small text: project-status labels increased from 8px to 13px on mobile. Essential screenshot notes, source links and project descriptions increased to 13–16px. Full-Stack hero accent changed to #b13a20 to improve contrast on the light background (approximate contrast ratio 5.27:1; old accent around 4.12:1). This is not a complete WCAG audit.
- Keyboard: 36 dedicated browser checks cover role switches, search dialog, case-study entry, screenshot tab list and viewer, Escape and focus restoration. Existing 29 feature checks also pass. Screen-reader and axe work remain V14-058/059.
- SEO: `audit:metadata` checks root canonical URL, JSON-LD Person, sitemap/robots, all three role-specific share pages and actual 1200×630 PNG header sizes. Preload only the initial OHS hero evidence image. Public crawler/social previews not verified.
- Verification: 90/90 automated Node tests, build, local asset audit, 15/15 role/viewport checks (320/390/768/1366/1440), 29/29 feature checks, and 36/36 keyboard checks passed. Zero console exceptions/horizontal overflow in tested cases. These browser checks use inline CSS/JS/assets, not public Vercel hosting.
- Remaining: live preview, hosted end-to-end tests and CWV measurement; full WCAG/axe/screen-reader audit, CSS dead-rule removal, approved EarthBridge output and remaining screenshot/URL review. No GitHub/Vercel/AWS changes.


## V14.4 continuation — mobile evidence, navigation, research integrity

**One newly verified task:** V14-052 (research-methodology-first ML presentation). **Overall 46/73 verified; 27 outstanding.** Prior V14-044 was rechecked and corrected after discovering its mobile shortcut strip could clip a link despite page-level no-overflow tests.

- Mobile 390px: genuine hero screenshot begins at ~373px after identity, mode tabs and a short technical headline (previous locally observed screenshot start was roughly 866–958px depending on role); at 320px the lead begins at 406–439px. No first-screen metric has been attributed to live hosting.
- All four mobile shortcut links now fit in a balanced, non-scrolling two-column row. Navigation remains available after the lead evidence instead of pushing the screenshot down.
- Hero screenshot click opens the existing full-size screenshot dialog, while the associated case study has a separate labeled link. Escape restores focus to the invoking control in the local browser checks.
- Browser role changes now use `pushState` (not `replaceState`), respect screenshot deep links, and respond to Back/Forward. Browser history was exercised in isolated Chromium; hosted acceptance remains V14-033.
- EarthBridge hero now communicates data-manifest checks, leakage-aware splitting, and the evaluation protocol, not fake numerical metrics or generated satellite imagery. Genuine query and retrieval screenshots remain blocked (V14-004/016).
- Added role-aware image preloading, inactive-image lazy loading, adaptive Ctrl+K/⌘K hint, and a less dominant editorial milestone line.
- V14.4 tests: **95/95 Node tests**; successful static build, content/asset and metadata audits; **15/15 inline-Chromium role/view checks** across 320/390/768/1366/1440; two hero zoom/focus checks; Back/Back/Forward navigation. The ML desktop CTA was also corrected to fit a 1366×768 viewport.
- Remaining: V14 CSS dead-rule removal, complete contrast and screen-reader testing, full live-hosted acceptance, real EarthBridge outputs, formal screenshot/publication permissions, Core Web Vitals. No GitHub/Vercel/AWS changes.


## V14.5 continuation — audited CSS delivery and accessibility smoke checks

**One additional task verified locally: V14-064. Overall 47/73 checked, 26 open.**

- **Source cleanup:** 347 static CSS rules with no referenced class names were removed from eleven source modules, with `CSS_REMOVAL_AUDIT.json` retaining selectors and byte counts for review. Dynamic classes and complex selectors were protected. **V14-046 remains open** because not all redundant style overrides have been reconciled.
- **One production stylesheet:** `dist/portfolio.css` is built from the legacy modules and V14 correction layers in their original order. Editable source is not minified. The production build reduces four CSS requests to one.
- **CSS bytes:** V14.4 212,050 bytes across four CSS files (51,642 bytes summed gzip); V14.5 178,829 bytes in one CSS file (39,762 gzip). **−15.7% raw / −23.0% gzip.** This is a delivery-size result, **not** a measured Core Web Vitals improvement.
- **Visual safety:** Six baseline V14.4 versus cleaned/minified pre-polish captures were pixel-identical with animations off. After minor intentional dark-navigation contrast changes, the final built bundle passed 15 role/viewport checks (320, 390, 768, 1366, 1440 widths) and 3 navigation/zoom/history interaction suites.
- **Accessibility smoke checks:** Twelve role/viewport checks at 320, 390, 768 and 1440 CSS pixels found no unnamed visible controls, missing alt attributes, duplicate IDs, missing ARIA ID references, minimum target-size failures, or horizontal page overflow in sampled states. The Software / ML header navigation text ratio measured approximately 13.68:1 / 13.34:1 against its dark background. **V14-055, -056 and -058 remain open** for full gradient-background contrast, real browser zoom and formal axe/assistive technology review.
- **Remaining major gates:** Real EarthBridge ranked-query screenshots, hosted Vercel end-to-end validation, Core Web Vitals field measurements, publication permissions, screen-reader testing, and production/AWS release authorization.

No GitHub, Vercel or AWS changes were made in this checkpoint.


## V14.6 — EarthBridge evidence integration

- **V14-004 completed locally:** authentic author-supplied lead screenshots now appear in Full-Stack (OHS), Software (NewsSources) and Applied ML (EarthBridge static evaluation UI).
- Added EarthBridge captures for reported evaluation results, offline workbench, conceptual cross-sensor architecture and empty results inspector; gallery now contains **20 captures across five projects**.
- **V14-016 remains pending:** a functioning, actual query with ranked satellite-image matches, modalities and ground truth has not been supplied. The screenshots show a disconnected backend and documented static results.
- **V14-017 previously complete, now better evidenced:** repository `SUBMISSION_README.md` and `docs/PROJECT_STATUS.md` agree on F1@5 19.53%, F1@10 11.59%, Recall@1 53.03%, Recall@10 70.08%, evaluation mean search latency ≈0.146 ms, 3,248 paired test observations, 6,496 index vectors. Not reproduced independently.
- No live deployment was performed.


## V14.8 continuation — target accessibility and initial image priority

**One additional task locally verified:** V14-056. **Overall 50/73 verified, 23 remain open.**

- WCAG-sized control and reflow spot checks at 320, 390, 640, 1366 and 1440 CSS-pixel viewports for each role found zero clipped interactive controls in those views; full-page 390px control measurements found no control with a dimension under 24px. This is a local test, not an axe audit or 400% native browser-zoom certification.
- The skip-to-content link targets a programmatically focusable `main` landmark; verified in Chromium.
- Implemented forced-colors styling that keeps selected role, project filters, tabs, screenshot controls, and keyboard focus distinguishable under Windows High Contrast.
- EarthBridge's genuine static evaluation screenshot now receives the correct ML-role preload, not only OHS and NewsSources. The image is not claimed to show live inference.
- Targeted dark-theme contrast updates for instructional labels; a gradient-unaware automated scanner generated false positives in Full-Stack, so a full reliable WCAG contrast audit remains open (V14-055).
- 116/116 source tests, build, asset and metadata checks passed. 15 local browser role/viewport checks passed with zero JavaScript errors; forced-colors interaction/visual states checked at 390px for three roles.

**Still open:** V14-016 ranked EarthBridge query, 018 permission and privacy acceptance, 023 public canonical domain audit, 030–038 external links and hosted checks, 046 CSS architecture, 048 component-state consolidation, 055 formal contrast, 058 automated axe, 059 screen readers, 060 field performance, 066 visual transitions, 068 final visual audit, and 071–073 release.
