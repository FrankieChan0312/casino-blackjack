import { test, expect, type Page, type TestInfo } from '@playwright/test';

const viewports = [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 320, height: 720 }];
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
async function deal(page: Page, fixture = 'player', amount = '100') {
  await page.goto(`/?fixture=${fixture}`); await page.getByLabel('Your main wager', { exact: false }).fill(amount);
  await button(page, 'Deal').click();
}
async function capture(page: Page, info: TestInfo, name: string, width: number) {
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: info.outputPath(`control-${name}-${width}.png`), fullPage: true });
}
async function fit(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const cards = await page.locator('#player-hand .card:visible').evaluateAll(els => els.map(el => {
    const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
  }));
  for (const control of await page.locator('[data-control-surface] button:visible').all()) {
    const box = (await control.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
    expect(await control.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    for (const card of cards) expect(box.x + box.width <= card.x || box.x >= card.right || box.y + box.height <= card.y || box.y >= card.bottom).toBe(true);
  }
  const gap = await page.locator('#player-decisions').evaluate(el => el.getBoundingClientRect().top - document.querySelector('#player-hand')!.getBoundingClientRect().bottom);
  const width = await page.evaluate(() => innerWidth);
  expect(gap).toBe(width > 1100 ? 6 : width <= 600 ? 10 : 16);
}

test('[M10A-CB01] real wager entry, supported denominations, invalid input and complete/next-round controls retain their flow', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player');
    const input = page.getByLabel('Your main wager', { exact: false });
    await expect(input).toHaveAttribute('min', '10'); await expect(input).toHaveAttribute('max', '1000'); await expect(input).toHaveAttribute('step', '1');
    for (const invalid of ['9', '10.5', '1001']) {
      await input.fill(invalid); await expect(button(page, 'Deal')).toBeDisabled();
      await expect(page.locator('.credits')).toContainText('1,000'); await expect(page.locator('#player-hand .empty-hand')).toBeVisible();
    }
    for (const value of [10, 100, 25]) {
      const choice = button(page, `Choose ${value} credits`); await choice.click();
      await expect(input).toHaveValue(String(value)); await expect(choice).toHaveAttribute('aria-pressed', 'true');
    }
    await fit(page); await capture(page, info, 'open', viewport.width);
    await input.focus(); await page.keyboard.press('Enter'); await expect(page.locator('#player-hand')).toBeFocused();
    await expect(page.locator('#player-hand [data-felt-destination="main-wager"]')).toHaveText('MAIN: 25 credits');
    await expect(page.locator('#player-hand article .card')).toHaveCount(2);
    await expect(page.locator('#player-scene-status')).toHaveText('Your turn'); await expect(page.locator('#player-action-hand')).toHaveText('· Hand A');
    await button(page, 'Stand').click(); await expect(page.locator('#player-result')).toBeFocused();
    await expect(page.locator('[data-control-surface="actions"]')).toHaveCount(0);
    await fit(page); await capture(page, info, 'complete', viewport.width);
    await button(page, 'Deal Again').click(); await expect(input).toBeFocused(); await expect(input).toHaveValue('25');
    await expect(button(page, 'Deal')).toBeEnabled();
  }
});

test('[M10A-CB02] one native action dock targets normal and actual Split A/B hands with retained desktop primary fit', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page);
    await expect(button(page, 'Hit')).toBeEnabled(); await expect(button(page, 'Stand')).toBeEnabled();
    await expect(button(page, 'Double')).toBeEnabled(); await expect(button(page, 'Split')).toBeDisabled(); await expect(button(page, 'Surrender')).toBeEnabled();
    await expect(button(page, 'Split')).toHaveAttribute('aria-describedby', 'reason-SPLIT');
    await page.locator('.action-guidance summary').click(); await expect(page.locator('#reason-SPLIT')).toContainText('equal Blackjack values');
    await page.locator('.action-guidance summary').click(); await fit(page);
    if (viewport.width === 1280) { const box = (await button(page, 'Stand').boundingBox())!; expect(box.y + box.height).toBeLessThanOrEqual(900); }
    await capture(page, info, 'player', viewport.width);
    await deal(page, 'player-split'); await button(page, 'Split').click();
    await expect(page.locator('[data-control-surface="actions"]')).toHaveCount(1);
    await expect(page.locator('#local-actions')).toHaveAttribute('data-active-hand-id', 'round-1/seat-4.1');
    await expect(page.locator('#player-scene-status')).toHaveText('Your turn'); await expect(page.locator('#player-action-hand')).toHaveText('· Hand A');
    await expect(page.locator('#player-hand article').first().locator('.hud-total')).toHaveText('Total: 10');
    await fit(page); await capture(page, info, 'split-a', viewport.width);
    await button(page, 'Stand').click();
    await expect(page.locator('#local-actions')).toHaveAttribute('data-active-hand-id', 'round-1/seat-4.2');
    await expect(page.locator('#player-scene-status')).toHaveText('Your turn'); await expect(page.locator('#player-action-hand')).toHaveText('· Hand B');
    await expect(page.locator('#player-hand article').nth(1).locator('.hud-total')).toHaveText('Total: 11');
    await expect(page.locator('#player-hand article[aria-current="true"]')).toHaveAttribute('data-hand-id', 'round-1/seat-4.2');
    await fit(page); await capture(page, info, 'split-b', viewport.width);
    await button(page, 'Hit').click();
    await expect(page.locator('#player-hand article').first().locator('.card')).toHaveCount(2);
    await expect(page.locator('#player-hand article').nth(1).locator('.card')).toHaveCount(3);
  }
});

