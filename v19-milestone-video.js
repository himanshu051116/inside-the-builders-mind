/**
 * V19 — presenter-visible evidence, integrated into the V17 Mulyankan milestone card.
 * The preview may autoplay silently only when visible; the original recording
 * remains unchanged and its dialog retains explicit, audible playback.
 * The chapter controls refer exclusively to the bundled real screen recordings.
 */
export const milestoneClips = Object.freeze([
  Object.freeze({
    id:'architecture', title:'3D architecture walkthrough', duration:'00:17',
    video:'/video/mulyankan-system-walkthrough-presenter.mp4',
    poster:'/video/mulyankan-system-poster.jpg',
    description:'Camera- and gesture-controlled navigation through the recorded Mulyankan Spatial Lab architecture.'
  }),
  Object.freeze({
    id:'docx', title:'DOCX processing architecture', duration:'00:20',
    video:'/video/mulyankan-docx-workflow-presenter.mp4',
    poster:'/video/mulyankan-docx-poster.jpg',
    description:'Recorded walkthrough of native document text, source structure, and OCR fallback stages.'
  })
]);

const initialClip=milestoneClips[0];

/** Called after the existing site.js appMarkup has rendered. */
export function setupMilestoneVideo(doc=document){
  const win=doc.defaultView || window;
  const card=doc.querySelector('#home .v17Proof');
  const meta=card?.querySelector('.v17ProofMeta');
  if(!card||!meta||card.dataset.milestoneVideo==='ready') return null;
  card.dataset.milestoneVideo='ready';
  card.classList.add('v19ProofHasVideo');
  const region=doc.createElement('div');
  region.className='v19MilestoneVideo';
  region.innerHTML=`<button class="v19MilestoneOpen" type="button" aria-haspopup="dialog" aria-controls="v19MilestoneDialog" aria-label="Watch the full recorded Mulyankan demonstration with original sound">
    <img src="${initialClip.poster}" alt="Mulyankan 3D architecture screenshot with the presenter in the live-camera inset" width="1280" height="790" loading="eager" decoding="async">
    <video class="v252SilentPreview" muted playsinline preload="none" tabindex="-1" aria-hidden="true" disablepictureinpicture></video>
    <span class="v19MilestoneShade" aria-hidden="true"></span>
    <span class="v252FullCTA" aria-hidden="true">Watch full recording with sound ↗</span>
    <span class="v19MilestonePlay" aria-hidden="true">▶</span>
    <span class="v19MilestoneBadge">RECORDED DEMONSTRATION</span>
    <span class="v19MilestoneDuration">${initialClip.duration}</span>
  </button>
  <button class="v252PreviewToggle" type="button" hidden aria-label="Pause muted preview">Pause preview</button>
  <p class="v19MilestoneFootnote">Muted visual preview <span aria-hidden="true">·</span> Presenter webcam and original audio in the full recording</p>`;
  card.querySelector('.v17ProofBody')?.insertBefore(region,meta);

  const dialog=doc.createElement('dialog');
  dialog.id='v19MilestoneDialog';
  dialog.className='v19MilestoneDialog';
  dialog.setAttribute('aria-labelledby','v19MilestoneTitle');
  dialog.setAttribute('aria-describedby','v19MilestoneDescription');
  dialog.innerHTML=`<div class="v19DialogShell">
    <header class="v19DialogHeader">
      <div><span class="v19DialogEyebrow">MULYANKAN / ACTUAL SCREEN RECORDING</span><h2 id="v19MilestoneTitle">Inside the Spatial Lab</h2></div>
      <button class="v19DialogClose" type="button" aria-label="Close demonstration">Close <span aria-hidden="true">×</span></button>
    </header>
    <div class="v19DialogPlayer">
      <video class="v19DialogVideo" controls playsinline preload="none" poster="${initialClip.poster}" aria-label="Recorded Mulyankan Spatial Lab with presenter webcam and original audio">
        <source src="${initialClip.video}" type="video/mp4">
        Your browser does not support MP4 video.
      </video>
      <div class="v19DialogPlayerMeta"><span>SOURCE SNAPSHOT · OFFLINE ARCHITECTURE WALKTHROUGH</span><span class="v19DialogStatus" role="status" aria-live="polite">Ready to play</span></div>
    </div>
    <div class="v19DialogDetail">
      <div class="v19DialogChapters" aria-label="Select a recorded chapter">
        ${milestoneClips.map((clip,index)=>`<button class="v19Chapter${index===0?' isActive':''}" type="button" data-v19-chapter="${clip.id}" aria-pressed="${index===0?'true':'false'}"><span class="v19ChapterIndex">0${index+1}</span><span>${clip.title}<small>${clip.duration} · Presenter visible</small></span></button>`).join('')}
      </div>
      <p id="v19MilestoneDescription">${initialClip.description} This footage documents the visual architecture and navigation; it is not proof of live OCR or model accuracy.</p>
      <a href="#case-mulyankan" class="v19DialogCase">Read engineering notes and limits <span aria-hidden="true">↗</span></a>
    </div>
  </div>`;
  doc.body.append(dialog);

  const open=region.querySelector('.v19MilestoneOpen');
  const teaser=region.querySelector('.v252SilentPreview');
  const previewToggle=region.querySelector('.v252PreviewToggle');
  const close=dialog.querySelector('.v19DialogClose');
  const video=dialog.querySelector('.v19DialogVideo');
  const source=video.querySelector('source');
  const desc=dialog.querySelector('#v19MilestoneDescription');
  const state=dialog.querySelector('.v19DialogStatus');
  const chapters=[...dialog.querySelectorAll('[data-v19-chapter]')];
  let current=milestoneClips[0];
  let returnFocus=null;
  let scrollBefore='';
  let opened=false;

  // Only a short, silent excerpt is repeated. No additional media file is
  // generated, no full recording is looped, and no bytes load out of view.
  const previewSeconds=6;
  const motionQuery=win.matchMedia?.('(prefers-reduced-motion: reduce)');
  const dataQuery=win.matchMedia?.('(prefers-reduced-data: reduce)');
  const connection=win.navigator?.connection;
  let inView=false,previewLoaded=false,userPaused=false;
  let playbackAttempt=0;
  const autoplayEligible=()=>!motionQuery?.matches&&!dataQuery?.matches&&!connection?.saveData;
  const pausePreview=()=>{
    teaser.pause();
    open.classList.remove('v252PreviewPlaying');
  };
  const updateToggle=()=>{
    const allowed=inView&&previewLoaded&&!dialog.open;
    previewToggle.hidden=!allowed;
    if(!allowed)return;
    const stopped=teaser.paused;
    previewToggle.textContent=stopped?'Play preview':'Pause preview';
    previewToggle.setAttribute('aria-label',stopped?'Play muted visual preview':'Pause muted visual preview');
    previewToggle.setAttribute('aria-pressed',String(!stopped));
  };
  async function startPreview({manual=false}={}){
    if(!inView||dialog.open||doc.hidden||(!manual&&!autoplayEligible())||(!manual&&userPaused))return false;
    // The video is assigned a source only when the real card enters view.
    if(!previewLoaded){
      teaser.src=initialClip.video;
      teaser.defaultMuted=true;
      teaser.muted=true;
      previewLoaded=true;
    }
    teaser.muted=true;teaser.playsInline=true;
    if(teaser.currentTime>=previewSeconds)teaser.currentTime=0;
    const attempt=++playbackAttempt;
    try{
      await teaser.play();
      if(attempt!==playbackAttempt||!inView||dialog.open||doc.hidden){
        pausePreview();return false;
      }
      open.classList.add('v252PreviewPlaying');
      updateToggle();
      return true;
    }catch{
      pausePreview();updateToggle();
      return false;
    }
  }
  teaser.addEventListener('timeupdate',()=>{
    if(teaser.currentTime>=previewSeconds&&!teaser.seeking){
      teaser.currentTime=0; // repeat the excerpt, never the entire recording
    }
  });
  teaser.addEventListener('play',updateToggle);
  teaser.addEventListener('pause',updateToggle);
  teaser.addEventListener('error',()=>{pausePreview();previewToggle.hidden=true});
  previewToggle.addEventListener('click',()=>{
    if(!teaser.paused){
      userPaused=true;pausePreview();updateToggle();
    }else{
      userPaused=false;
      void startPreview({manual:true});
    }
  });
  const observeVideo=typeof win.IntersectionObserver==='function'
    ?new win.IntersectionObserver(entries=>{
      const visible=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=0.55);
      if(visible===inView)return;
      inView=visible;
      if(!visible){
        ++playbackAttempt;pausePreview();updateToggle();
      }else{
        if(autoplayEligible()&&!userPaused)void startPreview();
        updateToggle();
      }
    },{threshold:[0,0.55,0.8]}):null;
  observeVideo?.observe(region);
  const refreshAutoplay=()=>{
    if(!autoplayEligible()){
      ++playbackAttempt;pausePreview();
    }else if(inView&&!userPaused&&!dialog.open&&!doc.hidden){
      void startPreview();
    }
    updateToggle();
  };
  motionQuery?.addEventListener?.('change',refreshAutoplay);
  dataQuery?.addEventListener?.('change',refreshAutoplay);

  function switchChapter(id){
    const clip=milestoneClips.find(item=>item.id===id);
    if(!clip) return false;
    video.pause();
    current=clip;
    source.src=clip.video;
    video.poster=clip.poster;
    video.setAttribute('aria-label',`${clip.title}; presenter camera and original audio are visible`);
    video.load();
    chapters.forEach(b=>{
      const yes=b.dataset.v19Chapter===id;
      b.classList.toggle('isActive',yes);
      b.setAttribute('aria-pressed',String(yes));
    });
    desc.textContent=clip.description+' This footage documents the visual architecture and navigation; it is not proof of live OCR or model accuracy.';
    state.textContent='Ready to play';
    return true;
  }
  function dismiss(){
    video.pause();
    if(dialog.open) dialog.close();
  }
  function show(){
    if(dialog.open)return;
    ++playbackAttempt;
    pausePreview();
    updateToggle();
    returnFocus=doc.activeElement;
    scrollBefore=doc.body.style.overflow;
    dialog.showModal();
    doc.body.style.overflow='hidden';
    opened=true;
    close.focus();
    // Keep the full recording's original audio available on explicit user intent.
    video.muted=false;
    // Explicit play intent: clicking this button opens the modal and starts video.
    // A denied play promise leaves native media controls available.
    const request=video.play();
    request?.catch(()=>{state.textContent='Press play to start the recording';});
  }
  open.addEventListener('click',show);
  close.addEventListener('click',dismiss);
  dialog.addEventListener('click',event=>{
    // Native backdrop click closes only when the click is outside the dialog bounds.
    if(event.target!==dialog) return;
    dismiss();
  });
  dialog.addEventListener('close',()=>{
    video.pause();
    doc.body.style.overflow=scrollBefore;
    if(opened && returnFocus?.isConnected) returnFocus.focus();
    opened=false;
    if(inView&&!userPaused)void startPreview();
    updateToggle();
  });
  chapters.forEach(button=>button.addEventListener('click',()=>switchChapter(button.dataset.v19Chapter)));
  video.addEventListener('play',()=>{state.textContent='Playing recorded demonstration';});
  video.addEventListener('pause',()=>{if(dialog.open && !video.ended)state.textContent='Paused';});
  video.addEventListener('ended',()=>{state.textContent='Chapter finished';});
  video.addEventListener('error',()=>{state.textContent='Unable to load the recording';});
  source.addEventListener('error',()=>{state.textContent='Video unavailable; check that the clip was published';});
  doc.addEventListener('visibilitychange',()=>{
    if(doc.hidden){
      ++playbackAttempt;
      pausePreview();
      if(!video.paused)video.pause();
    }else if(inView&&!userPaused&&!dialog.open){
      void startPreview();
    }
    updateToggle();
  });
  win.addEventListener('pagehide',()=>{++playbackAttempt;pausePreview();if(!video.paused)video.pause();});
  const caseLink=dialog.querySelector('.v19DialogCase');
  caseLink.addEventListener('click',()=>dismiss());
  return {show,dismiss,switchChapter,
    get active(){return current.id},
    get dialog(){return dialog},
    get preview(){return teaser},
    get previewVisible(){return inView}
  };
}
