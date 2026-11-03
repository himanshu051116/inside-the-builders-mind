// V8: deterministic, local-only interactive demonstrations. This is not a live app backend.
// No network traffic, stored visitor messages, real model inference or telemetry.

export const TOY_EMBEDDINGS = Object.freeze({
  optical: [0.82,0.32,0.91],
  sar: [0.22,0.95,0.22],
  multispectral: [0.68,0.43,0.99]
})
export const TOY_LIBRARY = Object.freeze([
  {id:'OPT-A', label:'Forest · optical-like', v:[0.90,0.25,0.80],sensor:'OPT'},
  {id:'SAR-B', label:'Urban structure · radar-like', v:[0.24,0.97,0.25],sensor:'SAR'},
  {id:'MSI-C', label:'Vegetation bands · multispectral-like', v:[0.51,0.40,0.98],sensor:'MSI'},
  {id:'OPT-D', label:'Coastal pattern · optical-like', v:[0.67,0.61,0.79],sensor:'OPT'},
  {id:'SAR-E', label:'Ridge texture · radar-like', v:[0.35,0.84,0.17],sensor:'SAR'}
])

export function cosineSimilarity(a,b, spectralWeight=50){
  if (!Array.isArray(a)||!Array.isArray(b)||a.length!==3||b.length!==3) throw new TypeError('Three numeric dimensions required')
  const weight=Math.max(0,Math.min(100,Number(spectralWeight))) / 100
  const factors=[1, 1.4 - .9*weight, .35 + 2.6*weight]
  const x=a.map((v,i)=>v*Math.sqrt(factors[i]))
  const y=b.map((v,i)=>v*Math.sqrt(factors[i]))
  const dot=x.reduce((sum,v,i)=>sum+v*y[i],0)
  const denominator=Math.hypot(...x)*Math.hypot(...y)
  return denominator===0?0:dot/denominator
}
export function rankToyNeighbors(query, spectralWeight=50){
  const vector=TOY_EMBEDDINGS[query]
  if(!vector) return []
  return TOY_LIBRARY.map(item=>({...item,score:cosineSimilarity(vector,item.v,spectralWeight)}))
    .sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id))
}

export const TRACE_STEPS = Object.freeze({
  discover:{label:'01 · DISCOVER',heading:'Source discovery',description:'A fictitious RSS item is collected with its original source URL and discovery channel. No public news site is contacted.',source:'IN → feed URL + title',destination:'OUT → raw candidate + provenance'},
  normalize:{label:'02 · NORMALIZE',heading:'URL normalization',description:'Tracking parameters and fragments are removed from the illustrative URL. The original URL is retained as a provenance field.',source:'IN → /story?id=42&utm_source=feed',destination:'OUT → /story?id=42'},
  dedup:{label:'03 · DEDUPLICATE',heading:'Duplicate detection',description:'Compare the canonical URL against a fictional local index. A second discovery path is recorded rather than overwriting source history.',source:'IN → canonical URL + known index',destination:'OUT → one article + discovery paths'},
  store:{label:'04 · STORE & TRACE',heading:'Preserve lineage',description:'The normalized identity, source references and discovery timestamps form a mock database record. This is not a real PostgreSQL query.',source:'IN → article + provenance entries',destination:'OUT → traceable mock record'}
})

