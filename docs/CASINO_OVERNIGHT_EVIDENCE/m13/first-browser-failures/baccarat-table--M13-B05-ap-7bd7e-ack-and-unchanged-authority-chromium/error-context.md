# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: baccarat\table.spec.ts >> [M13-B05] approved identities, reserved Dealer, fallback and unchanged authority
- Location: tests\browser\baccarat\table.spec.ts:72:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-dealer-avatar="generic-formal"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('[data-dealer-avatar="generic-formal"]') with timeout 5000ms
  - waiting for locator('[data-dealer-avatar="generic-formal"]')

```

```yaml
- main:
  - paragraph: Punto Banco · Eight decks
  - heading "Baccarat" [level=1]
  - paragraph: Simulation credits only. No real money or redemption value.
  - region "Baccarat table":
    - 'img "Dealer: Celestine"'
    - paragraph: Celestine · Dealer
    - text: 416 cards remaining
    - status:
      - strong: PLACE YOUR BET
    - region "Player hand":
      - heading "Player" [level=2]
      - paragraph: Waiting for Deal
      - group "Player cards"
      - paragraph: Cards arrive here
    - region "Banker hand":
      - heading "Banker" [level=2]
      - paragraph: Waiting for Deal
      - group "Banker cards"
      - paragraph: Cards arrive here
    - region "Wager targets":
      - button "Player 1:1" [pressed]
      - text: No bet
      - button "Tie 8:1"
      - text: No bet
      - button "Banker 0.95:1"
      - text: No bet
    - region "Your Baccarat credits":
      - 'img "Your character: Roland, Male Human Knight"'
      - strong: You · Roland
      - text: Human
      - term: Available
      - definition: 1,000
      - term: Reserved
      - definition: "0"
      - term: Pending return
      - definition: "0"
    - region "Baccarat controls":
      - paragraph: "Selected: Player · Choose an amount, then place your bet"
      - text: Wager amount
      - spinbutton "Wager amount": "25"
      - button "Place Bet · Player"
      - button "1"
      - button "5"
      - button "25" [pressed]
      - button "100"
      - button "Deal" [disabled]
      - button "Clear Bets" [disabled]
  - group: Change Character · Roland
  - group: Table rules
- navigation "Casino games":
  - link "Casino Lobby":
    - /url: /casino
  - link "Blackjack":
    - /url: /blackjack
  - link "Baccarat":
    - /url: /baccarat
