import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {V219_FOCUS,setupV219Home} from '../v219-home.js';
import {recruiterIntroMarkup,recruiterFacts} from '../v17-recruiter.js';
const src=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
test('three modes map to three evidence-backed projects, all résumé PDFs remain',()=>{
 assert.deepEqual(Object.keys(V219_FOCUS),['fullstack','software','ml']);
 assert.equal(new Set(Object.values(V219_FOCUS).map(x=>x.project)).size,3);
 for(const role of Object.keys(V219_FOCUS))
  assert.ok(existsSync(new URL('../public/resumes/Himanshu_Shukla_'+role+'_Public.pdf',import.meta.url)));
});
test('Home ships compact career tabs before scripts, and avoids duplicate direction cards',()=>{
 const html=recruiterIntroMarkup(),builder=src('scripts/build-v208.mjs');
 for(const tag of ['v219TabFullstack','v219TabSoftware','v219TabMl','v219FocusPanel'])assert.ok(html.includes(tag),tag);
 assert.match(html,/role="tablist"/);assert.match(html,/role="tabpanel"/);
 assert.match(html,/Class of 2028/);
 assert.match(recruiterFacts.education.institution,/Madhav Institute of Technology/);
 assert.doesNotMatch(builder,/Choose a direction/);
 assert.match(builder,/v219About/);
 assert.match(html,/LEADERSHIP/);assert.match(html,/AWARDS/);assert.match(html,/TOOLS/);
});
test('hover selects content without forced navigation; touch, keyboard and reduced-motion remain',()=>{
 const js=src('v219-home.js'),css=src('v219-home.css'),entry=src('v208-home.js');
 assert.equal(typeof setupV219Home,'function');
 for(const token of ['pointerenter','pointermove','focusin','ArrowRight','ArrowLeft','Home','End','aria-selected','requestAnimationFrame','prefers-reduced-motion','pointer: fine'])assert.ok(js.includes(token),token);
 assert.doesNotMatch(js,/location\.(?:href|assign|replace)\s*=/);
 assert.match(js,/cta\.href='\/work\/\?view='/);
 assert.match(entry,/setupV219Home\(document,window\)/);
 assert.match(css,/:focus-visible/);assert.match(css,/forced-colors/);
 assert.match(css,/@media\(max-width:630px\)/);
});
test('original video, review image, all dossiers and supporting source routes remain',()=>{
 for(const file of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4'])
  assert.ok(existsSync(new URL('../public/video/'+file,import.meta.url)),file);
 assert.ok(existsSync(new URL('../public/evidence/mulyankan-overview.webp',import.meta.url)));
 for(const id of ['mulyankan','earthbridge','newssources','our-hidden-universe','sentinel','schoolbuddies'])
  assert.ok(existsSync(new URL('../dist/projects/'+id+'/index.html',import.meta.url)),id);
});

