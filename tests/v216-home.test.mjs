import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {setupV216Home,V216_CAPTURE} from '../v216-home.js';
const read = file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');

test('V21.6 is integrated after the original video player on Home only',()=>{
  const home=read('v208-home.js'),build=read('scripts/build.mjs'),vm=read('tests/v208-redirect.test.mjs');
  assert.ok(vm.includes('setupV216Home(){}'), 'Legacy redirect VM harness must mock enhanced Home');
  assert.match(home,/setupMilestoneVideo\(document\);\s*setupV216Home\(document\)/);
  assert.match(build,/'v216-home\.css'/);
  assert.match(build,/'v216-home\.js'/);
  assert.equal(typeof setupV216Home,'function');
});
test('the original playable recordings and all three résumé files remain',()=>{
  const clip=read('v19-milestone-video.js');
  for(const name of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4']) {
    assert.match(clip,new RegExp(name.replaceAll('.','\\.')));
    assert.ok(existsSync(new URL('../public/video/'+name,import.meta.url)));
  }
  for(const name of ['fullstack','software','ml'])
    assert.ok(existsSync(new URL('../public/resumes/Himanshu_Shukla_'+name+'_Public.pdf',import.meta.url)));
});
test('Homepage has permanent project dossier links, a short CTA and a native résumé menu',()=>{
  const builder=read('scripts/build-v208.mjs');
  const hero=read('v17-recruiter.js');
  for(const item of ['View selected work','Private rooms and shared sessions','Trace articles back to sources','Cross-modal satellite retrieval']) assert.ok(builder.includes(item),item);
  for(const id of ['our-hidden-universe','newssources','earthbridge','mulyankan'])assert.ok(builder.includes('/projects/'+id+'/'),id);
  assert.match(hero,/class="v17ResumeSelect"/);
  assert.match(hero,/LEADERSHIP/);assert.match(hero,/AWARDS/);assert.match(hero,/TOOLS/);
});
test('saved redacted screenshot is source-grounded and never treated as live proof',()=>{
  const manifest=JSON.parse(read('public/evidence/manifest.json'));
  const capture=Object.values(manifest).find(v=>v.path===V216_CAPTURE.image);
  assert.ok(capture);
  assert.match(capture.caption,/redacted/i);
  assert.ok(existsSync(new URL('../public'+V216_CAPTURE.image,import.meta.url)));
  assert.match(V216_CAPTURE.boundary,/not a live scoring result/);
  assert.match(V216_CAPTURE.destination,/^\/projects\/mulyankan\/#captures$/);
});
test('mobile CSS restores the rail with visible rows, focus and reduced-motion support',()=>{
  const css=read('v216-home.css');
  assert.match(css,/@media\(max-width:950px\)/);
  assert.match(css,/\.v19ProjectRail\{display:grid/);
  assert.match(css,/min-height:49px/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/prefers-reduced-motion/);
});
