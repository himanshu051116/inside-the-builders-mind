import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {recruiterIntroMarkup} from '../v17-recruiter.js';
const css=readFileSync(new URL('../v19-hero-refinement.css',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');

test('V19.2 keeps three genuine case-study links in the recruiter hero',()=>{
  const markup=recruiterIntroMarkup();
  for(const name of ['Our Hidden Universe','NewsSources','EarthBridge']) assert.ok(markup.includes(name),name);
  for(const anchor of ['#case-ohs','#case-news','#case-earthbridge']) assert.ok(markup.includes(`href="${anchor}"`),anchor);
  assert.match(markup,/v19ProjectRail/);
  assert.match(markup,/Mulyankan/);
  assert.match(markup,/Expected graduation/);
});
test('V19.2 layout fixes empty upper space, controls horizontal typography and preserves recorded video',()=>{
  assert.match(css,/\.v17LeadCopy\s*\{[^}]*justify-content:\s*flex-start/s);
  assert.match(css,/\.v17LeadGrid\s*\{[^}]*align-items:\s*start/s);
  assert.match(css,/\.v19ProjectRail a/);
  assert.match(css,/@media \(max-width: 950px\)/);
  assert.match(readFileSync(new URL('../v19-milestone-video.css',import.meta.url),'utf8'),/object-fit:contain/);
  assert.match(build,/v19-milestone-video\.css','v19-hero-refinement\.css/);
});
