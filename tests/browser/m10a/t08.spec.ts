import { test, expect, type Page } from '@playwright/test';
const viewports = [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}];
async function deal(page:Page, fixture='player') {
  await page.goto('/?fixture='+fixture); await page.getByLabel('Your main wager',{exact:false}).fill('100');
  await page.getByRole('button',{name:'Deal',exact:true}).click();
}
async function readable(page:Page) {
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const el of await page.locator('#player-hand .cards,#player-hand .hud-hand-facts,.credits dt,.credits dd').all()) {
    await expect(el).toBeVisible(); expect(await el.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  }
  for(const el of await page.locator('[data-control-surface] button:visible').all()) {
    const b=(await el.boundingBox())!; expect(b.width).toBeGreaterThanOrEqual(44); expect(b.height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByRole('region',{name:'Dealer',exact:true})).toBeVisible();
  await expect(page.locator('.credits dt')).toHaveText(['Available','Reserved / current exposure','Pending return']);
}
test('[M10A-T08-B01] tablet groups two cards beside facts, mobile keeps stake/total above status, desktop retains primary play', async({page},info)=>{
  for(const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page); await readable(page);
    const hand=page.locator('#player-hand article');
    const boxes=await hand.evaluate(el=>{const box=(s:string)=>{const b=el.querySelector(s)!.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};};return{cards:box('.cards'),facts:box('.hud-hand-facts'),total:box('.hud-total'),wager:box('.hud-wager'),state:box('.hud-state')};});
    if(viewport.width===768) {expect(boxes.facts.x).toBeGreaterThanOrEqual(boxes.cards.x+boxes.cards.width); expect(Math.abs(boxes.cards.y-boxes.facts.y)).toBeLessThan(80);}
    if(viewport.width===320) {expect(boxes.wager.x).toBeGreaterThan(boxes.total.x); expect(boxes.state.y).toBeGreaterThanOrEqual(Math.max(boxes.total.y+boxes.total.height,boxes.wager.y+boxes.wager.height));}
    const stand=page.getByRole('button',{name:'Stand',exact:true});if(viewport.width===1280){const b=(await stand.boundingBox())!;expect(b.y+b.height).toBeLessThanOrEqual(900);}
    await page.screenshot({path:info.outputPath(`responsive-normal-${viewport.width}.png`),fullPage:true});
    await page.locator('#player-hand').focus(); for(let i=0;i<8&&!await stand.evaluate(e=>e===document.activeElement);i++)await page.keyboard.press('Tab');
    await expect(stand).toBeFocused(); expect(await stand.evaluate(e=>getComputedStyle(e).outlineStyle)).toBe('solid');
    await page.addStyleTag({content:'html { font-size:200%; }'});await readable(page);
    await page.screenshot({path:info.outputPath(`responsive-text200-${viewport.width}.png`),fullPage:true});
  }
});
for (const viewport of viewports) test(`[M10A-T08-B02-${viewport.width}] responsive scene retains Split, five cards, Insurance, Even Money, Dealer additions and pending funds`, async({page},info)=>{
  for(const state of ['split','five','insurance','even-money','complete','pending']) {
    await page.setViewportSize(viewport); await deal(page,state==='complete'?'player':'player-'+(state==='insurance'?'ace':state));
    if(state==='split')await page.getByRole('button',{name:'Split',exact:true}).click();
    if(state==='five')for(let i=0;i<3;i++)await page.getByRole('button',{name:'Hit',exact:true}).click();
    if(state==='complete')await page.getByRole('button',{name:'Stand',exact:true}).click();
    await readable(page);
    if(state==='five')await expect(page.locator('#player-hand article .card')).toHaveCount(5);
    if(state==='split')await expect(page.locator('#player-hand article')).toHaveCount(2);
    if(state==='insurance')await expect(page.getByRole('button',{name:'Buy Insurance',exact:true})).toBeEnabled();
    if(state==='even-money')await expect(page.getByRole('button',{name:'Take Even Money',exact:true})).toBeEnabled();
    if(state==='complete'){await expect(page.locator('.dealer .card')).toHaveCount(3);await expect(page.locator('#player-result')).toBeFocused();}
    if(state==='pending')await expect(page.locator('.credits dd')).toHaveText(['890','110','70']);
    await page.screenshot({path:info.outputPath(`responsive-${state}-${viewport.width}.png`),fullPage:true});
    await page.addStyleTag({content:'html { font-size:200%; }'});await readable(page);
  }
});
