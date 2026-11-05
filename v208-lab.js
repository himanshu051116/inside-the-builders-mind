import {setupEvidenceWorkbench} from './workbench-ui.js';
import {TRACE_STEPS,rankToyNeighbors} from './v8-interactions.js';
setupEvidenceWorkbench();
const trace=document.getElementById('v208TraceDemo');
if(trace){
  const entries=Object.entries(TRACE_STEPS);
  const actions=trace.querySelector('.v208DemoActions');
  const detail=trace.querySelector('.v208DemoDetail');
  let selected=0;
  const draw=()=>{
    actions.innerHTML=entries.map(([id,v],i)=>`<button type="button" data-step="${id}" aria-pressed="${i===selected}">${v.label}</button>`).join('');
    const s=entries[selected][1];
    detail.replaceChildren();
    for(const [kind,copy] of [['h3',s.heading],['p',s.description],['code',s.source],['code',s.destination]]){
      const el=document.createElement(kind);el.textContent=copy;detail.append(el);
    }
  };
  actions.addEventListener('click',event=>{
    const b=event.target.closest('[data-step]');if(!b)return;
    selected=entries.findIndex(([name])=>name===b.dataset.step);draw();
    actions.querySelector(`[data-step="${b.dataset.step}"]`)?.focus();
  });
  draw();
}
const query=document.getElementById('v208Query'),weight=document.getElementById('v208Weight'),output=document.getElementById('v208WeightValue'),ranking=document.getElementById('v208Rankings');
function updateToy(){
  if(!query||!weight||!ranking)return;
  const n=Number(weight.value);
  output.textContent=n+'%';
  const neighbors=rankToyNeighbors(query.value,n);
  ranking.replaceChildren(...neighbors.map((item,i)=>{
    const li=document.createElement('li');
    const title=document.createElement('strong');title.textContent=`${i+1}. ${item.label}`;
    const score=document.createElement('span');score.textContent=`Toy cosine score: ${item.score.toFixed(3)}`;
    li.append(title,score);return li;
  }));
}
query?.addEventListener('change',updateToy);
weight?.addEventListener('input',updateToy);
updateToy();
