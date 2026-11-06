// V21.9 Home focus: hover previews, touch click and keyboard roving tabs.
export const V219_FOCUS=Object.freeze({
 fullstack:Object.freeze({description:'Private rooms, shared media and React/Firebase interfaces.',project:'our-hidden-universe',panel:'media'}),
 software:Object.freeze({description:'News ingestion, PostgreSQL and source tracing.',project:'newssources',panel:'architecture'}),
 ml:Object.freeze({description:'Sentinel-1/2 image retrieval and evaluation limits.',project:'earthbridge',panel:'evidence'})
});
export function setupV219Home(doc=document,win=window){
 const home=doc.getElementById('home');if(!home||home.dataset.v219Ready==='true')return false;
 const tablist=home.querySelector('[data-v219-tabs]'),panel=home.querySelector('#v219FocusPanel'),cta=home.querySelector('.v17MainCTA');
 if(!tablist||!panel||!cta)return false;
 const tabs=[...tablist.querySelectorAll('[data-v219-role]')];if(tabs.length!==3)return false;
 home.dataset.v219Ready='true';
 const roles=Object.keys(V219_FOCUS);
 const resumes=[...home.querySelectorAll('.v17ResumeChoices a')];
 const rail=[...home.querySelectorAll('.v19ProjectRail a[data-v20-open-project]')];
 const mouse=win.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches===true;
 const reduced=win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
 let selected='fullstack';
 function select(role){
  if(!Object.hasOwn(V219_FOCUS,role))return;
  selected=role;const data=V219_FOCUS[role];home.dataset.v219Selected=role;panel.textContent=data.description;
  for(const tab of tabs){const on=tab.dataset.v219Role===role;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;if(on)panel.setAttribute('aria-labelledby',tab.id)}
  cta.href='/work/?view='+role+'&project='+data.project+'&panel='+data.panel+'#v20-workspace';
  cta.setAttribute('aria-label','View '+tabs.find(t=>t.dataset.v219Role===role).textContent.trim()+' projects in Work');
  for(const a of rail)a.dataset.v219Active=String(a.dataset.v20OpenProject===data.project);
  for(const a of resumes)a.dataset.v219Recommended=String(Boolean(a.getAttribute('href')?.includes('_'+role+'_Public.pdf')));
 }
 tablist.addEventListener('click',ev=>{const t=ev.target.closest('[data-v219-role]');if(t&&tablist.contains(t))select(t.dataset.v219Role)});
 tablist.addEventListener('focusin',ev=>{const t=ev.target.closest('[data-v219-role]');if(t&&tablist.contains(t))select(t.dataset.v219Role)});
 tablist.addEventListener('keydown',ev=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key)||!ev.target.closest('[data-v219-role]'))return;
  ev.preventDefault();const at=roles.indexOf(selected);
  const index=ev.key==='Home'?0:ev.key==='End'?roles.length-1:(at+(ev.key==='ArrowRight'?1:roles.length-1))%roles.length;
  select(roles[index]);tabs.find(tab=>tab.dataset.v219Role===roles[index])?.focus();
 });
 if(mouse)for(const t of tabs)t.addEventListener('pointerenter',ev=>{if(ev.pointerType==='mouse')select(t.dataset.v219Role)});
 if(mouse&&!reduced&&typeof win.requestAnimationFrame==='function'){
  let queued=false,last=null;const proof=home.querySelector('.v17Proof');const clamp=x=>Math.min(100,Math.max(0,x));
  home.addEventListener('pointermove',ev=>{
   if(ev.pointerType!=='mouse')return;last={x:ev.clientX,y:ev.clientY};
   if(queued)return;queued=true;
   win.requestAnimationFrame(()=>{
    queued=false;if(!last||!home.isConnected)return;
    for(const el of [home,proof]){
     if(!el)continue;const r=el.getBoundingClientRect();if(r.width<1||r.height<1)continue;
     el.style.setProperty('--v219-pointer-x',clamp((last.x-r.left)/r.width*100).toFixed(1)+'%');
     el.style.setProperty('--v219-pointer-y',clamp((last.y-r.top)/r.height*100).toFixed(1)+'%');
    }
   });
  },{passive:true});
 }
 select('fullstack');return {select,get selected(){return selected}};
}

