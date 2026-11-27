"""Test the exact self-contained release as document content (no network navigation).
Python 3 + Playwright + Chromium. File/HTTP navigation is a separate smoke test.
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / 'evidence/platform'
EVIDENCE.mkdir(parents=True, exist_ok=True)
HTML = (ROOT/'index.html').read_text()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.getenv('CHROMIUM','/usr/bin/chromium'), args=['--no-sandbox','--disable-dev-shm-usage'])
    page = b.new_page(viewport={'width':1440,'height':1000}, accept_downloads=True)
    errors=[]; requests=[]
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.route('**/*', lambda route: (requests.append(route.request.url),route.abort()))
    page.set_content(HTML,wait_until='load')
    assert page.locator('.card').count()==8
    assert page.locator('iframe').count()==0
    assert page.locator('#readyCount').inner_text()=='3'
    page.screenshot(path=str(EVIDENCE/'catalog-desktop.png'), full_page=True)
    page.locator('#search').fill('вэжх'); assert page.locator('.card').count()==1
    page.locator('#search').fill('');page.locator('[data-category=bio]').click();assert page.locator('.card').count()==2
    page.locator('[data-category=all]').click();page.locator('#status').select_option('prototype');assert page.locator('.card').count()==3
    page.locator('[data-lab=gc]').click();page.wait_for_function("location.hash==='#lab=gc' && document.querySelectorAll('iframe').length===1")
    gc=page.frame_locator('iframe');gc.locator('#run').wait_for();gc.get_by_text('Расчёт завершён',exact=True).wait_for(timeout=15000)
    assert gc.locator('#peaks tr').count()==3
    gc.locator('#cut').click()
    with page.expect_download() as d: page.locator('#separate').click()
    assert d.value.suggested_filename=='gc-0.0.2.html'
    assert Path(d.value.path()).read_bytes()==(ROOT/'releases/mwp-0.0.2/index.html').read_bytes()
    page.screenshot(path=str(EVIDENCE/'gc-workspace.png'), full_page=True)
    page.locator('#back').click();page.wait_for_function("document.querySelectorAll('iframe').length===0")
    page.locator('[data-lab=hplc]').click();page.wait_for_function("location.hash==='#lab=hplc' && document.querySelectorAll('iframe').length===1")
    lc=page.frame_locator('iframe');lc.locator('#presetFast').click();lc.locator('#xray').click();assert lc.locator('#plot').count()==1
    page.screenshot(path=str(EVIDENCE/'hplc-workspace.png'), full_page=True)
    page.locator('#back').click();page.wait_for_function("document.querySelectorAll('iframe').length===0")
    page.evaluate("location.hash='lab=uvvis'");page.wait_for_function("location.hash==='#lab=uvvis' && document.querySelectorAll('iframe').length===1")
    uv=page.frame_locator('iframe');uv.locator('#status').filter(has_text='Расчёт завершён').wait_for(timeout=15000)
    assert abs(float(uv.locator('#abs').inner_text())-.5)<.005
    uv.locator('#beam').select_option('single');uv.locator('#run').click();uv.locator('#status').filter(has_text='Расчёт завершён').wait_for(timeout=15000)
    assert float(uv.locator('#abs').inner_text())<.5
    uv.locator('#rotateRight').click();uv.locator('#shell').click();uv.locator('#shell').click();uv.locator('#component').select_option('sample');assert 'Кювета' in uv.locator('#detail').inner_text()
    page.screenshot(path=str(EVIDENCE/'uvvis-workspace.png'),full_page=True)
    with page.expect_download() as d: uv.locator('#export').click()
    uv.locator('#file').set_input_files(d.value.path());uv.locator('#status').filter(has_text='Расчёт завершён').wait_for(timeout=15000)
    page.locator('#back').click();page.wait_for_function("document.querySelectorAll('iframe').length===0")
    page.evaluate("location.hash='lab=ic'");page.wait_for_function("location.hash==='#lab=ic' && !document.querySelector('iframe')")
    page.evaluate("location.hash='lab=gc'");page.frame_locator('iframe').locator('#run').wait_for();assert page.locator('iframe').count()==1
    page.locator('#back').click();page.wait_for_function("document.querySelectorAll('iframe').length===0")
    page.locator('#status').select_option('all');page.set_viewport_size({'width':390,'height':844});assert page.locator('.card').count()==8
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path=str(EVIDENCE/'catalog-mobile.png'),full_page=True)
    assert not errors,errors
    assert not requests,requests
    print('PASS: 8 catalog cards; search/category/status filters; GC calculation and shell toggle; byte-identical module download; HPLC controls; UV/Vis calculation, beam switching, rotation, component selection, export/replay; one active iframe and disposal; unavailable route refused; direct route; mobile catalog without overflow; no JS errors or network requests. Exact HTML loaded with set_content; direct file and HTTP navigation blocked by environment policy (not verified).')
    b.close()
