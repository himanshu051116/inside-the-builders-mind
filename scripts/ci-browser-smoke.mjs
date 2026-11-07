// Lightweight end-to-end release gate for the STATIC portfolio.
// Playwright is a pinned development-only dependency; it is not shipped to dist/.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const port=5378
const base=`http://127.0.0.1:${port}`
const server=spawn(process.execPath,['scripts/dev.mjs','dist'],{
  env:{...process.env,PORT:String(port)},
  stdio:'pipe'
})
let serverOutput=''
server.stderr.on('data',chunk=>{serverOutput+=String(chunk)})
server.stdout.on('data',chunk=>{serverOutput+=String(chunk)})

async function ready(){
  for(let i=0;i<75;i++){
    if(server.exitCode!==null)throw Error(`Server stopped: ${serverOutput}`)
    try{
      const res=await fetch(base+'/')
      if(res.ok)return
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,120))
  }
  throw Error(`Static server did not start: ${serverOutput}`)
}

const assetPaths=[
  '/portfolio.css',
  '/site.js',
  '/evidence/news-overview.webp',
  '/evidence/mulyankan-overview.webp',
  '/video/mulyankan-system-walkthrough-presenter.mp4',
  '/resumes/Himanshu_Shukla_fullstack_Public.pdf',
  '/resumes/Himanshu_Shukla_software_Public.pdf',
  '/resumes/Himanshu_Shukla_ml_Public.pdf'
]

let browser
try{
  await ready()
  browser=await chromium.launch({headless:true,args:['--no-sandbox']})
  let scenarios=0
  for(const [width,height] of [[1440,900],[390,844],[320,700]]){
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'})
    const page=await context.newPage()
    const errors=[]
    page.on('pageerror',err=>errors.push(err.message))
    page.on('response',res=>{
      if(res.url().startsWith(base)&&res.status()>=400)errors.push(`HTTP ${res.status()}: ${res.url()}`)
    })

    await page.goto(base+'/?view=software&project=newssources&panel=architecture&stage=persistence#v20-workspace',{waitUntil:'domcontentloaded'})
    await page.locator('#v20ProjectList [data-v20-project="newssources"]').waitFor()
    await page.locator('.v21ArchiveGroup').first().waitFor()
    assert.equal(await page.locator('#v20ProjectList [aria-pressed="true"]').getAttribute('data-v20-project'),'newssources')
    assert.equal(await page.locator('.v20Tabs [aria-selected="true"]').getAttribute('data-v20-tab'),'architecture')
    assert.equal(await page.locator('[data-v20-stage][aria-pressed="true"]').getAttribute('data-v20-stage-id'),'persistence')
    assert.equal(await page.locator('.v21ArchiveGroup').count(),10)
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=1),`Horizontal overflow at ${width}px`)
    scenarios++

    // Hovering over the archive must never expand content.
    const first=page.locator('[data-archive-section="top"]')
    await first.locator(':scope > summary').hover()
    await page.waitForTimeout(240)
    assert.equal(await first.evaluate(el=>el.open),false)
    await first.locator(':scope > summary').click()
    assert.equal(await first.evaluate(el=>el.open),true)
    const geometry=await first.evaluate(el=>{
      const inner=el.querySelector('.v21ArchiveContent')
      const heading=el.querySelector('summary')
      return {
        full:Math.abs(inner.scrollHeight-inner.clientHeight)<=2,
        overflow:getComputedStyle(inner).overflowY,
        pillWidth:heading.getBoundingClientRect().width
      }
    })
    assert.ok(geometry.full,`Nested/clipped scroll at ${width}px`)
    assert.equal(geometry.overflow,'visible')
    assert.ok(geometry.pillWidth<(width<=570?240:300),`Archive close chip too wide at ${width}px`)
    await page.locator('[data-archive-section="work"] > summary').click()
    await page.waitForFunction(()=>document.querySelectorAll('.v21ArchiveGroup[open]').length===1)
    await page.locator('[data-archive-section="work"] > summary').focus()
    await page.keyboard.press('Escape')
    await page.waitForFunction(()=>document.querySelectorAll('.v21ArchiveGroup[open]').length===0)
    scenarios++

    // Deliberate project changes must work with browser history.
    await page.locator('#v20ProjectList [data-v20-project="earthbridge"]').click()
    assert.equal(new URL(page.url()).searchParams.get('project'),'earthbridge')
    await page.goBack()
    await page.waitForTimeout(110)
    assert.equal(new URL(page.url()).searchParams.get('project'),'newssources')
    assert.equal(await page.locator('#v20ProjectList [aria-pressed="true"]').getAttribute('data-v20-project'),'newssources')
    scenarios++

    for(const path of assetPaths){
      const res=await page.request.get(base+path)
      assert.equal(res.status(),200,`Missing built asset: ${path}`)
    }
    scenarios++
    assert.deepEqual(errors,[],`Browser errors at ${width}px`)
    await context.close()
  }
  console.log(`Browser smoke passed: ${scenarios} scenarios across 1440px, 390px and 320px; ${assetPaths.length} assets per width.`)
}catch(err){
  console.error('Browser smoke failed:',err)
  process.exitCode=1
}finally{
  await browser?.close().catch(()=>{})
  server.kill('SIGTERM')
}
