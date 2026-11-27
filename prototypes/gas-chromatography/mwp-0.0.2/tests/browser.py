from pathlib import Path
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']); page=b.new_page(viewport={'width':1280,'height':900}); errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.route('http**',lambda route:route.abort());page.set_content((Path(__file__).resolve().parents[1]/'index.html').read_text());page.wait_for_function("document.querySelector('#status').textContent==='Расчёт завершён'");assert page.locator('#peaks tr').count()==3
 page.locator('#time').evaluate("e=>{e.value=180;e.dispatchEvent(new Event('input'))}");page.screenshot(path='desktop.png');
 for yaw in range(0,360,30):
  page.locator('#yaw').evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input"))}',yaw);assert 'NaN' not in page.locator('#scene').inner_html()
 page.locator('#cut').click();assert page.locator('#scene polygon').count()>0;page.locator('#cut').click();page.locator('#front').click();page.set_viewport_size({'width':390,'height':844});page.screenshot(path='mobile.png',full_page=True);assert page.evaluate('document.documentElement.scrollWidth <= innerWidth');assert not errors,errors;print('PASS: offline document (file navigation blocked by policy), worker calculation, 12 azimuths (finite SVG), shell toggle, mobile width, no page errors');b.close()
