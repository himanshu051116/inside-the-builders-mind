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

test('opened sections stay within one viewport with obvious persistent close',()=>{
 assert.match(css,/max-height:min\(68dvh,700px\)/)
 assert.match(css,/overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain/)
 assert.match(css,/position:sticky;top:68px/)
 assert.match(css,/\.v21ArchiveGroup\[open\] > summary/)
 assert.match(workspace,/const closeAll=archive\.querySelector\("\.v253CloseAll"\)/)
 assert.match(workspace,/archiveCount\.textContent/)
 assert.match(workspace,/old\?\.querySelector\("summary"\)\?\.focus/)
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
