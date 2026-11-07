# Testing and release checks

Run from the repository root with **Node.js 22+**.

```bash
npm run verify
```

The command builds `dist/`, runs the Node test suite, validates local references and metadata. It has no application runtime dependencies. The test suite includes route, career selection, project evidence, archived content, original video and responsive-style contracts. GitHub Actions runs this command on pushes and pull requests.

```bash
npm run dev         # local development server
npm run test        # build + Node test suite
npm run audit:local
npm run audit:metadata
npm run preview     # serve the built dist/ directory
```

## What is verified and what is not

| Test category | What it establishes | What it does not establish |
| --- | --- | --- |
| Node tests and static audits | Expected source behavior, content manifests, URL formats, build output | Live browser interactions or remote services |
| Browser smoke tests | Page loads, navigation, archive open/close, key assets and errors in Chromium | Cross-browser compliance, uptime or production SLAs |
| Source images and video checks | Original files are present and served | Truth of external project performance claims |
| Metadata audit | Vercel canonical domain, social previews, sitemap and structured data | AWS custom-domain deployment |
| Project evidence links | Source files are referenceable | Independent reproduction of reported experiment metrics |

## Before any deployment

- [ ] Latest branch builds without errors.
- [ ] All three career tracks and their corresponding PDF links work.
- [ ] Original Mulyankan muted preview pauses offscreen; full dialog preserves original audio.
- [ ] Archive opens only on click/Enter/Space, shows complete content and has a compact Close action.
- [ ] Case deep links restore the correct project and section; Back and Forward preserve committed selections.
- [ ] No unintended horizontal overflow at 320, 390 and desktop widths.
- [ ] Browser console shows no uncaught exceptions or missing same-origin assets.
- [ ] Screenshots are originals and simulated data is visibly labeled.
- [ ] Deploying to AWS? Confirm account permission, actual host, TLS, sitemap/canonical, and new host's links **after** deployment.

Browser checks can validate interactions but cannot prove security, performance under load, accessibility conformance or real-world research effectiveness. Document the actual test environment, version and methods for each externally reported result.
