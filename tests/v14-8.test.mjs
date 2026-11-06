import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
test('V20 defers archived EarthBridge image preload without fabricating retrieval results',()=>{
 const html=read('index.html')
 assert.doesNotMatch(html,/Only preload a screenshot when it is the selected role/)
 assert.match(read('v20-workspace.js'),/earthbridge/)
 assert.match(read('v20-workspace.js'),/win.fetch\("\/evidence\/manifest.json"\)/)
 assert.match(read('career-modes.js'),/img.loading=isActive\?'eager':'lazy'/)
 assert.match(read('site.js'),/Repository-reported metrics, not independently reproduced/)
})
test('V14.8 skip-to-content can place focus on the main landmark',()=>{
 assert.match(read('site.js'),/<main id="main" tabindex="-1">/)
 assert.match(read('site.js'),/href="#main" class="skipLink"/)
})
test('V14.8 preserves interactive state in forced-colors mode',()=>{
 const css=read('v14-8.css')
 assert.match(css,/@media \(forced-colors:active\)/)
 assert.match(css,/\[aria-pressed="true"\]/)
 assert.match(css,/\[aria-selected="true"\]/)
 assert.match(css,/Highlight/)
 assert.match(css,/:focus-visible/)
})
test('V14.8 improves meaningful pipeline captions and dark theme system labels',()=>{
 const css=read('v14-8.css')
 assert.match(css,/body\[data-role="software"\] \.sysFlowNode em/)
 assert.match(css,/\.sectionFloatingNo/)
})
test('V14.8 ships the accessibility layer in one compiled stylesheet',()=>{
 assert.match(read('scripts/build.mjs'),/'v14-8.css'/)
 assert.ok(existsSync(new URL('../dist/portfolio.css',import.meta.url)))
 assert.match(read('dist/portfolio.css'),/forced-colors:active/)
})