```

# Test source

```ts
  1  | import { expect, test, type Page } from '@playwright/test';
  2  | import { mkdirSync } from 'node:fs';
  3  | const evidence = '.git/overnight/visual/m13';
  4  | async function capture(page: Page, name: string) { mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: `${evidence}/${name}.png`, fullPage: true }); }
  5  | async function open(page: Page, fixture = 'player-natural') { await page.goto(`/baccarat?baccaratFixture=${fixture}`); await expect(page.getByRole('button', { name: 'Place Bet · Player' })).toBeVisible(); }
  6  | async function wager(page: Page, target: string, amount = '25') { await page.getByRole('button', { name: new RegExp(`^${target} `) }).click(); await page.getByLabel('Wager amount', { exact: true }).fill(amount); await page.getByRole('button', { name: `Place Bet · ${target}` }).click(); }
  7  | async function authority(page: Page) { return page.evaluate(() => {
  8  |   const controller = (window as unknown as { baccaratTestController: { getDigest(): string; exportReplay(): unknown } }).baccaratTestController;
  9  |   return { digest: controller.getDigest(), replay: controller.exportReplay() };
  10 | }); }
  11 | test('[M13-B01] targets, atomic funding, clear, exact commission, next and repeat', async ({ page }) => {
  12 |   await open(page, 'banker-natural'); await capture(page, '01-pre-bet-desktop');
  13 |   await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeDisabled();
  14 |   const before = await authority(page);
  15 |   await page.getByRole('button', { name: /^Banker / }).click();
  16 |   expect(await authority(page)).toEqual(before);
  17 |   await wager(page, 'Player'); await capture(page, '02-player-wager');
  18 |   await wager(page, 'Banker'); await capture(page, '03-banker-wager');
  19 |   await wager(page, 'Tie'); await capture(page, '04-tie-wager');
  20 |   await expect(page.locator('[data-credits="available"]')).toHaveText('925');
  21 |   await expect(page.locator('[data-credits="reserved"]')).toHaveText('75');
  22 |   await page.getByRole('button', { name: 'Clear Bets' }).click();
  23 |   await expect(page.locator('[data-credits="available"]')).toHaveText('1,000');
  24 |   await wager(page, 'Banker'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  25 |   await expect(page.getByRole('status')).toContainText('BANKER WINS');
  26 |   await expect(page.locator('[data-credits="available"]')).toHaveText('1,023.75');
  27 |   await expect(page.locator('[data-credits="reserved"]')).toHaveText('0');
  28 |   await expect(page.locator('[data-credits="pending"]')).toHaveText('0');
  29 |   await expect(page.locator('[data-round-net]')).toHaveText('+23.75'); await capture(page, '05-banker-win');
  30 |   await page.getByRole('button', { name: 'Repeat Bet' }).click();
  31 |   await expect(page.locator('[data-credits="available"]')).toHaveText('998.75');
  32 |   await expect(page.locator('[data-wager-target="BANKER"] [data-wager-units]')).toHaveText('25 credits');
  33 |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  34 |   await page.getByRole('button', { name: 'Deal Again' }).click();
  35 |   await expect(page.locator('[data-credits="reserved"]')).toHaveText('0');
  36 |   await expect(page.getByRole('status')).toHaveText('PLACE YOUR BET'); await capture(page, '06-next-round');
  37 | });
  38 | const paths = [
  39 |   ['player-natural', 2, 2, 'PLAYER WINS', 'Natural', '07-player-natural'],
  40 |   ['two-card', 2, 2, 'BANKER WINS', 'Banker stands', '08-four-card'],
  41 |   ['player-third', 3, 2, 'PLAYER WINS', 'Player draws a third card', '09-player-third'],
  42 |   ['banker-third', 2, 3, 'TIE', 'Banker draws a third card', '10-banker-third'],
  43 |   ['both-third', 3, 3, 'PLAYER WINS', 'Banker draws a third card', '11-six-card'],
  44 |   ['banker-win', 3, 3, 'BANKER WINS', 'Banker draws a third card', '12-banker-six-card'],
  45 |   ['tie', 2, 2, 'TIE', 'Natural', '13-tie'],
  46 | ] as const;
  47 | for (const [fixture, player, banker, outcome, decision, image] of paths) test(`[M13-B02-${fixture}] authority cards, totals and result`, async ({ page }) => {
  48 |   await open(page, fixture); await wager(page, 'Player'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  49 |   await expect(page.getByRole('group', { name: 'Player cards', exact: true }).getByRole('img')).toHaveCount(player);
  50 |   await expect(page.getByRole('group', { name: 'Banker cards', exact: true }).getByRole('img')).toHaveCount(banker);
  51 |   await expect(page.getByRole('status')).toContainText(outcome);
  52 |   await expect(page.locator('.baccarat-table')).toContainText(decision); await capture(page, image);
  53 |   const final = await authority(page); await page.getByRole('status').click(); expect(await authority(page)).toEqual(final);
  54 | });
  55 | test('[M13-B03] tie returns both main stakes and pays Tie 8:1', async ({ page }) => {
  56 |   await open(page, 'tie'); for (const target of ['Player', 'Banker', 'Tie']) await wager(page, target);
  57 |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  58 |   await expect(page.locator('[data-credits="available"]')).toHaveText('1,200');
  59 |   await expect(page.locator('[data-round-net]')).toHaveText('+200');
  60 |   for (const target of ['PLAYER', 'BANKER']) await expect(page.locator(`[data-wager-target="${target}"]`)).toContainText('PUSH');
  61 |   await expect(page.locator('[data-wager-target="TIE"]')).toContainText('WIN'); await capture(page, '14-settlement');
  62 | });
  63 | test('[M13-B04] rejection preserves authority, insufficient repeat has no refill', async ({ page }) => {
  64 |   await open(page, 'banker-natural'); await wager(page, 'Player', '1000'); const before = await authority(page);
  65 |   await wager(page, 'Tie', '1'); await expect(page.getByRole('alert')).toBeVisible(); expect(await authority(page)).toEqual(before);
  66 |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  67 |   await expect(page.locator('[data-credits="available"]')).toHaveText('0'); await expect(page.getByRole('button', { name: 'Repeat Bet' })).toBeDisabled();
  68 |   await expect(page.getByText('Not enough credits to repeat the previous bets.')).toBeVisible(); await capture(page, '15-insufficient');
  69 |   await page.getByRole('button', { name: 'Deal Again' }).click(); await wager(page, 'Player', '1'); await expect(page.getByRole('alert')).toBeVisible();
  70 |   await expect(page.locator('[data-credits="available"]')).toHaveText('0');
  71 | });
  72 | test('[M13-B05] approved identities, reserved Dealer, fallback and unchanged authority', async ({ page }) => {
  73 |   await open(page); const before = await authority(page);
  74 |   await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  75 |   await expect(page.getByRole('img', { name: /^Your character: Roland/ })).toBeVisible(); await capture(page, '16-dealer-avatar-hud');
  76 |   await page.getByText('Change Character · Roland', { exact: true }).click();
  77 |   await expect(page.locator('#baccarat-character option[value="noble_female"]')).toBeDisabled();
  78 |   await page.getByLabel('Your character', { exact: true }).selectOption('mage_male');
  79 |   expect(await authority(page)).toEqual(before); await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  80 |   expect(await page.locator('img').evaluateAll(images => images.every(image => !(image as HTMLImageElement).src.includes('dealer_cartoon')))).toBe(true);
  81 |   await page.route('**/*noble_female*', route => route.abort()); await page.reload();
> 82 |   await expect(page.locator('[data-dealer-avatar="generic-formal"]')).toBeVisible();
     |                                                                       ^ Error: expect(locator).toBeVisible() failed
  83 | });
  84 | for (const width of [1280, 768, 320]) test(`[M13-B06-${width}] responsive, keyboard, touch and 200% text`, async ({ page }) => {
  85 |   await page.setViewportSize({ width, height: 900 }); await open(page, 'both-third');
  86 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `pre-bet-${width}`);
  87 |   for (const button of await page.locator('.baccarat-page button').all()) expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  88 |   const target = page.getByRole('button', { name: /^Banker / }); await target.focus(); await expect(target).toBeFocused();
  89 |   expect(await target.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
  90 |   await page.keyboard.press('Enter'); await expect(target).toHaveAttribute('aria-pressed', 'true');
  91 |   await page.getByRole('button', { name: 'Place Bet · Banker' }).focus(); await page.keyboard.press('Enter');
  92 |   await page.getByRole('button', { name: 'Deal', exact: true }).focus(); await page.keyboard.press('Enter');
  93 |   await expect(page.getByRole('status')).toContainText('ROUND COMPLETE');
  94 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `complete-${width}`);
  95 |   await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  96 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `text-200-${width}`);
  97 |   await page.getByRole('button', { name: 'Deal Again' }).click(); await expect(page.getByRole('button', { name: 'Place Bet · Banker' })).toBeVisible();
  98 | });
  99 |
```
