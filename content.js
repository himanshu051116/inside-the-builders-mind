/**
 * Portfolio content grounded in three supplied resumes (Full-Stack,
 * Software Engineering, and ML Engineering) and verified public GitHub links.
 * Do not add fabricated outcomes or claim that prototypes are production services.
 * Public-contact policy: email and public profile links included;
 * role-specific public resume PDFs exclude telephone numbers.
 */
export const profile = {
  name: 'Himanshu Shukla',
  initials: 'HS',
  role: 'Mathematics & Computing · MITS Gwalior',
  headlineA: 'I build things.',
  headlineB: 'Then prove them.',
  intro: 'Applied AI × software engineering × interactive systems. Explore the work, play with the ideas, inspect the evidence.',
  location: 'Gwalior, India',
  availability: 'Exploring software and AI research opportunities',
  github: 'https://github.com/himanshu051116',
  portfolioRepo: 'https://github.com/himanshu051116/inside-the-builders-mind',

  linkedin: 'https://www.linkedin.com/in/himanshu-shukla-88175637a',
  email: 'himanshusubh1510@gmail.com',
  resumeUrl: '', // Role-specific public PDFs are linked in the three career views.
  aboutHeading: 'I work where mathematics, software and practical problems meet.',
  about: 'I study B.Tech Mathematics & Computing at Madhav Institute of Technology & Science, Gwalior (expected graduation: 2028). I have built reviewer workflows, retrieval pipelines, collaboration apps and monitoring prototypes. I also co-founded SchoolBuddies to make hands-on technology learning more accessible to school students.',
  philosophy: 'Prototype with purpose. Measure what matters. Keep decisions inspectable.',
  education: 'B.Tech, Mathematics & Computing · MITS Gwalior · 2028',
  achievements: [
    {tag: 'FIELD DEMO / 2026', title: 'CMPDI Headquarters', text: 'Invited to demonstrate Mulyankan in Ranchi on 11 July 2026.'},
    {tag: 'RESEARCH PROTOTYPE', title: 'EarthBridge', text: 'Cross-modal retrieval prototype with source-linked final submission metrics and validation protocol; reported measurements are not independently reproduced.'},
    {tag: 'COMMUNITY', title: 'SchoolBuddies', text: 'Co-founder of a student-led school technology outreach initiative.'},
    {tag: 'LEADERSHIP', title: 'Beyond the IDE', text: 'Class Representative, NPTEL Coordinator and first place at the Neeti Summit English Debate.'}
  ]
}

