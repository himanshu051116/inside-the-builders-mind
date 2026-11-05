"""Optional end-to-end portfolio verification after applying the V20.5 patch.

Requires a running local or preview deployment of the complete repository:
  python -m pip install playwright
  python -m playwright install chromium
  python tests/full_site_acceptance.py --base-url http://127.0.0.1:4173

This script is deliberately NOT run against an invented/stub production site.
It reports actual DOM/layout, video controls, and client errors for real pages.
"""
from __future__ import annotations
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit, urljoin
from playwright.sync_api import sync_playwright

VIEWPORTS = [(390,844),(768,1024),(1024,768),(1440,900)]

# Real first-party media and résumé endpoints, not just URL strings in the DOM.
# With Vercel rewrites, a missing asset can return HTTP 200 and HTML. Magic-byte
# validation catches that failure even when status codes alone look healthy.
STATIC_ASSETS = (
    ('/video/mulyankan-system-walkthrough-presenter.mp4', 'mp4'),
    ('/video/mulyankan-docx-workflow-presenter.mp4', 'mp4'),
    ('/video/mulyankan-system-poster.jpg', 'jpeg'),
    ('/video/mulyankan-docx-poster.jpg', 'jpeg'),
    ('/resumes/Himanshu_Shukla_fullstack_Public.pdf', 'pdf'),
    ('/resumes/Himanshu_Shukla_software_Public.pdf', 'pdf'),
    ('/resumes/Himanshu_Shukla_ml_Public.pdf', 'pdf'),
    ('/evidence/ohs-home.webp', 'webp'),
    ('/evidence/news-overview.webp', 'webp'),
    ('/evidence/earthbridge-evaluation.webp', 'webp'),
)


def has_signature(body, kind):
    if kind == 'mp4':
        return len(body) >= 12 and body[4:8] == b'ftyp'
    if kind == 'jpeg':
        return body.startswith(bytes.fromhex('ffd8ff'))
    if kind == 'pdf':
        return body.startswith(b'%PDF-')
    if kind == 'webp':
        return len(body) >= 12 and body[:4] == b'RIFF' and body[8:12] == b'WEBP'
    raise ValueError(f'Unsupported asset type: {kind}')


def probe_static_assets(request, base_url, report):
    failures = 0
    for path, kind in STATIC_ASSETS:
        url = urljoin(base_url.rstrip('/') + '/', path.lstrip('/'))
        entry = {'path': path, 'kind': kind, 'url': url, 'ok': False}
        try:
            response = request.get(url, headers={'Range':'bytes=0-63'}, timeout=20000)
            body = response.body()
            entry.update(status=response.status, content_type=response.headers.get('content-type',''), bytes_received=len(body))
            entry['ok'] = response.status in (200,206) and has_signature(body,kind)
            if not entry['ok']:
                entry['problem'] = 'Unexpected HTTP status or invalid file signature (possible HTML fallback)'
        except Exception as exc:
            entry['problem'] = str(exc)
        report['static_assets'].append(entry)
        if not entry['ok']:
            failures += 1
    return failures



def verify(page, results, width):
    def check(name, condition):
        result = bool(condition)
        results.append({'viewport':width,'check':name,'pass':result})
        return result

    page.wait_for_selector('#v17Name', state='visible', timeout=15000)
    check('recruiter identity present', bool(page.locator('#v17Name').inner_text().strip()))
    check('three role modes present', page.locator('[data-switch-role]').count() == 3)
    check('real project work available', page.locator('.projectCard').count() >= 4)
    check('case study notes available', page.locator('.caseFile').count() >= 4)
    check('no document horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 3'))
    # Diagnose rather than merely asserting overflow: developer can identify
    # which visible elements exceed the viewport from the saved report.
    overflow = page.evaluate('''() => [...document.querySelectorAll('body *')]
      .filter(el => {
        const box=el.getBoundingClientRect();
        const css=getComputedStyle(el);
        return css.display !== 'none' && css.visibility !== 'hidden' &&
          box.width > 0 && box.height > 0 && (box.right > innerWidth+3 || box.left < -3);
      }).slice(0,12).map(el => ({
        tag:el.tagName.toLowerCase(), id:el.id,
        className:typeof el.className==='string'?el.className.slice(0,100):'',
        left:Math.round(el.getBoundingClientRect().left),
        right:Math.round(el.getBoundingClientRect().right)
      }))''')
    if overflow: results.append({'viewport':width,'diagnostic':'overflow_candidates','elements':overflow})

    for role, expected_case in [('software','news'),('ml','earthbridge'),('fullstack','ohs')]:
        page.locator(f'[data-switch-role="{role}"]').first.click()
        check(f'{role} role state', page.locator('body').get_attribute('data-role') == role)
        check(f'{role} query parameter', page.evaluate('(role) => new URL(location.href).searchParams.get("view") === role',role))
        check(f'{role} active screen', page.locator(f'[data-role-view="{role}"]:visible').count() >= 1)

    # Open canonical engineering note from its actual anchor, not just its tab.
    page.locator('.v14CaseQuickNav a[href="#case-mulyankan"]').click()
    check('Mulyankan hash navigable', page.evaluate('location.hash==="#case-mulyankan"'))
    check('Mulyankan case revealed', page.locator('#case-mulyankan .caseFileDetails').evaluate('(el) => el.open'))
    check('case list expanded', not page.locator('#caseFilesGrid').evaluate('(el) => el.hidden'))
    # Re-selecting the exact same anchor must reopen a manually collapsed case.
    page.locator('#caseNotesToggle').click()
    check('case notes can be collapsed', page.locator('#caseFilesGrid').evaluate('(el) => el.hidden'))
    page.locator('.v14CaseQuickNav a[href="#case-mulyankan"]').click()
    check('same-hash case link reopens notes',not page.locator('#caseFilesGrid').evaluate('(el) => el.hidden'))

    # A comparison tab should switch selection without unexpectedly moving the viewport.
    page.locator('.atlasDrawer > summary').click()
    earthbridge=page.locator('[data-atlas-tab="earthbridge"]')
    earthbridge.scroll_into_view_if_needed()
    before=page.evaluate('scrollY')
    earthbridge.click()
    check('evidence tab selected',earthbridge.get_attribute('aria-selected') == 'true')
    check('evidence tab has shareable hash',page.evaluate('location.hash==="#case-earthbridge"'))
    check('case comparison does not jump away',abs(page.evaluate('scrollY')-before)<30)
    page.go_back(wait_until='domcontentloaded')
    page.wait_for_function('location.hash === "#case-mulyankan"')
    check('browser history restores case hash',page.evaluate('location.hash==="#case-mulyankan"'))

    check('Mulyankan recorded demo opener present', page.locator('.v19MilestoneOpen').count()==1)
    check('source-backed evidence card remains visible',page.locator('#home .v17Proof').count()==1)
    check('no visible browser-broken hero image',page.evaluate('''() => [...document.querySelectorAll('#home img')]
        .filter(img => img.complete && !img.naturalWidth).length === 0'''))
    page.locator('.v19MilestoneOpen').click()
    dialog=page.locator('#v19MilestoneDialog')
    check('native video dialog opens',dialog.evaluate('(el) => el.open'))
    check('original chapter buttons retained',dialog.locator('[data-v19-chapter]').count()==2)
    source=dialog.locator('video source')
    check('original recorded MP4 loaded in source',source.get_attribute('src').startswith('/video/mulyankan-'))
    dialog.locator('[data-v19-chapter="docx"]').click()
    check('chapter changes source', 'mulyankan-docx-workflow-presenter.mp4' in source.get_attribute('src'))
    dialog.locator('.v19DialogClose').click()
    check('dialog closes',not dialog.evaluate('(el) => el.open'))
    check('focus returns to video opener',page.evaluate('document.activeElement?.classList.contains("v19MilestoneOpen")'))

    if width<=430:
        menu=page.locator('#menuToggle')
        menu.click()
        check('mobile menu opens',menu.get_attribute('aria-expanded')=='true')
        page.locator('#main-nav a[href="#work"]').click()
        check('mobile menu closes after navigation',menu.get_attribute('aria-expanded')=='false')


