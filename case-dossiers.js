// V14.1 — Source-grounded editorial records. All test links are source references,
// not claims that remote services or hardware have been exercised by this portfolio.
export const caseDossiers = Object.freeze({
 ohs: {
  problem: 'Cross-device collaboration must reconcile asynchronous updates, authorization and reconnects without confusing a local UI preview with a real shared session.',
  decision: 'Keep React interaction code separate from Firebase subscriptions and message encryption. Subscribe to a room-scoped collection, own the unsubscribe lifecycle, and handle message decryption failures explicitly.',
  tradeoff: 'Firestore provides a convenient realtime data plane, but connection health, client clocks, permissions and synchronized playback still require end-to-end integration checks.',
  reproducible: 'Inspect subscribeToEncryptedMessages in src/services/chatService.js and the encrypt/decrypt functions. The visible site screenshots document interface states, not messaging latency or audited privacy.',
  expected: 'A listener can unsubscribe; errors are passed to the supplied error callback; a client with the correct shared secret can read a valid encrypted message. This is source behavior to verify, not a measured production SLA.',
  state: 'Deployed UI; authenticated multi-user validation not independently performed here.',
  evidence: [
   ['Firestore message subscription', 'https://github.com/himanshu051116/our-hidden-universe/blob/main/src/services/chatService.js'],
   ['Encryption implementation', 'https://github.com/himanshu051116/our-hidden-universe/blob/main/src/services/encryption.js'],
   ['Watch Together page', 'https://github.com/himanshu051116/our-hidden-universe/blob/main/src/pages/UniverseTogether.jsx'],
  ]
 },
 news: {
  problem: 'Multiple workers can race to process a discovered URL; an expired lease must not let its former owner overwrite the result of a newer attempt.',
  decision: 'Use a leased frontier record and a version/fencing check at persistence. A new claimant increments the lease version so an old writer is rejected instead of silently corrupting the article state.',
  tradeoff: 'Leases and retry scheduling improve failure visibility but add migration, clock and transaction complexity. They do not guarantee publisher availability or correct extraction.',
  reproducible: 'Open test_expired_candidate_is_reclaimed_and_old_writer_is_rejected in the PostgreSQL integration suite. Configure NEWSINTEL_TEST_DATABASE_URL to a dedicated migrated test database; the test skips if this environment variable is absent.',
  expected: 'The expired candidate is reclaimed with a higher lease_version; a stale writer raises a lease-lost error. No live PostgreSQL test has been run by this portfolio build.',
  state: 'In development; source-backed integration test and documented pipeline, not a hosted live backend.',
  evidence: [
   ['Lease fencing integration test', 'https://github.com/himanshu051116/NewsSources/blob/main/backend/tests/integration/test_article_repository_postgres.py'],
   ['Crawler policy unit tests', 'https://github.com/himanshu051116/NewsSources/blob/main/backend/tests/unit/test_crawl_policy.py'],
   ['Pipeline failure and retry design', 'https://github.com/himanshu051116/NewsSources/blob/main/docs/PIPELINE_OVERVIEW.md'],
  ]
 },
 mulyankan: {
  problem: 'A numerical proposal score becomes misleading if required document evidence is missing or the model is forced to give a complete total.',
  decision: 'Use deterministic scheme and eligibility rules ahead of advisory ML, restrict scoring to evidence-backed rubric criteria, and allow abstention rather than inventing unsupported totals.',
  tradeoff: 'Evidence gating protects traceability but can increase manual review and leave unscored proposals; model confidence must not be treated as expert consensus.',
  reproducible: 'Read EVALUATION_SYSTEM.md for the version-bound evidence-release policy. Compare the authentic screenshot showing insufficient evidence with the advisory assessment screenshot in the project repository.',
  expected: 'Missing evidence may lead to abstention with no official total; a human reviewer retains final authority. The current model is bootstrap weak-supervision and is not externally validated for institutional approval.',
  state: 'Demonstrated decision-support prototype; full hosted server/database/queue operation is not implied by the browser UI.',
  evidence: [
   ['Evaluation and abstention contract', 'https://github.com/himanshu051116/Algonauts-Mulyankan/blob/main/EVALUATION_SYSTEM.md'],
   ['Authentic insufficient-evidence screenshot', 'https://github.com/himanshu051116/Algonauts-Mulyankan/blob/main/docs/assets/screenshots/evidence-insufficient-assessment.png'],
   ['Human scrutiny dashboard screenshot', 'https://github.com/himanshu051116/Algonauts-Mulyankan/blob/main/docs/assets/screenshots/scrutiny-dashboard.png'],
  ]
 },
 earthbridge: {
  problem: 'Good-looking nearest-neighbor examples do not establish cross-modal generalization, especially if paired images leak across training and evaluation.',
  decision: 'Validate paired manifests and splits before training; generate gallery descriptors, evaluate same-modal and cross-modal directions at defined cutoffs, and run an exact-pair overfit diagnostic.',
  tradeoff: 'A strict evaluation contract adds preprocessing and diagnostics. An exact-pair overfit success checks the training pipeline, not real-world generalization.',
  reproducible: 'Review SUBMISSION_README.md and docs/PROJECT_STATUS.md, then inspect scripts/evaluate_descriptors.py and tests/test_descriptor_eval.py. To reproduce the result, obtain the original dataset, checkpoint, manifest and gallery descriptors; the portfolio includes only screenshots and source links.',
  expected: 'The repository reports cross-modal F1@5 = 19.53%, F1@10 = 11.59%, full-validation Recall@1 = 53.03%, Recall@10 = 70.08%, and evaluation-time mean retrieval latency ≈ 0.146 ms on a 3,248-pair / 6,496-vector test set. Figures are quoted from final submission docs, not rerun or externally verified here.',
  state: 'Research prototype. Four genuine interface screenshots now available, including a static evaluation page; the workbench was offline and no real query-and-ranked-retrieval screenshot has been provided.',
  evidence: [
   ['Published final metrics and evaluation notes', 'https://github.com/himanshu051116/earthbridge/blob/main/SUBMISSION_README.md'],
   ['Project status and metric provenance', 'https://github.com/himanshu051116/earthbridge/blob/main/docs/PROJECT_STATUS.md'],
   ['Descriptor evaluation script', 'https://github.com/himanshu051116/earthbridge/blob/main/scripts/evaluate_descriptors.py'],
   ['Cross-modal metric unit tests', 'https://github.com/himanshu051116/earthbridge/blob/main/tests/test_descriptor_eval.py'],
   ['128-pair overfit diagnostic', 'https://github.com/himanshu051116/earthbridge/blob/main/scripts/run_tiny_overfit_matrix.py'],
  ]
 }
})
