# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: baccarat\table.spec.ts >> [M13-B06-320] responsive, keyboard, touch and 200% text
- Location: tests\browser\baccarat\table.spec.ts:84:39

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - main [ref=e3]:
    - generic [ref=e4]:
      - heading "Baccarat" [level=1] [ref=e6]
      - paragraph [ref=e7]: Simulation credits only.No real money or redemption value.
    - region "Baccarat table" [ref=e8]:
      - generic [ref=e9]:
        - 'img "Dealer: Celestine" [ref=e10]'
        - paragraph [ref=e11]: Celestine · Dealer
        - generic "Eight-deck shoe" [ref=e12]:
          - generic [aria-hidden] [ref=e13]: ▰
          - generic [ref=e14]: 410 cards remaining
      - status [ref=e15]:
        - strong [ref=e16]: PLAYER WINS
        - generic [ref=e17]: ROUND COMPLETE
      - generic [ref=e18]:
        - region "Player hand" [ref=e19]:
          - heading "Player" [level=2] [ref=e20]
          - paragraph [ref=e21]: "Total: 9"
          - group "Player cards" [ref=e22]:
            - img "5 of clubs" [ref=e25]:
              - generic [ref=e26]:
                - text: "5"
                - generic [aria-hidden] [ref=e27]: ♣
              - generic [aria-hidden] [ref=e28]: ♣
              - generic [aria-hidden] [ref=e29]: "5"
            - img "K of clubs" [ref=e32]:
              - generic [ref=e33]:
                - text: K
                - generic [aria-hidden] [ref=e34]: ♣
              - generic [aria-hidden] [ref=e35]: ♣
              - generic [aria-hidden] [ref=e36]: K
            - img "4 of clubs" [ref=e39]:
              - generic [ref=e40]:
                - text: "4"
                - generic [aria-hidden] [ref=e41]: ♣
              - generic [aria-hidden] [ref=e42]: ♣
              - generic [aria-hidden] [ref=e43]: "4"
          - paragraph [ref=e44]: Player draws a third card
        - region "Banker hand" [ref=e45]:
          - heading "Banker" [level=2] [ref=e46]
          - paragraph [ref=e47]: "Total: 7"
          - group "Banker cards" [ref=e48]:
            - img "5 of clubs" [ref=e51]:
              - generic [ref=e52]:
                - text: "5"
                - generic [aria-hidden] [ref=e53]: ♣
              - generic [aria-hidden] [ref=e54]: ♣
              - generic [aria-hidden] [ref=e55]: "5"
            - img "K of clubs" [ref=e58]:
              - generic [ref=e59]:
                - text: K
                - generic [aria-hidden] [ref=e60]: ♣
              - generic [aria-hidden] [ref=e61]: ♣
              - generic [aria-hidden] [ref=e62]: K
            - img "2 of clubs" [ref=e65]:
              - generic [ref=e66]:
                - text: "2"
                - generic [aria-hidden] [ref=e67]: ♣
              - generic [aria-hidden] [ref=e68]: ♣
              - generic [aria-hidden] [ref=e69]: "2"
          - paragraph [ref=e70]: Banker draws a third card
      - region "Wager targets" [ref=e71]:
        - generic [ref=e72]:
          - button "Player 1:1" [disabled] [ref=e73]:
            - text: Player
            - generic [ref=e74]: 1:1
          - generic [ref=e75]: No bet
        - generic [ref=e76]:
          - button "Tie 8:1" [disabled] [ref=e77]:
            - text: Tie
            - generic [ref=e78]: 8:1
          - generic [ref=e79]: No bet
        - generic [ref=e80]:
          - button "Banker 0.95:1" [disabled] [pressed] [ref=e81]:
            - text: Banker
            - generic [ref=e82]: 0.95:1
          - generic [ref=e83]: 25 credits
          - generic [ref=e84]: LOSS
      - region "Your Baccarat credits" [ref=e85]:
        - generic [ref=e86]:
          - 'img "Your character: Roland, Male Human Knight" [ref=e87]'
          - generic [ref=e88]:
            - strong [ref=e89]: You · Roland
            - generic [ref=e90]: Human
        - generic [ref=e91]:
          - generic [ref=e92]:
            - term [ref=e93]: Available
            - definition [ref=e94]: "975"
          - generic [ref=e95]:
            - term [ref=e96]: Reserved
            - definition [ref=e97]: "0"
          - generic [ref=e98]:
            - term [ref=e99]: Pending return
            - definition [ref=e100]: "0"
      - region "Baccarat controls" [ref=e101]:
        - generic "Round result" [ref=e102]:
          - strong [ref=e103]: PLAYER WINS
          - paragraph [ref=e104]: Returned 0 credits · Net -25 credits
        - generic [ref=e105]:
          - button "Deal Again" [ref=e106] [cursor=pointer]
          - button "Repeat Bet" [ref=e107] [cursor=pointer]
    - generic [ref=e108]:
      - group [ref=e109]:
        - generic "Change Character · Roland" [ref=e110] [cursor=pointer]
        - option "Caelan · Male Elf"
        - option "Elaria · Female Elf"
        - option "Roland · Male Human Knight" [selected]
        - option "Seraphine · Female Human Knight"
        - option "Alaric · Male Mage"
        - option "Nyra · Female Mage"
        - option "Lucien · Male Noble"
        - option "Celestine · Female Noble · Dealer (reserved)" [disabled]
        - option "Garruk · Male Half-Orc Warrior"
        - option "Vesha · Female Half-Orc Warrior"
        - option "Borin · Male Dwarf"
        - option "Brynja · Female Dwarf"
      - group [ref=e111]:
        - generic "Table rules" [ref=e112] [cursor=pointer]
  - navigation "Casino games" [ref=e113]:
    - link "Casino Lobby" [ref=e114] [cursor=pointer]:
      - /url: /casino
    - link "Blackjack" [ref=e115] [cursor=pointer]:
      - /url: /blackjack
    - link "Baccarat" [ref=e116] [cursor=pointer]:
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
  82 |   await expect(page.locator('[data-dealer-avatar="generic-formal"]')).toBeVisible();
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
> 96 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `text-200-${width}`);
     |                                                                                         ^ Error: expect(received).toBe(expected) // Object.is equality
  97 |   await page.getByRole('button', { name: 'Deal Again' }).click(); await expect(page.getByRole('button', { name: 'Place Bet · Banker' })).toBeVisible();
  98 | });
  99 |
```
