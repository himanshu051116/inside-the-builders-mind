import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {projects} from '../content.js';
import {V20_FLOWS} from '../v20-workspace.js';
import {V204_STAGE_CAPTURES} from '../v204-evidence.js';
import {V215_CONTRIBUTIONS} from '../v215-contributions.js';
import {getEvidenceTrail,listProjectIds} from '../v211-evidence-model.js';
import {getV214Feature} from '../v214-work-feature.js';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
test('Sentinel security project removed from canonical data, career lists and evidence',()=>{
 assert.deepEqual(projects.map(p=>p.title),['Mulyankan','EarthBridge','Our Hidden Universe','NewsSources','SchoolBuddies']);
 assert.equal(listProjectIds().includes('sentinel'),false);
 assert.equal(getV214Feature(projects,'sentinel'),null);
 assert.equal(getEvidenceTrail('sentinel'),null);
 for(const obj of [V20_FLOWS,V204_STAGE_CAPTURES,V215_CONTRIBUTIONS])assert.equal(Object.hasOwn(obj,'sentinel'),false);
});
test('No published Sentinel dossier or sitemap; old URLs redirect to Projects',()=>{
 assert.equal(existsSync(new URL('../dist/projects/sentinel/index.html',import.meta.url)),false);
 assert.doesNotMatch(read('dist/projects/index.html'),/>Sentinel</);
 assert.doesNotMatch(read('dist/sitemap.xml'),/projects\/sentinel/);
 const config=JSON.parse(read('vercel.json'));
 for(const old of ['/projects/sentinel','/projects/sentinel/'])
  assert.ok(config.redirects.some(r=>r.source===old&&r.destination==='/projects/'&&r.permanent));
});
test('EarthBridge satellite sensors and original media/resumes are untouched',()=>{
 assert.match(projects.find(p=>p.title==='EarthBridge').description,/Sentinel-1 SAR and Sentinel-2/);
 for(const role of ['fullstack','software','ml'])
  assert.ok(existsSync(new URL('../dist/resumes/Himanshu_Shukla_'+role+'_Public.pdf',import.meta.url)));
 for(const clip of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4'])
  assert.ok(existsSync(new URL('../dist/video/'+clip,import.meta.url)));
});
