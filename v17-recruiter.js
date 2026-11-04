/**
 * Recruiter-first overview, before the three V16 engineering specializations.
 * Facts are based on the portfolio owner's supplied CV and project records;
 * no invented employment, CGPA, certifications, metrics or endorsements.
 */
export const recruiterFacts = Object.freeze({
  education: Object.freeze({degree:'B.Tech · Mathematics & Computing',institution:'Madhav Institute of Technology & Science (MITS), Gwalior',graduation:'2028',year:'Third year'}),
  interests: ['Software engineering', 'Data & backend systems', 'Applied ML research'],
  spotlight: Object.freeze({project:'Mulyankan',label:'Project demonstration',institution:'CMPDI Headquarters, Ranchi',date:'11 July 2026',detail:'Rubric-level document review with linked evidence and human decisions.'}),
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

export function recruiterIntroMarkup(profile={}) {
  const f=recruiterFacts;
  const name=escapeText(profile.name || 'Himanshu Shukla');
  const git=safeHref(profile.github || 'https://github.com/himanshu051116');
  const linkedin=safeHref(profile.linkedin || 'https://www.linkedin.com/in/himanshu-shukla-88175637a');
  const email=safeHref(profile.email ? 'mailto:'+profile.email : 'mailto:himanshusubh1510@gmail.com');
  return `<section class="v17Recruiter" id="home" aria-labelledby="v17Name">
    <div class="v17Wrap">
      <div class="v17TopLine"><span class="v17Index">01 / CANDIDATE PROFILE</span><span class="v17Availability"><i aria-hidden="true"></i> ${escapeText(f.stage)}</span></div>
      <div class="v17LeadGrid">
        <div class="v17LeadCopy">
          <p class="v17Overline">SOFTWARE ENGINEERING <span aria-hidden="true">/</span> DATA SYSTEMS <span aria-hidden="true">/</span> APPLIED ML</p>
          <h1 id="v17Name">${name}<span class="v17Period" aria-hidden="true">.</span></h1>
          <p class="v17Degree">${escapeText(f.education.degree)} <span class="v17Dot" aria-hidden="true">·</span> ${escapeText(f.education.institution)}</p>
          <p class="v17Graduation">${escapeText(f.education.year)} <span aria-hidden="true">/</span> Expected graduation ${escapeText(f.education.graduation)} <span aria-hidden="true">/</span> Gwalior, India</p>
          <p class="v17LeadStatement">Selected work: Our Hidden Universe (React/Firebase), NewsSources (Python/PostgreSQL), and EarthBridge (PyTorch/FAISS). Each project links to source code and documented limitations.</p>
          <div class="v17PrimaryLinks"><a class="v17MainCTA" href="#top">Explore my projects <span aria-hidden="true">↗</span></a><details class="v17ResumeSelect"><summary>Download résumé <span aria-hidden="true">↓</span></summary><div class="v17ResumeChoices"><a href="/resumes/Himanshu_Shukla_fullstack_Public.pdf" download>Full-Stack</a><a href="/resumes/Himanshu_Shukla_software_Public.pdf" download>Software Systems</a><a href="/resumes/Himanshu_Shukla_ml_Public.pdf" download>Applied ML</a></div></details></div>
          <nav class="v17Socials" aria-label="Professional profile links"><a href="${git}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${email}">Email ↗</a></nav>
        </div>
        <aside class="v17Proof" aria-labelledby="v17ProofTitle">
          <div class="v17ProofHeader"><span>SELECTED ENGINEERING MILESTONE</span><span>2026 / 01</span></div>
          <div class="v17ProofBody"><span class="v17ProofProject">${escapeText(f.spotlight.project)} <span aria-hidden="true">↗</span></span><h2 id="v17ProofTitle">Document evaluation<br>with evidence trails.</h2><p>${escapeText(f.spotlight.detail)}</p>
          <div class="v17ProofMeta"><div><span>DEMONSTRATED AT</span><strong>${escapeText(f.spotlight.institution)}</strong></div><div><span>DATE</span><strong>${escapeText(f.spotlight.date)}</strong></div></div>
          <a class="v17ProofLink" href="#case-mulyankan">Open the technical case study <span aria-hidden="true">↗</span></a></div>
        </aside>
      </div>
      <div class="v17Essentials" aria-label="Leadership, recognition and technical skills">
        <section class="v17Essential"><div class="v17EssentialHeading"><span>02 / LEADERSHIP</span><span aria-hidden="true">↗</span></div><ul class="v17FactList">${f.leadership.map(x=>`<li>${escapeText(x)}</li>`).join('')}</ul></section>
        <section class="v17Essential"><div class="v17EssentialHeading"><span>03 / RECOGNITION</span><span aria-hidden="true">↗</span></div><ul class="v17FactList">${f.recognitions.map(x=>`<li>${escapeText(x)}</li>`).join('')}</ul></section>
        <section class="v17Essential v17EssentialStack"><div class="v17EssentialHeading"><span>04 / TECHNICAL STACK</span><span aria-hidden="true">↗</span></div><div class="v17SkillTokens" aria-label="Technologies">${f.skills.map(x=>`<span>${escapeText(x)}</span>`).join('')}</div></section>
      </div>
      <div class="v17GoDeeper"><span>THREE FOCUSES · ONE ENGINEERING PORTFOLIO</span><a href="#top">Choose a specialization <span aria-hidden="true">↓</span></a></div>
    </div>
  </section>`;
}