/* global chrome, document, innerWidth, getComputedStyle, devicePixelRatio */
import { chromium, expect } from '@playwright/test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const timestamp=()=>execFileSync('powershell.exe',['-NoProfile','-Command','Get-Date -Format "yyyy-MM-dd HH:mm:ss K"']).toString().trim();
const root=`docs/M10_T08_EVIDENCE/native-${Date.now()}`;mkdirSync(root,{recursive:true});
const profile=mkdtempSync(join(tmpdir(),'casino-blackjack-t08-native-')),extension=join(profile,'extension');mkdirSync(extension);
writeFileSync(join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'Blackjack T08 native zoom',version:'1.0',host_permissions:['http://127.0.0.1/*'],background:{service_worker:'background.js'}}));
writeFileSync(join(extension,'background.js'),'chrome.runtime.onInstalled.addListener(() => {});\n');
const receipt={start:timestamp(),method:'Native chrome.tabs.setZoom/getZoom 2; no CSS scale; root16px/CSSzoom1',scenarios:[]};
let context;
try {
  context=await chromium.launchPersistentContext(join(profile,'browser'),{channel:'chromium',headless:true,viewport:null,reducedMotion:'no-preference',
    args:['--disable-extensions-except='+extension,'--load-extension='+extension,'--window-size=1280,1000']});
  const worker=context.serviceWorkers()[0]??await context.waitForEvent('serviceworker'),page=await context.newPage();
  await page.goto('http://127.0.0.1:4188/?fixture=player-dealer-multi');
  const cdp=await context.newCDPSession(page),native=await cdp.send('Browser.getWindowForTarget');
  const width=await page.evaluate(()=>innerWidth);await cdp.send('Browser.setWindowBounds',{windowId:native.windowId,bounds:{width:native.bounds.width+1280-width}});
  await expect.poll(()=>page.evaluate(()=>innerWidth)).toBe(1280);receipt.baseline=await page.evaluate(()=>({dpr:devicePixelRatio,width:innerWidth}));
  for(const fixture of ['player-dealer-multi','player-dealer-bust']) {
    await page.goto('http://127.0.0.1:4188/?fixture='+fixture);
    const zoom=await worker.evaluate(async()=>{const [tab]=await chrome.tabs.query({url:'http://127.0.0.1:4188/*'});await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(tab.id,2);return chrome.tabs.getZoom(tab.id);});expect(zoom).toBe(2);
    await expect.poll(()=>page.evaluate(()=>innerWidth)).toBe(640);
    await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();
    await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running','false');
    await page.getByRole('button',{name:'Stand',exact:true}).click();await expect(page.locator('.game-scene')).toHaveAttribute('data-dealer-actions-running','false');
    await expect(page.locator('.dealer-total')).toHaveText(fixture==='player-dealer-multi'?'Total: 17':'Total: 25');
    const facts=await page.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio,scroll:document.documentElement.scrollWidth,font:getComputedStyle(document.documentElement).fontSize,cssZoom:getComputedStyle(document.documentElement).zoom,
      lane:{width:document.querySelector('.dealer-card-lane').clientWidth,scroll:document.querySelector('.dealer-card-lane').scrollWidth},cards:document.querySelectorAll('.dealer-card-lane .card').length}));
    expect(facts.width).toBe(640);expect(facts.dpr/receipt.baseline.dpr).toBe(2);expect(facts.font).toBe('16px');expect(facts.cssZoom).toBe('1');expect(facts.scroll).toBeLessThanOrEqual(facts.width);expect(facts.lane.scroll).toBeLessThanOrEqual(facts.lane.width);expect(facts.cards).toBe(fixture==='player-dealer-multi'?4:3);
    await expect(page.locator('[data-dealer-reveal],[data-action-card-flight]')).toHaveCount(0);
    const images=[];
    for(const [label,selector] of [['dealer','.dealer-zone'],['result','.player-dock']]) {
      await page.locator(selector).scrollIntoViewIfNeeded();const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
      const bytes=Buffer.from(shot.data,'base64'),name=`${fixture}-${label}.png`;expect(bytes.readUInt32BE(16)).toBe(Math.round(facts.width*facts.dpr));writeFileSync(`${root}/${name}`,bytes);images.push(name);
    }
    receipt.scenarios.push({fixture,zoom,facts,images,status:'PASS'});
  }
  receipt.status='PASS';receipt.exit=0;
} catch(error) {receipt.status='FAIL';receipt.exit=1;receipt.error=String(error);process.exitCode=1;}
finally {receipt.finish=timestamp();writeFileSync(`${root}/receipt.json`,JSON.stringify(receipt,null,2)+'\n');await context?.close();process.stdout.write(JSON.stringify(receipt)+'\n');}
