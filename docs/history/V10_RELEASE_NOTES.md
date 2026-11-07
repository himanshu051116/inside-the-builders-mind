# V10 — recruiter-first, evidence-first release

## Shipped

- Rewrote the three role heroes to prominently identify the candidate, degree, specialty and actual project proof; shifted evidence strip below interactive demonstration to improve mobile first impression.
- Added four detailed, source-linked case files: OHS, NewsSources, Mulyankan, EarthBridge. Each covers engineering challenge, implementation decisions, verification and limitations.
- Added three resume-aligned secondary projects: IrisTrack, Coal Governance, Mulyankan Spatial Lab. Clearly differentiated experiments and prototypes from shipped products.
- Mulyankan uses authentic linked repository screenshots; never silently replaces broken image loads with fictional visuals. A styled source-link fallback appears when GitHub image serving is blocked.
- Added swipe/grid view toggle for six primary projects, with role-specific priority and keyboard-accessible buttons.
- Removed the second ML ranking renderer, leaving single ownership in `v8-interactions.js`.
- Removed seven legacy CSS files and shipped a single compiled `portfolio.css` source.
- Improved text contrast, focus rings, mobile spacing, gallery affordances and explanatory labels; removed intrusive floating workbench nudge.
- Corrected three one-page public résumé PDFs, eliminating malformed contact separator and private telephone. Removed an ambiguous internal EarthBridge accuracy claim until the precise evaluation can be evidenced.
- Added OG/Twitter preview PNGs, three role-specific share routes, JSON-LD person metadata, canonical URL, robots.txt and XML sitemap.
- Added static HTML fallback for when JavaScript fails.
- Tests: 46/46 automated checks; 22 in-browser interaction checks; 12 render-width/mode checks without horizontal overflow or JavaScript exceptions; PDF one-page and phone-number checks.

## Not completed / requires live verification

- Actual OHS and EarthBridge screenshots or sanitized saved experiment outputs were not available as transferable local assets. Those panels link to real source and are honestly labeled as simulations.
- The public Vercel site has not been updated to V10. Production browser and Core Web Vitals checks are pending a future explicit deployment request.
- Externally hosted project URLs and image delivery could not be independently verified end-to-end from this sandbox. A fallback is provided for the repository-hosted screenshots.
- Contrast and focus controls were improved, but a full assistive-technology/WCAG audit has not been carried out.
- Dynamic mode descriptions change in JavaScript, but crawlers see separate static `/share/{mode}/` social previews. Do not assume query-string URLs themselves get personalized social cards.

## Deployment

GitHub source → Vercel preview/production after user-authorized deployment. For the AWS Student Builder Challenge, separately connect the same GitHub repository to AWS Amplify Hosting and verify the AWS URL before submission.
