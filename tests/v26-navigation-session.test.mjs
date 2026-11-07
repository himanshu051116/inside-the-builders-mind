import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createV26RoleSessions} from '../v26-navigation-session.js'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const defaults={
 fullstack:{project:'our-hidden-universe',tab:'media'},
 software:{project:'newssources',tab:'architecture'},
 ml:{project:'earthbridge',tab:'evidence'}
}
const ids=['our-hidden-universe','newssources','earthbridge','mulyankan','schoolbuddies']

test('per-role sessions preserve complete project + panel + evidence context',()=>{
 const nav=createV26RoleSessions(defaults,ids,{role:'fullstack',project:'mulyankan',panel:'overview',capture:2,stage:1})
 assert.deepEqual(nav.select('fullstack'),{role:'fullstack',project:'mulyankan',panel:'overview',capture:2,stage:1})
 assert.deepEqual(nav.select('software'),{role:'software',project:'newssources',panel:'architecture',capture:0,stage:0})
 nav.remember({role:'ml',project:'mulyankan',panel:'media',capture:3,stage:2})
 nav.remember({role:'software',project:'our-hidden-universe',panel:'evidence',capture:1,stage:4})
 assert.deepEqual(nav.select('ml'),{role:'ml',project:'mulyankan',panel:'media',capture:3,stage:2})
 assert.deepEqual(nav.select('software'),{role:'software',project:'our-hidden-universe',panel:'evidence',capture:1,stage:4})
 assert.equal(nav.select('fullstack').project,'mulyankan')
})
test('snapshots are independent and restore all role views atomically',()=>{
 const nav=createV26RoleSessions(defaults,ids,{role:'fullstack',project:'our-hidden-universe',panel:'media'})
 const snapshot=nav.snapshot()
 nav.remember({role:'fullstack',project:'schoolbuddies',panel:'architecture'})
 nav.remember({role:'software',project:'mulyankan',panel:'media'})
 assert.equal(nav.select('fullstack').project,'schoolbuddies')
 assert.equal(nav.restore(snapshot),true)
 assert.equal(nav.select('fullstack').project,'our-hidden-universe')
 assert.equal(nav.select('software').project,'newssources')
 assert.equal(nav.restore(new Map([['fullstack',{role:'fullstack'}]])),false)
 assert.equal(nav.select('software').project,'newssources')
})
test('session keys are validated and cannot fabricate project states',()=>{
 const nav=createV26RoleSessions(defaults,ids,{role:'fullstack',project:'not-a-project',panel:'nonsense'})
 assert.equal(nav.select('fullstack').project,'our-hidden-universe')
 assert.equal(nav.select('fullstack').panel,'media')
 assert.equal(nav.remember({role:'unknown',project:'earthbridge',panel:'media'}),false)
 nav.remember({role:'ml',project:'bad-id',panel:'not-valid',capture:-1,stage:10.5})
 assert.deepEqual(nav.select('ml'),{role:'ml',project:'earthbridge',panel:'evidence',capture:0,stage:0})
 assert.equal(nav.select('invalid').role,'fullstack')
 const list=nav.list()
 assert.ok(Object.isFrozen(list))
 assert.ok(Object.isFrozen(list[0]))
 assert.equal(list.length,3)
})
test('workspace delegates role rendering by event, never clicking another navigation button',()=>{
 const workspace=read('v20-workspace.js')
 const modes=read('career-modes.js')
 const evidence=read('v11-experience.js')
 assert.match(workspace,/import \{createV26RoleSessions\}/)
 assert.match(workspace,/roleSessions\.remember\(/)
 assert.match(workspace,/roleSessions\.select\(role\)/)
 assert.match(workspace,/roleSessions\.snapshot\(\)/)
 assert.match(workspace,/roleSessions\.restore\(snapshot\.roleContexts\)/)
 assert.doesNotMatch(workspace,/querySelector\(`#top \[data-switch-role/)
 assert.match(workspace,/portfolio:apply-role-view/)
 assert.match(modes,/addEventListener\('portfolio:apply-role-view'/)
 assert.match(modes,/selectRole\(requested,false,false\)/)
 assert.match(evidence,/addEventListener\('portfolio:apply-role-view',syncProofRoutes\)/)
 assert.doesNotMatch(evidence,/data-switch-role.*addEventListener\('click',syncRole\)/)
})
test('route state remains controlled by workspace, not career presentation',()=>{
 const workspace=read('v20-workspace.js')
 const modes=read('career-modes.js')
 const build=read('scripts/build.mjs')
 assert.match(workspace,/commitV207Route/)
 assert.match(workspace,/portfolio:navigation-committed/)
 assert.match(modes,/if\(writeUrl&&document\.getElementById\('v20-workspace'\)\)/)
 assert.match(build,/v26-navigation-session\.js/)
 assert.match(workspace,/search\.value=snapshot\.searchValue/)
})

test('workspace and router use one canonical role and project-stage definition',async()=>{
 const data=await import('../v26-project-data.js')
 const route=await import('../v207-route.js')
 assert.equal(route.V207_ROLE_DEFAULTS,data.V26_ROLE_DEFAULTS)
 for(const [role,settings] of Object.entries(data.V26_ROLE_SETTINGS)){
   assert.equal(data.V26_ROLE_DEFAULTS[role].project,settings.project)
   assert.equal(data.V26_ROLE_DEFAULTS[role].panel,settings.tab)
   assert.match(settings.resume,/^\/resumes\/Himanshu_Shukla_[a-z]+_Public\.pdf$/)
   assert.ok(settings.order.length>=5)
 }
 for(const project of ids) {
   assert.ok(Array.isArray(data.V26_STAGE_FLOWS[project]))
   assert.ok(data.V26_STAGE_FLOWS[project].length>=4)
 }
 const ws=read('v20-workspace.js')
 const build=read('scripts/build.mjs')
 assert.match(ws,/V26_ROLE_SETTINGS as V20_SETTINGS/)
 assert.match(ws,/V26_STAGE_FLOWS as V20_FLOWS/)
 assert.match(build,/v26-project-data\.js/)
})
