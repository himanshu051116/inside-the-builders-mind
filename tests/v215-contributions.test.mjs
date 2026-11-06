import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {projects} from '../content.js';
import {V215_CONTRIBUTIONS,contributionFirst} from '../v215-contributions.js';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const slug=x=>String(x).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const manifest=JSON.parse(read('public/evidence/manifest.json'));

test('all five projects get a grounded, problem/contribution/verification summary',()=>{
  assert.equal(projects.length,5);
  assert.deepEqual(Object.keys(V215_CONTRIBUTIONS).sort(),projects.map(p=>slug(p.title)).sort());
  for(const p of projects){
    const html=contributionFirst(p,slug(p.title),manifest);
    for(const term of ['01 / PROBLEM','02 / MY CONTRIBUTION','03 / DOCUMENTED VERIFICATION',p.caseStudy.problem,p.caseStudy.verification])assert.ok(html.includes(term),`${p.title}: missing ${term}`);
    assert.match(html,/not an independently tested backend/);
  }
});
test('four flagship contribution briefs cite exact source commits, never estimated outcomes',()=>{
  for(const id of ['mulyankan','earthbridge','newssources','our-hidden-universe']){
    const record=V215_CONTRIBUTIONS[id];
    assert.ok(record.links.length>=2,id);
    for(const [label,url] of record.links){
      assert.ok(label.length>6);
      assert.match(url,/^https:\/\/github\.com\/himanshu051116\/[a-zA-Z0-9_.-]+\/commit\/[0-9a-f]{40}$/);
    }
    assert.match(record.contribution,/attributed|attributed to the portfolio owner/);
  }
  assert.match(V215_CONTRIBUTIONS.earthbridge.boundary,/REPOSITORY-REPORTED/);
  assert.match(V215_CONTRIBUTIONS.newssources.boundary,/not proof of a live crawler/i);
  assert.equal(Object.hasOwn(V215_CONTRIBUTIONS,'sentinel'),false);
});
test('safe rendering refuses synthetic image routes and escapes project copy',()=>{
  const p={title:'Temporary',evidenceImage:'javascript:alert(1)',caseStudy:{problem:'Bad <script>alert(1)</script>',verification:'verify & review'}};
  const html=contributionFirst(p,'mulyankan');
  assert.doesNotMatch(html,/<script>/);
  assert.match(html,/Bad &lt;script&gt;/);
  assert.doesNotMatch(html,/javascript:alert/);
  assert.match(html,/No verified public project screenshot/);
});
test('generated dossiers place the contribution brief before architecture, without duplicate IDs',()=>{
  const builder=read('scripts/build-v208.mjs');
  assert.match(builder,/import \{contributionFirst\} from '\.\.\/v215-contributions\.js'/);
  assert.match(builder,/contributionFirst\(p,id,manifest\)/);
  if(!existsSync(new URL('../dist/projects/mulyankan/index.html',import.meta.url)))return;
  for(const p of projects){
    const html=read('dist/projects/'+slug(p.title)+'/index.html');
    assert.ok(html.indexOf('class="v208Container v215QuickCase"')<html.indexOf('id="architecture"'),p.title);
    assert.match(html,/src="\/v208-project\.js"/);
    const ids=[...html.matchAll(/\bid="([a-zA-Z0-9_-]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,'duplicate ids on '+p.title);
    if(p.evidenceImage)assert.ok(html.includes(p.evidenceImage),p.title);
  }
});
test('existing source assets, original videos, three resume variants and separate Work route survive',()=>{
  const build=read('scripts/build.mjs');
  assert.match(build,/'v215-contributions\.css'/);
  assert.match(build,/'v215-contributions\.js'/);
  assert.ok(read('v208-work.js').includes('setupV214WorkFeature'));
  for(const name of ['fullstack','software','ml'])assert.ok(existsSync(new URL('../public/resumes/Himanshu_Shukla_'+name+'_Public.pdf',import.meta.url)));
  for(const file of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4'])assert.ok(existsSync(new URL('../public/video/'+file,import.meta.url)));
});
test('mobile reading order exposes problem and genuine image before the detailed attribution',()=>{
  const p=projects.find(x=>x.title==='Mulyankan');
  const html=contributionFirst(p,'mulyankan',manifest);
  const a=html.indexOf('01 / PROBLEM'), b=html.indexOf('class="v215CaptureLink"'),c=html.indexOf('02 / MY CONTRIBUTION'),d=html.indexOf('03 / DOCUMENTED VERIFICATION');
  assert.ok(a>=0&&a<b&&b<c&&c<d,'DOM sequence must match the mobile reading/focus order');
});
