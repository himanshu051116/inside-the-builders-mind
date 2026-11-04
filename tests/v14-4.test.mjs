import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const site=src('site.js'),role=src('career-modes.js'),media=src('evidence-media.js'),css=src('v14-4.css'),html=src('index.html');
test('V14.4 real screenshots open an inspectable dialog, case study remains separate',()=>{
 assert.match(site,/data-hero-proof-open/);
 assert.match(site,/v144CaseFromImage/);
 assert.match(media,/document.querySelectorAll\('\[data-hero-proof-open\]'\)/);
 assert.match(media,/lightbox\?\.showModal\(\)/);
 assert.match(media,/priorFocus=button/);
});
test('V14.4 role switching creates navigable history and preserves existing routes',()=>{
 assert.match(role,/history.pushState/);
 assert.match(role,/popstate/);
 assert.match(role,/if\(next!==current\)/);
 assert.match(role,/url.hash.startsWith\('#proof\/'\)/);
 assert.doesNotMatch(role,/history.replaceState/);
});
test('V14.4 mobile shows image before long prose and all shortcuts without clipping',()=>{
 assert.match(site,/v144Intro/);assert.match(site,/v144Details/);
 assert.match(css,/\.v14Hero \.v144Intro\{order:0\}/);
 assert.match(css,/\.v14Hero \.v14HeroFrame,\.v14Hero \.v14SourceFrame\{order:1/);
 assert.match(css,/\.v14Hero \.v144Details\{order:2\}/);
 assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/overflow:visible/);
});
test('V14.4 ML evidence describes source code without false results tiles',()=>{
 assert.match(site,/v144ResearchStages/);
 assert.match(site,/Verified images are pending/);
 assert.doesNotMatch(site,/<div class="v14MethodStats"><span><b>F1@5/);
});
test('V14.4 loads new stylesheet after previous accessibility fixes and uses adaptive search label',()=>{
 assert.match(html,/href="\/portfolio\.css"/);
 assert(!html.includes('href="/v14-4.css"')); 
 assert.match(src('scripts/build.mjs'),/'v14-4.css'/);
 assert.match(src('v11-experience.js'),/commandShortcut/);
 assert.match(html,/URLSearchParams/);
 assert.match(role,/img.loading=isActive\?'eager':'lazy'/);
});