test('[M10A-CB03] Insurance preserves separate funding and native disclosure with no ineligible Even Money choice', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page, 'player-ace');
    const decision = page.getByRole('region', { name: 'Insurance decision', exact: true });
    await expect(decision).toBeFocused(); await expect(decision).toContainText('Insurance amount: 50 credits');
    await expect(button(page, 'Buy Insurance')).toBeEnabled(); await expect(button(page, 'Take Even Money')).toHaveCount(0);
    await expect(page.getByRole('img', { name: 'Hidden dealer card', exact: true })).toBeVisible();
    await fit(page); await capture(page, info, 'insurance', viewport.width);
    const explanation = decision.locator('.decision-explanation'); await explanation.locator('summary').focus(); await page.keyboard.press('Enter');
    await expect(explanation).toHaveAttribute('open', ''); await expect(explanation.locator('p')).toHaveText('Insurance is a separate funded wager. Eligible Even Money locks a 1:1 profit on the original stake without another wager.');
    await button(page, 'Buy Insurance').click(); await expect(decision).toHaveCount(0);
    await expect(page.locator('.credits dl > div').filter({ has: page.locator('dt', { hasText: /^Available$/ }) }).locator('dd')).toHaveText('850');
    await expect(page.locator('.credits dl > div').filter({ has: page.locator('dt', { hasText: /^Reserved/ }) }).locator('dd')).toHaveText('150');
    await expect(page.locator('#player-hand')).toBeFocused();
  }
});

test('[M10A-CB04] eligible Even Money keeps its distinct keyboard choice and exact settled original-stake profit', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page, 'player-even-money');
    const decision = page.getByRole('region', { name: 'Insurance decision', exact: true });
    await expect(button(page, 'Buy Insurance')).toBeEnabled(); await expect(button(page, 'Decline')).toBeEnabled(); await expect(button(page, 'Take Even Money')).toBeEnabled();
    await fit(page); await capture(page, info, 'even-money', viewport.width);
    await decision.focus(); await page.keyboard.press('Tab'); await expect(button(page, 'Buy Insurance')).toBeFocused();
    await page.keyboard.press('Tab'); await expect(button(page, 'Decline')).toBeFocused();
    await page.keyboard.press('Tab'); await expect(button(page, 'Take Even Money')).toBeFocused();
    await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
    await expect(page.locator('.round-net')).toHaveText('Net result: 100 credits');
    await page.locator('#player-result summary').click(); await expect(page.locator('#player-result')).toContainText('Stake: 100 · Returned: 200 · Net: 100');
    await expect(page.locator('#player-result')).not.toContainText('INSURANCE');
  }
});

test('[M10A-CB05] disabled Insurance is identifiable and explained while native tab order skips it and Decline reserves nothing', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page, 'player-ace', '1000');
    const decision = page.getByRole('region', { name: 'Insurance decision', exact: true });
    await expect(button(page, 'Buy Insurance')).toBeDisabled(); await expect(button(page, 'Buy Insurance')).toHaveAttribute('aria-describedby', 'insurance-unavailable');
    await expect(page.locator('#insurance-unavailable')).toBeVisible(); await expect(button(page, 'Take Even Money')).toHaveCount(0);
    expect(await button(page, 'Buy Insurance').evaluate(el => getComputedStyle(el).borderTopStyle)).toBe('dashed');
    await fit(page); await capture(page, info, 'insurance-unavailable', viewport.width);
    await decision.focus(); await page.keyboard.press('Tab'); await expect(button(page, 'Decline')).toBeFocused();
    await page.keyboard.press('Enter'); await expect(page.locator('#player-hand')).toBeFocused();
    await expect(button(page, 'Double')).toBeDisabled(); await expect(button(page, 'Stand')).toBeEnabled();
    await expect(page.locator('.credits dl > div').filter({ has: page.locator('dt', { hasText: /^Reserved/ }) }).locator('dd')).toHaveText('1,000');
  }
});

test('[M10A-CB06] text 200% keeps every wager, action and Insurance/Even Money label operable without covering cards', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const state of ['open', 'player', 'insurance', 'even-money']) {
      if (state === 'open') await page.goto('/?fixture=player');
      else await deal(page, state === 'insurance' ? 'player-ace' : state === 'even-money' ? 'player-even-money' : 'player');
      await page.addStyleTag({ content: 'html { font-size: 200%; }' }); await fit(page);
      await capture(page, info, `text200-${state}`, viewport.width);
      if (state === 'player') { await button(page, 'Stand').focus(); await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused(); }
      if (state === 'insurance') { await button(page, 'Decline').focus(); await page.keyboard.press('Enter'); await expect(page.locator('#player-hand')).toBeFocused(); }
    }
  }
});

test('[M10A-CB07] native keyboard actions keep visible focus, real hand routing and result/next-round focus under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await deal(page);
  await page.locator('#player-hand').focus(); await page.keyboard.press('Tab'); await expect(button(page, 'Hit')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(button(page, 'Stand')).toBeFocused();
  expect(await button(page, 'Stand').evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(button(page, 'Deal Again')).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.getByLabel('Your main wager', { exact: false })).toBeFocused();
});
