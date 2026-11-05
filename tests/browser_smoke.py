"""Optional Chromium DOM smoke of the navigation module with synthetic URL history.

Run: python tests/browser_smoke.py
Environment note: Browser navigation may be disabled; this test intentionally uses
set_content and an in-browser mock location/history. This does NOT validate the
full deployed portfolio, real routing, media downloads, or server behavior.
"""
from __future__ import annotations

import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def run():
    html = (ROOT / 'tests/browser/fixture.html').read_text()
    snippet = re.search(r'<script type="module">(.*?)</script>', html, flags=re.S).group(1)
    html = re.sub(r'<script type="module">.*?</script>', '', html, flags=re.S)
    nav_source = (ROOT / 'portfolio-navigation.js').read_text().replace('export function ', 'function ')
    bridge = '''
const virtualWindow = {
  location: {href: 'https://portfolio.example/?view=ml#case-earthbridge', get hash(){return new URL(this.href).hash;}},
  history: {
    state: { preserved: true },
    pushState(s, unused, href){this.state=s;virtualWindow.location.href=href;},
    replaceState(s, unused, href){this.state=s;virtualWindow.location.href=href;}
  },
  listeners: new Map(),
  addEventListener(event, fn){
    if(!this.listeners.has(event))this.listeners.set(event,new Set());
    this.listeners.get(event).add(fn);
  },
  removeEventListener(event, fn){this.listeners.get(event)?.delete(fn);},
  dispatch(event){for(const fn of this.listeners.get(event)||[])fn();}
};
window.virtualWindow = virtualWindow;
const nav=getPortfolioNavigation(virtualWindow);
'''
    snippet = snippet.replace("import { getPortfolioNavigation, installCaseLinkRecovery } from '../../portfolio-navigation.js';", '')
    snippet = snippet.replace('const nav=getPortfolioNavigation(window);', bridge)
    count = 0
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.getenv('CHROMIUM_BIN','/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        try:
            page = browser.new_page(viewport={'width': 390, 'height': 844})
            page.set_content(html)
            page.add_script_tag(content=nav_source)
            page.add_script_tag(content=snippet)
            assert page.locator('[data-switch-role="ml"]').get_attribute('aria-pressed') == 'true'
            assert page.locator('[data-atlas-tab="earthbridge"]').get_attribute('aria-selected') == 'true'
            count += 1

            page.get_by_role('button', name='Software Systems').click()
            assert '?view=software' in page.evaluate('window.virtualWindow.location.href')
            assert page.locator('[data-atlas-tab="news"]').get_attribute('aria-selected') == 'true'
            count += 1

            page.locator('[data-atlas-tab="mulyankan"]').scroll_into_view_if_needed()
            before = page.evaluate('window.scrollY')
            page.locator('[data-atlas-tab="mulyankan"]').click()
            assert abs(page.evaluate('window.scrollY') - before) < 10
            assert page.evaluate('window.virtualWindow.location.href').endswith('#case-mulyankan')
            count += 1

            page.evaluate('''() => {
              virtualWindow.location.href='https://portfolio.example/?view=software';
              virtualWindow.dispatch('popstate');
            }''')
            assert page.locator('[data-atlas-tab="news"]').get_attribute('aria-selected') == 'true'
            count += 1

            page.locator('[data-atlas-tab="news"]').focus()
            page.keyboard.press('ArrowRight')
            assert page.locator('[data-atlas-tab="mulyankan"]').get_attribute('aria-selected') == 'true'
            assert page.evaluate('document.activeElement?.dataset.atlasTab') == 'mulyankan'
            count += 1

            page.evaluate("() => { virtualWindow.history.pushState = () => { throw new Error('blocked'); }; }")
            page.get_by_role('button', name='Full-Stack').click()
            assert page.locator('[data-switch-role="fullstack"]').get_attribute('aria-pressed') == 'true'
            assert 'local-only' in page.locator('#status').inner_text()
            count += 1

            page.locator('[data-atlas-tab="ohs"]').click()
            assert page.locator('[data-atlas-tab="ohs"]').get_attribute('aria-selected') == 'true'
            count += 1

            # Native navigation on a site whose History API is blocked must not
            # reset the locally selected Full-Stack experience.
            page.evaluate("() => { virtualWindow.location.href='https://portfolio.example/?view=software#about'; virtualWindow.dispatch('hashchange') }")
            assert page.locator('[data-switch-role="fullstack"]').get_attribute('aria-pressed') == 'true'
            assert page.locator('#status').inner_text().find('local-only') >= 0
            count += 1

            page.evaluate("() => { virtualWindow.location.href='https://portfolio.example/?view=ml#case-earthbridge'; virtualWindow.dispatch('popstate') }")
            page.locator('#caseNotes').evaluate('(el)=>el.hidden=true')
            page.locator('#case-earthbridge').evaluate('(el)=>el.open=false')
            page.locator('#reopenCase').click()
            assert page.locator('#caseNotes').evaluate('(el)=>!el.hidden')
            assert page.locator('#case-earthbridge').evaluate('(el)=>el.open')
            count += 1

            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 2')
            count += 1
        finally:
            browser.close()
    print(f'Isolated Chromium DOM smoke: {count} checks passed (synthetic history)')

if __name__ == '__main__':
    run()
