// Purpose-built interactions for the original portfolio experience.
// No third-party analytics, network calls, cookies, or user data persistence.
const pad = n => String(n + 1).padStart(2, '0')

export function setupPortfolioExperience({ projects, orbitNotes }) {
  const stage = document.getElementById('orbitStage')
  const buttons = [...document.querySelectorAll('.orbitNode')]
  const focusTitle = document.getElementById('orbitFocusTitle')
  const focusNote = document.getElementById('orbitFocusNote')
  const focusIndex = document.getElementById('orbitFocusIndex')
  const orbitCounter = document.getElementById('orbitCounter')
  const orbitView = document.getElementById('orbitView')
  const grid = document.getElementById('projectGrid')
  const cards = [...grid.querySelectorAll('.projectCard')]
  const deckProgress = document.getElementById('deckProgress')
  if (stage && buttons.length) {
  let selected = 0
  function choose(index, keyboardFocus = false) {
    selected = (index + projects.length) % projects.length
    const project = projects[selected]
    buttons.forEach((button, i) => {
      const active = i === selected
      button.classList.toggle('isActive', active)
      button.setAttribute('aria-pressed', String(active))
      if (active && keyboardFocus) button.focus({ preventScroll: true })
    })
    stage.dataset.active = String(selected + 1)
    focusTitle.textContent = project.title
    focusNote.textContent = orbitNotes[selected][1]
    focusIndex.textContent = `${orbitNotes[selected][0]} / ${pad(selected)}`
    orbitCounter.textContent = `${pad(selected)} / ${pad(projects.length - 1)}`
    orbitView.setAttribute('aria-label', `Explore ${project.title} in the projects section`)
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => choose(i))
    button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      choose(i + (event.key === 'ArrowRight' ? 1 : -1), true)
    })
  })
  document.getElementById('orbitPrev').addEventListener('click', () => choose(selected - 1))
  document.getElementById('orbitNext').addEventListener('click', () => choose(selected + 1))
  orbitView.addEventListener('click', () => {
    document.querySelector('[data-filter="all"]')?.click()
    // The gallery retains the selected project even though it may be off-screen.
    requestAnimationFrame(() => {
      cards[selected]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest', inline: 'start' })
      updateDeck()
    })
  })
  let pointerFrame = 0
  stage.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || pointerFrame) return
    pointerFrame = requestAnimationFrame(() => {
      const r = stage.getBoundingClientRect()
      stage.style.setProperty('--pointer-x', `${Math.max(0, Math.min(100, (e.clientX-r.left) / r.width * 100))}%`)
      stage.style.setProperty('--pointer-y', `${Math.max(0, Math.min(100, (e.clientY-r.top) / r.height * 100))}%`)
      pointerFrame = 0
    })
  }, {passive:true})
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--pointer-x', '50%')
    stage.style.setProperty('--pointer-y', '45%')
  })
  choose(0)
  if ('IntersectionObserver' in window) {
    const stageHintObserver = new IntersectionObserver(entries => {
      document.body.classList.toggle('isAtOrbit', entries[0].isIntersecting)
    }, {threshold: 0.14})
    stageHintObserver.observe(stage)
  }

  }
  const visibleCards = () => [...grid.querySelectorAll('.projectCard')].filter(card => !card.hidden)
  function activeCardIndex() {
    const visible = visibleCards()
    if (!visible.length) return 0
    let best = 0, distance = Infinity
    for (let i=0;i<visible.length;i++) {
      const d = Math.abs(visible[i].getBoundingClientRect().left - grid.getBoundingClientRect().left)
      if (d < distance) {best=i; distance=d}
    }
    return best
  }
  function updateDeck() {
    const visible = visibleCards()
    const active = activeCardIndex()
    deckProgress.innerHTML = `${pad(active)} <span>/ ${pad(Math.max(visible.length - 1, 0))}</span>`
    document.getElementById('deckPrev').disabled = active === 0
    document.getElementById('deckNext').disabled = active >= visible.length - 1
  }
  function stepDeck(direction) {
    const visible = visibleCards()
    if (!visible.length) return
    const next = Math.min(visible.length - 1, Math.max(0, activeCardIndex()+direction))
    visible[next].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest',inline:'start'})
    requestAnimationFrame(updateDeck)
  }
  document.getElementById('deckPrev').addEventListener('click',()=>stepDeck(-1))
  document.getElementById('deckNext').addEventListener('click',()=>stepDeck(1))
  grid.addEventListener('scroll',updateDeck,{passive:true})
  grid.addEventListener('keydown',ev => {
    // Preserve native keyboard interaction with buttons and open details.
    if (ev.target !== grid) return
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      ev.preventDefault()
      stepDeck(ev.key==='ArrowRight'?1:-1)
    }
  })
  document.querySelectorAll('.projectFilter').forEach(button => button.addEventListener('click', () => {
    grid.scrollTo({left:0,behavior:'instant'})
    requestAnimationFrame(updateDeck)
  }))
  window.addEventListener('resize',updateDeck,{passive:true})
  updateDeck()

  // Content stays readable and functional without IntersectionObserver.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('isRevealed')
          observer.unobserve(entry.target)
        }
      }
    }, {threshold:0.1,rootMargin:'0px 0px -18px 0px'})
    document.querySelectorAll('.sectionHead,.projectCard,.achievementCard,.skillCard').forEach(el => {el.classList.add('canReveal');observer.observe(el)})
  }
}
