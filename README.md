# Inside the Builder’s Mind — V9 | Three Interactive Engineering Experiences

An original portfolio for the AWS Student Builder Challenge 2026. This is **one static website with three shareable interfaces**, tailored to the three supplied résumé specializations.

## Explore the interfaces

- `?view=fullstack` — Full-Stack Studio: illustrative OHS-inspired product preview with a **working local chat input** and **controllable simulated playback**. Not connected to OHS or any real participant.
- `?view=software` — Systems Console: restricted terminal plus clickable **NewsSources-inspired article ingestion trace**. Inspect discovery, normalization, duplicate handling, and provenance using fictional records. No shell, API, crawler, database or live ingestion is run.
- `?view=ml` — ML Research Lab: an interactive nearest-neighbor demonstration. Visitors choose optical/SAR/multispectral **synthetic 3D embeddings** and adjust structure-versus-spectrum weighting to compute cosine similarity over five synthetic records. This is **not EarthBridge inference, accuracy, validation data, or real satellite imagery**.

All modes preserve six engineering project cards, stage-of-development labels, expandable case studies, the skills section, About, and the separately interactive **Evidence Workbench** with contradiction safeguards and exportable fictional report.

## Visual identity / V9

Three independently styled interface environments share a single original portfolio identity. Original SVG terrain artworks, a custom collaborative-space scene, and an interactive source-provenance map are bundled locally. Their illustrative nature is clearly disclosed. The new V9 visual layer is `scene-v9.css` plus `scene-v9.js`; it does not need additional dependencies or credentials. For details, see `V9_RELEASE_NOTES.md`.

## Three resume downloads

The `public/resumes/` directory includes three one-page PDFs derived from the user-supplied Full-Stack, Software Developer, and ML résumés. **The telephone number was redacted, and the resulting PDFs were checked for remaining phone text.** Email and public GitHub/LinkedIn links remain. Review them personally before publication, including privacy, links and accuracy.

## Run

Requires Node.js. No `npm install` is needed.

```bash
npm run dev
npm test
npm run build
npm run preview
npm run audit:local
```

The manual static hosting ZIP contains the **contents** of `dist/`, with `index.html` at the archive root. For a Git-based AWS Amplify build, use `amplify.yml`, whose build command is `npm run build` and artifact directory is `dist`.

## Testing

- `node --test tests/*.test.mjs` exercises the workbench, mode prioritization, toy vector math and the V9 visual asset contracts (36 tests).
- `V9_VISUAL_QA.json` records Chromium **inline-assembly** checks at 320, 390, 768 and 1440 pixels (all three interfaces). Because sandbox browser navigation to localhost is blocked, these are not equivalent to testing the live AWS-hosted site.
- No outbound project URLs or public hosting were tested as part of this build.

## Before submitting

1. Create a **new public GitHub repository** for the portfolio. Set `profile.portfolioRepo` in `content.js` to its actual URL. Do not reuse a previously published portfolio.
2. Review the three public PDFs and confirm which contact data you wish to publish.
3. Verify each external project/demonstration link and consider adding genuine, permission-cleared app screenshots. Current project diagrams are original conceptual art—not real screenshots.
4. Deploy to AWS **Amplify Hosting** (GitHub-linked builds preferred), verify on an unauthenticated browser, test `?view=...` URLs and all interactions, and maintain uptime through judging.
5. Capture AWS console and live site evidence and **publish** the entry under the hackathon’s Your project tab.

### Honest scope

This is a functioning browser portfolio, not a deployment to AWS or a production AI/real-time collaboration/news system. Synthetic data are used throughout the educational demos. EarthBridge's reported 90% retrieval accuracy comes from an **internal evaluation reported in the supplied résumé**, not an independently verified benchmark.
