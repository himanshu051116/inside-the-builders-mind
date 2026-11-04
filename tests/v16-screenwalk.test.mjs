import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { screenwalkScenes } from '../v16-screenwalk.js'

const root = new URL('../', import.meta.url)
const css = readFileSync(new URL('v16-screenwalk.css', root), 'utf8')
const js = readFileSync(new URL('v16-screenwalk.js', root), 'utf8')

test('every scene reuses a real evidence-gallery id instead of synthetic output', () => {
  assert.deepEqual(Object.keys(screenwalkScenes), ['fullstack', 'software', 'ml'])
  const all = Object.values(screenwalkScenes).flat()
  assert.equal(all.length, 8)
  assert.equal(new Set(all.map(s => s.id)).size, all.length)
  for(const scene of all) {
    assert.match(scene.id,/^[a-z-]+$/)
    assert.ok(scene.title && scene.short && scene.alt && scene.description)
  }
  assert.deepEqual(screenwalkScenes.fullstack.map(s=>s.id),['ohs-home','ohs-together'])
  assert.deepEqual(screenwalkScenes.software.map(s=>s.id),['news-overview','news-claims','news-search-quality'])
  assert.deepEqual(screenwalkScenes.ml.map(s=>s.id),['earthbridge-evaluation','earthbridge-architecture','earthbridge-workbench'])
})

test('research evidence boundaries and offline states remain clear',()=>{
  const ml = screenwalkScenes.ml.map(s=>s.description).join(' ')
  assert.match(ml,/not an independently repeated evaluation/)
  assert.match(ml,/not live model inference/)
  assert.match(ml,/API offline/)
  assert.match(screenwalkScenes.fullstack[0].description,/fictional/)
  assert.match(screenwalkScenes.software[1].description,/insufficiently evidenced/)
})

test('all controls are keyboard-operated and no tour autoplays',()=>{
  assert.match(js,/role', 'tablist'/)
  assert.match(js,/ArrowRight/)
  assert.match(js,/ArrowLeft/)
  assert.match(js,/Home/)
  assert.match(js,/End/)
  assert.match(js,/addEventListener\('click'/)
  assert.match(js,/visibilitychange/)
  assert.match(js,/if \(reducedMotion \|\| timer !== null\) return/)
  assert.match(js,/if \(timer !== null\) stop\(\); else start\(\);/)
  assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|\.send\(/)
})

test('progressive disclosure preserves original source links and status',()=>{
  assert.ok(js.includes("detailsArea?.querySelector('.v14TechRow')"))
  assert.ok(js.includes("detailsArea?.querySelector('.v14ProofFooter')"))
  assert.match(js,/details\.append\(stack\)/)
  assert.match(js,/details\.append\(proof\)/)
  assert.match(js,/data-hero-proof-open/)
  assert.match(js,/imageButton\.dataset\.heroProofOpen = shot\.id/)
})

test('responsive, motion, contrast and focus styles are present',()=>{
  assert.match(css,/@media\(max-width:760px\)/)
  assert.match(css,/@media\(max-width:440px\)/)
  assert.match(css, /prefers-reduced-motion:reduce/)
  assert.match(css, /forced-colors:active/)
  assert.match(css, /:focus-visible/)
  assert.match(css, /#work #projectGrid\.isGrid/)
  assert.ok(existsSync(new URL('dist/portfolio.css', root)))
})

test('V16 is wired into the real portfolio build and activated after evidence handlers',()=>{
 const site=readFileSync(new URL('site.js',root),'utf8');
 const build=readFileSync(new URL('scripts/build.mjs',root),'utf8');
 assert.match(site,/import \{ setupScreenwalk \} from '\.\/v16-screenwalk\.js'/);
 assert.match(site,/setupEvidenceGallery\(\)\s*setupScreenwalk\(\)/);
 assert.match(build,/'v15-editorial\.css','v16-screenwalk\.css'/);
 assert.match(build,/'v16-screenwalk\.js'/);
 assert.match(js,/panel\.after\(controls\)/);
});
