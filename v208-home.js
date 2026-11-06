import {setupMilestoneVideo} from './v19-milestone-video.js';

function setupSpecializations(doc){
  const tablist=doc.querySelector('.v208TrackTabs');
  if(!tablist)return;
  const tabs=[...tablist.querySelectorAll('[role="tab"]')];

  function select(selected){
    for(const tab of tabs){
      const active=tab===selected;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
      doc.getElementById(tab.getAttribute('aria-controls')).hidden=!active;
    }
  }

  tablist.addEventListener('click',event=>{
    const tab=event.target.closest('[role="tab"]');
    if(tab)select(tab);
  });
  tablist.addEventListener('keydown',event=>{
    const index=tabs.indexOf(event.target);
    if(index<0)return;
    let next;
    switch(event.key){
      case 'ArrowRight': next=(index+1)%tabs.length; break;
      case 'ArrowLeft': next=(index+tabs.length-1)%tabs.length; break;
      case 'Home': next=0; break;
      case 'End': next=tabs.length-1; break;
      default: return;
    }
    event.preventDefault();
    select(tabs[next]);
    tabs[next].focus();
  });
  tablist.hidden=false;
}

function setupSpotlight(doc){
  const controls=doc.querySelector('.v208SpotlightChoices');
  if(!controls)return;
  const choices=[...controls.querySelectorAll('button')];
  const status=doc.querySelector('.v208SpotlightStatus');
  const panelFor=choice=>doc.getElementById(choice.getAttribute('aria-controls'));
  let selection=0;
  controls.hidden=false;
  controls.addEventListener('click',async event=>{
    const selected=event.target.closest('button');
    if(!selected)return;

    const request=++selection;
    status.textContent='';
    if(selected.getAttribute('aria-pressed')==='true'){
      controls.removeAttribute('aria-busy');
      return;
    }

    // Keep the current screen visible while the requested image loads.
    const image=panelFor(selected).querySelector('img');
    controls.setAttribute('aria-busy','true');
    image.loading='eager';
    const ready=await image.decode().then(()=>true,()=>false);
    if(request!==selection)return;
    controls.removeAttribute('aria-busy');
    if(!ready){
      status.textContent='This saved screen could not load. Open the case study to see the project evidence.';
      return;
    }

    for(const choice of choices){
      const show=choice===selected;
      choice.setAttribute('aria-pressed',String(show));
      panelFor(choice).hidden=!show;
    }
  });
}

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
  setupSpotlight(document);
  setupSpecializations(document);
  setupMilestoneVideo(document);
  redirectLinks();
}
