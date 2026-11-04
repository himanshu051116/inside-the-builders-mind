import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync,statSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root=new URL('../',import.meta.url)
const read=p=>readFileSync(new URL(p,root),'utf8')
const site=read('site.js'), css=read('v14.css'), html=read('index.html'), build=read('scripts/build.mjs'), career=read('career-modes.js')
const manifest=JSON.parse(read('public/evidence/manifest.json'))
test('V14 compact mode selection preserves three real specializations',()=>{
 assert.match(site,/v14ModeBar/)
 for(const mode of ['fullstack','software','ml'])assert.match(site,new RegExp(`id:'${mode}'`))
 assert.match(site,/heroTracks.map/)
 assert.match(career,/data-role-lab/)
})
test('Each hero gives recruiter identity and direct case-study action',()=>{
 assert.match(site,/v14IdentityTop/)
 assert.match(site,/Mathematics & Computing/)
 assert.match(site,/v14PrimaryActions/)
 assert.match(site,/href="#case-\$\{t.case\}"/)
 assert.match(site,/Download tailored résumé/)
})
test('Real project images lead OHS and NewsSources; ML explicitly does not fabricate a capture',()=>{
 for(const img of ['/evidence/ohs-home.webp','/evidence/news-overview.webp'])assert.ok(site.includes(img))
 assert.match(site,/Verified images are pending/)
 assert.match(site,/not an ML performance chart or genuine prediction output/)
})
test('Case-study entries are source-linked and accessible without gallery navigation',()=>{
 for(const id of ['ohs','news','mulyankan','earthbridge'])assert.ok(site.includes(`href="#case-${id}"`))
 const idx=site.indexOf('const caseFilesMarkup=')
 assert.ok(idx>0)
 assert.match(read('v11-experience.js'),/caseGrid.hidden=false/)
 assert.ok(site.includes('${caseFilesMarkup()}${evidenceGalleryMarkup()}'))
})
test('Creative simulations are separated into an explicitly optional laboratory',()=>{
 assert.match(site,/id="interactive-lab"/)
 assert.match(site,/v14LabDisclosure/)
 assert.match(site,/Local-only demos; they do not connect to the project backends or a trained model/)
})
test('Design tokens, font loading and readable controls are present',()=>{
 assert.match(css,/--v14-space-1/)
 assert.match(css,/--v14-font/)
 assert.match(html,/fonts.googleapis.com/)
 assert.match(build,/v14\.css/)
 assert.match(css,/min-height:48px/)
 assert.match(css,/prefers-reduced-motion/)
})
test('Every captured screenshot matches current integrity record after anonymization',()=>{
 assert.equal(Object.keys(manifest).length,20)
 for(const [id,entry] of Object.entries(manifest)){
  const p=new URL('public'+entry.path,root)
  const bytes=readFileSync(p)
  assert.equal(bytes.length,entry.bytes,id)
  assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,id)
  assert.ok(bytes.length<700000,id)
 }
 for(const id of ['mulyankan-history','mulyankan-overview'])assert.match(manifest[id].caption,/redacted/i)
 assert.match(read('evidence-media.js'),/Mulyankan proposal details are obscured/)
})
