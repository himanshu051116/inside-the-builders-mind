/**
 * V21.4 — one authentic project preview above the interactive Work explorer.
 * Uses the canonical content.js records; never duplicates project facts or
 * claims a saved screenshot demonstrates live backend/model behavior.
 */
const slug = value => String(value || '').toLowerCase().normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const evidencePath = value => /^\/evidence\/[a-z0-9-]+\.webp$/.test(String(value || ''))
  ? value : null;

export function getV214Feature(projects, selectedId) {
  if (!Array.isArray(projects) || !selectedId) return null;
  const p = projects.find(record => slug(record?.title) === selectedId);
  if (!p) return null;
  return Object.freeze({
    id: selectedId,
    title: String(p.title || ''),
    status: String(p.status || ''),
    summary: String(p.description || ''),
    image: evidencePath(p.evidenceImage),
    caption: String(p.evidenceImageCaption || `${p.title} saved project capture`),
    dossier: `/projects/${selectedId}/`,
  });
}

const element = (doc, tag, className, value) => {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
};

export function setupV214WorkFeature(projects, doc = document, win = window) {
  const workspace = doc.getElementById('v20-workspace');
  const roleBar = workspace?.querySelector('.v20RoleBar');
  const inspector = workspace?.querySelector('#v20Inspector');
  if (!roleBar || !inspector || workspace.querySelector('[data-v214-feature]')) return null;

  const section = element(doc, 'section', 'v214Spotlight');
  section.dataset.v214Feature = 'true';
  section.setAttribute('aria-label', 'Selected project preview');

  const media = element(doc, 'div', 'v214Visual');
  const image = element(doc, 'img', 'v214PreviewImage');
  image.loading = 'eager';
  image.decoding = 'async';
  image.setAttribute('fetchpriority', 'high');
  const empty = element(doc, 'p', 'v214NoImage', 'No saved public screenshot for this project.');
  empty.hidden = true;
  const caption = element(doc, 'p', 'v214Caption');
  media.append(image, empty, caption);

  const details = element(doc, 'div', 'v214Info');
  const label = element(doc, 'p', 'v214Eyebrow', 'CURRENTLY INSPECTING · SAVED EVIDENCE');
  const heading = element(doc, 'h2', 'v214Title');
  const status = element(doc, 'span', 'v214Status');
  const summary = element(doc, 'p', 'v214Summary');
  const hint = element(doc, 'p', 'v214Note', 'Saved project material, not a live system test.');
  const actions = element(doc, 'div', 'v214Actions');
  const inspect = element(doc, 'a', 'v214Primary', 'Inspect in explorer');
  inspect.href = '#v20Inspector';
  const dossier = element(doc, 'a', 'v214Secondary', 'Read case study');
  actions.append(inspect, dossier);
  details.append(label, heading, status, summary, hint, actions);
  section.append(media, details);
  roleBar.insertAdjacentElement('afterend', section);

  let currentId = undefined;
  let currentImage = undefined;
  function show(projectId) {
    const record = getV214Feature(projects, projectId);
    if ((record?.id ?? null) === currentId) return;
    currentId = record?.id ?? null;
    section.dataset.projectId = currentId || '';
    section.classList.toggle('v214NoResult', !record);
    heading.textContent = record?.title || 'No matching projects';
    status.textContent = record?.status || 'Search results';
    summary.textContent = record?.summary || 'Change or clear the project search below to inspect a documented project.';
    actions.hidden = !record;
    hint.hidden = !record;
    caption.hidden = !record?.image;
    if (record) dossier.href = record.dossier;

    const source = record?.image || null;
    if (source !== currentImage) {
      currentImage = source;
      image.hidden = !source;
      empty.hidden = !!source;
      if (source) {
        image.alt = record.caption;
        image.src = source;
      } else {
        image.removeAttribute('src');
        image.alt = '';
      }
    }
    caption.textContent = record?.image ? `${record.caption} · Stored capture` : '';
  }
  image.addEventListener('error', () => {
    if (image.hidden || !currentImage) return;
    image.hidden = true;
    empty.hidden = false;
    empty.textContent = 'Saved screenshot unavailable. Project details remain accessible.';
    caption.hidden = true;
  });

  const sync = event => show(event.detail?.projectId ?? null);
  doc.addEventListener('portfolio:v20-render', sync);
  show(inspector.dataset.projectId || null);
  return {section, show, destroy() { doc.removeEventListener('portfolio:v20-render', sync); section.remove(); }};
}
