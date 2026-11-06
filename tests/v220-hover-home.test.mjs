import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {V219_FOCUS} from '../v219-home.js';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
test('V21.10 every focus has an explicit canonical project destination and concise project identity',()=>{
 for(const [role,v] of Object.entries(V219_FOCUS)){
  assert.ok(v.title?.length>=8,role);
  assert.match(v.project,/^[a-z0-9-]+$/);
  assert.ok(v.description&&v.description.length<100,role);
 }
 assert.equal(new Set(Object.values(V219_FOCUS).map(x=>x.project)).size,3);
});
test('V21.10 hover works on hybrid pointers, keeps touch click, and keyboard starts from focused tab',()=>{
 const src=read('v219-home.js');
 assert.match(src,/pointerenter/);
 assert.match(src,/ev\.pointerType==='mouse'/);
 assert.match(src,/ev\.target\.dataset\.v219Role/);
 assert.match(src,/tablist\.addEventListener\('click'/);
 assert.match(src,/projectLink\.href='\/projects\/'/);
 assert.match(src,/panel\.replaceChildren\(projectName,projectDetail,projectLink\)/);
});
test('V21.10 new source-connected case link preserves original Mulyankan player and all resumes',()=>{
 const hero=read('v17-recruiter.js'),css=read('v219-home.css');
 assert.match(css,/\.v220FocusCase:focus-visible/);
 for(const item of ['Himanshu_Shukla_fullstack_Public.pdf','Himanshu_Shukla_software_Public.pdf','Himanshu_Shukla_ml_Public.pdf'])assert.ok(hero.includes(item));
 assert.match(read('v208-home.js'),/setupMilestoneVideo\(document\)/);
});
