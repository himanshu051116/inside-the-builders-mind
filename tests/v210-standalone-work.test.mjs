import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const source=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');

// For the full repository, validate the generated static Work page as well.
test('V21.0 Work source has one role-aware application owner and no legacy site initializer',()=>{
  const builder=source('scripts/build-v208.mjs');
  const work=source('v208-work.js');
  const engine=source('v20-workspace.js');
  assert.match(builder,/writeAt\(out,'work',page\('WorkPage'/);
  assert.doesNotMatch(builder,/const work=replaceRobots\(original,robotPolicy\)/);
  assert.match(work,/setupV20Workspace\(projectRecords,document,window,\{standalone:true\}\)/);
  assert.doesNotMatch(work,/import .*site\.js/);
  for(const s of ['setupV203Experience','setupV204Evidence','setupV205Annotations'])assert.ok(work.includes(s),s);
  assert.match(engine,/const standalone=config\.standalone===true/);
  assert.match(engine,/if\(standalone\)main\.append\(workspace\)/);
  assert.match(engine,/if\(!standalone\)\{/);
  assert.match(engine,/if\(standalone\|\|!body\|\|!archive\|\|!hash\)return false/);
});

test('three role modes, unique project pathways and matching résumé PDFs stay present',()=>{
  const engine=source('v20-workspace.js');
  const work=source('v208-work.js');
  for(const role of ['fullstack','software','ml']){
    assert.ok(engine.includes('"'+role+'"'),role);
    assert.ok(engine.includes('/resumes/Himanshu_Shukla_'+role+'_Public.pdf'),role);
    assert.ok(work.includes("./v20-workspace.js"));
  }
  for(const id of ['our-hidden-universe','mulyankan','newssources','earthbridge','sentinel','schoolbuddies'])assert.ok(engine.includes(id),id);
  assert.match(engine,/\/projects\/\$\{p\.id\}\/\#verification/);
  assert.match(engine,/\/legacy\/\?view=\$\{role\}#top/);
});

test('saved media, evidence, full original experience and existing share links remain available',()=>{
  const builder=source('scripts/build-v208.mjs');
  const work=source('v208-work.js');
  const old=source('site.js');
  assert.match(builder,/writeAt\(out,'legacy',replaceRobots\(original,'noindex,follow'\)\)/);
  assert.match(builder,/\[\s*'work\/'/);
  assert.match(old,/setupV20Workspace\(projects\)/);
  assert.match(work,/v209SecondaryNav/);
  assert.match(work,/related\.append\(projects,evidence\)/);
  assert.match(work,/oldCases\[oldHash\]/);
  assert.match(work,/hasSelection/);
  assert.match(work,/setupV204Evidence/);
  assert.match(work,/setupV205Annotations/);
  const original=source('v19-milestone-video.js');
  for(const clip of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4'])assert.ok(original.includes(clip));
});

test('generated route contains accessible standalone app and still indexes all six dossiers',()=>{
  if(!existsSync(new URL('../dist/work/index.html',import.meta.url)))return;
  const work=source('dist/work/index.html');
  assert.match(work,/class="v208Page v208WorkPage"/);
  assert.match(work,/src="\/v208-work.js"/);
  assert.doesNotMatch(work,/src="\/site.js"/);
  assert.doesNotMatch(work,/<section[^>]*id="home"/);
  assert.match(work,/<main id="main"/);
  const home=source('dist/index.html');
  assert.match(home,/src="\/v208-home.js"/);
  for(const id of ['our-hidden-universe','mulyankan','newssources','earthbridge','sentinel','schoolbuddies'])assert.ok(existsSync(new URL('../dist/projects/'+id+'/index.html',import.meta.url)),id);
});
