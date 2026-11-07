// V11: genuine source-linked evidence exploration, role-specific shortcuts, and
// privacy-respecting in-page command search. All operations are local DOM state.
export function setupV11Experience(){
 const tabButtons=[...document.querySelectorAll('[data-atlas-tab]')]
 const panels=[...document.querySelectorAll('[data-atlas-panel]')]
 const atlasStatus=document.getElementById('atlasStatus')
 const names={ohs:'Our Hidden Universe',news:'NewsSources',mulyankan:'Mulyankan',earthbridge:'EarthBridge'}
 function selectCase(value,{focus=false}={}){
   if(!Object.hasOwn(names,value))return
   for(const b of tabButtons){const on=b.dataset.atlasTab===value;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;b.classList.toggle('isActive',on);if(on&&focus)b.focus()}
   for(const p of panels)p.hidden=p.dataset.atlasPanel!==value
   if(atlasStatus)atlasStatus.textContent=`${names[value]} engineering evidence selected.`
 }
 tabButtons.forEach((b,i)=>{
   b.addEventListener('click',()=>{
     selectCase(b.dataset.atlasTab);
     document.dispatchEvent(new CustomEvent('portfolio:case-selection',{detail:{caseId:b.dataset.atlasTab}}));
   })
   b.addEventListener('keydown',event=>{
     if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return
     event.preventDefault()
     const next=event.key==='Home'?0:event.key==='End'?tabButtons.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabButtons.length)%tabButtons.length
     const targetCase=tabButtons[next].dataset.atlasTab;
     selectCase(targetCase,{focus:true});
     document.dispatchEvent(new CustomEvent('portfolio:case-selection',{detail:{caseId:targetCase}}));
   })
 })
 const caseGrid=document.getElementById('caseFilesGrid')
 const caseToggle=document.getElementById('caseNotesToggle')
 caseToggle?.addEventListener('click',()=>{
   const open=caseToggle.getAttribute('aria-expanded')!=='true'
   caseGrid.hidden=!open
   caseToggle.setAttribute('aria-expanded',String(open))
   caseToggle.innerHTML=open?'Collapse case notes <span aria-hidden="true">↗</span>':'Expand all case notes <span aria-hidden="true">↘</span>'
 })
 // The selected source audit follows the selected résumé track.
 const focusByMode={fullstack:'ohs',software:'news',ml:'earthbridge'}
 function syncProofRoutes(){
   const role=document.body.dataset.role||'fullstack'
   for(const el of document.querySelectorAll('[data-proof-route]'))el.hidden=el.dataset.proofRoute!==role
 }
 function syncRole(){
   const role=document.body.dataset.role||'fullstack'
   selectCase(focusByMode[role]||'ohs')
   syncProofRoutes()
 }
 // Role styling and role-specific evidence visibility follow a single
 // presentation event. Do not infer a new case from a legacy button click.
 document.addEventListener('portfolio:apply-role-view',syncProofRoutes)
 window.addEventListener('popstate',syncProofRoutes)
 syncRole()
 // Handle #case links by revealing the corresponding source record. The related
 // engineering note stays available to expand independently.
 function activateHash(){
   const found=location.hash.match(/^#case-(ohs|news|earthbridge|mulyankan)$/)
   if(found){
     selectCase(found[1])
     // Reveal the complete matching case rather than scrolling to a collapsed note.
     if(caseGrid){caseGrid.hidden=false}
     if(caseToggle){caseToggle.setAttribute('aria-expanded','true');caseToggle.innerHTML='Collapse case notes <span aria-hidden="true">↗</span>'}
     const article=document.getElementById(`case-${found[1]}`)
     if(article){article.querySelector('.caseFileDetails')?.setAttribute('open','');article.scrollIntoView({behavior:'auto',block:'start'})}
   }
 }
 window.addEventListener('hashchange',activateHash)
 // Workspace/URL navigation owns the route. This source-record view listens
 // without creating a second browser-history entry.
 document.addEventListener('portfolio:case-route',ev=>{
   if(Object.hasOwn(names,ev.detail?.caseId))selectCase(ev.detail.caseId)
 })
 const selectedCaseByProject={'our-hidden-universe':'ohs',newssources:'news',mulyankan:'mulyankan',earthbridge:'earthbridge'}
 document.addEventListener('portfolio:navigation-committed',ev=>{
   syncProofRoutes()
   const selected=selectedCaseByProject[ev.detail?.project]
   if(selected)selectCase(selected)
 })
 activateHash()
 // The screenshot can fail on private, offline, or restricted browser networks.
 // Never substitute a synthetic image for a missing real project image.
 for(const img of document.querySelectorAll('.atlasScreenshot img')){
   function fallback(){
     const box=img.closest('.atlasScreenshot')
     if(!box||box.classList.contains('imageSourceUnavailable'))return
     img.hidden=true;box.classList.add('imageSourceUnavailable')
     const a=document.createElement('a')
     a.href='https://github.com/himanshu051116/Algonauts-Mulyankan/tree/main/docs/assets/screenshots'
     a.rel='noopener noreferrer';a.target='_blank';a.textContent='Open the original Mulyankan screenshots ↗'
     box.append(a)
   }
   img.addEventListener('error',fallback)
   if(img.complete&&!img.naturalWidth)fallback()
 }
 const dialog=document.getElementById('commandDialog')
 const trigger=document.getElementById('commandTrigger')
 const close=document.getElementById('commandClose')
 const search=document.getElementById('commandSearch')
 const empty=document.getElementById('commandEmpty')
 const resultStatus=document.getElementById('commandResultsStatus')
 const entries=[...document.querySelectorAll('#commandResults button,#commandResults a')]
 const shortcut=document.getElementById('commandShortcut')
 if(shortcut)shortcut.textContent=/(Mac|iPhone|iPad)/i.test(navigator.platform||'')?'⌘ K':'Ctrl K'
 let restoreFocus=null
 function applySearch(){
   const query=search.value.trim().toLowerCase()
   let visible=0
   for(const el of entries){
     const hay=(el.textContent+' '+(el.dataset.paletteKeywords||'')).toLowerCase()
     el.hidden=query!==''&&!hay.includes(query)
     if(!el.hidden)visible++
   }
   // Group labels collapse along with their currently hidden category items.
   for(const label of document.querySelectorAll('#commandResults .commandGroupName')){
     let next=label.nextElementSibling,any=false
     while(next&&!next.classList.contains('commandGroupName')){any=any||!next.hidden;next=next.nextElementSibling}
     label.hidden=!any
   }
   empty.hidden=visible>0
   if(resultStatus)resultStatus.textContent=`${visible} matching action${visible===1?'':'s'} available.`
 }
 function openDialog(){
   if(!dialog||dialog.open)return
   restoreFocus=document.activeElement
   dialog.showModal();search.value='';applySearch();search.focus()
 }
 function closeDialog(){if(!dialog?.open)return;dialog.close();restoreFocus?.focus?.()}
 trigger?.addEventListener('click',openDialog)
 close?.addEventListener('click',closeDialog)
 search?.addEventListener('input',applySearch)
 // The native dialog traps focus. Arrow keys additionally let keyboard users
 // traverse the filtered list without repeatedly pressing Tab.
 const visibleActions=()=>entries.filter(el=>!el.hidden)
 search?.addEventListener('keydown',ev=>{
   const options=visibleActions()
   if(ev.key==='ArrowDown'&&options.length){ev.preventDefault();options[0].focus()}
   else if(ev.key==='ArrowUp'&&options.length){ev.preventDefault();options.at(-1).focus()}
   else if(ev.key==='Enter'&&options.length){ev.preventDefault();options[0].click()}
 })
 for(const item of entries){
   item.addEventListener('keydown',ev=>{
     if(!['ArrowDown','ArrowUp','Home','End'].includes(ev.key))return
     const options=visibleActions(),index=options.indexOf(item)
     if(index<0||!options.length)return
     ev.preventDefault()
     const destination=ev.key==='Home'?0:ev.key==='End'?options.length-1:
       (index+(ev.key==='ArrowDown'?1:-1)+options.length)%options.length
     options[destination].focus()
     options[destination].scrollIntoView({block:'nearest'})
   })
 }
 document.addEventListener('keydown',ev=>{
   if(ev.key==='Escape'&&dialog.open){ev.preventDefault();closeDialog();return}
   if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){
     ev.preventDefault();dialog.open?closeDialog():openDialog()
   }
 })
 dialog?.addEventListener('click',ev=>{if(ev.target===dialog)closeDialog()})
 dialog?.addEventListener('close',()=>{if(restoreFocus?.isConnected)restoreFocus.focus()})
 for(const el of entries){
   el.addEventListener('click',()=>{
     if(el.dataset.paletteRole){
       const b=document.querySelector(`[data-switch-role="${el.dataset.paletteRole}"]`)
       const v20=document.querySelector(`[data-v20-role="${el.dataset.paletteRole}"]`)
       ;(v20||b)?.click()
       document.getElementById(v20?'v20-workspace':'top')?.scrollIntoView({behavior:'auto'})
     } else if(el.tagName==='A'&&el.hash?.startsWith('#case-')){
       selectCase(el.hash.substring(6))
     }
     closeDialog()
   })
 }
 return {selectCase,openDialog,closeDialog}
}
