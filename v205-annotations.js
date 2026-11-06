/**
 * V20.5 — opt-in annotation hotspots for inspected authentic screenshot assets.
 * Only the four manually inspected images below are annotated. Coordinates
 * identify visible UI regions, not measured operational behavior.
 */
export const V205_ANNOTATIONS=Object.freeze({
  "mulyankan-submission":{ratio:1.61,points:[
    {x:45,y:20,title:"Governed proposal package",detail:"The saved form identifies its funding scheme and the proposed submission package. This capture does not verify a submitted or scored proposal.",stage:0},
    {x:86,y:24,title:"Package readiness",detail:"The capture displays a 0% readiness indicator and missing mandatory document slots. It is a captured UI state, not a current submission result.",stage:0},
    {x:45,y:51,title:"Proposal details",detail:"The visible form includes proposal title and executive-summary fields. The screenshot does not establish successful validation of entered content.",stage:0},
    {x:64,y:87,title:"Mandatory document slots",detail:"Proposal-body and budget-document selection controls appear in the captured intake interface. File processing is not executed on this portfolio.",stage:0}
  ]},
  "news-overview":{ratio:1.57,points:[
    {x:91,y:40,title:"Briefing entry point",detail:"The captured dashboard includes a Read my brief action. This is not a live briefing request from the portfolio.",stage:3},
    {x:50,y:61,title:"Sample event and report counts",detail:"The screen displays 40 events and 100 reports in a sampled reporting window, not independently confirmed live totals.",stage:3},
    {x:79,y:87,title:"Attention and extraction warnings",detail:"The visible attention panel contains a reporting/extraction warning. The image does not prove a currently running ingestion backend.",stage:3}
  ]},
  "earthbridge-evaluation":{ratio:1.58,points:[
    {x:73,y:3,title:"API offline indicator",detail:"The captured evaluation interface visibly labels the API offline. No live retrieval or trained inference is running inside this portfolio."},
    {x:42,y:49,title:"Cross-modal retrieval metrics",detail:"The figure displays repository-reported F1@5 and F1@10 results. They have not been independently reproduced here.",stage:3},
    {x:79,y:49,title:"Validation recall",detail:"The interface displays repository-reported recall@1 and recall@10; these are static documented figures, not a freshly computed benchmark.",stage:3},
    {x:79,y:81,title:"Interpretation constraints",detail:"The screen cautions against treating raw retrieval similarity as probability or visual matching as geospatial registration.",stage:3}
  ]},
  "ohs-together":{ratio:1.46,points:[
    {x:35,y:33,title:"Watch-room configuration",detail:"The saved interface shows source selection and watch-room setup fields. The screenshot does not verify synchronized playback between devices.",stage:3},
    {x:81,y:31,title:"Private call controls",detail:"Video and audio call controls appear in this capture. A remote partner is not connected in the recorded state.",stage:3},
    {x:60,y:84,title:"Readiness and playback controls",detail:"The image shows readiness and playback actions with the player awaiting setup; the portfolio does not perform a live call or synchronization.",stage:3}
  ]},

  "mulyankan-overview":{ratio:1.42,points:[
    {x:84,y:17,title:"Advisory portfolio score",detail:"A score of 34 is visible in this saved portfolio overview. It is a captured advisory value, not an independently verified scoring benchmark.",stage:2},
    {x:12,y:32,title:"Start scrutiny",detail:"The screenshot shows a Start scrutiny action for a proposal review workflow. Opening this annotation does not submit or evaluate anything.",stage:0},
    {x:23,y:79,title:"Workflow distribution",detail:"The saved overview displays a breakdown of proposals by processing and review status. Counts reflect this recorded screen only.",stage:2},
    {x:74,y:79,title:"Latest proposals",detail:"Redacted proposal records appear with human-review, processing-error and revision states. This does not establish the current status of real submissions.",stage:3}
  ]},
  "news-claims":{ratio:1.27,points:[
    {x:88,y:4,title:"Claim-state filter",detail:"The captured review interface includes a claim-state filter and a count of visible claims. It does not connect this portfolio to a live article database.",stage:3},
    {x:12,y:16,title:"Evidence-status labels",detail:"The saved claims are marked Not enough evidence, with numeric or quote categories. These labels describe the recorded screen, not an independently verified finding.",stage:3},
    {x:91,y:17,title:"Lineage indicators",detail:"Individual claim cards show lineage counts, including zero in the visible state. That is not proof of successful end-to-end provenance extraction.",stage:3}
  ]},
  "earthbridge-architecture":{ratio:1.58,points:[
    {x:77,y:29,title:"Sentinel input modalities",detail:"The conceptual diagram identifies Sentinel-1 SAR and Sentinel-2 multispectral inputs. It does not show actual imagery or prove successful paired-data ingestion.",stage:0},
    {x:78,y:49,title:"Shared embedding representation",detail:"The architecture screen illustrates a 128-dimensional descriptor space. The diagram alone cannot validate trained embeddings or cross-sensor accuracy.",stage:1},
    {x:77,y:67,title:"FAISS indexed retrieval",detail:"The diagram includes a top-K FAISS index and ranked-scene-match output stage. No live model inference or retrieved matches are shown here.",stage:2}
  ]},
  "ohs-home":{ratio:1.58,points:[
    {x:29,y:48,title:"Sample preview entry",detail:"The landing page offers a Try the preview action. The adjacent conversation is fictional sample content, not messages exchanged with another person.",stage:0},
    {x:24,y:71,title:"Invite-code area",detail:"The saved screenshot contains a redacted invite-code panel and sharing controls. It does not verify successful private-room authentication.",stage:0},
    {x:72,y:43,title:"Fictional sample conversation",detail:"The right-hand panel presents a clearly labeled sample chat with fictional content. This image does not demonstrate real-time Firebase message delivery.",stage:2}
  ]}
});