def main():
    p=argparse.ArgumentParser()
    p.add_argument('--base-url',required=True,help='The full running portfolio (localhost or a preview URL)')
    p.add_argument('--out',default='browser-acceptance',help='Directory for JSON and screenshots')
    p.add_argument('--browser-bin',default=None,help='Optional Chromium binary path')
    args=p.parse_args()
    parts=urlsplit(args.base_url)
    if parts.scheme not in ('http','https') or not parts.netloc:
        p.error('--base-url must be an absolute http(s) URL')
    out=Path(args.out).resolve();out.mkdir(parents=True,exist_ok=True)
    report={'base_url':args.base_url,'checks':[],'exceptions':[],'javascript_errors':[],'same_origin_http_errors':[],'request_failures':[],'static_assets':[]}
    with sync_playwright() as pw:
        settings={'headless':True}
        if args.browser_bin: settings['executable_path']=args.browser_bin
        browser=pw.chromium.launch(**settings)
        try:
            asset_request=pw.request.new_context()
            try:
                media_failures=probe_static_assets(asset_request,args.base_url,report)
            finally:
                asset_request.dispose()
            for width,height in VIEWPORTS:
                page=browser.new_page(viewport={'width':width,'height':height},reduced_motion='reduce')
                page.on('pageerror',lambda err,w=width: report['javascript_errors'].append({'viewport':w,'error':str(err)}))
                def on_http_response(response,w=width):
                    # Only report first-party failures. External font/CDN providers
                    # can be blocked by users without breaking the core portfolio.
                    if response.status >= 400 and urlsplit(response.url).netloc == parts.netloc:
                        report['same_origin_http_errors'].append({'viewport':w,'status':response.status,'url':response.url})
                page.on('response',on_http_response)
                page.on('requestfailed',lambda request,w=width: report['request_failures'].append({
                    'viewport':w,'url':request.url,'failure':str(request.failure)
                }) if urlsplit(request.url).netloc == parts.netloc else None)
                try:
                    page.goto(args.base_url,wait_until='domcontentloaded',timeout=25000)
                    verify(page,report['checks'],width)
                except Exception as exc:
                    report['exceptions'].append({'viewport':width,'error':str(exc)})
                finally:
                    try:
                        page.screenshot(path=str(out/f'viewport-{width}.png'),full_page=True,timeout=20000)
                    except Exception as exc:
                        report['exceptions'].append({'viewport':width,'screenshot_error':str(exc)})
                    page.close()
        finally:
            browser.close()
    (out/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    failures=[c for c in report['checks'] if not c['pass']]
    print(f"{len(report['checks'])-len(failures)} / {len(report['checks'])} asserted checks passed; "+
          f"{len(report['exceptions'])} viewport exceptions, "+
          f"{len(report['javascript_errors'])} JavaScript errors, " +
          f"{len(report['same_origin_http_errors'])} first-party HTTP errors, " +
          f"{media_failures} static asset failures. Report: {out/'report.json'}")
    if failures or media_failures or report['exceptions'] or report['javascript_errors'] or report['same_origin_http_errors'] or report['request_failures']:
        raise SystemExit(1)

if __name__=='__main__':
    main()
