# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\wagers.spec.ts >> [T09-B05] reduced win/loss/push and Even Money display exact result without floating stacks
- Location: tests\browser\m10\wagers.spec.ts:98:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()
Expected: "1100"
Received: "1,100"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first() with timeout 5000ms
  - waiting for getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()
    14 × locator resolved to <dd>1,100</dd>
       - unexpected value "1,100"

```

```yaml
- definition: 1,100
```

# Test source

```ts
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
  96  |   await expect(page.getByRole('button', { name: 'Next round', exact: true })).toBeEnabled();
  97  | });
  98  | test('[T09-B05] reduced win/loss/push and Even Money display exact result without floating stacks', async ({ page }) => {
  99  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  100 |   for (const [fixture, available] of [['player-dealer-bust', '1100'], ['player-loss', '900'], ['player-push', '1000']] as const) {
  101 |     await deal(page, fixture); await page.getByRole('button', { name: 'Stand', exact: true }).click();
> 102 |     await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()).toHaveText(available);
      |                                                                                                         ^ Error: expect(locator).toHaveText(expected) failed
  103 |     await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
  104 |   }
  105 |   await deal(page, 'player-even-money'); await page.getByRole('button', { name: 'Take Even Money', exact: true }).click();
  106 |   await expect(page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').first()).toHaveText('1100');
  107 |   await expect(page.locator('[data-wager-flight]')).toHaveCount(0);
  108 | });
  109 |
```
