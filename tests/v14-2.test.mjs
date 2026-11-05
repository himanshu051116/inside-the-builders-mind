import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { projectArchive, projects } from '../content.js'
const root = resolve(import.meta.dirname,'..')
const read = f => readFileSync(resolve(root,f),'utf8')
const site = read('site.js'), css=read('v14.css'), build=read('scripts/build.mjs')
test('V14.2 archive filter offers All, Full-Stack, Software and ML',()=>{
 for(const f of ['all','fullstack','software','ml']) assert.match(site,new RegExp(`data-archive-filter="${f}"`))
 assert.match(site,/function filterArchive\(role='all'\)/)
 assert.match(site,/card\.hidden=!match/)
 assert.match(site,/button\.setAttribute\('aria-pressed',String\(on\)\)/)
})
test('V14.2 archive stages retain the source descriptions rather than inventing statuses',()=>{
 for(const item of projectArchive)assert.ok(item.status&&item.summary&&item.lens.length)
 assert.match(site,/class="archiveStage"/)
 assert.match(site,/e\(item\.status\)/)
 assert.match(site,/stageForProject/)
 assert.ok(projects.some(p=>p.status.toLowerCase().includes('locally tested')))
})
test('V14.2 mobile one-click case-study and other-work shortcuts resolve',()=>{
 for(const anchor of ['case-files','work','archive','contact'])assert.match(site,new RegExp(`v142QuickJumps[^`+'`'+`]*#${anchor}`))
 assert.match(css,/\.v142QuickJumps a\{white-space:nowrap/)
})
test('V14.2 CSS source-owner modules reconstruct legacy stylesheet exactly',()=>{
 const modules=['01-base','02-workbench','03-atelier','04-experience','05-career','06-interactions','07-scenes','08-case-index','09-evidence-desk','10-screen-gallery','11-image-reader']
 assert.equal([modules.map(n=>read(`styles/${n}.css`)),['v14.css','v14-polish.css','v14-4.css','v14-5.css','v14-8.css'].map(read)].flat().join('\n'),read('portfolio.css'))
 assert.match(build,/const cssModules =/)
 assert.match(build,/writeFileSync\(join\(out,'portfolio\.css'\),combinedCss\)/)
})
test('V14.2 control states and focus are visible and responsive',()=>{
 assert.match(css,/\.archiveFilter\[aria-pressed=true\]/)
 assert.match(css,/:focus-visible\{outline:3px/)
 assert.match(css,/\.archiveControls\{display:grid;grid-template-columns:repeat\(2/)
 assert.match(css,/\.archiveFilter\{min-height:44px/)
})
test('V20 keeps selected-role images lazy while preserving accessible screenshots',()=>{
 assert.match(site,/data-hero-proof-open/)
 assert.match(read('career-modes.js'),/img.loading=isActive\?'eager':'lazy'/)
 assert.match(site,/imgAlt/)
 assert.doesNotMatch(read('index.html'),/Only preload a screenshot when it is the selected role/)
 assert.match(read('v20-workspace.js'),/if\(tab==="media"&&/)
})
test('V14.2 mobile navigation Escape returns focus',()=>{
 assert.match(site,/ev\.key==='Escape'&&nav\.classList\.contains\('navOpen'\)/)
 assert.match(site,/closeMenu\(\);menu\.focus\(\)/)
})
test('V14.2 does not remove the EarthBridge boundary and caveat',()=>{
 assert.match(site,/Verified images are pending/)
 assert.match(site,/not an ML performance chart/)
 assert.ok(existsSync(resolve(root,'public/evidence/ohs-home.webp')))
 assert.ok(existsSync(resolve(root,'public/evidence/news-overview.webp')))
})
