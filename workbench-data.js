// ORIGINAL FICTIONAL EXAMPLES. These do not represent real evaluations or private records.
// All outcomes are deterministic and computed locally; no LLM or backend is involved.
export const reviewCases = [
  {
    id: 'validation', number: '01', label: 'Model validation', category: 'Evidence completeness',
    title: 'A claim is not the same as proof.',
    criterion: 'The proposal provides a reproducible validation plan and supporting results.',
    claim: '"Our satellite retrieval model is independently validated and ready for field evaluation."',
    guidance: 'For this exercise, a complete packet needs both recorded results and a documented evaluation split. A known conflicting revision remains open until the original conflict and its documented reconciliation are both reviewed.',
    required: ['results', 'split'],
    evidence: [
      { id: 'method', type: 'METHOD NOTE', name: 'Evaluation methodology', ref: 'DOC-01 · §2.4', role: 'context', excerpt: 'The proposed evaluation will rank image matches using retrieval metrics and will report performance for each input modality.', explanation: 'Describes an intention, not evidence that evaluation occurred.' },
      { id: 'results', type: 'TEST RECORD', name: 'Retrieval results', ref: 'DOC-02 · Table 3', role: 'support', excerpt: 'A completed experiment table records per-modality retrieval measurements and sample counts, with evaluation script version and run date.', explanation: 'Shows results exist; the split still matters for reproducibility.' },
      { id: 'split', type: 'DATA PROTOCOL', name: 'Held-out split record', ref: 'DOC-03 · §1.2', role: 'support', excerpt: 'Dataset record describes how scenes were separated between train and evaluation groups to prevent near-duplicate leakage.', explanation: 'Supports the claim that the evaluation used a documented separation protocol.' },
      { id: 'revision', type: 'REVISION ALERT', name: 'Unresolved figure mismatch', ref: 'DOC-04 · Review note', role: 'conflict', excerpt: 'A later revision quotes different retrieval results for the same experiment ID without explaining the discrepancy.', explanation: 'The figures conflict; independent reconciliation is necessary before approval.' },
      { id: 'resolution', type: 'RECONCILIATION', name: 'Independent rerun and signed reconciliation', ref: 'DOC-05 · QA sign-off', role: 'resolution', resolves: 'revision', excerpt: 'An independent rerun identifies the incorrect transcription, cites the original logs and records a reviewer-approved correction.', explanation: 'A hypothetical record explaining which version is valid and why.' }
    ]
  },
  {
    id: 'budget', number: '02', label: 'Project feasibility', category: 'Cross-document checks',
    title: 'The budget has to add up.',
    criterion: 'A proposal supports its timeline with a consistent resource and budget plan.',
    claim: '"The proposed pilot can run for 12 months using the allocated implementation budget."',
    guidance: 'A complete packet needs a cost breakdown and a month-by-month staffing plan. A contradictory budget memo remains a blocker until the discrepant memo and the reconciliation record are reviewed.',
    required: ['costs', 'staffing'],
    evidence: [
      { id: 'summary', type: 'PROPOSAL', name: 'Executive summary', ref: 'PLAN-01 · p. 1', role: 'context', excerpt: 'The pilot has a fixed yearly budget and will cover initial deployment, field testing and documentation.', explanation: 'Asserts feasibility but does not itemize expenditure or staff allocation.' },
      { id: 'costs', type: 'COST SHEET', name: 'Itemized budget', ref: 'PLAN-02 · Appendix B', role: 'support', excerpt: 'An itemized cost sheet includes infrastructure, staffing, equipment, field visits and an explicit contingency allocation.', explanation: 'Provides a way to inspect costs rather than relying on a total alone.' },
      { id: 'staffing', type: 'WORK PLAN', name: '12-month resource schedule', ref: 'PLAN-03 · Gantt', role: 'support', excerpt: 'The work plan assigns named roles and scheduled effort to build, validation, rollout and reporting phases.', explanation: 'Allows review of whether the execution timeline is resourced.' },
      { id: 'overrun', type: 'AUDIT NOTE', name: 'Conflicting budget total', ref: 'PLAN-04 · Revision 2', role: 'conflict', excerpt: 'A revision reports a higher overall budget than the signed cost sheet, without reconciliation or a change approval.', explanation: 'An unresolved difference prevents a clean feasibility decision.' },
      { id: 'resolution', type: 'RECONCILIATION', name: 'Approved revised cost baseline', ref: 'PLAN-05 · Change control', role: 'resolution', resolves: 'overrun', excerpt: 'A signed change-control record reconciles the two budget totals and documents the scope adjustment and approved baseline.', explanation: 'A hypothetical reconciliation that must be checked alongside the original discrepancy.' }
    ]
  },
  {
    id: 'security', number: '03', label: 'Security readiness', category: 'Human oversight',
    title: 'A checklist is not an audit.',
    criterion: 'The system has documented access controls and test evidence supporting the stated release readiness.',
    claim: '"The service is security-reviewed and suitable for a controlled pilot."',
    guidance: 'A complete packet needs an access-control test and a recorded remediation sign-off. A known critical finding blocks approval until both the original finding and verified remediation record are examined.',
    required: ['tests', 'signoff'],
    evidence: [
      { id: 'policy', type: 'SECURITY PLAN', name: 'Access policy document', ref: 'SEC-01 · §3', role: 'context', excerpt: 'The intended access model distinguishes administrator, reviewer and participant permissions.', explanation: 'A design document does not prove that authorization was tested.' },
      { id: 'tests', type: 'QA EVIDENCE', name: 'Permission test log', ref: 'SEC-02 · Run 14', role: 'support', excerpt: 'The QA record includes both authorized and unauthorized route attempts, expected results and environment identifiers.', explanation: 'Recorded negative tests help substantiate access-control behavior.' },
      { id: 'signoff', type: 'REVIEW RECORD', name: 'Remediation sign-off', ref: 'SEC-03 · Approval', role: 'support', excerpt: 'The reviewer confirms the tracked findings were resolved or explicitly accepted for the limited pilot scope.', explanation: 'Documents human review of known findings and scope.' },
      { id: 'finding', type: 'UNRESOLVED FINDING', name: 'Open critical issue', ref: 'SEC-04 · Finding 7', role: 'conflict', excerpt: 'A separate review lists a critical authorization bypass as open in the same release candidate.', explanation: 'An unresolved critical issue is incompatible with an unqualified readiness claim.' },
      { id: 'resolution', type: 'REMEDIATION RECORD', name: 'Retest and security sign-off', ref: 'SEC-05 · Retest 17', role: 'resolution', resolves: 'finding', excerpt: 'A dedicated negative test verifies the authorization fix in the same release candidate; a separate reviewer signs the remediation record.', explanation: 'A hypothetical proof-of-fix that must be reviewed together with the critical finding.' }
    ]
  }
]
