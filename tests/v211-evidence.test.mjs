import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {getEvidenceTrail,getPoints,readEvidenceSelection,evidenceLink,listProjectIds} from '../v211-evidence-model.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('six canonical project dossiers retain evidence records without fabricated execution claims',()=>{
  const ids=listProjectIds();
  assert.deepEqual(new Set(ids).size,6);
  for(const id of ids){
    const data=getEvidenceTrail(id);
    assert.ok(data,id);
    assert.ok(data.verification&&data.limitations,id);
    assert.equal(data.projectId,id);
    for(const item of data.sourceRecords)assert.match(item.url,/^https:\/\/github\.com\//);
  }
});
test('Mulyankan intake feature links to its explicit stage and repository records',()=>{
  const data=getEvidenceTrail('mulyankan','mulyankan-submission',0);
  assert.match(data.feature.title,/proposal|package/i);
  assert.equal(data.stage.index,0);
  assert.match(data.stage.title,/intake/i);
  assert.ok(data.sourceRecords.some(x=>/EVALUATION_SYSTEM\.md/.test(x.url)));
  assert.match(data.limitations,/backend|server|queue|database|preview/i);
});
test('NewsSources and EarthBridge map screenshot annotations to documented stages',()=>{
  const news=getEvidenceTrail('newssources','news-overview',0);
  assert.equal(news.stage.index,3);
  assert.ok(news.sourceRecords.some(x=>x.category==='Test or evaluation source'));
  const eb=getEvidenceTrail('earthbridge','earthbridge-evaluation',1);
  assert.equal(eb.stage.index,3);
  assert.ok(eb.sourceRecords.some(x=>/evaluate_descriptors\.py/.test(x.url)));
  assert.match(eb.limitations,/not independently|not been independently|no live|prototype|offline/i);
});
test('unmapped screenshots never acquire invented annotations',()=>{
  assert.equal(getPoints('not-supplied').length,0);
  const p=getEvidenceTrail('sentinel',null,0);
  assert.equal(p.feature,null);
  assert.equal(p.stage,null);
  assert.equal(getEvidenceTrail('nonexistent'),null);
  assert.equal(getEvidenceTrail('mulyankan','<img src=x>',0).feature,null);
});
test('deep-link query whitelist preserves real capture and feature only',()=>{
  const known=['mulyankan-submission','mulyankan-overview'];
  assert.deepEqual(readEvidenceSelection('https://portfolio.test/projects/mulyankan/?capture=mulyankan-submission&feature=0#captures',known),{captureId:'mulyankan-submission',featureIndex:0});
  assert.deepEqual(readEvidenceSelection('https://portfolio.test/projects/mulyankan/?capture=<script>&feature=999',known),{captureId:'mulyankan-submission',featureIndex:null});
  assert.equal(readEvidenceSelection('https://portfolio.test/projects/mulyankan/?capture=mulyankan-submission&feature=-1',known).featureIndex,null);
});
test('share URLs retain existing campaign parameters and canonical capture hash',()=>{
  const link=evidenceLink('https://portfolio.test/projects/earthbridge/?utm_source=ref#verification','earthbridge-evaluation',1);
  const url=new URL(link,'https://portfolio.test');
  assert.equal(url.searchParams.get('utm_source'),'ref');
  assert.equal(url.searchParams.get('capture'),'earthbridge-evaluation');
  assert.equal(url.searchParams.get('feature'),'1');
  assert.equal(url.hash,'#captures');
  assert.equal(evidenceLink('https://portfolio.test/projects/earthbridge/?capture=earthbridge-evaluation&feature=1#captures','earthbridge-evaluation',1),link.replace('utm_source=ref&',''));
});
test('project inspector retains V20.9 video and adds source-linked stage inspection',()=>{
  const project=read('v208-project.js'),model=read('v211-evidence-model.js'),panel=read('v211-evidence-panel.js');
  assert.match(project,/setupMilestoneVideo\(document\)\.show\(\)/);
  assert.match(project,/getPoints\(id\)/);
  assert.match(project,/epoch!==captureEpoch/);
  assert.match(project,/img\.naturalWidth===0/);
  assert.match(project,/popstate/);
  assert.match(model,/V204_STAGE_CAPTURES/);
  assert.match(model,/caseDossiers/);
  assert.match(panel,/SOURCE-CONNECTED INVESTIGATION/);
  assert.match(panel,/not direct validation/);
  assert.match(read('scripts/build.mjs'),/v211-dossier\.css/);
  assert.match(read('scripts/build-v208.mjs'),/id="v211-evidence-trail"/);
  assert.ok(existsSync(new URL('../v211-dossier.css',import.meta.url)));
});
