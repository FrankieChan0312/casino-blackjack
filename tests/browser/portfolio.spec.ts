import { test, expect } from '@playwright/test';

test('reproducible portfolio screenshots show only public Classic, Charlie and replay/audit views', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/?fixture=basic');
  expect(await page.locator('body').ariaSnapshot()).not.toContain('K of spades');
  expect(await page.locator('body').evaluate(el => el.outerHTML)).not.toMatch(/1:spades:K|deckIndex|randomAlgorithm/);
  await page.screenshot({ path: 'docs/images/classic-table.png', fullPage: true });
  await page.goto('/?fixture=setup');
  await page.getByText('Advanced demo settings', { exact: true }).click();
  await page.getByLabel('New session profile').selectOption('CHARLIE5_6D_S17_V1_1');
  await page.getByLabel('Optional reproducible demo seed').fill('21');
  await page.getByRole('button', { name: 'Start new demo session', exact: true }).click();
  for (const name of ['Open betting', 'Set Your MAIN at Seat 1', 'Close betting and deal', 'Hit', 'Hit', 'Hit', 'Continue table']) {
    await page.getByRole('button', { name, exact: true }).click();
  }
  await expect(page.getByRole('region', { name: 'Main hand results' })).toContainText('Charlie Win');
  await page.screenshot({ path: 'docs/images/charlie-result.png', fullPage: true });
  await page.getByRole('button', { name: 'Replay completed session', exact: true }).click();
  await page.getByText(/Public audit history \(/).click();
  const tools = page.getByRole('region', { name: 'Demo and audit tools' });
  await expect(tools).toContainText('Replay mode');
  await expect(page.getByLabel('Completed replay JSON')).toHaveCount(0);
  expect(await page.locator('.audit-list').textContent()).not.toMatch(/deckIndex|prng|"seed"|physical card/i);
  await tools.screenshot({ path: 'docs/images/replay-audit.png' });
});
