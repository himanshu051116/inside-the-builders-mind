import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {V204_STAGE_CAPTURES,setupV204Evidence} from '../v204-evidence.js'
import {projects} from '../content.js'
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8')
const manifest=JSON.parse(read('public/evidence/manifest.json'))
const slug=t=>String(t).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

test('five project maps retain the four existing architecture stages',()=>{
 const actual=projects.map(p=>slug(p.title)).sort()
 assert.deepEqual(Object.keys(V204_STAGE_CAPTURES).sort(),actual)
 for(const [id,items] of Object.entries(V204_STAGE_CAPTURES)){
  assert.equal(items.length,4,id)
  for(const entry of items.filter(Boolean)){
   assert.ok(manifest[entry.id],entry.id)
   assert.ok(existsSync(new URL('../public'+manifest[entry.id].path,import.meta.url)),entry.id)
   assert.ok(entry.context.length>40,entry.id)
  }
 }
})
test('prototype gaps remain visible; unsupported projects never get fake captures',()=>{
 assert.ok(!Object.hasOwn(V204_STAGE_CAPTURES,'sentinel'))
 assert.equal(V204_STAGE_CAPTURES.newssources[1],null)
 assert.equal(V204_STAGE_CAPTURES.newssources[2],null)
})
test('enhancement connects to canonical tabs and does not invent simulation APIs',()=>{
 const js=read('v204-evidence.js')
 assert.equal(typeof setupV204Evidence,'function')
 for(const token of ['portfolio:v20-render','data-v20-tab','data-v20-stage','data-v20-capture','v20Inspector'])assert.ok(js.includes(token),token)
 for(const token of ['fetch(','XMLHttpRequest','WebSocket','setInterval(','requestAnimationFrame(','autoplay'])assert.ok(!js.includes(token),token)
 assert.match(js,/not an independently validated scoring result|not proof of a running news-ingestion backend/i)
})
test('V20.4 keeps V20.3 and video functionality in build',()=>{
 const build=read('scripts/build.mjs'),site=read('site.js')
 for(const file of ['v19-milestone-video.css','v203-experience.css','v203-screenfit.css','v204-evidence.css'])assert.ok(build.includes(file))
 for(const file of ['v203-experience.js','v204-evidence.js'])assert.ok(build.includes(file))
 assert.match(site,/setupV203Experience\(\{projects\}\)\s*setupV204Evidence\(\{projects\}\)/)
 assert.match(site,/setupMilestoneVideo\(\)/)
})
test('controls are keyboard accessible with responsive/focus boundaries',()=>{
 const css=read('v204-evidence.css')
 for(const token of ['focus-visible','prefers-reduced-motion','forced-colors','max-width:750px'])assert.ok(css.includes(token),token)
 const js=read('v204-evidence.js')
 assert.match(js,/type="button"|b.type="button"/)
})
