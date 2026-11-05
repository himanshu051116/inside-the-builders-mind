import { getPortfolioNavigation } from './portfolio-navigation.js'
// Three portfolio lenses mapped to the three user-supplied resumes.
// Local-only illustrative interactions; no external endpoints or fabricated measurements.
export const MODE_ORDER = {
  fullstack: ['03','06','01','04','02','05'],
  software:  ['04','05','01','03','02','06'],
  ml:        ['02','01','05','04','03','06']
}
export const MODE_NAMES = { fullstack:'Full-Stack Studio', software:'Systems Console', ml:'ML Research Lab' }

const TERMINAL = {
  help: ['$ help', 'Available: projects · stack · trace · status · clear', 'Select a shortcut below or type a command.'],
  projects: ['$ projects', '01 NewsSources   - RSS / sitemap ingestion, deduplication [in development]', '02 Sentinel      - packet / flow monitoring [local prototype]', '03 Mulyankan     - rubric + evidence review [demonstrated prototype]'],
  stack: ['$ stack', 'Languages     Python · JavaScript · TypeScript · SQL · C++ · Java', 'Infrastructure Docker · PostgreSQL · Alembic · FastAPI', 'Practices      API design · pytest · Git / GitHub'],
  trace: ['$ trace news-ingestion', '[01] DISCOVER  RSS or sitemap yields candidate URLs', '[02] NORMALIZE URLs and detect duplicates', '[03] STORE     PostgreSQL-backed article + provenance metadata', '[04] RETAIN    source reference for review', 'Illustrative flow; not running against a live backend.'],
  status: ['$ status', 'Portfolio demo: local-only, read-only', 'NewsSources: in development', 'Sentinel: locally tested prototype', 'Production monitoring: not connected.'],
  clear: ['Console reset. Try `help` or `trace`.']
}
export function setupCareerModes(){
  const navigation=getPortfolioNavigation(window)
  const buttons = Array.from(document.querySelectorAll('[data-switch-role]'))
  const views = Array.from(document.querySelectorAll('[data-role-view]'))
  const gallery = document.getElementById('projectGrid')
  const cards = Array.from(gallery.querySelectorAll('.projectCard'))
  const themeColor = document.querySelector('meta[name="theme-color"]')
  const modeStatus = document.getElementById('currentModeDescription')
  const modeFilter = document.querySelector('[data-filter="all"]')
  const roleNames = { fullstack: 'Full-Stack product engineering', software: 'Software engineering & backend systems', ml: 'Applied machine learning research' }
  const roleColors = { fullstack:'#f3f0e7', software:'#090c12', ml:'#141226' }
  const fromQuery = () => navigation.current().role
  let mode = 'fullstack'
  function selectRole(value, writeUrl=true){
    if(!Object.hasOwn(MODE_ORDER,value)) return
    mode=value
    document.body.dataset.role=value
    document.documentElement.dataset.role=value
    buttons.forEach(button => {
      const on=button.dataset.switchRole===value
      button.setAttribute('aria-pressed',String(on))
      button.classList.toggle('isSelected',on)
    })
    views.forEach(view=>view.hidden=view.dataset.roleView!==value)
    // Only the visible role's flagship screenshot deserves eager loading.
    // Nonselected role screenshots should not compete for bandwidth.
    document.querySelectorAll('.v14RoleView .v14HeroImage img').forEach(img=>{
      const isActive=img.closest('[data-role-view]')?.dataset.roleView===value
      img.loading=isActive?'eager':'lazy'
      img.fetchPriority=isActive?'high':'low'
    })
    document.querySelectorAll('[data-role-lab]').forEach(lab=>lab.hidden=lab.dataset.roleLab!==value)
    modeStatus.textContent=`${MODE_NAMES[value]} selected. ${roleNames[value]}. Explore the featured work below.`
    themeColor?.setAttribute('content',roleColors[value])
    MODE_ORDER[value].forEach((number,index)=>{
      const card=cards.find(c=>c.dataset.project===number)
      if(card){gallery.appendChild(card);card.dataset.featured=index<3?'true':'false'}
    })
    // All projects stay accessible. Ordering, highlighted work and skills reflect this track.
    modeFilter?.click()
    gallery.scrollTo({left:0,behavior:'instant'})
    document.querySelectorAll('[data-skill-track]').forEach(el=>el.hidden=el.dataset.skillTrack!==value)
    document.title=`Himanshu Shukla | ${MODE_NAMES[value]} — Projects & Engineering Evidence`
    document.documentElement.style.colorScheme=value==='fullstack'?'light':'dark'
    const meta=document.querySelector('meta[name="description"]')
    const roleDescriptions={fullstack:'Himanshu Shukla — React, TypeScript, Firebase. Real-time products, verified source and case studies.',software:'Himanshu Shukla — Python, FastAPI, PostgreSQL. Source-backed data pipeline and backend engineering case studies.',ml:'Himanshu Shukla — PyTorch, FAISS, cross-modal satellite retrieval. Research code, evaluation methods and honest limitations.'}
    meta?.setAttribute('content',roleDescriptions[value])
    document.querySelector('meta[property="og:description"]')?.setAttribute('content',roleDescriptions[value])
    if(writeUrl){
      navigation.selectRole(value)
      if(!navigation.isUrlSynced()) modeStatus.textContent+=' The page link could not be updated in this browser.'
    }
  }
  buttons.forEach(button => button.addEventListener('click',()=>selectRole(button.dataset.switchRole)))
  navigation.subscribe(route=>{if(route.role!==mode)selectRole(route.role,false)})
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>{
      document.body.classList.toggle('isAtCareer',entries[0].isIntersecting)
    },{threshold:0.06})
    observer.observe(document.getElementById('top'))
  }
  const initial=fromQuery()
  selectRole(Object.hasOwn(MODE_ORDER,initial)?initial:'fullstack',false)

  // Studio controls change actual visual product panels, not just descriptive labels.
  const productPanels=[...document.querySelectorAll('[data-studio-panel]')]
  const productButtons=[...document.querySelectorAll('[data-studio-step]')]
  productButtons.forEach(button=>button.addEventListener('click',()=>{
    const step=button.dataset.studioStep
    productButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)))
    productPanels.forEach(panel=>panel.hidden=panel.dataset.studioPanel!==step)
    document.getElementById('studioSceneStatus').textContent=`${button.textContent.trim()} preview selected`
  }))

  // Terminal is an intentionally restricted command explorer, not a real shell.
  const output=document.getElementById('consoleOutput')
  const consoleInput=document.getElementById('consoleCommand')
  const writeConsole=command=>{
    const key=String(command||'').trim().toLowerCase().replace(/^\$\s*/,'')
    output.textContent=(TERMINAL[key]||[`$ ${key || '?'}`,'Unknown demo command. Type help for available shortcuts.']).join('\n')
    output.scrollTop=0
    if (key==='trace') window.dispatchEvent(new CustomEvent('portfolio:trace'))
    document.getElementById('consoleStatus').textContent=`${key || 'unknown'} command displayed. Simulation only.`
  }
  document.querySelectorAll('[data-console-command]').forEach(button=>button.addEventListener('click',()=>writeConsole(button.dataset.consoleCommand)))
  document.getElementById('consoleForm').addEventListener('submit',ev=>{ev.preventDefault();writeConsole(consoleInput.value);consoleInput.value=''})
  writeConsole('help')

  // Sensor selection is owned by v8-interactions.js, the single ranking renderer.
  // Keep this module focused on mode selection, project order, Studio and Console.
  return { selectRole, mode:()=>mode }
}
