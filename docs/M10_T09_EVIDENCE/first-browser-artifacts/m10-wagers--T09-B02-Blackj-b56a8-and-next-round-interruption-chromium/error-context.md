# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\wagers.spec.ts >> [T09-B02] Blackjack exact gross 250 credits and next-round interruption
- Location: tests\browser\m10\wagers.spec.ts:58:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Next round', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e3]:
    - link "Skip to your hand and actions" [ref=e4] [cursor=pointer]:
      - /url: "#player-decisions"
    - region "Blackjack game scene" [ref=e5]:
      - generic [ref=e6]:
        - heading "Casino Blackjack" [level=1] [ref=e8]
        - paragraph [ref=e9]: Simulation credits only — no real-money gambling.Credits have no redemption value.
      - generic [ref=e10]:
        - region "Blackjack table" [ref=e11]:
          - region "Dealer" [ref=e12]:
            - 'img "Dealer: Celestine" [ref=e13]'
            - heading "Dealer" [level=2] [ref=e14]
            - group "Dealer hand" [ref=e15]:
              - generic [ref=e17]:
                - img "10 of clubs" [ref=e18]:
                  - generic [ref=e19]:
                    - text: "10"
                    - generic [aria-hidden] [ref=e20]: ♣
                  - generic [aria-hidden] [ref=e21]: ♣
                  - generic [aria-hidden] [ref=e22]: "10"
                - img "9 of diamonds" [ref=e23]:
                  - generic [ref=e24]:
                    - text: "9"
                    - generic [aria-hidden] [ref=e25]: ♦
                  - generic [aria-hidden] [ref=e26]: ♦
                  - generic [aria-hidden] [ref=e27]: "9"
              - paragraph [ref=e28]: "Total: 19"
              - paragraph [ref=e29]: Dealer complete
            - group "Shoe and deal origin" [ref=e30]:
              - paragraph [ref=e32]:
                - text: Shoe · Deal origin
                - generic [ref=e33]: 6 decks
            - paragraph [ref=e34]:
              - text: BLACKJACK PAYS 3:2
              - generic [ref=e35]: DEALER STANDS ON ALL 17
          - generic [ref=e36]:
            - region "Seat 1" [ref=e37]:
              - generic [ref=e38]:
                - generic [ref=e39]:
                  - 'img "Computer guest: Caelan, Male Elf" [ref=e40]'
                  - generic [ref=e41]:
                    - heading "Caelan" [level=2] [ref=e42]
                    - paragraph [ref=e43]: Male Elf
                    - paragraph [ref=e44]: Seat 1 · Computer
                - group [ref=e45]:
                  - article "Hand A" [ref=e46]:
                    - generic [ref=e47]:
                      - img "10 of clubs" [ref=e48]:
                        - generic [ref=e49]:
                          - text: "10"
                          - generic [aria-hidden] [ref=e50]: ♣
                        - generic [aria-hidden] [ref=e51]: ♣
                        - generic [aria-hidden] [ref=e52]: "10"
                      - img "7 of diamonds" [ref=e53]:
                        - generic [ref=e54]:
                          - text: "7"
                          - generic [aria-hidden] [ref=e55]: ♦
                        - generic [aria-hidden] [ref=e56]: ♦
                        - generic [aria-hidden] [ref=e57]: "7"
                    - generic [ref=e58]:
                      - paragraph [ref=e59]: "17"
                      - paragraph [ref=e60]: Loss
                      - paragraph [ref=e61]: "MAIN: 25 credits"
            - region "Seat 3" [ref=e62]:
              - generic [ref=e63]:
                - generic [ref=e64]:
                  - 'img "Computer guest: Elaria, Female Elf" [ref=e65]'
                  - generic [ref=e66]:
                    - heading "Elaria" [level=2] [ref=e67]
                    - paragraph [ref=e68]: Female Elf
                    - paragraph [ref=e69]: Seat 3 · Computer
                - group [ref=e70]:
                  - article "Hand A" [ref=e71]:
                    - generic [ref=e72]:
                      - img "10 of diamonds" [ref=e73]:
                        - generic [ref=e74]:
                          - text: "10"
                          - generic [aria-hidden] [ref=e75]: ♦
                        - generic [aria-hidden] [ref=e76]: ♦
                        - generic [aria-hidden] [ref=e77]: "10"
                      - img "7 of hearts" [ref=e78]:
                        - generic [ref=e79]:
                          - text: "7"
                          - generic [aria-hidden] [ref=e80]: ♥
                        - generic [aria-hidden] [ref=e81]: ♥
                        - generic [aria-hidden] [ref=e82]: "7"
                    - generic [ref=e83]:
                      - paragraph [ref=e84]: "17"
                      - paragraph [ref=e85]: Loss
                      - paragraph [ref=e86]: "MAIN: 25 credits"
            - region "Seat 4" [ref=e87]:
              - group "Your player HUD" [ref=e88]:
                - generic [ref=e89]:
                  - generic [ref=e90]:
                    - 'img "Your avatar: Roland, Male Human Knight" [ref=e91]'
                    - generic [ref=e92]:
                      - paragraph [ref=e93]: YOU
                      - heading "Roland" [level=2] [ref=e94]
                      - paragraph [ref=e95]: Male Human Knight
                      - paragraph [ref=e96]: Seat 4 · You · Human
                  - paragraph [ref=e97]: "MAIN: 100 credits"
                - article "Hand A" [ref=e99]:
                  - heading "Hand A" [level=3] [ref=e101]
                  - generic [ref=e102]:
                    - img "A of hearts" [ref=e103]:
                      - generic [ref=e104]:
                        - text: A
                        - generic [aria-hidden] [ref=e105]: ♥
                      - generic [aria-hidden] [ref=e106]: ♥
                      - generic [aria-hidden] [ref=e107]: A
                    - img "K of spades" [ref=e108]:
                      - generic [ref=e109]:
                        - text: K
                        - generic [aria-hidden] [ref=e110]: ♠
                      - generic [aria-hidden] [ref=e111]: ♠
                      - generic [aria-hidden] [ref=e112]: K
                  - generic [ref=e113]:
                    - paragraph [ref=e114]:
                      - text: "Total:"
                      - strong [ref=e115]: "21"
                    - paragraph [ref=e116]: "Wager: 100 credits"
                    - paragraph [ref=e117]: Blackjack
            - region "Seat 6" [ref=e118]:
              - generic [ref=e119]:
                - generic [ref=e120]:
                  - 'img "Computer guest: Seraphine, Female Human Knight" [ref=e121]'
                  - generic [ref=e122]:
                    - heading "Seraphine" [level=2] [ref=e123]
                    - paragraph [ref=e124]: Female Human Knight
                    - paragraph [ref=e125]: Seat 6 · Computer
                - group [ref=e126]:
                  - article "Hand A" [ref=e127]:
                    - generic [ref=e128]:
                      - img "10 of spades" [ref=e129]:
                        - generic [ref=e130]:
                          - text: "10"
                          - generic [aria-hidden] [ref=e131]: ♠
                        - generic [aria-hidden] [ref=e132]: ♠
                        - generic [aria-hidden] [ref=e133]: "10"
                      - img "7 of clubs" [ref=e134]:
                        - generic [ref=e135]:
                          - text: "7"
                          - generic [aria-hidden] [ref=e136]: ♣
                        - generic [aria-hidden] [ref=e137]: ♣
                        - generic [aria-hidden] [ref=e138]: "7"
                    - generic [ref=e139]:
                      - paragraph [ref=e140]: "17"
                      - paragraph [ref=e141]: Loss
                      - paragraph [ref=e142]: "MAIN: 25 credits"
        - region "Your gameplay controls" [ref=e143]:
          - status [ref=e145]: Showing wager settlement
          - button "Skip animations" [ref=e146] [cursor=pointer]
          - region "Your round result" [active] [ref=e147]:
            - paragraph [ref=e148]: "Net result: 150 credits"
            - generic [ref=e149]:
              - button "Deal Again" [ref=e150] [cursor=pointer]
              - button "Repeat Bet · 100 credits" [ref=e151] [cursor=pointer]
            - group [ref=e152]:
              - generic "Wager result details" [ref=e153] [cursor=pointer]
          - region "Your credits" [ref=e154]:
            - heading "Credits" [level=2] [ref=e155]
            - generic [ref=e156]:
              - generic [ref=e157]:
                - term [ref=e158]: Available
                - definition [ref=e159]: 1,150
              - generic [ref=e160]:
                - term [ref=e161]: Reserved / current exposure
                - definition [ref=e162]: "0"
              - generic [ref=e163]:
                - term [ref=e164]: Pending return
                - definition [ref=e165]: "0"
      - paragraph [ref=e166]: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
    - complementary "Table preferences and demo tools" [ref=e167]:
      - generic [ref=e168]:
        - paragraph [ref=e169]: 4 players · 1 human · 3 computer guests
        - button "New table · reset to 1000 credits" [ref=e170] [cursor=pointer]
      - group [ref=e171]:
        - generic "Change Character · Roland" [ref=e172] [cursor=pointer]
        - option "Caelan · Male Elf"
        - option "Elaria · Female Elf"
        - option "Roland · Male Human Knight" [selected]
        - option "Seraphine · Female Human Knight"
        - option "Alaric · Male Mage"
        - option "Nyra · Female Mage"
        - option "Lucien · Male Noble"
        - option "Celestine · Female Noble · Dealer (reserved for this table)" [disabled]
        - option "Garruk · Male Half-Orc Warrior"
        - option "Vesha · Female Half-Orc Warrior"
        - option "Borin · Male Dwarf"
        - option "Brynja · Female Dwarf"
      - group [ref=e173]:
        - generic "Developer / demo tools" [ref=e174] [cursor=pointer]
        - option "Classic Blackjack (v1.2 · Re-split Aces)"
        - option "Five-Card Charlie Demo (v1.2 · Re-split Aces)"
        - option "Classic Blackjack" [selected]
        - option "Five-Card Charlie Demo"
  - generic [aria-hidden]:
    - generic: Blackjack · 250 credits
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
> 64  |   await page.getByRole('button', { name: 'Next round', exact: true }).click();
      |                                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  96  |   await expect(page.getByRole('button', { name: 'Next round', exact: true })).toBeEnabled();
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
