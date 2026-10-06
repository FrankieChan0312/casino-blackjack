# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: baccarat\table.spec.ts >> [M13-B06-1280] responsive, keyboard, touch and 200% text
- Location: tests\browser\baccarat\table.spec.ts:87:39

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= -41.09375
Received:    -21.203125
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - main [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - paragraph [ref=e6]: Punto Banco · Eight decks
        - heading "Baccarat" [level=1] [ref=e7]
      - paragraph [ref=e8]: Simulation credits only.No real money or redemption value.
    - region "Baccarat table" [ref=e9]:
      - generic [ref=e10]:
        - 'img "Dealer: Celestine" [ref=e11]'
        - paragraph [ref=e12]: Celestine · Dealer
        - generic "Eight-deck shoe" [ref=e13]:
          - generic [aria-hidden] [ref=e14]: ▰
          - generic [ref=e15]: 410 cards remaining
      - status [ref=e16]:
        - strong [ref=e17]: PLAYER WINS
        - generic [ref=e18]: ROUND COMPLETE
      - generic [ref=e19]:
        - region "Player hand" [ref=e20]:
          - heading "Player" [level=2] [ref=e21]
          - paragraph [ref=e22]: "Total: 9"
          - group "Player cards" [ref=e23]:
            - img "5 of clubs" [ref=e26]:
              - generic [ref=e27]:
                - text: "5"
                - generic [aria-hidden] [ref=e28]: ♣
              - generic [aria-hidden] [ref=e29]: ♣
              - generic [aria-hidden] [ref=e30]: "5"
            - img "K of clubs" [ref=e33]:
              - generic [ref=e34]:
                - text: K
                - generic [aria-hidden] [ref=e35]: ♣
              - generic [aria-hidden] [ref=e36]: ♣
              - generic [aria-hidden] [ref=e37]: K
            - img "4 of clubs" [ref=e40]:
              - generic [ref=e41]:
                - text: "4"
                - generic [aria-hidden] [ref=e42]: ♣
              - generic [aria-hidden] [ref=e43]: ♣
              - generic [aria-hidden] [ref=e44]: "4"
          - paragraph [ref=e45]: Player draws a third card
        - region "Banker hand" [ref=e46]:
          - heading "Banker" [level=2] [ref=e47]
          - paragraph [ref=e48]: "Total: 7"
          - group "Banker cards" [ref=e49]:
            - img "5 of clubs" [ref=e52]:
              - generic [ref=e53]:
                - text: "5"
                - generic [aria-hidden] [ref=e54]: ♣
              - generic [aria-hidden] [ref=e55]: ♣
              - generic [aria-hidden] [ref=e56]: "5"
            - img "K of clubs" [ref=e59]:
              - generic [ref=e60]:
                - text: K
                - generic [aria-hidden] [ref=e61]: ♣
              - generic [aria-hidden] [ref=e62]: ♣
              - generic [aria-hidden] [ref=e63]: K
            - img "2 of clubs" [ref=e66]:
              - generic [ref=e67]:
                - text: "2"
                - generic [aria-hidden] [ref=e68]: ♣
              - generic [aria-hidden] [ref=e69]: ♣
              - generic [aria-hidden] [ref=e70]: "2"
          - paragraph [ref=e71]: Banker draws a third card
      - region "Wager targets" [ref=e72]:
        - generic [ref=e73]:
          - button "Player 1:1" [disabled] [ref=e74]:
            - text: Player
            - generic [ref=e75]: 1:1
          - generic [ref=e76]: No bet
        - generic [ref=e77]:
          - button "Tie 8:1" [disabled] [ref=e78]:
            - text: Tie
            - generic [ref=e79]: 8:1
          - generic [ref=e80]: No bet
        - generic [ref=e81]:
          - button "Banker 0.95:1" [disabled] [pressed] [ref=e82]:
            - text: Banker
            - generic [ref=e83]: 0.95:1
          - generic [ref=e84]: 25 credits
          - generic [ref=e85]: LOSS
      - region "Your Baccarat credits" [ref=e86]:
        - generic [ref=e87]:
          - 'img "Your character: Roland, Male Human Knight" [ref=e88]'
          - generic [ref=e89]:
            - strong [ref=e90]: You · Roland
            - generic [ref=e91]: Human
        - generic [ref=e92]:
          - generic [ref=e93]:
            - term [ref=e94]: Available
            - definition [ref=e95]: "975"
          - generic [ref=e96]:
            - term [ref=e97]: Reserved
            - definition [ref=e98]: "0"
          - generic [ref=e99]:
            - term [ref=e100]: Pending return
            - definition [ref=e101]: "0"
      - region "Baccarat controls" [ref=e102]:
        - generic "Round result" [ref=e103]:
          - strong [ref=e104]: PLAYER WINS
          - paragraph [ref=e105]: Returned 0 credits · Net -25 credits
        - generic [ref=e106]:
          - button "Deal Again" [ref=e107] [cursor=pointer]
          - button "Repeat Bet" [ref=e108] [cursor=pointer]
    - generic [ref=e109]:
      - group [ref=e110]:
        - generic "Change Character · Roland" [ref=e111] [cursor=pointer]
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
      - group [ref=e112]:
        - generic "Table rules" [ref=e113] [cursor=pointer]
  - navigation "Casino games" [ref=e114]:
    - link "Casino Lobby" [ref=e115] [cursor=pointer]:
      - /url: /casino
    - link "Blackjack" [ref=e116] [cursor=pointer]:
      - /url: /blackjack
    - link "Baccarat" [ref=e117] [cursor=pointer]:
      - /url: /baccarat
```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test';
  2   | import { mkdirSync } from 'node:fs';
  3   | const evidence = '.git/overnight/visual/m13';
  4   | async function capture(page: Page, name: string) { mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: `${evidence}/${name}.png`, fullPage: true }); }
  5   | async function open(page: Page, fixture = 'player-natural') { await page.goto(`/baccarat?baccaratFixture=${fixture}`); await expect(page.getByRole('button', { name: 'Place Bet · Player' })).toBeVisible(); }
  6   | async function wager(page: Page, target: string, amount = '25') { await page.getByRole('button', { name: new RegExp(`^${target} `) }).click(); await page.getByLabel('Wager amount', { exact: true }).fill(amount); await page.getByRole('button', { name: `Place Bet · ${target}` }).click(); }
  7   | async function authority(page: Page) { return page.evaluate(() => {
  8   |   const controller = (window as unknown as { baccaratTestController: { getDigest(): string; exportReplay(): unknown } }).baccaratTestController;
  9   |   return { digest: controller.getDigest(), replay: controller.exportReplay() };
  10  | }); }
  11  | test('[M13-B01] targets, atomic funding, clear, exact commission, next and repeat', async ({ page }) => {
  12  |   await page.goto('/casino'); await capture(page, '00-casino-lobby'); await page.getByRole('link', { name: 'Play Baccarat' }).click();
  13  |   await expect(page.getByRole('button', { name: 'Place Bet · Player' })).toBeVisible();
  14  |   await open(page, 'banker-natural'); await capture(page, '01-pre-bet-desktop');
  15  |   await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeDisabled();
  16  |   const before = await authority(page);
  17  |   await page.getByRole('button', { name: /^Banker / }).click();
  18  |   expect(await authority(page)).toEqual(before);
  19  |   await wager(page, 'Player'); await capture(page, '02-player-wager');
  20  |   await wager(page, 'Banker'); await capture(page, '03-banker-wager');
  21  |   await wager(page, 'Tie'); await capture(page, '04-tie-wager');
  22  |   await expect(page.locator('[data-credits="available"]')).toHaveText('925');
  23  |   await expect(page.locator('[data-credits="reserved"]')).toHaveText('75');
  24  |   await page.getByRole('button', { name: 'Clear Bets' }).click();
  25  |   await expect(page.locator('[data-credits="available"]')).toHaveText('1,000');
  26  |   await wager(page, 'Banker'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  27  |   await expect(page.getByRole('status')).toContainText('BANKER WINS');
  28  |   await expect(page.locator('[data-credits="available"]')).toHaveText('1,023.75');
  29  |   await expect(page.locator('[data-credits="reserved"]')).toHaveText('0');
  30  |   await expect(page.locator('[data-credits="pending"]')).toHaveText('0');
  31  |   await expect(page.locator('[data-round-net]')).toHaveText('+23.75'); await capture(page, '05-banker-win');
  32  |   await page.getByRole('button', { name: 'Repeat Bet' }).click();
  33  |   await expect(page.locator('[data-credits="available"]')).toHaveText('998.75');
  34  |   await expect(page.locator('[data-wager-target="BANKER"] [data-wager-units]')).toHaveText('25 credits');
  35  |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  36  |   await page.getByRole('button', { name: 'Deal Again' }).click();
  37  |   await expect(page.locator('[data-credits="reserved"]')).toHaveText('0');
  38  |   await expect(page.getByRole('status')).toHaveText('PLACE YOUR BET'); await capture(page, '06-next-round');
  39  | });
  40  | const paths = [
  41  |   ['player-natural', 2, 2, 'PLAYER WINS', 'Natural', '07-player-natural'],
  42  |   ['two-card', 2, 2, 'BANKER WINS', 'Banker stands', '08-four-card'],
  43  |   ['player-third', 3, 2, 'PLAYER WINS', 'Player draws a third card', '09-player-third'],
  44  |   ['banker-third', 2, 3, 'TIE', 'Banker draws a third card', '10-banker-third'],
  45  |   ['both-third', 3, 3, 'PLAYER WINS', 'Banker draws a third card', '11-six-card'],
  46  |   ['banker-win', 3, 3, 'BANKER WINS', 'Banker draws a third card', '12-banker-six-card'],
  47  |   ['tie', 2, 2, 'TIE', 'Natural', '13-tie'],
  48  | ] as const;
  49  | for (const [fixture, player, banker, outcome, decision, image] of paths) test(`[M13-B02-${fixture}] authority cards, totals and result`, async ({ page }) => {
  50  |   await open(page, fixture); await wager(page, 'Player'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  51  |   await expect(page.getByRole('group', { name: 'Player cards', exact: true }).getByRole('img')).toHaveCount(player);
  52  |   await expect(page.getByRole('group', { name: 'Banker cards', exact: true }).getByRole('img')).toHaveCount(banker);
  53  |   await expect(page.getByRole('status')).toContainText(outcome);
  54  |   await expect(page.locator('.baccarat-table')).toContainText(decision); await capture(page, image);
  55  |   const final = await authority(page); await page.getByRole('status').click(); expect(await authority(page)).toEqual(final);
  56  | });
  57  | test('[M13-B03] tie returns both main stakes and pays Tie 8:1', async ({ page }) => {
  58  |   await open(page, 'tie'); for (const target of ['Player', 'Banker', 'Tie']) await wager(page, target);
  59  |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  60  |   await expect(page.locator('[data-credits="available"]')).toHaveText('1,200');
  61  |   await expect(page.locator('[data-round-net]')).toHaveText('+200');
  62  |   for (const target of ['PLAYER', 'BANKER']) await expect(page.locator(`[data-wager-target="${target}"]`)).toContainText('PUSH');
  63  |   await expect(page.locator('[data-wager-target="TIE"]')).toContainText('WIN'); await capture(page, '14-settlement');
  64  | });
  65  | test('[M13-B04] rejection preserves authority, insufficient repeat has no refill', async ({ page }) => {
  66  |   await open(page, 'banker-natural'); await wager(page, 'Player', '1000'); const before = await authority(page);
  67  |   await wager(page, 'Tie', '1'); await expect(page.getByRole('alert')).toBeVisible(); expect(await authority(page)).toEqual(before);
  68  |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  69  |   await expect(page.locator('[data-credits="available"]')).toHaveText('0'); await expect(page.getByRole('button', { name: 'Repeat Bet' })).toBeDisabled();
  70  |   await expect(page.getByText('Not enough credits to repeat the previous bets.')).toBeVisible(); await capture(page, '15-insufficient');
  71  |   await page.getByRole('button', { name: 'Deal Again' }).click(); await wager(page, 'Player', '1'); await expect(page.getByRole('alert')).toBeVisible();
  72  |   await expect(page.locator('[data-credits="available"]')).toHaveText('0');
  73  | });
  74  | test('[M13-B05] approved identities, reserved Dealer, fallback and unchanged authority', async ({ page }) => {
  75  |   await open(page); const before = await authority(page);
  76  |   await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  77  |   await expect(page.getByRole('img', { name: /^Your character: Roland/ })).toBeVisible(); await capture(page, '16-dealer-avatar-hud');
  78  |   await page.getByText('Change Character · Roland', { exact: true }).click();
  79  |   await expect(page.locator('#baccarat-character option[value="noble_female"]')).toBeDisabled();
  80  |   await page.getByLabel('Your character', { exact: true }).selectOption('mage_male');
  81  |   expect(await authority(page)).toEqual(before); await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  82  |   await expect(page.getByRole('img', { name: /^Your character: Alaric/ })).toBeVisible(); await capture(page, '17-alternate-avatar');
  83  |   expect(await page.locator('img').evaluateAll(images => images.every(image => !(image as HTMLImageElement).src.includes('dealer_cartoon')))).toBe(true);
  84  |   await page.route('**/characters/dealer/noble_female/formal.png', route => route.abort()); await page.reload();
  85  |   await expect(page.locator('[data-dealer-avatar="generic-formal"]')).toBeVisible();
  86  | });
  87  | for (const width of [1280, 768, 320]) test(`[M13-B06-${width}] responsive, keyboard, touch and 200% text`, async ({ page }) => {
  88  |   await page.setViewportSize({ width, height: 900 }); await open(page, 'both-third');
  89  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `pre-bet-${width}`);
  90  |   for (const button of await page.locator('.baccarat-page button').all()) expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  91  |   const target = page.getByRole('button', { name: /^Banker / }); await target.focus(); await expect(target).toBeFocused();
  92  |   expect(await target.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
  93  |   await page.keyboard.press('Enter'); await expect(target).toHaveAttribute('aria-pressed', 'true');
  94  |   await page.getByRole('button', { name: 'Place Bet · Banker' }).focus(); await page.keyboard.press('Enter');
  95  |   await page.getByRole('button', { name: 'Deal', exact: true }).focus(); await page.keyboard.press('Enter');
  96  |   await expect(page.getByRole('status')).toContainText('ROUND COMPLETE');
  97  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `complete-${width}`);
  98  |   await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  99  |   const shoe = (await page.locator('.baccarat-shoe').boundingBox())!, status = (await page.getByRole('status').boundingBox())!;
> 100 |   expect(shoe.y + shoe.height).toBeLessThanOrEqual(status.y);
      |                                ^ Error: expect(received).toBeLessThanOrEqual(expected)
  101 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await capture(page, `text-200-${width}`);
  102 |   await page.getByRole('button', { name: 'Deal Again' }).click(); await expect(page.getByRole('button', { name: 'Place Bet · Banker' })).toBeVisible();
  103 | });
  104 |
```
