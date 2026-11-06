/** Evidence-connected inspector for dedicated project dossiers. */
import {getEvidenceTrail} from './v211-evidence-model.js';
const el=(doc,tag,cls,value)=>{
  const node=doc.createElement(tag);
  if(cls)node.className=cls;
  if(value!==undefined)node.textContent=value;
  return node;
};
export function mountV211EvidencePanel(doc=document,{projectId,container=doc.getElementById('captures')}={}){
  if(!container||!projectId)return null;
  const prior=container.querySelector('[data-v211-evidence]');
  if(prior)return prior.__v211Controller;
  const root=container.querySelector('#v211-evidence-trail')||el(doc,'section','v211EvidenceTrail');
  root.className='v211EvidenceTrail';root.dataset.v211Evidence='true';
  root.id='v211-evidence-trail';root.setAttribute('aria-labelledby','v211TrailTitle');
  const eyebrow=el(doc,'div','v211Eyebrow','SOURCE-CONNECTED INVESTIGATION');
  const title=el(doc,'h3','', 'Follow the evidence behind this capture');title.id='v211TrailTitle';
  const explainer=el(doc,'p','v211Explanation','Saved screenshots and project records are contextual evidence, not proof that a backend, model, or external service ran here.');
  // Announce only the change, not every full paragraph and code link rebuilt below.
  const announcement=el(doc,'p','v212Status srOnly');
  announcement.id='v212Status';announcement.setAttribute('role','status');
  announcement.setAttribute('aria-live','polite');announcement.setAttribute('aria-atomic','true');
  const live=el(doc,'div','v211Trace');live.id='v211Trace';
  const links=el(doc,'div','v211SourceArea');
  root.replaceChildren(eyebrow,title,explainer,announcement,live,links);
  const gallery=container.querySelector('.v208ProjectGallery');
  if(!root.isConnected){
    gallery?.insertAdjacentElement('afterend',root);
    if(!gallery)container.append(root);
  }
  let selection={captureId:null,featureIndex:null};
  let mediaAvailable=null;
  function labeledCard(label,header,paragraph){
    const box=el(doc,'section','v211EvidenceCard');
    box.append(el(doc,'span','v211CardLabel',label));
    if(header)box.append(el(doc,'h4','',header));
    box.append(el(doc,'p','',paragraph));
    return box;
  }
  function draw(){
    const data=getEvidenceTrail(projectId,selection.captureId,selection.featureIndex);
    if(!data)return;
    live.replaceChildren();links.replaceChildren();
    const intro=el(doc,'p','v211CaptureStatus',selection.captureId?`Selected saved capture: ${selection.captureId}`:'No saved screenshot mapped for this project.');
    if(mediaAvailable===false)intro.append(' — image currently unavailable');
    live.append(intro);
    const summary=data.feature?.title||'Project-level evidence';
    announcement.textContent=(selection.captureId||'No selected screenshot')+': '+
      (mediaAvailable===false?'image unavailable; ': '')+summary;
    if(data.feature){
      live.append(labeledCard('01 / VISIBLE FEATURE',data.feature.title,data.feature.detail));
    }else{
      const message=data.annotatedCount===0?'This capture has no manually verified hotspot mapping. Project-level source records are shown below without claiming to prove the screenshot.':'Select a numbered hotspot on the image to inspect a documented interface feature.';
      live.append(labeledCard('01 / SAVED CAPTURE','Capture context',message));
    }
    const stageArea=labeledCard('02 / ARCHITECTURE',data.stage?.title||'No stage mapping available',data.stage?.description||'No stage was verified for this selected feature.');
    if(data.stage){
      const a=el(doc,'a','v211StageLink','Jump to the related architecture stage ↗');a.href='#architecture-step-'+data.stage.index;
      stageArea.append(a);
      if(data.contextNote)stageArea.append(el(doc,'p','v211ContextCaution',data.contextNote));
    }
    live.append(stageArea);
    const verification=labeledCard('03 / DOCUMENTED VERIFICATION','What is documented',data.verification);
    if(data.reproducible)verification.append(el(doc,'p','v211Repro','Independent reproduction guidance (not executed here): '+data.reproducible));
    live.append(verification);
    live.append(labeledCard('04 / LIMITATIONS','What remains unverified',data.limitations));
    const heading=el(doc,'h4','','Related repository records');
    const boundary=el(doc,'p','v211SourceBoundary','Links are relevant project records, not direct validation of the selected screenshot or a claim that remote tests were run.');
    links.append(heading,boundary);
    if(data.sourceRecords.length){
      const ul=el(doc,'ul','v211SourceList');
      data.sourceRecords.forEach(record=>{
        const li=el(doc,'li','');const a=el(doc,'a','',record.label+' ↗');
        a.href=record.url;a.rel='noopener noreferrer';a.target='_blank';
        li.append(a,el(doc,'small','',record.category));ul.append(li);
      });
      links.append(ul);
    }else links.append(el(doc,'p','', 'No source-level repository reference is linked for this project.'));
    links.append(el(doc,'a','v211VerificationLink','Read full verification and limitations ↗'));
    links.lastElementChild.href='#verification';
  }
  function selectCapture(id,{available=null}={}){
    selection={captureId:id,featureIndex:null};mediaAvailable=available;draw();
  }
  function selectFeature(index){
    selection.featureIndex=index;draw();
  }
  function imageStatus(available){mediaAvailable=available;draw();}
  const controller={root,selectCapture,selectFeature,imageStatus,get current(){return {...selection}}};
  root.__v211Controller=controller;
  draw();return controller;
}
