import test from 'node:test'
import assert from 'node:assert/strict'
import { reviewCases } from '../workbench-data.js'
import { evaluatePacket } from '../workbench-logic.js'

for (const reviewCase of reviewCases) {
  test(`${reviewCase.id}: incomplete initially`, () => {
    const actual = evaluatePacket(reviewCase, [])
    assert.equal(actual.state, 'incomplete')
    assert.equal(actual.coverage, 0)
    assert.equal(actual.canApprove, false)
  })
  test(`${reviewCase.id}: requires all support`, () => {
    for (const id of reviewCase.required) {
      const remaining = reviewCase.required.filter(x => x !== id)
      assert.equal(evaluatePacket(reviewCase, remaining).state, 'incomplete')
    }
    const complete = evaluatePacket(reviewCase, reviewCase.required)
    assert.equal(complete.coverage, 100)
    assert.equal(complete.state, 'conflict')
    assert.equal(complete.canApprove, false) // Cannot hide a known contradiction by excluding it
  })
  test(`${reviewCase.id}: conflict takes precedence`, () => {
    const conflicting = reviewCase.evidence.find(x => x.role === 'conflict')
    const result = evaluatePacket(reviewCase, [...reviewCase.required, conflicting.id])
    assert.equal(result.state, 'conflict')
    assert.equal(result.canApprove, false)
    assert.equal(result.conflicts.length, 1)
  })
  test(`${reviewCase.id}: only full discrepancy reconciliation permits review`, () => {
    const conflict = reviewCase.evidence.find(x => x.role === 'conflict')
    const resolution = reviewCase.evidence.find(x => x.role === 'resolution')
    const claimOnly = evaluatePacket(reviewCase, [...reviewCase.required, resolution.id])
    assert.equal(claimOnly.state, 'conflict')
    const uncorrected = evaluatePacket(reviewCase, [...reviewCase.required, conflict.id])
    assert.equal(uncorrected.state, 'conflict')
    const corrected = evaluatePacket(reviewCase, [...reviewCase.required, conflict.id, resolution.id])
    assert.equal(corrected.state, 'supported')
    assert.equal(corrected.canApprove, true)
    assert.equal(corrected.conflicts.length, 0)
    assert.equal(corrected.resolvedIssues.length, 1)
    const concealed = evaluatePacket(reviewCase, [...reviewCase.required, resolution.id])
    assert.equal(concealed.canApprove, false)
  })
  test(`${reviewCase.id}: context never substitutes for required proof`, () => {
    const context = reviewCase.evidence.filter(x => x.role === 'context').map(x=>x.id)
    assert.equal(evaluatePacket(reviewCase, context).coverage, 0)
  })
}

// The portable review note must explain what is and is not supported by the packet.
const { formatReviewReport } = await import('../workbench-ui.js')
for (const reviewCase of reviewCases) {
  test(`${reviewCase.id}: exported report preserves audit rationale`, () => {
    const issue = reviewCase.evidence.find(x=>x.role==='conflict')
    const resolution = reviewCase.evidence.find(x=>x.role==='resolution')
    const selected = [...reviewCase.required,issue.id,resolution.id]
    const summary = evaluatePacket(reviewCase,selected)
    const report = formatReviewReport(reviewCase,selected,summary,[{number:1,message:'Sample record attached',ref:'DEMO'}],'Ready for human review')
    assert.match(report,/FICTIONAL REVIEW REPORT/)
    assert.match(report,/Required evidence coverage: 100%/)
    assert.match(report,/RECONCILED DISCREPANCIES/)
    assert.ok(report.includes(issue.ref))
    assert.ok(report.includes(resolution.ref))
    assert.match(report,/No records were uploaded/)
  })
}
