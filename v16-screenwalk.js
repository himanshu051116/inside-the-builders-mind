/**
 * V16 | Screenwalk
 * A user-controlled walkthrough of genuine, previously published project captures.
 * This module never calls a backend and never simulates a successful model result.
 * Keep ids aligned with evidence-media.js to reuse its accessible lightbox.
 */
export const screenwalkScenes = Object.freeze({
  fullstack: [
    { id: 'ohs-home', title: 'Private-room entry', short: 'Entry screen', category: 'PRODUCT CAPTURE', description: 'Landing page with fictional example chat and a hidden invitation code.', alt: 'Our Hidden Universe homepage screenshot, fictional chat and redacted invite code.' },
    { id: 'ohs-together', title: 'Watch Together controls', short: 'Watch Together', category: 'PRODUCT CAPTURE', description: 'Shared playback controls and call readiness. Cross-device synchronization needs separate live testing.', alt: 'Our Hidden Universe Watch Together and call control screen.' }
  ],
  software: [
    { id: 'news-overview', title: 'Reports & events', short: 'Overview', category: 'LOCAL WORKSPACE', description: 'Local analyst view of source-linked articles and event summaries. Counts are a capture-time sample.', alt: 'NewsSources command centre showing stored reports and events.' },
    { id: 'news-claims', title: 'Claims awaiting evidence', short: 'Claims', category: 'LOCAL WORKSPACE', description: 'Claims marked as insufficiently evidenced, with zero supporting lineages in this capture.', alt: 'NewsSources claim list showing insufficient-evidence states.' },
    { id: 'news-search-quality', title: 'Search evaluation', short: 'Search quality', category: 'LOCAL WORKSPACE', description: 'Search-quality controls; semantic coverage is reported as unavailable in the captured state.', alt: 'NewsSources evaluation settings and search quality report.' }
  ],
  ml: [
    { id: 'earthbridge-evaluation', title: 'Reported results', short: 'Evaluation', category: 'RESEARCH CAPTURE', description: 'Static metrics quoted from the repository submission, not an independently repeated evaluation.', alt: 'EarthBridge evaluation page showing repository-reported scores and validation limits.' },
    { id: 'earthbridge-architecture', title: 'Retrieval architecture', short: 'Architecture', category: 'RESEARCH CAPTURE', description: 'Diagram of cross-sensor embeddings and FAISS indexing, not live model inference.', alt: 'EarthBridge architecture diagram with SAR, multispectral and FAISS components.' },
    { id: 'earthbridge-workbench', title: 'Offline workbench', short: 'Workbench', category: 'RESEARCH CAPTURE', description: 'Actual workbench capture, with API offline and no ranked retrieval output.', alt: 'EarthBridge experimental workbench showing the API-offline state.' }
  ]
});

const srcFor = id => `/evidence/${id}.webp`;

