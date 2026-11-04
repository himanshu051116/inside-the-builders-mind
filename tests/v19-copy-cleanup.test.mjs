import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {recruiterIntroMarkup} from '../v17-recruiter.js'
import {milestoneClips} from '../v19-milestone-video.js'
const src=readFileSync(new URL('../site.js',import.meta.url),'utf8')
const css=readFileSync(new URL('../v19-hero-refinement.css',import.meta.url),'utf8')
const home=recruiterIntroMarkup()
test('V19.3 uses short recruiter-specific text, not repeat slogans',()=>{
  assert.match(home,/I build React interfaces, Python data services/)
  assert.match(home,/Madhav Institute of Technology/)
  assert.match(home,/CMPDI Headquarters, Ranchi/)
  assert.doesNotMatch(home,/SELECTED ENGINEERING MILESTONE|OPEN THE EVIDENCE|THREE FOCUSES/)
  assert.doesNotMatch(src,/Building something that needs careful engineering|VERSION 14 · EVIDENCE FIRST|ALL PROJECTS VISIBLE BY DEFAULT/)
})
test('one project rail, one Mulyankan video proof, no duplicated milestone row',()=>{
  assert.equal((home.match(/class="v19ProjectRail"/g)||[]).length,1)
  assert.equal((src.match(/class="v15RecordRail"/g)||[]).length,0)
  assert.equal((src.match(/v144EditorialNote wrap/g)||[]).length,0)
  for(const anchor of ['#case-ohs','#case-news','#case-earthbridge','#case-mulyankan'])assert.ok(home.includes(anchor))
  assert.equal(milestoneClips.length,2)
  assert.deepEqual(milestoneClips.map(x=>x.duration),['00:17','00:20'])
})
test('factual limitations remain on published role-specific case studies',()=>{
  assert.match(src,/not independently rerun/)
  assert.match(src,/not independently reproduced/)
  assert.match(src,/crawler not running here/)
  assert.match(src,/fictional sample chat/)
  assert.match(src,/Local-only demos/)
  assert.match(src,/data-switch-role/)
  assert.match(src,/id="commandDialog"/)
})
test('responsive cleanup still keeps keyboard focus and media visible',()=>{
  assert.match(css,/@media\(max-width:630px\)/)
  assert.match(css,/@media\(max-width:900px\)/)
  assert.match(css,/#about \.aboutGrid/)
  assert.match(css,/#home \.v19ProjectRail/)
  assert.match(css,/forced-colors/)
})
