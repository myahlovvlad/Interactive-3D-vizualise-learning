"""Offline browser smoke test; requires Python Playwright and local Chromium."""
from pathlib import Path
import json, tempfile, os
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1280,'height':800},offline=True,accept_downloads=True)
    page=context.new_page(); errors=[]; requests=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http:','https:')) else None)
    page.set_content((root/'dist/index.html').read_text());page.wait_for_function("document.querySelector('#status').textContent.includes('Готово')")
    assert 'Web Worker' in page.locator('#status').inner_text(),page.locator('#status').inner_text()
    assert page.locator('#peaks tr').count()==3
    page.locator('#time').evaluate("el=>{el.value=Number(el.max)/4;el.dispatchEvent(new Event('input'))}");assert page.locator('#zone-A').get_attribute('visibility')=='visible';page.locator('#time').evaluate("el=>{el.value=el.max;el.dispatchEvent(new Event('input'))}")
    initial=page.locator('#metrics').inner_text();page.screenshot(path=str(root/'evidence/mwp/desktop.png'),full_page=True)
    with tempfile.TemporaryDirectory() as tmp:
        f=Path(tmp)/'experiment.json'
        with page.expect_download() as dl:page.locator('#save').click()
        dl.value.save_as(f);a=json.loads(f.read_text());assert len(a['result']['signal'])>100
        page.locator('[name=temperatureC]').fill('140');page.locator('#run').click();page.wait_for_function("document.querySelector('#status').textContent.includes('Готово')");assert page.locator('#metrics').inner_text()!=initial
        page.locator('#import').set_input_files(str(f));page.wait_for_function("document.querySelector('#status').textContent.includes('повтор из параметров')");assert page.locator('#metrics').inner_text()==initial
        with page.expect_download() as dl:page.locator('#save').click()
        g=Path(tmp)/'replay.json';dl.value.save_as(g);assert json.loads(g.read_text())==a
        bad=Path(tmp)/'bad.json';bad.write_text('{');page.locator('#import').set_input_files(str(bad));page.wait_for_function("document.querySelector('#status').textContent.includes('JSON')");assert page.locator('#save').is_disabled()
    page.set_viewport_size({'width':390,'height':844});page.locator('#run').click();page.wait_for_function("document.querySelector('#status').textContent.includes('Готово')");assert page.evaluate('document.documentElement.scrollWidth <= innerWidth');page.screenshot(path=str(root/'evidence/mwp/mobile.png'),full_page=True)
    page.evaluate("()=>{document.querySelector('#run').click();document.querySelector('#cancel').click()}");page.wait_for_timeout(200);assert 'отменён' in page.locator('#status').inner_text() and page.locator('#save').is_disabled()
    assert not errors,errors;assert not requests,requests
    fallback=context.new_page();fallback.evaluate('window.Worker=undefined');fallback.set_content((root/'dist/index.html').read_text());fallback.wait_for_function("document.querySelector('#status').textContent.includes('локальный fallback')");assert fallback.locator('#peaks tr').count()==3
    print('PASS: offline HTML document (set_content; file:// blocked by browser policy in test environment); actual Web Worker; 3 peaks; changed input; export and exact replay; corrupt import; mobile layout; virtual time; cancel; Worker fallback; no page errors or network requests')
    browser.close()
