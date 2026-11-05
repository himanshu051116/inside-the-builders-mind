import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {projects} from '../content.js';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const page=path=>read('dist/'+path+'index.html');
const slug=x=>String(x).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

test('real route-specific HTML exists for all five destinations and source legacy',()=>{
  for(const path of ['','work/','projects/','evidence/','lab/','legacy/'])assert.ok(existsSync(new URL('dist/'+path+'index.html',root)),path);
  assert.match(page(''),/src="\/v208-home.js"/);
  assert.doesNotMatch(page(''),/src="\/site.js"/);
  assert.match(page('work/'),/src="\/site.js"/);
  assert.match(page('work/'),/src="\/v208-work.js"/);
  assert.match(page('legacy/'),/src="\/site.js"/);
});
test('home retains original recruiter text, three resumes and actual video integration',()=>{
  const html=page(''),script=read('v208-home.js');
  for(const part of ['id="home"','v17Proof','LEADERSHIP','AWARDS','/work/','/projects/our-hidden-universe/'])assert.ok(html.includes(part),part);
  for(const role of ['fullstack','software','ml'])assert.ok(html.includes('Himanshu_Shukla_'+role+'_Public.pdf'));
  assert.match(script,/setupMilestoneVideo/);
  assert.match(html,/v208RoleGrid/);
  assert.doesNotMatch(html,/id="selected-work"/); // No duplicate of the original hero's project rail.
  for(const asset of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4'])assert.ok(existsSync(new URL('public/video/'+asset,root)));
});
test('six canonical project dossiers are generated from the same content records',()=>{
  assert.equal(projects.length,6);
  for(const p of projects){
    const id=slug(p.title),html=page('projects/'+id+'/');
    for(const token of [p.title,p.status,'id="architecture"','id="verification"','id="captures"','data-page']){
      if(token==='data-page')continue;
      assert.ok(html.includes(token),id+' missing '+token);
    }
    assert.match(html,/v208-project.js/);
    const role=id==='earthbridge'?'ml':(['newssources','mulyankan','sentinel'].includes(id)?'software':'fullstack');
    assert.ok(html.includes('/work/?view='+role+'&project='+id+'&panel=media'),id+' role route');
    assert.ok(html.includes('https://inside-the-builders-mind.vercel.app/projects/'+id+'/'));
    assert.ok(html.includes(p.caseStudy.caveat.replaceAll('&','&amp;').replaceAll('<','&lt;')));
  }
});
test('technical evidence lists all six projects with their limits',()=>{
  const html=page('evidence/');
  for(const p of projects)for(const token of [p.title,p.status,p.caseStudy.verification.slice(0,18)])assert.ok(html.includes(token),p.title+' '+token);
  assert.match(html,/Captured interfaces are not live executions/);
});
test('the separate Lab retains genuine local workbench and explicit toy boundaries',()=>{
  const html=page('lab/'),js=read('v208-lab.js');
  assert.match(html,/id="workbenchApp"/);
  assert.match(html,/id="v208TraceDemo"/);
  assert.match(html,/id="v208ToyDemo"/);
  assert.match(html,/original interactive demonstrations/i);
  assert.match(js,/setupEvidenceWorkbench\(\)/);
  assert.match(js,/rankToyNeighbors/);
  assert.match(js,/TRACE_STEPS/);
});
test('sitemap contains unique routes and preserves role-specific share URLs',()=>{
  const xml=read('dist/sitemap.xml');
  const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
  assert.equal(urls.length,14);
  assert.equal(new Set(urls).size,urls.length);
  for(const path of ['work/','projects/','evidence/','lab/','projects/mulyankan/','share/ml/'])assert.ok(xml.includes('https://inside-the-builders-mind.vercel.app/'+path));
});
test('existing deep links migrate to Work without losing query, panel or hash',()=>{
  const home=read('v208-home.js'),work=read('v208-work.js');
  assert.match(home,/\['view','project','panel'\]/);
  assert.match(home,/window.location.replace\('\/work\/'\+u.search\+u.hash\)/);
  assert.match(work,/main-nav/);
  assert.match(read('scripts/build.mjs'),/buildV208\(out,root\)/);
});


test('all generated dossier pages have unique HTML IDs and unambiguous screenshot anchors',()=>{
  for(const p of projects){
    const id=slug(p.title),html=page('projects/'+id+'/');
    const ids=[...html.matchAll(/\bid="([a-zA-Z0-9_-]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,'duplicate IDs on '+id);
    assert.equal(ids.filter(x=>x==='captures').length,1,id);
    assert.equal(ids.filter(x=>x==='v208CaptureGallery').length<=1,true,id);
  }
});

test('HTML includes real screenshot dimensions and fallback handler',()=>{
  const html=page('projects/mulyankan/');
  assert.match(html,/data-v208-width="[0-9]+"/);
  assert.match(html,/data-v208-height="[0-9]+"/);
  assert.match(html,/v208-shared.js/);
  const project=read('v208-project.js'),shared=read('v208-shared.js');
  assert.match(project,/img\.width=Number\(b\.dataset\.v208Width\)/);
  assert.match(project,/img\.height=Number\(b\.dataset\.v208Height\)/);
  assert.match(shared,/v208MissingAsset/);
});

test('legacy and generated route SEO policies avoid duplicate indexing',()=>{
  assert.match(page('legacy/'),/name="robots" content="noindex,follow"/);
  assert.match(page('work/'),/canonical" href="https:\/\/inside-the-builders-mind\.vercel\.app\/work\/"/);
  assert.match(page('work/'),/property="og:url" content="https:\/\/inside-the-builders-mind\.vercel\.app\/work\/"/);
  assert.match(read('scripts/build-v208.mjs'),/VERCEL_ENV==='preview'/);
});

test('local preview server supports range-based MP4 playback and extensionless route paths',()=>{
  const dev=read('scripts/dev.mjs');
  for(const token of ["'.mp4':'video/mp4'", "'.webp':'image/webp'", "'Content-Range'", "'Accept-Ranges'", 'res.writeHead(206', "name.endsWith('/')||!extname(name)"])
    assert.ok(dev.includes(token),token);
});


test('new static pages preserve the original DM Sans and Space Grotesk typography',()=>{
 const html=page('');
 assert.match(html,/fonts\.googleapis\.com/);
 assert.match(html,/DM\+Sans/);
 assert.match(html,/Space\+Grotesk/);
});
