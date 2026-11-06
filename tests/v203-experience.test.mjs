import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {V203_JOURNEYS,setupV203Experience} from '../v203-experience.js';
const read=n=>readFileSync(new URL('../'+n,import.meta.url),'utf8');
test('V20.3 provides three distinct 4-stage paths',()=>{
  assert.equal(typeof setupV203Experience,'function');
  for(const name of ['fullstack','software','ml']){
    const x=V203_JOURNEYS[name];assert.equal(x.steps.length,4);
    assert.deepEqual([...new Set(x.steps.map(s=>s[0]))].sort(),['architecture','evidence','media','overview']);
    assert.ok(x.steps.every(s=>s[1].length>5&&s[2].length>20));
  }
  assert.notEqual(V203_JOURNEYS.fullstack.steps[0][0],V203_JOURNEYS.software.steps[0][0]);
  assert.notEqual(V203_JOURNEYS.software.steps[0][0],V203_JOURNEYS.ml.steps[0][0]);
});
test('V20.3 modifies no original project evidence or model calculations',()=>{
 const js=read('v203-experience.js');
 for(const token of ['portfolio:v20-render','[data-v20-capture]','.v20Architecture','.v20Evidence','[data-v20-tab'])assert.ok(js.includes(token),token);
 for(const unsafe of ['fetch(','XMLHttpRequest','WebSocket','setInterval(','autoplay'])assert.ok(!js.includes(unsafe),unsafe);
 assert.ok(js.includes('static screenshot'));
});
test('V20.3 build integration keeps V19 and V20 intact',()=>{
 const site=read('site.js'),build=read('scripts/build.mjs'),work=read('v20-workspace.js');
 assert.match(site,/setupV20Workspace\(projects\)\s*setupV203Experience\(\{projects\}\)/);
 assert.match(site,/setupMilestoneVideo\(\)/);
 assert.match(build,/v203-experience\.js/);
 assert.match(build,/v203-experience\.css/);
 assert.match(work,/portfolio:v20-render/);
 for(const token of ['v20Archive','data-v20-video','p.caseStudy.caveat'])assert.ok(work.includes(token),token);
});
test('V20.3 retains keyboard focus and accessible motion options',()=>{
 const css=read('v203-experience.css'),js=read('v203-experience.js');
 assert.match(css,/focus-visible/);
 assert.match(css,/forced-colors/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(js,/ArrowLeft/);
 assert.match(js,/ArrowRight/);
});
