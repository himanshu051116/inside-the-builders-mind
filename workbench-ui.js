import { reviewCases } from './workbench-data.js'
import { evaluatePacket, outcomeText } from './workbench-logic.js'

const esc = input => String(input ?? '').replaceAll('&', '&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')
const chosenByCase = new Map(reviewCases.map(c => [c.id,new Set()]))
const historyByCase = new Map(reviewCases.map(c => [c.id,[]]))
const decisionsByCase = new Map()
let activeIndex = 0
let sequence = 0
const $ = id => document.getElementById(id)
const emit = (message, ref) => {
  const c = reviewCases[activeIndex]
  const trace = historyByCase.get(c.id)
  trace.push({number: ++sequence, message, ref})
  if (trace.length > 12) trace.shift()
}
const effectStatus = value => value === 'supported' ? 'ok' : value === 'conflict' ? 'danger' : 'warn'
// Avoid personal information: all built-in records are invented for the exercise.
export function formatReviewReport(reviewCase, selected, result, trace, decision) {
  const attached = new Set(selected)
  const lines = [
    'INSIDE THE BUILDER\'S MIND — FICTIONAL REVIEW REPORT',
    'Educational browser simulation. NOT an independent audit or real proposal evaluation.',
    '',
    `Case: ${reviewCase.label}`,
    `Claim: ${reviewCase.claim}`,
    `Criterion: ${reviewCase.criterion}`,
    `Finding: ${outcomeText[result.state].title}`,
    `Required evidence coverage: ${result.coverage}%`,
    `Approval eligible: ${result.canApprove ? 'Yes, for human judgment only' : 'No'}`,
    `Reviewer action: ${decision || 'No review decision recorded'}`,
    '',
    'SELECTED FICTIONAL DOCUMENTS',
    ...reviewCase.evidence.filter(item => attached.has(item.id))
      .map(item => `- ${item.ref} | ${item.name} [${item.role}]`),
    '',
    'MISSING REQUIRED DOCUMENTS',
    ...(result.missing.length ? result.missing.map(id=>`- ${reviewCase.evidence.find(item=>item.id===id)?.name || id}`) : ['None']),
    '',
    'KNOWN OPEN DISCREPANCIES',
    ...(result.conflicts.length ? result.conflicts.map(item=>`- ${item.name}: ${item.ref}`) : ['None']),
    '',
    'RECONCILED DISCREPANCIES',
    ...(result.resolvedIssues.length ? result.resolvedIssues.map(item=>`- ${item.name}: ${item.ref}`) : ['None']),
    '',
    'LOCAL SESSION TRACE (most recent 12 actions)',
    ...(trace.length ? trace.map(item=>`#${item.number} ${item.message}${item.ref?' | '+item.ref:''}`) : ['No actions recorded']),
    '',
    'This report uses locally generated fictional records. No records were uploaded.',
  ]
  return lines.join('\n') + '\n'
}


