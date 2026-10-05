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
    await page.screenshot({ path: `docs/images/m9-table-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
  }
});

test('[M9-E02] original characters and compact mobile public guest cards retain reduced motion and secrecy', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 }); await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?fixture=player&dealer=legacy');
  await expect(page.getByRole('img', { name: 'Original illustrated female dealer in professional attire', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: /^Computer guest: / })).toHaveCount(3);
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
  await page.screenshot({ path: 'docs/images/m9-results.png', fullPage: true, animations: 'disabled' });
  await page.getByText('Wager result details', { exact: true }).click();
  await expect(page.getByText(/Stake: 200 · Returned:/)).toBeVisible();
  await page.getByRole('button', { name: 'Repeat Bet · 100 credits', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Seat 4', exact: true }).getByText('MAIN: 100 credits', { exact: true })).toBeVisible();
  // A subsequent random-seeded round may pause on Insurance, never on a computer.
  if (await page.getByRole('button', { name: 'Decline', exact: true }).isVisible()) await page.getByRole('button', { name: 'Decline', exact: true }).click();
  if (await page.getByRole('button', { name: 'Stand', exact: true }).isVisible()) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await page.getByRole('button', { name: 'Deal Again', exact: true }).click();
  await expect(page.getByLabel('Your main wager', { exact: false })).toHaveValue('100');
  await expect(page.getByLabel('Your main wager', { exact: false })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
  await expect(page.getByRole('region', { name: 'Seat 4', exact: true }).getByText('Your cards will be dealt here.', { exact: true })).toBeVisible();
});

test('[M9-E04] tools start collapsed and seeded replay audit remain deliberately reachable', async ({ page }) => {
  await page.goto('/?fixture=player');
  const tools = page.locator('.developer-tools'); await expect(tools).not.toHaveAttribute('open', '');
  await expect(page.getByRole('region', { name: 'Demo and audit tools', exact: true })).toBeHidden();
  await tools.locator(':scope > summary').focus(); await page.keyboard.press('Enter');
  await expect(tools).toHaveAttribute('open', '');
  await page.getByText('Advanced demo settings', { exact: true }).click();
  await page.getByLabel('Optional reproducible demo seed', { exact: true }).fill('7');
  await page.getByRole('button', { name: 'Start new demo session', exact: true }).click();
  await deal(page);
  await expect(page.getByRole('button', { name: 'Open manual demo (resets credits)', exact: true })).toBeDisabled();
  await expect(page.getByLabel('Optional reproducible demo seed', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await page.getByRole('button', { name: 'View replay package', exact: true }).click();
  const p = JSON.parse(await page.getByLabel('Completed replay JSON', { exact: true }).inputValue());
  expect(p.configuration.seed).toBe(7); expect(p.commands.at(-1).command.type).toBe('SETTLE');
  await page.getByRole('button', { name: 'Replay completed session', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Replay result', exact: true })).toContainText('Original table results are preserved.');
  await page.getByText(/Public audit history \(/).click();
  await expect(page.locator('.audit-list')).toContainText('computer-1');
  await expect(page.locator('.audit-list')).toContainText('local-human');
  await expect(page.locator('.audit-list')).not.toContainText('deckIndex');
  await page.getByRole('button', { name: 'Hide replay package', exact: true }).click();
  await page.getByRole('region', { name: 'Demo and audit tools', exact: true }).screenshot({ path: 'docs/images/m9-tools.png', animations: 'disabled' });
});

test('[M9-E05] deliberate manual demo keeps configuration and explicit progress, then returns to player table', async ({ page }) => {
  await page.goto('/?fixture=player'); await page.getByText('Developer / demo tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Open manual demo (resets credits)', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Table setup', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Return to Player Mode (resets credits)', exact: true }).click();
  await expect(page.locator('.player-mode')).toBeVisible(); await expect(page.locator('.developer-tools')).not.toHaveAttribute('open', '');
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Seat 3', exact: true })).toContainText('MAIN: 25 credits');
});

test('[M9-E06] keyboard can wager, reach visible focus, stand and start another round without computer friction', async ({ page }) => {
  await page.goto('/?fixture=player');
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Skip to your hand and actions' })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('#player-decisions')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Your main wager', { exact: false })).toBeFocused();
  await page.keyboard.press('Control+A'); await page.keyboard.type('100'); await page.keyboard.press('Enter');
  await expect(page.locator('#player-hand')).toBeFocused();
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Stand', exact: true })).toBeFocused();
  expect(await page.getByRole('button', { name: 'Stand', exact: true }).evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Deal Again', exact: true })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.getByLabel('Your main wager', { exact: false })).toBeFocused();
});

test('[M9-E07] unconfigured default opens player table and own betting with closed secondary tools', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('.player-mode')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Table setup', exact: true })).toHaveCount(0);
  await expect(page.getByRole('img', { name: /^Computer guest: / })).toHaveCount(3);
  await expect(page.locator('.developer-tools')).not.toHaveAttribute('open', '');
  await expect(page.getByRole('region', { name: 'Your credits', exact: true })).toContainText('1,000');
  await expect(page.getByLabel('Your main wager', { exact: false })).toHaveValue('25');
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
  await expect(page.getByRole('region', { name: 'Seat 4', exact: true })).toContainText('Your cards will be dealt here.');
  for (const seat of [1, 3, 6]) await expect(page.getByRole('region', { name: `Seat ${seat}`, exact: true })).toContainText('MAIN: 25 credits');
  await page.screenshot({ path: 'docs/images/m9-ready.png', fullPage: true, animations: 'disabled' });
});

test('[M9-E08] player Ace decision stays explicit, hidden state stays secret even in expanded audit', async ({ page }) => {
  await page.goto('/?fixture=player-ace'); await deal(page);
  const decision = page.getByRole('region', { name: 'Insurance decision', exact: true });
  await expect(decision).toBeFocused(); await expect(page.getByRole('button', { name: 'Stand', exact: true })).toHaveCount(0);
  await page.getByText('Developer / demo tools', { exact: true }).click(); await page.getByText(/Public audit history \(/).click();
  const active = await page.locator('main').ariaSnapshot();
  expect(active).not.toContain('9 of diamonds'); expect(active).not.toContain('deckIndex');
  expect(await page.locator('main').innerHTML()).not.toMatch(/deckIndex|originalCards|seed":/);
  await page.getByRole('button', { name: 'Decline', exact: true }).click(); await expect(page.locator('#player-hand')).toBeFocused();
  await expect(page.getByRole('img', { name: 'Hidden dealer card', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(page.getByRole('img', { name: '9 of diamonds', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toContainText('Net result: -100 credits');
});

test('[M9-E09] first-person split children remain distinct and automatically finish dealer on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 }); await page.goto('/?fixture=player-split'); await deal(page);
  await page.getByRole('button', { name: 'Split', exact: true }).click();
  const own = page.getByRole('region', { name: 'Seat 4', exact: true });
  await expect(own.locator('article')).toHaveCount(2);
  await expect(own.locator('[data-hand-id="round-1/seat-4.1"]')).toContainText('Current hand');
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(own.locator('[data-hand-id="round-1/seat-4.2"]')).toContainText('Current hand');
  await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toContainText('Net result: -200 credits');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('[M9-E10] natural resolves without manual continue and pays accepted three-to-two return', async ({ page }) => {
  await page.goto('/?fixture=player-natural'); await deal(page);
  await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toContainText('Net result: 150 credits');
  await page.getByText('Wager result details', { exact: true }).click();
  await expect(page.getByText('Stake: 100 · Returned: 250 · Net: 150', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hit', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Continue table', exact: true })).toHaveCount(0);
});

test('[M9-E11] exhausted human funds disable repeat and can deliberately start a new credited session', async ({ page }) => {
  await page.goto('/?fixture=player-loss'); await page.getByLabel('Your main wager', { exact: false }).fill('1000');
  await page.getByRole('button', { name: 'Deal', exact: true }).click(); await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Repeat Bet · 1,000 credits', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Deal Again', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeDisabled();
  await page.getByText('Developer / demo tools', { exact: true }).click(); await page.getByText('Advanced demo settings', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start new demo session', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start new demo session', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Your credits', exact: true })).toContainText('1,000');
  await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
});
