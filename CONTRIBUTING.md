# Contributing and development

This repository is the maintainer's personal portfolio and a source of documentation about separate projects. Constructive bug reports and accessibility or performance improvements are welcome. **Opening an issue or pull request does not imply an open-source license or permission to reuse source media.**

## Local checks

1. Use Node.js 22 or later.
2. Clone the repository and create a descriptive branch.
3. Start development with `npm run dev`.
4. Run `npm ci && npm run verify` before submitting changes (build, Node tests, local audit, metadata audit). Run `npx playwright install chromium` and `npm run smoke:browser` for navigation, layout or media changes.
5. Check the exact affected interaction in a real browser at desktop and mobile widths; for navigation changes also test keyboard, Back/Forward, and direct links.
6. Describe actual evidence, remaining limitations and rollback risk in the PR.

## Source ownership and constraints

- `content.js`: project identity, links and status.
- `case-dossiers.js`: source-backed engineering decisions and validation limitations.
- `v20-workspace.js` + `v207-route.js`: project inspection and committed navigation state.
- `v19-milestone-video.js`: original recorded demo and silent, visibility-based preview.
- `public/evidence/manifest.json`: original screenshot manifest with IDs used in deep links.
- `scripts/build.mjs`: ordered static bundle and asset copying.

Do not fabricate screenshots, evaluation metrics, live service behavior, researcher affiliation, or source citations. Preserve user-submitted media, redacted private identifiers, original audio, and role-specific public PDF links. Do not add an invisible tracking service or external analytics without approval.

## Pull-request checklist

- [ ] Change is scoped and documented.
- [ ] `npm run verify` passes.
- [ ] Updated behavior has regression coverage or a written reason why not.
- [ ] Real browser behavior (desktop/mobile/keyboard) is reviewed where applicable.
- [ ] Original project source links and status labels remain accurate.
- [ ] No new secrets, private credentials, or personal contact details are exposed.
- [ ] Hosting changes are previewed before any production promotion.

See [testing](docs/testing/README.md) and the [current changelog](CHANGELOG.md).
