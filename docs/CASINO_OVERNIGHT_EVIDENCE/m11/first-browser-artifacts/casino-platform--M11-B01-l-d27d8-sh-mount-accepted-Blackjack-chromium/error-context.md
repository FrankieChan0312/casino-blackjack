# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: casino\platform.spec.ts >> [M11-B01] lobby native navigation, deep links and refresh mount accepted Blackjack
- Location: tests\browser\casino\platform.spec.ts:4:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Start table', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('button', { name: 'Start table', exact: true }) with timeout 5000ms
  - waiting for getByRole('button', { name: 'Start table', exact: true })

```

```yaml
- main:
  - link "Skip to your hand and actions":
    - /url: "#player-decisions"
  - region "Blackjack game scene":
    - heading "Casino Blackjack" [level=1]
    - paragraph: Simulation credits only — no real-money gambling. Credits have no redemption value.
    - region "Blackjack table":
      - region "Dealer":
        - 'img "Dealer: Celestine"'
        - heading "Dealer" [level=2]
        - group "Dealer hand":
          - paragraph: Waiting for the initial deal
        - group "Shoe and deal origin":
          - paragraph: Shoe · Deal origin 6 decks
        - paragraph: BLACKJACK PAYS 3:2 DEALER STANDS ON ALL 17
      - region "Seat 1":
        - 'img "Computer guest: Caelan, Male Elf"'
        - heading "Caelan" [level=2]
        - paragraph: Male Elf
        - paragraph: Seat 1 · Computer
        - paragraph: "MAIN: 25 credits"
        - paragraph: Waiting for the deal
      - region "Seat 3":
        - 'img "Computer guest: Elaria, Female Elf"'
        - heading "Elaria" [level=2]
        - paragraph: Female Elf
        - paragraph: Seat 3 · Computer
        - paragraph: "MAIN: 25 credits"
        - paragraph: Waiting for the deal
      - region "Seat 4":
        - group "Your player HUD":
          - 'img "Your avatar: Roland, Male Human Knight"'
          - paragraph: YOU
          - heading "Roland" [level=2]
          - paragraph: Male Human Knight
          - paragraph: Seat 4 · You · Human
          - paragraph: "MAIN: 0 credits"
          - paragraph: Your cards will be dealt here.
      - region "Seat 6":
        - 'img "Computer guest: Seraphine, Female Human Knight"'
        - heading "Seraphine" [level=2]
        - paragraph: Female Human Knight
        - paragraph: Seat 6 · Computer
        - paragraph: "MAIN: 25 credits"
        - paragraph: Waiting for the deal
    - region "Your gameplay controls":
      - status: Betting open
      - region "Your credits":
        - heading "Credits" [level=2]
        - term: Available
        - definition: 1,000
        - term: Reserved / current exposure
        - definition: "0"
        - term: Pending return
        - definition: "0"
      - region "Your wager":
        - heading "Take your seat" [level=2]
        - text: Your main wager (credits)
        - spinbutton "Your main wager (credits)": "25"
        - button "Choose 10 credits": "10"
        - button "Choose 25 credits" [pressed]: "25"
        - button "Choose 100 credits": "100"
        - button "Deal"
        - paragraph: 10–1000 whole credits. Your guests are already ready to play.
        - group: Optional wagers
    - paragraph: 6-deck persistent shoe · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools":
    - paragraph: 4 players · 1 human · 3 computer guests
    - button "New table · reset to 1000 credits" [disabled]
    - checkbox "Reduce motion" [checked] [disabled]
    - text: Reduce motion
    - paragraph: Reduced motion is enabled by your device.
    - group: Change Character · Roland
    - group: Developer / demo tools
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
  1  | import { expect, test } from '@playwright/test';
  2  | import { mkdirSync } from 'node:fs';
  3  | const evidence = '.git/overnight/visual/m11';
  4  | test('[M11-B01] lobby native navigation, deep links and refresh mount accepted Blackjack', async ({ page }) => {
  5  |   await page.goto('/casino'); await expect(page.getByRole('heading', { name: 'Casino Lobby', exact: true })).toBeVisible();
  6  |   await page.getByRole('link', { name: 'Play Blackjack' }).click();
> 7  |   await expect(page).toHaveURL(/\/blackjack$/); await expect(page.getByRole('button', { name: 'Start table', exact: true })).toBeVisible();
     |                                                                                                                              ^ Error: expect(locator).toBeVisible() failed
  8  |   await page.reload(); await expect(page.getByRole('button', { name: 'Start table', exact: true })).toBeVisible();
  9  |   await page.getByRole('button', { name: 'Start table', exact: true }).click();
  10 |   await expect(page.getByRole('button', { name: 'Deal', exact: true })).toBeEnabled();
  11 |   await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  12 |   mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: evidence + '/blackjack.png', fullPage: true });
  13 |   await page.getByRole('navigation', { name: 'Casino games' }).getByRole('link', { name: 'Casino Lobby' }).click();
  14 |   await page.getByRole('link', { name: 'Preview Baccarat' }).click();
  15 |   await expect(page).toHaveURL(/\/baccarat$/); await expect(page.getByRole('region', { name: 'Baccarat preview' })).toBeVisible();
  16 |   await page.reload(); await expect(page.getByText('Player · Tie · Banker', { exact: true })).toBeVisible();
  17 | });
  18 | for (const width of [1280, 768, 320]) test(`[M11-B02-${width}] responsive lobby and keyboard game links`, async ({ page }) => {
  19 |   await page.setViewportSize({ width, height: width === 768 ? 1024 : 900 }); await page.goto('/casino');
  20 |   await expect(page.getByRole('img', { name: 'Dealer: Celestine', exact: true })).toBeVisible();
  21 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  22 |   const play = page.getByRole('link', { name: 'Play Blackjack' }); await play.focus();
  23 |   await expect(play).toBeFocused(); expect((await play.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  24 |   mkdirSync(evidence, { recursive: true }); await page.screenshot({ path: `${evidence}/lobby-${width}.png`, fullPage: true });
  25 |   await page.keyboard.press('Enter'); await expect(page).toHaveURL(/\/blackjack$/);
  26 | });
  27 | test('[M11-B03] original root entry and unknown route stay explicit', async ({ page }) => {
  28 |   await page.goto('/'); await expect(page.locator('.player-mode')).toBeVisible();
  29 |   await expect(page.getByRole('heading', { name: 'Casino Lobby', exact: true })).toHaveCount(0);
  30 |   await page.goto('/missing'); await expect(page.getByRole('heading', { name: 'Table not found' })).toBeVisible();
  31 |   await page.getByRole('link', { name: 'Return to Casino Lobby' }).click(); await expect(page).toHaveURL(/\/casino$/);
  32 | });
  33 |
```