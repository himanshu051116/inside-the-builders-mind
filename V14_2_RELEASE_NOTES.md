# V14.2 / Project discoverability & access

- Added working, keyboard-operable role filters to the secondary project archive, with correct aria-pressed state and result announcement.
- Standardized product status wording in main project cards while preserving author-defined underlying status descriptions.
- Added visible mobile skip-to-section shortcuts.
- Increased essential secondary font sizes, touch target minimums, and shared focus styles.
- Corrected mobile navigation Escape behavior.
- Deferred hidden role hero imagery rather than marking all images high-priority.
- Split legacy stylesheet into eleven feature-owned CSS sources under `styles/`, without changing cascade order; build outputs compatibility `portfolio.css`. No claim of unused-selector elimination until full coverage testing.
- Held V14 user-facing copy and project evidence provenance unchanged.
- No GitHub/Vercel/AWS changes performed.

Verification: **42/73 V14 tasks verified locally**, 84/84 automated tests, 29 targeted browser interaction checks, 15 role/viewport checks. See `V14_PROGRESS.md` for every task ID and outstanding gates.