export function setupScreenwalk({ document: doc = document, window: win = window } = {}) {
  const instances = [];
  const reducedMotion = win.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  for (const view of doc.querySelectorAll('.v14RoleView[data-role-view]')) {
    const role = view.dataset.roleView;
    const shots = screenwalkScenes[role];
    const figure = view.querySelector('.v14HeroFrame');
    const imageButton = figure?.querySelector('button[data-hero-proof-open]');
    const image = imageButton?.querySelector('img');
    if (!shots?.length || !figure || !imageButton || !image) continue;
    if (figure.dataset.screenwalkReady === 'true') continue;
    figure.dataset.screenwalkReady = 'true';
    figure.classList.add('v16Screenwalk');
    view.classList.add('v16RoleView');

    // Progressive disclosure: retain all original engineering details in the DOM.
    const detailsArea = view.querySelector('.v144Details');
    const stack = detailsArea?.querySelector('.v14TechRow');
    const proof = detailsArea?.querySelector('.v14ProofFooter');
    const actions = detailsArea?.querySelector('.v14PrimaryActions');
    if (detailsArea && actions && (stack || proof)) {
      const details = doc.createElement('details');
      details.className = 'v16TechnicalDetails';
      const summary = doc.createElement('summary');
      summary.textContent = 'Stack, project stage & source';
      details.append(summary);
      if (stack) details.append(stack);
      if (proof) details.append(proof);
      actions.after(details);
    }

    const header = doc.createElement('div');
    header.className = 'v16ScreenHeader';
    header.innerHTML = `<span class="v16ScreenHeaderLabel">RECORDED INTERFACE / STATIC IMAGE</span><span class="v16FrameCounter" aria-live="off">01 / ${String(shots.length).padStart(2, '0')}</span>`;
    // The source image remains the first screenshot and the primary user action opens the existing evidence lightbox.
    figure.insertBefore(header, imageButton);
    const panel = doc.createElement('div');
    panel.className = 'v16ImagePanel';
    panel.id = `v16-${role}-panel`;
    panel.setAttribute('role', 'tabpanel');
    figure.insertBefore(panel, imageButton);
    panel.append(imageButton);

    const controls = doc.createElement('div');
    controls.className = 'v16ScreenControls';
    const story = doc.createElement('div');
    story.className = 'v16ScreenStory';
    story.innerHTML = '<span class="v16SceneCategory"></span><strong class="v16SceneTitle"></strong><p class="v16SceneDescription"></p>';

    const strip = doc.createElement('div');
    strip.className = 'v16ScreenStrip';
    strip.setAttribute('role', 'tablist');
    strip.setAttribute('aria-label', `Screenshots from ${role === 'fullstack' ? 'Our Hidden Universe' : role === 'software' ? 'NewsSources' : 'EarthBridge'}`);
    const tabs = shots.map((shot, index) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'v16SceneTab';
      button.setAttribute('role', 'tab');
      button.id = `v16-${role}-tab-${index}`;
      button.setAttribute('aria-controls', panel.id);
      button.setAttribute('aria-label', `Show screenshot ${index + 1}: ${shot.title}`);
      button.innerHTML = `<span class="v16SceneIndex">${String(index + 1).padStart(2, '0')}</span><span class="v16SceneTabName">${shot.short}</span>`;
      strip.append(button);
      return button;
    });
    const player = doc.createElement('button');
    player.type = 'button';
    player.className = 'v16PlayTour';
    player.setAttribute('aria-pressed', 'false');
    player.textContent = '▶ Play tour';
    player.setAttribute('aria-label', 'Play automatic screenshot walkthrough');
    if (reducedMotion) {
      player.disabled = true;
      player.textContent = 'Manual navigation';
      player.setAttribute('aria-label', 'Automatic slideshow disabled by reduced-motion preference');
    }

    controls.append(story, strip, player);
    panel.after(controls);

    let current = 0;
    let timer = null;
    const counter = header.querySelector('.v16FrameCounter');
    const category = story.querySelector('.v16SceneCategory');
    const title = story.querySelector('.v16SceneTitle');
    const description = story.querySelector('.v16SceneDescription');

    function show(index, { focus = false } = {}) {
      current = (index + shots.length) % shots.length;
      const shot = shots[current];
      image.src = srcFor(shot.id);
      image.alt = shot.alt;
      imageButton.dataset.heroProofOpen = shot.id;
      imageButton.setAttribute('aria-label', `Enlarge screenshot: ${shot.title}`);
      const parentLink = figure.querySelector('.v144CaseFromImage');
      if (parentLink) parentLink.setAttribute('aria-label', `Read ${role} engineering case study`);
      title.textContent = shot.title;
      description.textContent = shot.description;
      category.textContent = shot.category;
      counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(shots.length).padStart(2, '0')}`;
      panel.setAttribute('aria-labelledby', tabs[current].id);
      tabs.forEach((button, i) => {
        const selected = i === current;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
        button.classList.toggle('isCurrent', selected);
      });
      if (focus) tabs[current].focus();
      figure.classList.remove('v16FrameChanged');
      if (!reducedMotion) {
        // Purely cosmetic, only after a user-initiated selection or opt-in tour.
        void figure.offsetWidth;
        figure.classList.add('v16FrameChanged');
      }
    }
    function stop() {
      if (timer !== null) win.clearInterval(timer);
      timer = null;
      player.textContent = reducedMotion ? 'Manual navigation' : '▶ Play tour';
      player.setAttribute('aria-pressed', 'false');
      player.setAttribute('aria-label', 'Play automatic screenshot walkthrough');
    }
    function start() {
      if (reducedMotion || timer !== null) return;
      player.textContent = 'Ⅱ Pause tour';
      player.setAttribute('aria-pressed', 'true');
      player.setAttribute('aria-label', 'Pause screenshot walkthrough');
      timer = win.setInterval(() => {
        if (doc.hidden || view.hidden || doc.body.dataset.role !== role) { stop(); return; }
        show(current + 1);
      }, 4500);
    }

    tabs.forEach((button, index) => {
      button.addEventListener('click', () => { stop(); show(index); });
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        stop();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? shots.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1);
        show(next, { focus: true });
      });
    });
    player.addEventListener('click', () => { if (timer !== null) stop(); else start(); });
    view.addEventListener('focusout', event => {
      if (timer !== null && !view.contains(event.relatedTarget)) stop();
    });
    const onVisibility = () => { if (doc.hidden) stop(); };
    doc.addEventListener('visibilitychange', onVisibility);
    image.addEventListener('error', () => {
      const active = shots[current];
      description.textContent = `This screenshot is unavailable here. Read the ${role} project case study or open the source link below.`;
      figure.dataset.imageError = active.id;
    });
    image.addEventListener('load', () => { delete figure.dataset.imageError; });

    show(0);
    instances.push({ role, show, stop, get current() { return current; }, destroy() { stop(); doc.removeEventListener('visibilitychange', onVisibility); } });
  }
  return instances;
}