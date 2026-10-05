import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';

test.use({ reducedMotion: 'no-preference' });
async function prepare(page: Page, fixture: string) {
  await page.goto(`/?fixture=${fixture}`);
  await page.getByLabel('Your main wager', { exact: false }).fill('100');
}
async function deal(page: Page, fixture: string) {
  await prepare(page, fixture); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
}
async function pause(page: Page, stage: string, kind = 'MAIN') {
  await page.evaluate(({ stage, kind }) => {
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node instanceof HTMLElement && node.dataset.wagerStage === stage && node.dataset.wagerKind === kind && node.dataset.wagerSeat === '4') {
          node.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 80; });
          observer.disconnect(); return;
        }
      }
    }); observer.observe(document.body, { childList: true });
  }, { stage, kind });
}
async function resume(page: Page) {
  await page.evaluate(() => document.querySelectorAll('[data-wager-flight]').forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.play())));
}
async function capture(page: Page, path: string) {
  await page.locator('.dealer-zone').scrollIntoViewIfNeeded();
  const cdp = await page.context().newCDPSession(page);
  const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await cdp.detach(); writeFileSync(path, Buffer.from(screenshot.data, 'base64'));
}
const own = '[data-wager-flight][data-wager-seat="4"]';
for (const [fixture, outcome, amount, destination] of [
  ['player-dealer-bust', 'PLAYER_WIN', '400', 'local-credits'],
  ['player-loss', 'DEALER_WIN', '200', 'dealer-hand'],
  ['player-push', 'PUSH', '200', 'local-credits'],
] as const) test(`[T09-B01-${outcome}] real reserve/return token and immediate authoritative result`, async ({ page }) => {
  await deal(page, fixture);
  const root = `docs/M10_T09_EVIDENCE/browser/${Date.now()}-${outcome}`; mkdirSync(root, { recursive: true });
  await capture(page, `${root}/pre.png`); await pause(page, 'SETTLE_RESULT');
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(page.locator(own)).toHaveAttribute('data-wager-outcome', outcome);
  await expect(page.locator(own)).toHaveAttribute('data-wager-amount', amount);
  await expect(page.locator(own)).toHaveAttribute('data-wager-destination', destination);
  await expect(page.locator(own)).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator(own)).toHaveCSS('pointer-events', 'none');
  await expect(page.getByRole('button', { name: 'Deal Again', exact: true })).toBeEnabled();
  await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').nth(1)).toHaveText('0');
  expect(await page.locator(own).locator('button,input,a,[tabindex]').count()).toBe(0);
  await capture(page, `${root}/mid.png`); await resume(page);
  await expect(page.locator('.game-scene')).toHaveAttribute('data-wagers-running', 'false');
  await expect(page.locator('[data-wager-flight]')).toHaveCount(0); await capture(page, `${root}/settled.png`);
  writeFileSync(`${root}/receipt.json`, JSON.stringify({ fixture, outcome, amount, destination, files: ['pre.png', 'mid.png', 'settled.png'] }, null, 2));
});
test('[T09-B02] Blackjack exact gross 250 credits and next-round interruption', async ({ page }) => {
  await prepare(page, 'player-natural'); await pause(page, 'SETTLE_RESULT');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator(own)).toHaveAttribute('data-wager-outcome', 'PLAYER_BLACKJACK');
  await expect(page.locator(own)).toHaveAttribute('data-wager-amount', '500');
  await expect(page.locator(own)).toContainText('250 credits');
  await page.getByRole('button', { name: 'Deal Again', exact: true }).click();
  await expect(page.locator('[data-wager-flight],[data-action-card-flight],[data-dealer-reveal]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
});
test('[T09-B03] Double total, Split child stakes and Insurance exact amount/anchor', async ({ page }) => {
  await deal(page, 'player-loss'); await pause(page, 'MOVE_WAGER', 'DOUBLE');
  await page.getByRole('button', { name: 'Double', exact: true }).click();
  await expect(page.locator(own)).toHaveAttribute('data-wager-amount', '400');
  await expect(page.locator(own)).toHaveAttribute('data-wager-destination', 'hand-wager:round-1/seat-4');
  await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  await expect(page.locator('[data-wager-flight],[data-action-card-flight]')).toHaveCount(0);
  await deal(page, 'player-split'); await pause(page, 'MOVE_WAGER', 'SPLIT');
  await page.getByRole('button', { name: 'Split', exact: true }).click();
  await expect(page.locator(own)).toHaveAttribute('data-wager-amount', '200');
  await expect(page.locator(own)).toHaveAttribute('data-wager-destination', 'hand-wager:round-1/seat-4.1');
  await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  await expect(page.locator('.hud-hand')).toHaveCount(2);
  await deal(page, 'player-ace'); await pause(page, 'MOVE_WAGER', 'INSURANCE');
  await page.getByRole('button', { name: 'Buy Insurance', exact: true }).click();
  await expect(page.locator(own)).toHaveAttribute('data-wager-amount', '100');
  await expect(page.locator(own)).toHaveAttribute('data-wager-destination', 'insurance-wager');
  await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
  await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label', 'Hidden dealer card');
});
for (const [width, height] of [[1280, 900], [768, 1024], [320, 720]]) test(`[T09-B04-${width}] loss collection fits, resize settles, controls stay available`, async ({ page }) => {
  await page.setViewportSize({ width, height }); await deal(page, 'player-loss'); await pause(page, 'SETTLE_RESULT');
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(page.locator(own)).toHaveAttribute('data-wager-destination', 'dealer-hand');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: width + 1, height });
  await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Deal Again', exact: true })).toBeEnabled();
});
test('[T09-B05] reduced win/loss/push and Even Money display exact result without floating stacks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [fixture, available] of [['player-dealer-bust', '1,100'], ['player-loss', '900'], ['player-push', '1,000']] as const) {
    await deal(page, fixture); await page.getByRole('button', { name: 'Stand', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()).toHaveText(available);
    await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
  }
  await deal(page, 'player-even-money'); await page.getByRole('button', { name: 'Take Even Money', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()).toHaveText('1,100');
  await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
});
test('[T09-B06] two Split leaf settlements collect exact per-hand stake once', async ({ page }) => {
  await deal(page, 'player-split'); await page.getByRole('button', { name: 'Split', exact: true }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-player-actions-running', 'false');
  await page.evaluate(() => {
    const trace: string[][] = []; (window as unknown as { wagerTrace: string[][] }).wagerTrace = trace;
    new MutationObserver(records => { for (const record of records) for (const node of record.addedNodes) {
      if (node instanceof HTMLElement && node.dataset.wagerStage === 'SETTLE_RESULT' && node.dataset.wagerSeat === '4') trace.push([node.dataset.wagerAmount!, node.dataset.wagerOutcome!, node.dataset.wagerDestination!]);
    } }).observe(document.body, { childList: true });
  });
  for (let index = 0; index < 2; index++) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-wagers-running', 'false');
  expect(await page.evaluate(() => (window as unknown as { wagerTrace: string[][] }).wagerTrace)).toEqual([['200', 'DEALER_WIN', 'dealer-hand'], ['200', 'DEALER_WIN', 'dealer-hand']]);
  await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()).toHaveText('800');
});
