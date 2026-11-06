/** V21.7 — accessible original-screenshot inspection, never simulated imagery. */
const instances=new WeakMap();

/** Allow only same-origin files from the saved project evidence directory. */
export function allowedV217Asset(raw,baseHref){
  if(typeof raw!=='string'||!raw.trim()||typeof baseHref!=='string')return null;
  try{
    const base=new URL(baseHref),url=new URL(raw,base);
    if(url.origin!==base.origin||url.search||url.hash||!/^\/evidence\/[a-z0-9-]+\.webp$/.test(url.pathname))return null;
    return url.href;
  }catch{return null}
}
export function v217CaptureDescription(alt,caption){
  const c=String(caption||'').trim(),a=String(alt||'').trim();
  return c||a||'Saved interface screenshot; not a live application execution.';
}

export function setupV217MediaViewer(doc=document){
  if(instances.has(doc))return instances.get(doc);
  const win=doc.defaultView;
  const figuresSelector='.v208ProjectFigure figure, .v20HeroImage, .v20Media > figure';
  const imageSelector='.v208ProjectFigure figure img#v208ActiveImage, .v20HeroImage > img, .v20Media > figure > img';
  let dialog=null,photo=null,caption=null,status=null,zoom=null,stage=null;
  let returnFocus=null,scrollBefore='';
  const findFigure=el=>el?.closest('.v208ProjectFigure figure, .v20HeroImage, .v20Media > figure');
  function sourceFor(figure){
    const el=figure?.querySelector('img');
    if(!el||el.hidden)return null;
    const href=allowedV217Asset(el.getAttribute('src'),doc.baseURI);
    if(!href)return null;
    return {href,description:v217CaptureDescription(el.alt,figure.querySelector('figcaption')?.textContent)};
  }
  function ensureDialog(){
    if(dialog)return;
    dialog=doc.createElement('dialog');dialog.className='v217Viewer';dialog.setAttribute('aria-labelledby','v217ViewerTitle');
    dialog.innerHTML=`<div class="v217ViewerShell"><header class="v217ViewerHead"><div><span class="v217ViewerEyebrow">ORIGINAL PROJECT RECORD</span><h2 id="v217ViewerTitle">Inspect saved screenshot</h2></div><button type="button" class="v217ViewerClose">Close ×</button></header><div class="v217ViewerStage"><img class="v217ViewerImage" alt="" decoding="async" /></div><footer class="v217ViewerFoot"><p class="v217ViewerCaption"></p><p class="v217ViewerStatus" role="status" aria-live="polite"></p><div class="v217ViewerActions"><button type="button" class="v217ViewerZoom" aria-pressed="false">Actual pixels</button><a class="v217ViewerSource" target="_blank" rel="noopener noreferrer">Open original image ↗</a></div><p class="v217ViewerBoundary">Saved project capture · not a live run or an independently verified model output</p></footer></div>`;
    doc.body.append(dialog);
    photo=dialog.querySelector('.v217ViewerImage');caption=dialog.querySelector('.v217ViewerCaption');
    status=dialog.querySelector('.v217ViewerStatus');zoom=dialog.querySelector('.v217ViewerZoom');stage=dialog.querySelector('.v217ViewerStage');
    dialog.querySelector('.v217ViewerClose').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
    dialog.addEventListener('close',()=>{
      doc.body.style.overflow=scrollBefore;
      photo.removeAttribute('src');
      if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
      returnFocus=null;
    });
    zoom.addEventListener('click',()=>{
      const actual=dialog.dataset.zoom!=='actual';
      dialog.dataset.zoom=actual?'actual':'fit';
      zoom.setAttribute('aria-pressed',String(actual));
      zoom.textContent=actual?'Fit to screen':'Actual pixels';
      stage.scrollTop=0;stage.scrollLeft=0;
    });
    photo.addEventListener('error',()=>{photo.hidden=true;status.textContent='This saved screenshot could not be loaded. Open the project source or try another capture.'});
    photo.addEventListener('load',()=>{photo.hidden=false;status.textContent='Saved screenshot loaded.'});
  }
  function open(figure,trigger){
    const record=sourceFor(figure);if(!record)return false;
    ensureDialog();if(dialog.open)return false;
    returnFocus=trigger?.isConnected?trigger:doc.activeElement;
    scrollBefore=doc.body.style.overflow;
    caption.textContent=record.description;
    status.textContent='Loading the saved screenshot…';
    zoom.textContent='Actual pixels';zoom.setAttribute('aria-pressed','false');dialog.dataset.zoom='fit';
    const source=dialog.querySelector('.v217ViewerSource');source.href=record.href;
    photo.hidden=false;photo.alt=record.description;photo.src=record.href;
    dialog.showModal();doc.body.style.overflow='hidden';
    dialog.querySelector('.v217ViewerClose').focus();
    return true;
  }
  function refresh(){
    doc.querySelectorAll(figuresSelector).forEach(figure=>{
      if(figure.querySelector(':scope > .v217Expand'))return;
      const b=doc.createElement('button');b.type='button';b.className='v217Expand';
      b.textContent='Enlarge saved screenshot ↗';b.setAttribute('aria-haspopup','dialog');
      b.addEventListener('click',()=>open(figure,b));
      figure.append(b);
    });
  }
  doc.addEventListener('click',ev=>{
    const el=ev.target.closest(imageSelector);if(!el||el.closest('a'))return;
    const figure=findFigure(el);
    if(figure)open(figure,figure.querySelector(':scope > .v217Expand'));
  });
  doc.addEventListener('portfolio:v20-render',refresh);
  refresh();
  const api={refresh,open,get dialog(){return dialog}};instances.set(doc,api);return api;
}
