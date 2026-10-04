import { test, expect, type Page } from '@playwright/test';
const viewports = [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}];
async function start(page: Page, fixture: string, amount = '100') {
  await page.goto('/?fixture='+fixture); await page.getByLabel('Your main wager',{exact:false}).fill(amount);
  await page.getByRole('button',{name:'Deal',exact:true}).click();
}
async function funds(page: Page, values: string[]) {
  const hud = page.getByRole('region',{name:'Your credits',exact:true}); await expect(hud).toBeVisible();
  await expect(hud.locator('dt')).toHaveText(['Available','Reserved / current exposure','Pending return']);
  await expect(hud.locator('dd')).toHaveText(values); await expect(hud.getByRole('heading',{name:'Credits',exact:true})).toBeVisible();
  expect(await hud.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for (const el of await hud.locator('dt,dd').all()) { await expect(el).toBeVisible(); expect(await el.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true); }
}
test('[M10A-T07-B01] secondary accounting keeps exact normal, Insurance, pending, Split/Double and low-fund values at three widths', async ({page},info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player'); await funds(page,['1,000','0','0']);
    await page.screenshot({path:info.outputPath(`credits-open-${viewport.width}.png`),fullPage:true});
    await start(page,'player-split'); await funds(page,['900','100','0']); await page.getByRole('button',{name:'Split',exact:true}).click(); await funds(page,['800','200','0']);
    await page.getByRole('button',{name:'Double',exact:true}).click(); await funds(page,['700','300','0']);
    await start(page,'player-ace','101'); await page.getByRole('button',{name:'Buy Insurance',exact:true}).click(); await funds(page,['848.5','151.5','0']);
    await start(page,'player-pending'); await funds(page,['890','110','70']);
    await page.screenshot({path:info.outputPath(`credits-pending-${viewport.width}.png`),fullPage:true});
    await start(page,'player-loss','1000'); await funds(page,['0','1,000','0']); await page.getByRole('button',{name:'Stand',exact:true}).click(); await funds(page,['0','0','0']);
    await expect(page.getByRole('button',{name:'Repeat Bet · 1,000 credits',exact:true})).toBeDisabled();
  }
});
test('[M10A-T07-B02] text200 keeps three funds visible without introducing focus stops or hiding controls', async ({page},info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await start(page,'player-pending'); await page.addStyleTag({content:'html { font-size: 200%; }'}); await funds(page,['890','110','70']);
    await page.screenshot({path:info.outputPath(`credits-text200-${viewport.width}.png`),fullPage:true});
    await page.locator('#player-hand').focus(); await page.keyboard.press('Tab');
    if (viewport.width === 320) { await expect(page.getByRole('region',{name:'Seat 6',exact:true}).locator('summary')).toBeFocused(); await page.keyboard.press('Tab'); }
    await expect(page.getByRole('button',{name:'Hit',exact:true})).toBeFocused();
    expect(await page.getByRole('button',{name:'Hit',exact:true}).evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
    await page.keyboard.press('Tab'); await expect(page.getByRole('button',{name:'Stand',exact:true})).toBeFocused();
  }
});
