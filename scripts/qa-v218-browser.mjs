import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const BASE=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:8172';
const results=[];
const test=async(name,cb)=>{try{const detail=await cb();results.push({name,ok:true,detail});console.log('PASS',name,typeof detail==='string'?detail:'')}catch(e){results.push({name,ok:false,error:String(e.message||e).slice(0,300)});console.log('FAIL',name,String(e.message||e).slice(0,200))}};
for(const width of [320,360,390,430,768,1024,1440]){
  await test('work width '+width,async()=>{
    const page=await browser.newPage({viewport:{width,height:850}});
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));
    await page.goto(BASE+'/work/',{waitUntil:'domcontentloaded'});
    await page.locator('#v20ProjectList button').first().waitFor({timeout:9000});
    await page.waitForTimeout(350);
    const m=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,feature:!!document.querySelector('.v214Spotlight'),image:document.querySelector('.v214Spotlight img')?.naturalWidth??0,rect:Math.round(document.querySelector('.v214Spotlight')?.getBoundingClientRect().top??-1)}));
    if(m.scroll>m.inner+2)throw Error('Horizontal overflow '+JSON.stringify(m));
    if(!m.feature)throw Error('Feature absent');
    if(errors.length)throw Error('JS errors '+errors.join(' | '));
    await page.close();return JSON.stringify(m);
  });
}
await test('search preview and zero results',async()=>{
const page=await browser.newPage({viewport:{width:390,height:800}});
await page.goto(BASE+'/work/');await page.locator('#v20ProjectList button').first().waitFor();
let original=await page.locator('.v20Inspector h3').first().innerText();
await page.locator('#v20Search').fill('PostgreSQL');await page.waitForTimeout(200);
let title=await page.locator('.v20Inspector h3').first().innerText();
if(!title.includes('NewsSources'))throw Error('search detail remained '+title);
await page.locator('#v20Search').fill('some__non_matching_tech_8472');await page.waitForTimeout(100);
let empty=await page.locator('.v20Inspector').innerText();if(!/No matching/i.test(empty))throw Error('no empty state: '+empty.slice(0,120));
await page.locator('#v20Search').fill('');let reset=await page.locator('.v20Inspector h3').first().innerText();
if(reset!==original)throw Error('clear search did not restore '+original+' got '+reset);
await page.close();return original+' -> '+title+' -> '+reset;});
await test('Home resumes + project rail',async()=>{
const p=await browser.newPage({viewport:{width:390,height:850}});await p.goto(BASE+'/');let val=await p.evaluate(()=>({resume:document.querySelectorAll('.v17ResumeChoices a').length,rails:[...document.querySelectorAll('.v19ProjectRail a')].filter(a=>getComputedStyle(a).display!=='none').length,railDisplay:getComputedStyle(document.querySelector('.v19ProjectRail')).display,redacted:!!document.querySelector('img[src="/evidence/mulyankan-overview.webp"]'),source:document.querySelector('.v17MainCTA')?.textContent?.trim()}));if(val.resume!==3||val.railDisplay==='none'||!val.redacted)throw Error(JSON.stringify(val));await p.close();return JSON.stringify(val);});
await test('Mulyankan screenshot zoom and escape',async()=>{
const p=await browser.newPage({viewport:{width:390,height:850}});
await p.goto(BASE+'/projects/mulyankan/');await p.locator('#v208ActiveImage').waitFor();
await p.locator('#v208ActiveImage').click();await p.waitForTimeout(170);
let state=await p.evaluate(()=>({dialog:!!document.querySelector('dialog.v217Viewer[open]'),anyDialog:[...document.querySelectorAll('dialog')].map(x=>({class:x.className,open:x.open})),img:document.querySelector('dialog.v217Viewer img')?.getAttribute('src')}));
if(!state.dialog)throw Error('zoom modal not open '+JSON.stringify(state));
await p.keyboard.press('Escape');await p.waitForTimeout(100);
if(await p.locator('dialog.v217Viewer[open]').count())throw Error('escape did not close modal');
await p.close();return JSON.stringify(state);});
await test('Mulyankan original videos load',async()=>{
const p=await browser.newPage({viewport:{width:390,height:850}});await p.goto(BASE+'/projects/mulyankan/');
const btn=p.locator('[data-v209-original-video]');await btn.waitFor();
await btn.click();await p.waitForTimeout(280);
const d=await p.evaluate(()=>({dialog:document.getElementById('v19MilestoneDialog')?.open,src:document.querySelector('.v19DialogVideo source')?.getAttribute('src'),video:document.querySelector('.v19DialogVideo')?.readyState,network:document.querySelector('.v19DialogVideo')?.networkState}));
if(!d.dialog||!d.src?.includes('mulyankan-system'))throw Error(JSON.stringify(d));await p.close();return JSON.stringify(d);});
await test('all six dossiers open and contain evidence trail',async()=>{
const p=await browser.newPage();const ids=['mulyankan','earthbridge','newssources','our-hidden-universe','sentinel','schoolbuddies'];const out=[];
for(const id of ids){const resp=await p.goto(BASE+'/projects/'+id+'/',{waitUntil:'domcontentloaded'});const v=await p.evaluate(()=>({trail:!!document.getElementById('v211-evidence-trail'),head:document.querySelector('h1')?.textContent?.trim(),errors:document.querySelectorAll('.v208MissingAsset').length}));out.push([id,resp.status(),v.trail]);if(resp.status()!==200||!v.trail)throw Error(JSON.stringify(out));}await p.close();return JSON.stringify(out);});
await test('static asset range loading',async()=>{
const p=await browser.newPage();const a=await p.request.get(BASE+'/video/mulyankan-system-walkthrough-presenter.mp4',{headers:{Range:'bytes=0-99'}});if(![200,206].includes(a.status()))throw Error('media GET status '+a.status());await p.close();return 'GET status '+a.status();});
await browser.close();fs.writeFileSync(process.env.V218_REPORT_PATH||'/tmp/v218-browser-report.json',JSON.stringify(results,null,2));console.log('TOTAL',results.length,'FAILED',results.filter(r=>!r.ok).length);process.exitCode=results.some(r=>!r.ok)?1:0;
