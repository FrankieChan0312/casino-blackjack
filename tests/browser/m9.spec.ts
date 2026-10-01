import { test, expect } from '@playwright/test';

async function deal(page: import('@playwright/test').Page) {
  await page.getByLabel('Your main wager', { exact: false }).fill('100');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
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
    const guestCard = viewport.width === 320 ? await page.getByRole('region', { name: 'Dealer', exact: true }).locator('.card').first().boundingBox()
      : await page.getByRole('region', { name: 'Seat 1', exact: true }).locator('.guest-desktop-hand .card').first().boundingBox();
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

test('[M9-E02] original characters and compact mobile public guest cards retain reduced motion and secrecy', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 }); await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?fixture=player');
  await expect(page.getByRole('img', { name: 'Original illustrated female dealer in professional attire', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Original illustrated computer guest in evening attire', exact: true })).toHaveCount(3);
  await deal(page); await page.evaluate(() => scrollTo(0, 0));
  const guest = page.getByRole('region', { name: 'Seat 1', exact: true });
  await expect(guest.locator('.guest-mobile-cards')).not.toHaveAttribute('open', '');
  await guest.getByText('Cards · 17', { exact: true }).click();
  await expect(guest.getByRole('img', { name: 'J of hearts', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Hidden dealer card', exact: true })).toBeVisible();
  expect(await page.locator('.local .card').first().evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('[M9-E03] own wager deals once, auto settles, repeats original amount and opens fresh betting', async ({ page }) => {
  await page.goto('/?fixture=player');
  await expect(page.getByLabel('Computer MAIN at Seat 1', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open betting', exact: true })).toHaveCount(0);
  await deal(page); await expect(page.locator('#player-hand')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Continue table', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Double', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toBeVisible();
  await expect(page.locator('#player-result')).toBeFocused();
  await page.getByText('Wager result details', { exact: true }).click();
  await expect(page.getByText(/Stake: 200 · Returned:/)).toBeVisible();
  await page.getByRole('button', { name: 'Repeat Bet · 100 credits', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Seat 4', exact: true }).getByText('MAIN: 100 credits', { exact: true })).toBeVisible();
  // A subsequent random-seeded round may pause on Insurance, never on a computer.
  if (await page.getByRole('button', { name: 'Decline', exact: true }).isVisible()) await page.getByRole('button', { name: 'Decline', exact: true }).click();
  if (await page.getByRole('button', { name: 'Stand', exact: true }).isVisible()) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await page.getByRole('button', { name: 'Deal Again', exact: true }).click();
  await expect(page.getByLabel('Your main wager', { exact: false })).toHaveValue('100');
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
  await expect(page.getByRole('region', { name: 'Seat 4', exact: true }).getByText('Your cards will be dealt here.', { exact: true })).toBeVisible();
});
