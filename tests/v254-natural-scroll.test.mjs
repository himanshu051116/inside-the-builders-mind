import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const workspace=read('v20-workspace.js')
const css=read('v253-archive.css')
const hover=read('v21-interactions.js')
const finalCss=css

test('expanded archive reveals the complete original content on the main page',()=>{
 assert.ok(finalCss.length>500)
 assert.match(finalCss,/max-height:none/)
 assert.match(finalCss,/height:auto/)
 assert.match(finalCss,/overflow:visible/)
 assert.match(finalCss,/overscroll-behavior:auto/)
 assert.match(finalCss,/scrollbar-gutter:auto/)
 assert.doesNotMatch(finalCss,/max-height:min\\(68dvh/)
 assert.doesNotMatch(finalCss,/max-height:61dvh/)
 assert.match(finalCss,/@media\(max-width:570px\)/)
 assert.match(finalCss,/scroll-margin-top/)
 assert.doesNotMatch(workspace,/inner\.tabIndex=0/)
 assert.match(workspace,/expanded archive section/)
})

test('closing a long archive section restores its real heading and focus',()=>{
 assert.match(workspace,/const settleOnArchiveHeading=/)
 assert.match(workspace,/const closeArchiveGroup=/)
 assert.match(workspace,/summary\.scrollIntoView\(\{behavior:"instant",block:"start"\}\)/)
 assert.match(workspace,/summary\.focus\(\{preventScroll:true\}\)/)
 assert.match(workspace,/event\.preventDefault\(\)/)
 assert.match(workspace,/const summary=event\.target\.closest\?\.\("\.v21ArchiveGroup > summary"\)/)
 assert.match(workspace,/closeAll\.addEventListener\("click",\(\)=>closeArchiveGroup\(activeArchive\)\)/)
 assert.match(workspace,/event\.key!=="Escape"/)
 assert.match(finalCss,/position:sticky/)
 assert.match(finalCss,/z-index:5/)
})

test('compact archive remains intentional and single-open with working deep links',()=>{
 assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/)
 assert.match(css,/@media\(max-width:570px\)/)
 assert.match(workspace,/const archiveGroups=\[\.\.\.groupMap\.values\(\)\]/)
 assert.match(workspace,/if\(group!==selected&&group\.open\)group\.open=false/)
 assert.match(workspace,/showArchiveGroup\("project-notes"\)/)
 assert.match(workspace,/target\.querySelector\("details\.caseFileDetails"\)/)
 assert.match(workspace,/const revealArchive=/)
 assert.doesNotMatch(hover,/summary\.addEventListener\("pointerenter"/)
 assert.match(hover,/click\/Enter\/Space/)
})
