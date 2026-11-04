// Authentic, project-author-supplied screenshots. These are static captures,
// never simulated live data. Invite codes in the OHS capture were obscured.
const groups = [
  {id:'ohs',name:'Our Hidden Universe',kicker:'DEPLOYED PRODUCT / REACT + FIREBASE',intro:'A private social experience: homepage and Watch Together controls. The chat shown in the homepage screenshot is explicitly fictional sample content.',repo:'https://github.com/himanshu051116/our-hidden-universe',items:[
    ['ohs-home','Homepage & local preview','An OHS homepage with a self-described fictional sample chat. Invite code redacted for safe portfolio sharing.'],
    ['ohs-together','Watch Together & call panel','Watch room controls, manual playback coordination and private call readiness.']
  ]},
  {id:'news',name:'NewsSources',kicker:'ENGINEERING WORKSPACE / PYTHON + POSTGRESQL',intro:'The actual local analyst interface, including research, claims, search quality and tracked story states. The screen contents are snapshots, not a live data feed in this portfolio.',repo:'https://github.com/himanshu051116/NewsSources',items:[
    ['news-overview','Command centre','Activity and provenance-oriented news dashboard.'],
    ['news-brief','Daily brief','News briefing interface with original-source links.'],
    ['news-investigations','Investigations','Investigation, watchlist and analyst workflow state.'],
    ['news-entities','Entity directory','Entity discovery and approval-aware name matching.'],
    ['news-entity-detail','Entity profile','Recorded mentions and alias review screen.'],
    ['news-search-quality','Search quality','Search ranking evaluation controls and coverage checks.'],
    ['news-claims','Claims & evidence','Unresolved claim states, with missing evidence explicitly surfaced.']
  ]},
  {id:'mulyankan',name:'Mulyankan',kicker:'DEMONSTRATED PROTOTYPE / EVIDENCE-GROUNDED REVIEW',intro:'Real proposal review, submission and architecture-exploration interfaces. The Spatial Lab is an explanatory source snapshot, not a live backend.',repo:'https://github.com/himanshu051116/Algonauts-Mulyankan',items:[
    ['mulyankan-overview','Scrutiny dashboard','Coal R&D review overview with statuses and activity; proposal details redacted.'],
    ['mulyankan-submission','Proposal intake','Governed submission package and readiness checklist.'],
    ['mulyankan-history','Submission history','Human-review records, filters and proposal history; proposal details redacted.'],
    ['mulyankan-spatial-city','Spatial Lab · 3D city','Source-mapped 3D system overview; labelled not live.'],
    ['mulyankan-spatial-domains','Spatial Lab · domains','Component discovery and architecture domain navigation.'],
    ['mulyankan-spatial-inspect','Spatial Lab · inspection','Component-level exploration and documentation links.']
  ]},
  {id:'earthbridge',name:'EarthBridge',kicker:'RESEARCH PROTOTYPE / REAL CAPTURES + REPOSITORY-REPORTED RESULTS',intro:'Four authentic captures from the EarthBridge research interface. The API is offline in the workbench capture and the visual canvas is illustrative; the evaluation screen displays static metrics documented in the repository. No query-and-ranked-results screenshot was supplied.',repo:'https://github.com/himanshu051116/earthbridge',items:[
    ['earthbridge-evaluation','Reported evaluation evidence','Static metric values as shown in the research application; matched to EarthBridge SUBMISSION_README.md and docs/PROJECT_STATUS.md, not independently reproduced.'],
    ['earthbridge-workbench','Research workbench','Upload, sensor routing and illustrated observation canvas. API is explicitly disconnected; this is not a real retrieval result.'],
    ['earthbridge-architecture','Cross-sensor architecture','Sentinel-1/Sentinel-2 inputs, embedding space and FAISS index in a conceptual architecture view.'],
    ['earthbridge-results-empty','Empty results inspector','The result area and notes panel before retrieval; no ranked candidates or matching images are displayed.']
  ]},
  {id:'schoolbuddies',name:'SchoolBuddies',kicker:'EDUCATION OUTREACH / VISUAL PROJECT MATERIAL',intro:'Workshop programme poster supplied for this portfolio. It describes a student-led hands-on learning offering; it is not evidence that every proposed school workshop has been delivered.',repo:'https://github.com/himanshu051116/SCHOOLBUDDIES',items:[
    ['schoolbuddies-workshop','Workshop overview','AI, coding, web development and hackathon-thinking workshop poster.']
  ]}
]
const entries=Object.fromEntries(groups.flatMap(g=>g.items.map(item=>[item[0],{url:'/evidence/'+item[0]+'.webp',name:item[1],desc:item[2]}])))
const screenDimensions={"ohs-home":[1606,1021],"ohs-together":[1504,1033],"news-overview":[1642,1048],"news-brief":[1132,1051],"news-investigations":[1633,1027],"news-entities":[1684,903],"news-entity-detail":[1371,1041],"news-search-quality":[1387,1009],"news-claims":[1300,988],"mulyankan-overview":[1277,899],"mulyankan-submission":[1687,1047],"mulyankan-history":[1663,1051],"mulyankan-spatial-city":[1687,1054],"mulyankan-spatial-domains":[1449,1051],"mulyankan-spatial-inspect":[1666,1057],'earthbridge-evaluation':[1657,1045],'earthbridge-workbench':[1680,1050],'earthbridge-architecture':[1653,1045],'earthbridge-results-empty':[1393,1057],"schoolbuddies-workshop":[1365,2048]}