export function setupV8Interactions(){
  // Local-only chat. No actual users or server.
  const chat=document.getElementById('studioChatForm')
  const input=document.getElementById('studioChatInput')
  const list=document.getElementById('studioMessages')
  chat?.addEventListener('submit',event=>{
    event.preventDefault()
    const value=input.value.trim()
    if(!value) return
    const bubble=document.createElement('span')
    bubble.className='studioNewMessage'
    bubble.textContent=value.slice(0,80)
    list.append(bubble)
    while(list.children.length>5)list.firstElementChild.remove()
    input.value=''
    bubble.scrollIntoView({block:'nearest',behavior:'auto'})
  })

  // Shared-playback metaphor with a real local timer, no media stream.
  const play=document.getElementById('studioPlayToggle')
  const scrub=document.getElementById('studioScrub')
  const time=document.getElementById('studioTime')
  const state=document.getElementById('studioPlayState')
  let playing=false
  let playbackTimer=null
  const updatePlay=()=>{
    play.textContent=playing?'❚❚':'▶'
    play.setAttribute('aria-pressed',String(playing))
    play.setAttribute('aria-label',playing?'Pause simulated shared session':'Play simulated shared session')
    state.textContent=`${playing?'Playing':'Paused'} · local UI simulation`
  }
  const renderTime=()=>{
    const n=Number(scrub.value)
    time.textContent=`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`
    scrub.style.setProperty('--scrub',`${n/120*100}%`)
  }
  const stop=()=>{playing=false;clearInterval(playbackTimer);playbackTimer=null;updatePlay()}
  play?.addEventListener('click',()=>{
    if(playing){stop();return}
    if(Number(scrub.value)>=120)scrub.value='0'
    playing=true;updatePlay()
    playbackTimer=setInterval(()=>{
      if(document.hidden||document.body.dataset.role!=='fullstack'){stop();return}
      scrub.value=String(Math.min(120,Number(scrub.value)+1))
      renderTime()
      if(Number(scrub.value)>=120)stop()
    },1000)
  })
  scrub?.addEventListener('input',renderTime)
  if(scrub)renderTime()
  document.querySelectorAll('[data-switch-role]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.switchRole!=='fullstack')stop()}))
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()})

  // Clickable trace of one fictional article with two discovery scenarios.
  const insight=document.getElementById('pipelineInsight')
  const details=document.getElementById('pipelineDescription')
  const provenance=document.getElementById('pipelineSource')
  const pipelineButtons=[...document.querySelectorAll('[data-pipeline-step]')]
  let duplicate=false
  let active='discover'
  if(insight){
    const controls=document.createElement('div')
    controls.className='pipelineScenario'
    controls.innerHTML='<button type="button" data-event="first" aria-pressed="true">First discovery</button><button type="button" data-event="duplicate" aria-pressed="false">Duplicate discovered</button>'
    insight.append(controls)
    const renderTrace=()=>{
      const step=TRACE_STEPS[active]
      pipelineButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pipelineStep===active)))
      insight.querySelectorAll('[data-event]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.event==='duplicate')===duplicate)))
      insight.querySelector('strong').textContent=step.label+' / '+step.heading
      details.textContent=step.description+(duplicate&&active==='dedup'?' This duplicate is merged into the existing mock record; no second article is created.':'')
      provenance.replaceChildren()
      for(const value of [step.source,step.destination,duplicate?'PATHS → RSS + sitemap':'PATHS → RSS only']){
        const chip=document.createElement('span');chip.textContent=value;provenance.append(chip)
      }
    }
    pipelineButtons.forEach(button=>button.addEventListener('click',()=>{active=button.dataset.pipelineStep;renderTrace()}))
    controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{duplicate=button.dataset.event==='duplicate';active='dedup';renderTrace()}))
    window.addEventListener('portfolio:trace',()=>{active='discover';renderTrace()})
    renderTrace()
  }

  // An actual math demonstration using explicitly toy embeddings, not EarthBridge model outputs.
  const slider=document.getElementById('researchWeight')
  const value=document.getElementById('researchWeightValue')
  const ranks=document.getElementById('researchRankings')
  const queries=[...document.querySelectorAll('[data-research-query]')]
  let query='optical'
  function renderToy(){
    if(!slider||!ranks)return
    const weight=Number(slider.value)
    value.textContent=`${weight}%`
    const matches=rankToyNeighbors(query,weight).slice(0,3)
    ranks.replaceChildren(...matches.map((item,index)=>{
      const row=document.createElement('div');row.className='researchMatch'
      const head=document.createElement('div');head.className='matchHead'
      const name=document.createElement('strong');name.textContent=`0${index+1} / ${item.id}`
      const caption=document.createElement('span');caption.textContent=`${item.label} · cosine ${item.score.toFixed(3)} (toy)`
      head.append(name,caption)
      const track=document.createElement('div');track.className='matchTrack'
      const fill=document.createElement('i');fill.style.width=`${Math.max(0,item.score*100)}%`
      track.append(fill);row.append(head,track)
      return row
    }))
    document.getElementById('researchStatus').textContent=`${query} synthetic nearest neighbors recomputed with ${weight}% spectral emphasis.`
  }
  slider?.addEventListener('input',renderToy)
  queries.forEach(button=>button.addEventListener('click',()=>{query=button.dataset.researchQuery;renderToy()}))
  renderToy()
}
