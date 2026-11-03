// V9 visual feedback and progressive-detail interactions. No network/API calls.
export function setupSceneV9(){
  const root=document.documentElement
  const modes=[...document.querySelectorAll('[data-switch-role]')]
  let modeIndex=0
  function changeModeVisual(){
    const current=document.body.dataset.role || 'fullstack'
    const info={fullstack:'PRODUCT INTERFACES',software:'SYSTEMS & PIPELINES',ml:'MODEL EXPERIMENTS'}
    root.style.setProperty('--scene-label',JSON.stringify(info[current] || 'PORTFOLIO'))
    modeIndex=['fullstack','software','ml'].indexOf(current)
  }
  modes.forEach(button=>button.addEventListener('click',changeModeVisual))
  changeModeVisual()
  document.querySelectorAll('[data-sys-stage]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelector(`.terminalAside [data-pipeline-step="${button.dataset.sysStage}"]`)?.click()
  }))
  const sysGraphic=document.querySelector('.systemsFlowGraphic')
  function updateGraph(){
    const stage=document.querySelector('.terminalAside [data-pipeline-step][aria-pressed="true"]')?.dataset.pipelineStep || 'discover'
    sysGraphic?.setAttribute('data-active-stage',stage)
    document.querySelectorAll('[data-sys-stage]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.sysStage===stage)))
    const labels={discover:'DISCOVER',normalize:'NORMALIZE',dedup:'DEDUPLICATE',store:'STORE & TRACE'}
    const index={discover:'01',normalize:'02',dedup:'03',store:'04'}
    const status=document.getElementById('sysFlowVisualStatus')
    if(status)status.textContent=`STAGE ${index[stage]} / ${labels[stage]}`
  }
  document.querySelectorAll('[data-pipeline-step], [data-console-command], [data-event]').forEach(button=>button.addEventListener('click',updateGraph))
  document.getElementById('consoleForm')?.addEventListener('submit',()=>requestAnimationFrame(updateGraph))
  updateGraph()
  const researchVisual=document.getElementById('researchVisual')
  const researchStage=document.querySelector('.researchStage')
  function updateResearch(){
    const sensor=document.querySelector('[data-research-query][aria-pressed="true"]')?.dataset.researchQuery || 'optical'
    researchStage?.setAttribute('data-active-sensor',sensor)
    const thumbnails=[...document.querySelectorAll('.researchResultTile')]
    const scores=[...document.querySelectorAll('#researchRankings .matchHead strong')]
    thumbnails.forEach((tile,i)=>{
      const label=scores[i]?.textContent?.split(' / ')[1] || `EXAMPLE ${i+1}`
      tile.querySelector('small').textContent=`0${i+1} / ${label}`
      tile.style.setProperty('--result-index',i)
    })
    researchVisual?.setAttribute('data-sensor',sensor)
  }
  document.querySelectorAll('[data-research-query]').forEach(btn=>btn.addEventListener('click',()=>requestAnimationFrame(updateResearch)))
  document.getElementById('researchWeight')?.addEventListener('input',()=>requestAnimationFrame(updateResearch))
  updateResearch()
  // Only move decorative depth layers on non-touch devices; never block navigation.
  if(window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
    const full=document.querySelector('[data-role-view="fullstack"] .fullStage')
    full?.addEventListener('pointermove',ev=>{
      const rect=full.getBoundingClientRect()
      const x=(ev.clientX-rect.left)/rect.width-.5
      const y=(ev.clientY-rect.top)/rect.height-.5
      full.style.setProperty('--pointer-x',`${(x*25).toFixed(1)}px`)
      full.style.setProperty('--pointer-y',`${(y*18).toFixed(1)}px`)
    },{passive:true})
    full?.addEventListener('pointerleave',()=>{full.style.setProperty('--pointer-x','0px');full.style.setProperty('--pointer-y','0px')})
  }
}
