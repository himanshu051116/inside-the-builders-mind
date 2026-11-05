import test from 'node:test'
import assert from 'node:assert/strict'
import {readV207Route,commitV207Route,V207_ROLE_DEFAULTS,V207_PANELS} from '../v207-route.js'
import {readFileSync} from 'node:fs'

const IDS=['our-hidden-universe','newssources','earthbridge','mulyankan','schoolbuddies','sentinel']
function mockWin(raw='https://portfolio.test/?view=fullstack&project=our-hidden-universe&panel=media#v20-workspace',opts={}){
  let href=raw
  const calls=[]
  const win={get location(){return {href}},history:{state:{external:'retained'},pushState(state,_unused,path){
    calls.push({method:'pushState',state,path})
    if(opts.throwHistory)throw Error('blocked')
    if(!opts.noOpHistory)href=new URL(path,href).href
  },replaceState(state,_unused,path){
    calls.push({method:'replaceState',state,path})
    if(opts.throwHistory)throw Error('blocked')
    if(!opts.noOpHistory)href=new URL(path,href).href
  }}}
  return {win,calls,getHref:()=>href}
}

test('all three role defaults and four canonical inspection panels remain',()=>{
  assert.deepEqual(Object.keys(V207_ROLE_DEFAULTS).sort(),['fullstack','ml','software'])
  assert.deepEqual(V207_PANELS,['overview','media','architecture','evidence'])
  for(const [role,defaults] of Object.entries(V207_ROLE_DEFAULTS)){
    const a=readV207Route('https://portfolio.test/?view='+role,IDS)
    assert.equal(a.role,role);assert.equal(a.project,defaults.project);assert.equal(a.panel,defaults.panel)
  }
})
test('supplied project/media URL retains its legacy case hash',()=>{
  assert.deepEqual(readV207Route('https://portfolio.test/?utm_source=chatgpt.com&view=fullstack&project=our-hidden-universe&panel=media#case-files',IDS),{role:'fullstack',project:'our-hidden-universe',panel:'media',hash:'#case-files'})
})
test('invalid routes normalize safely without inventing a project',()=>{
  assert.deepEqual(readV207Route('https://portfolio.test/?view=ml&project=missing&panel=fake',IDS),{role:'ml',project:'earthbridge',panel:'evidence',hash:''})
  assert.equal(readV207Route('https://portfolio.test/?view=ml',[]).project,null)
})
test('a chosen project can appear under another role',()=>{
  assert.equal(readV207Route('https://portfolio.test/?view=software&project=mulyankan&panel=media',IDS).project,'mulyankan')
})
test('history updates preserve unrelated query data and prior state',()=>{
  const {win,calls,getHref}=mockWin('https://portfolio.test/?utm_source=chatgpt.com#case-files')
  const out=commitV207Route(win,{role:'software',project:'newssources',panel:'architecture'})
  assert.equal(out.committed,true);assert.equal(calls.length,1)
  assert.deepEqual(calls[0].state,{external:'retained',v20:true})
  const url=new URL(getHref());assert.equal(url.searchParams.get('utm_source'),'chatgpt.com')
  assert.equal(url.searchParams.get('project'),'newssources');assert.equal(url.hash,'#v20-workspace')
})
test('repeat selections do not make duplicate history entries',()=>{
  const {win,calls}=mockWin()
  assert.equal(commitV207Route(win,{role:'fullstack',project:'our-hidden-universe',panel:'media'}).changed,false)
  assert.equal(calls.length,0)
})
test('panel selections can replace the current history record',()=>{
  const {win,calls}=mockWin()
  assert.equal(commitV207Route(win,{role:'fullstack',project:'our-hidden-universe',panel:'evidence'},{method:'replaceState'}).committed,true)
  assert.equal(calls[0].method,'replaceState')
})
test('denied history does not claim a successful shareable URL update',()=>{
  const {win}=mockWin(undefined,{throwHistory:true})
  assert.equal(commitV207Route(win,{role:'ml',project:'earthbridge',panel:'evidence'}).reason,'history-denied')
})
test('silent no-op history is detected as well',()=>{
  const {win}=mockWin(undefined,{noOpHistory:true})
  assert.equal(commitV207Route(win,{role:'ml',project:'earthbridge',panel:'evidence'}).reason,'history-not-applied')
})
test('malformed role/panel/project values are not written into the URL',()=>{
  const {win,getHref}=mockWin()
  commitV207Route(win,{role:'<img>',project:'javascript:alert(1)',panel:'__proto__'})
  const url=new URL(getHref())
  assert.equal(url.searchParams.get('view'),'fullstack')
  assert.equal(url.searchParams.get('project'),'our-hidden-universe')
  assert.equal(url.searchParams.get('panel'),'media')
})
test('unsupported history method is rejected before navigation',()=>{
  const {win,calls}=mockWin()
  assert.throws(()=>commitV207Route(win,{role:'ml'},{method:'erase'}),TypeError)
  assert.equal(calls.length,0)
})
test('V20 retains its data and legacy navigation but delegates URL semantics to one helper',()=>{
  const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8')
  const ws=read('v20-workspace.js'),career=read('career-modes.js'),build=read('scripts/build.mjs')
  assert.match(ws,/readV207Route\(win.location.href,ids\)/)
  assert.match(ws,/commitV207Route\(win,/)
  assert.match(ws,/win.addEventListener\("popstate"/)
  assert.match(ws,/initialRoute.hash/)
  assert.match(ws,/portfolio:v20-render/)
  assert.match(ws,/v19MilestoneOpen/)
  assert.match(career,/if\(!document.getElementById\('v20-workspace'\)\)/)
  assert.match(build,/'v207-route.js'/)
})
