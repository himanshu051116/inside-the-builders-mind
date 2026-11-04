# V14.6 — EarthBridge evidence integration

- Integrated four genuine, project-author supplied EarthBridge interface captures from November 4, 2026: static evaluation evidence, disconnected research workbench, system architecture, and empty results inspector.
- All images compressed to WebP with exact SHA-256 hashes and original-file attribution in `public/evidence/manifest.json`.
- Replaced Applied ML hero placeholder with actual EarthBridge evaluation UI. It is clearly labelled as a static screenshot of repository-reported figures, **not live model inference**.
- Expanded the screenshot gallery from 16 to 20 images across 5 projects. Full-size zoom and hash deep-links support the EarthBridge group.
- Verified submission metrics against the public repository’s `SUBMISSION_README.md` and `docs/PROJECT_STATUS.md`: cross-modal F1@5 19.53%, F1@10 11.59%, Recall@1 53.03%, Recall@10 70.08%, mean evaluation-time search latency approx 0.146 ms, 3,248 paired test samples and 6,496 gallery vectors. Results **not independently recomputed**.
- Checklist V14-004 may now be marked locally verified. V14-016 **remains blocked** until a real query with ranked retrieved images and ground truth is available.
- No GitHub, Vercel or AWS deployments in this release.
