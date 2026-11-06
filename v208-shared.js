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
