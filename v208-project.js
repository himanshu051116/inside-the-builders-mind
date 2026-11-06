import {V205_ANNOTATIONS} from './v205-annotations.js';
import {setupMilestoneVideo} from './v19-milestone-video.js';
import {mountV211EvidencePanel} from './v211-evidence-panel.js';
import {readEvidenceSelection,evidenceLink,getPoints} from './v211-evidence-model.js';

const img=document.getElementById('v208ActiveImage');
const markers=document.getElementById('v208Markers');
const note=document.getElementById('v208AnnotationDetail');
const gallery=document.querySelector('.v208ProjectGallery');
const slug=window.location.pathname.match(/^\/projects\/([a-z0-9-]+)\/?$/)?.[1]||null;
const evidence=mountV211EvidencePanel(document,{projectId:slug});
const buttons=[...(gallery?.querySelectorAll('[data-v208-capture]')||[])];
const allowed=buttons.map(b=>b.dataset.v208Capture);
let captureEpoch=0;
let currentCapture=null;
let activeFeature=null;
let complete=false;
// The status node is deliberately outside the re-rendered evidence panel, so a
// blocked history API warning survives subsequent image load events.
const shareStatus=document.createElement('p');
shareStatus.className='v212ShareWarning';
shareStatus.setAttribute('role','status');
shareStatus.hidden=true;
gallery?.insertAdjacentElement('afterend',shareStatus);

function text(tag,value){const n=document.createElement(tag);n.textContent=value;return n}
function syncUrl(method='replaceState'){
  const current=new URL(window.location.href);
  const before=current.pathname+current.search+current.hash;
  const next=evidenceLink(window.location.href,currentCapture,activeFeature);
  if(before===next)return;
  try{
    const state=window.history.state;
    const data=state&&typeof state==='object'&&!Array.isArray(state)?{...state,v211:true}:{v211:true};
    window.history[method](data,'',next);
    // Some embedded/locked-down browsers silently ignore History API writes.
    const observed=new URL(window.location.href);
    if(observed.pathname+observed.search+observed.hash!==next)
      throw new Error('History write was not applied');
    shareStatus.hidden=true;shareStatus.textContent='';
  }catch{
    shareStatus.hidden=false;
    shareStatus.textContent='Your selection is active, but this browser could not update the shareable link.';
  }
}
function updateAnnotation(point,index,{writeHistory=true}={}){
  if(!note)return;
  note.replaceChildren(text('h3',point.title),text('p',point.detail));
  if(Number.isInteger(point.stage)){
    const a=text('a','Inspect related architecture stage ↗');
    a.href='#architecture-step-'+point.stage;
    note.append(a);
  }
  activeFeature=index;
  markers?.querySelectorAll('.v208Hotspot').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.v208Hotspot)===index)));
  evidence?.selectFeature(index);
  if(writeHistory)syncUrl('replaceState');
}
function showCapture(button,{method=null,feature=null,focus=false}={}){
  if(!img||!button||!gallery)return;
  const id=button.dataset.v208Capture;
  if(!allowed.includes(id))return;
  currentCapture=id;
  activeFeature=null;
  complete=false;
  const epoch=++captureEpoch;
  // Reset both visual and evidence panels before requesting a new screenshot.
  markers.replaceChildren();markers.hidden=true;
  note.replaceChildren(text('p','Loading saved capture. Annotations will appear when the image is ready.'));
  evidence?.selectCapture(id,{available:null});
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  img.hidden=false;
  img.width=Number(button.dataset.v208Width)||1200;
  img.height=Number(button.dataset.v208Height)||760;
  img.alt=button.dataset.v208Caption;
  document.getElementById('v208Caption').textContent=button.dataset.v208Caption;
  const renderHotspots=()=>{
    if(complete)return;
    if(epoch!==captureEpoch||!img.complete||img.naturalWidth===0||img.hidden)return;
    complete=true;evidence?.imageStatus(true);
    const points=getPoints(id);
    if(!points.length){
      note.replaceChildren(text('p','No manually verified annotation for this capture. The evidence panel remains available.'));
      return;
    }
    markers.hidden=false;
    note.replaceChildren(text('p','Choose a numbered hotspot to connect a visible feature with the project evidence.'));
    points.forEach((point,i)=>{
      const b=document.createElement('button');
      b.type='button';b.className='v208Hotspot';b.dataset.v208Hotspot=String(i);
      b.textContent=String(i+1);b.style.left=point.x+'%';b.style.top=point.y+'%';
      b.setAttribute('aria-label','Inspect screenshot feature '+(i+1)+': '+point.title);
      b.setAttribute('aria-pressed','false');
      b.addEventListener('click',()=>updateAnnotation(point,i));
      markers.append(b);
    });
    if(Number.isInteger(feature)&&feature>=0&&feature<points.length){
      updateAnnotation(points[feature],feature,{writeHistory:false});
    }
  };
  img.onload=renderHotspots;
  img.onerror=()=>{
    if(epoch!==captureEpoch)return;
    complete=false;activeFeature=null;
    img.hidden=true;markers.replaceChildren();markers.hidden=true;
    note.replaceChildren(text('p','This saved image is unavailable. Open the project source or try another capture.'));
    evidence?.imageStatus(false);
  };
  img.src=button.dataset.v208Src;
  if(img.complete&&img.naturalWidth>0)renderHotspots();
  if(method)syncUrl(method);
  if(focus)button.focus({preventScroll:true});
}

