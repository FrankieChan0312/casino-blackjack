/* global chrome, document, innerWidth, getComputedStyle, devicePixelRatio */
import { chromium, expect } from '@playwright/test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { log, error } from 'node:console';
import { Buffer } from 'node:buffer';

const timestamp = () => execFileSync('powershell.exe',['-NoProfile','-Command','Get-Date -Format "yyyy-MM-dd HH:mm:ss K"']).toString().trim();
const profile = mkdtempSync(join(tmpdir(),'casino-blackjack-t05-native-'));
const extension = join(profile,'extension'); mkdirSync(extension);
writeFileSync(join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'Blackjack T05 native zoom smoke',version:'1.0',host_permissions:['http://127.0.0.1/*'],background:{service_worker:'background.js'}}));
writeFileSync(join(extension,'background.js'),'chrome.runtime.onInstalled.addListener(() => {});\n');
const receipt = {started:timestamp(),method:'Isolated Chromium native chrome.tabs.setZoom/getZoom; root16px, CSS zoom1, no scale emulation',profile,scenarios:[]};
let context;
try {
  context = await chromium.launchPersistentContext(join(profile,'browser'),{channel:'chromium',headless:false,viewport:null,
    args:['--disable-extensions-except='+extension,'--load-extension='+extension,'--window-size=1280,1000']});
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  const page = await context.newPage();await page.goto('http://127.0.0.1:4185/?fixture=player');
  const cdp=await context.newCDPSession(page),native=await cdp.send('Browser.getWindowForTarget');
  const width=await page.evaluate(()=>innerWidth);await cdp.send('Browser.setWindowBounds',{windowId:native.windowId,bounds:{width:native.bounds.width+1280-width}});
  await expect.poll(()=>page.evaluate(()=>innerWidth)).toBe(1280);
  receipt.baseline=await page.evaluate(()=>({innerWidth,dpr:devicePixelRatio,font:getComputedStyle(document.documentElement).fontSize,cssZoom:getComputedStyle(document.documentElement).zoom}));
  for(const fixture of ['player-setup','player-seven-split','player-rsa-cap']) {
    await page.goto('http://127.0.0.1:4185/?fixture='+fixture);
    const zoom=await worker.evaluate(async()=>{const [tab]=await chrome.tabs.query({url:'http://127.0.0.1:4185/*'});await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(tab.id,2);return chrome.tabs.getZoom(tab.id);});expect(zoom).toBe(2);
    await expect.poll(()=>page.evaluate(()=>innerWidth)).toBe(640);
    if(fixture==='player-setup'){await page.getByLabel('Total players',{exact:true}).selectOption('1');await page.getByRole('button',{name:'Start table',exact:true}).click();}
    await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();
    if(fixture==='player-seven-split')await page.getByRole('button',{name:'Split',exact:true}).click();
    if(fixture==='player-rsa-cap')for(let i=0;i<3;i++)await page.getByRole('button',{name:'Split',exact:true}).click();
    const facts=await page.evaluate(()=>({innerWidth,dpr:devicePixelRatio,scroll:document.documentElement.scrollWidth,font:getComputedStyle(document.documentElement).fontSize,cssZoom:getComputedStyle(document.documentElement).zoom,
      cards:[...document.querySelectorAll('#player-hand .cards')].map(el=>({width:el.clientWidth,scroll:el.scrollWidth})),hands:document.querySelectorAll('#player-hand article').length}));
    expect(facts.scroll).toBeLessThanOrEqual(facts.innerWidth);expect(facts.font).toBe('16px');expect(facts.cssZoom).toBe('1');expect(facts.dpr/receipt.baseline.dpr).toBe(2);
    for(const card of facts.cards)expect(card.scroll).toBeLessThanOrEqual(card.width);
    expect(facts.hands).toBe(fixture==='player-rsa-cap'?4:fixture==='player-seven-split'?2:1);
    // Seed7/count1 opens the authoritative Insurance decision, not a player hand action.
    const insurance=!!await page.getByRole('button',{name:'Decline',exact:true}).count();
    const target=fixture==='player-rsa-cap'?'Deal Again':insurance?'Decline':'Stand';
    const button=page.getByRole('button',{name:target,exact:true});await page.locator(fixture==='player-rsa-cap'?'#player-result':insurance?'.decision':'#player-hand').focus();
    for(let i=0;i<14&&!await button.evaluate(el=>el===document.activeElement);i++)await page.keyboard.press('Tab');await expect(button).toBeFocused();
    const box=await button.boundingBox();expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
    // Native zoom needs native viewport pixels. Playwright fullPage clipping uses CSS-sized bounds.
    const screenshots=[];
    for(const [position,selector] of [['dealer','.dealer-zone'],['hand','#player-hand'],['controls','.player-dock']]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      const image=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
      const bytes=Buffer.from(image.data,'base64'),name=`native-${fixture}-${position}.png`;
      const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
      expect(width).toBe(Math.round(facts.innerWidth*facts.dpr));
      writeFileSync('docs/M10_T05_EVIDENCE/'+name,bytes);screenshots.push({name,width,height,method:'CDP native viewport'});
    }
    receipt.scenarios.push({fixture,zoom,facts,button:box,screenshots,status:'PASS'});
  }
  receipt.status='PASS';receipt.exit=0;
} catch(failure) { receipt.status='FAIL';receipt.exit=1;receipt.failure=String(failure);error(failure);process.exitCode=1; }
finally {receipt.finished=timestamp();writeFileSync('docs/M10_T05_EVIDENCE/native-zoom.json',JSON.stringify(receipt,null,2)+'\n');await context?.close();log(JSON.stringify(receipt));}
