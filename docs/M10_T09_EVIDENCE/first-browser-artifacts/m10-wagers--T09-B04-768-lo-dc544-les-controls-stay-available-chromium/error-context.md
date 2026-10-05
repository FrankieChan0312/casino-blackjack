# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\wagers.spec.ts >> [T09-B04-768] loss collection fits, resize settles, controls stay available
- Location: tests\browser\m10\wagers.spec.ts:89:71

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator: getByRole('button', { name: 'Next round', exact: true })
Expected: enabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeEnabled" getByRole('button', { name: 'Next round', exact: true }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Next round', exact: true })

```

```yaml
- main:
  - link "Skip to your hand and actions":
    - /url: "#player-decisions"
  - region "Blackjack game scene":
    - paragraph: An evening at the table
    - heading "Casino Blackjack" [level=1]
    - paragraph: Simulation credits only — no real-money gambling. Credits have no redemption value.
    - region "Blackjack table":
      - region "Dealer":
        - 'img "Dealer: Celestine"'
        - heading "Dealer" [level=2]
        - group "Dealer hand":
          - img "10 of clubs": "10"
          - img "9 of diamonds": "9"
          - paragraph: "Total: 19"
          - paragraph: Dealer complete
        - group "Shoe and deal origin":
          - paragraph: Shoe · Deal origin 6 decks
        - paragraph: BLACKJACK PAYS 3:2 DEALER STANDS ON ALL 17
      - region "Seat 1":
        - 'img "Computer guest: Caelan, Male Elf"'
        - heading "Caelan" [level=2]
        - paragraph: Male Elf
        - paragraph: Seat 1 · Computer
        - group:
          - article "Hand A":
            - img "10 of clubs": "10"
            - img "7 of diamonds": "7"
            - paragraph: "17"
            - paragraph: Loss
            - paragraph: "MAIN: 25 credits"
      - region "Seat 3":
        - 'img "Computer guest: Elaria, Female Elf"'
        - heading "Elaria" [level=2]
        - paragraph: Female Elf
        - paragraph: Seat 3 · Computer
        - group:
          - article "Hand A":
            - img "10 of diamonds": "10"
            - img "7 of hearts": "7"
            - paragraph: "17"
            - paragraph: Loss
            - paragraph: "MAIN: 25 credits"
      - region "Seat 4":
        - group "Your player HUD":
          - 'img "Your avatar: Roland, Male Human Knight"'
          - paragraph: YOU
          - heading "Roland" [level=2]
          - paragraph: Male Human Knight
          - paragraph: Seat 4 · You · Human
          - paragraph: "MAIN: 100 credits"
          - article "Hand A":
            - heading "Hand A" [level=3]
            - img "5 of hearts": "5"
            - img "6 of spades": "6"
            - paragraph:
              - text: "Total:"
              - strong: "11"
            - paragraph: "Wager: 100 credits"
            - paragraph: Loss
      - region "Seat 6":
        - 'img "Computer guest: Seraphine, Female Human Knight"'
        - heading "Seraphine" [level=2]
        - paragraph: Female Human Knight
        - paragraph: Seat 6 · Computer
        - group:
          - article "Hand A":
            - img "10 of spades": "10"
            - img "7 of clubs": "7"
            - paragraph: "17"
            - paragraph: Loss
            - paragraph: "MAIN: 25 credits"
    - region "Your gameplay controls":
      - status: Round complete
      - region "Your round result":
        - paragraph: "Net result: -100 credits"
        - button "Deal Again"
        - button "Repeat Bet · 100 credits"
        - group: Wager result details
      - region "Your credits":
        - heading "Credits" [level=2]
        - term: Available
        - definition: "900"
        - term: Reserved / current exposure
        - definition: "0"
        - term: Pending return
        - definition: "0"
    - paragraph: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools":
    - paragraph: 4 players · 1 human · 3 computer guests
    - button "New table · reset to 1000 credits"
    - group: Change Character · Roland
    - group: Developer / demo tools
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import { mkdirSync, writeFileSync } from 'node:fs';
  3   | import { Buffer } from 'node:buffer';
  4   |
  5   | test.use({ reducedMotion: 'no-preference' });
  6   | async function prepare(page: Page, fixture: string) {
  7   |   await page.goto(`/?fixture=${fixture}`);
  8   |   await page.getByLabel('Your main wager', { exact: false }).fill('100');
  9   | }
  10  | async function deal(page: Page, fixture: string) {
  11  |   await prepare(page, fixture); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  12  |   await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  13  | }
  14  | async function pause(page: Page, stage: string, kind = 'MAIN') {
  15  |   await page.evaluate(({ stage, kind }) => {
  16  |     const observer = new MutationObserver(records => {
  17  |       for (const record of records) for (const node of record.addedNodes) {
  18  |         if (node instanceof HTMLElement && node.dataset.wagerStage === stage && node.dataset.wagerKind === kind && node.dataset.wagerSeat === '4') {
  19  |           node.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 80; });
  20  |           observer.disconnect(); return;
  21  |         }
  22  |       }
  23  |     }); observer.observe(document.body, { childList: true });
  24  |   }, { stage, kind });
  25  | }
  26  | async function resume(page: Page) {
  27  |   await page.evaluate(() => document.querySelectorAll('[data-wager-flight]').forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.play())));
  28  | }
  29  | async function capture(page: Page, path: string) {
  30  |   await page.locator('.dealer-zone').scrollIntoViewIfNeeded();
  31  |   const cdp = await page.context().newCDPSession(page);
  32  |   const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  33  |   await cdp.detach(); writeFileSync(path, Buffer.from(screenshot.data, 'base64'));
  34  | }
  35  | const own = '[data-wager-flight][data-wager-seat="4"]';
  36  | for (const [fixture, outcome, amount, destination] of [
  37  |   ['player-dealer-bust', 'PLAYER_WIN', '400', 'local-credits'],
  38  |   ['player-loss', 'DEALER_WIN', '200', 'dealer-hand'],
  39  |   ['player-push', 'PUSH', '200', 'local-credits'],
  40  | ] as const) test(`[T09-B01-${outcome}] real reserve/return token and immediate authoritative result`, async ({ page }) => {
  41  |   await deal(page, fixture);
  42  |   const root = `docs/M10_T09_EVIDENCE/browser/${Date.now()}-${outcome}`; mkdirSync(root, { recursive: true });
  43  |   await capture(page, `${root}/pre.png`); await pause(page, 'SETTLE_RESULT');
  44  |   await page.getByRole('button', { name: 'Stand', exact: true }).click();
  45  |   await expect(page.locator(own)).toHaveAttribute('data-wager-outcome', outcome);
  46  |   await expect(page.locator(own)).toHaveAttribute('data-wager-amount', amount);
  47  |   await expect(page.locator(own)).toHaveAttribute('data-wager-destination', destination);
  48  |   await expect(page.locator(own)).toHaveAttribute('aria-hidden', 'true');
  49  |   await expect(page.locator(own)).toHaveCSS('pointer-events', 'none');
  50  |   await expect(page.getByRole('button', { name: 'Next round', exact: true })).toBeEnabled();
  51  |   await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').nth(1)).toHaveText('0');
  52  |   expect(await page.locator(own).locator('button,input,a,[tabindex]').count()).toBe(0);
  53  |   await capture(page, `${root}/mid.png`); await resume(page);
  54  |   await expect(page.locator('.game-scene')).toHaveAttribute('data-wagers-running', 'false');
  55  |   await expect(page.locator('[data-wager-flight]')).toHaveCount(0); await capture(page, `${root}/settled.png`);
  56  |   writeFileSync(`${root}/receipt.json`, JSON.stringify({ fixture, outcome, amount, destination, files: ['pre.png', 'mid.png', 'settled.png'] }, null, 2));
  57  | });
  58  | test('[T09-B02] Blackjack exact gross 250 credits and next-round interruption', async ({ page }) => {
  59  |   await prepare(page, 'player-natural'); await pause(page, 'SETTLE_RESULT');
  60  |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  61  |   await expect(page.locator(own)).toHaveAttribute('data-wager-outcome', 'PLAYER_BLACKJACK');
  62  |   await expect(page.locator(own)).toHaveAttribute('data-wager-amount', '500');
  63  |   await expect(page.locator(own)).toContainText('250 credits');
  64  |   await page.getByRole('button', { name: 'Next round', exact: true }).click();
  65  |   await expect(page.locator('[data-wager-flight],[data-action-card-flight],[data-dealer-reveal]')).toHaveCount(0);
  66  |   await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
  67  | });
  68  | test('[T09-B03] Double total, Split child stakes and Insurance exact amount/anchor', async ({ page }) => {
  69  |   await deal(page, 'player-loss'); await pause(page, 'MOVE_WAGER', 'DOUBLE');
  70  |   await page.getByRole('button', { name: 'Double', exact: true }).click();
  71  |   await expect(page.locator(own)).toHaveAttribute('data-wager-amount', '400');
  72  |   await expect(page.locator(own)).toHaveAttribute('data-wager-destination', 'hand-wager:round-1/seat-4');
  73  |   await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  74  |   await expect(page.locator('[data-wager-flight],[data-action-card-flight]')).toHaveCount(0);
  75  |   await deal(page, 'player-split'); await pause(page, 'MOVE_WAGER', 'SPLIT');
  76  |   await page.getByRole('button', { name: 'Split', exact: true }).click();
  77  |   await expect(page.locator(own)).toHaveAttribute('data-wager-amount', '200');
  78  |   await expect(page.locator(own)).toHaveAttribute('data-wager-destination', 'hand-wager:round-1/seat-4.1');
  79  |   await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  80  |   await expect(page.locator('.hud-hand')).toHaveCount(2);
  81  |   await deal(page, 'player-ace'); await pause(page, 'MOVE_WAGER', 'INSURANCE');
  82  |   await page.getByRole('button', { name: 'Buy Insurance', exact: true }).click();
  83  |   await expect(page.locator(own)).toHaveAttribute('data-wager-amount', '100');
  84  |   await expect(page.locator(own)).toHaveAttribute('data-wager-destination', 'insurance-wager');
  85  |   await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  86  |   await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
  87  |   await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label', 'Hidden dealer card');
  88  | });
  89  | for (const [width, height] of [[1280, 900], [768, 1024], [320, 720]]) test(`[T09-B04-${width}] loss collection fits, resize settles, controls stay available`, async ({ page }) => {
  90  |   await page.setViewportSize({ width, height }); await deal(page, 'player-loss'); await pause(page, 'SETTLE_RESULT');
  91  |   await page.getByRole('button', { name: 'Stand', exact: true }).click();
  92  |   await expect(page.locator(own)).toHaveAttribute('data-wager-destination', 'dealer-hand');
  93  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  94  |   await page.setViewportSize({ width: width + 1, height });
  95  |   await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
> 96  |   await expect(page.getByRole('button', { name: 'Next round', exact: true })).toBeEnabled();
      |                                                                               ^ Error: expect(locator).toBeEnabled() failed
  97  | });
  98  | test('[T09-B05] reduced win/loss/push and Even Money display exact result without floating stacks', async ({ page }) => {
  99  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  100 |   for (const [fixture, available] of [['player-dealer-bust', '1100'], ['player-loss', '900'], ['player-push', '1000']] as const) {
  101 |     await deal(page, fixture); await page.getByRole('button', { name: 'Stand', exact: true }).click();
  102 |     await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()).toHaveText(available);
  103 |     await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
  104 |   }
  105 |   await deal(page, 'player-even-money'); await page.getByRole('button', { name: 'Take Even Money', exact: true }).click();
  106 |   await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()).toHaveText('1100');
  107 |   await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
  108 | });
  109 |
```
