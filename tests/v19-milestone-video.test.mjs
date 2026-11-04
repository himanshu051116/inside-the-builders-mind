import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync, statSync} from 'node:fs'
import {milestoneClips,setupMilestoneVideo} from '../v19-milestone-video.js'

const src=readFileSync(new URL('../v19-milestone-video.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../v19-milestone-video.css',import.meta.url),'utf8');

test('V19 preserves exactly two actual presenter-visible video clips and their posters',()=>{
  assert.equal(milestoneClips.length,2)
  assert.deepEqual(milestoneClips.map(c=>c.duration),['00:17','00:20'])
  for(const clip of milestoneClips){
    assert.match(clip.video,/^\/video\/[a-z0-9-]+\.mp4$/)
    assert.match(clip.poster,/^\/video\/[a-z0-9-]+\.jpg$/)
    const file=new URL('../public'+clip.video,import.meta.url)
    const poster=new URL('../public'+clip.poster,import.meta.url)
    assert.ok(statSync(file).size>100_000)
    assert.ok(statSync(poster).size>60_000)
  }
})
test('V19 stays inside existing milestone card and retains CMPDI/title/case link',()=>{
  assert.match(src,/querySelector\('#home \.v17Proof'\)/)
  assert.match(src,/querySelector\('\.v17ProofMeta'\)/)
  assert.match(src,/insertBefore\(region,meta\)/)
  assert.match(src,/href="#case-mulyankan"/)
  assert.doesNotMatch(src,/v18VideoSection|mulyankan-demo/)
})
test('V19 keeps webcam and original audio, not an autoplaying or fake system',()=>{
  assert.match(src,/Webcam and original audio preserved/)
  assert.match(src,/presenter camera and original audio/)
  assert.match(src,/SOURCE SNAPSHOT · OFFLINE ARCHITECTURE WALKTHROUGH/)
  assert.match(src,/not proof of live OCR or model accuracy/)
  assert.doesNotMatch(src,/<video[^>]*autoplay/)
  assert.match(src,/preload="none"/)
})
test('V19 dialog has accessible focus, lifecycle, media controls and error handling',()=>{
  for(const term of ['dialog.showModal()','video.pause()','visibilitychange','aria-labelledby','aria-pressed','v19DialogStatus','close.focus()','returnFocus.focus()','aria-haspopup="dialog"','video.addEventListener(\'error\''])assert.ok(src.includes(term),term)
  assert.equal(typeof setupMilestoneVideo,'function')
})
test('V19 styles use poster contain (never crop webcam), keyboard focus and mobile/reduced motion',()=>{
  assert.match(css,/object-fit:contain/)
  assert.match(css,/:focus-visible/)
  assert.match(css,/@media\(max-width:700px\)/)
  assert.match(css,/@media\(max-width:430px\)/)
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/)
  assert.match(css,/\.v19MilestoneDialog::backdrop/)
})
