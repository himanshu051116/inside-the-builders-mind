// Shared fallbacks for genuine, locally hosted visual evidence.
// Never replace a missing screenshot with a generated or misleading image.
document.addEventListener('error',event=>{
  const img=event.target;
  if(!(img instanceof HTMLImageElement))return;
  if(img.closest('.v208CardCover,.v208EvidencePhoto,.v208SpotlightCapture')){
    const box=img.parentElement;
    if(!box||box.querySelector('.v208MissingAsset'))return;
    img.hidden=true;
    const note=document.createElement('span');
    note.className='v208MissingAsset';
    note.textContent='Saved screenshot unavailable. Project details and source links remain accessible.';
    box.append(note);
  }
  if(img.matches('.v208Home .v19MilestoneOpen img')){
    img.hidden=true;
    const button=img.closest('.v19MilestoneOpen');
    button?.setAttribute('aria-label','Open the original Mulyankan recording (poster unavailable)');
  }
},true);

const pointerMotion=window.matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)');
for(const surface of document.querySelectorAll('[data-v208-pointer]')){
  let frame=0;
  let x=0;
  let y=0;

  surface.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||!pointerMotion.matches)return;
    x=event.clientX;
    y=event.clientY;
    if(frame)return;

    frame=window.requestAnimationFrame(()=>{
      frame=0;
      const bounds=surface.getBoundingClientRect();
      if(!bounds.width||!bounds.height||!pointerMotion.matches)return;
      const horizontal=Math.min(100,Math.max(0,100*(x-bounds.left)/bounds.width));
      const vertical=Math.min(100,Math.max(0,100*(y-bounds.top)/bounds.height));
      surface.style.setProperty('--v208-pointer-x',`${horizontal}%`);
      surface.style.setProperty('--v208-pointer-y',`${vertical}%`);
      surface.classList.add('v208PointerActive');
    });
  },{passive:true});

  function clearPointer(){
    window.cancelAnimationFrame(frame);
    frame=0;
    surface.classList.remove('v208PointerActive');
  }
  surface.addEventListener('pointerleave',clearPointer);
  surface.addEventListener('pointercancel',clearPointer);
}
