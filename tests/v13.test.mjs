import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { SCREEN_RECORDS, evidenceGalleryMarkup } from '../evidence-media.js'
const root=new URL('../',import.meta.url)
const read=name=>readFileSync(new URL(name,root),'utf8')
const data=JSON.parse(read('public/evidence/manifest.json'))
const media=read('evidence-media.js'),css=read('portfolio.css'),site=read('site.js')

test('Every author-supplied capture has accurate file metadata and SHA-256',()=>{
  assert.equal(Object.keys(data).length,20)
  for(const [id,meta] of Object.entries(data)){
    const file=readFileSync(new URL('public'+meta.path,root))
    assert.equal(file.length,meta.bytes,`${id} filesize`)
    assert.equal(createHash('sha256').update(file).digest('hex'),meta.sha256,`${id} integrity`)
    assert.ok(meta.width>900&&meta.height>800,`${id} intrinsic image dimensions`)
    assert.equal(meta.path,`/evidence/${id}.webp`)
  }
})
test('Every screenshot has unique, inspectable visible claim and validation boundary',()=>{
  assert.deepEqual(Object.keys(SCREEN_RECORDS).sort(),Object.keys(data).sort())
  for(const record of Object.values(SCREEN_RECORDS)){
    assert.ok(record.kind.length>=10)
    assert.ok(record.shows.length>30)
    assert.ok(record.boundary.length>30)
  }
  assert.match(SCREEN_RECORDS['ohs-home'].boundary,/redact/i)
  assert.match(SCREEN_RECORDS['news-search-quality'].boundary,/not a successful measured/)
  assert.match(SCREEN_RECORDS['mulyankan-spatial-inspect'].boundary,/not observed/)
  assert.match(SCREEN_RECORDS['schoolbuddies-workshop'].boundary,/not measured proof/)
})
test('Evidence gallery provides a shareable, accessible visual inspection experience',()=>{
  const html=evidenceGalleryMarkup()
  for(const token of ['data-capture-shows','data-capture-boundary','data-capture-prev-inline','data-capture-next-inline','data-capture-copy','data-capture-original','data-capture-count','aria-live="polite"'])assert.ok(html.includes(token),token)
  assert.match(media,/readHash\(\)/)
  assert.match(media,/const validImage=/)
  assert.match(media,/history\.replaceState/)
  assert.match(media,/navigator\.clipboard\?\.writeText/)
  assert.match(media,/Clipboard unavailable/)
  assert.match(media,/main\.width=screenDimensions\[id\]\[0\]/)
  assert.match(css,/\.captureInspect/)
})
test('V14.6 keeps real images as lead evidence without fabricating retrieved matches',()=>{
  for(const id of ['ohs-home','news-overview'])assert.match(site,new RegExp(`src="/evidence/${id}\\.webp"`))
  assert.match(site,/fetchpriority="high"/)
  assert.match(site,/v17Recruiter|recruiterIntroMarkup/)
  assert.equal(Object.keys(data).filter(id=>id.startsWith('earthbridge-')).length,4)
  assert.match(media,/A genuine query with ranked satellite-image matches is still needed/)
})
test('Explicit hero image height auto prevents portrait-style unused vertical space',()=>{
  assert.match(css,/\.heroRealImage img\{[^}]*width:100%;height:auto;/)
  assert.match(site,/width="1606" height="1021" fetchpriority="high"/)
  assert.match(site,/width="1642" height="1048" fetchpriority="high"/)
})
