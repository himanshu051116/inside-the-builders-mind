import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')

test('no-JS fallback does not collapse a viewport-height margin through body',()=>{
 const src=read('styles/08-case-index.css')
 assert.match(src,/\.noJs\{max-width:740px;margin:0 auto;/)
 assert.doesNotMatch(src,/\.noJs\{max-width:740px;margin:12vh auto/)
 assert.match(src,/background:#f5f1e9/)
})

test('hidden archival screenshots never compete with hero image priority',()=>{
 const site=read('site.js')
 for(const asset of ['ohs-home.webp','news-overview.webp']){
   const s=site.indexOf('src="/evidence/'+asset+'"')
   assert.ok(s>0,asset)
   const fragment=site.slice(s-54,s+105)
   assert.match(fragment,/loading="lazy"/)
   assert.match(fragment,/fetchpriority="low"/)
   assert.doesNotMatch(fragment,/fetchpriority="high"/)
 }
})

test('capture tray loads original thumbnail bytes only after being opened',()=>{
 const media=read('v20-workspace.js')
 const quality=read('v23-quality.js')
 assert.match(media,/<img data-src="\$\{safe\(s\.path\)\}" loading="lazy" decoding="async" alt="">/)
 assert.match(quality,/const revealThumbs=\(\)=>/)
 assert.match(quality,/if\(!details\.isConnected\|\|!details\.open\)return/)
 assert.match(quality,/img\[data-src\]/)
 assert.match(quality,/img\.setAttribute\('src',path\)/)
 assert.match(quality,/img\.removeAttribute\('data-src'\)/)
 assert.match(quality,/details\.addEventListener\('toggle'/)
})

test('related architecture and screenshot annotations still resolve dormant thumbnails',()=>{
 const bridge=read('v204-evidence.js')
 const notes=read('v205-annotations.js')
 assert.match(bridge,/getAttribute\("data-src"\)/)
 assert.match(notes,/getAttribute\("data-src"\)/)
 assert.match(bridge,/pending/)
 assert.match(notes,/v205AnnotatedThumb/)
})

test('all original showcase and résumé components remain integrated',()=>{
 const main=read('site.js')
 assert.match(main,/setupMilestoneVideo\(\)/)
 assert.match(main,/setupV20Workspace\(projects\)/)
 assert.match(main,/setupV205Annotations\(\)/)
 assert.match(main,/setupV23Quality\(\)/)
 const home=read('v17-recruiter.js')
 assert.equal((home.match(/\.pdf"/g)||[]).length,3)
})
