"""Manual QA script (optional): python scripts/verify_browser.py (requires playwright)."""
import json, re
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]

def make_inline():
    css = (ROOT/'styles.css').read_text()+(ROOT/'workbench.css').read_text()+(ROOT/'atelier-v5.css').read_text()
    scripts=[]
    for filename in ['content.js','workbench-data.js','workbench-logic.js','workbench-ui.js','site.js']:
        code=(ROOT/filename).read_text()
        code=re.sub(r'^import .*?\n','',code,flags=re.MULTILINE)
        code=re.sub(r'^export (const|function) ',r'\1 ',code,flags=re.MULTILINE)
        scripts.append(code)
    return '<!doctype html><html><head><meta charset="utf-8"><style>'+css+'</style></head><body><div id="root"></div><script>'+''.join(scripts)+'</script></body></html>'

html=make_inline()
results={}
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in (320,375,390,768,1024,1440):
        page=browser.new_page(viewport={'width':width,'height':900},accept_downloads=True)
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.set_content(html,wait_until="load")
        assert page.locator('#projectGrid .projectCard').count()==6
        assert page.get_by_role('heading',name='The evidence workbench.').count()==1
        page.locator('#lab').scroll_into_view_if_needed()
        page.get_by_role('button',name='Attach required evidence').click()
        assert page.locator('.wbCoverageHead strong').inner_text()=='100%'
        assert page.locator('.wbApprove').is_disabled(), f'Known contradiction bypassed at {width}'
        page.locator('[data-evidence="revision"]').click()
        assert page.locator('.wbApprove').is_disabled()
        page.locator('[data-evidence="resolution"]').click()
        assert page.locator('.wbApprove').is_enabled()
        page.locator('.wbApprove').click()
        assert 'ready for judgment' in page.locator('.wbDecisionReceipt').inner_text()
        with page.expect_download() as d:
            page.locator('[data-export="report"]').click()
        download=d.value
        assert download.suggested_filename=='builder-mind-validation-review.txt'
        report=Path(ROOT/'_review-download.tmp')
        download.save_as(report)
        txt=report.read_text()
        assert 'Required evidence coverage: 100%' in txt and 'RECONCILED' in txt.upper() and 'fictional' in txt.lower()
        report.unlink()
        page.locator('[data-case="1"]').click()
        assert page.locator('.wbCase.isActive').inner_text().find('Project feasibility')!=-1
        page.locator('[data-case="0"]').click()
        assert page.locator('.wbApprove').is_enabled()  # case state retained
        # Verify filter and reset behavior.
        page.locator('[data-reset="case"]').click()
        assert page.locator('.wbCoverageHead strong').inner_text()=='0%'
        page.locator('#work').scroll_into_view_if_needed()
        page.locator('[data-filter="ai"]').click()
        assert page.locator('#projectGrid .projectCard:visible').count()==2
        page.locator('[data-filter="all"]').click()
        assert page.locator('#projectGrid .projectCard:visible').count()==6
        page.locator('details.caseStudy summary').first.click()
        assert page.locator('details.caseStudy').first.evaluate('(d)=>d.open')
        if width <= 600:
            page.get_by_role('button', name='Open navigation').click()
            assert page.locator('#main-nav').evaluate('(n)=>n.classList.contains("navOpen")')
            page.keyboard.press('Escape')
            assert not page.locator('#main-nav').evaluate('(n)=>n.classList.contains("navOpen")')
        docwidth=page.evaluate('document.documentElement.scrollWidth')
        assert docwidth<=width+1, f'Overflow {docwidth} at {width}'
        assert not errors, f'Browser exceptions at {width}: {errors}'
        if width==1440:
            page.evaluate("document.documentElement.style.scrollBehavior='auto'; window.scrollTo({top:0,behavior:'instant'})")
            page.wait_for_timeout(250)
            page.screenshot(path=str(ROOT/'V5_Desktop.png'),full_page=False,timeout=15000)
            page.locator('#lab').scroll_into_view_if_needed()
            page.get_by_role('button', name='Attach required evidence').click()
            page.locator('[data-evidence="revision"]').click()
            page.locator('[data-evidence="resolution"]').click()
            page.add_style_tag(content='.header,.floatingLab,.skipLink{visibility:hidden!important}')
            page.locator('#workbenchApp').screenshot(path=str(ROOT/'V5_Workbench.png'),timeout=15000)
        if width==390:
            page.evaluate("document.documentElement.style.scrollBehavior='auto'; window.scrollTo({top:0,behavior:'instant'})")
            page.wait_for_timeout(250)
            page.screenshot(path=str(ROOT/'V5_Mobile.png'),full_page=False,timeout=15000)
        results[str(width)]={'overflow':False,'jsErrors':0,'reviewDownload':True,'interactions':True}
        page.close()
    browser.close()
print(json.dumps(results,indent=2))
