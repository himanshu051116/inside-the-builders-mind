# V20.7 — Navigation Foundation

Baseline: `preview/v20-6-deep-evidence-navigation` at `50fb39ff18b2dcd88878323749e477c2c0231121`.

This is a **non-destructive foundation**, not yet the multi-page rollout. The V20.6 recruiter homepage, archive, six-project explorer, three role-specific visual experiences, three résumé PDFs, genuine Mulyankan videos, annotations, case dossiers, and interactive labs remain present.

## Changes
- `v207-route.js` owns parsing and writing URL state for the V20 workspace. It validates roles/panels, keeps the original project query and hash on shared links, and retains unrelated query parameters.
- Repeated project/role selections avoid redundant history entries; panel changes still use `replaceState`.
- On Back/Forward, missing project and panel parameters now restore the selected role's documented defaults rather than retaining a stale project.
- Restricted or no-op history environments report that local UI state could not be shared as an updated URL.
- `career-modes.js` defers history restoration to the V20 workspace when present; legacy-only behavior remains available.
- `scripts/build.mjs` copies the new navigation module to the static output.

## Validating
Run `npm run verify` on Node 22 or newer.
Additional focused tests: `node --test tests/v207-route.test.mjs`.

Preview deep link:
`/?utm_source=chatgpt.com&view=fullstack&project=our-hidden-universe&panel=media#case-files`

Test scenarios:
1. Full-Stack, Software, Applied ML role transitions update the corresponding résumé, sorting and default project.
2. Select a project, then navigate Back/Forward; restore role, project and panel without duplicate history.
3. Navigate back to a URL without `project`; confirm it selects that role's default project.
4. Repeat-select the same project or role; ensure history does not gain another entry.
5. Open legacy `#case-files`, `#case-news` and `#field-proof` links; the original content remains available.
6. Play both original presenter recordings with sound, explore saved screenshot annotation hotspots, and download all three public résumé PDFs.
7. Check 390px, 768px and desktop layouts for horizontal overflow, focus restoration and content clipping.

## Next phases
V20.8 will introduce a concise recruiter-first Home and a dedicated Work route while preserving old URLs. V20.9 will consolidate duplicate technical records, then the Lab can move to its own route. Only retire the original archive after an explicit feature-parity review.

This branch is a staging area: do not merge it into `main` or replace the verified V20.6 preview without browser acceptance.
