import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const root = new URL('../', import.meta.url)
const read = p => readFileSync(new URL(p, root), 'utf8')

test('V15 hero: each role leads with a concrete engineering problem', () => {
  const site = read('site.js')
  for (const phrase of [
    'Private rooms, shared playback, and messages that stay in sync.',
    'An article needs a source. Every update needs a trace.',
    'Search radar and multispectral imagery in one embedding space.'
  ]) assert.ok(site.includes(phrase), phrase)
  assert.doesNotMatch(site, /Built, not just imagined\.|Have a tricky idea\?|I build things\. Then prove them\./)
})

test('V15 role index links to the genuine four-case system without duplicating controls', () => {
  const site = read('site.js')
  assert.equal((site.match(/class="v15RecordRail"/g) || []).length, 1)
  assert.match(site, /href="#case-ohs"/)
  assert.match(site, /href="#case-news"/)
  assert.match(site, /href="#case-earthbridge"/)
  assert.match(site, /data-role-view/)
  assert.match(site, /data-switch-role/)
  assert.match(site, /id="commandDialog"/)
})

test('V15 project cards retain verification boundaries and interactive filters', () => {
  const site = read('site.js')
  const data = read('content.js')
  assert.match(site, /Implementation & limitations/)
  assert.match(site, /data-filter/)
  assert.match(site, /data-project/)
  assert.match(data, /Reported evaluation figures are attributed to the source repository/)
  assert.match(data, /No public demo link provided|Locally tested prototype/)
})

test('V15 styles are compiled after accessibility layers and preserve keyboard/reduced motion rules', () => {
  const css = read('v15-editorial.css')
  const build = read('scripts/build.mjs')
  assert.match(build, /'v14-8.css','v15-editorial.css'/)
  assert.match(css, /\.v15RecordRail/)
  assert.match(css, /#work #projectGrid\.isGrid/)
  assert.match(css, /@media\(max-width:760px\)/)
  assert.match(css, /prefers-reduced-motion:reduce/)
  assert.match(css, /forced-colors:active/)
  assert.match(css, /:focus-visible/)
  assert.ok(existsSync(new URL('dist/portfolio.css', root)))
  assert.match(read('dist/portfolio.css'), /v15RecordRail/)
})

test('V15 browser entry module and portfolio data parse before deploy', () => {
  for(const file of ['site.js','content.js','career-modes.js']){
    const result=spawnSync(process.execPath,['--check',new URL(file,root).pathname],{encoding:'utf8'})
    assert.equal(result.status,0,`${file} syntax error: ${result.stderr}`)
  }
})
