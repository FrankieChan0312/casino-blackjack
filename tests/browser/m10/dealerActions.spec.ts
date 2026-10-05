import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';

test.use({reducedMotion:'no-preference'});
async function deal(page:Page,fixture:string){await page.goto(`/?fixture=${fixture}`);await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running','false');}
async function capture(page:Page,path:string){await page.locator('.dealer-zone').scrollIntoViewIfNeeded();const cdp=await page.context().newCDPSession(page);const image=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});await cdp.detach();writeFileSync(path,Buffer.from(image.data,'base64'));}
async function pauseReveal(page:Page){await page.evaluate(()=>{const observer=new MutationObserver(()=>{const card=document.querySelector<HTMLElement>('[data-dealer-reveal]');if(card){card.getAnimations().forEach(animation=>{animation.pause();animation.currentTime=35;});observer.disconnect();}});observer.observe(document.body,{attributes:true,subtree:true,attributeFilter:['data-dealer-reveal']});});}
test('[T08-B01] hidden privacy, real flip midpoint and exact multi-draw order with six-state hooks',async({page})=>{
  await deal(page,'player-dealer-multi');const hole=page.locator('[data-card-slot="dealer:1"]');
  await expect(hole).toHaveAttribute('aria-label','Hidden dealer card');expect(await hole.textContent()).toBe('◆');
  const root=`docs/M10_T08_EVIDENCE/browser/${Date.now()}-reveal-multiple`;mkdirSync(root,{recursive:true});await capture(page,`${root}/pre.png`);
  await page.evaluate(()=>{const trace:string[]=[];(window as unknown as {dealerTrace:string[]}).dealerTrace=trace;new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node instanceof HTMLElement&&node.dataset.actionReason==='DEALER')trace.push(node.dataset.dealTarget!);}).observe(document.body,{childList:true});});
  await pauseReveal(page);await page.getByRole('button',{name:'Stand',exact:true}).click();await expect(hole).toHaveAttribute('data-dealer-reveal',/./);
  await expect(hole).toHaveClass(/card-back/);await expect(hole).toHaveAttribute('aria-label','Hidden dealer card');expect(await hole.textContent()).toBe('◆');
  await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state','REVEALING');await capture(page,`${root}/mid-back.png`);
  await page.evaluate(()=>{const card=document.querySelector<HTMLElement>('[data-dealer-reveal]')!;const observer=new MutationObserver(()=>{if(!card.classList.contains('card-back')){card.getAnimations().forEach(animation=>{animation.pause();animation.currentTime=35;});observer.disconnect();}});observer.observe(card,{attributes:true,attributeFilter:['class']});card.getAnimations().forEach(animation=>animation.play());});
  await expect(hole).not.toHaveClass(/card-back/);await expect(hole).toHaveAttribute('aria-label','6 of diamonds');await capture(page,`${root}/mid-face.png`);
  await page.evaluate(()=>document.querySelector('[data-dealer-reveal]')?.getAnimations().forEach(animation=>animation.play()));
  await expect(page.locator('.game-scene')).toHaveAttribute('data-dealer-actions-running','false');
  expect(await page.evaluate(()=>(window as unknown as {dealerTrace:string[]}).dealerTrace)).toEqual(['dealer:2','dealer:3']);
  await expect(page.locator('.dealer-total')).toHaveText('Total: 17');await expect(page.locator('[data-dealer-reveal],[data-action-card-flight]')).toHaveCount(0);await capture(page,`${root}/settled.png`);
  writeFileSync(`${root}/receipt.json`,JSON.stringify({order:['dealer:2','dealer:3'],total:17,files:['pre.png','mid-back.png','mid-face.png','settled.png']}));
});
for(const [width,height,text] of [[1280,900,false],[768,1024,false],[320,720,false],[1280,900,true]] as const)test(`[T08-B02-${width}-${text}] responsive Dealer bust and skip settle without stale overlays`,async({page})=>{
  await page.setViewportSize({width,height});await deal(page,'player-dealer-bust');if(text)await page.addStyleTag({content:'html { font-size:200%; }'});
  await pauseReveal(page);await page.getByRole('button',{name:'Stand',exact:true}).click();await expect(page.locator('[data-dealer-reveal]')).toHaveCount(1);
  await page.getByRole('button',{name:'Skip animations',exact:true}).click();await expect(page.locator('.game-scene')).toHaveAttribute('data-dealer-actions-running','false');
  await expect(page.locator('[data-dealer-reveal],[data-action-card-flight]')).toHaveCount(0);await expect(page.locator('.dealer-total')).toHaveText('Total: 25');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.dealer-card-lane').evaluate(element=>element.scrollWidth<=element.clientWidth)).toBe(true);
});
test('[T08-B03] reduced motion Insurance branch stays secret before reveal and settles public face immediately',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await deal(page,'player-ace');await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label','Hidden dealer card');
  await page.getByRole('button',{name:'Buy Insurance',exact:true}).click();await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label','Hidden dealer card');
  await page.getByRole('button',{name:'Stand',exact:true}).click();await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label','9 of diamonds');await expect(page.locator('[data-dealer-reveal],[data-action-card-flight]')).toHaveCount(0);
});
