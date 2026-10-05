# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\playerActions.spec.ts >> [T07-B02-768] Hit after Split, exact child anchor and interrupt before next legal action
- Location: tests\browser\m10\playerActions.spec.ts:58:65

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Hand 2.*Current hand/ })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: /Hand 2.*Current hand/ }) with timeout 5000ms
  - waiting for getByRole('heading', { name: /Hand 2.*Current hand/ })

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
          - img "Hidden dealer card": ◆
          - paragraph: "Visible total: 10"
          - paragraph: Hole card hidden
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
            - paragraph: Decisions complete
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
            - paragraph: Decisions complete
            - paragraph: "MAIN: 25 credits"
      - region "Seat 4":
        - group "Your player HUD":
          - 'img "Your avatar: Roland, Male Human Knight"'
          - paragraph: YOU
          - heading "Roland" [level=2]: ▸ Roland
          - paragraph: Male Human Knight
          - paragraph: Seat 4 · You · Human
          - paragraph: "MAIN: 100 credits"
          - article "Hand A":
            - heading "Hand A" [level=3]
            - img "8 of hearts": "8"
            - img "2 of hearts": "2"
            - img "3 of spades": "3"
            - paragraph:
              - text: "Total:"
              - strong: "13"
            - paragraph: "Wager: 100 credits"
            - paragraph: Decisions complete
          - article "Hand B":
            - heading "Hand B · Current hand" [level=3]
            - text: ACTIVE
            - img "8 of spades": "8"
            - img "A of clubs": A
            - paragraph:
              - text: "Total:"
              - strong: "19"
            - paragraph: "Wager: 100 credits"
            - paragraph: Playing
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
            - paragraph: Playing
            - paragraph: "MAIN: 25 credits"
    - region "Your gameplay controls":
      - status: Your turn
      - text: · Hand B
      - region "Primary actions":
        - button "Hit"
        - button "Stand"
        - button "Double"
        - button "Split" [disabled]
        - button "Surrender" [disabled]
        - group: Action guidance · Unavailable actions explained
      - region "Your credits":
        - heading "Credits" [level=2]
        - term: Available
        - definition: "800"
        - term: Reserved / current exposure
        - definition: "200"
        - term: Pending return
        - definition: "0"
    - paragraph: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools":
    - paragraph: 4 players · 1 human · 3 computer guests
    - button "New table · reset to 1000 credits" [disabled]
    - group: Change Character · Roland
    - group: Developer / demo tools
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test';
  2  | import { mkdirSync, writeFileSync } from 'node:fs';
  3  | import { Buffer } from 'node:buffer';
  4  | 
  5  | test.use({ reducedMotion: 'no-preference' });
  6  | async function deal(page: Page, fixture: string) {
  7  |   await page.goto(`/?fixture=${fixture}`);
  8  |   await page.getByLabel('Your main wager', { exact: false }).fill('100');
  9  |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  10 |   await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running','false');
  11 | }
  12 | async function pauseNext(page: Page) {
  13 |   await page.evaluate(() => {
  14 |     const observer = new MutationObserver(records => {
  15 |       for (const record of records) for (const node of record.addedNodes) if (node instanceof HTMLElement && (node.dataset.actionCardFlight || node.dataset.splitFlight)) {
  16 |         node.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 70; });
  17 |         observer.disconnect();
  18 |       }
  19 |     });
  20 |     observer.observe(document.body,{ childList: true });
  21 |   });
  22 | }
  23 | async function resume(page: Page) {
  24 |   await page.evaluate(() => document.querySelectorAll<HTMLElement>('[data-action-card-flight],[data-split-flight]').forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.play())));
  25 | }
  26 | async function capture(page: Page, path: string) {
  27 |   const cdp = await page.context().newCDPSession(page);
  28 |   const screenshot = await cdp.send('Page.captureScreenshot',{ format:'png', fromSurface:true, captureBeyondViewport:false });
  29 |   await cdp.detach(); writeFileSync(path,Buffer.from(screenshot.data,'base64'));
  30 | }
  31 | for (const [action,fixture] of [['Hit','player-loss'],['Double','player-loss'],['Split','player-split']] as const) {
  32 |   test(`[T07-B01-${action}] actual pre/mid/settled motion and authoritative hand targeting`, async ({ page }) => {
  33 |     await deal(page,fixture);
  34 |     const root = `docs/M10_T07_EVIDENCE/browser/${Date.now()}-${action}`; mkdirSync(root,{ recursive:true });
  35 |     await capture(page,`${root}/pre.png`); await pauseNext(page);
  36 |     await page.getByRole('button',{ name:action,exact:true }).click();
  37 |     const selector = action === 'Split' ? '[data-split-flight]' : '[data-action-card-flight]';
  38 |     await expect(page.locator(selector)).toHaveCount(1);
  39 |     await expect(page.locator('.game-scene')).toHaveAttribute('data-player-actions-running','true');
  40 |     const target = action === 'Split' ? 'round-1/seat-4.1:0' : 'round-1/seat-4:2';
  41 |     await expect(page.locator(`[data-card-slot="${target}"]`)).toHaveCSS('opacity','0');
  42 |     if (action === 'Split') {
  43 |       await expect(page.locator('[data-split-target]')).toHaveCount(2);
  44 |       expect(await page.locator('[data-split-target]').evaluateAll(elements => elements.map(element => (element as HTMLElement).dataset.splitTarget))).toEqual(['round-1/seat-4.1:0','round-1/seat-4.2:0']);
  45 |     } else {
  46 |       await expect(page.locator(selector)).toHaveAttribute('data-deal-target',target);
  47 |       await expect(page.locator(`${selector} .card`)).toHaveClass(/card-back/);
  48 |       await expect(page.locator(selector)).toHaveAttribute('aria-hidden','true');
  49 |     }
  50 |     await capture(page,`${root}/mid.png`); await resume(page);
  51 |     await expect(page.locator('.game-scene')).toHaveAttribute('data-player-actions-running','false');
  52 |     await expect(page.locator('[data-action-card-flight],[data-split-flight]')).toHaveCount(0);
  53 |     await expect(page.locator(`[data-card-slot="${target}"]`)).toHaveCSS('opacity','1');
  54 |     await capture(page,`${root}/settled.png`);
  55 |     writeFileSync(`${root}/receipt.json`,JSON.stringify({ action,target,viewport:page.viewportSize(),files:['pre.png','mid.png','settled.png'] },null,2));
  56 |   });
  57 | }
  58 | for (const [width,height] of [[1280,900],[768,1024],[320,720]]) test(`[T07-B02-${width}] Hit after Split, exact child anchor and interrupt before next legal action`,async ({ page }) => {
  59 |   await page.setViewportSize({ width,height }); await deal(page,'player-split');
  60 |   await page.getByRole('button',{ name:'Split',exact:true }).click();
  61 |   await expect(page.locator('.game-scene')).toHaveAttribute('data-player-actions-running','false');
  62 |   await pauseNext(page); await page.getByRole('button',{ name:'Hit',exact:true }).click();
  63 |   await expect(page.locator('[data-action-card-flight]')).toHaveAttribute('data-deal-target','round-1/seat-4.1:2');
  64 |   await page.getByRole('button',{ name:'Stand',exact:true }).click();
  65 |   await expect(page.locator('[data-card-slot="round-1/seat-4.1:2"]')).toHaveCSS('opacity','1');
> 66 |   await expect(page.getByRole('heading',{ name:/Hand 2.*Current hand/ })).toBeVisible();
     |                                                                           ^ Error: expect(locator).toBeVisible() failed
  67 |   await expect(page.locator('.game-scene')).toHaveAttribute('data-player-actions-running','false');
  68 |   await expect(page.locator('[data-action-card-flight],[data-split-flight]')).toHaveCount(0);
  69 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  70 | });
  71 | test('[T07-B03] three Splits to four RSA leaves preserve active hand and bounded overlays', async ({ page }) => {
  72 |   await deal(page,'player-rsa-cap');
  73 |   const root=`docs/M10_T07_EVIDENCE/browser/${Date.now()}-four-leaves`; mkdirSync(root,{recursive:true});
  74 |   for (let count=0;count<3;count++) {
  75 |     await page.getByRole('button',{ name:'Split',exact:true }).click();
  76 |     await expect(page.locator('.game-scene')).toHaveAttribute('data-player-actions-running','false');
  77 |   }
  78 |   await expect(page.locator('.hud-hand')).toHaveCount(4);
  79 |   expect(await page.locator('.hud-hand').evaluateAll(elements => elements.map(element => element.getAttribute('data-hand-id')))).toEqual([
  80 |     'round-1/seat-4.1.1.1','round-1/seat-4.1.1.2','round-1/seat-4.1.2','round-1/seat-4.2',
  81 |   ]);
  82 |   await expect(page.locator('[data-action-card-flight],[data-split-flight]')).toHaveCount(0);
  83 |   await capture(page,`${root}/settled-four-leaves.png`);
  84 | });
  85 | 
```