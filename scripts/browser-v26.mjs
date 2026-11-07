/**
 * Repeatable V26 browser regression. Optional dependency: playwright.
 * npm run verify remains dependency-free; install the browser locally only
 * when running this broader integration gate.
 *
 *   npm run build
 *   npm install --no-save --no-package-lock playwright@1.65.0
 *   npx playwright install chromium
 *   node scripts/browser-v26.mjs
 */
import assert from 'node:assert/strict'
import {createServer} from 'node:http'
import {readFile,stat} from 'node:fs/promises'
import {resolve,extname,sep} from 'node:path'

const dist=resolve(new URL('../dist/',import.meta.url).pathname)
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.mp4':'video/mp4','.svg':'image/svg+xml'}
const server=createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
  const candidate=resolve(dist,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname))
  if(!candidate.startsWith(dist+sep)){res.writeHead(403);res.end();return}
  const info=await stat(candidate)
  if(!info.isFile())throw new Error('Not a file')
  const bytes=await readFile(candidate)
  res.writeHead(200,{'content-type':MIME[extname(candidate)]||'application/octet-stream','content-length':bytes.length,'cache-control':'no-store'})
  res.end(bytes)
 }catch{res.writeHead(404);res.end('Not found')}
})
await new Promise(resolveReady=>server.listen(0,'127.0.0.1',resolveReady))
const origin='http://127.0.0.1:'+server.address().port+'/'
let browser
try{
 let chromium
 try{({chromium}=await import('playwright'))}
 catch{throw new Error('Browser dependency missing. Install with npm install --no-save --no-package-lock playwright@1.65.0 && npx playwright install chromium')}
 browser=await chromium.launch({headless:true,args:['--no-sandbox']})
 let assertions=0,viewports=0
 const check=(condition,message)=>{assert.ok(condition,message);assertions++}
 const open=async(path,viewport={width:1366,height:900})=>{
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'})
  const page=await ctx.newPage(),errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  await page.goto(origin+path,{waitUntil:'domcontentloaded',timeout:30000})
  await page.locator('.v20ProjectIntro').waitFor({timeout:12000})
  return{page,ctx,errors}
 }
 const readState=page=>page.evaluate(()=>({
  role:document.body.dataset.role,
  htmlRole:document.documentElement.dataset.role,
  selectedRole:document.querySelector('.v20RoleBar [data-v20-role][aria-pressed="true"]')?.dataset.v20Role,
  project:document.querySelector('#v20ProjectList [data-v20-project][aria-pressed="true"]')?.dataset.v20Project,
  tab:document.querySelector('.v20Tabs [data-v20-tab][aria-selected="true"]')?.dataset.v20Tab,
  resume:document.querySelector('#v20Resume')?.getAttribute('href'),
  caseId:document.querySelector('[data-atlas-tab][aria-selected="true"]')?.dataset.atlasTab,
  capture:document.querySelector('.v20Media figure img')?.getAttribute('src'),
  stage:document.querySelector('.v20Stages [data-v20-stage][aria-pressed="true"]')?.dataset.v20StageId,
  url:location.href
 }))
 {
  const {page,ctx,errors}=await open('?view=fullstack&project=our-hidden-universe&panel=media#v20-workspace')
  const initial=await readState(page)
  check(initial.role==='fullstack'&&initial.project==='our-hidden-universe','Initial Full-Stack state')
  await page.locator('.v20RoleBar [data-v20-role="software"]').click()
  let state=await readState(page)
  check(state.role==='software'&&state.htmlRole==='software'&&state.project==='newssources','Software role and project synchronized')
  check(state.resume.endsWith('software_Public.pdf')&&state.caseId==='news','Software resume and evidence align')
  await page.locator('#v20ProjectList [data-v20-project="mulyankan"]').click()
  await page.locator('.v20Tabs [data-v20-tab="media"]').click()
  const tray=page.locator('.v23CaptureTray>summary')
  if(await tray.count())await tray.click()
  if(await page.locator('[data-v20-capture="1"]').count())await page.locator('[data-v20-capture="1"]').click()
  const softwareCustom=await readState(page)
  await page.locator('.v20RoleBar [data-v20-role="ml"]').click()
  await page.locator('.v20Tabs [data-v20-tab="architecture"]').click()
  await page.locator('[data-v20-stage="2"]').click()
  const mlCustom=await readState(page)
  await page.locator('.v20RoleBar [data-v20-role="software"]').click()
  state=await readState(page)
  check(state.project==='mulyankan'&&state.tab==='media'&&state.capture===softwareCustom.capture,'Role-specific project and screenshot retained')
  await page.locator('.v20RoleBar [data-v20-role="ml"]').click()
  state=await readState(page)
  check(state.project==='earthbridge'&&state.tab==='architecture'&&state.stage===mlCustom.stage,'ML architecture state retained')
  await page.locator('.v20RoleBar [data-v20-role="fullstack"]').click()
  state=await readState(page)
  check(state.project===initial.project&&state.role==='fullstack'&&state.resume===initial.resume,'Full-Stack context restored')
  const before=page.url()
  await page.locator('.v20RoleBar [data-v20-role="software"]').hover()
  await page.waitForTimeout(270)
  state=await readState(page)
  check(state.role==='software'&&page.url()===before,'Role hover previews without URL write')
  await page.keyboard.press('Escape')
  state=await readState(page)
  check(state.role==='fullstack'&&state.project===initial.project&&page.url()===before,'Escape restores committed role and URL')
  check(errors.length===0,'No browser errors during role journey: '+errors.join('; '))
  await ctx.close()
 }
 {
  const {page,ctx,errors}=await open('?view=software&project=newssources&panel=architecture&stage=persistence#v20-workspace')
  let state=await readState(page)
  check(state.stage==='persistence'&&state.project==='newssources','Architecture deep link is deterministic')
  await page.locator('.v20RoleBar [data-v20-role="ml"]').click()
  await page.goBack({waitUntil:'domcontentloaded',timeout:10000}).catch(()=>null)
  await page.waitForTimeout(130)
  state=await readState(page)
  check(state.role==='software'&&state.project==='newssources'&&state.stage==='persistence','Back restores role, project and stage')
  check(errors.length===0,'No history/navigation browser errors: '+errors.join('; '))
  await ctx.close()
 }
 {
  const {page,ctx,errors}=await open('?view=fullstack&project=our-hidden-universe&panel=media#v20-workspace')
  await page.locator('.v21ArchiveGroup[data-archive-section="top"]').evaluate(e=>{e.open=true})
  await page.locator('#top [data-switch-role="software"]').first().click()
  const state=await readState(page)
  check(state.role==='software'&&state.selectedRole==='software','Legacy header role button delegates to new session')
  check(new URL(state.url).searchParams.get('view')==='software','Legacy role commits single correct URL')
  check(errors.length===0,'No legacy presentation errors: '+errors.join('; '))
  await ctx.close()
 }
 for(const [width,height] of [[320,700],[390,844],[768,1024],[850,800],[1065,900],[1440,900]]){
  const {page,ctx,errors}=await open('',{width,height})
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)
  check(overflow===0,'No horizontal overflow at width '+width+' (found '+overflow+')')
  check(errors.length===0,'No browser exceptions at width '+width+': '+errors.join('; '))
  viewports++
  await ctx.close()
 }
 console.log('V26 browser regression: PASS ('+assertions+' assertions; '+viewports+' viewports)')
}catch(error){console.error('V26 browser regression: FAIL',error.stack);process.exitCode=1}
finally{
 if(browser)await browser.close()
 await new Promise(resolveDone=>server.close(resolveDone))
}
