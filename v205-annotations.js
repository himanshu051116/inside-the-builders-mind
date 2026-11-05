/**
 * V20.5 — opt-in annotation hotspots for inspected authentic screenshot assets.
 * Only the four manually inspected images below are annotated. Coordinates
 * identify visible UI regions, not measured operational behavior.
 */
export const V205_ANNOTATIONS=Object.freeze({
  "mulyankan-submission":{ratio:1.61,points:[
    {x:45,y:20,title:"Governed proposal package",detail:"The saved form identifies its funding scheme and the proposed submission package. This capture does not verify a submitted or scored proposal."},
    {x:86,y:24,title:"Package readiness",detail:"The capture displays a 0% readiness indicator and missing mandatory document slots. It is a captured UI state, not a current submission result."},
    {x:45,y:51,title:"Proposal details",detail:"The visible form includes proposal title and executive-summary fields. The screenshot does not establish successful validation of entered content."},
    {x:64,y:87,title:"Mandatory document slots",detail:"Proposal-body and budget-document selection controls appear in the captured intake interface. File processing is not executed on this portfolio."}
  ]},
  "news-overview":{ratio:1.57,points:[
    {x:91,y:40,title:"Briefing entry point",detail:"The captured dashboard includes a Read my brief action. This is not a live briefing request from the portfolio."},
    {x:50,y:61,title:"Sample event and report counts",detail:"The screen displays 40 events and 100 reports in a sampled reporting window, not independently confirmed live totals."},
    {x:79,y:87,title:"Attention and extraction warnings",detail:"The visible attention panel contains a reporting/extraction warning. The image does not prove a currently running ingestion backend."}
  ]},
  "earthbridge-evaluation":{ratio:1.58,points:[
    {x:73,y:3,title:"API offline indicator",detail:"The captured evaluation interface visibly labels the API offline. No live retrieval or trained inference is running inside this portfolio."},
    {x:42,y:49,title:"Cross-modal retrieval metrics",detail:"The figure displays repository-reported F1@5 and F1@10 results. They have not been independently reproduced here."},
    {x:79,y:49,title:"Validation recall",detail:"The interface displays repository-reported recall@1 and recall@10; these are static documented figures, not a freshly computed benchmark."},
    {x:79,y:81,title:"Interpretation constraints",detail:"The screen cautions against treating raw retrieval similarity as probability or visual matching as geospatial registration."}
  ]},
  "ohs-together":{ratio:1.46,points:[
    {x:35,y:33,title:"Watch-room configuration",detail:"The saved interface shows source selection and watch-room setup fields. The screenshot does not verify synchronized playback between devices."},
    {x:81,y:31,title:"Private call controls",detail:"Video and audio call controls appear in this capture. A remote partner is not connected in the recorded state."},
    {x:60,y:84,title:"Readiness and playback controls",detail:"The image shows readiness and playback actions with the player awaiting setup; the portfolio does not perform a live call or synchronization."}
  ]}
});

