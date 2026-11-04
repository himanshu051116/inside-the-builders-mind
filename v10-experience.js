// V10 enhancements: keep controls accessible, keep case studies discoverable.
export function setupV10Experience(){
 // The actual Mulyankan screenshot comes from its public source repository. When a
 // visitor is offline or GitHub image hosting is blocked, show a source link,
 // never a broken-image icon or a made-up replacement screenshot.
 const authenticSources={
  '01':'https://github.com/himanshu051116/Algonauts-Mulyankan/tree/main/docs/assets/screenshots',
  '03':'https://github.com/himanshu051116/our-hidden-universe',
  '04':'https://github.com/himanshu051116/NewsSources',
  '06':'https://github.com/himanshu051116/SCHOOLBUDDIES',
  'case-mulyankan':'https://github.com/himanshu051116/Algonauts-Mulyankan/tree/main/docs/assets/screenshots',
  'case-ohs':'https://github.com/himanshu051116/our-hidden-universe',
  'case-news':'https://github.com/himanshu051116/NewsSources'
 }
 for(const img of document.querySelectorAll('.caseSourceCapture img,.verifiedImage img')){
   const fallback=()=>{
     const box=img.parentElement
     if(box.classList.contains('imageSourceUnavailable'))return
     img.hidden=true
     box.classList.add('imageSourceUnavailable')
     const card=img.closest('[data-project]')
     const note=img.closest('[id^="case-"]')
     const key=card?.dataset.project||note?.id
     const url=authenticSources[key]
     const message=document.createElement('p')
     message.textContent='The captured interface image is unavailable in this browser. Its absence is not replaced with an illustration.'
     message.className='evidenceOfflineMessage'
     box.append(message)
     if(url){
      const link=document.createElement('a')
      link.className='evidenceOfflineFallback'
      link.href=url
      link.target='_blank';link.rel='noopener noreferrer'
      link.textContent='Inspect this project’s original source ↗'
      box.append(link)
     }
   }
   img.addEventListener('error',fallback)
   if(img.complete&&!img.naturalWidth)fallback()
 }
 const grid=document.getElementById('projectGrid')
 const toggle=document.getElementById('galleryViewToggle')
 const prev=document.getElementById('deckPrev')
 const next=document.getElementById('deckNext')
 const progress=document.getElementById('deckProgress')
 const ariaStatus=document.createElement('span')
 ariaStatus.className='srOnly';ariaStatus.setAttribute('role','status');ariaStatus.setAttribute('aria-live','polite')
 toggle?.insertAdjacentElement('afterend',ariaStatus)
 let isGrid=false
 toggle?.addEventListener('click',()=>{
   isGrid=!isGrid;grid.classList.toggle('isGrid',isGrid)
   toggle.setAttribute('aria-pressed',String(isGrid))
   toggle.textContent=isGrid?'Return to swipe view':'View all as grid'
   prev.hidden=next.hidden=progress.hidden=isGrid
   grid.setAttribute('aria-label',isGrid?'Project grid, all visible cards':'Scrollable portfolio project gallery')
   ariaStatus.textContent=isGrid?'Project grid enabled.':'Swipeable project deck enabled.'
 })
 // Recruiter default: show every project without requiring a horizontal carousel.
 if(toggle && !isGrid) toggle.click()
 const caseGrid=document.getElementById('caseFilesGrid')
 const cases=Array.from(caseGrid?.querySelectorAll('.caseFile')||[])
 const order={fullstack:['ohs','mulyankan','news','earthbridge'],software:['news','mulyankan','ohs','earthbridge'],ml:['earthbridge','mulyankan','news','ohs']}
 function updateMode(){
   const mode=document.body.dataset.role||'fullstack'
   order[mode]?.forEach((key,i)=>{
     const card=cases.find(c=>c.id==='case-'+key)
     if(!card)return
     caseGrid.append(card);card.classList.toggle('caseFeatured',i===0)
   })
   document.querySelectorAll('[data-archive-lenses]').forEach(el=>{
     el.classList.toggle('archiveRelevant',el.dataset.archiveLenses.split(' ').includes(mode))
   })
 }
 document.querySelectorAll('[data-switch-role]').forEach(b=>b.addEventListener('click',updateMode))
 window.addEventListener('popstate',updateMode)
 updateMode()
}
