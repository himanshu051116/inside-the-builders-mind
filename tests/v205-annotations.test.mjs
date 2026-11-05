import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {V205_ANNOTATIONS,setupV205Annotations} from '../v205-annotations.js'
const read=n=>readFileSync(new URL('../'+n,import.meta.url),'utf8')
const manifest=JSON.parse(read('public/evidence/manifest.json'))

test('annotations reference only real saved and inspected captures',()=>{
  assert.deepEqual(Object.keys(V205_ANNOTATIONS).sort(),['earthbridge-architecture','earthbridge-evaluation','mulyankan-overview','mulyankan-submission','news-claims','news-overview','ohs-home','ohs-together'].sort())
  for(const [id,record] of Object.entries(V205_ANNOTATIONS)){
    assert.ok(manifest[id],id);assert.ok(existsSync(new URL('../public'+manifest[id].path,import.meta.url)),id)
    assert.ok(record.ratio>1&&record.ratio<3)
    assert.ok(record.points.length>=3&&record.points.length<=4)
    for(const p of record.points){
      assert.ok(p.x>=2&&p.x<=98&&p.y>=2&&p.y<=98,id)
      assert.ok(p.title&&p.detail.length>70,id)
      if(p.stage!==undefined)assert.ok(Number.isInteger(p.stage)&&p.stage>=0&&p.stage<=3,"Invalid architecture stage "+id)
    }
  }
})
test('annotations are progressive and keep the unchanged screenshot source',()=>{
  assert.equal(typeof setupV205Annotations,'function')
  const js=read('v205-annotations.js'),css=read('v205-annotations.css')
  for(const s of ['portfolio:v20-render','v20Inspector','data-v20-tab','aria-pressed','ArrowLeft','ArrowRight'])assert.ok(js.includes(s),s)
  assert.match(css,/\.v205ImageFrame>img/)
  assert.match(css,/left:clamp\(22px,var\(--v205-x\),calc\(100% - 22px\)\)/)
  assert.match(css,/top:clamp\(22px,var\(--v205-y\),calc\(100% - 22px\)\)/)
  assert.match(css,/object-fit:contain!important/)
  for(const bad of ['fetch(','setInterval(','WebSocket','autoplay','XMLHttpRequest'])assert.ok(!js.includes(bad),bad)
})
test('CI keeps V20.4, original video records, three resumes, and original case content',()=>{
 const build=read('scripts/build.mjs'),site=read('site.js')
 assert.match(build,/'v204-evidence.css','v205-annotations.css'/)
 assert.match(build,/'v204-evidence.js','v205-annotations.js'/)
 assert.match(site,/setupV204Evidence\(\{projects\}\)\s*setupV205Annotations\(\)/)
 assert.match(site,/setupMilestoneVideo\(\)/)
 for(const pdf of ['fullstack','software','ml'])assert.ok(read('v17-recruiter.js').includes('Himanshu_Shukla_'+pdf+'_Public.pdf'))
})
test('mobile, keyboard and reduced-motion controls are accessible',()=>{
 const css=read('v205-annotations.css'),js=read('v205-annotations.js')
 for(const x of ['max-width:620px','focus-visible','prefers-reduced-motion','forced-colors'])assert.ok(css.includes(x),x)
 for(const x of ['aria-live','aria-label','keydown','[data-v205-action]'])assert.ok(js.includes(x),x)
})


test('V20.6 supplies meaningful stage-specific navigation without invented execution claims',()=>{
 const js=read('v205-annotations.js')
 assert.match(js,/data-v20-stage/)
 assert.match(js,/Inspect related architecture stage/)
 assert.match(js,/markAnnotatedThumbnails/)
 for(const id of ['mulyankan-overview','news-claims','earthbridge-architecture','ohs-home']){
   assert.ok(V205_ANNOTATIONS[id]?.points.every(p=>Number.isInteger(p.stage)),id)
 }
 const architecture=V205_ANNOTATIONS['earthbridge-architecture'].points.map(p=>p.stage)
 assert.deepEqual(architecture,[0,1,2])
 const css=read('v205-annotations.css')
 assert.match(css,/v205AnnotatedThumb/)
});
