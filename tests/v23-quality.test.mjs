import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {setupV23Quality} from '../v23-quality.js'
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8')
const workspace=read('v20-workspace.js')
const quality=read('v23-quality.js')
const styles=read('v23-quality.css')
const site=read('site.js')
const build=read('scripts/build.mjs')

test('project switching retains distinct screenshot, stage and tab context',()=>{
  for(const m of ['captureByProject','stageByProject','tabByProject']){
    assert.match(workspace,new RegExp('const .*'+m+'|'+m+'=new Map'))
    assert.match(workspace,new RegExp(m+'\\.get\\(id\\)'))
    assert.match(workspace,new RegExp(m+'\\.set\\(id,'))
  }
  assert.match(workspace,/chooseProject\(next,update=true,keepFocus=false\)/)
  assert.match(workspace,/chooseRole\(next,invokeLegacy=true,update=true\)/)
  assert.match(workspace,/hoverTimer=win\.setTimeout/)
  assert.match(workspace,/pointerType==="touch"/)
  assert.match(workspace,/emit\("replaceState"\)/)
})

test('source image is linked at native resolution, not replaced by mock visuals',()=>{
  assert.equal(typeof setupV23Quality,'function')
  assert.match(quality,/\^\\\/evidence/)
  assert.match(quality,/v23FullImage/)
  assert.match(quality,/a\.href=src/)
  assert.match(quality,/noopener noreferrer/)
  assert.match(quality,/portfolio:v20-render/)
  assert.doesNotMatch(quality,/Math\.random|canvas|data:image|autoplay/)
})

test('all screenshots remain available behind a genuine disclosure',()=>{
  assert.match(quality,/create\('details','v23CaptureTray'\)/)
  assert.match(quality,/create\('summary','v23CaptureSummary'\)/)
  assert.match(quality,/details\.append\(thumbs\)/)
  assert.match(quality,/const openTrays=new Map\(\)/)
  assert.match(quality,/details\.open=openTrays\.get\(key\)/)
  assert.match(quality,/openTrays\.set\(key,details\.open\)/)
  assert.match(styles,/v23CaptureSummary/)
  assert.match(styles,/focus-visible/)
})

test('single-bundle quality layer ships without removing existing role and video code',()=>{
  assert.match(build,/v23-quality\.css/)
  assert.match(build,/v23-quality\.js/)
  assert.match(site,/setupV23Quality\(\)/)
  assert.match(site,/setupMilestoneVideo\(\)/)
  assert.match(site,/setupV205Annotations\(\)/)
  assert.match(workspace,/Download matching résumé/)
  assert.match(styles,/prefers-reduced-motion:reduce/)
  assert.match(styles,/@media\(max-width:560px\)/)
})
