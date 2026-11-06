/**
 * Recruiter-first overview, before the three V16 engineering specializations.
 * Facts are based on the portfolio owner's supplied CV and project records;
 * no invented employment, CGPA, certifications, metrics or endorsements.
 */
export const recruiterFacts = Object.freeze({
  education: Object.freeze({degree:'B.Tech · Mathematics & Computing',institution:'Madhav Institute of Technology & Science (MITS), Gwalior',graduation:'2028',year:'Third year'}),
  interests: ['Software engineering', 'Data & backend systems', 'Applied ML research'],
  spotlight: Object.freeze({project:'Mulyankan',label:'Project demonstration',institution:'CMPDI Headquarters, Ranchi',date:'11 July 2026',detail:'Rubric criteria link to document evidence; missing material is flagged for human review.'}),
  leadership: Object.freeze([
    'Class Representative · Mathematics & Computing',
    'Secretary · Hindi Samiti',
    'Content Head & Treasurer · SCRS',
    'Co-founder · SchoolBuddies'
  ]),
  recognitions: Object.freeze([
    'Neeti Summit · English Debate winner',
    'Tark Yudh · Hindi Debate winner twice',
    'Two Model United Nations awards',
    'VBYLD 2026 finalist'
  ]),
  skills: ['Python','TypeScript','React','FastAPI','PostgreSQL','PyTorch','Docker','Git'],
  stage: 'Third-year undergraduate · Seeking internships'
})

function escapeText(value) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}
function safeHref(value) {
  const url=String(value??'');
  return /^(https:\/\/[^\s"<>]+|mailto:[^\s"<>]+)$/.test(url) ? escapeText(url) : '#contact';
}

function spotlightMarkup(captures){
  if(!captures.length)return '';
  const choices=captures.length>1?`<div class="v208SpotlightChoices" role="group" aria-label="Saved Mulyankan screens" hidden>
    ${captures.map(({id,label},i)=>`<button type="button" aria-pressed="${i===0}" aria-controls="spotlight-${escapeText(id)}">${escapeText(label)}</button>`).join('')}
  </div>`:'';
  return `<div class="v208SpotlightCapture">
    ${choices}
    ${choices?'<p class="v208SpotlightStatus" role="status"></p>':''}
    ${captures.map(({id,path,caption,width,height,href},i)=>`<figure id="spotlight-${escapeText(id)}"${i?' hidden':''}>
      <div class="v208ScreenFrame">
        <div class="v208ScreenBar"><span aria-hidden="true"></span>Saved capture</div>
        <img src="${escapeText(path)}" alt="${escapeText(caption)}" width="${Number(width)||720}" height="${Number(height)||460}" loading="${i?'lazy':'eager'}" decoding="async">
      </div>
      <figcaption><span>${escapeText(caption)}</span><a href="${escapeText(href)}">Inspect screen ↗</a></figcaption>
    </figure>`).join('')}
  </div>`;
}

