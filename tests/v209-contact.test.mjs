import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,statSync} from 'node:fs'

const root = new URL('../', import.meta.url)
const site = readFileSync(new URL('site.js',root),'utf8')
const css = readFileSync(new URL('v209-contact.css',root),'utf8')
const build = readFileSync(new URL('scripts/build.mjs',root),'utf8')

test('contact remains a single balanced grid with concise internship copy', () => {
  assert.match(site,/class="contactEditorial"/)
  assert.match(site,/Looking for a software intern\?/)
  assert.match(site,/Let’s talk\./)
  assert.doesNotMatch(site,/Seeking a software engineering intern\?/)
  assert.match(site,/href="\$\{safeURL\('mailto:'\+profile.email\)\}"/)
})
test('contact includes the original photo and a safe descriptive alt', () => {
  assert.match(site,/class="contactPortrait"/)
  assert.match(site,/src="\/images\/himanshu-contact.webp"/)
  assert.match(site,/loading="lazy" decoding="async"/)
  const asset = statSync(new URL('public/images/himanshu-contact.webp',root))
  assert.ok(asset.size > 3000 && asset.size < 100000, 'portrait should be optimized but visible')
})
test('responsive portrait layout ships in the single stylesheet', () => {
  assert.match(build,/v209-contact\.css/)
  assert.match(css,/@media\(max-width:700px\)/)
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/)
  assert.match(css, /object-fit:cover/)
})
