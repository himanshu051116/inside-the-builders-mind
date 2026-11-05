// V20.1 interactive preview. The existing V19.3 nodes are preserved as an expandable archive.
const V20_SETTINGS={"fullstack":{"label":"Full-Stack","project":"our-hidden-universe","tab":"media","title":"Products & interfaces","subtitle":"Explore the actual interfaces, then inspect the architecture and implementation.","resume":"/resumes/Himanshu_Shukla_fullstack_Public.pdf","order":["our-hidden-universe","mulyankan","schoolbuddies","newssources","earthbridge","sentinel"]},"software":{"label":"Software Systems","project":"newssources","tab":"architecture","title":"Systems & architecture","subtitle":"Trace real project architecture, source records and engineering trade-offs.","resume":"/resumes/Himanshu_Shukla_software_Public.pdf","order":["newssources","mulyankan","sentinel","our-hidden-universe","earthbridge","schoolbuddies"]},"ml":{"label":"Applied ML","project":"earthbridge","tab":"evidence","title":"Research & evaluation","subtitle":"Review model designs, documented results and the boundaries of each prototype.","resume":"/resumes/Himanshu_Shukla_ml_Public.pdf","order":["earthbridge","mulyankan","newssources","sentinel","our-hidden-universe","schoolbuddies"]}};
const V20_FLOWS={"mulyankan":[["Document intake","Inspect submitted files, format and extraction readiness."],["Evidence extraction","Link supporting material to rubric criteria."],["Rubric review","Flag insufficient evidence instead of forcing a complete score."],["Human decision","A reviewer retains final authority and an audit trail."]],"earthbridge":[["Paired scenes","Prepare Sentinel-1 and Sentinel-2 paired observations."],["Descriptors","Map modalities to a shared retrieval space."],["FAISS lookup","Compare encoded descriptors; this view performs no inference."],["Evaluation","Inspect reported metrics and holdout-split limitations."]],"our-hidden-universe":[["Access","Firebase authentication controls private room access."],["Room state","Coordinate presence, messages and shared session state."],["Messaging","Inspect the source-backed messaging implementation."],["Watch Together","Review captured playback and call controls; no live sync test here."]],"newssources":[["Discovery","Collect candidates from RSS and sitemaps."],["Normalize","Extract and deduplicate article identities."],["Persistence","Preserve records, versions and provenance in PostgreSQL."],["Analyst review","Inspect captured source, event and claims screens."]],"sentinel":[["Traffic","Inspect local network flow information."],["Signals","Review early anomalies, not certified detection."],["Forward proxy","Inspect locally validated domain blocking."],["Boundaries","No production-grade WAF performance claimed."]],"schoolbuddies":[["School outreach","Coordinate engagement with schools."],["Curriculum","Prepare programming and AI-literacy workshops."],["Learning","Run hands-on technology demonstrations."],["Website","Accept enquiries through the public project site."]]};
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
  const query=new URL(win.location.href).searchParams;
  let role=validRole(query.get("view")||doc.body.dataset.role);
  let id=ids.includes(query.get("project"))?query.get("project"):V20_SETTINGS[role].project;
  let tab=["overview","media","architecture","evidence"].includes(query.get("panel"))?query.get("panel"):V20_SETTINGS[role].tab;
  let capture=0,stage=0,manifest=null,manifestPromise=null,manifestError=false;
  const workspace=doc.createElement("section");
  workspace.id="v20-workspace";workspace.className="v20Workspace";workspace.setAttribute("aria-labelledby","v20Title");
  workspace.innerHTML=`<div class="v20Wrap"><div class="v20Head"><div><span class="v20Eyebrow">SELECTED WORK</span><h2 id="v20Title">Explore the projects.</h2><p id="v20Subtitle">Choose a project to examine its interface, architecture, sources and limitations.</p></div><span class="v20Hint">Use Ctrl / ⌘ + K to search anywhere</span></div>
    <div class="v20RoleBar" role="group" aria-label="Choose a résumé-specific portfolio experience">
      ${Object.entries(V20_SETTINGS).map(([k,v])=>`<button type="button" data-v20-role="${k}" aria-pressed="false">${e(v.label)}</button>`).join("")}
      <a href="#top" id="v20FullShowcase">Full showcase ↗</a>
      <a href="${V20_SETTINGS.fullstack.resume}" id="v20Resume" download>Download matching résumé ↓</a>
    </div>
    <div class="v20Explorer"><aside class="v20Sidebar"><label for="v20Search">Find projects or technologies</label><input id="v20Search" type="search" autocomplete="off" placeholder="Search: Python, React, PyTorch…"/><div id="v20ProjectList" class="v20ProjectList" aria-label="Select a project"></div><span id="v20Count" class="v20Count"></span><p id="v20SearchNotice" class="v20SearchNotice" hidden></p></aside><section class="v20Inspector" id="v20Inspector" aria-live="off" aria-label="Selected project details"></section></div>
    <div class="v20Foot"><span>Authentic screenshots and source links · simulations clearly identified</span><a href="#v20Archive" id="v20ArchiveLink">Complete portfolio archive ↗</a></div></div>`;
  legacy.insertAdjacentElement("afterend",workspace);
  const archive=doc.createElement("details");archive.className="v20Archive";archive.id="v20Archive";
  archive.innerHTML='<summary><span><strong>Complete portfolio archive</strong><small>Original three résumé showcases, all projects, case studies, captures, tools and interactive labs</small></span><span aria-hidden="true">+</span></summary><div class="v20ArchiveBody"></div>';
  main.append(archive);
  const body=archive.querySelector(".v20ArchiveBody");
  body.append(legacy);
  for(const sectionId of ["work","case-files","field-proof","archive","interactive-lab","about","toolkit","lab"]){
    const target=doc.getElementById(sectionId);
    if(!target)continue;
    const direct=[...main.children].find(ch=>ch===target||ch.contains(target));
    if(direct&&!body.contains(direct)&&direct!==hero&&direct!==archive&&direct!==workspace)body.append(direct);
  }
  const inspector=doc.getElementById("v20Inspector"),list=doc.getElementById("v20ProjectList"),search=doc.getElementById("v20Search");
  const get=()=>entry.find(p=>p.id===id)||entry[0];
  const first=()=>V20_SETTINGS[role];
  const emit=(method="replaceState")=>{
    try{const u=new URL(win.location.href);u.searchParams.set("view",role);u.searchParams.set("project",id);u.searchParams.set("panel",tab);u.hash="v20-workspace";win.history[method]({v20:true},"",u.pathname+u.search+u.hash)}catch{}
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
    return `<div class="v20Media"><p class="v20Notice">Saved project captures, not a live application.${p.id==="earthbridge"?" The evaluation screen contains repository-reported figures, not live model output.":""}</p>
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
    inspector.innerHTML=`<div class="v20ProjectIntro"><div><span>${e(p.category)}</span><span class="v20Status">${e(p.status)}</span></div><h3>${e(p.title)}</h3><p>${e(p.description)}</p><div class="v20Tags">${p.stack.map(x=>`<button type="button" data-v20-tech="${e(x)}" aria-label="Filter projects using ${e(x)}">${e(x)}</button>`).join("")}</div></div>
    <div class="v20Tabs" role="tablist" aria-label="Project inspection views">${["overview","media","architecture","evidence"].map(t=>`<button type="button" id="v20-${t}" role="tab" data-v20-tab="${t}" tabindex="${t===tab?0:-1}" aria-selected="${t===tab}" aria-controls="v20Panel">${t==="media"?"Screens":t==="architecture"?"Architecture":t==="evidence"?"Evidence":"Overview"}</button>`).join("")}</div>
    <div id="v20Panel" role="tabpanel" tabindex="0" aria-labelledby="v20-${tab}">${tab==="overview"?overview(p):tab==="media"?media(p):tab==="architecture"?architecture(p):evidence(p)}</div>`;
    renderList();
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
    id=next;capture=0;stage=0;
    if(search.value&&!relevant().some(p=>p.id===next))search.value="";
    render();updateSearchNotice();
    if(keepFocus)list.querySelector(`[data-v20-project="${id}"]`)?.focus();
    announce(`${get().title} selected`);
    if(update)emit("pushState");
    if(update&&win.matchMedia?.("(max-width:730px)").matches)inspector.scrollIntoView({behavior:"auto",block:"start"});
  }
  function chooseTab(next,update=true){
    if(!["overview","media","architecture","evidence"].includes(next))return;
    tab=next;render();
    if(update)emit("replaceState");
    inspector.querySelector(`[data-v20-tab="${tab}"]`)?.focus();
  }
  function chooseRole(next,invokeLegacy=true,update=true){
    role=validRole(next);workspace.dataset.role=role;
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
  function openLegacy(hash){
    const targetId=hash.startsWith("#proof/")?"field-proof":hash.replace(/^#/,"");
    const target=doc.getElementById(targetId);
    if(!target||!body.contains(target))return false;
    archive.open=true;
    if(targetId.startsWith("case-")){
      const grid=doc.getElementById("caseFilesGrid");if(grid)grid.hidden=false;
      const toggle=doc.getElementById("caseNotesToggle");if(toggle)toggle.setAttribute("aria-expanded","true");
      target.querySelector("details.caseFileDetails")?.setAttribute("open","");
    }
    win.requestAnimationFrame?.(()=>target.scrollIntoView({behavior:"auto",block:"start"}));
    return true;
  }
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
      archive.open=false;
      workspace.scrollIntoView({behavior:'auto',block:'start'});
      return;
    }
    const a=ev.target.closest('a[href^="#"]');
    if(!a)return;
    const hash=a.getAttribute("href");if(hash==="#v20Archive"){archive.open=true;return}
    if(hash==="#top"){archive.open=true;return}
    if(hash==="#v20-workspace"){archive.open=false;return}
    if(openLegacy(hash)&&win.location.hash===hash)win.requestAnimationFrame?.(()=>doc.getElementById(hash.slice(1))?.scrollIntoView({behavior:"auto",block:"start"}));
  },true);
  win.addEventListener("hashchange",()=>openLegacy(win.location.hash));
  win.addEventListener("popstate",()=>{
    const u=new URL(win.location.href),r=validRole(u.searchParams.get("view")||"fullstack");
    if(r!==role)chooseRole(r,true,false);
    const pid=u.searchParams.get("project");
    if(ids.includes(pid)){id=pid;tab=["overview","media","architecture","evidence"].includes(u.searchParams.get("panel"))?u.searchParams.get("panel"):first().tab;render()}
    openLegacy(u.hash);
  });
  doc.addEventListener('portfolio:legacy-role-request',ev=>{
    const requested=validRole(ev.detail?.role);
    if(requested!==role)chooseRole(requested,false,true);
  });
  chooseRole(role,false,false);
  // Preserve selected project/tab on an existing shared link.
  if(ids.includes(query.get("project"))){id=query.get("project");tab=["overview","media","architecture","evidence"].includes(query.get("panel"))?query.get("panel"):first().tab;render()}
  if(win.location.hash)openLegacy(win.location.hash);
  return {workspace,archive};
};
