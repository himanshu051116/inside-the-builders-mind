import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync,existsSync } from 'node:fs'
import { resolve } from 'node:path'
const root=resolve(import.meta.dirname,'..')
const read=p=>readFileSync(resolve(root,p),'utf8')
test('V14.3 build includes accessibility stylesheet after V14',()=>{
 const index=read('index.html')
 assert(index.includes('href="/portfolio.css"') && !index.includes('href="/v14.css"'))
 assert(read('scripts/build.mjs').includes("'v14-polish.css'"))
 assert(read('dist/portfolio.css').includes('.v143-control-min') || read('dist/portfolio.css').includes('--v143-control-min'))
})
test('V14.3 ensures compact project status and source links remain readable',()=>{
 const css=read('v14-polish.css')
 assert.match(css,/\.projectStatus\s*\{[^}]*font-size:13px!important/s)
 assert.match(css,/\.v14ProofFooter a,\.wbBottom a\s*\{[^}]*min-height:40px/s)
 assert.match(css,/\.captureMetaActions a,\.captureMetaActions button\s*\{[^}]*min-height:var\(--v143-control-min\)/s)
})
test('V14.3 fixes low contrast Full-Stack eyebrow without changing all modes',()=>{
 const css=read('v14-polish.css')
 assert.match(css,/body\[data-role="fullstack"\] \.v14RoleKicker\s*\{ color:#b13a20;/)
 assert.match(css,/:focus-visible/)
})
test('V14.3 social cards have canonical role-specific images and dimensions',()=>{
 const rootHtml=read('index.html')
 assert(rootHtml.includes('name="twitter:image"'))
 assert(rootHtml.includes('property="og:image:width" content="1200"'))
 for(const role of ['fullstack','software','ml']){
  const html=read(`public/share/${role}/index.html`)
  assert(html.includes(`/social-${role}.png`))
  assert(html.includes('property="og:image:alt"'))
  assert(html.includes(`share/${role}/`))
 }
})
test('V14.3 social images are actual 1200x630 PNG bytes',()=>{
 for(const role of ['fullstack','software','ml']){
  const buf=readFileSync(resolve(root,`public/social-${role}.png`))
  assert.equal(buf.toString('hex',0,8),'89504e470d0a1a0a')
  assert.equal(buf.readUInt32BE(16),1200)
  assert.equal(buf.readUInt32BE(20),630)
 }
})
test('V14.4 preloads only the actual initially selected role',()=>{
 const html=read('index.html')
 assert.match(html,/new URLSearchParams\(location.search\)/)
 assert.match(html,/fullstack:'\/evidence\/ohs-home.webp'/)
 assert.match(html,/software:'\/evidence\/news-overview.webp'/)
 assert.match(html,/if \(!image\) return/)
})
