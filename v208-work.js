// V21.0 standalone Work entry. The V20 explorer is the only project renderer;
// legacy site.js and all its hidden UI are exclusively available at /legacy/.
import {projects as projectRecords} from './content.js';
import {setupV20Workspace} from './v20-workspace.js';
import {setupV203Experience} from './v203-experience.js';
import {setupV204Evidence} from './v204-evidence.js';
import {setupV205Annotations} from './v205-annotations.js';
import {setupV217MediaViewer} from './v217-media-viewer.js';
import {setupV214WorkFeature} from './v214-work-feature.js';

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
}else{
  const mounted=setupV20Workspace(projectRecords,document,window,{standalone:true});
  if(!mounted)throw new Error('The dedicated Work explorer could not be mounted');
  setupV203Experience({projects:projectRecords});
  setupV204Evidence({projects:projectRecords});
  setupV205Annotations();
  setupV217MediaViewer(document);
  setupV214WorkFeature(projectRecords,document,window);
  document.querySelector('[data-v208-nav="work"]')?.setAttribute('aria-current','page');
  const hint=document.querySelector('.v20Hint');
  if(hint)hint.textContent='Use the project search to filter by name or technology';
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
