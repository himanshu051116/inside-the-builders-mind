// V10 enhancements: keep controls accessible, keep case studies discoverable.
export function setupV10Experience(){
 // The actual Mulyankan screenshot comes from its public source repository. When a
 // visitor is offline or GitHub image hosting is blocked, show a source link,
 // never a broken-image icon or a made-up replacement screenshot.
 for(const img of document.querySelectorAll('.caseSourceCapture img,.verifiedImage img')){
   const fallback=()=>{
     const box=img.parentElement
     if(box.classList.contains('imageSourceUnavailable'))return
     img.hidden=true
     box.classList.add('imageSourceUnavailable')
     const a=document.createElement('a')
     a.className='evidenceOfflineFallback'
     a.href='https://github.com/himanshu051116/Algonauts-Mulyankan/tree/main/docs/assets/screenshots'
     a.target='_blank';a.rel='noopener noreferrer'
     a.textContent='Open authentic Mulyankan screenshots in the source repository ↗'
     box.append(a)
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
