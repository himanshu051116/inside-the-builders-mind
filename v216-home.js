/**
 * V21.6 Home refinement. Keeps original V19 presenter recordings and public
 * résumé links; only adds a real redacted screenshot and accessible navigation.
 */
export const V216_CAPTURE = Object.freeze({
  image: '/evidence/mulyankan-overview.webp',
  destination: '/projects/mulyankan/#captures',
  alt: 'Redacted Mulyankan proposal scrutiny overview, saved interface screenshot',
  boundary: 'Saved redacted review screen · not a live scoring result',
});

const el = (doc, name, cls, value) => {
  const node = doc.createElement(name);
  if (cls) node.className = cls;
  if (value !== undefined) node.textContent = value;
  return node;
};

export function setupV216Home(doc=document) {
  const home = doc.getElementById('home');
  if (!home || home.dataset.v216Ready === 'true') return false;
  const proof = home.querySelector('.v17ProofBody');
  const meta = proof?.querySelector('.v17ProofMeta');
  if (!proof || !meta) return false;
  home.dataset.v216Ready = 'true';

  const capture = el(doc, 'a', 'v216ProofCapture');
  capture.href = V216_CAPTURE.destination;
  capture.setAttribute('aria-label', 'View redacted Mulyankan scrutiny screenshot and its documented limits');
  const image = el(doc, 'img');
  image.src = V216_CAPTURE.image;
  image.alt = V216_CAPTURE.alt;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.width = 1277;
  image.height = 899;
  const body = el(doc, 'span', 'v216CaptureBody');
  body.append(
    el(doc, 'strong', '', 'Inspect the redacted review screen ↗'),
    el(doc, 'small', '', V216_CAPTURE.boundary),
  );
  capture.append(image,body);
  proof.insertBefore(capture,meta);
  image.addEventListener('error',()=>{
    // Never show a broken or invented project image; retain the case-study link.
    capture.classList.add('v216CaptureNoImage');
    image.hidden=true;
    body.querySelector('small').textContent='Saved image unavailable · case study remains accessible';
  },{once:true});

  const play = proof.querySelector('.v19MilestoneOpen');
  play?.setAttribute('aria-label', 'Watch 17-second Mulyankan architecture walkthrough with presenter webcam and original audio');
  const footnote = proof.querySelector('.v19MilestoneFootnote');
  if (footnote) footnote.textContent='Watch 17-second architecture walkthrough · Presenter and original audio';

  const resume = home.querySelector('.v17ResumeSelect');
  if (resume) {
    doc.addEventListener('click', event=>{
      if(resume.open && !resume.contains(event.target)) resume.open=false;
    });
    resume.addEventListener('keydown', event=>{
      if(event.key==='Escape' && resume.open) {
        resume.open=false;
        resume.querySelector('summary')?.focus();
        event.preventDefault();
      }
    });
  }
  return true;
}
