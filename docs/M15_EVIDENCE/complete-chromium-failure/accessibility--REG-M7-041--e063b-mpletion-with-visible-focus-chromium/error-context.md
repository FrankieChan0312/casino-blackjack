# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> [REG-M7-041] [UX-11] [E2E-12] keyboard-only setup, wager, Hit/Stand and completion with visible focus
- Location: tests\browser\accessibility.spec.ts:10:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://127.0.0.1:4173/?fixture=setup", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test';
  2  | 
  3  | async function tabTo(page: Page, name: string) {
  4  |   for (let n = 0; n < 30; n++) {
  5  |     await page.keyboard.press('Tab');
  6  |     if (await page.getByRole('button', { name, exact: true }).evaluate((el) => el === document.activeElement)) return;
  7  |   }
  8  |   throw new Error(`Keyboard could not reach ${name}`);
  9  | }
  10 | test('[REG-M7-041] [UX-11] [E2E-12] keyboard-only setup, wager, Hit/Stand and completion with visible focus', async ({ page }) => {
> 11 |   await page.goto('/?fixture=setup');
     |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  12 |   await tabTo(page, 'Open betting'); await page.keyboard.press('Enter');
  13 |   await tabTo(page, 'Set Your MAIN at Seat 1'); await page.keyboard.press('Enter');
  14 |   await tabTo(page, 'Close betting and deal'); await page.keyboard.press('Enter');
  15 |   await tabTo(page, 'Hit'); await expect(page.getByRole('button', { name: 'Hit', exact: true })).toBeFocused();
  16 |   expect(await page.getByRole('button', { name: 'Hit', exact: true }).evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
  17 |   await page.keyboard.press('Enter'); await expect(page.getByRole('region', { name: 'Primary actions' })).toContainText('Total: 13');
  18 |   await tabTo(page, 'Stand'); await page.keyboard.press('Enter');
  19 |   await tabTo(page, 'Continue table'); await page.keyboard.press('Enter');
  20 |   await expect(page.getByRole('status')).toHaveText('Round complete');
  21 | });
  22 | test('[REG-M7-042] desktop has no horizontal overflow and primary controls meet touch height', async ({ page }) => {
  23 |   await page.goto('/?fixture=basic'); await expect(page.getByRole('button', { name: 'Hit', exact: true })).toBeVisible();
  24 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  25 |   const box = await page.getByRole('button', { name: 'Hit', exact: true }).boundingBox(); expect(box!.height).toBeGreaterThanOrEqual(44);
  26 |   await page.screenshot({ path: 'test-results/desktop-table.png', fullPage: true });
  27 |   await page.setViewportSize({ width: 768, height: 1024 });
  28 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  29 |   await expect(page.getByRole('button', { name: 'Hit', exact: true })).toBeVisible();
  30 | });
  31 | test('[REG-M7-043] [UX-12] [E2E-13] 320px mobile prioritizes the local hand without page horizontal overflow', async ({ page }) => {
  32 |   await page.setViewportSize({ width: 320, height: 720 }); await page.goto('/?fixture=basic');
  33 |   await expect(page.getByRole('button', { name: 'Hit', exact: true })).toBeVisible();
  34 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  35 |   const primary = await page.getByRole('region', { name: 'Primary actions' }).boundingBox();
  36 |   const table = await page.getByRole('region', { name: 'Blackjack table' }).boundingBox(); expect(primary!.y).toBeLessThan(table!.y);
  37 |   for (const action of ['Hit', 'Stand', 'Double', 'Split', 'Surrender']) {
  38 |     const box = await page.getByRole('button', { name: action, exact: true }).boundingBox();
  39 |     expect(box!.height).toBeGreaterThanOrEqual(44); expect(box!.width).toBeGreaterThanOrEqual(44);
  40 |   }
  41 |   await page.screenshot({ path: 'test-results/mobile-table.png', fullPage: true });
  42 | });
  43 | test('[REG-M7-044] reduced-motion still exposes controls, semantic names and secret-free card back', async ({ page }) => {
  44 |   await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/?fixture=basic');
  45 |   const snapshot = await page.locator('body').ariaSnapshot(); expect(snapshot).toContain('Hidden dealer card'); expect(snapshot).not.toContain('K of spades');
  46 |   await expect(page.getByRole('button', { name: 'Stand', exact: true })).toBeEnabled();
  47 |   expect(await page.getByRole('button', { name: 'Stand', exact: true }).evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  48 | });
  49 | 
```