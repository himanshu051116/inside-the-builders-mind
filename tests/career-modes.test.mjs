import test from 'node:test'
import assert from 'node:assert/strict'
import {MODE_ORDER,MODE_NAMES} from '../career-modes.js'
import {projects} from '../content.js'
const projectIds=projects.map(project=>project.number)
for(const [mode,order] of Object.entries(MODE_ORDER)){
  test(`${mode} prioritizes five unique, existing projects`,()=>{
    assert.equal(order.length,projectIds.length)
    assert.deepEqual(new Set(order),new Set(projectIds))
    assert.equal(new Set(order).size,order.length)
  })
}
test('exactly three resume-based interfaces exist',()=>{
  assert.deepEqual(Object.keys(MODE_ORDER).sort(),['fullstack','ml','software'])
  assert.deepEqual(Object.keys(MODE_NAMES).sort(),['fullstack','ml','software'])
})
test('full-stack prioritizes the deployed collaboration application',()=>assert.equal(MODE_ORDER.fullstack[0],'03'))
test('software engineering prioritizes data ingestion',()=>assert.equal(MODE_ORDER.software[0],'04'))
test('ML research prioritizes EarthBridge',()=>assert.equal(MODE_ORDER.ml[0],'02'))
