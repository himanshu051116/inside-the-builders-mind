// V25: one read-only active-section indicator for the visible navigation.
// URL writes remain solely within the V20 route/controller.
export function setupV25SectionSync(doc=document,win=window){
  const nav=doc.getElementById('main-nav');
  if(!nav||nav.dataset.v25SectionSync==='ready')return false;
  nav.dataset.v25SectionSync='ready';
  const links=[...nav.querySelectorAll(':scope > a[href^="#"]')];
  const contact=doc.querySelector('.headerContact');
  const mapping={
    work:'#v20-workspace',top:'#v20-workspace',
    'case-files':'#case-files','project-notes':'#case-files',
    'field-proof':'#field-proof',
    'interactive-lab':'#interactive-lab',
    about:'#about'
  };
  let frame=0;
  const active=()=>{
    frame=0;
    let section=null;
    const contactBox=doc.getElementById('contact')?.getBoundingClientRect();
    const workspace=doc.getElementById('v20-workspace')?.getBoundingClientRect();
    const archive=doc.getElementById('v20Archive')?.getBoundingClientRect();
    const viewLine=Math.min(160,Math.round(win.innerHeight*.25));
    if(contactBox&&contactBox.top<=viewLine&&contactBox.bottom>viewLine)section='#contact';
    else if(workspace&&workspace.top<=viewLine&&workspace.bottom>viewLine)section='#v20-workspace';
    else if(archive&&archive.top<=viewLine&&archive.bottom>viewLine){
      const groups=[...doc.querySelectorAll('.v21ArchiveGroup[open]')];
      const chosen=groups.find(g=>{const r=g.getBoundingClientRect();return r.top<=viewLine&&r.bottom>viewLine});
      if(chosen)section=mapping[chosen.dataset.archiveSection]||null;
    }
    for(const link of links){
      if(link.getAttribute('href')===section)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
    if(contact){
      if(section==='#contact')contact.setAttribute('aria-current','location');
      else contact.removeAttribute('aria-current');
    }
  };
  const schedule=()=>{
    if(frame)return;
    frame=win.requestAnimationFrame(active);
  };
  win.addEventListener('scroll',schedule,{passive:true});
  win.addEventListener('resize',schedule,{passive:true});
  win.addEventListener('popstate',schedule);
  win.addEventListener('hashchange',schedule);
  doc.addEventListener('portfolio:navigation-committed',schedule);
  for(const group of doc.querySelectorAll('.v21ArchiveGroup')){
    group.addEventListener('toggle',schedule);
  }
  schedule();
  return true;
}