// Status labels intentionally distinguish a deployed app from prototypes.
// A link is provided only when the resume contains a link or the public repo
// was individually checked; manually confirm external links before submitting.
export const projects = [
  {
    number:'01', category:'AI / HUMAN REVIEW', title:'Mulyankan',
    status:'Demonstrated prototype',
    description:'Evidence-linked document evaluation: rubric-level review, insufficient-evidence flags, evaluator workflows and human override controls. Presented at CMPDI headquarters in July 2026.',
    stack:['React','TypeScript','Supabase'],
    links:[{label:'Source & case study',url:'https://github.com/himanshu051116/Algonauts-Mulyankan'},{label:'Browser preview',url:'https://mulyankan-seven.vercel.app/'},{label:'Watch prototype walkthrough',url:'https://www.youtube.com/watch?v=sQjZfEwkTu4'}],
    accent:'lime', shape:'orbit', filters:['ai','software'],
    evidenceImage:'/evidence/mulyankan-overview.webp',
    evidenceImageCaption:'Actual Mulyankan scrutiny dashboard · provided project capture',
    caseStudy:{problem:'How can a reviewer justify a criterion-level evaluation without trusting an opaque total?',approach:'Document intake, rubric-level evidence references, insufficient-evidence flags and human reviewer controls.',verification:'Demonstrated prototype at CMPDI headquarters, Ranchi, on 11 July 2026. Public code and a recorded walkthrough are linked.',caveat:'The browser preview is not a guarantee that the full backend and evaluation workflow are running.'}
  },
  {
    number:'02', category:'ML / REMOTE SENSING', title:'EarthBridge',
    status:'Research prototype',
    description:'Cross-modal satellite-image retrieval using contrastive embeddings and FAISS across Sentinel-1 SAR and Sentinel-2 multispectral imagery. Submission-reported F1 and recall metrics are now shown with limitations and repository sources, not as an independent benchmark.',
    stack:['PyTorch','FAISS','FastAPI'],
    links:[{label:'EarthBridge source',url:'https://github.com/himanshu051116/earthbridge'},{label:'Reported evaluation details',url:'https://github.com/himanshu051116/earthbridge/blob/main/SUBMISSION_README.md'}], accent:'violet', shape:'grid', filters:['ai'],
    evidenceImage:'/evidence/earthbridge-evaluation.webp', evidenceImageCaption:'Actual EarthBridge evaluation UI · static repo-reported results, not live model inference',
    caseStudy:{problem:'How can images from optical, SAR and multispectral sensors be searched through a shared retrieval space?',approach:'Contrastive embeddings, FAISS similarity search, a FastAPI demo and image-retrieval evaluation.',verification:'The repo SUBMISSION_README.md reports cross-modal F1@5 19.53%, F1@10 11.59% and validation recall@1 53.03%, recall@10 70.08%, alongside 3,248 paired test observations and 6,496 gallery vectors. These numbers were not rerun here.',caveat:'Research prototype. Supplied workbench screenshot shows API offline; no live ranked result is shown. Repository-reported metrics have not been independently verified or re-evaluated.'}
  },
  {
    number:'03', category:'FULL-STACK / REAL-TIME', title:'Our Hidden Universe',
    status:'Deployed application',
    description:'Private-room collaboration with Firebase authentication, real-time chat, video calls, shared memories and synchronized Watch Together playback.',
    stack:['React','Firebase','Vercel'],
    links:[{label:'Live website',url:'https://ohs.vercel.app/'},{label:'Source code',url:'https://github.com/himanshu051116/our-hidden-universe'}],
    accent:'orange',shape:'waves', filters:['software'],
    evidenceImage:'/evidence/ohs-together.webp', evidenceImageCaption:'OHS Watch Together · provided project capture',
    caseStudy:{problem:'How can people share a private digital space with synchronized experiences?',approach:'Firebase-backed private rooms, real-time messaging, media sharing, video calling and Watch Together synchronization.',verification:'Public repository and a Vercel-hosted application are linked; private account features are not independently demonstrated by this portfolio.',caveat:'Live application. Some areas may require valid access and should not be treated as a public demo account.'}
  },
  {
    number:'04', category:'DATA / BACKEND', title:'NewsSources',
    status:'In development',
    description:'A news and document-ingestion system using RSS and sitemap discovery, URL deduplication, source tracking, PostgreSQL migrations and containerized services.',
    stack:['Python','PostgreSQL','Docker'],
    links:[{label:'GitHub repository',url:'https://github.com/himanshu051116/NewsSources'},{label:'Static showcase · demo data',url:'https://himanshu051116.github.io/NewsSources/'}],
    accent:'violet',shape:'grid', filters:['systems','software'],
    evidenceImage:'/evidence/news-overview.webp', evidenceImageCaption:'NewsSources command centre · provided project capture',
    caseStudy:{problem:'How can a crawler retain article provenance while avoiding duplicate ingestion?',approach:'RSS and sitemap discovery, URL deduplication, article/PDF ingestion workflows and Alembic-managed PostgreSQL schema changes.',verification:'Repository documents the development work; a separate GitHub Pages showcase illustrates the experience with simulated data.',caveat:'In development. The static showcase is not a live backend or production news ingestion service.'}
  },
  {
    number:'05', category:'SECURITY / NETWORKS', title:'Sentinel',
    status:'Locally tested prototype',
    description:'Network monitoring and filtering prototype with packet/flow views, early anomaly analysis and locally validated forward-proxy domain blocking.',
    stack:['Python','Scapy','FastAPI'],
    links:[], accent:'orange',shape:'orbit', filters:['systems'],
    caseStudy:{problem:'How can suspicious local network activity be made inspectable without overstating detection?',approach:'Python packet/flow inspection, initial anomaly-analysis views and a forward proxy with controlled domain blocking.',verification:'Local HTTP proxy blocking was tested in a development environment.',caveat:'Locally tested prototype, not a certified intrusion-prevention or production WAF service.'}
  },
  {
    number:'06', category:'EDUCATION / OUTREACH', title:'SchoolBuddies',
    status:'Co-founder · Live website',
    description:'Student-led technology outreach connecting schools with practical workshops in AI literacy, computational thinking and web development, supported by an interactive enquiry site.',
    stack:['React','JavaScript','Education'],
    links:[{label:'Public source',url:'https://github.com/himanshu051116/SCHOOLBUDDIES'},{label:'Project website · verify availability',url:'https://schoolbuddiesindia.vercel.app/'}],
    accent:'lime',shape:'waves', filters:['community','software'],
    evidenceImage:'/evidence/schoolbuddies-workshop.webp', evidenceImageCaption:'SchoolBuddies programme poster · provided project material',
    caseStudy:{problem:'How can school students experience hands-on technology rather than only hear about it?',approach:'Student-led workshop planning, AI and programming activities, school outreach and a responsive website with enquiry flow.',verification:'Co-founded the initiative and developed the web experience according to the supplied résumé.',caveat:'Outreach initiative; workshop outcomes and reach are not quantified here without supporting records.'}
  }
]

