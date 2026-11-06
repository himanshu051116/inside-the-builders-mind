/**
 * V19 — presenter-visible evidence, integrated into the V17 Mulyankan milestone card.
 * No autoplay on page load. The saved source video/audio is never manipulated here.
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
// One original recording player per document, regardless of hosting page.
const mountedPlayers=new WeakMap();

/** Called after the existing site.js appMarkup has rendered. */
export function setupMilestoneVideo(doc=document){
  const prior=mountedPlayers.get(doc);
  if(prior) return prior;
  const card=doc.querySelector('#home .v17Proof');
  const meta=card?.querySelector('.v17ProofMeta');
  const region=doc.createElement('div');
  region.className='v19MilestoneVideo';
  region.innerHTML=`<button class="v19MilestoneOpen" type="button" aria-haspopup="dialog" aria-controls="v19MilestoneDialog" aria-label="Play Mulyankan 3D architecture demonstration, with presenter and original audio">
    <img src="${initialClip.poster}" alt="Mulyankan 3D architecture screenshot with the presenter in the live-camera inset" width="1280" height="790" loading="eager" decoding="async">
    <span class="v19MilestoneShade" aria-hidden="true"></span>
    <span class="v19MilestonePlay" aria-hidden="true">▶</span>
    <span class="v19MilestoneBadge">RECORDED DEMONSTRATION</span>
    <span class="v19MilestoneDuration">${initialClip.duration}</span>
  </button>
  <p class="v19MilestoneFootnote">Spatial Lab walkthrough <span aria-hidden="true">·</span> Presenter webcam and original audio</p>`;
  // The player is independent of the optional homepage preview card.
  // Work and dedicated Mulyankan project pages have no reason to render #home.
  if(card && meta){
    card.dataset.milestoneVideo='ready';
    card.classList.add('v19ProofHasVideo');
    card.querySelector('.v17ProofBody')?.insertBefore(region,meta);
  }

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
  // Real media remains unchanged; descriptions are not falsely labeled as speech captions.
  const guide=doc.createElement('details');guide.className='v217VideoGuide';
  const guideTitle=doc.createElement('summary');guideTitle.textContent='Recording descriptions and caption status';
  const guideList=doc.createElement('ol');
  milestoneClips.forEach(clip=>{
    const item=doc.createElement('li'),heading=doc.createElement('strong'),description=doc.createElement('p');
    heading.textContent=clip.title+' · '+clip.duration;description.textContent=clip.description;
    item.append(heading,description);guideList.append(item);
  });
  const guideNotice=doc.createElement('p');
  guideNotice.textContent='These are recorded-scene descriptions, not a verbatim speech transcript. Timed captions require review against the original spoken audio and have not yet been published.';
  guide.append(guideTitle,guideList,guideNotice);
  dialog.querySelector('.v19DialogDetail')?.append(guide);

  const open=region.querySelector('.v19MilestoneOpen');
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
    returnFocus=doc.activeElement;
    scrollBefore=doc.body.style.overflow;
    dialog.showModal();
    doc.body.style.overflow='hidden';
    opened=true;
    close.focus();
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
  });
  chapters.forEach(button=>button.addEventListener('click',()=>switchChapter(button.dataset.v19Chapter)));
  video.addEventListener('play',()=>{state.textContent='Playing recorded demonstration';});
  video.addEventListener('pause',()=>{if(dialog.open && !video.ended)state.textContent='Paused';});
  video.addEventListener('ended',()=>{state.textContent='Chapter finished';});
  video.addEventListener('error',()=>{state.textContent='Unable to load the recording';});
  source.addEventListener('error',()=>{state.textContent='Video unavailable; check that the clip was published';});
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden && !video.paused)video.pause();});
  const caseLink=dialog.querySelector('.v19DialogCase');
  caseLink.href=doc.getElementById('case-mulyankan')?'#case-mulyankan':'/projects/mulyankan/#verification';
  caseLink.addEventListener('click',()=>dismiss());
  const player={show,dismiss,switchChapter,get active(){return current.id},get dialog(){return dialog}};
  mountedPlayers.set(doc,player);
  return player;
}
