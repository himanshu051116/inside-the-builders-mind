/**
 * V26 navigation core — pure, DOM-free per-role session memory.
 * The workspace owns the active selection; this module owns the saved
 * navigation context for each specialization.  No URL writes, browser
 * storage, timers, or UI side effects are permitted here.
 */
export function createV26RoleSessions(defaults, allowedProjectIds, initial){
  const roles=Object.keys(defaults)
  const ids=new Set(allowedProjectIds)
  const validRole=r=>roles.includes(r)
  const validProject=p=>ids.has(p)
  const validTab=t=>['overview','media','architecture','evidence'].includes(t)
  const integer=n=>Number.isInteger(n)&&n>=0&&n<=9999?n:0
  const normalized=(role,selection)=>{
    const fallback=defaults[role]
    return Object.freeze({
      role,
      project: validProject(selection?.project)?selection.project:fallback.project,
      panel: validTab(selection?.panel)?selection.panel:fallback.tab,
      capture:integer(selection?.capture),
      stage:integer(selection?.stage)
    })
  }
  const sessions=new Map(roles.map(role=>[role,normalized(role,defaults[role])]))
  if(validRole(initial?.role)){
    sessions.set(initial.role,normalized(initial.role,initial))
  }
  return Object.freeze({
    remember(selection){
      if(!validRole(selection?.role))return false
      sessions.set(selection.role,normalized(selection.role,selection))
      return true
    },
    select(role){
      const key=validRole(role)?role:roles[0]
      const state=sessions.get(key)
      return Object.freeze({...state})
    },
    snapshot(){
      return new Map([...sessions].map(([k,v])=>[k,Object.freeze({...v})]))
    },
    restore(saved){
      if(!(saved instanceof Map))return false
      // All-or-nothing validation: avoid restoring partial or corrupt previews.
      if(saved.size!==roles.length||roles.some(role=>!saved.has(role)))return false
      const restored=new Map(roles.map(role=>[role,normalized(role,saved.get(role))]))
      for(const [key,value] of restored)sessions.set(key,value)
      return true
    },
    list(){return Object.freeze([...sessions.values()].map(x=>Object.freeze({...x})))}
  })
}
