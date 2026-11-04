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
    ['mulyankan-overview','Scrutiny dashboard','Coal R&D review overview with statuses and activity.'],
    ['mulyankan-submission','Proposal intake','Governed submission package and readiness checklist.'],
    ['mulyankan-history','Submission history','Human-review records, filters and proposal history.'],
    ['mulyankan-spatial-city','Spatial Lab · 3D city','Source-mapped 3D system overview; labelled not live.'],
    ['mulyankan-spatial-domains','Spatial Lab · domains','Component discovery and architecture domain navigation.'],
    ['mulyankan-spatial-inspect','Spatial Lab · inspection','Component-level exploration and documentation links.']
  ]},
  {id:'schoolbuddies',name:'SchoolBuddies',kicker:'EDUCATION OUTREACH / VISUAL PROJECT MATERIAL',intro:'Workshop programme poster supplied for this portfolio. It describes a student-led hands-on learning offering; it is not evidence that every proposed school workshop has been delivered.',repo:'https://github.com/himanshu051116/SCHOOLBUDDIES',items:[
    ['schoolbuddies-workshop','Workshop overview','AI, coding, web development and hackathon-thinking workshop poster.']
  ]}
]
const entries=Object.fromEntries(groups.flatMap(g=>g.items.map(item=>[item[0],{url:'/evidence/'+item[0]+'.webp',name:item[1],desc:item[2]}])))
const escMedia=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')
export const capture=(id)=>entries[id]?.url||''
export function evidenceGalleryMarkup(){
 const tabbed=groups.map((g,i)=>`<button type="button" role="tab" id="evidence-tab-${g.id}" aria-controls="evidence-panel-${g.id}" aria-selected="${i===0}" tabindex="${i===0?'0':'-1'}" data-evidence-tab="${g.id}"><small>${String(i+1).padStart(2,'0')} / ${g.items.length} CAPTURE${g.items.length!==1?'S':''}</small><strong>${escMedia(g.name)}</strong></button>`).join('')
 const panels=groups.map((g,i)=>{
  const first=entries[g.items[0][0]]
  return `<section role="tabpanel" id="evidence-panel-${g.id}" aria-labelledby="evidence-tab-${g.id}" data-evidence-panel="${g.id}" ${i!==0?'hidden':''}>
   <div class="captureHeading"><div><span>${escMedia(g.kicker)}</span><h3>${escMedia(g.name)}</h3><p>${escMedia(g.intro)}</p></div><a href="${escMedia(g.repo)}" target="_blank" rel="noopener noreferrer">Inspect project source ↗</a></div>
   <div class="captureFrame"><button class="captureExpand" type="button" data-capture-open aria-label="Enlarge current ${escMedia(g.name)} screenshot"><img loading="lazy" decoding="async" src="${first.url}" alt="${escMedia(first.desc)}" data-capture-main/><span class="captureExpandIcon">↗ Inspect full screenshot</span></button><div class="captureFrameMeta"><span>SCREENSHOT / STATIC CAPTURE</span><strong data-capture-title>${escMedia(first.name)}</strong><p data-capture-description>${escMedia(first.desc)}</p></div></div>
   <div class="captureThumbnails" role="group" aria-label="Choose a ${escMedia(g.name)} screenshot">${g.items.map((it,j)=>{const item=entries[it[0]];return `<button type="button" data-capture-select="${it[0]}" aria-pressed="${j===0}" class="${j===0?'active':''}" aria-label="Show ${escMedia(item.name)}"><img loading="lazy" decoding="async" src="${item.url}" alt=""/><span>${String(j+1).padStart(2,'0')} · ${escMedia(item.name)}</span></button>`}).join('')}</div>
   </section>`}).join('')
 return `<section id="field-proof" class="proofGallery section" aria-labelledby="field-proof-title"><div class="wrap"><div class="proofGalleryTop"><div><span class="proofGalleryKicker">FIELD NOTES / AUTHENTIC INTERFACES</span><h2 id="field-proof-title">See the work.<br><em>Not a render.</em></h2></div><div class="proofGalleryTopMeta"><strong>16</strong><span>PROJECT-AUTHOR SUPPLIED VISUAL RECORDS<br>4 PROJECTS · 1 PENDING RESEARCH SET</span><p>EarthBridge images and experiment results will be added when provided. The ML simulator elsewhere on this site remains clearly labeled as synthetic.</p></div></div><div class="proofGalleryTabs" role="tablist" aria-label="Choose project screenshots">${tabbed}</div><div class="proofGalleryPanels">${panels}</div><div class="proofGalleryNote">SCREENSHOT POLICY <span>Original interface captures, converted to web-friendly format. The OHS invite code is obscured. Images document an interface at capture time; they do not independently verify service availability or model performance.</span></div></div><dialog id="captureLightbox" class="captureLightbox" aria-labelledby="captureLightboxTitle"><div class="captureLightboxHeader"><strong id="captureLightboxTitle">Project screenshot</strong><button type="button" data-capture-close aria-label="Close screenshot viewer">Close ✕</button></div><img alt="" id="captureLightboxImage"/><p id="captureLightboxDescription"></p><div class="captureLightboxControls"><button type="button" data-capture-prev>← Previous</button><span>ESC TO CLOSE · LEFT/RIGHT TO BROWSE</span><button type="button" data-capture-next>Next →</button></div></dialog></section>`
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
 function selectTab(id,focus=false){if(!groups.some(g=>g.id===id))return;currentGroup=id;tabs.forEach(b=>{const chosen=b.dataset.evidenceTab===id;b.setAttribute('aria-selected',String(chosen));b.tabIndex=chosen?0:-1;if(chosen&&focus)b.focus()});panels.forEach(p=>p.hidden=p.dataset.evidencePanel!==id)}
 function activeSelection(panel){return panel?.querySelector('[data-capture-select][aria-pressed=true]')}
 function updateCapture(id){const entry=entries[id];if(!entry)return;const panel=panels.find(p=>p.dataset.evidencePanel===currentGroup);if(!panel)return
  panel.querySelector('[data-capture-main]').src=entry.url;panel.querySelector('[data-capture-main]').alt=entry.desc;panel.querySelector('[data-capture-title]').textContent=entry.name;panel.querySelector('[data-capture-description]').textContent=entry.desc
  panel.querySelectorAll('[data-capture-select]').forEach(b=>{const chosen=b.dataset.captureSelect===id;b.classList.toggle('active',chosen);b.setAttribute('aria-pressed',String(chosen))})
 }
 function step(n){const panel=panels.find(p=>p.dataset.evidencePanel===currentGroup);if(!panel)return;const options=[...panel.querySelectorAll('[data-capture-select]')];const pos=options.indexOf(activeSelection(panel));const next=(pos+n+options.length)%options.length;const id=options[next].dataset.captureSelect;updateCapture(id);if(lightbox?.open)updateZoom(id)}
 function updateZoom(id){const entry=entries[id];if(!entry)return;lightimg.src=entry.url;lightimg.alt=entry.desc;lightTitle.textContent=entry.name;lightDesc.textContent=entry.desc}
 function openZoom(){const panel=panels.find(p=>p.dataset.evidencePanel===currentGroup);const selected=activeSelection(panel);if(!selected)return;priorFocus=document.activeElement;updateZoom(selected.dataset.captureSelect);lightbox?.showModal()}
 tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectTab(b.dataset.evidenceTab));b.addEventListener('keydown',ev=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(ev.key))return;ev.preventDefault();const j=ev.key==='Home'?0:ev.key==='End'?tabs.length-1:(i+(ev.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectTab(tabs[j].dataset.evidenceTab,true)})})
 for(const panel of panels){panel.addEventListener('click',ev=>{const b=ev.target.closest('[data-capture-select]');if(b){currentGroup=panel.dataset.evidencePanel;updateCapture(b.dataset.captureSelect)}else if(ev.target.closest('[data-capture-open]')){currentGroup=panel.dataset.evidencePanel;openZoom()}})}
 document.querySelector('[data-capture-close]')?.addEventListener('click',()=>lightbox.close())
 document.querySelector('[data-capture-prev]')?.addEventListener('click',()=>step(-1));document.querySelector('[data-capture-next]')?.addEventListener('click',()=>step(1))
 lightbox?.addEventListener('keydown',ev=>{if(ev.key==='ArrowRight'){ev.preventDefault();step(1)}else if(ev.key==='ArrowLeft'){ev.preventDefault();step(-1)}})
 lightbox?.addEventListener('click',ev=>{if(ev.target===lightbox)lightbox.close()})
 lightbox?.addEventListener('close',()=>{if(priorFocus?.isConnected)priorFocus.focus()})
 // Align screenshot focus with the career track, while leaving all records discoverable.
 function syncMode(){const role=document.body.dataset.role||'fullstack';selectTab(role==='fullstack'?'ohs':role==='software'?'news':'mulyankan')}
 document.querySelectorAll('[data-switch-role]').forEach(b=>b.addEventListener('click',syncMode));window.addEventListener('popstate',syncMode);syncMode()
 return {selectTab,updateCapture,openZoom}
}
