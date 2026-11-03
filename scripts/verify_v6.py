import json, re, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
styles='\n'.join((ROOT/x).read_text() for x in ['styles.css','workbench.css','atelier-v5.css','experience-v6.css'])
scripts=[]
for name in ['content.js','workbench-data.js','workbench-logic.js','workbench-ui.js','experience-v6.js','site.js']:
 code=(ROOT/name).read_text()
 code=re.sub(r'^import .*?\n','',code,flags=re.MULTILINE)
 code=re.sub(r'^export (const|function) ',r'\1 ',code,flags=re.MULTILINE)
 scripts.append(code)
html='<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><style>'+styles+'</style></head><body><div id="root"></div><script>'+'\n'.join(scripts)+'</script></body></html>'
results={}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,375,390,768,1024,1440]:
  page=browser.new_page(viewport={'width':width,'height':900},accept_downloads=True, reduced_motion='reduce')
  errors=[]
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(html,wait_until='load',timeout=15000)
  assert page.locator('.orbitNode').count()==6, f'hero orbit missing, errors={errors} root={page.locator("#root").inner_html()[:150]}'
  assert page.locator('.projectCard').count()==6
  assert page.locator('#orbitFocusTitle').inner_text()=='Mulyankan'
  page.locator('[data-orbit="1"]').click()
  assert page.locator('#orbitFocusTitle').inner_text()=='EarthBridge'
  assert page.locator('[data-orbit="1"]').get_attribute('aria-pressed')=='true'
  page.locator('#orbitNext').click()
  assert page.locator('#orbitFocusTitle').inner_text()=='Our Hidden Universe'
  page.locator('[data-orbit="0"]').focus()
  page.keyboard.press('ArrowRight')
  assert page.locator('#orbitFocusTitle').inner_text()=='EarthBridge', 'keyboard orbit failed'
  page.locator('#orbitView').click()
  assert page.locator('.projectCard').count()==6
  page.locator('#deckNext').click()
  page.wait_for_timeout(100)
  assert page.locator('#projectGrid').evaluate('(el)=>el.scrollLeft')>0, 'deck did not scroll'
  page.locator('[data-filter="ai"]').click()
  assert page.locator('.projectCard:visible').count()==2
  page.locator('[data-filter="all"]').click()
  assert page.locator('.projectCard:visible').count()==6
  page.locator('details.caseStudy summary').first.click()
  assert page.locator('details.caseStudy').first.evaluate('(el)=>el.open')
  page.locator('#lab').scroll_into_view_if_needed()
  page.get_by_role('button',name='Attach required evidence').click()
  assert page.locator('.wbApprove').is_disabled()
  page.locator('[data-evidence="revision"]').click()
  page.locator('[data-evidence="resolution"]').click()
  assert page.locator('.wbApprove').is_enabled()
  page.locator('.wbApprove').click()
  with page.expect_download() as dl:
   page.locator('[data-export="report"]').click()
  assert dl.value.suggested_filename.endswith('.txt')
  if width<=600:
   page.get_by_role('button',name='Open navigation').click()
   assert page.locator('#main-nav').evaluate('(el)=>el.classList.contains("navOpen")')
   page.keyboard.press('Escape')
   assert not page.locator('#main-nav').evaluate('(el)=>el.classList.contains("navOpen")')
  docwidth=page.evaluate('document.documentElement.scrollWidth')
  assert docwidth<=width+1, f'horizontal overflow at {width}: {docwidth}'
  assert not errors, f'javascript errors {errors}'
  page.locator('[data-orbit="0"]').click()
  if page.locator('details.caseStudy').first.evaluate('(el)=>el.open'):
   page.locator('details.caseStudy summary').first.click()
  page.locator('#projectGrid').evaluate('(el)=>el.scrollTo({left:0,behavior:"instant"})')
  page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
  page.wait_for_timeout(200)
  if width==1440:
   page.screenshot(path=str(ROOT/'V6_Desktop.png'),full_page=False,timeout=18000)
   page.locator('#work').scroll_into_view_if_needed()
   page.screenshot(path=str(ROOT/'V6_Projects.png'),full_page=False,timeout=18000)
   page.locator('#lab').scroll_into_view_if_needed()
   page.screenshot(path=str(ROOT/'V6_Workbench.png'),full_page=False,timeout=18000)
  if width==390:
   page.screenshot(path=str(ROOT/'V6_Mobile.png'),full_page=False,timeout=18000)
  results[width]={'horizontal_overflow':False,'javascript_errors':0,'orbit_navigation':True,'swipe_deck':True,'workbench':True,'report_export':True}
  page.close()
 browser.close()
(ROOT/'V6_BROWSER_QA.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
