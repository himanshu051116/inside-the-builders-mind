import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync, statSync} from 'node:fs'
import {milestoneClips} from '../v19-milestone-video.js'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const js=read('v19-milestone-video.js')
const css=read('v252-video.css')
const build=read('scripts/build.mjs')

test('silent preview reuses the real presenter-visible recording and never autoloads the whole video',()=>{
 assert.equal(milestoneClips.length,2)
 assert.match(js,/teaser.src=initialClip.video/)
 assert.match(js,/const previewSeconds=6/)
 assert.match(js,/teaser.currentTime>=previewSeconds/)
 assert.match(js,/teaser.currentTime=0/)
 assert.match(js,/<video class="v252SilentPreview" muted playsinline preload="none"/)
 assert.doesNotMatch(js,/<video[^>]*autoplay/)
 assert.match(js,/previewLoaded=false/)
 for(const clip of milestoneClips){
   assert.ok(statSync(new URL('../public'+clip.video,import.meta.url)).size>100_000)
 }
})

test('muted autoplay is only eligible in-view, visible tab, without reduced motion or data saving',()=>{
 assert.match(js,/new win.IntersectionObserver/)
 assert.match(js,/intersectionRatio>=0\.55/)
 assert.match(js,/if\(!inView\|\|dialog.open\|\|doc.hidden/)
 assert.match(js,/prefers-reduced-motion: reduce/)
 assert.match(js,/prefers-reduced-data: reduce/)
 assert.match(js,/connection\?\.saveData/)
 assert.match(js,/const autoplayEligible=/)
 assert.match(js,/teaser.muted=true/)
 assert.match(js,/teaser.defaultMuted=true/)
 assert.match(js,/teaser.playsInline=true/)
 assert.match(js,/previewToggle\.addEventListener\('click'/)
 assert.match(js,/userPaused=true;pausePreview\(\);updateToggle\(\)/)
 assert.match(js,/visibilitychange/)
 assert.match(js,/pagehide/)
 assert.match(js,/playbackAttempt/)
})

test('full recording retains explicitly initiated audio, native controls and original captions',()=>{
 assert.match(js,/aria-label="Watch the full recorded Mulyankan demonstration with original sound"/)
 assert.match(js,/aria-haspopup="dialog"/)
 assert.match(js,/<video class="v19DialogVideo" controls playsinline preload="none"/)
 assert.match(js,/video.muted=false/)
 assert.match(js,/const request=video.play\(\)/)
 assert.match(js,/video.pause\(\)/)
 assert.match(js,/if\(dialog.open\) dialog.close\(\)/)
 assert.match(js,/source.src=clip.video/)
 assert.match(js,/presenter camera and original audio/)
 assert.match(js,/not proof of live OCR or model accuracy/)
})

test('preview maintains poster, native pause affordance, focus and reduced-motion accessibility',()=>{
 assert.match(js,/class="v19MilestoneOpen"/)
 assert.match(js,/class="v252PreviewToggle" type="button" hidden aria-label="Pause muted preview"/)
 assert.match(js,/class="v252FullCTA"/)
 assert.match(js,/aria-hidden="true" disablepictureinpicture/)
 assert.match(css,/object-fit:contain/)
 assert.match(css,/v252SilentPreview/)
 assert.match(css,/v252PreviewPlaying/)
 assert.match(css,/v252PreviewToggle:focus-visible/)
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/)
 assert.match(css,/@media\(max-width:530px\)/)
 assert.match(build,/v252-video\.css/)
})
