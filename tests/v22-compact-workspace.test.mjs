import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const main=read('v20-workspace.js')
const guide=read('v203-experience.js')
const evidence=read('v204-evidence.js')
const notes=read('v205-annotations.js')
const css=read('v22-compact-workspace.css')
const build=read('scripts/build.mjs')

test('screens lead with the original saved image and source status, not repeated copy',()=>{
 assert.match(main,/inspector\.dataset\.activeTab=tab/)
 assert.doesNotMatch(main,/Saved project captures, not a live application/)
 assert.match(main,/repository-reported, not independently verified/)
 assert.match(css,/data-active-tab="media"/)
 assert.match(css,/v20Media figure/)
 assert.match(css,/max-height:min\(37vh,370px\)/)
})

test('optional guide does not occupy space before the screenshot',()=>{
 assert.match(guide,/v203TourShortcut/)
 assert.match(guide,/if\(!open\)/)
 assert.match(guide,/return;/)
 assert.doesNotMatch(guide,/Start guided walkthrough →/)
 assert.doesNotMatch(guide,/panel\.append\(el\('p','v203Boundary'/)
})

test('screenshot notes default closed; markers are opt-in and data stays inspectable',()=>{
 assert.match(notes,/show=false/)
 assert.match(notes,/el\("details","v205AnnotationPanel"\)/)
 assert.match(notes,/el\("summary","v205Head"\)/)
 assert.match(notes,/show=panel\.open/)
 assert.match(notes,/thumbnails\|\|figure/)
 assert.match(notes,/V205_ANNOTATIONS\[currentCapture\]/)
 assert.match(css,/v205AnnotationPanel>summary/)
 assert.match(css,/v205AnnotationBody/)
})

test('architecture labels are not injected into the Screens tab',()=>{
 assert.match(evidence,/enhanceArchitecture\(\)/)
 assert.doesNotMatch(evidence,/^    enhanceMedia\(\);/m)
 assert.match(main,/data-v20-tab/)
 assert.match(main,/tab==="architecture"/)
 assert.match(main,/function evidence\(p\)/)
})

test('workspace is compact without compromising role tabs, PDF downloads, or mobile',()=>{
 assert.match(main,/Download matching résumé/)
 assert.match(main,/data-v20-role/)
 assert.match(css,/grid-template-columns:minmax\(195px,215px\)/)
 assert.match(css,/@media\(max-width:850px\)/)
 assert.match(css,/@media\(max-width:560px\)/)
 assert.match(build,/v22-compact-workspace\.css/)
})