export const skillGroups = [
  {title:'Frontend & products', number:'01', skills:['React','TypeScript','JavaScript','Next.js','Tailwind CSS','Responsive UI','Vite']},
  {title:'AI & mathematical tools', number:'02', skills:['Python','PyTorch','scikit-learn','NumPy','Pandas','FAISS','Contrastive learning']},
  {title:'Systems & infrastructure', number:'03', skills:['FastAPI','REST APIs','PostgreSQL','Supabase','Firebase','Docker','pytest','Git / GitHub']}
]


// Resume-aligned secondary work. Explicit stage labels avoid promoting prototypes as live products.
export const projectArchive = [
  {
    title:'IrisTrack', focus:'Machine learning / Computer vision', status:'Experimental source · real-webcam accuracy not independently validated',
    summary:'Opt-in local face/iris tracking with blink detection, head-pose quality checks, calibration and self-tests. The public README explicitly notes that physical webcam accuracy and installer release gates remain incomplete.',
    stack:['JavaScript','MediaPipe','Electron'], lens:['ml','software'],
    link:'https://github.com/himanshu051116/IrisTrack', linkLabel:'Read source and validation limits'
  },
  {
    title:'Coal Governance', focus:'Software / GIS workflows', status:'Development prototype · repository not publicly verified',
    summary:'Prototype inspection and compliance dashboards described in the supplied Software and Full-Stack résumés, including GIS-linked records, corrective actions and migration-aware database work.',
    stack:['Next.js','PostgreSQL','MapLibre'], lens:['software','fullstack'],
    link:'',linkLabel:''
  },
  {
    title:'Mulyankan Spatial Lab', focus:'Interaction design / 3D', status:'Conceptual architecture demonstrator',
    summary:'An interactive spatial explanation of the document-evaluation pipeline, with navigation and webcam-gesture experiments. The rooms illustrate the architecture; they are not a live document-processing back end.',
    stack:['Web 3D','Interaction design','Camera gestures'],lens:['fullstack','ml'],link:'',linkLabel:''
  }
]
