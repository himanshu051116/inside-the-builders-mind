import {readV207Route,commitV207Route,readV25DetailRoute} from './v207-route.js'
import {caseDossiers} from './case-dossiers.js'
// V20.7 retains the V20.6 rendered surfaces while consolidating URL semantics.
const V20_SETTINGS={"fullstack":{"label":"Full-Stack","project":"our-hidden-universe","tab":"media","title":"Products & interfaces","subtitle":"Interfaces, source, and implementation.","resume":"/resumes/Himanshu_Shukla_fullstack_Public.pdf","order":["our-hidden-universe","mulyankan","schoolbuddies","newssources","earthbridge"]},"software":{"label":"Software Systems","project":"newssources","tab":"architecture","title":"Systems & architecture","subtitle":"Architecture, data flow, and engineering trade-offs.","resume":"/resumes/Himanshu_Shukla_software_Public.pdf","order":["newssources","mulyankan","our-hidden-universe","earthbridge","schoolbuddies"]},"ml":{"label":"Applied ML","project":"earthbridge","tab":"evidence","title":"Research & evaluation","subtitle":"Methods, reported results, and limitations.","resume":"/resumes/Himanshu_Shukla_ml_Public.pdf","order":["earthbridge","mulyankan","newssources","our-hidden-universe","schoolbuddies"]}};
const V20_FLOWS={"mulyankan":[["Document intake","Inspect submitted files, format and extraction readiness."],["Evidence extraction","Link supporting material to rubric criteria."],["Rubric review","Flag insufficient evidence instead of forcing a complete score."],["Human decision","A reviewer retains final authority and an audit trail."]],"earthbridge":[["Paired scenes","Prepare Sentinel-1 and Sentinel-2 paired observations."],["Descriptors","Map modalities to a shared retrieval space."],["FAISS lookup","Compare encoded descriptors; this view performs no inference."],["Evaluation","Inspect reported metrics and holdout-split limitations."]],"our-hidden-universe":[["Access","Firebase authentication controls private room access."],["Room state","Coordinate presence, messages and shared session state."],["Messaging","Inspect the source-backed messaging implementation."],["Watch Together","Review captured playback and call controls; no live sync test here."]],"newssources":[["Discovery","Collect candidates from RSS and sitemaps."],["Normalize","Extract and deduplicate article identities."],["Persistence","Preserve records, versions and provenance in PostgreSQL."],["Analyst review","Inspect captured source, event and claims screens."]],"schoolbuddies":[["School outreach","Coordinate engagement with schools."],["Curriculum","Prepare programming and AI-literacy workshops."],["Learning","Run hands-on technology demonstrations."],["Website","Accept enquiries through the public project site."]]};
export const setupV20Workspace=function initV20(projects,doc=document,win=window){
  if(doc.getElementById("v20-workspace")||!Array.isArray(projects))return;
  const main=doc.getElementById("main"),hero=doc.getElementById("home"),legacy=doc.getElementById("top");
  if(!main||!hero||!legacy)return;
  const slug=x=>String(x||"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const e=x=>String(x??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
  const safe=x=>/^(https:\/\/[^\s"<>]+|\/[^/][^\s"<>]*)$/.test(String(x||""))?e(x):"";
  const validRole=x=>Object.hasOwn(V20_SETTINGS,x)?x:"fullstack";
  const entry=projects.map(x=>({...x,id:slug(x.title)})).filter(x=>x.title&&x.caseStudy);
  const ids=entry.map(x=>x.id);
  const initialRoute=readV207Route(win.location.href,ids);
  let role=initialRoute.role;
  let id=initialRoute.project;
  let tab=initialRoute.panel;
  let capture=0,stage=0,manifest=null,manifestPromise=null,manifestError=false;
  // Local per-project inspection state; never persists private user data.
  const captureByProject=new Map(),stageByProject=new Map(),tabByProject=new Map();
  const captureTokenByProject=new Map(),stageTokenByProject=new Map();
  const firstDetail=readV25DetailRoute(win.location.href);
  if(firstDetail.capture)captureTokenByProject.set(id,firstDetail.capture);
  if(firstDetail.stage)stageTokenByProject.set(id,firstDetail.stage);
  let previewActive=false,previewSnapshot=null,previewRestoreTimer=0;
  const projectStateMaps=[captureByProject,stageByProject,tabByProject,captureTokenByProject,stageTokenByProject];
  const rememberPreview=()=>{
    if(previewSnapshot)return;
    previewSnapshot={
      role,id,tab,capture,stage,
      maps:projectStateMaps.map(m=>new Map(m))
    };
  };
  const clearPreviewCheckpoint=()=>{previewSnapshot=null;win.clearTimeout(previewRestoreTimer);previewRestoreTimer=0};
  const caseSlugToId=Object.freeze({ohs:"our-hidden-universe",news:"newssources",mulyankan:"mulyankan",earthbridge:"earthbridge"});
  const projectToCase=Object.freeze({"our-hidden-universe":"ohs",newssources:"news",mulyankan:"mulyankan",earthbridge:"earthbridge"});
  const workspace=doc.createElement("section");
  workspace.id="v20-workspace";workspace.className="v20Workspace";workspace.setAttribute("aria-labelledby","v20Title");
  workspace.innerHTML=`<div class="v20Wrap"><div class="v20Head"><div><span class="v20Eyebrow">SELECTED WORK</span><h2 id="v20Title">Selected work.</h2><p id="v20Subtitle">Explore by project or specialization.</p></div></div>
    <div class="v20RoleBar" role="group" aria-label="Choose a résumé-specific portfolio experience">
      ${Object.entries(V20_SETTINGS).map(([k,v])=>`<button type="button" data-v20-role="${k}" aria-pressed="false">${e(v.label)}</button>`).join("")}
      <a href="#top" id="v20FullShowcase">Full showcase ↗</a>
      <a href="${V20_SETTINGS.fullstack.resume}" id="v20Resume" download>Download matching résumé ↓</a>
    </div>
    <div class="v20Explorer"><aside class="v20Sidebar"><label for="v20Search">Projects <span class="v20InputHint">Hover to preview · Tap to open</span></label><input id="v20Search" type="search" autocomplete="off" placeholder="Search projects or tools"/><div id="v20ProjectList" class="v20ProjectList" aria-label="Select a project"></div><span id="v20Count" class="v20Count"></span><p id="v20SearchNotice" class="v20SearchNotice" hidden></p></aside><section class="v20Inspector" id="v20Inspector" aria-live="off" aria-label="Selected project details"></section></div>
    <div class="v20Foot"><a href="#v20Archive" id="v20ArchiveLink">Complete portfolio archive ↗</a></div></div>`;
  legacy.insertAdjacentElement("afterend",workspace);
  // Public archive: one independent disclosure per actual content section.
  // A single closed parent previously concealed the entire portfolio.
  const archive=doc.createElement("section");archive.className="v20Archive v21Archive";archive.id="v20Archive";
  archive.setAttribute("aria-labelledby","v21ArchiveTitle");
  archive.innerHTML='<div class="v21ArchiveHeading"><span>MORE TO EXPLORE</span><h2 id="v21ArchiveTitle">Complete portfolio archive</h2><p>Open the sections that interest you. Everything is available separately.</p></div><div class="v20ArchiveBody"></div>';
  main.append(archive);
  const body=archive.querySelector(".v20ArchiveBody");
  const groupMap=new Map();
  const sections=[
    ["top","Work by focus","Three career perspectives and tailored résumés"],
    ["work","Selected projects","All documented builds and source links"],
    ["case-files","Architecture and trade-offs","Case-study routes and engineering decisions"],
    ["project-notes","Project notes","Design, tests and limitations"],
    ["field-proof","Captured interfaces","Original screenshots with context"],
    ["archive","Additional projects","Other builds and their current stage"],
    ["interactive-lab","Interactive demos","Local demonstrations, clearly identified"],
    ["about","About","Background and interests"],
    ["toolkit","Tools and skills","Frameworks and development tools"],
    ["lab","Evidence review","Try the local rubric exercise"]
  ];
  for(const [sectionId,title,subtitle] of sections){
    const disclosure=doc.createElement("details");
    disclosure.className="v21ArchiveGroup";
    disclosure.dataset.archiveSection=sectionId;
    disclosure.id="v21-archive-"+sectionId;
    const summary=doc.createElement("summary");
    const heading=doc.createElement("span");heading.className="v21ArchiveLabel";
    const strong=doc.createElement("strong");strong.textContent=title;
    const small=doc.createElement("small");small.textContent=subtitle;
    heading.append(strong,small);
    const arrow=doc.createElement("span");arrow.className="v21ArchiveArrow";arrow.setAttribute("aria-hidden","true");arrow.textContent="+";
    summary.append(heading,arrow);
    const inner=doc.createElement("div");inner.className="v21ArchiveContent";
    disclosure.append(summary,inner);body.append(disclosure);groupMap.set(sectionId,disclosure);
    if(sectionId==="project-notes"){
      const headingNode=doc.querySelector("#case-files .caseNotesHead");
      const gridNode=doc.getElementById("caseFilesGrid");
      if(headingNode&&gridNode){
        const section=doc.createElement("section");section.className="v21ProjectNotes";section.id="project-notes";
        section.append(headingNode,gridNode);inner.append(section);
        disclosure.addEventListener("toggle",()=>{
          if(!disclosure.open)return;
          gridNode.hidden=false;
          const button=doc.getElementById("caseNotesToggle");
          if(button){button.setAttribute("aria-expanded","true");button.innerHTML='Collapse case notes <span aria-hidden="true">↗</span>';}
        });
      }
      continue;
    }
    const target=doc.getElementById(sectionId);
    if(!target)continue;
    const direct=[...main.children].find(ch=>ch===target||ch.contains(target));
    if(direct&&!body.contains(direct)&&direct!==hero&&direct!==archive&&direct!==workspace)inner.append(direct);
  }
  const showArchiveGroup=(id)=>{const group=groupMap.get(id);if(group)group.open=true;return group};
  const revealArchive=(hash,{scroll=true}={})=>{
    const targetId=hash?.startsWith("#proof/")?"field-proof":String(hash||"").replace(/^#/,"");
    const target=doc.getElementById(targetId);
    if(!target||!body.contains(target))return false;
    const group=target.closest(".v21ArchiveGroup");if(group)group.open=true;
    if(/^case-(ohs|news|mulyankan|earthbridge)$/.test(targetId)){
      showArchiveGroup("project-notes");
      const grid=doc.getElementById("caseFilesGrid");if(grid)grid.hidden=false;
      const toggle=doc.getElementById("caseNotesToggle");
      if(toggle){toggle.setAttribute("aria-expanded","true");toggle.innerHTML='Collapse case notes <span aria-hidden="true">↗</span>';}
      target.querySelector("details.caseFileDetails")?.setAttribute("open","");
    }
    if(scroll)win.requestAnimationFrame?.(()=>target.scrollIntoView({behavior:"auto",block:"start"}));
    return true;
  };
  doc.addEventListener("portfolio:archive-preview",ev=>{
    const hash=ev.detail?.hash;if(typeof hash==="string")revealArchive(hash,{scroll:false});
  });
  const inspector=doc.getElementById("v20Inspector"),list=doc.getElementById("v20ProjectList"),search=doc.getElementById("v20Search");
  const get=()=>entry.find(p=>p.id===id)||entry[0];
  const first=()=>V20_SETTINGS[role];
  const emit=(method="replaceState",hash="#v20-workspace")=>{
    const result=commitV207Route(win,{
      role,project:id,panel:tab,hash,
      stage:stageTokenByProject.get(id)??null,
      capture:captureTokenByProject.get(id)??null
    },{method});
    if(!result.committed)announce("The selection is active locally, but this browser did not update the shareable URL.");
    else{
      previewActive=false;clearPreviewCheckpoint();renderPreviewBar();
      doc.dispatchEvent(new win.CustomEvent("portfolio:navigation-committed",{detail:{role,project:id,panel:tab,hash}}));
    }
    return result;
  };
  const renderPreviewBar=()=>{
    inspector.querySelector(".v25PreviewBar")?.remove();
    workspace.dataset.previewing=String(previewActive);
    if(!previewActive)return;
    const intro=inspector.querySelector(".v20ProjectIntro");
    if(!intro)return;
    const bar=doc.createElement("div");bar.className="v25PreviewBar";bar.setAttribute("role","status");
    const note=doc.createElement("span");note.textContent="Preview only — your shared link has not changed";
    const actions=doc.createElement("span");actions.className="v251PreviewActions";
    const back=doc.createElement("button");back.type="button";back.dataset.v251Cancel="true";back.textContent="Return ↶";
    back.setAttribute("aria-label","Return to your last selected project and view");
    const pin=doc.createElement("button");pin.type="button";pin.dataset.v25Commit="true";pin.textContent="Keep this view ↗";
    actions.append(back,pin);bar.append(note,actions);intro.append(bar);
  };
  const commitSelection=(method="pushState",hash="#v20-workspace")=>emit(method,hash);
  const slugStep=x=>slug(x);
  const getShots=p=>{
    const prefixes={mulyankan:"mulyankan-",earthbridge:"earthbridge-",newssources:"news-","our-hidden-universe":"ohs-",schoolbuddies:"schoolbuddies-"};
    const prefix=prefixes[p.id];
    const shots=manifest&&prefix?Object.entries(manifest).filter(([k,v])=>k.startsWith(prefix)&&v&&/^\/evidence\/[a-z-]+\.webp$/.test(v.path)):[];
    if(!shots.length&&p.evidenceImage){
      // The screenshot file name is a stable capture ID even before the full
      // manifest is loaded. Never put a generic project slug in a capture link.
      const fallbackId=p.evidenceImage.split("/").at(-1)?.replace(/\.webp$/,"")||p.id;
      shots.push([fallbackId,{path:p.evidenceImage,caption:p.evidenceImageCaption||p.title}]);
    }
    return shots;
  };
  const relevant=()=>{
    const q=search.value.trim().toLowerCase(),rank=first().order;
    return entry.filter(p=>!q||[p.title,p.description,p.category,p.status,...p.stack].join(" ").toLowerCase().includes(q)).sort((a,b)=>{
      const x=rank.indexOf(a.id),y=rank.indexOf(b.id);return (x<0?99:x)-(y<0?99:y);
    });
  };
  function renderList(){
    const shown=relevant();
    // Keep buttons mounted during hover preview: replacing them under the
    // pointer previously cancelled the subsequent click/commit action.
    const signature=shown.map(p=>p.id).join("|");
    if(list.dataset.signature!==signature){
      list.innerHTML=shown.map(p=>`<button type="button" data-v20-project="${e(p.id)}" aria-pressed="false"><span class="v20Num">${e(p.number)}</span><span><strong>${e(p.title)}</strong><small>${e(p.stack.slice(0,2).join(" · "))}</small></span><span aria-hidden="true">↗</span></button>`).join("")||'<p class="v20NoResults">No matches. Try another technology or project name.</p>';
      list.dataset.signature=signature;
    }
    list.querySelectorAll("[data-v20-project]").forEach(b=>{
      const chosen=b.dataset.v20Project===id;
      b.setAttribute("aria-pressed",String(chosen));
      b.classList.toggle("v20Selected",chosen);
    });
    doc.getElementById("v20Count").textContent=`${shown.length} / ${entry.length} projects`;
  }
  function links(p){return p.links.filter(x=>safe(x.url)).map(x=>`<a href="${safe(x.url)}" target="_blank" rel="noopener noreferrer">${e(x.label)} ↗</a>`).join("")}
  function image(p){
    const s=safe(p.evidenceImage);
    return s?`<figure class="v20HeroImage"><img loading="lazy" src="${s}" alt="${e(p.evidenceImageCaption||p.title+" screenshot")}"><figcaption>${e(p.evidenceImageCaption||"Project screenshot")}</figcaption></figure>`:`<div class="v20NoPhoto">No verified screenshot is available for ${e(p.title)}.</div>`;
  }
  function detailRecord(p){
    const key=projectToCase[p.id],record=key?caseDossiers[key]:null;
    if(!record)return "";
    return `<details class="v25EngineeringRecord"><summary><strong>Engineering decisions & test evidence</strong><span>Source-backed details ↗</span></summary>
      <div class="v25RecordBody"><section><h5>Key decision</h5><p>${e(record.decision)}</p></section>
        <section><h5>Trade-off</h5><p>${e(record.tradeoff)}</p></section>
        <section><h5>How to verify</h5><p>${e(record.reproducible)}</p></section>
        <section><h5>Expected behavior</h5><p>${e(record.expected)}</p></section>
        <section><h5>Validation boundary</h5><p>${e(record.state)}</p></section>
        <div class="v251RelatedViews" aria-label="Related project inspection views">
          <button type="button" data-v251-jump="architecture">Architecture ↗</button>
          <button type="button" data-v251-jump="media">Saved screenshots ↗</button>
          <button type="button" data-v251-jump="evidence">Verification & limitations ↗</button>
        </div>
        <div class="v25RecordLinks">${record.evidence.filter(x=>safe(x[1])).map(([label,url])=>`<a href="${safe(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ↗</a>`).join("")}</div>
        <a class="v25CaseLink" href="#case-${key}" data-v20-case>Open complete engineering case ↗</a>
      </div></details>`;
  }
  function overview(p){return `<div class="v20Split">${image(p)}<div class="v20Fields"><h4>What it solves</h4><p>${e(p.caseStudy.problem)}</p><h4>Implementation</h4><p>${e(p.caseStudy.approach)}</p><div class="v20Links">${links(p)}</div></div></div>${detailRecord(p)}`}
  function media(p){
    const shots=getShots(p);
    const desired=captureTokenByProject.get(p.id);
    const found=shots.findIndex(([key])=>key===desired);
    if(found>=0)capture=found;
    capture=Math.min(capture,Math.max(shots.length-1,0));
    const selected=shots[capture];
    // Upgrade a fallback ID to the real manifest ID when it becomes available.
    if(selected&&(!desired||found>=0||desired===p.id))captureTokenByProject.set(p.id,selected[0]);
    return `<div class="v20Media">${p.id==="earthbridge"?'<p class="v20Notice">Evaluation figures are repository-reported, not independently verified.</p>':""}
      ${p.id==="mulyankan"?'<button data-v20-video type="button" class="v20VideoButton">▶ Watch original presenter recordings (17s / 20s)</button>':""}
      ${manifestError?'<p class="v20Notice">Gallery unavailable. <button data-v20-retry type="button">Retry</button></p>':""}
      ${selected?`<figure><img loading="lazy" src="${safe(selected[1].path)}" alt="${e(selected[1].caption)}"><figcaption>${e(selected[1].caption)}</figcaption></figure><div class="v20Thumbs" role="group" aria-label="Select a project capture">${shots.map(([k,s],n)=>`<button type="button" data-v20-capture="${n}" data-v20-capture-id="${e(k)}" aria-pressed="${n===capture}" title="${e(s.caption)}"><img data-src="${safe(s.path)}" loading="lazy" decoding="async" alt=""><span>${n+1}</span></button>`).join("")}</div>`:"<p>No verified project capture. Open the project source instead.</p>"}</div>`;
  }
  function architecture(p){
    const stages=V20_FLOWS[p.id]||[["Implementation",p.caseStudy.approach]];
    const desiredStage=stageTokenByProject.get(p.id);
    const foundStage=stages.findIndex(([name])=>slugStep(name)===desiredStage);
    if(foundStage>=0)stage=foundStage;
    stage=Math.min(stage,stages.length-1);
    if(!desiredStage||foundStage>=0)stageTokenByProject.set(p.id,slugStep(stages[stage][0]));
    return `<div class="v20Architecture"><p>Inspect design stages. This is an explanatory view, not a live trace.</p><div class="v20Stages" role="group" aria-label="Inspect architecture stages">${stages.map(([name],i)=>`<button type="button" data-v20-stage="${i}" data-v20-stage-id="${e(slugStep(name))}" aria-pressed="${i===stage}"><small>0${i+1}</small><strong>${e(name)}</strong></button>`).join("")}</div><div class="v20StageDetail"><small>STAGE ${stage+1}</small><h4>${e(stages[stage][0])}</h4><p>${e(stages[stage][1])}</p></div><div class="v20Links">${links(p)}</div></div>`;
  }
  function evidence(p){
    const cases={mulyankan:"mulyankan",earthbridge:"earthbridge",newssources:"news","our-hidden-universe":"ohs"};
    return `<div class="v20Evidence"><section><h4>Documented verification</h4><p>${e(p.caseStudy.verification)}</p></section><section><h4>Limitations</h4><p>${e(p.caseStudy.caveat)}</p></section><div class="v20Links">${links(p)}${cases[p.id]?`<a href="#case-${cases[p.id]}" data-v20-case>Full technical case study ↗</a>`:""}</div></div>`;
  }
  function render(){
    const p=get();if(!p)return;
    inspector.dataset.activeTab=tab;
    inspector.innerHTML=`<div class="v20ProjectIntro"><div><span>${e(p.category)}</span><span class="v20Status">${e(p.status)}</span></div><h3>${e(p.title)}</h3><p>${e(p.description)}</p><div class="v20Tags">${p.stack.map(x=>`<button type="button" data-v20-tech="${e(x)}" aria-label="Filter projects using ${e(x)}">${e(x)}</button>`).join("")}</div></div>
    <nav class="v25ContextPath" aria-label="Project context"><span>Selected work</span><span aria-hidden="true">/</span><strong>${e(p.title)}</strong><span aria-hidden="true">/</span><span>${e(tab==="media"?"Screens":tab==="architecture"?"Architecture":tab==="evidence"?"Evidence":"Overview")}</span><button type="button" data-v25-copy aria-label="Copy link to this project and exact inspection state">Copy link ↗</button></nav>
    <div class="v20Tabs" role="tablist" aria-label="Project inspection views">${["overview","media","architecture","evidence"].map(t=>`<button type="button" id="v20-${t}" role="tab" data-v20-tab="${t}" tabindex="${t===tab?0:-1}" aria-selected="${t===tab}" aria-controls="v20Panel">${t==="media"?"Screens":t==="architecture"?"Architecture":t==="evidence"?"Evidence":"Overview"}</button>`).join("")}</div>
    <div id="v20Panel" role="tabpanel" tabindex="0" aria-labelledby="v20-${tab}">${tab==="overview"?overview(p):tab==="media"?media(p):tab==="architecture"?architecture(p):evidence(p)}</div>`;
    renderList();
    renderPreviewBar();
    doc.dispatchEvent(new win.CustomEvent("portfolio:v20-render",{detail:{projectId:p.id,role,tab}}));
    inspector.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>{
      if(!img.isConnected)return;
      if(img.closest(".v20Thumbs")){img.hidden=true;return}
      const fallback=doc.createElement("p");fallback.className="v20Unavailable";fallback.textContent="Saved image unavailable. Try the original gallery or source link.";img.replaceWith(fallback);
    },{once:true}));
    if(tab==="media"&&!manifest&&!manifestPromise&&!manifestError)loadManifest();
  }
  async function loadManifest(force=false){
    if(manifestPromise)return;
    if(force)manifestError=false;
    manifestPromise=win.fetch("/evidence/manifest.json").then(x=>x.ok?x.json():null).then(x=>{if(x&&typeof x==="object"&&!Array.isArray(x)){manifest=x;manifestError=false}else manifestError=true}).catch(()=>{manifestError=true}).finally(()=>{
      manifestPromise=null;
      if(tab==="media"){
        const focus=doc.activeElement?.dataset?.v20Tab;
        render();
        if(focus)inspector.querySelector(`[data-v20-tab="${focus}"]`)?.focus();
      }
    });
  }
  const announce=(msg)=>{let status=doc.getElementById("v20Announce");if(!status){status=doc.createElement("span");status.id="v20Announce";status.className="srOnly";status.setAttribute("role","status");workspace.append(status)}status.textContent=msg};
  function chooseProject(next,update=true,keepFocus=false){
    if(!ids.includes(next))return;
    if(id===next){
      if(update)commitSelection("pushState");
      if(keepFocus)list.querySelector(`[data-v20-project="${id}"]`)?.focus();
      return;
    }
    // Preserve the visitor's inspection context while navigating between projects.
    captureByProject.set(id,capture);stageByProject.set(id,stage);tabByProject.set(id,tab);
    id=next;capture=captureByProject.get(id)??0;stage=stageByProject.get(id)??0;
    tab=tabByProject.get(id)??tab;
    if(search.value&&!relevant().some(p=>p.id===next))search.value="";
    render();updateSearchNotice();
    if(keepFocus)list.querySelector(`[data-v20-project="${id}"]`)?.focus();
    announce(`${get().title} selected`);
    if(update)commitSelection("pushState");
    if(update&&win.matchMedia?.("(max-width:730px)").matches)inspector.scrollIntoView({behavior:"auto",block:"start"});
  }
  function chooseTab(next,update=true,focus=true){
    if(!["overview","media","architecture","evidence"].includes(next))return;
    if(next!==tab){tab=next;tabByProject.set(id,tab);render();}
    if(update)commitSelection("pushState");
    if(focus)inspector.querySelector(`[data-v20-tab="${tab}"]`)?.focus();
  }
  function chooseRole(next,invokeLegacy=true,update=true){
    next=validRole(next);
    if(next===role&&update){
      commitSelection("pushState");
      return;
    }
    role=next;workspace.dataset.role=role;
    doc.querySelectorAll("[data-v20-role]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v20Role===role)));
    doc.getElementById("v20Title").textContent=first().title;
    doc.getElementById("v20Subtitle").textContent=first().subtitle;
    doc.getElementById("v20Resume").href=first().resume;
    doc.getElementById("v20Resume").setAttribute("aria-label",`Download ${first().label} résumé PDF`);
    doc.getElementById("v20FullShowcase").textContent=`Open ${first().label} full showcase ↗`;
    captureByProject.set(id,capture);stageByProject.set(id,stage);tabByProject.set(id,tab);
    tab=first().tab;id=ids.includes(first().project)?first().project:entry[0].id;
    capture=captureByProject.get(id)??0;stage=stageByProject.get(id)??0;search.value="";
    if(invokeLegacy){
      const prior=doc.documentElement.dataset.v20Syncing;
      doc.documentElement.dataset.v20Syncing='true';
      try{doc.querySelector(`#top [data-switch-role="${role}"]`)?.click()}
      finally{if(prior===undefined)delete doc.documentElement.dataset.v20Syncing;else doc.documentElement.dataset.v20Syncing=prior}
    }
    render();updateSearchNotice();announce(`${first().label} workspace selected`);
    if(update)commitSelection("pushState");
  }
  function restorePreview({announceRestore=true}={}){
    if(!previewSnapshot){
      previewActive=false;renderPreviewBar();return false;
    }
    const snapshot=previewSnapshot;
    clearHover();clearPreviewCheckpoint();
    previewActive=false;
    // Reapply the original role's legacy visual mode, then restore exact
    // project, tab and evidence states. Preview mutations never become history.
    if(role!==snapshot.role)chooseRole(snapshot.role,true,false);
    role=snapshot.role;workspace.dataset.role=role;
    id=snapshot.id;tab=snapshot.tab;capture=snapshot.capture;stage=snapshot.stage;
    projectStateMaps.forEach((m,index)=>{
      m.clear();
      for(const [key,value] of snapshot.maps[index])m.set(key,value);
    });
    render();updateSearchNotice();
    if(announceRestore)announce("Returned to your selected project and view.");
    return true;
  }
  function openLegacy(hash){return revealArchive(hash)}
  function alignRouteDetail(href){
    const detail=readV25DetailRoute(href);
    if(detail.stage)stageTokenByProject.set(id,detail.stage);
    else{stageTokenByProject.delete(id);stage=0}
    if(detail.capture)captureTokenByProject.set(id,detail.capture);
    else{captureTokenByProject.delete(id);capture=0}
  }
  function syncCaseHash(hash){
    const match=String(hash||"").match(/^#case-(ohs|news|mulyankan|earthbridge)$/);
    if(!match)return;
    const target=caseSlugToId[match[1]];
    if(target&&id!==target)chooseProject(target,false,false);
    if(tab!=="evidence")chooseTab("evidence",false,false);
    previewActive=false;renderPreviewBar();
    doc.dispatchEvent(new win.CustomEvent("portfolio:case-route",{detail:{caseId:match[1]}}));
    // Native anchor navigation already created a browser history entry.
    // Replace that entry's query to match the visible case, retaining its hash.
    emit("replaceState",hash);
  }
  workspace.addEventListener("click",ev=>{
    const b=ev.target.closest("button[data-v20-project],button[data-v20-tab],button[data-v20-role],button[data-v20-stage],button[data-v20-capture],button[data-v20-video],button[data-v20-retry],button[data-v20-tech],button[data-v25-commit],button[data-v25-copy],button[data-v251-cancel],button[data-v251-jump]");
    if(!b)return;
    if(b.hasAttribute("data-v251-cancel")){restorePreview();return}
    if(b.hasAttribute("data-v251-jump")){
      chooseTab(b.dataset.v251Jump,true,true);
      return;
    }
    if(b.hasAttribute("data-v25-commit")){commitSelection("pushState");return}
    if(b.hasAttribute("data-v25-copy")){
      const result=commitSelection("pushState");
      if(!result.committed)return;
      const url=win.location.href;
      const copy=win.navigator?.clipboard?.writeText;
      if(typeof copy!=="function"){announce("Copy unavailable. Use the browser address bar.");return}
      Promise.resolve(copy.call(win.navigator.clipboard,url)).then(()=>announce("Shareable project link copied")).catch(()=>announce("Copy unavailable. Use the browser address bar."));
      return;
    }
    if(b.dataset.v20Project){chooseProject(b.dataset.v20Project,true,true);return}
    if(b.dataset.v20Tech){
      search.value=b.dataset.v20Tech;renderList();updateSearchNotice();search.focus();
      announce(`Showing projects using ${b.dataset.v20Tech}`);return
    }
    if(b.dataset.v20Tab){chooseTab(b.dataset.v20Tab);return}
    if(b.dataset.v20Role){chooseRole(b.dataset.v20Role);return}
    if(b.hasAttribute("data-v20-stage")){
      stage=Number(b.dataset.v20Stage);stageByProject.set(id,stage);
      stageTokenByProject.set(id,b.dataset.v20StageId||slugStep((V20_FLOWS[id]||[])[stage]?.[0]||"implementation"));
      render();commitSelection("pushState");inspector.querySelector(`[data-v20-stage="${stage}"]`)?.focus();return
    }
    if(b.hasAttribute("data-v20-capture")){
      capture=Number(b.dataset.v20Capture);captureByProject.set(id,capture);
      const token=b.dataset.v20CaptureId;
      if(token)captureTokenByProject.set(id,token);
      render();commitSelection("pushState");inspector.querySelector(`[data-v20-capture="${capture}"]`)?.focus();return
    }
    if(b.hasAttribute("data-v20-video")){const original=doc.querySelector("#home .v19MilestoneOpen");if(original)original.click();else announce("Original video unavailable");return}
    if(b.hasAttribute("data-v20-retry"))loadManifest(true);
  });
  // Hover-preview contract: fine mouse/stylus input only. Touch and keyboard
  // keep explicit activation. Dwell avoids unwanted previews when crossing rows.
  // Never autoplay video or open outbound links on pointer movement.
  const canHover=()=>!!win.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
  let hoverTimer=0,hoverTarget=null;
  const clearHover=()=>{
    win.clearTimeout(hoverTimer);
    hoverTimer=0;hoverTarget=null;
  };
  const preview=(button)=>{
    if(!button?.isConnected||!workspace.contains(button))return;
    if(
      (button.hasAttribute("data-v20-project")&&id===button.dataset.v20Project)||
      (button.hasAttribute("data-v20-role")&&role===button.dataset.v20Role)||
      (button.hasAttribute("data-v20-tab")&&tab===button.dataset.v20Tab)||
      (button.hasAttribute("data-v20-stage")&&stage===Number(button.dataset.v20Stage))||
      (button.hasAttribute("data-v20-capture")&&capture===Number(button.dataset.v20Capture))
    )return;
    rememberPreview();
    previewActive=true;
    if(button.hasAttribute("data-v20-project")){
      if(id===button.dataset.v20Project)return;
      chooseProject(button.dataset.v20Project,false,false);
    }else if(button.hasAttribute("data-v20-role")){
      if(role===button.dataset.v20Role)return;
      chooseRole(button.dataset.v20Role,true,false);
    }else if(button.hasAttribute("data-v20-tab")){
      if(tab===button.dataset.v20Tab)return;
      chooseTab(button.dataset.v20Tab,false,false);
    }else if(button.hasAttribute("data-v20-stage")){
      const next=Number(button.dataset.v20Stage);
      if(stage===next)return;
      stage=next;stageByProject.set(id,stage);
      stageTokenByProject.set(id,button.dataset.v20StageId||slugStep((V20_FLOWS[id]||[])[stage]?.[0]||"implementation"));
      render();
    }else if(button.hasAttribute("data-v20-capture")){
      const next=Number(button.dataset.v20Capture);
      if(capture===next)return;
      capture=next;captureByProject.set(id,capture);
      if(button.dataset.v20CaptureId)captureTokenByProject.set(id,button.dataset.v20CaptureId);
      render();
    }else return;
    renderPreviewBar();
    // Hover only changes the visible preview. Browser history remains committed.
  };
  workspace.addEventListener("pointerover",ev=>{
    if(!canHover()||ev.pointerType==="touch")return;
    const b=ev.target.closest?.("button[data-v20-project],button[data-v20-role],button[data-v20-tab],button[data-v20-stage],button[data-v20-capture]");
    if(!b||!workspace.contains(b)||b.contains(ev.relatedTarget)||b===hoverTarget)return;
    clearHover();hoverTarget=b;
    hoverTimer=win.setTimeout(()=>{hoverTimer=0;hoverTarget=null;preview(b)},180);
  });
  workspace.addEventListener("pointerout",ev=>{
    if(hoverTarget&&hoverTarget.contains(ev.target)&&!hoverTarget.contains(ev.relatedTarget))clearHover();
  });
  workspace.addEventListener("pointerdown",clearHover);
  workspace.addEventListener("pointercancel",clearHover);
  // Leaving the whole explorer (not a row) reverts an uncommitted preview.
  // The delay allows people to move into the inspector without flicker.
  workspace.addEventListener("pointerenter",()=>{
    win.clearTimeout(previewRestoreTimer);previewRestoreTimer=0;
  });
  workspace.addEventListener("pointerleave",()=>{
    clearHover();
    win.clearTimeout(previewRestoreTimer);
    if(previewActive)previewRestoreTimer=win.setTimeout(()=>restorePreview({announceRestore:false}),550);
  });
  doc.addEventListener("keydown",ev=>{
    if(ev.key!=="Escape"||!previewActive||doc.querySelector("#commandDialog")?.open)return;
    ev.preventDefault();restorePreview();
  });
  // Restrained pointer light, rAF-throttled and confined to one panel.
  if(canHover()&&!win.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches){
    let frame=0,px=0,py=0;
    inspector.addEventListener("pointermove",ev=>{
      if(ev.pointerType==="touch")return;
      const rect=inspector.getBoundingClientRect();
      px=ev.clientX-rect.left;py=ev.clientY-rect.top;
      if(frame)return;
      frame=win.requestAnimationFrame(()=>{
        frame=0;
        inspector.style.setProperty("--quality-pointer-x",px+"px");
        inspector.style.setProperty("--quality-pointer-y",py+"px");
        inspector.classList.add("qualityPointerActive");
      });
    },{passive:true});
    inspector.addEventListener("pointerleave",()=>{
      inspector.classList.remove("qualityPointerActive");
      if(frame){win.cancelAnimationFrame(frame);frame=0;}
    });
  }
  workspace.addEventListener("keydown",ev=>{
    const b=ev.target.closest('[role="tab"][data-v20-tab]');if(!b||!["ArrowLeft","ArrowRight","Home","End"].includes(ev.key))return;
    ev.preventDefault();const all=["overview","media","architecture","evidence"];
    const n=ev.key==="Home"?0:ev.key==="End"?3:(all.indexOf(tab)+(ev.key==="ArrowRight"?1:3))%4;chooseTab(all[n]);
  });
  const searchNotice=doc.getElementById('v20SearchNotice');
  function updateSearchNotice(){
    const q=search.value.trim(),shown=relevant(),selectedShown=shown.some(p=>p.id===id);
    searchNotice.hidden=!q||selectedShown||!shown.length;
    searchNotice.textContent=searchNotice.hidden?'':`${shown.length} matching project${shown.length===1?'':'s'}. Select a result to update the inspector.`;
  }
  search.addEventListener('input',()=>{renderList();updateSearchNotice()});
  search.addEventListener('keydown',ev=>{
    if(ev.key!=='Enter')return;
    const match=relevant()[0];if(!match)return;
    ev.preventDefault();chooseProject(match.id,true,false);
    updateSearchNotice();inspector.querySelector('[role="tab"][aria-selected="true"]')?.focus();
  });
  doc.addEventListener("click",ev=>{
    const quick=ev.target.closest('a[data-v20-open-project]');
    if(quick&&ids.includes(quick.dataset.v20OpenProject)){
      ev.preventDefault();
      chooseProject(quick.dataset.v20OpenProject,true,false);
      
      workspace.scrollIntoView({behavior:'auto',block:'start'});
      return;
    }
    const a=ev.target.closest('a[href^="#"]');
    if(!a)return;
    const hash=a.getAttribute("href");
    if(hash==="#v20-workspace"||hash==="#v20Archive")return;
    if(!revealArchive(hash,{scroll:false}))return;
    // Native anchor scrolling can use the pre-expansion geometry of a <details>
    // section. Own this explicit navigation so the actual target reaches view.
    ev.preventDefault();
    if(previewActive)restorePreview({announceRestore:false});
    const directCase=hash.match(/^#case-(ohs|news|mulyankan|earthbridge)$/);
    if(directCase){
      const target=caseSlugToId[directCase[1]];
      if(target&&id!==target)chooseProject(target,false,false);
      if(tab!=="evidence")chooseTab("evidence",false,false);
      doc.dispatchEvent(new win.CustomEvent("portfolio:case-route",{detail:{caseId:directCase[1]}}));
    }
    commitSelection("pushState",hash);
    const targetId=hash.startsWith("#proof/")?"field-proof":hash.slice(1);
    win.requestAnimationFrame?.(()=>win.requestAnimationFrame?.(()=>{
      doc.getElementById(targetId)?.scrollIntoView({behavior:"auto",block:"start"});
    }));
  },true);
  win.addEventListener("hashchange",()=>{
    if(previewActive)restorePreview({announceRestore:false});
    openLegacy(win.location.hash);
    syncCaseHash(win.location.hash);
  });
  win.addEventListener("popstate",()=>{
    clearHover();
    if(previewActive)restorePreview({announceRestore:false});
    previewActive=false;
    const next=readV207Route(win.location.href,ids);
    if(next.role!==role)chooseRole(next.role,true,false);
    captureByProject.set(id,capture);stageByProject.set(id,stage);tabByProject.set(id,tab);
    id=next.project;tab=next.panel;capture=captureByProject.get(id)??0;stage=stageByProject.get(id)??0;
    alignRouteDetail(win.location.href);
    render();
    openLegacy(next.hash);
    doc.dispatchEvent(new win.CustomEvent("portfolio:navigation-committed",{detail:{role,project:id,panel:tab,hash:next.hash}}));
  });
  doc.addEventListener("portfolio:case-selection",ev=>{
    const target=caseSlugToId[ev.detail?.caseId];
    if(!target||!ids.includes(target))return;
    chooseProject(target,false,false);
    chooseTab("evidence",false,false);
    commitSelection("pushState","#case-files");
  });
  doc.addEventListener('portfolio:legacy-role-request',ev=>{
    const requested=validRole(ev.detail?.role);
    const preview=ev.detail?.preview===true;
    if(requested!==role){
      if(preview)rememberPreview();
      previewActive=preview;
      chooseRole(requested,false,!preview);
      if(preview)renderPreviewBar();
    }else if(!preview)commitSelection("pushState");
  });
  chooseRole(role,false,false);
  // Restore the exact shared stage/capture after the legacy role initializes.
  if(initialRoute.project!==id||initialRoute.panel!==tab){
    id=initialRoute.project;tab=initialRoute.panel;
  }
  alignRouteDetail(win.location.href);
  render();
  doc.dispatchEvent(new win.CustomEvent("portfolio:navigation-committed",{detail:{role,project:id,panel:tab,hash:initialRoute.hash}}));
  if(initialRoute.hash){
    openLegacy(initialRoute.hash);
    if(initialRoute.hash.startsWith("#case-"))syncCaseHash(initialRoute.hash);
  }
  return {workspace,archive};
};
