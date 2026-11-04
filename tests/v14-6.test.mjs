import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {projects} from '../content.js';
import {SCREEN_RECORDS} from '../evidence-media.js';
import {caseDossiers} from '../case-dossiers.js';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const manifest=JSON.parse(read('public/evidence/manifest.json'));
const earthIds=['earthbridge-evaluation','earthbridge-workbench','earthbridge-architecture','earthbridge-results-empty'];
test('four real EarthBridge images now appear in authenticated captures with verified hashes',()=>{
 assert.equal(Object.keys(manifest).length,20);
 for(const id of earthIds){
  const item=manifest[id];assert.ok(item);
  const path='public'+item.path;assert.ok(existsSync(new URL(path,root)));
  const bytes=readFileSync(new URL(path,root));
  assert.equal(bytes.length,item.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256);
  assert.ok(item.width>800 && item.height>400);
  assert.ok(SCREEN_RECORDS[id].boundary.length>50);
 }
});
test('EarthBridge evaluation figures grounded in original submission docs and clearly labeled',()=>{
 const detail=caseDossiers.earthbridge;
 for(const figure of ['19.53%','11.59%','53.03%','70.08%','0.146 ms','3,248','6,496'])assert.ok(detail.expected.includes(figure),figure);
 assert.match(detail.expected,/not rerun or externally verified/i);
 assert.ok(detail.evidence.some(([,url])=>url.endsWith('SUBMISSION_README.md')));
 assert.ok(detail.evidence.some(([,url])=>url.endsWith('docs/PROJECT_STATUS.md')));
 assert.match(SCREEN_RECORDS['earthbridge-workbench'].boundary,/API offline/i);
 assert.match(SCREEN_RECORDS['earthbridge-results-empty'].boundary,/no real top-k matches/i);
});
test('ML role now has actual image, appropriate zoom ID and project gallery access',()=>{
 const app=read('site.js');const media=read('evidence-media.js');
 assert.match(app,/proofId:'earthbridge-evaluation'/);
 assert.match(app,/data-hero-proof-open="\$\{t.proofId/);
 assert.match(media,/id:'earthbridge',name:'EarthBridge'/);
 assert.match(media,/groups.find\(g=>g.items.some/);
 assert.match(media,/role==='software'\?'news':'earthbridge'/);
 assert.match(media,/\'02\':\'earthbridge\'/);
 const project=projects.find(p=>p.title==='EarthBridge');
 assert.equal(project.evidenceImage,'/evidence/earthbridge-evaluation.webp');
 assert.match(project.caseStudy.caveat,/API offline/);
});
test('no EarthBridge offline workbench screenshot is described as real retrieval output',()=>{
 const m=read('evidence-media.js');
 assert.match(m,/No query-and-ranked-results screenshot was supplied/);
 assert.match(m,/not independently reproduced/i);
 assert.match(read('V14_STATUS.json'),/V14-016/);
});
