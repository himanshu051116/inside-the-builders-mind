import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8')
const site=read('site.js'),exp=read('v11-experience.js'),css=read('portfolio.css'),build=read('scripts/build.mjs')
test('four independently selectable source-linked engineering records are represented',()=>{
 for(const id of ['ohs','news','mulyankan','earthbridge'])assert.match(site,new RegExp("id:'"+id+"'"))
 assert.match(site,/role="tablist"/)
 assert.match(site,/role="tabpanel"/)
 assert.match(exp,/aria-selected/)
 assert.match(exp,/ArrowRight/)
 assert.match(exp,/ArrowLeft/)
})
test('all selected repository paths have directly inspectable canonical origins',()=>{
 for(const origin of ['our-hidden-universe','NewsSources','Algonauts-Mulyankan','earthbridge'])assert.ok(site.includes('https://github.com/himanshu051116/'+origin))
 assert.match(site,/POSTGRES INTEGRATION/)
 assert.match(site,/REAL REPOSITORY SCREENSHOT/)
 assert.match(exp,/imageSourceUnavailable/)
})
test('mode switch selects relevant evidence and proof-strip content',()=>{
 for(const mode of ['fullstack','software','ml'])assert.ok(exp.includes(mode))
 assert.match(exp,/focusByMode=\{fullstack:'ohs',software:'news',ml:'earthbridge'\}/)
 assert.match(site,/data-proof-route/)
})
test('case note expansion is explicit and reversible',()=>{
 assert.match(site,/id="caseFilesGrid" hidden/)
 assert.match(exp,/caseGrid.hidden=!open/)
 assert.match(exp,/aria-expanded/)
})
test('command dialog has keyboard shortcut, useful filter, close and resume options',()=>{
 assert.match(site,/id="commandDialog"/)
 assert.match(site,/id="commandSearch"/)
 for(const role of ['fullstack','software','ml'])assert.ok(site.includes(`resumes/Himanshu_Shukla_${role}_Public.pdf`))
 assert.match(exp,/ev\.key==='Escape'/)
 assert.match(exp,/ev\.ctrlKey\|\|ev\.metaKey/)
 assert.match(exp,/query!==''&&!hay.includes\(query\)/)
})
test('release output includes V11 interaction module and one main stylesheet',()=>{
 assert.match(site,/setupV11Experience\(\)/)
 assert.match(build,/v11-experience\.js/)
 assert.match(build,/portfolio\.css/)
 assert.match(css,/\.atlasTab:focus-visible/)
 assert.match(css,/@media\(max-width:360px\)/)
})
