from pathlib import Path
import os
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
e=root/'evidence/runtime';e.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path=os.getenv('CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1280,'height':1000});err=[]
    page.on('pageerror',lambda x:err.append(str(x)));page.route('**/*',lambda route:route.abort())
    page.set_content((root/'releases/uvvis-0.1.0/index.html').read_text());page.locator('#status').filter(has_text='Расчёт завершён').wait_for();page.screenshot(path=str(e/'uvvis-desktop.png'),full_page=True)
    print('Default',page.locator('#abs').inner_text(),page.locator('#trans').inner_text())
    for angle in range(0,360,30):
        page.locator('#yaw').evaluate('(e,a)=>{e.value=a;e.dispatchEvent(new Event("input"))}',angle);assert page.locator('#scene polygon').count()>10;assert 'NaN' not in page.locator('#scene').inner_html()
    page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(e/'uvvis-mobile.png'),full_page=True);assert not err
    print('PASS: 12 azimuths, mobile UV/Vis, no errors; visual smoke only');b.close()
