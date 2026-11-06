import {readV207Route,commitV207Route} from './v207-route.js'
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
  const emit=(method="replaceState")=>{
    const result=commitV207Route(win,{role,project:id,panel:tab},{method});
    if(!result.committed)announce("The selection is active locally, but this browser did not update the shareable URL.");
    return result;
  };
  const relevant=()=>{
    const q=search.value.trim().toLowerCase(),rank=first().order;
    return entry.filter(p=>!q||[p.title,p.description,p.category,p.status,...p.stack].join(" ").toLowerCase().includes(q)).sort((a,b)=>{
      const x=rank.indexOf(a.id),y=rank.indexOf(b.id);return (x<0?99:x)-(y<0?99:y);
    });
  };
  function renderList(){
    const shown=relevant();
    list.innerHTML=shown.map(p=>`<button type="button" data-v20-project="${e(p.id)}" aria-pressed="${p.id===id}" class="${p.id===id?"v20Selected":""}"><span class="v20Num">${e(p.number)}</span><span><strong>${e(p.title)}</strong><small>${e(p.stack.slice(0,2).join(" · "))}</small></span><span aria-hidden="true">↗</span></button>`).join("")||'<p class="v20NoResults">No matches. Try another technology or project name.</p>';
    doc.getElementById("v20Count").textContent=`${shown.length} / ${entry.length} projects`;
  }
  function links(p){return p.links.filter(x=>safe(x.url)).map(x=>`<a href="${safe(x.url)}" target="_blank" rel="noopener noreferrer">${e(x.label)} ↗</a>`).join("")}
  function image(p){
    const s=safe(p.evidenceImage);
    return s?`<figure class="v20HeroImage"><img loading="lazy" src="${s}" alt="${e(p.evidenceImageCaption||p.title+" screenshot")}"><figcaption>${e(p.evidenceImageCaption||"Project screenshot")}</figcaption></figure>`:`<div class="v20NoPhoto">No verified screenshot is available for ${e(p.title)}.</div>`;
  }
  function overview(p){return `<div class="v20Split">${image(p)}<div class="v20Fields"><h4>What it solves</h4><p>${e(p.caseStudy.problem)}</p><h4>Implementation</h4><p>${e(p.caseStudy.approach)}</p><div class="v20Links">${links(p)}</div></div></div>`}
  function media(p){
    const prefixes={mulyankan:"mulyankan-",earthbridge:"earthbridge-",newssources:"news-","our-hidden-universe":"ohs-",schoolbuddies:"schoolbuddies-"};
    const prefix=prefixes[p.id];
    const shots=manifest&&prefix?Object.entries(manifest).filter(([k,v])=>k.startsWith(prefix)&&v&&/^\/evidence\/[a-z-]+\.webp$/.test(v.path)):[];
    if(!shots.length&&p.evidenceImage)shots.push([p.id,{path:p.evidenceImage,caption:p.evidenceImageCaption||p.title}]);
    capture=Math.min(capture,Math.max(shots.length-1,0));
    const selected=shots[capture];
    return `<div class="v20Media">${p.id==="earthbridge"?'<p class="v20Notice">Evaluation figures are repository-reported, not independently verified.</p>':""}
      ${p.id==="mulyankan"?'<button data-v20-video type="button" class="v20VideoButton">▶ Watch original presenter recordings (17s / 20s)</button>':""}
      ${manifestError?'<p class="v20Notice">Gallery unavailable. <button data-v20-retry type="button">Retry</button></p>':""}
      ${selected?`<figure><img loading="lazy" src="${safe(selected[1].path)}" alt="${e(selected[1].caption)}"><figcaption>${e(selected[1].caption)}</figcaption></figure><div class="v20Thumbs" role="group" aria-label="Select a project capture">${shots.map(([k,s],n)=>`<button type="button" data-v20-capture="${n}" aria-pressed="${n===capture}" title="${e(s.caption)}"><img src="${safe(s.path)}" loading="lazy" alt=""><span>${n+1}</span></button>`).join("")}</div>`:"<p>No verified project capture. Open the project source instead.</p>"}</div>`;
  }
  function architecture(p){
    const stages=V20_FLOWS[p.id]||[["Implementation",p.caseStudy.approach]];
    stage=Math.min(stage,stages.length-1);
    return `<div class="v20Architecture"><p>Inspect design stages. This is an explanatory view, not a live trace.</p><div class="v20Stages" role="group" aria-label="Inspect architecture stages">${stages.map(([name],i)=>`<button type="button" data-v20-stage="${i}" aria-pressed="${i===stage}"><small>0${i+1}</small><strong>${e(name)}</strong></button>`).join("")}</div><div class="v20StageDetail"><small>STAGE ${stage+1}</small><h4>${e(stages[stage][0])}</h4><p>${e(stages[stage][1])}</p></div><div class="v20Links">${links(p)}</div></div>`;
  }
  function evidence(p){
    const cases={mulyankan:"mulyankan",earthbridge:"earthbridge",newssources:"news","our-hidden-universe":"ohs"};
    return `<div class="v20Evidence"><section><h4>Documented verification</h4><p>${e(p.caseStudy.verification)}</p></section><section><h4>Limitations</h4><p>${e(p.caseStudy.caveat)}</p></section><div class="v20Links">${links(p)}${cases[p.id]?`<a href="#case-${cases[p.id]}" data-v20-case>Full technical case study ↗</a>`:""}</div></div>`;
  }
  function render(){
    const p=get();if(!p)return;
    inspector.dataset.activeTab=tab;
    inspector.innerHTML=`<div class="v20ProjectIntro"><div><span>${e(p.category)}</span><span class="v20Status">${e(p.status)}</span></div><h3>${e(p.title)}</h3><p>${e(p.description)}</p><div class="v20Tags">${p.stack.map(x=>`<button type="button" data-v20-tech="${e(x)}" aria-label="Filter projects using ${e(x)}">${e(x)}</button>`).join("")}</div></div>
    <div class="v20Tabs" role="tablist" aria-label="Project inspection views">${["overview","media","architecture","evidence"].map(t=>`<button type="button" id="v20-${t}" role="tab" data-v20-tab="${t}" tabindex="${t===tab?0:-1}" aria-selected="${t===tab}" aria-controls="v20Panel">${t==="media"?"Screens":t==="architecture"?"Architecture":t==="evidence"?"Evidence":"Overview"}</button>`).join("")}</div>
    <div id="v20Panel" role="tabpanel" tabindex="0" aria-labelledby="v20-${tab}">${tab==="overview"?overview(p):tab==="media"?media(p):tab==="architecture"?architecture(p):evidence(p)}</div>`;
    renderList();
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
      if(update)emit("replaceState");
      if(keepFocus)list.querySelector(`[data-v20-project="${id}"]`)?.focus();
      return;
    }
    id=next;capture=0;stage=0;
    if(search.value&&!relevant().some(p=>p.id===next))search.value="";
    render();updateSearchNotice();
    if(keepFocus)list.querySelector(`[data-v20-project="${id}"]`)?.focus();
    announce(`${get().title} selected`);
    if(update)emit("pushState");
    if(update&&win.matchMedia?.("(max-width:730px)").matches)inspector.scrollIntoView({behavior:"auto",block:"start"});
  }
  function chooseTab(next,update=true,focus=true){
    if(!["overview","media","architecture","evidence"].includes(next))return;
    if(next!==tab){tab=next;render();}
    if(update)emit("replaceState");
    if(focus)inspector.querySelector(`[data-v20-tab="${tab}"]`)?.focus();
  }
  function chooseRole(next,invokeLegacy=true,update=true){
    next=validRole(next);
    if(next===role&&update){
      emit("replaceState");
      return;
    }
    role=next;workspace.dataset.role=role;
    doc.querySelectorAll("[data-v20-role]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v20Role===role)));
    doc.getElementById("v20Title").textContent=first().title;
    doc.getElementById("v20Subtitle").textContent=first().subtitle;
    doc.getElementById("v20Resume").href=first().resume;
    doc.getElementById("v20Resume").setAttribute("aria-label",`Download ${first().label} résumé PDF`);
    doc.getElementById("v20FullShowcase").textContent=`Open ${first().label} full showcase ↗`;
    tab=first().tab;id=ids.includes(first().project)?first().project:entry[0].id;
    capture=0;stage=0;search.value="";
    if(invokeLegacy){
      const prior=doc.documentElement.dataset.v20Syncing;
      doc.documentElement.dataset.v20Syncing='true';
      try{doc.querySelector(`#top [data-switch-role="${role}"]`)?.click()}
      finally{if(prior===undefined)delete doc.documentElement.dataset.v20Syncing;else doc.documentElement.dataset.v20Syncing=prior}
    }
    render();updateSearchNotice();announce(`${first().label} workspace selected`);
    if(update)emit("pushState");
  }
  function openLegacy(hash){return revealArchive(hash)}
  workspace.addEventListener("click",ev=>{
    const b=ev.target.closest("button[data-v20-project],button[data-v20-tab],button[data-v20-role],button[data-v20-stage],button[data-v20-capture],button[data-v20-video],button[data-v20-retry],button[data-v20-tech]");
    if(!b)return;
    if(b.dataset.v20Project){chooseProject(b.dataset.v20Project,true,true);return}
    if(b.dataset.v20Tech){
      search.value=b.dataset.v20Tech;renderList();updateSearchNotice();search.focus();
      announce(`Showing projects using ${b.dataset.v20Tech}`);return
    }
    if(b.dataset.v20Tab){chooseTab(b.dataset.v20Tab);return}
    if(b.dataset.v20Role){chooseRole(b.dataset.v20Role);return}
    if(b.hasAttribute("data-v20-stage")){stage=Number(b.dataset.v20Stage);render();inspector.querySelector(`[data-v20-stage="${stage}"]`)?.focus();return}
    if(b.hasAttribute("data-v20-capture")){capture=Number(b.dataset.v20Capture);render();inspector.querySelector(`[data-v20-capture="${capture}"]`)?.focus();return}
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
      stage=next;render();
    }else if(button.hasAttribute("data-v20-capture")){
      const next=Number(button.dataset.v20Capture);
      if(capture===next)return;
      capture=next;render();
    }else return;
    // Hover previews replace the current history entry, not add dozens of
    // back-button steps. Clicking still records deliberate navigations.
    emit("replaceState");
  };
  workspace.addEventListener("pointerover",ev=>{
    if(!canHover()||ev.pointerType==="touch")return;
    const b=ev.target.closest?.("button[data-v20-project],button[data-v20-role],button[data-v20-tab],button[data-v20-stage],button[data-v20-capture]");
    if(!b||!workspace.contains(b)||b.contains(ev.relatedTarget)||b===hoverTarget)return;
    clearHover();hoverTarget=b;
    hoverTimer=win.setTimeout(()=>{hoverTimer=0;hoverTarget=null;preview(b)},145);
  });
  workspace.addEventListener("pointerout",ev=>{
    if(hoverTarget&&hoverTarget.contains(ev.target)&&!hoverTarget.contains(ev.relatedTarget))clearHover();
  });
  workspace.addEventListener("pointerdown",clearHover);
  workspace.addEventListener("pointercancel",clearHover);
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
    const hash=a.getAttribute("href");if(hash==="#v20Archive"){return}
    if(hash==="#top"){showArchiveGroup("top");return}
    if(hash==="#v20-workspace"){return}
    if(openLegacy(hash)&&win.location.hash===hash)win.requestAnimationFrame?.(()=>doc.getElementById(hash.slice(1))?.scrollIntoView({behavior:"auto",block:"start"}));
  },true);
  win.addEventListener("hashchange",()=>openLegacy(win.location.hash));
  win.addEventListener("popstate",()=>{
    const next=readV207Route(win.location.href,ids);
    if(next.role!==role)chooseRole(next.role,true,false);
    if(next.project!==id||next.panel!==tab){
      id=next.project;tab=next.panel;capture=0;stage=0;render();
    }
    openLegacy(next.hash);
  });
  doc.addEventListener('portfolio:legacy-role-request',ev=>{
    const requested=validRole(ev.detail?.role);
    if(requested!==role){
      const preview=ev.detail?.preview===true;
      chooseRole(requested,false,!preview);
      if(preview)emit("replaceState");
    }
  });
  chooseRole(role,false,false);
  // An incoming shared link may select another project, panel or legacy case anchor.
  if(initialRoute.project!==id||initialRoute.panel!==tab){
    id=initialRoute.project;tab=initialRoute.panel;render();
  }
  if(initialRoute.hash)openLegacy(initialRoute.hash);
  return {workspace,archive};
};