export function setupV205Annotations(doc=document,win=window){
  const root=doc.getElementById("v20-workspace"),inspector=doc.getElementById("v20Inspector");
  if(!root||!inspector||root.dataset.v205Installed==="true")return false;
  root.dataset.v205Installed="true";
  let currentCapture="",active=0,show=false,expandedCapture="";
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
    panel.querySelector(".v205Count").textContent=panel.open?(active+1)+" / "+record.points.length:record.points.length+" notes";
    panel.querySelector(".v205Title").textContent=point.title;
    panel.querySelector(".v205Explanation").textContent=point.detail;
    const stageAction=panel.querySelector('[data-v205-action="architecture"]');
    if(stageAction){
      const hasStage=Number.isInteger(point.stage)&&point.stage>=0&&point.stage<4;
      stageAction.textContent=hasStage?"Inspect related architecture stage "+(point.stage+1)+" →":"Explore architecture →";
      if(hasStage)stageAction.dataset.v205Stage=String(point.stage);
      else delete stageAction.dataset.v205Stage;
    }
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
  function markAnnotatedThumbnails(){
    inspector.querySelectorAll(".v20Media [data-v20-capture]").forEach(b=>{
      const img=b.querySelector("img");
      const src=img?.getAttribute("src")||img?.getAttribute("data-src")||"";
      const match=src.match(/^\/evidence\/([a-z0-9-]+)\.webp$/);
      if(!match||!V205_ANNOTATIONS[match[1]])return;
      b.classList.add("v205AnnotatedThumb");
      b.setAttribute("aria-label",(b.getAttribute("title")||"Saved capture")+" — annotated features available");
    });
  }
  function enhance(){
    markAnnotatedThumbnails();
    const {figure,img,id,record}=getCurrent();
    if(!figure||!img||!record||figure.querySelector(".v205ImageFrame"))return;
    if(currentCapture!==id){currentCapture=id;active=0;show=false;expandedCapture="";}
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
      b.style.setProperty("--v205-x",point.x+"%");b.style.setProperty("--v205-y",point.y+"%");
      b.setAttribute("aria-label","Inspect screenshot feature "+(i+1)+": "+point.title);
      dots.append(b);
    });
    frame.append(dots);
    const panel=el("details","v205AnnotationPanel");
    if(expandedCapture===id){panel.open=true;show=true;}
    panel.setAttribute("aria-label","Screenshot annotations");
    const header=el("summary","v205Head");
    header.append(el("strong","","Screenshot notes"),el("span","v205Count"));
    panel.append(header);
    const body=el("div","v205AnnotationBody");
    const toggle=makeButton("v205Toggle","","toggle");
    body.append(toggle);
    const menu=el("div","v205FeatureList");
    menu.setAttribute("role","group");
    menu.setAttribute("aria-label","Select screenshot feature");
    record.points.forEach((p,i)=>{
      const b=makeButton("v205Feature",p.title,"pick");
      b.dataset.v205Pick=String(i);menu.append(b);
    });
    body.append(menu);
    const info=el("div","v205Info");info.setAttribute("aria-live","polite");
    info.append(el("h4","v205Title"),el("p","v205Explanation"));
    body.append(info);
    const actions=el("div","v205Actions");
    actions.append(makeButton("v205Go","Explore architecture →","architecture"),makeButton("v205Go","Verification & limits →","evidence"));
    body.append(actions);
    body.append(el("p","v205Disclaimer","Notes identify visible UI elements, not verified live functionality."));
    panel.append(body);
    panel.addEventListener("toggle",()=>{show=panel.open;expandedCapture=show?id:"";renderDetail();});
    const thumbnails=figure.parentElement?.querySelector(".v20Thumbs");
    (thumbnails||figure).insertAdjacentElement("afterend",panel);
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
      const requested=b.dataset.v205Stage;
      inspector.querySelector('[data-v20-tab="'+action+'"]')?.click();
      if(action==="architecture"&&requested!==undefined&&/^[0-3]$/.test(requested)){
        inspector.querySelector('[data-v20-stage="'+requested+'"]')?.click();
      }
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
