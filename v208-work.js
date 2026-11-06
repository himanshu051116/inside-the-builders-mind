// The Work gallery is built as HTML. Load the explorer for explicit entry links
// and existing share URLs only.

function setupGalleryFilters(gallery){
  const toolbar=gallery.querySelector('.v208GalleryToolbar');
  const cards=[...gallery.querySelectorAll('[data-v208-project-filters]')];
  const count=toolbar.querySelector('.v208GalleryCount');
  const motion=window.matchMedia('(prefers-reduced-motion: no-preference)');
  const animations=new Map();
  let active=toolbar.querySelector('[aria-pressed="true"]');
  toolbar.hidden=false;

  toolbar.addEventListener('click',event=>{
    const button=event.target.closest('[data-v208-gallery-filter]');
    if(!button||button===active)return;
    const previous=motion.matches
      ? cards.filter(card=>!card.hidden).map(card=>[card,card.getBoundingClientRect()])
      : [];
    for(const animation of animations.values())animation.cancel();
    animations.clear();

    active.setAttribute('aria-pressed','false');
    button.setAttribute('aria-pressed','true');
    active=button;

    const filter=button.dataset.v208GalleryFilter;
    gallery.dataset.v208GallerySelection=filter;
    let visible=0;
    for(const card of cards){
      const matches=filter==='all'||card.dataset.v208ProjectFilters.split(' ').includes(filter);
      card.hidden=!matches;
      if(matches)visible++;
    }
    count.textContent=`${visible} project${visible===1?'':'s'}`;

    for(const [card,from] of previous){
      if(card.hidden)continue;
      const to=card.getBoundingClientRect();
      const x=from.left-to.left;
      const y=from.top-to.top;
      if(Math.abs(x)+Math.abs(y)<1)continue;
      const animation=card.animate(
        [{translate:`${x}px ${y}px`},{translate:'0px 0px'}],
        {duration:280,easing:'cubic-bezier(.2,.7,.2,1)'}
      );
      animations.set(card,animation);
    }
  });
}

const locationUrl=new URL(window.location.href);
const oldHash=locationUrl.hash;
const hasSelection=['view','project','panel'].some(key=>locationUrl.searchParams.has(key));
const oldCases={
  '#case-ohs':'our-hidden-universe',
  '#case-news':'newssources',
  '#case-mulyankan':'mulyankan',
  '#case-earthbridge':'earthbridge'
};
const oldDest=!hasSelection ?
  (oldCases[oldHash] ? `/projects/${oldCases[oldHash]}/`+locationUrl.search :
   oldHash==='#field-proof'||oldHash.startsWith('#proof/') ? '/evidence/'+locationUrl.search+'#captures' :
   oldHash==='#case-files' ? '/projects/'+locationUrl.search :
   oldHash==='#interactive-lab'||oldHash==='#lab' ? '/lab/'+locationUrl.search :
   oldHash==='#top'||oldHash==='#archive'||oldHash==='#v20Archive' ? '/legacy/'+locationUrl.search+oldHash : null)
  : null;
if(oldDest){
  window.location.replace(oldDest);
}else if(hasSelection||oldHash==='#v20-workspace'||oldHash==='#work'){
  const [
    {projects:projectRecords},
    {setupV20Workspace},
    {setupV203Experience},
    {setupV204Evidence},
    {setupV205Annotations}
  ]=await Promise.all([
    import('./content.js'),
    import('./v20-workspace.js'),
    import('./v203-experience.js'),
    import('./v204-evidence.js'),
    import('./v205-annotations.js')
  ]);
  const mounted=setupV20Workspace(projectRecords,document,window,{standalone:true});
  if(!mounted)throw new Error('The dedicated Work explorer could not be mounted');
  document.getElementById('work-gallery').hidden=true;
  setupV203Experience({projects:projectRecords});
  setupV204Evidence({projects:projectRecords});
  setupV205Annotations();
  const footer=document.querySelector('.v20Foot');
  if(footer&&!footer.querySelector('[data-v209-secondary]')){
    const related=document.createElement('nav');
    related.dataset.v209Secondary='true';related.className='v209SecondaryNav';
    related.setAttribute('aria-label','Project resources');
    const projects=document.createElement('a');projects.href='/projects/';projects.textContent='All project dossiers ↗';
    const evidence=document.createElement('a');evidence.href='/evidence/';evidence.textContent='Technical evidence index ↗';
    related.append(projects,evidence);footer.append(related);
  }
}else{
  setupGalleryFilters(document.getElementById('work-gallery'));
}
