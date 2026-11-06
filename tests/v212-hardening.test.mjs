import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {captureBelongsToProject,getEvidenceTrail} from '../v211-evidence-model.js';
const src=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
test('annotations cannot be reassigned across projects',()=>{
  assert.equal(captureBelongsToProject('mulyankan','mulyankan-submission'),true);
  assert.equal(captureBelongsToProject('mulyankan','earthbridge-evaluation'),false);
  assert.equal(captureBelongsToProject('earthbridge','news-overview'),false);
  const foreign=getEvidenceTrail('mulyankan','earthbridge-evaluation',1);
  assert.equal(foreign.captureId,null);
  assert.equal(foreign.feature,null);
  assert.equal(foreign.stage,null);
});
test('the evidence cards are not one gigantic live announcement',()=>{
  const panel=src('v211-evidence-panel.js');
  assert.match(panel,/announcement\.setAttribute\('aria-live','polite'\)/);
  assert.match(panel,/announcement\.setAttribute\('aria-atomic','true'\)/);
  assert.doesNotMatch(panel,/live\.setAttribute\('aria-live'/);
});
test('history no-op is detected and scoped screenshot rendering is retained',()=>{
  const controller=src('v208-project.js');
  assert.match(controller,/History write was not applied/);
  assert.match(controller,/epoch!==captureEpoch/);
  assert.match(controller,/img\.naturalWidth===0/);
});
