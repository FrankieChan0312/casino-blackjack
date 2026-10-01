import { test, expect } from '@playwright/test';

test('active hand title and ACTIVE badge occupy separate visible space on tablet desktop and mobile', async ({ page }) => {
  for (const fixture of ['basic', 'split']) {
    await page.goto(`/?fixture=${fixture}`);
    if (fixture === 'split') await page.getByRole('button', { name: 'Split', exact: true }).click();
    for (const size of [{ width: 768, height: 1024 }, { width: 1280, height: 900 }, { width: 320, height: 720 }]) {
      await page.setViewportSize(size);
      const hand = page.locator('.seat.local .active-hand');
      const title = hand.getByRole('heading', { level: 3 });
      const badge = hand.locator('.turn-marker');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Hand A · Current hand');
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText('ACTIVE');
      const titleBox = (await title.boundingBox())!;
      const badgeBox = (await badge.boundingBox())!;
      const intersection = titleBox.x < badgeBox.x + badgeBox.width && badgeBox.x < titleBox.x + titleBox.width
        && titleBox.y < badgeBox.y + badgeBox.height && badgeBox.y < titleBox.y + titleBox.height;
      console.log(JSON.stringify({ fixture, viewport: size, title: titleBox, active: badgeBox, intersection }));
      expect(intersection).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test('polished desktop anchors dealer and seven seats above visible game controls, with secondary tools closed', async ({ page }) => {
  await page.goto('/?fixture=basic');
  const dealer = await page.getByRole('region', { name: 'Dealer', exact: true }).boundingBox();
  const local = await page.locator('.seat.local').boundingBox();
  const hit = await page.getByRole('button', { name: 'Hit', exact: true }).boundingBox();
  expect(dealer!.y).toBeLessThan(local!.y);
  expect(Math.abs(dealer!.x + dealer!.width / 2 - (local!.x + local!.width / 2))).toBeLessThan(10);
  expect(hit!.y + hit!.height).toBeLessThan(900);
  await expect(page.locator('.seat')).toHaveCount(7);
  await expect(page.locator('.seat.local .turn-marker')).toHaveText('ACTIVE');
  await expect(page.locator('.seat.local')).toContainText('Wager: 100');
  expect(await page.locator('.demo-tools details').evaluateAll(nodes => nodes.every(node => !node.hasAttribute('open')))).toBe(true);
  expect((await page.locator('.demo-tools').boundingBox())!.y).toBeGreaterThan(hit!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const face = page.locator('.seat.local .card').first();
  await expect(face).toHaveAttribute('aria-label', '5 of clubs');
  expect(await face.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(255, 253, 245)');
});

test('mobile puts current cards and actions first, keeps dealer in initial viewport and disables all motion on request', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?fixture=basic');
  await expect(page.getByRole('region', { name: 'Primary actions' }).getByRole('img').first()).toBeVisible();
  const dealer = await page.getByRole('region', { name: 'Dealer', exact: true }).boundingBox();
  expect(dealer!.y + dealer!.height).toBeLessThan(720);
  for (const element of ['.card', '.active-hand', '.result-badge', '.action-hit']) {
    const motion = await page.locator(element).first().evaluate(el => ({ animation: getComputedStyle(el).animationName, transition: getComputedStyle(el).transitionDuration }));
    expect(motion).toEqual({ animation: 'none', transition: '0s' });
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'docs/images/mobile-table.png', fullPage: true });
});

test('wager chips select an amount without placing it, preserving explicit funded commands', async ({ page }) => {
  await page.goto('/?fixture=setup');
  await page.getByRole('button', { name: 'Open betting', exact: true }).click();
  await page.getByRole('button', { name: 'Your MAIN at Seat 1: choose 25 credits', exact: true }).click();
  await expect(page.getByLabel('Your MAIN at Seat 1', { exact: true })).toHaveValue('25');
  await expect(page.getByRole('region', { name: 'Your credits' }).locator('dd').first()).toHaveText('1,000');
  await page.getByRole('button', { name: 'Set Your MAIN at Seat 1', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Your credits' }).locator('dd').first()).toHaveText('975');
});

test('split children and Charlie retain distinct game-object markers and exact returns', async ({ page }) => {
  await page.goto('/?fixture=split');
  await page.getByRole('button', { name: 'Split', exact: true }).click();
  await expect(page.locator('.seat.local article')).toHaveCount(2);
  await expect(page.locator('.seat.local .active-hand')).toContainText('Hand A');
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(page.locator('.seat.local .active-hand')).toContainText('Hand B');
  await expect(page.locator('.seat.local article').first()).toContainText('Decisions complete');
  await page.goto('/?fixture=charlie21');
  for (let n = 0; n < 3; n++) await page.getByRole('button', { name: 'Hit', exact: true }).click();
  await expect(page.locator('.seat.local .charlie')).toHaveText('Charlie Win');
  await expect(page.locator('.seat.local')).not.toContainText('Blackjack');
  await page.getByRole('button', { name: 'Continue table', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Main hand results' })).toContainText('Returned: 200');
});

test('moving the local seat preserves centered priority and seven-seat layout with all computers funded', async ({ page }) => {
  await page.goto('/?fixture=setup');
  await page.getByLabel('Your seat', { exact: true }).selectOption('5');
  for (const seat of [1, 2, 3, 4, 6, 7]) await page.getByLabel(`Computer at Seat ${seat}`, { exact: true }).check();
  await page.getByRole('button', { name: 'Open betting', exact: true }).click();
  for (let seat = 1; seat <= 7; seat++) await page.getByRole('button', { name: `Set ${seat === 5 ? 'Your' : 'Computer'} MAIN at Seat ${seat}`, exact: true }).click();
  await page.getByRole('button', { name: 'Close betting and deal', exact: true }).click();
  await expect(page.locator('.seat.local')).toHaveAttribute('aria-label', 'Seat 5');
  await expect(page.locator('.seat article')).toHaveCount(7);
  for (const size of [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 320, height: 720 }]) {
    await page.setViewportSize(size);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
