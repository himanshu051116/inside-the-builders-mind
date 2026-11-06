/**
 * V21.5 — contribution-first project dossiers.
 * Facts about problems and verification come from the canonical content.js.
 * Individual work is limited to named, public commits attributed to the owner's
 * GitHub account; commit attribution is not a claim of sole authorship.
 */
export const V215_CONTRIBUTIONS = Object.freeze({
  mulyankan: {
    provenance: 'Owner-attributed repository commits · scope-limited',
    contribution: 'Published commits attributed to the portfolio owner document a hosted-demo deployment blueprint, associated service and storage configuration, and a frontend dependency audit. They do not establish sole authorship of the evaluation engine.',
    links: [
      ['Hosted-demo deployment blueprint', 'https://github.com/himanshu051116/Algonauts-Mulyankan/commit/133d428971da1967d4090aee4aa6a38dcee63641'],
      ['Frontend dependency audit', 'https://github.com/himanshu051116/Algonauts-Mulyankan/commit/3bbc41219b2f2d9212af35c89ebd4179f958e11f']
    ],
    boundary: 'Demonstration and recorded screens are not proof of institutionally validated scores.'
  },
  earthbridge: {
    provenance: 'Owner-attributed training and evaluation commits',
    contribution: 'Public commits attributed to the portfolio owner cover cross-modal training refinements, T4 training-loop improvements and a tiny-overfit diagnostic runner. The published evaluation numbers are repository-reported, not independently reproduced here.',
    links: [
      ['Cross-modal training baseline', 'https://github.com/himanshu051116/earthbridge/commit/1d38f221e52746dd2961dec8b6e465e098e9a717'],
      ['T4 training-loop improvements', 'https://github.com/himanshu051116/earthbridge/commit/cfe510c2d0016cd9035e73235a2798ef7cdbdf05'],
      ['Tiny-overfit diagnostics', 'https://github.com/himanshu051116/earthbridge/commit/7a0c191a44e5ed547c82522866451034769e34a9']
    ],
    boundary: 'REPOSITORY-REPORTED EVALUATION · not independently reproduced; holdout protocol and metrics require the linked project sources.'
  },
  'our-hidden-universe': {
    provenance: 'Owner-attributed application commits',
    contribution: 'Public commits attributed to the portfolio owner include an explicit recovery path for browser-blocked Watch Together autoplay and account-scoped room recovery. The captures do not establish cross-device synchronization quality.',
    links: [
      ['Watch Together playback recovery', 'https://github.com/himanshu051116/our-hidden-universe/commit/a7d06df8b9a664dfaaecfa1a74454641cbbee50e'],
      ['Account-scoped room recovery', 'https://github.com/himanshu051116/our-hidden-universe/commit/56adca96c7bbe46a04d9fc990f95ebce0046f826']
    ],
    boundary: 'A deployed interface does not establish audited privacy, call performance or independently verified multi-user synchronization.'
  },
  newssources: {
    provenance: 'Owner-attributed editorial showcase commits',
    contribution: 'Public commits attributed to the portfolio owner implement session-only review notes, triage labels, source navigation and comparison of saved fictional captures in the editorial showcase. They do not demonstrate the production ingestion pipeline running.',
    links: [
      ['Session-only reviewer controls', 'https://github.com/himanshu051116/NewsSources/commit/68d4b2ea743bee3509ab21d24223d16459ca06ad'],
      ['Attribution-aware showcase comparison', 'https://github.com/himanshu051116/NewsSources/commit/7656bede3d65d5d5923feacff20b9252816e5b78']
    ],
    boundary: 'Showcase UI behavior and repository implementation references are not proof of a live crawler or database.'
  },
  sentinel: {
    provenance: 'Individual source attribution not yet audited',
    contribution: 'The portfolio describes local network-inspection and forward-proxy experiments. Individual code contributions have not been independently mapped to reviewed commits for this dossier.',
    links: [],
    boundary: 'Local proxy validation is not a certified detection benchmark or a production WAF evaluation.'
  },
  schoolbuddies: {
    provenance: 'Project role reported in portfolio record',
    contribution: 'The public portfolio record identifies a co-founder role in the school technology outreach initiative. Specific individual code commits or measured workshop outcomes have not been independently audited for this dossier.',
    links: [],
    boundary: 'The project website and workshop poster do not independently establish participant counts or educational impact.'
  }
});

const escapeHtml = text => String(text ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;')
  .replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const commitUrl = value => /^https:\/\/github\.com\/himanshu051116\/[a-zA-Z0-9_.-]+\/commit\/[a-f0-9]{40}$/.test(String(value||''));
const captureUrl = value => /^\/evidence\/[a-z0-9-]+\.webp$/.test(String(value||''));
const captionText = (p) => String(p.evidenceImageCaption || `${p.title} project-authored capture`);

/** Renders a scoped evidence summary; never creates a second canonical project record. */
export function contributionFirst(project, id, manifest={}) {
  if (!project || !project.caseStudy || !/^[a-z0-9-]+$/.test(id)) return '';
  const record=V215_CONTRIBUTIONS[id];
  if (!record) return '';
  const captures=Object.values(manifest || {});
  const entry=captures.find(c => c?.path===project.evidenceImage);
  const image=captureUrl(project.evidenceImage) ? project.evidenceImage : null;
  const dimensions=image ? `width="${Number(entry?.width)||1200}" height="${Number(entry?.height)||760}"` : '';
  const imageBlock=image
    ? `<a class="v215CaptureLink" href="#captures" aria-label="Inspect recorded ${escapeHtml(project.title)} screenshots"><figure><img src="${escapeHtml(image)}" ${dimensions} loading="eager" decoding="async" alt="${escapeHtml(captionText(project))}"><figcaption>${escapeHtml(captionText(project))} · Saved capture, not live execution</figcaption></figure><span class="v215CaptureAction">Inspect annotated captures ↗</span></a>`
    : `<div class="v215NoCapture" role="note">No verified public project screenshot is available for this dossier. The source links and documented boundaries remain accessible.</div>`;
  const citations=record.links.filter(([name,url]) => name && commitUrl(url))
    .map(([name,url])=>`<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)} ↗</a></li>`).join('');
  return `<section class="v208Container v215QuickCase" aria-labelledby="v215Title-${escapeHtml(id)}">
    <div class="v215Heading"><span class="v208Overline">PROJECT / CONTRIBUTION / PROOF</span><h2 id="v215Title-${escapeHtml(id)}">Start with the work and the evidence.</h2><p>Implementation claims are scoped to the linked records. A screenshot documents an interface state, not an independently tested backend.</p></div>
    <div class="v215BriefGrid">
      <section class="v215QuickCard v215Problem"><span class="v215Index">01 / PROBLEM</span><h3>What needed solving</h3><p>${escapeHtml(project.caseStudy.problem)}</p></section>
      ${imageBlock}
      <section class="v215QuickCard v215Contribution"><span class="v215Index">02 / MY CONTRIBUTION</span><h3>Recorded work and responsibility</h3><p>${escapeHtml(record.contribution)}</p><p class="v215Provenance">${escapeHtml(record.provenance)}</p>${citations?`<ul class="v215CommitLinks" aria-label="Commits supporting the contribution">${citations}</ul>`:'<p class="v215NoCommits">No individually audited commit links are attached to this record.</p>'}</section>
      <section class="v215QuickCard v215Verification"><span class="v215Index">03 / DOCUMENTED VERIFICATION</span><h3>What the record supports</h3><p>${escapeHtml(project.caseStudy.verification)}</p><p class="v215Boundary">${escapeHtml(record.boundary)}</p></section>
    </div>
  </section>`;
}
