import { test, expect, type Page } from '@playwright/test';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const seat = (page: Page, n = 1) => page.getByRole('region', { name: `Seat ${n}`, exact: true });
async function fixture(page: Page, name: string) { await page.goto(`/?fixture=${name}`); }

test('[REG-M7-045] [E2E-01] start a round and complete exact Hit/Stand flow', async ({ page }) => {
  await fixture(page, 'setup'); await button(page, 'Open betting').click();
  await page.getByLabel('Your MAIN at Seat 1', { exact: true }).fill('100'); await button(page, 'Set Your MAIN at Seat 1').click();
  await button(page, 'Close betting and deal').click(); await button(page, 'Hit').click();
  await expect(seat(page).getByRole('img')).toHaveCount(3); await expect(seat(page)).toContainText('Total: 13');
  await button(page, 'Stand').click(); await button(page, 'Continue table').click(); await expect(page.getByRole('status')).toHaveText('Round complete');
  await expect(page.getByRole('region', { name: 'Main hand results' })).toContainText('Win');
});
test('[REG-M7-046] [UX-04] [E2E-02] known hidden rank/suit/physical ID absent from DOM and accessibility until reveal', async ({ page }) => {
  await fixture(page, 'basic');
  const dom = await page.content(); const accessibility = await page.locator('body').ariaSnapshot();
  const metadata = await page.locator('*').evaluateAll((elements) => elements.flatMap((el) => Array.from(el.attributes).map((a) => `${a.name}=${a.value}`)).join('\n'));
  for (const output of [dom, accessibility, metadata]) {
    expect(output).not.toContain('K of spades'); expect(output).not.toContain('1:spades:K'); expect(output).not.toMatch(/"rank"\s*:\s*"K"/);
    expect(output).not.toContain('spades'); expect(output).not.toMatch(/\bK\b/);
  }
  expect(await page.locator('body').innerText()).not.toMatch(/\bK\b/);
  await expect(page.getByRole('img', { name: 'Hidden dealer card' })).toBeVisible();
  await button(page, 'Stand').click(); await expect(page.getByRole('region', { name: 'Dealer', exact: true }).getByRole('img', { name: 'K of spades' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Hidden dealer card' })).toHaveCount(0);
});
test('[REG-M7-047] [UX-06] [E2E-03] completed hand has no further gameplay controls', async ({ page }) => {
  await fixture(page, 'basic'); await button(page, 'Double').click();
  for (const action of ['Hit', 'Stand', 'Double', 'Split', 'Surrender']) await expect(button(page, action)).toHaveCount(0);
  await expect(seat(page).getByRole('img')).toHaveCount(3); await expect(seat(page)).toContainText('Wager: 200');
});
test('[REG-M7-048] [UX-08] [E2E-04] insufficient available credits disable Double with a reason', async ({ page }) => {
  await fixture(page, 'poor'); await expect(button(page, 'Double')).toBeDisabled();
  await expect(page.getByRole('region', { name: 'Primary actions' })).toContainText('Double unavailable — Not enough available credits.');
  await expect(seat(page).getByRole('img')).toHaveCount(2);
});
test('[REG-M7-049] [UX-09] [E2E-05] Split displays two ordered hands and activates the sibling after Stand', async ({ page }) => {
  await fixture(page, 'split'); await button(page, 'Split').click(); const hands = seat(page).locator('article');
  await expect(hands).toHaveCount(2); await expect(hands.nth(0)).toHaveAttribute('data-hand-id', 'round-1/seat-1.1');
  await expect(hands.nth(1)).toHaveAttribute('data-hand-id', 'round-1/seat-1.2');
  await expect(hands.nth(0)).toContainText('Current hand'); await expect(hands.nth(1).getByRole('img')).toHaveCount(1);
  await button(page, 'Stand').click(); await expect(hands.nth(1)).toContainText('Current hand'); await expect(hands.nth(1).getByRole('img')).toHaveCount(2);
});
test('[REG-M7-050] [E2E-06] Split Aces have one added card each and no Hit/Double/Surrender', async ({ page }) => {
  await fixture(page, 'aces'); await button(page, 'Split').click(); const hands = seat(page).locator('article');
  await expect(hands).toHaveCount(2); for (let n = 0; n < 2; n++) await expect(hands.nth(n).getByRole('img')).toHaveCount(2);
  await expect(hands.nth(0)).toContainText('Total: 21'); await expect(seat(page)).not.toContainText('Blackjack');
  for (const action of ['Hit', 'Double', 'Surrender']) await expect(button(page, action)).toHaveCount(0);
});
test('[REG-M7-051] [E2E-07] Surrender shows exact half returned and half lost', async ({ page }) => {
  await fixture(page, 'surrender'); await button(page, 'Surrender').click(); await expect(seat(page)).toContainText('Returned: 50 · Lost: 50');
  await expect(seat(page)).toContainText('Surrendered'); await expect(button(page, 'Hit')).toHaveCount(0);
});
test('[REG-M7-052] [E2E-08] Ace choices are before peek and eligible Even Money is distinct', async ({ page }) => {
  await fixture(page, 'natural'); const decision = page.getByRole('region', { name: 'Insurance decision' });
  await expect(decision).toContainText('Insurance amount: 50'); await expect(button(page, 'Buy Insurance')).toBeEnabled();
  await expect(button(page, 'Take Even Money')).toBeEnabled(); await expect(page.getByRole('img', { name: 'Hidden dealer card' })).toBeVisible();
  await button(page, 'Take Even Money').click(); await expect(decision).toHaveCount(0); await expect(page.getByRole('region', { name: 'Main hand results' })).toContainText('Even Money');
});
test('[REG-M7-053] [UX-10] [E2E-09] one seat busts while another remains active and hole card stays hidden', async ({ page }) => {
  await fixture(page, 'multi'); await button(page, 'Hit').click(); await expect(seat(page)).toContainText('Bust');
  await expect(page.getByRole('status')).toHaveText('Waiting for Seat 2'); await expect(page.getByRole('img', { name: 'Hidden dealer card' })).toBeVisible();
  await expect(seat(page, 2)).toContainText('Current hand'); await button(page, 'Continue table').click(); await expect(page.getByRole('status')).toHaveText('Round complete');
});
test('[REG-M7-054] [E2E-10] independent side result survives a main loss', async ({ page }) => {
  await fixture(page, 'sides'); await button(page, 'Stand').click(); await button(page, 'Continue table').click();
  await expect(page.getByRole('region', { name: 'Main hand results' })).toContainText('Loss');
  const sides = page.getByRole('region', { name: 'Side-bet results' }); await expect(sides).toContainText('Mixed Pair'); await expect(sides).toContainText('Three of a Kind');
});
test('[REG-M7-055] [E2E-11] spectator follower cannot control target hand', async ({ page }) => {
  await fixture(page, 'spectator'); await expect(page.getByRole('region', { name: 'Your Bet Behind exposure' })).toContainText('computer controller chooses');
  for (const action of ['Hit', 'Stand', 'Double', 'Split', 'Surrender']) await expect(button(page, action)).toHaveCount(0);
  await button(page, 'Continue table').click(); await expect(page.getByRole('region', { name: 'Bet Behind results' })).toContainText('BACK');
});
test('[REG-M7-056] [E2E-14] CLASSIC five-card hand is not Charlie and can continue', async ({ page }) => {
  await fixture(page, 'five'); for (let n = 0; n < 3; n++) await button(page, 'Hit').click();
  await expect(seat(page).getByRole('img')).toHaveCount(5); await expect(seat(page)).toContainText('Total: 10');
  await expect(page.locator('body')).not.toContainText('Charlie'); await expect(button(page, 'Hit')).toBeEnabled();
});
test('[REG-M7-057] [E2E-15] required-draw fault is interruption/VOID/refund with no normal winner', async ({ page }) => {
  await fixture(page, 'void'); await button(page, 'Hit').click(); await expect(page.getByRole('status')).toHaveText('Round interrupted');
  await expect(page.getByRole('alert')).toContainText('Affected simulated stakes were refunded');
  await expect(page.getByRole('region', { name: 'Main hand results' })).toContainText('VOID / Integrity Error');
  await expect(page.getByRole('region', { name: 'Main hand results' })).not.toContainText('Loss'); await expect(button(page, 'Next round')).toBeEnabled();
});
test('[REG-M7-058] controlled Double follow ADD has exact funded exposure and matching result', async ({ page }) => {
  await fixture(page, 'follow-double'); await expect(page.getByRole('region', { name: 'Bet Behind follow decision' })).toContainText('Matching additional amount: 100');
  await button(page, 'ADD').click(); await expect(page.getByRole('region', { name: 'Your Bet Behind exposure' })).toContainText('Back stake: 200');
  await button(page, 'Continue table').click(); await expect(page.getByRole('region', { name: 'Bet Behind results' })).toContainText('Stake: 200 · Returned: 400');
});
test('[REG-M7-059] controlled Split follow NO ADD tracks only ordered first child', async ({ page }) => {
  await fixture(page, 'follow-split'); await expect(page.getByRole('region', { name: 'Bet Behind follow decision' })).toContainText('first ordered child only');
  await button(page, 'NO ADD').click(); const exposure = page.getByRole('region', { name: 'Your Bet Behind exposure' });
  await expect(exposure).toContainText('Hand A'); await expect(exposure).not.toContainText('Hand B'); await expect(exposure).toContainText('NO ADD applied');
});
test('[REG-M7-060] unfunded follow ADD is disabled without vetoing NO ADD continuation', async ({ page }) => {
  await fixture(page, 'poor-follow'); await expect(button(page, 'ADD')).toBeDisabled(); await expect(button(page, 'NO ADD')).toBeEnabled();
  await button(page, 'NO ADD').click(); await expect(page.getByRole('region', { name: 'Your Bet Behind exposure' })).toContainText('Back stake: 600');
});
test('[REG-M7-061] Insurance is separate and unavailable after peek; unfunded choice remains disabled', async ({ page }) => {
  await fixture(page, 'poor-insurance'); await expect(button(page, 'Buy Insurance')).toBeDisabled(); await expect(button(page, 'Decline')).toBeEnabled();
  await fixture(page, 'insurance'); await button(page, 'Buy Insurance').click(); await expect(button(page, 'Buy Insurance')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Insurance results' })).toContainText('Loss');
});
test('[REG-M7-062] next round retains available funds and truthfully continues the same shoe', async ({ page }) => {
  await fixture(page, 'basic'); await button(page, 'Stand').click(); await button(page, 'Continue table').click();
  const available = await page.getByRole('region', { name: 'Your credits' }).locator('dd').first().innerText();
  await button(page, 'Next round').click(); await expect(page.getByRole('region', { name: 'Your credits' }).locator('dd').first()).toHaveText(available);
  await expect(page.locator('.shoe-status')).toHaveText('6-deck persistent shoe');
  await button(page, 'Open betting').click(); await button(page, 'Set Your MAIN at Seat 1').click(); await button(page, 'Close betting and deal').click();
  await expect(page.locator('.shoe-status')).toHaveText('Existing 6-deck shoe continues');
});
test('[REG-M7-063] spectator setup places a real Bet Behind without an own MAIN or side bets', async ({ page }) => {
  await fixture(page, 'setup'); await page.getByLabel('Your seat', { exact: true }).selectOption('0'); await page.getByLabel('Computer at Seat 2', { exact: true }).check();
  await button(page, 'Open betting').click(); await button(page, 'Set Computer MAIN at Seat 2').click();
  await page.getByLabel('Bet Behind target', { exact: true }).selectOption('2'); await button(page, 'Set Bet Behind Seat 2').click();
  await expect(page.getByRole('region', { name: 'Betting controls' })).toContainText('You follow Seat 2');
  await expect(page.getByLabel('Pair side bet', { exact: true })).toHaveCount(0); await button(page, 'Close betting and deal').click(); await expect(button(page, 'Hit')).toHaveCount(0);
});
test('[REG-M7-064] Re-split retains depth-first stable hand identities and completed leaves', async ({ page }) => {
  await fixture(page, 'resplit'); await button(page, 'Split').click(); await button(page, 'Split').click(); const hands = seat(page).locator('article');
  await expect(hands).toHaveCount(3); await expect(hands.nth(0)).toHaveAttribute('aria-label', 'Hand A.1'); await expect(hands.nth(1)).toHaveAttribute('aria-label', 'Hand A.2'); await expect(hands.nth(2)).toHaveAttribute('aria-label', 'Hand B');
  await button(page, 'Stand').click(); await expect(hands.nth(0)).toContainText('Decisions complete'); await expect(hands.nth(1)).toContainText('Current hand');
});
