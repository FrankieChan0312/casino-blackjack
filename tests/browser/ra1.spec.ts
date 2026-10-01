import { expect, test } from '@playwright/test';

test('RA1 browser RSA offers only legal choices and keyboard Stand declines to complete Soft 12', async ({page}) => {
  await page.goto('/?fixture=player-rsa');
  await page.getByLabel('Your main wager',{exact:false}).fill('100');
  await page.getByRole('button',{name:'Deal',exact:true}).click();
  await page.getByRole('button',{name:'Split',exact:true}).click();
  await expect(page.locator('#rsa-choice')).toContainText('Stand to keep Soft 12');
  for (const name of ['Hit','Double','Surrender']) await expect(page.getByRole('button',{name,exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Split',exact:true})).toBeEnabled();
  const stand = page.getByRole('button',{name:'Stand',exact:true}); await page.keyboard.press('Tab');
  await expect(stand).toBeFocused();
  expect(await stand.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('region',{name:'Your round result',exact:true})).toContainText('Net result: 0 credits');
  await expect(page.locator('[data-hand-id="round-1/seat-4.1"]')).toContainText('12');
  await expect(page.locator('#player-result')).toBeFocused();
});
test('RA1 browser depth-first RSA remains readable with accessible 44px controls across viewport sizes', async ({page}) => {
  for (const viewport of [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}]) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player-rsa');
    await page.getByLabel('Your main wager',{exact:false}).fill('100');
    await page.getByRole('button',{name:'Deal',exact:true}).click(); await page.getByRole('button',{name:'Split',exact:true}).click();
    for (const name of ['Split','Stand']) {
      const box = await page.getByRole('button',{name,exact:true}).boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`test-results/ra1-${viewport.width}.png`,fullPage:true,animations:'disabled'});
    await page.getByRole('button',{name:'Split',exact:true}).click();
    const own = page.getByRole('region',{name:'Seat 4',exact:true}); await expect(own.locator('article')).toHaveCount(3);
    for (const id of ['round-1/seat-4.1.1','round-1/seat-4.1.2','round-1/seat-4.2']) await expect(own.locator(`[data-hand-id="${id}"]`)).toBeVisible();
    await expect(page.getByRole('region',{name:'Your round result',exact:true})).toContainText('Net result: 200 credits');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
test('RA1 browser unavailable funding and fourth-leaf cap finish A+A without redundant Stand friction', async ({page}) => {
  await page.goto('/?fixture=player-rsa'); await page.getByLabel('Your main wager',{exact:false}).fill('500');
  await page.getByRole('button',{name:'Deal',exact:true}).click(); await page.getByRole('button',{name:'Split',exact:true}).click();
  await expect(page.getByRole('region',{name:'Your round result',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Stand',exact:true})).toHaveCount(0);
  await page.goto('/?fixture=player-rsa-cap'); await page.getByLabel('Your main wager',{exact:false}).fill('100');
  await page.getByRole('button',{name:'Deal',exact:true}).click();
  for (let n=0;n<3;n++) await page.getByRole('button',{name:'Split',exact:true}).click();
  await expect(page.getByRole('region',{name:'Seat 4',exact:true}).locator('article')).toHaveCount(4);
  await expect(page.getByRole('region',{name:'Your round result',exact:true})).toContainText('Net result: -400 credits');
  await expect(page.getByRole('button',{name:'Split',exact:true})).toHaveCount(0);
});
