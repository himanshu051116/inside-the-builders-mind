import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync,statSync} from 'node:fs'
import {setupV20Workspace} from '../v20-workspace.js'
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8')
const code=read('v20-workspace.js'),site=read('site.js'),css=read('v20-workspace.css'),build=read('scripts/build.mjs')
const roleConfig=read('v26-project-data.js')
test('V20 preview is integrated after all V19 lifecycle hooks',()=>{
  assert.equal(typeof setupV20Workspace,'function')
  assert.match(site,/import \{ setupV20Workspace \} from '\.\/v20-workspace\.js'/)
  assert.match(site,/setupMilestoneVideo\(\)\s*setupV20Workspace\(projects\)/)
  assert.match(build,/'v19-hero-refinement\.css','v20-workspace\.css'/)
  assert.match(build,/'v20-workspace\.js'/)
})
test('all three role-specific visual identities and matching PDF routes remain intact',()=>{
 for(const mode of ['fullstack','software','ml'])assert.match(code,new RegExp('('+mode+')'))
 for(const pdf of ['fullstack','software','ml']) {
   const name='public/resumes/Himanshu_Shukla_'+pdf+'_Public.pdf'
   assert.ok(existsSync(new URL('../'+name,import.meta.url)),name)
   assert.ok(statSync(new URL('../'+name,import.meta.url)).size>4000)
   assert.ok(roleConfig.includes('/resumes/Himanshu_Shukla_'+pdf+'_Public.pdf'))
 }
 for(const x of ['data-v20-role','data-v20-project','data-v20-tab','data-v20-stage']) assert.ok(code.includes(x),x)
})
test('key highlights and original two presenter videos remain unchanged',()=>{
 const hero=read('v17-recruiter.js'),video=read('v19-milestone-video.js')
 for(const t of ['LEADERSHIP','AWARDS','TOOLS','Mulyankan','CMPDI Headquarters, Ranchi'])assert.ok(hero.includes(t),t)
 for(const name of ['mulyankan-system-walkthrough-presenter.mp4','mulyankan-docx-workflow-presenter.mp4']) {
   assert.ok(video.includes(name),name)
   assert.ok(existsSync(new URL('../public/video/'+name,import.meta.url)),name)
 }
 assert.match(code,/\.v19MilestoneOpen/)
})
test('legacy project records, original labs and case records are retained',()=>{
 for(const s of ['work','case-files','field-proof','archive','interactive-lab','about','toolkit','lab'])assert.ok(code.includes('"'+s+'"'),s)
 assert.match(code,/groupMap=new Map\(\)/)
 assert.match(code,/inner\.append\(direct\)/)
 assert.match(code,/\["project-notes","Project notes"/)
 assert.match(code,/\.append\(direct\)/)
 assert.match(code,/\.caseFileDetails/)
 const raw=read('content.js')
 for(const name of ['Our Hidden Universe','NewsSources','EarthBridge','Mulyankan','SchoolBuddies'])assert.ok(raw.includes(name),name)
})
test('archive deep links, no fabricated inference, and keyboard tabs remain',()=>{
 assert.match(code,/hashchange/)
 assert.match(code,/popstate/)
 assert.match(code,/pushState/)
 assert.match(code,/\.open=true/)
 assert.match(code,/ArrowRight/)
 assert.match(code,/not a live trace/)
 assert.match(code,/repository-reported, not independently verified/)
 assert.match(css,/prefers-reduced-motion/)
 assert.match(css,/forced-colors/)
 assert.match(css,/:focus-visible/)
 assert.match(css,/@media\(max-width:730px\)/)
})
