import { test, expect } from '@playwright/test';

async function deal(page: import('@playwright/test').Page) {
  await page.getByLabel('Your MAIN at Seat 4', { exact: true }).fill('100');
  await page.getByRole('button', { name: 'Set Your MAIN at Seat 4', exact: true }).click();
  await page.getByRole('button', { name: 'Close betting and deal', exact: true }).click();
}

test('[M9-E01] first-person cards stay near player and center dealer without overlap on desktop tablet mobile', async ({ page }, info) => {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 320, height: 720 }]) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player'); await deal(page);
    await page.evaluate(() => scrollTo(0, 0));
    const dealer = await page.getByRole('region', { name: 'Dealer', exact: true }).boundingBox();
    const local = page.getByRole('region', { name: 'Seat 4', exact: true });
    const own = await local.boundingBox();
    expect(dealer).not.toBeNull(); expect(own).not.toBeNull();
    expect(dealer!.y).toBeGreaterThanOrEqual(0);
    expect(Math.abs(dealer!.x + dealer!.width / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(own!.y).toBeGreaterThan(dealer!.y + dealer!.height);
    for (const seat of [1, 3, 6]) {
      const guest = await page.getByRole('region', { name: `Seat ${seat}`, exact: true }).boundingBox();
      expect(guest!.y + guest!.height).toBeLessThanOrEqual(own!.y);
    }
    const ownCard = await local.locator('.card').first().boundingBox();
    const guestCard = await page.getByRole('region', { name: 'Seat 1', exact: true }).locator('.card').first().boundingBox();
    expect(ownCard!.width).toBeGreaterThan(guestCard!.width);
    const title = await local.locator('h3').boundingBox(); const active = await local.locator('.turn-marker').boundingBox();
    expect(title!.y + title!.height <= active!.y || title!.x + title!.width <= active!.x).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Stand', exact: true })).toBeEnabled();
    const action = await page.getByRole('button', { name: 'Stand', exact: true }).boundingBox();
    console.log(JSON.stringify({ viewport, dealer, own, action }));
    if (viewport.width === 1280) expect(action!.y + action!.height).toBeLessThanOrEqual(900);
    await page.screenshot({ path: info.outputPath(`table-${viewport.width}.png`), fullPage: true, animations: 'disabled' });
  }
});