// Evidence notes are grounded in the actual author-supplied screens. They describe
// visible UI states, not a claim that a hosted service or ML system is operational.
export const SCREEN_RECORDS = {
 'ohs-home': {kind:'Product interface',shows:'Landing page, private-space invitation flow, and a fictional sample chat.',boundary:'The code is redacted. A screenshot cannot validate authentication or real-time delivery.'},
 'ohs-together': {kind:'Product interface',shows:'Watch-room title and source selection, session controls and a private-call readiness panel.',boundary:'Call availability and multi-device synchronization require separate live testing.'},
 'news-overview': {kind:'Local analyst workspace',shows:'An event overview with report counts, an attention queue and source-oriented navigation.',boundary:'Counts refer to the displayed local dataset, not a continuously audited global news feed.'},
 'news-brief': {kind:'Local analyst workspace',shows:'The daily briefing view, publisher labels and article source links.',boundary:'The screenshot records the interface at capture time; it does not verify every article.'},
 'news-investigations': {kind:'Local analyst workspace',shows:'Investigation and watchlist controls, with zero active investigations shown.',boundary:'An empty workspace is not proof that collaboration or automation has run.'},
 'news-entities': {kind:'Local analyst workspace',shows:'Registered people and organisations directory, alias search and filters.',boundary:'Names and aliases require editorial checks; matches alone do not establish identity.'},
 'news-entity-detail': {kind:'Local analyst workspace',shows:'An entity profile with associated record counts, identity fields and alias controls.',boundary:'Mention counts describe stored matches, not independent verification or endorsement.'},
 'news-search-quality': {kind:'Local evaluation controls',shows:'Search evaluation mode and a release-gate panel; semantic coverage is shown as unavailable.',boundary:'This is a configuration/status screen, not a successful measured search benchmark.'},
 'news-claims': {kind:'Local analyst workspace',shows:'Multiple claims classified as having insufficient evidence and zero source lineages.',boundary:'These labels indicate unresolved review, not that a claim has been proven false.'},
 'mulyankan-overview': {kind:'Evaluation prototype',shows:'Proposal overview, status distribution and an advisory score; project titles have been redacted.',boundary:'The score belongs to a prototype view; it is not an institutional funding decision.'},
 'mulyankan-submission': {kind:'Evaluation prototype',shows:'Governed intake form, mandatory attachments and zero-percent package readiness.',boundary:'A blank form shows the input contract; it is not proof that a proposal was processed.'},
 'mulyankan-history': {kind:'Evaluation prototype',shows:'Stored submission records with search, sorting and review-status labels; identifying titles redacted.',boundary:'Status labels are not independent certification of underlying evaluations.'},
 'mulyankan-spatial-city': {kind:'Explanatory 3D lab',shows:'A navigable architecture city presenting a source-mapped system overview.',boundary:'The screenshot explicitly labels the source snapshot as not live.'},
 'mulyankan-spatial-domains': {kind:'Explanatory 3D lab',shows:'Seven architecture domains and the available exploration controls.',boundary:'Architecture modules illustrate system components; they are not individually verified services.'},
 'mulyankan-spatial-inspect': {kind:'Explanatory 3D lab',shows:'A component inspector with source references and explanatory processing stages.',boundary:'Possible implementation notes are explanations, not observed real-time OCR execution.'},
 'earthbridge-evaluation': {kind:'Static, repository-reported research metrics',shows:'The submission-reported cross-modal F1@5 19.53%, F1@10 11.59%, validation Recall@1 53.03%, Recall@10 70.08%, 3,248 paired observations, 6,496 indexed vectors, 128-dimensional embedding and ~0.146 ms evaluation-time mean search latency.',boundary:'These are static figures from the EarthBridge submission documents, not independently reproduced, live inference, or evidence of a successful retrieval in this screenshot. See SUBMISSION_README.md and docs/PROJECT_STATUS.md.'},
 'earthbridge-workbench': {kind:'Research application interface / API offline',shows:'Research workbench with Sentinel-2 to Sentinel-1 route selection, an empty input-drop area, synthetic reference canvas and a disconnected API status.',boundary:'API offline, no image uploaded, no ranked match displayed. Synthetic map imagery is explicitly not a model-generated result.'},
 'earthbridge-architecture': {kind:'Documented system-design visualization',shows:'Input modalities, learned 128-dimensional descriptor, FAISS retrieval index and ranked-output architecture.',boundary:'Design diagram; this screenshot does not show a loaded model, trained artifacts or successful API request.'},
 'earthbridge-results-empty': {kind:'Research application interface / no result',shows:'The empty ranked retrieval region, analysis protocol, inspection controls and local research notes.',boundary:'No retrieval query was performed and no real top-k matches are shown; analysis notes are manual, not independently validated evidence.'},
 'schoolbuddies-workshop': {kind:'Outreach programme material',shows:'The workshop proposal, topic coverage and school-facing activities.',boundary:'This poster is programme material, not measured proof of delivered workshop outcomes.'}
}
export const totalCaptures=groups.reduce((sum,group)=>sum+group.items.length,0)
const escMedia=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')
export const capture=(id)=>entries[id]?.url||''
export function evidenceGalleryMarkup(){
 const tabbed=groups.map((g,i)=>`<button type="button" role="tab" id="evidence-tab-${g.id}" aria-controls="evidence-panel-${g.id}" aria-selected="${i===0}" tabindex="${i===0?'0':'-1'}" data-evidence-tab="${g.id}"><small>${String(i+1).padStart(2,'0')} / ${g.items.length} CAPTURE${g.items.length!==1?'S':''}</small><strong>${escMedia(g.name)}</strong></button>`).join('')
 const panels=groups.map((g,i)=>{
  const first=entries[g.items[0][0]]
  return `<section role="tabpanel" id="evidence-panel-${g.id}" aria-labelledby="evidence-tab-${g.id}" data-evidence-panel="${g.id}" ${i!==0?'hidden':''}>
   <div class="captureHeading"><div><span>${escMedia(g.kicker)}</span><h3>${escMedia(g.name)}</h3><p>${escMedia(g.intro)}</p></div><a href="${escMedia(g.repo)}" target="_blank" rel="noopener noreferrer">Inspect project source ↗</a></div>
   <div class="captureFrame"><button class="captureExpand" type="button" data-capture-open aria-label="Enlarge current ${escMedia(g.name)} screenshot"><img loading="lazy" decoding="async" width="${screenDimensions[g.items[0][0]][0]}" height="${screenDimensions[g.items[0][0]][1]}" src="${first.url}" alt="${escMedia(first.desc)}" data-capture-main/><span class="captureExpandIcon" aria-hidden="true">↗ Inspect full screenshot</span></button><div class="captureFrameMeta"><span>SCREENSHOT / STATIC CAPTURE <b data-capture-count>01 / ${String(g.items.length).padStart(2,'0')}</b></span><strong data-capture-title>${escMedia(first.name)}</strong><p data-capture-description>${escMedia(first.desc)}</p><div class="captureInspect" aria-live="polite" aria-atomic="true"><div><small>WHAT IS VISIBLE</small><p data-capture-shows>${escMedia(SCREEN_RECORDS[g.items[0][0]].shows)}</p></div><div><small>VALIDATION BOUNDARY</small><p data-capture-boundary>${escMedia(SCREEN_RECORDS[g.items[0][0]].boundary)}</p></div></div><div class="captureMetaActions"><a data-capture-original href="${first.url}" target="_blank" rel="noopener noreferrer">Open full image ↗</a><button type="button" data-capture-copy>Copy image link ↗</button></div><span class="captureCopyStatus" data-capture-status role="status" aria-live="polite"></span></div></div>
   <div class="captureNavigator"><div class="captureNavDetails"><span data-capture-kind>${escMedia(SCREEN_RECORDS[g.items[0][0]].kind)}</span><strong data-capture-progress>01 / ${String(g.items.length).padStart(2,'0')} — ${escMedia(first.name)}</strong></div><div class="captureNavButtons"><button type="button" data-capture-prev-inline aria-label="Previous screenshot in ${escMedia(g.name)}">← Previous</button><button type="button" data-capture-next-inline aria-label="Next screenshot in ${escMedia(g.name)}">Next →</button></div></div><div class="captureThumbnails" role="group" aria-label="Choose a ${escMedia(g.name)} screenshot">${g.items.map((it,j)=>{const item=entries[it[0]];return `<button type="button" data-capture-select="${it[0]}" aria-pressed="${j===0}" class="${j===0?'active':''}" aria-label="Show ${escMedia(item.name)}"><img loading="lazy" decoding="async" width="${screenDimensions[it[0]][0]}" height="${screenDimensions[it[0]][1]}" src="${item.url}" alt=""/><span>${String(j+1).padStart(2,'0')} · ${escMedia(item.name)}</span></button>`}).join('')}</div>
   </section>`}).join('')
 return `<section id="field-proof" class="proofGallery section" aria-labelledby="field-proof-title"><div class="wrap"><div class="proofGalleryTop"><div><span class="proofGalleryKicker">FIELD NOTES / AUTHENTIC INTERFACES</span><h2 id="field-proof-title">See the work.<br><em>Not a render.</em></h2></div><div class="proofGalleryTopMeta"><strong>${totalCaptures}</strong><span>PROJECT-AUTHOR SUPPLIED VISUAL RECORDS<br>${groups.length} PROJECTS · 1 MISSING RANKED-RETRIEVAL EXAMPLE</span><p>EarthBridge UI and a repository-reported evaluation screen are included. A genuine query with ranked satellite-image matches is still needed; the ML simulator remains synthetic.</p></div></div><div class="proofGalleryTabs" role="tablist" aria-label="Choose project screenshots">${tabbed}</div><div class="proofGalleryPanels">${panels}</div><div class="proofGalleryNote">SCREENSHOT POLICY <span>Original interface captures, converted to web-friendly format. The OHS invite code and Mulyankan proposal details are obscured. EarthBridge shows an offline API and static documented evaluation metrics, not live inference. Captures do not independently verify availability or model performance.</span></div></div><dialog id="captureLightbox" class="captureLightbox" aria-labelledby="captureLightboxTitle"><div class="captureLightboxHeader"><strong id="captureLightboxTitle">Project screenshot</strong><button type="button" data-capture-close aria-label="Close screenshot viewer">Close ✕</button></div><img alt="" id="captureLightboxImage"/><p id="captureLightboxDescription"></p><div class="captureLightboxControls"><button type="button" data-capture-prev>← Previous</button><span>ESC TO CLOSE · LEFT/RIGHT TO BROWSE</span><button type="button" data-capture-next>Next →</button></div></dialog></section>`
}
export function setupEvidenceGallery(){
 const heroPanels=[...document.querySelectorAll('[data-product-panel]')]
 for (const panel of heroPanels) {
  panel.querySelectorAll('[data-hero-screen]').forEach(button=>button.addEventListener('click',()=>{
   const real=button.dataset.heroScreen==='real'
   panel.classList.toggle('heroShowEvidence',real)
   panel.querySelectorAll('[data-hero-screen]').forEach(b=>{
    const active=b===button;b.classList.toggle('isActive',active);b.setAttribute('aria-pressed',String(active))
   })
  }))
 }
 const tabs=[...document.querySelectorAll('[data-evidence-tab]')];const panels=[...document.querySelectorAll('[data-evidence-panel]')]
 const lightbox=document.getElementById('captureLightbox');const lightimg=document.getElementById('captureLightboxImage');const lightTitle=document.getElementById('captureLightboxTitle');const lightDesc=document.getElementById('captureLightboxDescription')
 let currentGroup='ohs',priorFocus=null
 const validImage=(group,id)=>groups.some(g=>g.id===group&&g.items.some(item=>item[0]===id))
 const evidenceLink=(group,id)=>`${location.origin}${location.pathname}${location.search}#proof/${group}/${id}`
 function readHash(){const match=location.hash.match(/^#proof\/([a-z]+)\/([a-z-]+)$/);return match&&validImage(match[1],match[2])?{group:match[1],id:match[2]}:null}
 function writeHash(group,id){try{history.replaceState(null,'',location.pathname+location.search+`#proof/${group}/${id}`)}catch{/* preview frame may not expose a writable origin */}}

 function activePanel(){return panels.find(p=>p.dataset.evidencePanel===currentGroup)}
 function activeSelection(panel){return panel?.querySelector('[data-capture-select][aria-pressed=true]')}
 function selectTab(id,focus=false,persist=false){
  const group=groups.find(g=>g.id===id);if(!group)return
  currentGroup=id
  tabs.forEach(b=>{const chosen=b.dataset.evidenceTab===id;b.setAttribute('aria-selected',String(chosen));b.tabIndex=chosen?0:-1;if(chosen&&focus)b.focus()})
  panels.forEach(p=>p.hidden=p.dataset.evidencePanel!==id)
  if(persist){const selected=activeSelection(activePanel());writeHash(id,selected?.dataset.captureSelect||group.items[0][0])}
 }
 function updateCapture(id,persist=true){
  const entry=entries[id],record=SCREEN_RECORDS[id],panel=activePanel()
  if(!entry||!record||!panel||!validImage(currentGroup,id))return
  const group=groups.find(g=>g.id===currentGroup)
  const index=group.items.findIndex(item=>item[0]===id)
  const count=`${String(index+1).padStart(2,'0')} / ${String(group.items.length).padStart(2,'0')}`
  const main=panel.querySelector('[data-capture-main]')
  main.src=entry.url;main.alt=entry.desc;main.width=screenDimensions[id][0];main.height=screenDimensions[id][1]
  panel.querySelector('[data-capture-title]').textContent=entry.name
  panel.querySelector('[data-capture-description]').textContent=entry.desc
  panel.querySelector('[data-capture-shows]').textContent=record.shows
  panel.querySelector('[data-capture-boundary]').textContent=record.boundary
  panel.querySelector('[data-capture-kind]').textContent=record.kind
  panel.querySelector('[data-capture-count]').textContent=count
  panel.querySelector('[data-capture-progress]').textContent=`${count} — ${entry.name}`
  panel.querySelector('[data-capture-original]').href=entry.url
  panel.querySelector('[data-capture-status]').textContent=''
  panel.querySelectorAll('[data-capture-select]').forEach(b=>{const chosen=b.dataset.captureSelect===id;b.classList.toggle('active',chosen);b.setAttribute('aria-pressed',String(chosen))})
  if(persist)writeHash(currentGroup,id)
 }
 function step(n,focus=false){
  const panel=activePanel();if(!panel)return
  const options=[...panel.querySelectorAll('[data-capture-select]')]
  const pos=options.indexOf(activeSelection(panel))
  const next=(pos+n+options.length)%options.length
  const id=options[next].dataset.captureSelect
  updateCapture(id)
  if(focus){options[next].focus();options[next].scrollIntoView({block:'nearest',inline:'nearest'})}
  if(lightbox?.open)updateZoom(id)
 }
 async function copyEvidenceLink(){
  const panel=activePanel(),selected=activeSelection(panel)
  if(!panel||!selected)return
  const link=evidenceLink(currentGroup,selected.dataset.captureSelect)
  const status=panel.querySelector('[data-capture-status]')
  try{
   if(!navigator.clipboard?.writeText)throw Error('Clipboard not available')
   await navigator.clipboard.writeText(link)
   status.textContent='Image link copied to clipboard.'
  }catch{status.textContent=`Clipboard unavailable. Copy this URL: ${link}`}
 }
 function updateZoom(id){const entry=entries[id];if(!entry)return;lightimg.src=entry.url;lightimg.alt=entry.desc;lightTitle.textContent=entry.name;lightDesc.textContent=entry.desc}
 function openZoom(){const panel=panels.find(p=>p.dataset.evidencePanel===currentGroup);const selected=activeSelection(panel);if(!selected)return;priorFocus=document.activeElement;updateZoom(selected.dataset.captureSelect);lightbox?.showModal()}
 // Hero screenshots are genuinely inspectable, not misleading case-study links.
 // Reuse the existing focus-trapping <dialog>, project tabs, captions and
 // next/previous navigation so there is one screenshot viewer implementation.
 document.querySelectorAll('[data-hero-proof-open]').forEach(button=>button.addEventListener('click',()=>{
  const id=button.dataset.heroProofOpen
  const group=groups.find(g=>g.items.some(item=>item[0]===id))?.id
  if(!validImage(group,id))return
  selectTab(group)
  updateCapture(id,false)
  currentGroup=group
  priorFocus=button
  updateZoom(id)
  lightbox?.showModal()
 }))
 tabs.forEach((b,i)=>{
  b.addEventListener('click',()=>selectTab(b.dataset.evidenceTab,false,true))
  b.addEventListener('keydown',ev=>{
   if(!['ArrowRight','ArrowLeft','Home','End'].includes(ev.key))return
   ev.preventDefault()
   const j=ev.key==='Home'?0:ev.key==='End'?tabs.length-1:(i+(ev.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length
   selectTab(tabs[j].dataset.evidenceTab,true,true)
  })
 })
 for(const panel of panels){
  panel.addEventListener('click',ev=>{
   const b=ev.target.closest('[data-capture-select]')
   if(b){currentGroup=panel.dataset.evidencePanel;updateCapture(b.dataset.captureSelect)}
   else if(ev.target.closest('[data-capture-open]')){currentGroup=panel.dataset.evidencePanel;openZoom()}
   else if(ev.target.closest('[data-capture-prev-inline]')){currentGroup=panel.dataset.evidencePanel;step(-1)}
   else if(ev.target.closest('[data-capture-next-inline]')){currentGroup=panel.dataset.evidencePanel;step(1)}
   else if(ev.target.closest('[data-capture-copy]')){currentGroup=panel.dataset.evidencePanel;copyEvidenceLink()}
  })
  panel.querySelectorAll('[data-capture-select]').forEach(button=>button.addEventListener('keydown',ev=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return
   ev.preventDefault();currentGroup=panel.dataset.evidencePanel
   const buttons=[...panel.querySelectorAll('[data-capture-select]')]
   if(ev.key==='Home'){updateCapture(buttons[0].dataset.captureSelect);buttons[0].focus()}
   else if(ev.key==='End'){const last=buttons.at(-1);updateCapture(last.dataset.captureSelect);last.focus()}
   else step(ev.key==='ArrowRight'?1:-1,true)
  }))
 }
 document.querySelector('[data-capture-close]')?.addEventListener('click',()=>lightbox.close())
 document.querySelector('[data-capture-prev]')?.addEventListener('click',()=>step(-1))
 document.querySelector('[data-capture-next]')?.addEventListener('click',()=>step(1))
 lightbox?.addEventListener('keydown',ev=>{
  if(ev.key==='ArrowRight'){ev.preventDefault();step(1)}
  else if(ev.key==='ArrowLeft'){ev.preventDefault();step(-1)}
 })
 lightbox?.addEventListener('click',ev=>{if(ev.target===lightbox)lightbox.close()})
 lightbox?.addEventListener('close',()=>{if(priorFocus?.isConnected)priorFocus.focus()})
 function syncMode(){
  const deep=readHash()
  if(deep){selectTab(deep.group);updateCapture(deep.id,false);return}
  const role=document.body.dataset.role||'fullstack'
  selectTab(role==='fullstack'?'ohs':role==='software'?'news':'earthbridge')
 }
 // Deep links are stable per screenshot and survive role changes and refreshes.
 function restoreHash(){const deep=readHash();if(!deep)return;selectTab(deep.group);updateCapture(deep.id,false);document.getElementById('field-proof')?.scrollIntoView({behavior:'instant',block:'start'})}
 document.querySelectorAll('[data-switch-role]').forEach(b=>b.addEventListener('click',()=>{
  const u=new URL(location.href);if(readHash()){u.hash='';try{history.replaceState(null,'',u.pathname+u.search)}catch{}}
  syncMode()
 }))
 document.querySelectorAll('.projectCard a[href="#field-proof"]').forEach(a=>a.addEventListener('click',()=>{
  const project=a.closest('.projectCard')?.dataset.project
  const id=({ '01':'mulyankan','02':'earthbridge','03':'ohs','04':'news','06':'schoolbuddies' })[project]
  if(id)selectTab(id)
 }))
 window.addEventListener('popstate',syncMode)
 window.addEventListener('hashchange',restoreHash)
 syncMode()
 if(readHash())requestAnimationFrame(restoreHash)
 return {selectTab,updateCapture,openZoom}
}
