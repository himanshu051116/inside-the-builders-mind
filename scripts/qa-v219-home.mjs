import {chromium} from 'playwright';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const base=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:8173';
const checks=[];
async function check(label,work){try{const value=await work();checks.push({label,ok:true,value});console.log('PASS',label,JSON.stringify(value).slice(0,300));}catch(err){checks.push({label,ok:false,error:String(err).slice(0,500)});console.log('FAIL',label,String(err).slice(0,400));}}
for(const width of [320,360,390,430,768,1024,1440]){
 await check('Home responsive '+width,async()=>{
  const p=await browser.newPage({viewport:{width,height:900}});
  const errs=[];p.on('pageerror',x=>errs.push(String(x)));
  const res=await p.goto(base+'/',{waitUntil:'networkidle'});
  const data=await p.evaluate(()=>{
   const t=document.querySelector('.v219FocusTabs');
   const h=document.querySelector('#home h1');
   return {status:document.readyState,scroll:document.documentElement.scrollWidth,viewport:innerWidth,tabs:t?.getBoundingClientRect().width,name:h?.textContent?.trim(),tabCount:t?.querySelectorAll('button').length,sectionCount:document.querySelectorAll('.v208RoleGrid').length,proof:!!document.querySelector('.v19MilestoneOpen'),resumes:document.querySelectorAll('.v17ResumeChoices a').length}
  });
  if(res.status()!==200||data.scroll>width+2||data.tabCount!==3||data.sectionCount!==0||data.resumes!==3||!data.proof||errs.length)throw Error(JSON.stringify({data,errs}));
  await p.close();return data;
 });
}
await check('Hover changes the mode without click or navigation',async()=>{
 const p=await browser.newPage({viewport:{width:1440,height:900}});await p.goto(base+'/',{waitUntil:'networkidle'});
 const starting=p.url();await p.locator('#v219TabSoftware').hover();await p.waitForTimeout(70);
 const software=await p.evaluate(()=>({sel:document.querySelector('#home').dataset.v219Selected,href:document.querySelector('.v17MainCTA').getAttribute('href'),text:document.querySelector('#v219FocusPanel').textContent,active:document.querySelector('.v19ProjectRail a[data-v219-active="true"]')?.dataset.v20OpenProject}));
 await p.locator('#v219TabMl').hover();await p.waitForTimeout(60);
 const ml=await p.evaluate(()=>({sel:document.querySelector('#home').dataset.v219Selected,href:document.querySelector('.v17MainCTA').getAttribute('href'),active:document.querySelector('.v19ProjectRail a[data-v219-active="true"]')?.dataset.v20OpenProject}));
 if(p.url()!==starting||software.sel!=='software'||!software.href.includes('view=software')||software.active!=='newssources'||ml.sel!=='ml'||!ml.href.includes('view=ml')||ml.active!=='earthbridge')throw Error(JSON.stringify({starting,actual:p.url(),software,ml}));
 await p.close();return {software,ml};
});
await check('Keyboard arrows/Home/End update tabs and Work URL',async()=>{
 const p=await browser.newPage({viewport:{width:1440,height:900}});await p.goto(base+'/');
 await p.locator('#v219TabFullstack').focus();await p.keyboard.press('ArrowRight');
 const value=await p.evaluate(()=>({active:document.activeElement?.id,selected:document.querySelector('#v219TabSoftware')?.getAttribute('aria-selected'),labelledBy:document.querySelector('#v219FocusPanel')?.getAttribute('aria-labelledby')}));
 await p.keyboard.press('End');const end=await p.locator('#home').getAttribute('data-v219-selected');
 await p.keyboard.press('Home');const home=await p.locator('#home').getAttribute('data-v219-selected');
 if(value.active!=='v219TabSoftware'||value.selected!=='true'||value.labelledBy!=='v219TabSoftware'||end!=='ml'||home!=='fullstack')throw Error(JSON.stringify({value,end,home}));
 await p.close();return {value,end,home};
});
await check('Touch clicks select focus and résumé options remain',async()=>{
 const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 await p.goto(base+'/');await p.locator('#v219TabMl').tap();
 const sel=await p.locator('#home').getAttribute('data-v219-selected');
 await p.locator('.v17ResumeSelect summary').click();
 const links=await p.locator('.v17ResumeChoices a').count();
 const recommended=await p.locator('.v17ResumeChoices a[data-v219-recommended="true"]').getAttribute('href');
 if(sel!=='ml'||links!==3||!recommended.includes('_ml_Public.pdf'))throw Error(JSON.stringify({sel,links,recommended}));
 await p.close();return {sel,links,recommended};
});
await check('Pointer glow responds with CSS variables',async()=>{
 const p=await browser.newPage({viewport:{width:1440,height:900}});await p.goto(base+'/');
 await p.locator('.v17Proof').hover({position:{x:120,y:90}});await p.waitForTimeout(100);
 const v=await p.locator('.v17Proof').evaluate(el=>({x:el.style.getPropertyValue('--v219-pointer-x'),y:el.style.getPropertyValue('--v219-pointer-y')}));
 if(!v.x||!v.y)throw Error('Pointer vars missing '+JSON.stringify(v));
 await p.close();return v;
});
await check('Reduced motion disables pointer glow and preserves tab usability',async()=>{
 const p=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await p.goto(base+'/');
 await p.locator('#v219TabMl').hover();await p.waitForTimeout(60);
 const data=await p.evaluate(()=>({selected:document.querySelector('#home').dataset.v219Selected,glow:getComputedStyle(document.querySelector('#home'), '::after').display,variables:document.querySelector('#home').style.getPropertyValue('--v219-pointer-x')}));
 if(data.selected!=='ml'||data.glow!=='none'||data.variables)throw Error(JSON.stringify(data));await p.close();return data;
});
await check('Feature recordings and six case routes still load',async()=>{
 const p=await browser.newPage();const ids=['mulyankan','earthbridge','newssources','our-hidden-universe','sentinel','schoolbuddies'];
 for(const id of ids){const r=await p.goto(base+'/projects/'+id+'/');if(r.status()!==200)throw Error('dossier '+id+' '+r.status())}
 await p.goto(base+'/');await p.locator('.v19MilestoneOpen').click();await p.waitForTimeout(200);
 const state=await p.locator('#v19MilestoneDialog').evaluate(d=>({open:d.open,src:d.querySelector('video source')?.getAttribute('src'),ready:d.querySelector('video')?.readyState}));
 if(!state.open||!state.src?.includes('mulyankan-system'))throw Error(JSON.stringify(state));
 await p.close();return state;
});
await browser.close();
writeFileSync('/tmp/v219-browser-report.json',JSON.stringify(checks,null,2));
console.log('TOTAL',checks.length,'PASS',checks.filter(c=>c.ok).length,'FAIL',checks.filter(c=>!c.ok).length);
if(checks.some(x=>!x.ok))process.exitCode=1;