function restoreFromUrl(){
  const next=readEvidenceSelection(window.location.href,allowed);
  const target=buttons.find(b=>b.dataset.v208Capture===next.captureId);
  if(!target)return;
  if(currentCapture!==next.captureId||!complete){
    showCapture(target,{feature:next.featureIndex});
  }else if(Number.isInteger(next.featureIndex)){
    const point=getPoints(currentCapture)[next.featureIndex];
    if(point)updateAnnotation(point,next.featureIndex,{writeHistory:false});
  }else{
    activeFeature=null;
    markers?.querySelectorAll('.v208Hotspot').forEach(b=>b.setAttribute('aria-pressed','false'));
    note?.replaceChildren(text('p','Choose a numbered hotspot to inspect its evidence connections.'));
    evidence?.selectFeature(null);
  }
}

gallery?.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-v208-capture]');
  if(b){showCapture(b,{method:'pushState',focus:true});}
});
markers?.addEventListener('keydown',ev=>{
  const b=ev.target.closest('.v208Hotspot');
  if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;
  const count=getPoints(currentCapture).length;if(!count)return;
  const idx=Number(b.dataset.v208Hotspot);
  const next=ev.key==='Home'?0:ev.key==='End'?count-1:(idx+(ev.key==='ArrowRight'?1:count-1))%count;
  ev.preventDefault();
  const selected=markers.querySelector(`[data-v208-hotspot="${next}"]`);
  selected?.click();selected?.focus({preventScroll:true});
});
if(gallery)restoreFromUrl();
window.addEventListener('popstate',restoreFromUrl);

// Existing original presenter-visible footage is unchanged and never autoplayed.
if(slug==='mulyankan'){
  const target=document.querySelector('#captures');
  if(target&&!target.querySelector('[data-v209-original-video]')){
    const button=document.createElement('button');
    button.type='button';button.className='v208Primary v209VideoDossier';
    button.dataset.v209OriginalVideo='true';
    button.textContent='Watch both original presenter recordings ▶';
    button.setAttribute('aria-haspopup','dialog');
    button.setAttribute('aria-controls','v19MilestoneDialog');
    target.querySelector('h2')?.insertAdjacentElement('afterend',button);
    button.addEventListener('click',()=>setupMilestoneVideo(document).show());
  }
}
