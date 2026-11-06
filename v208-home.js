import {setupMilestoneVideo} from './v19-milestone-video.js';
import {setupV216Home} from './v216-home.js';
const u=new URL(window.location.href);
const routeParams=['view','project','panel'].some(key=>u.searchParams.has(key));
const legacyHash=/^#(?:v20-workspace$|case-[a-z0-9-]+$|case-files$|field-proof$|proof\/|top$|work$|archive$)/.test(u.hash);
if(routeParams||legacyHash){
  // Incoming V20.6 links continue to address the real interactive workspace.
  window.location.replace('/work/'+u.search+u.hash);
}else if(u.hash==='#interactive-lab'||u.hash==='#lab'){
  window.location.replace('/lab/'+u.search);
}else{
  const destinations={
    '#v20-workspace':'/work/',
    '#case-ohs':'/projects/our-hidden-universe/',
    '#case-news':'/projects/newssources/',
    '#case-earthbridge':'/projects/earthbridge/',
    '#case-mulyankan':'/projects/mulyankan/'
  };
  const redirectLinks=()=>document.querySelectorAll('a[href^="#"]').forEach(a=>{
    const href=a.getAttribute('href');
    if(destinations[href])a.setAttribute('href',destinations[href]);
  });
  redirectLinks();
  setupMilestoneVideo(document);
  setupV216Home(document);
  redirectLinks();
}