export function setupV205Annotations(doc=document,win=window){
  const root=doc.getElementById("v20-workspace"),inspector=doc.getElementById("v20Inspector");
  if(!root||!inspector||root.dataset.v205Installed==="true")return false;
  root.dataset.v205Installed="true";
  let currentCapture="",active=0,show=true;
  const el=(tag,cls,text)=>{
    const n=doc.createElement(tag);
    if(cls)n.className=cls;
    if(text!==undefined)n.textContent=text;
    return n;
  };
  const makeButton=(cls,text,action)=>{
    const b=el("button",cls,text);b.type="button";b.dataset.v205Action=action;return b;
  };
  function getCurrent(){
    const figure=inspector.querySelector(".v20Media figure");
    const img=figure?.querySelector("img");
    const path=img?.getAttribute("src")||"";
    const match=path.match(/^\/evidence\/([a-z0-9-]+)\.webp$/);
    const id=match?.[1]||"";
    return {figure,img,id,record:V205_ANNOTATIONS[id]};
  }
  function renderDetail(){
    const panel=inspector.querySelector(".v205AnnotationPanel");
    const record=V205_ANNOTATIONS[currentCapture];
    if(!panel||!record)return;
    const point=record.points[active]||record.points[0];
    panel.querySelector(".v205Count").textContent=(active+1)+" / "+record.points.length;
    panel.querySelector(".v205Title").textContent=point.title;
    panel.querySelector(".v205Explanation").textContent=point.detail;
    panel.querySelectorAll("[data-v205-pick]").forEach(b=>{
      const selected=Number(b.dataset.v205Pick)===active;
      b.setAttribute("aria-pressed",String(selected));
      b.classList.toggle("isActive",selected);
    });
    const dots=inspector.querySelector(".v205Dots");
    if(dots)dots.hidden=!show;
    const toggle=panel.querySelector('[data-v205-action="toggle"]');
    if(toggle){
      toggle.textContent=show?"Hide image markers":"Show image markers";
      toggle.setAttribute("aria-pressed",String(show));
    }
  }
  function enhance(){
    const {figure,img,id,record}=getCurrent();
    if(!figure||!img||!record||figure.querySelector(".v205ImageFrame"))return;
    if(currentCapture!==id){currentCapture=id;active=0;}
    const frame=el("div","v205ImageFrame");
    const maxWidth=Math.round(350*record.ratio);
    frame.style.width="min(100%, "+maxWidth+"px)";
    img.replaceWith(frame);frame.append(img);
    const dots=el("div","v205Dots");
    dots.setAttribute("role","group");
    dots.setAttribute("aria-label","Visible features in the saved screenshot");
    record.points.forEach((point,i)=>{
      const b=makeButton("v205Hotspot",String(i+1),"pick");
      b.dataset.v205Pick=String(i);
      b.style.left=point.x+"%";b.style.top=point.y+"%";
      b.setAttribute("aria-label","Inspect screenshot feature "+(i+1)+": "+point.title);
      dots.append(b);
    });
    frame.append(dots);
    const panel=el("section","v205AnnotationPanel");
    panel.setAttribute("aria-label","Screenshot annotations");
    const header=el("div","v205Head");
    header.append(el("strong","","Explore features in this saved image"),el("span","v205Count"));
    const toggle=makeButton("v205Toggle","","toggle");
    header.append(toggle);panel.append(header);
    const menu=el("div","v205FeatureList");
    menu.setAttribute("role","group");
    menu.setAttribute("aria-label","Select screenshot feature");
    record.points.forEach((p,i)=>{
      const b=makeButton("v205Feature",p.title,"pick");
      b.dataset.v205Pick=String(i);menu.append(b);
    });
    panel.append(menu);
    const info=el("div","v205Info");info.setAttribute("aria-live","polite");
    info.append(el("h4","v205Title"),el("p","v205Explanation"));
    panel.append(info);
    const actions=el("div","v205Actions");
    actions.append(makeButton("v205Go","Explore architecture →","architecture"),makeButton("v205Go","Verification & limits →","evidence"));
    panel.append(actions);
    panel.append(el("p","v205Disclaimer","The labels describe visible interface elements only. Saved screenshots do not establish real-time functionality, system accuracy, or independent validation."));
    figure.insertAdjacentElement("afterend",panel);
    renderDetail();
  }
  root.addEventListener("click",event=>{
    const b=event.target.closest?.("[data-v205-action]");
    if(!b||!root.contains(b))return;
    const action=b.dataset.v205Action;
    if(action==="pick"){
      const record=V205_ANNOTATIONS[currentCapture];
      const n=Number(b.dataset.v205Pick);
      if(!record||!Number.isInteger(n)||n<0||n>=record.points.length)return;
      active=n;renderDetail();return;
    }
    if(action==="toggle"){show=!show;renderDetail();return}
    if(action==="architecture"||action==="evidence"){
      inspector.querySelector('[data-v20-tab="'+action+'"]')?.click();
    }
  });
  root.addEventListener("keydown",event=>{
    const target=event.target;
    if(!target?.classList?.contains("v205Hotspot")||!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    const record=V205_ANNOTATIONS[currentCapture];if(!record)return;
    const next=event.key==="Home"?0:event.key==="End"?record.points.length-1:(active+(event.key==="ArrowRight"?1:-1)+record.points.length)%record.points.length;
    event.preventDefault();active=next;renderDetail();
    inspector.querySelector('.v205Hotspot[data-v205-pick="'+next+'"]')?.focus();
  });
  doc.addEventListener("portfolio:v20-render",enhance);
  enhance();
  return true;
}
