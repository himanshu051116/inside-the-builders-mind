import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname,'..')
const markup=readFileSync(resolve(root,'site.js'),'utf8')
const css=readFileSync(resolve(root,'portfolio.css'),'utf8')
const logic=readFileSync(resolve(root,'scene-v9.js'),'utf8')
test('three scene-specific graphical experiences are present',()=>{
  for(const marker of ['studioSceneBanner','systemsFlowGraphic','researchTerrain','researchContactSheet'])
    assert.ok(markup.includes(marker),`Missing V9 visual ${marker}`)
})
test('systems visual graph activates existing reviewed stages',()=>{
  for(const value of ['discover','normalize','dedup','store'])
    assert.ok(markup.includes(`data-sys-stage="${value}"`))
  assert.match(logic,/data-pipeline-step/)
})
test('ML visual uses bundled explicitly synthetic artwork for all sensors',()=>{
  for(const name of ['optical','sar','multispectral']){
    assert.ok(existsSync(resolve(root,`public/visuals/terrain-${name}.svg`)))
    assert.match(css,new RegExp(`terrain-${name}\\.svg`))
  }
  assert.match(markup,/ILLUSTRATIVE ARTWORK/)
  assert.match(markup,/NOT running EarthBridge/)
})
test('V9 build is included in entrypoint and build manifest',()=>{
  const html=readFileSync(resolve(root,'index.html'),'utf8')
  const build=readFileSync(resolve(root,'scripts/build.mjs'),'utf8')
  assert.match(html,/portfolio\.css/)
  assert.match(markup,/setupSceneV9\(\)/)
  assert.match(build,/scene-v9\.js/)
  assert.match(build,/portfolio\.css/)
})