export function setupEvidenceWorkbench(){
  const root = $('workbenchApp')
  if (!root) return
  function render(){
    const c = reviewCases[activeIndex]
    const attached = chosenByCase.get(c.id)
    const result = evaluatePacket(c,attached)
    const outcome = outcomeText[result.state]
    const decision = decisionsByCase.get(c.id)
    root.innerHTML = `
    <div class="wbTop"><div><span class="wbActiveDot" aria-hidden="true"></span> EVIDENCE WORKBENCH <small>v5 / evidence studio</small></div><span class="wbTopHint">FICTIONAL RECORDS · EXPLICIT DISCREPANCY CONTROL</span></div>
    <div class="wbCases" role="group" aria-label="Choose a review scenario">${reviewCases.map((item,i)=>`<button class="wbCase ${i===activeIndex?'isActive':''}" type="button" data-case="${i}" aria-pressed="${i===activeIndex}"><span>CASE ${esc(item.number)}</span><strong>${esc(item.label)}</strong><small>${esc(item.category)}</small></button>`).join('')}</div>
    <div class="wbBody">
       <section class="wbPacket" aria-labelledby="wbCaseHeading"><div class="wbSectionEyebrow">01 / REVIEW PACKET</div>
         <h3 id="wbCaseHeading">${esc(c.title)}</h3><p class="wbCriterion">${esc(c.criterion)}</p>
         <div class="wbClaim"><span>CLAIM UNDER REVIEW</span><p>${esc(c.claim)}</p></div>
         <div class="wbEvidenceHeading"><div><strong>Document evidence</strong><span>Select supporting records, then inspect every known issue and its reconciliation.</span></div><span>${attached.size} / ${c.evidence.length} selected</span></div>
         <div class="wbGuided" role="group" aria-label="Example walkthrough"><button type="button" data-example="required">Attach required evidence</button><span>See why coverage alone does not resolve a known discrepancy.</span></div>
         <div class="wbEvidenceList">${c.evidence.map(item=>`<button type="button" class="wbEvidence ${attached.has(item.id)?'attached':''}" data-evidence="${esc(item.id)}" aria-pressed="${attached.has(item.id)}" aria-label="${attached.has(item.id)?'Detach':'Attach'} ${esc(item.name)}">
           <span class="wbEvidenceIcon" aria-hidden="true">${attached.has(item.id)?'✓':'+'}</span><span class="wbEvidenceText"><span class="wbEvidenceMeta">${esc(item.type)} · ${esc(item.ref)}</span><strong>${esc(item.name)}</strong><span class="wbEvidenceExcerpt">${esc(item.excerpt)}</span><span class="wbEvidenceReason">${esc(item.explanation)}</span></span><span class="wbAttachedIndicator">${attached.has(item.id)?'ATTACHED':'ATTACH +'}</span></button>`).join('')}</div>
         <p class="wbFinePrint">All records are fictional. Known material discrepancies remain in scope even if not attached. To clear one, select both its original record and the documented reconciliation.</p>
       </section>
       <aside class="wbAnalysis" aria-label="Review decision analysis"><div class="wbSectionEyebrow">02 / LIVE REVIEW ANALYSIS</div>
         <div class="wbVerdict verdict-${effectStatus(result.state)}" role="status" aria-live="polite"><span class="wbVerdictLabel">CURRENT FINDING</span><strong>${esc(outcome.title)}</strong><p>${esc(outcome.body)}</p></div>
         <div class="wbCoverageHead"><span>Required evidence coverage</span><strong>${result.coverage}%</strong></div><div class="wbCoverageTrack" role="progressbar" aria-label="Required evidence coverage" aria-valuenow="${result.coverage}" aria-valuemin="0" aria-valuemax="100"><span style="width:${result.coverage}%"></span></div>
         <div class="wbFacts"><div><span>Supporting records</span><strong>${result.supportCount}</strong></div><div><span>Missing requirements</span><strong>${result.missing.length}</strong></div><div><span>Open discrepancies</span><strong>${result.conflicts.length}</strong></div></div>
         <div class="wbReasoning"><span>WHY THIS RESULT?</span><p>${esc(c.guidance)}</p><p>${result.missing.length?'Not attached: '+esc(result.missing.map(id=>c.evidence.find(x=>x.id===id)?.name||id).join(', '))+'.':'All required evidence is attached.'}</p>${result.conflicts.length?`<p class="wbConflictText">Known open issues: ${esc(result.conflicts.map(x=>x.name).join(', '))}. They remain in scope even if not attached.</p>`:''}${result.resolvedIssues.length?`<p class="wbResolvedText">Reconciled after reviewing both records: ${esc(result.resolvedIssues.map(x=>x.name).join(', '))}.</p>`:''}</div>
         <div class="wbReviewActions"><div class="wbReviewHeading">Human reviewer action</div><p>${esc(outcome.action)}</p><button type="button" class="wbApprove" data-decision="approve" ${!result.canApprove?'disabled':''}>Approve reviewed packet ↗</button><button type="button" class="wbRequest" data-decision="request">${result.state==='supported'?'Request further verification':'Flag for human review'}</button><small>Approval requires supporting records plus review of each known contradiction and its resolution. Detaching a conflict cannot bypass the safeguard. Decisions stay in memory only.</small></div>
         ${decision?`<div class="wbDecisionReceipt" aria-live="polite"><span>LAST REVIEW ACTION</span><strong>${esc(decision)}</strong><small>Local simulation · not saved to a server</small></div>`:''}
         <div class="wbTrace"><div class="wbTraceHeading"><strong>Session trace</strong><button type="button" data-reset="case">Reset case</button></div><ol>${historyByCase.get(c.id).length?historyByCase.get(c.id).slice().reverse().slice(0,5).map(item=>`<li><span>${String(item.number).padStart(2,'0')}</span>${esc(item.message)}${item.ref?' · '+esc(item.ref):''}</li>`).join(''):'<li><span>00</span>No actions yet. Attach a document to begin.</li>'}</ol></div>
         <div class="wbExport"><button type="button" data-export="report">Download review note ↓</button><span>Plain text · local only · fictional content</span></div>
       </aside>
    </div><div class="wbBottom"><span>LOCAL-ONLY DEMO · NO ACCOUNT / UPLOAD / API</span><a href="https://github.com/himanshu051116/Algonauts-Mulyankan" target="_blank" rel="noopener noreferrer">Explore Mulyankan source ↗</a></div>`
    root.querySelectorAll('[data-case]').forEach(button=>button.addEventListener('click',()=>{
      activeIndex=Number(button.dataset.case)
      render()
      root.querySelector(`[data-case="${activeIndex}"]`)?.focus({preventScroll:true})
    }))
    root.querySelector('[data-example="required"]')?.addEventListener('click',()=>{
      c.required.forEach(id=>attached.add(id))
      decisionsByCase.delete(c.id)
      emit('Attached required evidence as an example')
      render()
      root.querySelector('[data-example="required"]')?.focus({preventScroll:true})
    })
    root.querySelector('[data-export="report"]')?.addEventListener('click',()=>{
      const report=formatReviewReport(c,attached,evaluatePacket(c,attached),historyByCase.get(c.id),decisionsByCase.get(c.id))
      const blob=new Blob([report],{type:'text/plain;charset=utf-8'})
      const url=URL.createObjectURL(blob)
      const link=document.createElement('a')
      link.href=url
      link.download=`builder-mind-${c.id}-review.txt`
      document.body.append(link)
      link.click()
      link.remove()
      // Revoke after the click has been initiated, without retaining a persistent URL.
      setTimeout(()=>URL.revokeObjectURL(url),1000)
    })
    root.querySelectorAll('[data-evidence]').forEach(button=>button.addEventListener('click',()=>{
      const item=c.evidence.find(x=>x.id===button.dataset.evidence)
      if (!item) return
      if (attached.has(item.id)) attached.delete(item.id); else attached.add(item.id)
      decisionsByCase.delete(c.id)
      emit(`${attached.has(item.id)?'Attached':'Detached'} ${item.name}`,item.ref)
      render()
      // Preserve keyboard operability after the dynamic rebuild.
      root.querySelector(`[data-evidence="${item.id}"]`)?.focus({preventScroll:true})
    }))
    root.querySelectorAll('[data-decision]').forEach(button=>button.addEventListener('click',()=>{
      const latest=evaluatePacket(c,attached)
      const kind=button.dataset.decision
      if (kind==='approve' && !latest.canApprove) return
      const statement=kind==='approve'?'Reviewer marked simulated packet ready for judgment':'Reviewer requested further verification'
      decisionsByCase.set(c.id,statement)
      emit(statement)
      render()
      root.querySelector(`[data-decision="${kind}"]`)?.focus({preventScroll:true})
    }))
    root.querySelector('[data-reset="case"]').addEventListener('click',()=>{
      chosenByCase.set(c.id,new Set())
      historyByCase.set(c.id,[])
      decisionsByCase.delete(c.id)
      render()
      root.querySelector('[data-reset="case"]')?.focus({preventScroll:true})
    })
  }
  render()
}