export function recruiterIntroMarkup(profile={}, {featuredCaptures=[]}={}) {
  const f=recruiterFacts;
  const name=escapeText(profile.name || 'Himanshu Shukla');
  const git=safeHref(profile.github || 'https://github.com/himanshu051116');
  const linkedin=safeHref(profile.linkedin || 'https://www.linkedin.com/in/himanshu-shukla-88175637a');
  const email=safeHref(profile.email ? 'mailto:'+profile.email : 'mailto:himanshusubh1510@gmail.com');
  const featuredProject=featuredCaptures.length>0;
  const statement='<p class="v17LeadStatement">I build React interfaces, Python data services, and PyTorch retrieval prototypes.</p>';
  return `<section class="v17Recruiter" id="home" aria-labelledby="v17Name">
    <div class="v17Wrap">
      ${featuredProject?'':`<div class="v17TopLine"><span class="v17Index">PROFILE</span><span class="v17Availability"><i aria-hidden="true"></i> ${escapeText(f.stage)}</span></div>`}
      <div class="v17LeadGrid">
        <div class="v17LeadCopy">
          ${featuredProject?'':`<p class="v17Overline">SOFTWARE <span aria-hidden="true">/</span> DATA SYSTEMS <span aria-hidden="true">/</span> MACHINE LEARNING</p>`}
          <h1 id="v17Name">${name}<span class="v17Period" aria-hidden="true">.</span></h1>
          ${featuredProject?`${statement}
            <p class="v17Degree">${escapeText(profile.education)}</p>
            <p class="v17Graduation v208Availability">Open to internships</p>`:
            `<p class="v17Degree">${escapeText(f.education.degree)} <span class="v17Dot" aria-hidden="true">·</span> ${escapeText(f.education.institution)}</p>
            <p class="v17Graduation">${escapeText(f.education.year)} <span aria-hidden="true">/</span> Expected graduation ${escapeText(f.education.graduation)} <span aria-hidden="true">/</span> Gwalior, India</p>
            ${statement}`}
          <div class="v17PrimaryLinks"><a class="v17MainCTA" href="#v20-workspace">${featuredProject?'View selected work':'Explore my projects'} <span aria-hidden="true">↗</span></a><details class="v17ResumeSelect"><summary>${featuredProject?'Résumé':'Download résumé'} <span aria-hidden="true">${featuredProject?'▾':'↓'}</span></summary><div class="v17ResumeChoices"><a href="/resumes/Himanshu_Shukla_fullstack_Public.pdf" download>Full-Stack</a><a href="/resumes/Himanshu_Shukla_software_Public.pdf" download>Software Systems</a><a href="/resumes/Himanshu_Shukla_ml_Public.pdf" download>Applied ML</a></div></details></div>
          <nav class="v17Socials" aria-label="Professional profile links"><a href="${git}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${email}">Email ↗</a></nav>
          <nav class="v19ProjectRail" aria-label="Jump to documented engineering projects">
            <span class="v19ProjectRailLabel">SELECTED PROJECTS</span>
            <a href="#case-ohs" data-v20-open-project="our-hidden-universe"><span class="v19ProjectIndex">01</span><span class="v19ProjectDetails"><strong>Our Hidden Universe</strong><small>${featuredProject?'Private rooms for chat, calls, and shared playback':'Product interface · React / Firebase'}</small></span><span class="v19ProjectArrow" aria-hidden="true">↗</span></a>
            <a href="#case-news" data-v20-open-project="newssources"><span class="v19ProjectIndex">02</span><span class="v19ProjectDetails"><strong>NewsSources</strong><small>${featuredProject?'Trace articles back to their sources':'Data pipeline · Python / PostgreSQL'}</small></span><span class="v19ProjectArrow" aria-hidden="true">↗</span></a>
            <a href="#case-earthbridge" data-v20-open-project="earthbridge"><span class="v19ProjectIndex">03</span><span class="v19ProjectDetails"><strong>EarthBridge</strong><small>${featuredProject?'Search satellite imagery across sensors':'Research prototype · PyTorch / FAISS'}</small></span><span class="v19ProjectArrow" aria-hidden="true">↗</span></a>
          </nav>
        </div>
        <aside class="v17Proof" aria-labelledby="v17ProofTitle">
          <div class="v17ProofHeader"><span>${featuredProject?'Featured project':'PROJECT DEMO'}</span><span>${featuredProject?'Demonstrated prototype':'2026'}</span></div>
          <div class="v17ProofBody"><span class="v17ProofProject">${escapeText(f.spotlight.project)}</span><h2 id="v17ProofTitle">${featuredProject?'Evidence-linked proposal review':'Document review<br>with cited evidence.'}</h2><p>${escapeText(f.spotlight.detail)}</p>
          ${spotlightMarkup(featuredCaptures)}
          <div class="v17ProofMeta"><div><span>DEMONSTRATED AT</span><strong>${escapeText(f.spotlight.institution)}</strong></div><div><span>DATE</span><strong>${escapeText(f.spotlight.date)}</strong></div></div>
          <a class="v17ProofLink" href="#case-mulyankan">Mulyankan case study <span aria-hidden="true">↗</span></a></div>
        </aside>
      </div>
      <div class="v17Essentials" aria-label="Leadership, recognition and technical skills">
        <section class="v17Essential"><div class="v17EssentialHeading"><span>LEADERSHIP</span></div><ul class="v17FactList">${f.leadership.map(x=>`<li>${escapeText(x)}</li>`).join('')}</ul></section>
        <section class="v17Essential"><div class="v17EssentialHeading"><span>AWARDS</span></div><ul class="v17FactList">${f.recognitions.map(x=>`<li>${escapeText(x)}</li>`).join('')}</ul></section>
        <section class="v17Essential v17EssentialStack"><div class="v17EssentialHeading"><span>TOOLS</span></div><div class="v17SkillTokens" aria-label="Technologies">${f.skills.map(x=>`<span>${escapeText(x)}</span>`).join('')}</div></section>
      </div>
      ${featuredProject?'':`<div class="v17GoDeeper"><a href="#v20-workspace">Browse work by focus <span aria-hidden="true">↓</span></a></div>`}
    </div>
  </section>`;
}
