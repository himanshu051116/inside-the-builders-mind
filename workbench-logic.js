/**
 * Deterministic educational review engine. No private records or AI scoring.
 * Known material contradictions cannot be suppressed by excluding them from the
 * selected packet: a reconciliation is valid only when BOTH records are reviewed.
 */
export function evaluatePacket(reviewCase, selected) {
  const attached = new Set(selected)
  const evidence = reviewCase.evidence.filter(item => attached.has(item.id))
  const missing = reviewCase.required.filter(id => !attached.has(id))
  const support = evidence.filter(item => item.role === 'support')
  const known = reviewCase.evidence.filter(item => item.role === 'conflict')
  const openIssues = known.filter(issue => !reviewCase.evidence.some(item =>
    item.role === 'resolution' && item.resolves === issue.id &&
    attached.has(issue.id) && attached.has(item.id)
  ))
  const resolvedIssues = known.filter(issue => !openIssues.some(item => item.id === issue.id))
  const total = reviewCase.required.length
  const coverage = total ? Math.round((total - missing.length) / total * 100) : 100
  const state = missing.length ? 'incomplete' : openIssues.length ? 'conflict' : 'supported'
  return {
    state, coverage, missing,
    conflicts: openIssues, resolvedIssues, knownIssues: known,
    supportCount: support.length, attachedCount: evidence.length,
    canApprove: state === 'supported'
  }
}

export const outcomeText = {
  incomplete: {
    title: 'Evidence requirements incomplete', action: 'Attach the required supporting records',
    body: 'The required evidence is missing. Known discrepancies remain in scope even when their documents are not selected.'
  },
  supported: {
    title: 'Packet ready for human judgment', action: 'Eligible for reviewer approval',
    body: 'Required documents are attached and known discrepancies are explicitly reconciled. This is not an automatic endorsement of the underlying claim.'
  },
  conflict: {
    title: 'Known discrepancy unresolved', action: 'Review contradiction and reconciliation',
    body: 'Sufficient supporting records exist, but a known material issue remains open. Hiding the original conflict does not restore approval.'
  }
}
