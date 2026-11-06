# V21.8 — Real-page browser and static-performance release gate

The V21.7 experience is retained. V21.8 adds a repeatable browser smoke test and a built-output size budget. It does **not** claim measured field Core Web Vitals or mobile hardware/audio verification.

## Full repository check

Run `npm run verify`. This compiles pages, runs the Node suite, local-content/metadata audits and `audit:performance`. The new audit reads **built** files, evaluates their gzip sizes, and confirms all 11 key routes and five original media/résumé assets. Its byte values are gzip estimates, not actual HTTP transfer sizes; its limits are regression budgets, not performance guarantees.

## Real-page Chromium check (opt-in)

Serve the build locally: `npm run build && python3 -m http.server 8172 --directory dist`.
Install test-only browser dependencies without modifying the lockfile: `npm install --no-save --no-package-lock playwright` and `npx playwright install chromium`.
Run `PORTFOLIO_BASE_URL=http://127.0.0.1:8172 node scripts/qa-v218-browser.mjs`.

It tests seven viewport widths, search/list/inspector states, restored mobile links, dossier routes, the screenshot modal's Escape behavior, and original Mulyankan video metadata loading. Tests use actual built pages, not fixture markup, but this is a headless Linux environment and cannot verify real-phone audio output or real user-perceived smoothness.

## Safety and release

No production promotion; push to an isolated feature branch only. Existing V21.2.1 source is the base, V21.3–21.7 changes are cumulative. Keep screenshots, original video/audio and all résumé choices unchanged.
