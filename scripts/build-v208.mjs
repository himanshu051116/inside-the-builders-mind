import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {profile,projects} from '../content.js';
import {recruiterIntroMarkup} from '../v17-recruiter.js';
import {V20_FLOWS} from '../v20-workspace.js';
import {evidenceLink} from '../v211-evidence-model.js';
const e=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const safe=x=>/^(https:\/\/[^\s"<>]+|mailto:[^\s"<>]+|\/[a-zA-Z0-9][^\s"<>]*)$/.test(String(x||''))?e(x):'#';
const slug=x=>String(x).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const imagePrefix={mulyankan:'mulyankan-',earthbridge:'earthbridge-',newssources:'news-','our-hidden-universe':'ohs-',schoolbuddies:'schoolbuddies-'};
const routes=Object.fromEntries(projects.map(p=>[slug(p.title),p]));
const roles=[
  {id:'fullstack',name:'Full-Stack',first:'our-hidden-universe',panel:'media',capture:'ohs-together',evidenceLabel:'Inspect the shared playback screen'},
  {id:'software',name:'Software Systems',first:'newssources',panel:'architecture',evidenceAnchor:'#architecture',evidenceLabel:'See the ingestion architecture'},
  {id:'ml',name:'Applied ML',first:'earthbridge',panel:'evidence',evidenceAnchor:'#verification',evidenceLabel:'Read evaluation and limits'}
];
const galleryFilters=[['all','All'],['software','Software'],['systems','Systems'],['ai','AI & ML']];
const spotlightScreens=[
  ['mulyankan-overview','Review queue'],
  ['mulyankan-submission','Proposal intake'],
  ['mulyankan-history','Review history']
];
const repo='https://github.com/himanshu051116/inside-the-builders-mind';
const previewBuild=process.env.VERCEL_ENV==='preview'||process.env.PORTFOLIO_NOINDEX==='1';
const robotPolicy=previewBuild?'noindex,nofollow':'index,follow';
const replaceRobots=(html,policy)=>html.replace(/<meta name="robots" content="[^"]*"\s*\/?>/,`<meta name="robots" content="${policy}" />`);
const nav=`<a class="v208Brand" href="/" aria-label="Inside the Builder's Mind home">HS<span aria-hidden="true">.</span> <small>INSIDE THE BUILDER'S MIND</small></a><nav class="v208Nav" aria-label="Main navigation"><a href="/" data-v208-nav="home">Home</a><a href="/work/" data-v208-nav="work">Projects</a><a href="/lab/" data-v208-nav="lab">Demos</a><a href="/#contact">Contact</a></nav>`;
const foot=`<footer id="contact" class="v208Footer"><div class="v208Container v208FooterGrid"><div><h2>Get in touch</h2><p>Open to software engineering, data systems and applied ML internships.</p><a class="v208Primary" href="mailto:${e(profile.email)}">Email me ↗</a></div><div><a href="/work/">All projects ↗</a><a href="/evidence/">Technical evidence ↗</a><a href="${repo}" target="_blank" rel="noopener noreferrer">Portfolio source ↗</a><a href="${safe(profile.github)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${safe(profile.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div></footer>`;
const head=(title,description,canonical)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f3f0e7"><meta name="color-scheme" content="light"><meta name="description" content="${e(description)}"><meta name="robots" content="${robotPolicy}"><meta property="og:type" content="website"><meta property="og:site_name" content="Inside the Builder's Mind"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(canonical)}"><link rel="canonical" href="${e(canonical)}"><meta property="og:image" content="https://inside-the-builders-mind.vercel.app/social-fullstack.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://inside-the-builders-mind.vercel.app/social-fullstack.png"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&amp;family=Space+Grotesk:wght@400;500;600;700" rel="stylesheet"><link rel="stylesheet" href="/portfolio.css"><title>${e(title)}</title></head>`;
function page(key,title,description,main,script,canonical){
  const current={Home:'home',WorkPage:'work',Lab:'lab'}[key];
  const navigation=current?nav.replace(`data-v208-nav="${current}"`,`data-v208-nav="${current}" aria-current="page"`):nav;
  const content=`${head(title,description,canonical)}<body class="v208Page v208${key}"><a class="skipLink" href="#main">Skip to content</a><header class="v208SiteHeader"><div class="v208Container v208HeaderInner">${navigation}</div></header><main id="main" tabindex="-1">${main}</main>${foot}<script type="module" src="/v208-shared.js"></script>${script?`<script type="module" src="/${script}"></script>`:''}</body></html>`;
  return content;
}
function writeAt(out,route,html){const dir=route?join(out,route):out;mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'index.html'),html)}
const projectLink=id=>`/projects/${id}/`;
const roleForProject=id=>id==='earthbridge'?'ml':(['newssources','mulyankan','sentinel'].includes(id)?'software':'fullstack');
function assetsFor(p,manifest){const prefix=imagePrefix[slug(p.title)];return Object.entries(manifest).filter(([name,v])=>prefix&&name.startsWith(prefix)&&/^\/evidence\/[a-z-]+\.webp$/.test(v?.path||''))}
function projectCard(p){
  const id=slug(p.title);
  const cover=p.evidenceImage
    ? `<img src="${safe(p.evidenceImage)}" decoding="async" alt="${e(p.evidenceImageCaption)}" width="720" height="460">`
    : '<span class="v208ImageEmpty">Technical record</span>';
  return `<article class="v208ProjectCard" data-v208-project-filters="${e(p.filters.join(' '))}" data-v208-accent="${e(p.accent)}"${id==='mulyankan'?' data-v208-featured':''}>
    <a class="v208CardLink" href="${projectLink(id)}" aria-labelledby="card-${id} action-${id}" data-v208-pointer>
      <div class="v208CardCover">${cover}</div>
      <div class="v208CardBody">
        <span class="v208Status">${e(p.status)}</span>
        <h2 id="card-${id}">${e(p.title)}</h2>
        <p>${e(p.summary)}</p>
        <span class="v208CardStack">${e(p.stack.join(' · '))}</span>
        <span class="v208CardAction" id="action-${id}">Read case study <span aria-hidden="true">↗</span></span>
      </div>
    </a>
  </article>`;
}
const actionLinks=p=>`<div class="v208ActionLinks">${p.links.filter(x=>safe(x.url)!=='#').map(x=>`<a href="${safe(x.url)}" rel="noopener noreferrer" target="_blank">${e(x.label)} ↗</a>`).join('')}</div>`;
function picture(p){return p.evidenceImage?`<figure class="v208EvidencePhoto"><img loading="lazy" width="800" height="480" src="${safe(p.evidenceImage)}" alt="${e(p.evidenceImageCaption||'Saved project interface')}"><figcaption>${e(p.evidenceImageCaption||'Recorded project screenshot')}</figcaption></figure>`:'<div class="v208EmptyEvidence">No documented public screenshot for this project.</div>'}
function specializations(){
  return `<section class="v208TrackShowcase" id="focus" aria-labelledby="focus-heading">
    <h2 id="focus-heading">Explore by specialization</h2>
    <div class="v208TrackTabs" role="tablist" aria-label="Specializations" hidden>
      ${roles.map((role,index)=>`<button type="button" role="tab" id="track-tab-${role.id}" aria-controls="track-${role.id}" aria-selected="${index===0}" tabindex="${index===0?0:-1}">${e(role.name)}</button>`).join('')}
    </div>
    ${roles.map((role,index)=>{
      const project=routes[role.first];
      const caseHref=projectLink(role.first);
      const evidenceHref=role.capture?evidenceLink(caseHref,role.capture):caseHref+role.evidenceAnchor;
      const explorerHref=`/work/?view=${role.id}&project=${role.first}&panel=${role.panel}#v20-workspace`;
      return `<article class="v208TrackPanel" id="track-${role.id}" role="tabpanel" aria-labelledby="track-tab-${role.id}" tabindex="0" data-v208-pointer${index?' hidden':''}>
        <div class="v208TrackCopy">
          <span class="v208Status">${e(project.status)}</span>
          <h3><a href="${caseHref}">${e(project.title)}</a></h3>
          <p>${e(project.summary)}</p>
          <div class="v208TrackActions">
            <a class="v208Primary" href="${e(evidenceHref)}">${e(role.evidenceLabel)} <span aria-hidden="true">↗</span></a>
            <a class="v208TextAction" href="${e(explorerHref)}" aria-label="Explore more ${e(role.name)} projects">More in this track <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        ${picture(project)}
      </article>`;
    }).join('')}
    <noscript>
      <ul>${roles.map(role=>`<li><a href="${projectLink(role.first)}">${e(role.name)} · ${e(routes[role.first].title)}</a></li>`).join('')}</ul>
    </noscript>
  </section>`;
}
function projectPage(p,manifest){
  const id=slug(p.title);
  const nextProject=projects[projects.indexOf(p)+1];
  const images=assetsFor(p,manifest);
  const stages=V20_FLOWS[id]||[];
  const first=images[0]?.[1];
  const study=p.caseStudy;
  const gallery=first?`<div class="v208ProjectGallery" id="v208CaptureGallery">
    <div class="v208ProjectFigure"><figure>
      <div class="v208ImageCanvas">
        <img id="v208ActiveImage" width="${Number(first.width)||1200}" height="${Number(first.height)||760}" src="${safe(first.path)}" alt="${e(first.caption||p.title)}" loading="lazy">
        <div id="v208Markers" class="v208Markers" aria-label="Saved screenshot annotations"></div>
      </div>
      <figcaption>
        <span id="v208Caption">${e(first.caption||p.title)}</span>
        <a id="v208FullCapture" href="${safe(first.path)}" target="_blank" rel="noopener noreferrer">View full-size screenshot ↗</a>
      </figcaption>
    </figure></div>
    <div class="v208Thumbs" role="group" aria-label="Choose recorded project capture">
      ${images.map(([key,capture],i)=>`<button type="button" data-v208-capture="${e(key)}" data-v208-src="${safe(capture.path)}" data-v208-caption="${e(capture.caption||key)}" data-v208-width="${Number(capture.width)||1200}" data-v208-height="${Number(capture.height)||760}" aria-pressed="${i===0}"><img src="${safe(capture.path)}" alt="" loading="lazy"><span>${e(capture.caption||key)}</span></button>`).join('')}
    </div>
    <div class="v208AnnotationDetail" id="v208AnnotationDetail" role="status" aria-live="polite"><p>Choose a numbered feature to see its evidence and context.</p></div>
  </div>`:picture(p);
  const flow=stages.length?`<ol class="v208Flow">${stages.map(([name,detail],i)=>`<li id="architecture-step-${i}"><small>STEP ${String(i+1).padStart(2,'0')}</small><h3>${e(name)}</h3><p>${e(detail)}</p></li>`).join('')}</ol>`:'<p>See the project source for its architecture documentation.</p>';
  return `<section class="v208Container v208PageIntro v208CaseIntro" id="overview">
    <nav class="v208Breadcrumb" aria-label="Breadcrumb"><a href="/work/">← All projects</a><span aria-hidden="true">/</span><span aria-current="page">${e(p.title)}</span></nav>
    <div class="v208CaseHero">
      <div>
        <span class="v208Status">${e(p.status)}</span>
        <h1>${e(p.title)}</h1>
        <p>${e(p.summary)}</p>
        <div class="v208TagRow">${p.stack.map(t=>`<span>${e(t)}</span>`).join('')}</div>
        <nav class="v208ActionLinks v208CaseJump" aria-label="Jump to project evidence">
          <a class="v208Primary" href="#captures">Screens</a>
          <a href="#architecture">Architecture</a>
          <a href="#verification">Verification</a>
        </nav>
      </div>
      ${p.evidenceImage?picture(p):''}
    </div>
    <dl class="v208CaseFacts">
      <div><dt>Problem</dt><dd>${e(study.problem)}</dd></div>
      <div><dt>${study.contribution?'My contribution':'Implementation'}</dt><dd>${e(study.contribution||study.approach)}</dd></div>
      <div><dt>Verification</dt><dd>${e(study.verificationSummary||study.verification)} <a href="#verification">Read the evidence</a></dd></div>
    </dl>
  </section>
  <div class="v208Container v208SectionNav" role="navigation" aria-label="Project sections">
    <a href="#overview">Overview</a><a href="#captures">Screens</a><a href="#architecture">Architecture</a><a href="#verification">Verification</a>
  </div>
  <section class="v208Container v208Section" id="captures">
    <h2>Project screens</h2>
    <p class="v208Boundary">Saved captures of the project interface.</p>
    ${gallery}
    <div id="v211-evidence-trail" class="v211EvidenceTrail" data-v211-project="${id}"><p>Technical evidence links load in the browser. Verification and limitations are available below.</p></div>
  </section>
  <section class="v208Container v208Section" id="architecture">
    <h2>Architecture</h2>
    <p>${e(study.approach)}</p>
    ${flow}
  </section>
  <section class="v208Container v208Section" id="verification">
    <h2>Verification and limits</h2>
    <div class="v208TwoCol"><div><h3>Documented evidence</h3><p>${e(study.verification)}</p></div><div><h3>Limits</h3><p>${e(study.caveat)}</p></div></div>
    ${actionLinks(p)}
    <div class="v208ActionLinks">
      <a href="/evidence/#project-${id}">See evidence index ↗</a>
      <a href="/work/?view=${roleForProject(id)}&amp;project=${id}&amp;panel=media#v20-workspace">Open interactive explorer ↗</a>
    </div>
  </section>
  <nav class="v208Container v208ProjectNav" aria-label="Project navigation">
    <a href="/work/">← All projects</a>
    ${nextProject?`<a class="v208NextProject" href="${projectLink(slug(nextProject.title))}"><span>Next project</span><strong>${e(nextProject.title)} ↗</strong></a>`:''}
  </nav>`;
}
export function buildV208(out,root){
  const original=readFileSync(join(out,'index.html'),'utf8');
  if(!original.includes('src="/site.js"'))throw new Error('V20.8 requires the freshly built original portfolio HTML before generating pages');
  const manifest=JSON.parse(readFileSync(join(root,'public','evidence','manifest.json'),'utf8'));
  // Keep a complete, operational V20.6-era fallback during migration.
  writeAt(out,'legacy',replaceRobots(original,'noindex,follow'));
  const projectGrid=`<div class="v208CardGrid">${projects.map(projectCard).join('')}</div>`;
  const explorerLink='/work/?view=fullstack#v20-workspace';
  const workMarkup=`<section class="v208Container v208WorkGallery" id="work-gallery">
    <div class="v208WorkHeading">
      <div>
        <h1>Projects</h1>
        <p>Six projects across software, data systems, and applied ML.</p>
      </div>
    </div>
    <div class="v208GalleryToolbar" hidden>
      <div class="v208GalleryFilters" role="group" aria-label="Filter projects">
        ${galleryFilters.map(([key,label])=>`<button type="button" data-v208-gallery-filter="${key}" aria-pressed="${key==='all'}">${e(label)}</button>`).join('')}
      </div>
      <p class="v208GalleryCount srOnly" role="status">${projects.length} projects</p>
    </div>
    ${projectGrid}
    <div class="v208GalleryMore"><a class="v208ExplorerLink" href="${explorerLink}">Open interactive explorer <span aria-hidden="true">↗</span></a></div>
  </section>`;
  writeAt(out,'work',page('WorkPage','Projects | Inside the Builder\'s Mind','Six software, data systems and applied machine learning projects with screenshots and case studies.',workMarkup,'v208-work.js','https://inside-the-builders-mind.vercel.app/work/'));
  const spotlightAssets=new Map(assetsFor(routes.mulyankan,manifest));
  const featuredCaptures=spotlightScreens.filter(([id])=>spotlightAssets.has(id)).map(([id,label])=>({
    ...spotlightAssets.get(id),id,label,href:evidenceLink(projectLink('mulyankan'),id)
  }));
  const homeHero=recruiterIntroMarkup(profile,{featuredCaptures,focusMarkup:specializations()})
    .replaceAll('href="#v20-workspace"','href="/work/"')
    .replaceAll('href="#case-mulyankan"','href="/projects/mulyankan/"');
  const home=`${homeHero}<section class="v208Container v208Section" id="about"><h2>How I work</h2><p>${e(profile.philosophy)}</p><a class="v208TextAction" href="/lab/">Try the interactive demonstrations ↗</a></section>`;
  const homeHtml=page('Home',`${profile.name} | Software, Systems & Applied ML`,profile.intro,home,'v208-home.js','https://inside-the-builders-mind.vercel.app/');
  const personSchema=JSON.stringify({'@context':'https://schema.org','@type':'Person',name:profile.name,description:profile.intro,url:'https://inside-the-builders-mind.vercel.app/',sameAs:[profile.github,profile.linkedin]});
  writeAt(out,'',homeHtml.replace('</head>',`<script type="application/ld+json">${personSchema}</script></head>`));
  const catalog=`<section class="v208Container v208WorkGallery"><div class="v208WorkHeading">
    <div><h1>Project directory</h1><p>Six projects with implementation notes, sources, and verification.</p></div>
    <a class="v208TextAction" href="${explorerLink}">Open interactive explorer ↗</a>
  </div>${projectGrid}</section>`;
  writeAt(out,'projects',page('Projects','Projects | Inside the Builder\'s Mind','Six source-backed software, data and research project records.',catalog,null,'https://inside-the-builders-mind.vercel.app/projects/'));
  const index=`<section class="v208Container v208PageIntro"><h1>Technical evidence</h1><p>Project sources, documented results, and known limits. Screenshots show the interface at the time of capture.</p></section><section class="v208Container v208Section" id="captures">${projects.map(p=>{const id=slug(p.title);return `<article class="v208EvidenceRecord" id="project-${id}"><div>${picture(p)}</div><div><span class="v208Status">${e(p.status)}</span><h2>${e(p.title)}</h2><h3>Documented verification</h3><p>${e(p.caseStudy.verification)}</p><h3>Known limitations</h3><p>${e(p.caseStudy.caveat)}</p>${actionLinks(p)}<a class="v208ReadMore" href="${projectLink(id)}#verification">Read full technical record ↗</a></div></article>`}).join('')}</section>`;
  writeAt(out,'evidence',page('Evidence','Technical Evidence | Inside the Builder\'s Mind','Verification and limitations for six documented project records.',index,null,'https://inside-the-builders-mind.vercel.app/evidence/'));
  const lab=`<section class="v208Container v208PageIntro">
    <h1>Interactive demos</h1>
    <p>Try three browser-based demos using fictional records and synthetic vectors.</p>
    <nav class="v208LabJump" aria-label="Lab demonstrations">
      <a class="v208TextAction" href="#review">Evidence review</a>
      <a class="v208TextAction" href="#trace">Article ingestion</a>
      <a class="v208TextAction" href="#retrieval">Vector retrieval</a>
    </nav>
  </section>
  <section class="v208Container v208Section" id="review">
    <h2>Evidence Workbench</h2>
    <p>Review fictional documents, resolve discrepancies, and export a local review note.</p>
    <div id="workbenchApp" class="workbenchApp" aria-label="Interactive evidence review workbench"></div>
  </section>
  <section class="v208Container v208Section" id="trace">
    <h2>Source-to-record trace</h2>
    <p>Follow a fictional article through discovery, normalization, deduplication, and storage.</p>
    <div class="v208LocalDemo" id="v208TraceDemo"><div class="v208DemoActions" role="group" aria-label="Trace stages"></div><div class="v208DemoDetail" role="status" aria-live="polite"></div></div>
  </section>
  <section class="v208Container v208Section" id="retrieval">
    <h2>Cross-modal vector retrieval</h2>
    <p>Change the query and weighting to see how synthetic three-dimensional vectors rank.</p>
    <div class="v208LocalDemo" id="v208ToyDemo"><label for="v208Query">Illustrative sensor query</label><select id="v208Query"><option value="optical">Optical-like</option><option value="sar">SAR-like</option><option value="multispectral">Multispectral-like</option></select><label for="v208Weight">Spectral weighting <output id="v208WeightValue">50%</output></label><input type="range" id="v208Weight" min="0" max="100" value="50" step="10"><ol id="v208Rankings" aria-live="polite"></ol></div>
  </section>
  <section class="v208Container v208Section">
    <h2>Demo archive</h2>
    <a class="v208TextAction" href="/legacy/#interactive-lab">Open original interactive demonstrations ↗</a>
  </section>`;
  writeAt(out,'lab',page('Lab','Interactive Demos | Inside the Builder\'s Mind','Functional local evidence review, fictional ingestion and toy retrieval demonstrations.',lab,'v208-lab.js','https://inside-the-builders-mind.vercel.app/lab/'));
  for(const p of projects){const id=slug(p.title);writeAt(out,`projects/${id}`,page('Project',`${p.title} — Technical Case Study | Inside the Builder\'s Mind`,p.description,projectPage(p,manifest),'v208-project.js',`https://inside-the-builders-mind.vercel.app/projects/${id}/`));}
  const sitemap=[
    'https://inside-the-builders-mind.vercel.app/',
    ...['work/','projects/','evidence/','lab/'].map(p=>'https://inside-the-builders-mind.vercel.app/'+p),
    ...projects.map(p=>'https://inside-the-builders-mind.vercel.app/projects/'+slug(p.title)+'/'),
    ...['fullstack','software','ml'].map(p=>'https://inside-the-builders-mind.vercel.app/share/'+p+'/')
  ];
  writeFileSync(join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+sitemap.map(url=>'  <url><loc>'+e(url)+'</loc></url>').join('\n')+'\n</urlset>\n');
  console.log(`Built V20.8 pages: Home, Work, Projects, Evidence, Lab, Legacy and ${projects.length} project dossiers.`);
}
