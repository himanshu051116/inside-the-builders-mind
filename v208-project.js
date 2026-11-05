import {V205_ANNOTATIONS} from './v205-annotations.js';
const img=document.getElementById('v208ActiveImage');
const markers=document.getElementById('v208Markers');
const note=document.getElementById('v208AnnotationDetail');
const gallery=document.querySelector('.v208ProjectGallery');
function text(tag,value){const n=document.createElement(tag);n.textContent=value;return n}
function updateAnnotation(point){
  if(!note)return;
  note.replaceChildren(text('h3',point.title),text('p',point.detail));
  if(Number.isInteger(point.stage)){
    const a=text('a','Inspect related architecture stage ↗');
    a.href='#architecture-step-'+point.stage;note.append(a);
  }
}
function showCapture(b){
  if(!img||!b||!gallery)return;
  const id=b.dataset.v208Capture;
  img.hidden=false;
  img.width=Number(b.dataset.v208Width)||1200;
  img.height=Number(b.dataset.v208Height)||760;
  img.src=b.dataset.v208Src;
  img.alt=b.dataset.v208Caption;
  document.getElementById('v208Caption').textContent=b.dataset.v208Caption;
  gallery.querySelectorAll('[data-v208-capture]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  markers.replaceChildren();
  note.replaceChildren(text('p','These annotations describe visible interface elements, not measured system behavior.'));
  const record=V205_ANNOTATIONS[id];
  if(!record){markers.hidden=true;return}
  markers.hidden=false;
  record.points.forEach((point,i)=>{
    const btn=document.createElement('button');btn.type='button';btn.className='v208Hotspot';
    btn.textContent=String(i+1);
    btn.style.left=point.x+'%';btn.style.top=point.y+'%';
    btn.setAttribute('aria-label','Inspect screenshot feature '+(i+1)+': '+point.title);
    btn.addEventListener('click',()=>{
      gallery.querySelectorAll('.v208Hotspot').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));
      updateAnnotation(point);
    });
    markers.append(btn);
  });
}
gallery?.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-v208-capture]');if(b){showCapture(b);b.focus()}
});
if(gallery)showCapture(gallery.querySelector('[data-v208-capture]'));
if(img){img.addEventListener('error',()=>{
  img.hidden=true;
  markers?.replaceChildren();
  markers.hidden=true;
  note?.replaceChildren(text('p','This saved image is unavailable. Open the project source or try another capture.'));
});}
