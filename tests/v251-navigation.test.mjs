import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {caseDossiers} from '../case-dossiers.js'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const ws=read('v20-workspace.js')
const css=read('v251-navigation.css')
const build=read('scripts/build.mjs')

test('preview saves one immutable navigation checkpoint across repeated hovers',()=>{
 assert.match(ws,/let previewActive=false,previewSnapshot=null,previewRestoreTimer=0/)
 assert.match(ws,/const projectStateMaps=\[captureByProject,stageByProject,tabByProject,captureTokenByProject,stageTokenByProject\]/)
 assert.match(ws,/const rememberPreview=\(\)=>/)
 assert.match(ws,/if\(previewSnapshot\)return/)
 assert.match(ws,/maps:projectStateMaps\.map\(m=>new Map\(m\)\)/)
 assert.match(ws,/rememberPreview\(\)/)
 assert.match(ws,/clearPreviewCheckpoint\(\)/)
})

test('cancel restores role, project, inspection panel, screenshots, stage and their maps',()=>{
 assert.match(ws,/function restorePreview\(/)
 assert.match(ws,/if\(role!==snapshot\.role\)chooseRole\(snapshot\.role,true,false\)/)
 for(const key of ['role','id','tab','capture','stage']) assert.match(ws,new RegExp(key+'=snapshot\\.'+key))
 assert.match(ws,/projectStateMaps\.forEach\(\(m,index\)=>/)
 assert.match(ws,/for\(const \[key,value\] of snapshot\.maps\[index\]\)m\.set\(key,value\)/)
 assert.match(ws,/workspace\.addEventListener\("pointerleave"/)
 assert.match(ws,/win\.setTimeout\(\(\)=>restorePreview\(\{announceRestore:false\}\),550\)/)
 assert.match(ws,/if\(ev\.key!=="Escape"\|\|!previewActive/)
 assert.match(ws,/data-v251-cancel/)
 assert.match(css,/v251PreviewActions/)
 assert.match(css,/data-previewing="true"/)
 assert.match(css,/\.v203TourShortcut\{display:none!important\}/)
})

test('committing always discards the preview checkpoint',()=>{
 assert.match(ws,/previewActive=false;clearPreviewCheckpoint\(\);renderPreviewBar\(\)/)
 assert.match(ws,/if\(previewActive\)restorePreview\(\{announceRestore:false\}\)/)
 assert.match(ws,/const commitSelection=/)
 assert.match(ws,/portfolio:navigation-committed/)
 const previewPart=ws.slice(ws.indexOf('const preview=(button)=>'),ws.indexOf('workspace.addEventListener("pointerover"'))
 assert.doesNotMatch(previewPart,/commitSelection\(|emit\(/)
})

test('expanded engineering record uses existing source-backed state, expected outcomes and contextual controls',()=>{
 for(const id of ['ohs','news','mulyankan','earthbridge']){
   const d=caseDossiers[id]
   for(const k of ['decision','tradeoff','reproducible','expected','state']) assert.equal(typeof d[k],'string')
   assert.ok(d.evidence.length>0)
 }
 assert.match(ws,/e\(record\.expected\)/)
 assert.match(ws,/e\(record\.state\)/)
 for(const tab of ['architecture','media','evidence'])assert.match(ws,new RegExp('data-v251-jump="'+tab+'"'))
 assert.match(ws,/chooseTab\(b\.dataset\.v251Jump,true,true\)/)
 assert.match(ws,/v25EngineeringRecord/)
 assert.match(css,/v251RelatedViews/)
 assert.match(css,/:focus-visible/)
})

test('V25.1 ships only additive CSS and preserves archive, video and role-specific résumés',()=>{
 assert.match(build,/v251-navigation\.css/)
 assert.match(ws,/v19MilestoneOpen/)
 assert.match(ws,/v21ArchiveGroup/)
 assert.match(ws,/data-v20-role/)
 assert.match(ws,/data-v20-capture/)
 assert.match(ws,/Himanshu_Shukla_fullstack_Public\.pdf/)
 assert.match(ws,/Himanshu_Shukla_software_Public\.pdf/)
 assert.match(ws,/Himanshu_Shukla_ml_Public\.pdf/)
 assert.match(css,/prefers-reduced-motion:reduce/)
 assert.match(css,/forced-colors:active/)
})

test('keyboard-driven evidence drawer selection commits the same project as pointer selection',()=>{
 const atlas=read('v11-experience.js')
 assert.match(atlas,/const targetCase=tabButtons\[next\]\.dataset\.atlasTab/)
 assert.match(atlas,/selectCase\(targetCase,\{focus:true\}\)/)
 assert.match(atlas,/portfolio:case-selection/)
 assert.match(atlas,/detail:\{caseId:targetCase\}/)
 assert.match(ws,/doc\.addEventListener\("portfolio:case-selection"/)
})
