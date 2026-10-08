import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolveGitDir } from '../../../scripts/git-directory.mjs';
const evidence = join(resolveGitDir(), 'overnight/visual/m11');
test('[M11-B01] lobby native navigation, deep links and refresh mount accepted Blackjack', async ({ page }) => {
  await page.goto('/casino'); await expect(page.getByRole('heading', { name: 'Casino Lobby', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Play Blackjack' }).click();
  await expect(page).toHaveURL(/\/blackjack$/); await expect(page.locator('.player-mode')).toBeVisible();
  // The preserved null-fixture entry is already prepared; production-like
  // deferred setup has its explicit existing fixture and is tested separately.
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
  await page.reload(); await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
  await page.goto('/blackjack?fixture=player-setup');
  await expect(page.getByRole('button', { name: 'Start table', exact: true })).toBeVisible();
  await page.reload(); await expect(page.getByRole('button', { name: 'Start table', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start table', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
  await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: evidence + '/blackjack.png', fullPage: true });
  await page.getByRole('navigation', { name: 'Casino games' }).getByRole('link', { name: 'Casino Lobby' }).click();
  // M13 intentionally replaces the preview with a verified playable table.
  await page.getByRole('link', { name: 'Play Baccarat' }).click();
  await expect(page).toHaveURL(/\/baccarat$/); await expect(page.getByRole('region', { name: 'Baccarat table' })).toBeVisible();
  await page.reload(); await expect(page.getByRole('button', { name: 'Place Bet · Player' })).toBeVisible();
});
for (const width of [1280, 768, 320]) test(`[M11-B02-${width}] responsive lobby and keyboard game links`, async ({ page }) => {
  await page.setViewportSize({ width, height: width === 768 ? 1024 : 900 }); await page.goto('/casino');
  await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const play = page.getByRole('link', { name: 'Play Blackjack' }); await play.focus();
  await expect(play).toBeFocused(); expect((await play.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: `${evidence}/lobby-${width}.png`, fullPage: true });
  await page.keyboard.press('Enter'); await expect(page).toHaveURL(/\/blackjack$/);
});
test('[M11-B03] original root entry and unknown route stay explicit', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('.player-mode')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Casino Lobby', exact: true })).toHaveCount(0);
  await page.goto('/missing'); await expect(page.getByRole('heading', { name: 'Table not found' })).toBeVisible();
  await page.getByRole('link', { name: 'Return to Casino Lobby' }).click(); await expect(page).toHaveURL(/\/casino$/);
});
