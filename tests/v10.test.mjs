import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {resolve} from 'node:path'
import {projects,projectArchive} from '../content.js'
const root=resolve(import.meta.dirname,'..')
const source=readFileSync(resolve(root,'site.js'),'utf8')
const styles=readFileSync(resolve(root,'portfolio.css'),'utf8')
const index=readFileSync(resolve(root,'index.html'),'utf8')
const career=readFileSync(resolve(root,'career-modes.js'),'utf8')
const interactions=readFileSync(resolve(root,'v8-interactions.js'),'utf8')
test('recruiter identity presented in every specialization',()=>{
 assert.match(source,/const heroTracks = \[/)
 assert.match(source,/class="candidateIdentity"/)
 assert.match(source,/heroTracks.map/)
 assert.match(source,/Mathematics & Computing · MITS Gwalior · Class of 2028/)
})
test('four detailed code-backed case studies and all source-backed artifact links',()=>{
 for(const id of ['ohs','news','mulyankan','earthbridge'])assert.ok(source.includes(`id:'${id}'`))
 for(const host of ['our-hidden-universe','NewsSources','Algonauts-Mulyankan','earthbridge'])assert.ok(source.includes(host))
})
test('secondary archive is transparent about prototype limitations',()=>{
 assert.equal(projectArchive.length,3)
 assert.ok(projectArchive.some(x=>x.title==='IrisTrack'))
 assert.ok(projectArchive.some(x=>x.title==='Coal Governance'&&!x.link))
 assert.ok(projectArchive.some(x=>x.title==='Mulyankan Spatial Lab'))
})
test('ambiguous accuracy claim not shown as verified portfolio headline',()=>{
 assert.ok(!projects.find(p=>p.title==='EarthBridge').description.includes('90%'))
 assert.ok(!projects.find(p=>p.title==='EarthBridge').caseStudy.verification.includes('90%'))
})
test('single rendering owner for ML neighbors',()=>{
 assert.doesNotMatch(career,/RANKED_EXAMPLES|renderResearch/)
 assert.match(interactions,/function renderToy/)
})
test('production HTML uses consolidated CSS, static fallback and structured data',()=>{
 assert.match(index,/href="\/portfolio\.css"/)
 assert.doesNotMatch(index,/atelier-v5\.css|scene-v9\.css/)
 assert.match(index,/application\/ld\+json/)
 assert.match(index,/noJs/)
 assert.match(index,/rel="canonical"/)
 assert.ok(styles.length>40000)
})
test('mode-specific open graph PNGs and shareable routes are present',()=>{
 for(const mode of ['fullstack','software','ml']){
  assert.ok(existsSync(resolve(root,`public/social-${mode}.png`)))
  assert.ok(existsSync(resolve(root,`public/share/${mode}/index.html`)))
 }
})
test('robots and XML sitemap announce correct production origin',()=>{
 assert.match(readFileSync(resolve(root,'public/robots.txt'),'utf8'),/Sitemap:/)
 assert.match(readFileSync(resolve(root,'public/sitemap.xml'),'utf8'),/inside-the-builders-mind\.vercel\.app/)
})
test('all public role resume PDFs included',()=>{
 for(const role of ['fullstack','software','ml']){
  const pdf=readFileSync(resolve(root,`public/resumes/Himanshu_Shukla_${role}_Public.pdf`))
  assert.equal(pdf.subarray(0,4).toString(),'%PDF')
  assert.ok(pdf.length>4000)
 }
})
test('gallery view remains a functional toggle and source-image fallback exists',()=>{
 const extra=readFileSync(resolve(root,'v10-experience.js'),'utf8')
 assert.match(extra,/isGrid/)
 assert.match(extra,/imageSourceUnavailable/)
 assert.match(source,/galleryViewToggle/)
})
