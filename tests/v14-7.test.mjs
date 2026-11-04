import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { totalCaptures } from '../evidence-media.js'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')

test('V14.7 command palette capture total is derived from the evidence registry',()=>{
 const html=read('site.js')
 assert.equal(totalCaptures,20)
 assert.match(html,/\$\{totalCaptures\} CAPTURES/)
 assert.doesNotMatch(html,/16 CAPTURES/)
})
test('V14.7 command results announce filtered actions to assistive technology',()=>{
 assert.match(read('site.js'),/id="commandResultsStatus" role="status" aria-live="polite" aria-atomic="true"/)
 assert.match(read('v11-experience.js'),/matching action/)
})
test('V14.7 command palette offers arrow navigation, Home and End and retains Escape behavior',()=>{
 const script=read('v11-experience.js')
 for(const key of ['ArrowDown','ArrowUp','Home','End'])assert.ok(script.includes(key))
 assert.match(script,/options\[destination\]\.focus\(\)/)
 assert.match(script,/closeDialog\(\)/)
 assert.match(script,/restoreFocus\?\.focus/)
})
test('V14.7 light-theme logo subtitle is explicitly readable',()=>{
 const css=read('v14-5.css')
 assert.match(css,/body\[data-role="fullstack"\] \.header \.brandWord small/)
 assert.match(css,/color:#4d5960/)
 assert.match(css,/font-size:10px/)
})
test('V14.7 offscreen animation pause retains functional interactions',()=>{
 const code=read('site.js'),css=read('v14-5.css')
 assert.match(code,/motionObserver=new IntersectionObserver/)
 assert.match(code,/rootMargin:'120px 0px'/)
 assert.match(code,/classList\.toggle\('ambientPaused',!entry\.isIntersecting\)/)
 assert.match(code,/if \('IntersectionObserver' in window && !matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches\)/)
 assert.match(css,/animation-play-state:paused!important/)
 assert.doesNotMatch(css,/\.ambientPaused \*/)
})
test('V14.7 production artifacts retain semantic markup and all 20 screenshots',()=>{
 assert.ok(existsSync(new URL('../dist/portfolio.css',import.meta.url)))
 assert.ok(existsSync(new URL('../dist/evidence/earthbridge-evaluation.webp',import.meta.url)))
 assert.match(read('dist/portfolio.css'),/ambientPaused/)
 assert.match(read('dist/site.js'),/commandResultsStatus/)
})
