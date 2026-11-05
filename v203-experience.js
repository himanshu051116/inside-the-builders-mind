/**
 * V20.3 Guided Engineering Experience — additive to V20.2, no simulated backend.
 * All project information, screenshots and status are supplied by existing records.
 */
export const V203_JOURNEYS=Object.freeze({
  fullstack:{title:'Product walkthrough',intro:'Follow a recorded interface into its implementation.',steps:[
    ['media','See the interface','Explore saved project screens. Private features may require access.'],
    ['overview','Understand the product','Read the problem and implemented approach.'],
    ['architecture','Trace the components','Inspect the conceptual stages; this is not a live trace.'],
    ['evidence','Check boundaries','Examine verification and stated limitations.']]},
  software:{title:'System trace',intro:'Inspect the engineering decisions and their evidence.',steps:[
    ['architecture','Trace components','Explore the documented architecture stage by stage.'],
    ['overview','Review design choices','Review the system problem and approach.'],
    ['evidence','Inspect validation','Distinguish repository evidence and local tests from production claims.'],
    ['media','Inspect recorded output','Compare the technical explanation with saved screenshots.']]},
  ml:{title:'Research review',intro:'Begin with evaluation, then inspect methodology.',steps:[
    ['evidence','Examine evaluation','Repository-reported metrics have not been independently reproduced here.'],
    ['architecture','Inspect methodology','Explore conceptual model stages; no trained inference runs in this page.'],
    ['media','Review captures','These are genuine saved interface captures, not live benchmark results.'],
    ['overview','Read the scope','Review the original research question and engineering approach.']]}
});
export function setupV203Experience({projects=[]}={},doc=document,win=window){
  const root=doc.getElementById('v20-workspace'),inspector=doc.getElementById('v20Inspector');
  if(!root||!inspector||root.dataset.v203Installed==='true')return false;
  root.dataset.v203Installed='true';
  const slug=t=>String(t||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const known=new Map(projects.filter(p=>p&&p.title).map(p=>[slug(p.title),p]));
  let open=false,step=0,priorProject='',priorRole='',renderProject='';
  const role=()=>Object.hasOwn(V203_JOURNEYS,root.dataset.role)?root.dataset.role:'fullstack';
  const selectedProject=()=>renderProject||root.querySelector('[data-v20-project][aria-pressed="true"]')?.dataset.v20Project||'';
  const selectedTab=()=>inspector.querySelector('[data-v20-tab][aria-selected="true"]')?.dataset.v20Tab||'overview';
  const guide=()=>V203_JOURNEYS[role()];
  function el(tag,cls,txt){
    const a=doc.createElement(tag);
    if(cls)a.className=cls;
    if(txt!==undefined)a.textContent=txt;
    return a;
  }
  function button(cls,attr,value,label){
    const b=el('button',cls,label);b.type='button';b.setAttribute(attr,value);return b;
  }
  function status(msg){
    let n=root.querySelector('#v203Status');
    if(!n){n=el('p','srOnly');n.id='v203Status';n.setAttribute('role','status');root.append(n)}
    n.textContent=msg;
  }
  function navigate(tab){
    const b=inspector.querySelector('[data-v20-tab="'+tab+'"]');
    if(b){b.click();return true}return false;
  }
  function drawGuide(){
    inspector.querySelector('.v203Guide')?.remove();
    const tabs=inspector.querySelector('.v20Tabs');if(!tabs)return;
    const g=el('section','v203Guide');g.setAttribute('aria-label',guide().title);
    if(!open){
      const summary=el('div','v203Compact');
      const copy=el('div','');copy.append(el('strong','',guide().title),el('p','',guide().intro));
      summary.append(copy,button('v203Action','data-v203-start','true','Start guided walkthrough →'));
      g.append(summary);
    }else{
      const top=el('div','v203Header');
      const copy=el('div','');copy.append(el('small','v203Eyebrow','GUIDED INSPECTION'),el('h4','',guide().title),el('p','',guide().intro));
      top.append(copy,button('v203Action','data-v203-close','true','Close ×'));
      g.append(top);
      const stages=el('nav','v203Steps');stages.setAttribute('aria-label','Guided inspection stages');
      guide().steps.forEach((s,i)=>{
        const b=button('v203Step','data-v203-stop',String(i),String(i+1).padStart(2,'0')+'  '+s[1]);
        b.setAttribute('aria-current',i===step?'step':'false');
        stages.append(b);
      });
      g.append(stages);
      const foot=el('div','v203Footer');
      foot.append(el('p','',guide().steps[step][2]),
        button('v203Action','data-v203-next','true',step===3?'Restart walkthrough →':'Next stage →'));
      g.append(foot);
    }
    tabs.insertAdjacentElement('beforebegin',g);
  }
  function addArchitecture(){
    const panel=inspector.querySelector('.v20Architecture');
    if(!panel||panel.querySelector('.v203StageRail'))return;
    const stages=[...panel.querySelectorAll('[data-v20-stage]')];
    if(stages.length<2)return;
    const rail=el('div','v203StageRail');rail.setAttribute('aria-hidden','true');
    for(const b of stages)rail.append(el('span','v203StageDot'+(b.getAttribute('aria-pressed')==='true'?' isActive':'')));
    panel.querySelector('.v20Stages')?.insertAdjacentElement('beforebegin',rail);
    const d=panel.querySelector('.v20StageDetail');
    if(d){
      const actions=el('div','v203StageActions');
      actions.append(button('v203Action','data-v203-related','media','View saved screens ↗'),
        button('v203Action','data-v203-related','evidence','Check verification ↗'));
      d.append(actions);
    }
    panel.setAttribute('aria-label','Explanatory architecture stages; not a live trace');
  }
  function addMedia(){
    const panel=inspector.querySelector('.v20Media');
    if(!panel||panel.querySelector('.v203MediaControls'))return;
    const thumbs=[...panel.querySelectorAll('[data-v20-capture]')];if(!thumbs.length)return;
    const i=Math.max(0,thumbs.findIndex(b=>b.getAttribute('aria-pressed')==='true'));
    const row=el('div','v203MediaControls');
    const description=el('div','');description.append(el('strong','','Saved screenshots'),el('span','',String(i+1)+' / '+thumbs.length));
    const controls=el('div','v203MediaButtons');
    const prev=button('v203Action','data-v203-media','prev','←');prev.setAttribute('aria-label','Previous screenshot');prev.disabled=i===0;
    const next=button('v203Action','data-v203-media','next','→');next.setAttribute('aria-label','Next screenshot');next.disabled=i===thumbs.length-1;
    controls.append(prev,next);row.append(description,controls);panel.prepend(row);
    panel.append(el('p','v203Boundary','These are saved project captures, not a live application session.'));
  }
  function addEvidence(){
    const panel=inspector.querySelector('.v20Evidence');
    if(!panel||panel.querySelector('.v203EvidenceLabel'))return;
    const p=known.get(selectedProject());
    if(p)panel.prepend(el('p','v203EvidenceLabel','Project status: '+p.status+'. Source links and documented limitations are retained below.'));
  }
  function enhance(event){
    if(event?.detail?.projectId)renderProject=event.detail.projectId;
    const p=selectedProject(),r=role();
    if(p!==priorProject||r!==priorRole){open=false;step=0;priorProject=p;priorRole=r}
    if(open){
      const index=guide().steps.findIndex(s=>s[0]===selectedTab());
      if(index>=0)step=index;
    }
    drawGuide();addArchitecture();addMedia();addEvidence();
  }
  root.addEventListener('click',event=>{
    const b=event.target.closest?.('[data-v203-start],[data-v203-stop],[data-v203-next],[data-v203-close],[data-v203-media],[data-v203-related]');
    if(!b)return;
    if(b.hasAttribute('data-v203-start')){open=true;step=0;navigate(guide().steps[0][0]);enhance();status(guide().title+' started');return}
    if(b.hasAttribute('data-v203-close')){open=false;enhance();return}
    if(b.hasAttribute('data-v203-stop')||b.hasAttribute('data-v203-next')){
      step=b.hasAttribute('data-v203-stop')?Number(b.dataset.v203Stop):(step+1)%4;
      navigate(guide().steps[step][0]);enhance();status('Walkthrough step '+(step+1)+': '+guide().steps[step][1]);return;
    }
    if(b.hasAttribute('data-v203-related')){navigate(b.dataset.v203Related);return}
    if(b.hasAttribute('data-v203-media')){
      const caps=[...inspector.querySelectorAll('[data-v20-capture]')];
      const i=caps.findIndex(x=>x.getAttribute('aria-pressed')==='true');
      const next=i+(b.dataset.v203Media==='next'?1:-1);
      if(next>=0&&next<caps.length){caps[next].click();status('Saved screenshot '+(next+1)+' of '+caps.length)}
    }
  });
  root.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    const target=event.target;
    if(target.tagName==='INPUT'||target.closest?.('[role="tablist"],.v203Steps')||!target.closest?.('.v20Media'))return;
    const b=inspector.querySelector('[data-v203-media="'+(event.key==='ArrowRight'?'next':'prev')+'"]');
    if(b&&!b.disabled){event.preventDefault();b.click()}
  });
  doc.addEventListener('portfolio:v20-render',enhance);
  enhance();
  return true;
}
