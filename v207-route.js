// V20.7: URL state normalization and guarded history writes for the V20 explorer.
// This module has no DOM ownership; the workspace remains the single route UI owner.
import {V26_ROLE_DEFAULTS} from './v26-project-data.js'
export const V207_ROLE_DEFAULTS=V26_ROLE_DEFAULTS
export const V207_PANELS=Object.freeze(['overview','media','architecture','evidence'])
const validProjectIds=ids=>new Set((Array.isArray(ids)?ids:[]).filter(x=>typeof x==='string'&&/^[a-z0-9-]+$/.test(x)))
const validDetail=x=>typeof x==='string'&&/^[a-z0-9-]{1,90}$/.test(x)
export function readV25DetailRoute(href){
  const url=new URL(href,'https://portfolio.invalid/')
  const rawStage=url.searchParams.get('stage'),rawCapture=url.searchParams.get('capture')
  return Object.freeze({
    stage:validDetail(rawStage)?rawStage:null,
    capture:validDetail(rawCapture)?rawCapture:null
  })
}


export function readV207Route(href,projectIds){
  const url=new URL(href,'https://portfolio.invalid/')
  const allowed=validProjectIds(projectIds)
  const incomingRole=url.searchParams.get('view')
  const role=Object.hasOwn(V207_ROLE_DEFAULTS,incomingRole)?incomingRole:'fullstack'
  const preferred=V207_ROLE_DEFAULTS[role]
  const requestedProject=url.searchParams.get('project')
  const project=allowed.has(requestedProject)?requestedProject:
    (allowed.has(preferred.project)?preferred.project:[...allowed][0]||null)
  const requestedPanel=url.searchParams.get('panel')
  const panel=V207_PANELS.includes(requestedPanel)?requestedPanel:preferred.panel
  return Object.freeze({role,project,panel,hash:url.hash})
}

export function commitV207Route(win,selection,{method='pushState'}={}){
  if(method!=='pushState'&&method!=='replaceState')throw new TypeError('Unsupported history method')
  const url=new URL(win.location.href)
  const role=Object.hasOwn(V207_ROLE_DEFAULTS,selection.role)?selection.role:'fullstack'
  const fallback=V207_ROLE_DEFAULTS[role]
  const project=/^[a-z0-9-]+$/.test(String(selection.project||''))?selection.project:fallback.project
  const panel=V207_PANELS.includes(selection.panel)?selection.panel:fallback.panel
  url.searchParams.set('view',role)
  url.searchParams.set('project',project)
  url.searchParams.set('panel',panel)
  // V25: one atomic URL write for the selected project, panel, stage and capture.
  // Omitted detail dimensions are left unchanged for older callers; the workspace
  // explicitly passes null to clear stale identifiers when switching views.
  for(const key of ['stage','capture']){
    if(!Object.hasOwn(selection,key))continue
    const detail=selection[key]
    if(validDetail(detail))url.searchParams.set(key,detail)
    else url.searchParams.delete(key)
  }
  const requestedHash=selection.hash
  url.hash=typeof requestedHash==='string'&&/^#[a-z0-9/-]{1,90}$/.test(requestedHash)?requestedHash:'#v20-workspace'
  const next=url.pathname+url.search+url.hash
  const before=new URL(win.location.href)
  if(next===before.pathname+before.search+before.hash)return Object.freeze({committed:true,changed:false,url:next})
  try{
    const previous=win.history.state
    const state=previous&&typeof previous==='object'&&!Array.isArray(previous)
      ? {...previous,v20:true} : {v20:true}
    win.history[method](state,'',next)
    const observed=new URL(win.location.href)
    if(observed.pathname+observed.search+observed.hash!==next)
      return Object.freeze({committed:false,changed:false,url:next,reason:'history-not-applied'})
    return Object.freeze({committed:true,changed:true,url:next})
  }catch{
    // Restricted/embedded browsers can deny a URL write. UI selection stays local.
    return Object.freeze({committed:false,changed:false,url:next,reason:'history-denied'})
  }
}
