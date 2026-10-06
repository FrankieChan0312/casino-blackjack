import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const evidence = '.git/overnight/visual/m13';
async function capture(page: Page, name: string) { mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: `${evidence}/${name}.png`, fullPage: true }); }
async function open(page: Page, fixture = 'player-natural') { await page.goto(`/baccarat?baccaratFixture=${fixture}`); await expect(page.getByRole('button', { name: 'Place Bet · Player' })).toBeVisible(); }
async function wager(page: Page, target: string, amount = '25') { await page.getByRole('button', { name: new RegExp(`^${target} `) }).click(); await page.getByLabel('Wager amount', { exact: true }).fill(amount); await page.getByRole('button', { name: `Place Bet · ${target}` }).click(); }
async function authority(page: Page) { return page.evaluate(() => {
  const controller = (window as unknown as { baccaratTestController: { getDigest(): string; exportReplay(): unknown } }).baccaratTestController;
  return { digest: controller.getDigest(), replay: controller.exportReplay() };
}); }
test('[M13-B01] targets, atomic funding, clear, exact commission, next and repeat', async ({ page }) => {
  await page.goto('/casino'); await capture(page, '00-casino-lobby'); await page.getByRole('link', { name: 'Play Baccarat' }).click();
  await expect(page.getByRole('button', { name: 'Place Bet · Player' })).toBeVisible();
  await open(page, 'banker-natural'); await capture(page, '01-pre-bet-desktop');
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeDisabled();
  const before = await authority(page);
  await page.getByRole('button', { name: /^Banker / }).click();
  expect(await authority(page)).toEqual(before);
  await wager(page, 'Player'); await capture(page, '02-player-wager');
  await wager(page, 'Banker'); await capture(page, '03-banker-wager');
  await wager(page, 'Tie'); await capture(page, '04-tie-wager');
  await expect(page.locator('[data-credits="available"]')).toHaveText('925');
  await expect(page.locator('[data-credits="reserved"]')).toHaveText('75');
  await page.getByRole('button', { name: 'Clear Bets' }).click();
  await expect(page.locator('[data-credits="available"]')).toHaveText('1,000');
  await wager(page, 'Banker'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('BANKER WINS');
  await expect(page.locator('[data-credits="available"]')).toHaveText('1,023.75');
  await expect(page.locator('[data-credits="reserved"]')).toHaveText('0');
  await expect(page.locator('[data-credits="pending"]')).toHaveText('0');
  await expect(page.locator('[data-round-net]')).toHaveText('+23.75'); await capture(page, '05-banker-win');
  await page.getByRole('button', { name: 'Repeat Bet' }).click();
  await expect(page.locator('[data-credits="available"]')).toHaveText('998.75');
  await expect(page.locator('[data-wager-target="BANKER"] [data-wager-units]')).toHaveText('25 credits');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await page.getByRole('button', { name: 'Deal Again' }).click();
  await expect(page.locator('[data-credits="reserved"]')).toHaveText('0');
  await expect(page.getByRole('status')).toHaveText('PLACE YOUR BET'); await capture(page, '06-next-round');
});
const paths = [
  ['player-natural', 2, 2, 'PLAYER WINS', 'Natural', '07-player-natural'],
  ['two-card', 2, 2, 'BANKER WINS', 'Banker stands', '08-four-card'],
  ['player-third', 3, 2, 'PLAYER WINS', 'Player draws a third card', '09-player-third'],
  ['banker-third', 2, 3, 'TIE', 'Banker draws a third card', '10-banker-third'],
  ['both-third', 3, 3, 'PLAYER WINS', 'Banker draws a third card', '11-six-card'],
  ['banker-win', 3, 3, 'BANKER WINS', 'Banker draws a third card', '12-banker-six-card'],
  ['tie', 2, 2, 'TIE', 'Natural', '13-tie'],
] as const;
for (const [fixture, player, banker, outcome, decision, image] of paths) test(`[M13-B02-${fixture}] authority cards, totals and result`, async ({ page }) => {
  await open(page, fixture); await wager(page, 'Player'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Player cards', exact: true }).getByRole('img')).toHaveCount(player);
  await expect(page.getByRole('group', { name: 'Banker cards', exact: true }).getByRole('img')).toHaveCount(banker);
  await expect(page.getByRole('status')).toContainText(outcome);
  await expect(page.locator('.baccarat-table')).toContainText(decision); await capture(page, image);
  const final = await authority(page); await page.getByRole('status').click(); expect(await authority(page)).toEqual(final);
});
test('[M13-B03] tie returns both main stakes and pays Tie 8:1', async ({ page }) => {
  await open(page, 'tie'); for (const target of ['Player', 'Banker', 'Tie']) await wager(page, target);
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('[data-credits="available"]')).toHaveText('1,200');
  await expect(page.locator('[data-round-net]')).toHaveText('+200');
  for (const target of ['PLAYER', 'BANKER']) await expect(page.locator(`[data-wager-target="${target}"]`)).toContainText('PUSH');
  await expect(page.locator('[data-wager-target="TIE"]')).toContainText('WIN'); await capture(page, '14-settlement');
});
test('[M13-B04] rejection preserves authority, insufficient repeat has no refill', async ({ page }) => {
  await open(page, 'banker-natural'); await wager(page, 'Player', '1000'); const before = await authority(page);
  await wager(page, 'Tie', '1'); await expect(page.getByRole('alert')).toBeVisible(); expect(await authority(page)).toEqual(before);
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('[data-credits="available"]')).toHaveText('0'); await expect(page.getByRole('button', { name: 'Repeat Bet' })).toBeDisabled();
  await expect(page.getByText('Not enough credits to repeat the previous bets.')).toBeVisible(); await capture(page, '15-insufficient');
  await page.getByRole('button', { name: 'Deal Again' }).click(); await wager(page, 'Player', '1'); await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('[data-credits="available"]')).toHaveText('0');
});
test('[M13-B05] approved identities, reserved Dealer, fallback and unchanged authority', async ({ page }) => {
  await open(page); const before = await authority(page);
  await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: /^Your character: Roland/ })).toBeVisible(); await capture(page, '16-dealer-avatar-hud');
  await page.getByText('Change Character · Roland', { exact: true }).click();
  await expect(page.locator('#baccarat-character option[value="noble_female"]')).toBeDisabled();
  await page.getByLabel('Your character', { exact: true }).selectOption('mage_male');
  expect(await authority(page)).toEqual(before); await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: /^Your character: Alaric/ })).toBeVisible(); await capture(page, '17-alternate-avatar');
  expect(await page.locator('img').evaluateAll(images => images.every(image => !(image as HTMLImageElement).src.includes('dealer_cartoon')))).toBe(true);
  await page.route('**/characters/dealer/noble_female/formal.png', route => route.abort()); await page.reload();
  await expect(page.locator('[data-dealer-avatar="generic-formal"]')).toBeVisible();
});
for (const width of [1280, 768, 320]) test(`[M13-B06-${width}] responsive, keyboard, touch and 200% text`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); await open(page, 'both-third');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `pre-bet-${width}`);
  for (const button of await page.locator('.baccarat-page button').all()) expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  const target = page.getByRole('button', { name: /^Banker / }); await target.focus(); await expect(target).toBeFocused();
  expect(await target.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter'); await expect(target).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Place Bet · Banker' }).focus(); await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Deal', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('ROUND COMPLETE');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `complete-${width}`);
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const shoe = (await page.locator('.baccarat-shoe').boundingBox())!, status = (await page.getByRole('status').boundingBox())!;
  expect(shoe.y + shoe.height).toBeLessThanOrEqual(status.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `text-200-${width}`);
  await page.getByRole('button', { name: 'Deal Again' }).click(); await expect(page.getByRole('button', { name: 'Place Bet · Banker' })).toBeVisible();
});
