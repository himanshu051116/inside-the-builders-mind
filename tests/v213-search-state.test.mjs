import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterV213Projects, selectV213VisibleProject} from '../v213-search-state.js';

const projects = [
  {id:'earthbridge', title:'EarthBridge', description:'SAR retrieval with FAISS', category:'Research', status:'Prototype', stack:['PyTorch','FAISS']},
  {id:'newssources', title:'NewsSources', description:'RSS crawler with provenance', category:'Backend', status:'Development', stack:['Python','PostgreSQL']},
  {id:'mulyankan', title:'Mulyankan', description:'Evidence-linked reviews', category:'Software', status:'Demonstrated prototype', stack:['React','Python']}
];
const rank = ['earthbridge','mulyankan','newssources'];

test('PostgreSQL filters to NewsSources and previews it instead of stale EarthBridge', () => {
  const matches = filterV213Projects(projects, 'PostgreSQL', rank);
  assert.deepEqual(matches.map(p => p.id), ['newssources']);
  assert.equal(selectV213VisibleProject(matches, 'earthbridge'), 'newssources');
});

test('no matching projects yields null selection, never a hidden detail pane', () => {
  const matches = filterV213Projects(projects, 'a term that cannot exist', rank);
  assert.deepEqual(matches, []);
  assert.equal(selectV213VisibleProject(matches, 'earthbridge'), null);
});

test('clearing a query restores the explicitly selected project without changing it', () => {
  const committed = 'earthbridge';
  assert.equal(selectV213VisibleProject(filterV213Projects(projects, 'postgresql', rank), committed), 'newssources');
  assert.equal(selectV213VisibleProject(filterV213Projects(projects, '', rank), committed), committed);
});

test('keeping the selected project visible does not replace it with the highest-ranked hit', () => {
  assert.equal(selectV213VisibleProject(filterV213Projects(projects, 'python', rank), 'newssources'), 'newssources');
});

test('role ordering affects all results without excluding the six projects', () => {
  const a = filterV213Projects(projects, ' ', rank);
  assert.deepEqual(a.map(x => x.id), rank);
  assert.equal(a.length, projects.length);
  const b = filterV213Projects(projects, '', ['newssources','mulyankan','earthbridge']);
  assert.deepEqual(b.map(x => x.id), ['newssources','mulyankan','earthbridge']);
});

test('search tolerates missing metadata and does not mutate source records', () => {
  const source = [{id:'x',title:'Example',stack:null},{id:'y',title:'Y',stack:[]}];
  assert.equal(filterV213Projects(source, ' EXAMPle ', []).length, 1);
  assert.deepEqual(source[0],{id:'x',title:'Example',stack:null});
});

test('filtered selection is temporary; only explicit actions call the existing URL writer', () => {
  const work = readFileSync(new URL('../v20-workspace.js',import.meta.url),'utf8');
  assert.match(work, /search\.addEventListener\('input',refreshSearch\)/);
  assert.match(work, /function refreshSearch\(\)\s*\{/);
  const refresh = work.match(/function refreshSearch\(\)\s*\{([\s\S]*?)\n  \}/)?.[1];
  assert.ok(refresh, 'refreshSearch implementation missing');
  assert.doesNotMatch(refresh, /emit\(|commitV207Route|history\./);
  assert.match(work, /function commitVisiblePreview\(\)\s*\{/);
  assert.match(work, /if\(!p\)\s*\{/);
  assert.match(work, /data-v20-clear-search/);
  assert.match(work, /win\.addEventListener\("popstate"/);
});
