/**
 * V20.4 — Evidence-connected architecture explorer.
 * Extends existing V20.2/V20.3 DOM. No cloned project data, fabricated traces,
 * screenshot hotspots, external API execution or automatic media playback.
 */
export const V204_STAGE_CAPTURES = Object.freeze({
  mulyankan: [
    {id:"mulyankan-submission",context:"The saved intake checklist illustrates a proposal submission screen; it does not establish parser accuracy."},
    null,
    {id:"mulyankan-overview",context:"The saved scrutiny overview shows a reviewer-facing screen, not an independently validated scoring result."},
    {id:"mulyankan-history",context:"The redacted review-history capture illustrates traceability, not a certified audit outcome."}
  ],
  earthbridge: [
    {id:"earthbridge-architecture",context:"Conceptual Sentinel-1/Sentinel-2 architecture diagram; not a picture of actual paired training samples."},
    {id:"earthbridge-architecture",context:"Conceptual embedding pipeline. It is not an inference trace."},
    {id:"earthbridge-architecture",context:"Conceptual FAISS retrieval architecture; no actual nearest-neighbor results are shown."},
    {id:"earthbridge-evaluation",context:"Static repository-reported evaluation figures; no independent benchmark was run here."}
  ],
  "our-hidden-universe": [
    null,
    {id:"ohs-home",context:"Local sample chat screen; does not verify live Firebase room synchronization."},
    {id:"ohs-home",context:"Saved chat interface with sample content; not a live messaging test."},
    {id:"ohs-together",context:"Captured Watch Together and call controls; private session behavior is not independently tested here."}
  ],
  newssources: [
    {id:"news-overview",context:"Saved command centre shows the interface, not a running RSS crawler."},
    null,
    null,
    {id:"news-claims",context:"Saved claims/evidence review UI. This is not proof of a running news-ingestion backend."}
  ],

  schoolbuddies: [
    {id:"schoolbuddies-workshop",context:"Project-authored workshop poster; not an independently measured outreach outcome."},
    {id:"schoolbuddies-workshop",context:"Workshop poster describes the initiative, not a completed curriculum audit."},
    null,
    null
  ]
});

