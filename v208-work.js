// The Work gallery is built as HTML. Load the explorer for explicit entry links
// and existing share URLs only.

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
}
