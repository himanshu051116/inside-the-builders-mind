import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync,statSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')

test('V20.9 shares one recorded media player across Home, Work and dossier routes',()=>{
  const player=read('v19-milestone-video.js')
  const work=read('v20-workspace.js')
  const dossier=read('v208-project.js')
  const home=read('v208-home.js')
  for(const phrase of ['mountedPlayers=new WeakMap()','if(prior) return prior','if(card && meta)','mountedPlayers.set(doc,player)'])
    assert.ok(player.includes(phrase),phrase)
  assert.match(work,/setupMilestoneVideo\(doc\)/)
  assert.match(work,/player\.show\(\)/)
  assert.doesNotMatch(work,/#home \.v19MilestoneOpen/)
  assert.match(dossier,/setupMilestoneVideo\(document\)\.show\(\)/)
  assert.match(dossier,/dataset\.v209OriginalVideo/)
  assert.match(home,/v20-workspace\$/)
})

test('the original presenter recording and résumé assets are retained, not replaced',()=>{
  const video=read('v19-milestone-video.js')
  for(const file of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4']){
    assert.ok(video.includes(file),file)
    const path=new URL('../public/video/'+file,import.meta.url)
    assert.ok(existsSync(path),file)
    assert.ok(statSync(path).size>1000,file)
  }
  for(const name of ['fullstack','software','ml']){
    const path=new URL('../public/resumes/Himanshu_Shukla_'+name+'_Public.pdf',import.meta.url)
    assert.ok(existsSync(path))
    assert.equal(readFileSync(path).subarray(0,4).toString(),'%PDF')
  }
})

test('canonical project and Evidence indexes remain reachable without header bloat',()=>{
  const builder=read('scripts/build-v208.mjs')
  const work=read('v208-work.js')
  for(const route of ['/work/','/projects/','/evidence/','/lab/'])assert.ok(builder.includes(route),route)
  assert.match(work,/v209SecondaryNav/)
  assert.match(work,/related\.append\(projects,evidence\)/)
  assert.match(builder,/writeAt\(out,'evidence'/)
  assert.match(builder,/writeAt\(out,'projects'/)
})

test('capture annotations wait for a loaded image and ignore stale selection',()=>{
  const js=read('v208-project.js')
  assert.match(js,/let captureEpoch=0/)
  assert.match(js,/epoch!==captureEpoch/)
  assert.match(js,/img\.naturalWidth===0/)
  assert.match(js,/img\.onload=renderHotspots/)
  assert.match(js,/markers\.hidden=true/)
  assert.match(js,/This saved image is unavailable/)
})

test('V20 compatibility test asserts direct player API rather than hidden home trigger',()=>{
  const src=read('tests/v20-preview.test.mjs')
  assert.ok(src.includes('assert.match(code,/setupMilestoneVideo\\(doc\\)/)'))
  assert.ok(!src.includes('assert.match(code,/\\.v19MilestoneOpen/)'))
})