const V204_LABELS = Object.freeze({
  fullstack:"Product context",
  software:"Systems context",
  ml:"Research context"
});
const slug=x=>String(x||"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

export function setupV204Evidence({projects=[]}={},doc=document,win=window){
  const root=doc.getElementById("v20-workspace");
  const inspector=doc.getElementById("v20Inspector");
  if(!root||!inspector||root.dataset.v204Installed==="true")return false;
  root.dataset.v204Installed="true";

  const records=new Map(projects.filter(p=>p&&p.title).map(p=>[slug(p.title),p]));
  let pending=null;
  let lastProject="";

  const projectId=()=>root.querySelector('[data-v20-project][aria-pressed="true"]')?.dataset.v20Project||"";
  const getRole=()=>V204_LABELS[root.dataset.role]||V204_LABELS.fullstack;
  const el=(tag,cls,value)=>{
    const node=doc.createElement(tag);
    if(cls)node.className=cls;
    if(value!==undefined)node.textContent=value;
    return node;
  };
  function button(action,label){
    const b=el("button","v204Action",label);
    b.type="button";
    b.dataset.v204Action=action;
    return b;
  }
  function sourceLink(project){
    const source=project?.links?.find(l=>typeof l.url==="string"&&/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+/.test(l.url));
    return source?.url||"";
  }
  function stageRecords(project,index){
    return (V204_STAGE_CAPTURES[project]||[])[index]||null;
  }
  function captureSrc(id){
    return /^[-a-z0-9]+$/.test(id||"")?"/evidence/"+id+".webp":"";
  }
  function selectedArchitectureStage(panel){
    const nodes=[...panel.querySelectorAll("[data-v20-stage]")];
    const selected=nodes.findIndex(b=>b.getAttribute("aria-pressed")==="true");
    return Math.max(0,selected);
  }
  function enhanceArchitecture(){
    const panel=inspector.querySelector(".v20Architecture");
    if(!panel||panel.querySelector(".v204Bridge"))return;
    const id=projectId(),p=records.get(id);
    if(!p)return;
    const index=selectedArchitectureStage(panel);
    const related=stageRecords(id,index);
    const detail=panel.querySelector(".v20StageDetail");
    if(!detail)return;

    const bridge=el("section","v204Bridge");
    bridge.setAttribute("aria-label","Related project evidence and sources");
    const head=el("div","v204BridgeHeader");
    head.append(el("strong","v204Eyebrow","RELATED RECORDS"),el("span","v204Context",getRole()));
    bridge.append(head);

    const area=el("div","v204BridgeArea");
    const visual=el("div","v204Visual");
    if(related){
      const href=captureSrc(related.id);
      const link=el("a","v204CaptureLink");
      link.href=href;link.target="_blank";link.rel="noopener noreferrer";
      link.setAttribute("aria-label","Open saved capture "+related.id);
      const img=el("img","");
      img.src=href;img.alt="Related saved project capture: "+related.id.replaceAll("-"," ");
      img.loading="lazy";img.decoding="async";
      img.addEventListener("error",()=>{
        if(!img.isConnected)return;
        link.replaceWith(el("p","v204Empty","Saved capture unavailable. Use the full gallery instead."));
      },{once:true});
      link.append(img);visual.append(link);
    }else{
      visual.append(el("p","v204Empty","No stage-specific screenshot is documented for this step."));
    }
    const meta=el("div","v204Detail");
    meta.append(el("h5","","Connect the explanation to evidence"));
    meta.append(el("p","",related?related.context:"The architecture explanation is conceptual. Inspect the project source and verification notes before drawing conclusions."));
    const actions=el("div","v204Actions");
    if(related){
      const open=button("capture","Open related capture");
      open.dataset.v204Capture=related.id;
      actions.append(open);
    }
    actions.append(button("evidence","Verification & limits"));
    const url=sourceLink(p);
    if(url){
      const a=el("a","v204Source","Project repository ↗");
      a.href=url;a.target="_blank";a.rel="noopener noreferrer";
      a.title="Project-level source reference; not a verified code reference for this specific stage";
      actions.append(a);
    }
    meta.append(actions);
    meta.append(el("small","v204Boundary","Saved interface / project source ≠ a verified live execution trace."));
    area.append(visual,meta);
    bridge.append(area);detail.insertAdjacentElement("afterend",bridge);
  }

  function selectedCaptureId(){
    const active=inspector.querySelector('.v20Media [data-v20-capture][aria-pressed="true"] img');
    const src=active?.getAttribute("src")||"";
    const match=src.match(/\/evidence\/([a-z0-9-]+)\.webp$/);
    return match?.[1]||"";
  }
  function resolvePending(){
    if(!pending||pending.project!==projectId())return;
    const caps=[...inspector.querySelectorAll(".v20Media [data-v20-capture]")];
    const target=caps.find(b=>b.querySelector('img')?.getAttribute("src")===captureSrc(pending.id));
    if(target){
      pending=null;
      if(target.getAttribute("aria-pressed")!=="true")target.click();
    }
  }
  function enhanceMedia(){
    const panel=inspector.querySelector(".v20Media");
    if(!panel||panel.querySelector(".v204MediaBridge"))return;
    const id=projectId();
    const capture=selectedCaptureId();
    const mapping=(V204_STAGE_CAPTURES[id]||[]);
    const index=mapping.findIndex(x=>x&&x.id===capture);
    if(index<0)return;
    const bridge=el("div","v204MediaBridge");
    bridge.append(el("span","","Related architecture context is available for this saved capture."));
    const jump=button("architecture","Inspect related stage ↗");
    jump.dataset.v204Stage=String(index);
    bridge.append(jump);
    const target=panel.querySelector(".v203MediaControls");
    if(target)target.insertAdjacentElement("afterend",bridge);
    else panel.prepend(bridge);
  }
  function render(){
    const id=projectId();
    if(id!==lastProject){pending=null;lastProject=id;}
    enhanceArchitecture();
    resolvePending();
    enhanceMedia();
  }

  root.addEventListener("click",ev=>{
    const button=ev.target.closest?.("[data-v204-action]");
    if(!button||!root.contains(button))return;
    const action=button.dataset.v204Action;
    if(action==="capture"){
      const id=button.dataset.v204Capture;
      if(!captureSrc(id))return;
      pending={project:projectId(),id};
      inspector.querySelector('[data-v20-tab="media"]')?.click();
      resolvePending();
    }else if(action==="evidence"){
      inspector.querySelector('[data-v20-tab="evidence"]')?.click();
    }else if(action==="architecture"){
      const value=Number(button.dataset.v204Stage);
      if(!Number.isInteger(value)||value<0||value>3)return;
      inspector.querySelector('[data-v20-tab="architecture"]')?.click();
      inspector.querySelector('[data-v20-stage="'+value+'"]')?.click();
    }
  });
  doc.addEventListener("portfolio:v20-render",render);
  render();
  return true;
}
