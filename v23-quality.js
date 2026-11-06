/**
 * V23 workspace refinement. Reuses verified project screenshots and the
 * existing gallery controls; does not synthesize media or change source data.
 */
export function setupV23Quality(doc=document,win=window){
  const workspace=doc.getElementById('v20-workspace');
  const inspector=doc.getElementById('v20Inspector');
  if(!workspace||!inspector||workspace.dataset.v23Installed==='true')return false;
  workspace.dataset.v23Installed='true';
  const openTrays=new Map();
  const projectId=()=>workspace.querySelector('[data-v20-project][aria-pressed="true"]')?.dataset.v20Project||'';
  const allowImage=src=>/^\/evidence\/[a-z0-9-]+\.webp$/.test(String(src||''));
  const create=(tag,cls,text)=>{
    const node=doc.createElement(tag);
    if(cls)node.className=cls;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  function enhance(){
    const media=inspector.querySelector('.v20Media');
    if(!media)return;
    const image=media.querySelector('figure img');
    const src=image?.getAttribute('src')||'';
    // The link targets the original, bundled capture at its native resolution.
    if(allowImage(src)){
      const controls=media.querySelector('.v203MediaButtons');
      if(controls&&!controls.querySelector('.v23FullImage')){
        const a=create('a','v23FullImage','Full size ↗');
        a.href=src;a.target='_blank';a.rel='noopener noreferrer';
        a.setAttribute('aria-label','Open original saved screenshot in a new tab');
        a.title='Open original saved screenshot';
        controls.prepend(a);
      }
    }
    const thumbs=media.querySelector('.v20Thumbs');
    if(thumbs&&!thumbs.closest('.v23CaptureTray')){
      const n=thumbs.querySelectorAll('[data-v20-capture]').length;
      const details=create('details','v23CaptureTray');
      const summary=create('summary','v23CaptureSummary');
      summary.append(create('span','','All screenshots'),create('small','',String(n)));
      details.append(summary);
      thumbs.replaceWith(details);
      details.append(thumbs);
      const key=projectId();
      details.open=openTrays.get(key)??false;
      const revealThumbs=()=>{
        if(!details.isConnected||!details.open)return;
        // Closed gallery images have data-src only, avoiding eager transfer.
        for(const img of details.querySelectorAll('img[data-src]')){
          const path=img.getAttribute('data-src');
          if(!allowImage(path))continue;
          img.setAttribute('src',path);
          img.removeAttribute('data-src');
        }
      };
      details.addEventListener('toggle',()=>{
        // A project may rerender while thumbnails change; do not capture an
        // old gallery's state after its DOM has been replaced.
        if(details.isConnected&&key)openTrays.set(key,details.open);
        revealThumbs();
      });
      if(details.open)revealThumbs();
    }
  }
  // Existing enhancements run first, then V23 composes their UI.
  doc.addEventListener('portfolio:v20-render',enhance);
  enhance();
  return true;
}
