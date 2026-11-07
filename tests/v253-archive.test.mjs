import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const workspace=read('v20-workspace.js')
const hover=read('v21-interactions.js')
const css=read('v253-archive.css')
const build=read('scripts/build.mjs')

test('ten real archive sections are retained without tall ten-row desktop presentation',()=>{
 for(const name of ['Work by focus','Selected projects','Architecture and trade-offs','Project notes','Captured interfaces','Additional projects','Interactive demos','About','Tools and skills','Evidence review']){
   assert.ok(workspace.includes('"'+name+'"'),name)
 }
 assert.match(workspace,/v21ArchiveGroup/)
 assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/)
 assert.match(css,/@media\(max-width:570px\)/)
 assert.match(css,/min-height:52px/)
 assert.match(css,/min-height:46px/)
})

test('hovering archive does not mutate a disclosure while scrolling',()=>{
 assert.doesNotMatch(hover,/summary\.addEventListener\("pointerenter"/)
 assert.doesNotMatch(hover,/summary\.parentElement\.open=true/)
 assert.match(hover,/Hover remains a visual highlight/)
 assert.match(workspace,/const archiveGroups=\[\.\.\.groupMap\.values\(\)\]/)
 assert.match(workspace,/const showArchiveGroup=id=>/)
 assert.match(workspace,/if\(group!==selected&&group\.open\)group\.open=false/)
})

test('opened sections use natural full-height page scroll and sticky close control',()=>{
 const finalRules=css.slice(css.indexOf('/* V25.4:'))
 assert.match(finalRules,/max-height:none/)
 assert.match(finalRules,/overflow:visible/)
 assert.match(finalRules,/overscroll-behavior:auto/)
 assert.match(finalRules,/position:sticky/)
 assert.match(finalRules,/scroll-margin-top/)
 assert.match(workspace,/const closeAll=archive\.querySelector/)
 assert.match(workspace,/archiveCount\.textContent/)
 assert.match(workspace,/settleOnArchiveHeading/)
 assert.match(workspace,/closeArchiveGroup/)
 assert.match(workspace,/event\.key!=="Escape"/)
 assert.match(css,/v253ArchiveVerb/)
 assert.match(css,/:focus-visible/)
})

test('case studies and archive hash routes still reveal their original content',()=>{
 assert.match(workspace,/const revealArchive=/)
 assert.match(workspace,/showArchiveGroup\(group\.dataset\.archiveSection\)/)
 assert.match(workspace,/showArchiveGroup\("project-notes"\)/)
 assert.match(workspace,/target\.querySelector\("details\.caseFileDetails"\)/)
 assert.match(workspace,/gridNode\.hidden=false/)
 assert.match(workspace,/revealArchive\(hash,\{scroll:false\}\)/)
 assert.match(workspace,/portfolio:archive-preview/)
 assert.match(build,/v253-archive\.css/)
})
