import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getV214Feature, setupV214WorkFeature} from '../v214-work-feature.js';
import {projects} from '../content.js';

const get = name => readFileSync(new URL('../'+name, import.meta.url), 'utf8');

test('V21.4 previews canonical, source-backed project records without inventing outcomes', () => {
  const expected = new Map([
    ['our-hidden-universe','OHS Watch Together'],
    ['mulyankan','Mulyankan'],
    ['earthbridge','EarthBridge'],
    ['newssources','NewsSources'],
    ['schoolbuddies','SchoolBuddies'],
  ]);
  assert.equal(projects.length, 5);
  for (const [id] of expected) {
    const data = getV214Feature(projects, id);
    assert.ok(data, id);
    const base = projects.find(p => p.title === data.title);
    assert.equal(data.summary, base.description);
    assert.equal(data.status, base.status);
    assert.equal(data.dossier, `/projects/${id}/`);
  }
});

test('V21.4 keeps true screenshot paths and never substitutes an invented image', () => {
  assert.equal(getV214Feature(projects, 'mulyankan').image, '/evidence/mulyankan-overview.webp');
  assert.equal(getV214Feature(projects, 'our-hidden-universe').image, '/evidence/ohs-together.webp');
  assert.equal(getV214Feature(projects, 'sentinel'), null);
  assert.equal(getV214Feature([{title:'Demo',evidenceImage:'https://invalid.example/image.png'}], 'demo').image, null);
  assert.equal(getV214Feature(projects, null), null);
  assert.equal(getV214Feature(projects, 'not-a-project'), null);
});

test('V21.4 retains the existing Work explorer and integrates a single preview owner', () => {
  const work = get('v208-work.js');
  const build = get('scripts/build.mjs');
  const source = get('v214-work-feature.js');
  assert.match(work, /setupV20Workspace\(projectRecords,document,window,\{standalone:true\}\)/);
  assert.match(work, /setupV214WorkFeature\(projectRecords,document,window\)/);
  assert.match(work, /setupV203Experience/);
  assert.match(work, /setupV204Evidence/);
  assert.match(work, /setupV205Annotations/);
  assert.match(build, /'v214-work-feature\.js'/);
  assert.match(build, /'v214-work\.css'/);
  assert.match(source, /portfolio:v20-render/);
  assert.match(source, /inspector\.dataset\.projectId/);
  assert.match(source, /querySelector\('\[data-v214-feature\]'\)/);
  assert.equal(typeof setupV214WorkFeature, 'function');
});

test('V21.4 requires accessible CTAs and does not invent live execution or measurements', () => {
  const src = get('v214-work-feature.js');
  const css = get('v214-work.css');
  for (const phrase of [
    'Selected project preview', 'Saved project material, not a live system test.',
    'Inspect in explorer', 'Read case study', 'No matching projects',
    'Saved screenshot unavailable.',
  ]) assert.ok(src.includes(phrase), phrase);
  assert.match(css, /@media\(max-width:730px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /@media\(forced-colors:active\)/);
  assert.match(css, /aspect-ratio:1\.75/);
  assert.doesNotMatch(src, /Math\.random\(|generated image|production benchmark/i);
});

test('V21.4 preserves original media, accessible legacy path, and three career modes', () => {
  const video = get('v19-milestone-video.js');
  const ws = get('v20-workspace.js');
  const page = get('scripts/build-v208.mjs');
  for (const clip of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4'])
    assert.ok(video.includes(clip), clip);
  for (const role of ['fullstack','software','ml'])
    assert.ok(ws.includes('/resumes/Himanshu_Shukla_'+role+'_Public.pdf'),role);
  assert.match(page, /writeAt\(out,'legacy'/);
  assert.match(ws, /const standalone=config\.standalone===true/);
});
