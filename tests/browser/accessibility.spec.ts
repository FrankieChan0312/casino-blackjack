import { test, expect, type Page } from '@playwright/test';

async function tabTo(page: Page, name: string) {
  for (let n = 0; n < 30; n++) {
    await page.keyboard.press('Tab');
    if (await page.getByRole('button', { name, exact: true }).evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error(`Keyboard could not reach ${name}`);
}
test('keyboard-only setup, wager, Hit/Stand and completion with visible focus', async ({ page }) => {
  await page.goto('/?fixture=setup');
  await tabTo(page, 'Open betting'); await page.keyboard.press('Enter');
  await tabTo(page, 'Set Your MAIN at Seat 1'); await page.keyboard.press('Enter');
  await tabTo(page, 'Close betting and deal'); await page.keyboard.press('Enter');
  await tabTo(page, 'Hit'); await expect(page.getByRole('button', { name: 'Hit', exact: true })).toBeFocused();
  expect(await page.getByRole('button', { name: 'Hit', exact: true }).evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter'); await expect(page.getByRole('region', { name: 'Primary actions' })).toContainText('Total: 13');
  await tabTo(page, 'Stand'); await page.keyboard.press('Enter');
  await tabTo(page, 'Continue table'); await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Round complete');
});
test('desktop has no horizontal overflow and primary controls meet touch height', async ({ page }) => {
  await page.goto('/?fixture=basic'); await expect(page.getByRole('button', { name: 'Hit', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const box = await page.getByRole('button', { name: 'Hit', exact: true }).boundingBox(); expect(box!.height).toBeGreaterThanOrEqual(44);
  await page.screenshot({ path: 'test-results/desktop-table.png', fullPage: true });
});
test('320px mobile prioritizes the local hand without page horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 }); await page.goto('/?fixture=basic');
  await expect(page.getByRole('button', { name: 'Hit', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const primary = await page.getByRole('region', { name: 'Primary actions' }).boundingBox();
  const table = await page.getByRole('region', { name: 'Blackjack table' }).boundingBox(); expect(primary!.y).toBeLessThan(table!.y);
  await page.screenshot({ path: 'test-results/mobile-table.png', fullPage: true });
});
test('reduced-motion still exposes controls, semantic names and secret-free card back', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/?fixture=basic');
  const snapshot = await page.locator('body').ariaSnapshot(); expect(snapshot).toContain('Hidden dealer card'); expect(snapshot).not.toContain('K of spades');
  await expect(page.getByRole('button', { name: 'Stand', exact: true })).toBeEnabled();
  expect(await page.getByRole('button', { name: 'Stand', exact: true }).evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
});
