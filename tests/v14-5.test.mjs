import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { resolve } from 'node:path'
import { minifyCSS } from '../scripts/minify-css.mjs'
const root=resolve(import.meta.dirname,'..')
const read=p=>readFileSync(resolve(root,p),'utf8')
test('V14.5 CSS optimizer preserves quotes, calc math, values and combinator spaces',()=>{
 const original='/* removed */ .card .child { width: calc(100% - 2px); content: "A  B"; background: url("/img/this space.png") }'
 const result=minifyCSS(original)
 assert(!result.includes('removed'))
 assert(result.includes('.card .child'))
 assert(result.includes('calc(100% - 2px)'))
 assert(result.includes('"A  B"'))
 assert(result.includes('"/img/this space.png"'))
 assert.throws(()=>minifyCSS('/* unmatched'),/Unclosed CSS comment/)
})
test('V14.5 ships one CSS request while retaining organized source modules',()=>{
 const html=read('index.html')
 assert.deepEqual([...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map(m=>m[1]),['/portfolio.css'])
 const build=read('scripts/build.mjs')
 for(const file of ['v14.css','v14-polish.css','v14-4.css','v14-5.css'])assert(build.includes(`'${file}'`))
 assert(!readdirSync(resolve(root,'dist')).some(name=>name==='v14.css' || name==='v14-4.css'))
 assert(existsSync(resolve(root,'dist/portfolio.css')))
})
test('V14.5 source ownership cleanup is documented and source styles stay editable',()=>{
 const audit=JSON.parse(read('CSS_REMOVAL_AUDIT.json'))
 assert(audit.count>=300)
 assert(audit.removable_bytes>20000)
 assert(!read('portfolio.css').includes('.careerCTA{'))
 assert(read('portfolio.css').includes('.careerModeButton'))
 assert(read('portfolio.css').includes('.v14Hero'))
})
test('V14.5 actually shrinks the compiled CSS without removing existing themes',()=>{
 // Compare against the actual ordered source bundle, not the stale tracked legacy CSS.
 const cssModules=['01-base.css','02-workbench.css','03-atelier.css','04-experience.css','05-career.css','06-interactions.css','07-scenes.css','08-case-index.css','09-evidence-desk.css','10-screen-gallery.css','11-image-reader.css']
 const cssLayers=['v14.css','v14-polish.css','v14-4.css','v14-5.css','v14-8.css','v15-editorial.css','v16-screenwalk.css']
 const source=Buffer.from([...cssModules.map(n=>read(`styles/${n}`)),...cssLayers.map(read)].join('\n'))
 const dist=readFileSync(resolve(root,'dist/portfolio.css'))
 assert(dist.length<source.length)
 assert(gzipSync(dist).length<gzipSync(source).length)
 for(const marker of ['[data-role','v14Hero','careerModeButton','researchStage'])assert(dist.toString().includes(marker))
})
test('V14.5 dark navigation contrast correction is scoped by role',()=>{
 const css=read('v14-5.css')
 assert.match(css,/body\[data-role="software"\] \.header \.nav > a/)
 assert.match(css,/body\[data-role="ml"\] \.header \.nav > a/)
 assert.match(css,/prefers-reduced-motion/)
})
test('V14.5 production still contains all three public résumé PDFs and genuine evidence',()=>{
 for(const name of ['fullstack','software','ml'])assert(existsSync(resolve(root,`dist/resumes/Himanshu_Shukla_${name}_Public.pdf`)))
 for(const name of ['ohs-home.webp','news-overview.webp','mulyankan-overview.webp'])assert(existsSync(resolve(root,`dist/evidence/${name}`)))
})
