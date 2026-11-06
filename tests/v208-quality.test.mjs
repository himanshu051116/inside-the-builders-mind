import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const hero=read('v17-recruiter.js')
const workspace=read('v20-workspace.js')
const roles=read('career-modes.js')
const quality=read('v208-quality.css')
const build=read('scripts/build.mjs')

test('V20.8 retains recruiter evidence and three distinct résumé downloads',()=>{
  assert.match(hero,/v17Proof/)
  assert.match(hero,/v17Essentials/)
  assert.match(hero,/Himanshu_Shukla_fullstack_Public\.pdf/)
  assert.match(hero,/Himanshu_Shukla_software_Public\.pdf/)
  assert.match(hero,/Himanshu_Shukla_ml_Public\.pdf/)
  assert.doesNotMatch(hero,/class="v19ProjectRail"/)
})

test('V20.8 previews workspace controls on fine-pointer hover without hijacking focus',()=>{
  assert.match(workspace,/\(hover: hover\) and \(pointer: fine\)/)
  assert.match(workspace,/workspace\.addEventListener\("pointerover"/)
  assert.match(workspace,/workspace\.addEventListener\("pointerout"/)
  assert.match(workspace,/chooseTab\(button\.dataset\.v20Tab,false,false\)/)
  assert.match(workspace,/emit\("replaceState"\)/)
  assert.match(workspace,/pointerType==="touch"/)
  assert.match(workspace,/requestAnimationFrame/)
  assert.match(workspace,/prefers-reduced-motion: reduce/)
  assert.doesNotMatch(workspace.slice(workspace.indexOf('const preview='),workspace.indexOf('workspace.addEventListener("pointerover"')),/data-v20-video/)
})

test('V20.8 preserves click and keyboard paths alongside role hover',()=>{
  assert.match(workspace,/workspace\.addEventListener\("click"/)
  assert.match(workspace,/workspace\.addEventListener\("keydown"/)
  assert.match(roles,/button\.addEventListener\('click'/)
  assert.match(roles,/button\.addEventListener\('pointerenter'/)
  assert.match(roles,/button\.addEventListener\('pointerleave'/)
  assert.match(workspace,/preview=ev\.detail\?\.preview===true/)
})

test('V20.8 styles compile in single CSS bundle, with mobile and accessibility rules',()=>{
  assert.match(build,/v208-quality\.css/)
  assert.match(quality,/@media\(max-width:730px\)/)
  assert.match(quality,/@media\(prefers-reduced-motion:reduce\)/)
  assert.match(quality,/@media\(forced-colors:active\)/)
})
