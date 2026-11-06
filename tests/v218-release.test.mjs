import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const from=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('V21.8 performance gate uses real built output with measured gzip sizes, not fabricated Lighthouse scores',()=>{
 const source=from('scripts/audit-v218.mjs');
 for(const phrase of ['gzipSync','portfolio.css','criticalJsGzip','largestJsGzip','not measured transfer size/LCP','Mulyankan']){} 
 assert.match(source,/gzipSync/);assert.match(source,/cssGzip/);assert.match(source,/criticalJsGzip/);
 assert.match(source,/not measured transfer size\/LCP/);
});
test('V21.8 browser test is an optional reproducible Playwright smoke test, not a CI dependency',()=>{
 const s=from('scripts/qa-v218-browser.mjs'),pkg=JSON.parse(from('package.json'));
 assert.match(s,/import \{ chromium \} from 'playwright'/);
 assert.match(s,/PORTFOLIO_BASE_URL/);
 assert.match(s,/PostgreSQL/);
 assert.match(s,/v217Viewer/);
 assert.match(s,/TOTAL/);
 assert.equal(pkg.dependencies?.playwright,undefined);
 assert.match(pkg.scripts.verify,/audit:performance/);
});
test('V21.8 keeps five dossiers, three roles and both original presenter recordings in build',()=>{
 const assets=['work/index.html','projects/mulyankan/index.html','projects/earthbridge/index.html','projects/newssources/index.html','projects/our-hidden-universe/index.html','projects/schoolbuddies/index.html','video/mulyankan-system-walkthrough-presenter.mp4','video/mulyankan-docx-workflow-presenter.mp4'];
 for(const a of assets)assert.ok(existsSync(new URL('../dist/'+a,import.meta.url)),a);
 for(const role of ['fullstack','software','ml'])assert.ok(existsSync(new URL('../dist/resumes/Himanshu_Shukla_'+role+'_Public.pdf',import.meta.url)),role);
});

