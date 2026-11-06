import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {projects} from '../content.js'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const workspace=read('v20-workspace.js')
const site=read('site.js')
const hover=read('v21-interactions.js')
const css=read('v21-quality.css')
const build=read('scripts/build.mjs')

test('the removed security portfolio project cannot appear in the rendered project list',()=>{
  assert.equal(projects.length,5)
  assert.equal(projects.some(p=>p.title==='Sentinel'),false)
  assert.deepEqual(projects.map(p=>p.number),['01','02','03','04','05'])
  assert.doesNotMatch(workspace,/"sentinel"/)
  assert.doesNotMatch(site,/diagramSecurity/)
  assert.doesNotMatch(read('career-modes.js'),/Sentinel: locally tested prototype/)
})

test('archive sections are independently accessible and preserve real source sections',()=>{
  assert.match(workspace,/doc\.createElement\("section"\);archive\.className="v20Archive v21Archive"/)
  assert.match(workspace,/doc\.createElement\("details"\)/)
  for(const name of ['Work by focus','Selected projects','Architecture and trade-offs','Project notes','Captured interfaces','Additional projects']){
    assert.ok(workspace.includes('"'+name+'"'),name)
  }
  assert.match(workspace,/const showArchiveGroup=/)
  assert.match(workspace,/revealArchive\(hash,\{scroll:false\}\)/)
  assert.match(workspace,/target\.closest\("\.v21ArchiveGroup"\)/)
  assert.match(workspace,/case-\(ohs\|news\|mulyankan\|earthbridge\)/)
  assert.doesNotMatch(workspace,/targetId\.startsWith\("case-"\)/)
  assert.match(workspace,/gridNode\.hidden=false/)
  assert.doesNotMatch(workspace,/const archive=doc\.createElement\("details"\)/)
})

test('hover navigation and both filters have desktop previews and tap or keyboard fallbacks',()=>{
  assert.match(site,/setupV21Interactions\(\)/)
  assert.match(hover,/\.projectFilter/)
  assert.match(hover,/\.archiveFilter/)
  assert.doesNotMatch(hover,/portfolio:archive-preview/)\n  assert.match(workspace,/revealArchive/)
  assert.match(hover,/pointerenter/)
  assert.match(hover,/pointerleave/)
  assert.match(hover,/fineHover/)
  assert.match(hover,/focusin/)
  assert.match(hover,/\.v21ArchiveGroup > summary/)
  assert.match(css,/@media\(max-width:630px\)/)
  assert.match(css,/\.header \.brandWord small\{display:none\}/)
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/)
})

test('contact includes valid mailto, explicit copy affordance and retains portrait',()=>{
  assert.match(site,/v21EmailLink/)
  assert.match(site,/data-copy-email/)
  assert.match(site,/Portfolio%20enquiry/)
  assert.match(site,/src="\/images\/himanshu-contact\.webp"/)
  assert.match(hover,/navigator\?\.clipboard\?\.writeText/)
  assert.match(css,/#contact \.v21ContactActions/)
})

test('V21 is deployed through the existing single-bundle build',()=>{
  assert.match(build,/v21-quality\.css/)
  assert.match(build,/v21-interactions\.js/)
  assert.match(read('v17-recruiter.js'),/v208SelectedProjects/)
})
