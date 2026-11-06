import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {readV25DetailRoute,commitV207Route} from '../v207-route.js'
import {setupV25SectionSync} from '../v25-section-sync.js'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
const workspace=read('v20-workspace.js')
const route=read('v207-route.js')
const nav=read('v21-interactions.js')
const atlas=read('v11-experience.js')
const content=read('content.js')
const css=read('v25-navigation.css')
const build=read('scripts/build.mjs')
function fakeWin(raw='https://test.invalid/?view=software&project=newssources&panel=architecture#v20-workspace'){
 let href=raw;const calls=[];
 const win={get location(){return {href}},history:{state:{preserve:true},
 pushState(state,unused,path){calls.push(['pushState',path,state]);href=new URL(path,href).href},
 replaceState(state,unused,path){calls.push(['replaceState',path,state]);href=new URL(path,href).href}}};
 return {win,calls,url:()=>new URL(href)};
}

test('stable stage and screenshot tokens read from validated routes',()=>{
 assert.deepEqual(readV25DetailRoute('https://test.invalid/?stage=persistence&capture=news-search-quality'),{stage:'persistence',capture:'news-search-quality'})
 assert.deepEqual(readV25DetailRoute('https://test.invalid/?stage=<script>&capture=%20invalid'),{stage:null,capture:null})
 assert.deepEqual(readV25DetailRoute('https://test.invalid/'),{stage:null,capture:null})
})
test('one history write commits project, panel, stage, capture and section target',()=>{
 const {win,url,calls}=fakeWin('https://test.invalid/?utm_source=referral#case-files');
 const result=commitV207Route(win,{role:'software',project:'newssources',panel:'architecture',stage:'persistence',capture:'news-search-quality',hash:'#case-news'},{method:'pushState'})
 assert.equal(result.committed,true)
 assert.equal(calls.length,1)
 assert.equal(calls[0][0],'pushState')
 const u=url()
 for(const [key,value] of [['utm_source','referral'],['view','software'],['project','newssources'],['panel','architecture'],['stage','persistence'],['capture','news-search-quality']])assert.equal(u.searchParams.get(key),value)
 assert.equal(u.hash,'#case-news')
 assert.deepEqual(calls[0][2],{preserve:true,v20:true})
})
test('explicitly null detail tokens are cleared without overwriting other query data',()=>{
 const {win,url}=fakeWin('https://test.invalid/?project=newssources&stage=persistence&capture=news-search-quality#v20-workspace');
 commitV207Route(win,{role:'ml',project:'earthbridge',panel:'evidence',stage:null,capture:null})
 assert.equal(url().searchParams.has('stage'),false)
 assert.equal(url().searchParams.has('capture'),false)
})
test('hover is preview-only, while clicks commit without losing pointer targets',()=>{
 const from=workspace.indexOf('const preview=(button)=>'),to=workspace.indexOf('workspace.addEventListener("pointerover"',from);
 assert.ok(from>=0&&to>from)
 assert.doesNotMatch(workspace.slice(from,to),/emit\(|commitSelection\(/)
 assert.match(workspace,/previewActive=true/)
 assert.match(workspace,/Keep this view ↗/)
 assert.match(workspace,/data-v25-commit/)
 assert.match(workspace,/list\.dataset\.signature!==signature/)
 assert.match(workspace,/list\.querySelectorAll\("\[data-v20-project\]"\)/)
 assert.match(workspace,/data-v20-stage-id/)
 assert.match(workspace,/data-v20-capture-id/)
 assert.match(workspace,/alignRouteDetail\(win\.location\.href\)/)
})
test('global hover previews do not mutate archive; explicit case clicks synchronize',()=>{
 assert.doesNotMatch(nav,/portfolio:archive-preview/)
 assert.match(atlas,/portfolio:case-selection/)
 assert.match(workspace,/portfolio:case-selection/)
 assert.match(workspace,/syncCaseHash\(win\.location\.hash\)/)
 assert.match(workspace,/emit\("replaceState",hash\)/)
})
test('project detail uses a canonical dossier and source links, not invented metrics',()=>{
 assert.match(workspace,/import \{caseDossiers\}/)
 assert.match(workspace,/v25EngineeringRecord/)
 assert.match(workspace,/record\.decision/)
 assert.match(workspace,/record\.tradeoff/)
 assert.match(workspace,/record\.reproducible/)
 assert.match(workspace,/record\.evidence/)
 assert.match(workspace,/v25ContextPath/)
 assert.match(workspace,/data-v25-copy/)
 assert.doesNotMatch(content,/title:'Sentinel'/)
})
test('active section indicator has no history ownership',()=>{
 const x=read('v25-section-sync.js')
 assert.equal(typeof setupV25SectionSync,'function')
 assert.match(x,/aria-current/)
 assert.match(x,/portfolio:navigation-committed/)
 assert.match(x,/requestAnimationFrame/)
 assert.doesNotMatch(x,/pushState|replaceState/)
 assert.match(css,/prefers-reduced-motion:reduce/)
 assert.match(build,/v25-navigation\.css/)
 assert.match(build,/v25-section-sync\.js/)
})
