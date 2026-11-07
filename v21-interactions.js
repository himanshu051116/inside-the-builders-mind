// V21: progressive hover disclosure without hover-only navigation.
// Touch, click, keyboard activation and hash deep links remain supported.
export function setupV21Interactions(doc=document,win=window){
  if(doc.documentElement.dataset.v21Interactions==="ready")return;
  doc.documentElement.dataset.v21Interactions="ready";
  const fineHover=()=>!!win.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
  const nav=doc.getElementById("main-nav");
  const previews={
    "#v20-workspace":["Selected work","Five projects, source links, and role-specific views.","Explore projects"],
    "#case-files":["Architecture and trade-offs","Project decisions, validation and technical notes.","Open case studies"],
    "#field-proof":["Captured interfaces","Original project screenshots, with context.","View screenshots"],
    "#interactive-lab":["Interactive demos","Local demonstrations with clearly stated limitations.","Open demos"],
    "#about":["About","Education, interests, and technical background.","Read more"]
  };
  if(nav){
    const panel=doc.createElement("div");
    panel.className="v21NavPreview";
    panel.hidden=true;
    panel.setAttribute("aria-label","Navigation preview");
    nav.append(panel);
    let showTimer=0,hideTimer=0;
    function hide(){
      win.clearTimeout(showTimer);
      win.clearTimeout(hideTimer);
      panel.hidden=true;
      nav.classList.remove("v21NavOpen");
      for(const item of nav.querySelectorAll(":scope > a[href^='#']"))item.removeAttribute("data-nav-preview");
    }
    function show(anchor){
      const href=anchor?.getAttribute("href"),info=previews[href];
      if(!info){hide();return}
      const [title,description,action]=info;
      panel.replaceChildren();
      const label=doc.createElement("span");label.className="v21NavOverline";label.textContent="QUICK PREVIEW";
      const strong=doc.createElement("strong");strong.textContent=title;
      const text=doc.createElement("p");text.textContent=description;
      const link=doc.createElement("a");link.href=href;link.className="v21NavAction";link.textContent=action+" ↗";
      panel.append(label,strong,text,link);
      panel.hidden=false;
      nav.classList.add("v21NavOpen");
      for(const item of nav.querySelectorAll(":scope > a[href^='#']")){
        if(item===anchor)item.setAttribute("data-nav-preview","active");
        else item.removeAttribute("data-nav-preview");
      }
      // Preview is deliberately informational. Only explicit navigation may
      // expand an archive group or change history.
    }
    nav.addEventListener("pointerover",event=>{
      if(!fineHover()||event.pointerType==="touch")return;
      const anchor=event.target.closest?.('a[href^="#"]');
      if(!anchor||anchor.parentElement!==nav||anchor.contains(event.relatedTarget))return;
      win.clearTimeout(showTimer);win.clearTimeout(hideTimer);
      showTimer=win.setTimeout(()=>show(anchor),130);
    });
    nav.addEventListener("pointerleave",()=>{
      win.clearTimeout(showTimer);
      hideTimer=win.setTimeout(hide,170);
    });
    nav.addEventListener("pointerenter",()=>win.clearTimeout(hideTimer));
    nav.addEventListener("focusin",event=>{
      const anchor=event.target.closest?.('a[href^="#"]');
      if(anchor?.parentElement===nav&&fineHover())show(anchor);
    });
    nav.addEventListener("focusout",event=>{
      if(!nav.contains(event.relatedTarget))hide();
    });
    nav.addEventListener("click",hide);
    doc.addEventListener("keydown",event=>{
      if(event.key==="Escape"&&!panel.hidden){hide();nav.querySelector('a[data-nav-preview]')?.focus()}
    });
  }
  // Native click remains authoritative; pointer dwell previews an actual filter.
  function hoverActivate(selector,delay=145){
    for(const button of doc.querySelectorAll(selector)){
      let timer=0;
      button.addEventListener("pointerenter",event=>{
        if(!fineHover()||event.pointerType==="touch")return;
        win.clearTimeout(timer);
        timer=win.setTimeout(()=>{
          if(button.isConnected&&!button.matches('[aria-pressed="true"]'))button.click();
        },delay);
      });
      for(const name of ["pointerleave","pointerdown","pointercancel"]){
        button.addEventListener(name,()=>{win.clearTimeout(timer);timer=0});
      }
    }
  }
  hoverActivate(".projectFilter");
  hoverActivate(".archiveFilter");
  // V25.3: archive summaries intentionally DO NOT auto-open on hover.
  // Scrolling with a stationary pointer used to trigger a chain of disclosures.
  // Hover remains a visual highlight; click/Enter/Space are the only
  // intentional opening mechanisms. Project/nav/filter hover remains intact.
  doc.addEventListener("click",async event=>{
    const button=event.target.closest?.("button[data-copy-email]");
    if(!button)return;
    const email=button.dataset.copyEmail,status=button.querySelector(".v21CopyStatus");
    if(!email||!status)return;
    try{
      if(!win.navigator?.clipboard?.writeText)throw new Error("Clipboard unavailable");
      await win.navigator.clipboard.writeText(email);
      status.textContent="Copied";
      button.classList.add("v21Copied");
    }catch{
      status.textContent="Use the email link";
      button.classList.remove("v21Copied");
    }
  });
}
