# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\dealerCleanup.spec.ts >> [PRE-T11-B01] real unstarted setup preview has no roster identity and shows the supplied portrait
- Location: tests\browser\m10\dealerCleanup.spec.ts:36:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.audit-list li')
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('.audit-list li') with timeout 5000ms
  - waiting for locator('.audit-list li')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
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
          - 'img "Dealer: generic formal portrait" [ref=e13]'
          - heading "Dealer" [level=2] [ref=e14]
          - group "Dealer hand" [ref=e15]:
            - paragraph [ref=e16]: Waiting for the initial deal
          - group "Shoe and deal origin" [ref=e17]:
            - paragraph [ref=e19]:
              - text: Shoe · Deal origin
              - generic [ref=e20]: 6 decks
          - paragraph [ref=e21]:
            - text: BLACKJACK PAYS 3:2
            - generic [ref=e22]: DEALER STANDS ON ALL 17
      - region "Your gameplay controls" [ref=e23]:
        - status [ref=e25]: Choose your players, then start the table
        - region "Your credits" [ref=e26]:
          - heading "Credits" [level=2] [ref=e27]
          - generic [ref=e28]:
            - generic [ref=e29]:
              - term [ref=e30]: Available
              - definition [ref=e31]: 1,000
            - generic [ref=e32]:
              - term [ref=e33]: Reserved / current exposure
              - definition [ref=e34]: "0"
            - generic [ref=e35]:
              - term [ref=e36]: Pending return
              - definition [ref=e37]: "0"
        - region "Start your table" [ref=e38]:
          - heading "Your evening at the table" [level=2] [ref=e39]
          - generic [ref=e40]: Total players
          - combobox "Total players" [ref=e41]:
            - option "1"
            - option "2"
            - option "3"
            - option "4" [selected]
            - option "5"
            - option "6"
            - option "7"
          - paragraph [ref=e42]: 1 human · 3 computer guests · You play Seat 4
          - button "Start table" [ref=e43] [cursor=pointer]
          - paragraph [ref=e44]: "Starting balance: 1000 simulation credits."
    - paragraph [ref=e45]: 6-deck persistent shoe · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools" [ref=e46]:
    - generic [ref=e47]:
      - generic [ref=e48]:
        - checkbox "Reduce motion" [checked] [disabled] [ref=e49]
        - text: Reduce motion
      - paragraph [ref=e50]: Reduced motion is enabled by your device.
    - group [ref=e51]:
      - generic "Change Character · Roland" [ref=e52] [cursor=pointer]
      - option "Caelan · Male Elf"
      - option "Elaria · Female Elf"
      - option "Roland · Male Human Knight" [selected]
      - option "Seraphine · Female Human Knight"
      - option "Alaric · Male Mage"
      - option "Nyra · Female Mage"
      - option "Lucien · Male Noble"
      - option "Celestine · Female Noble"
      - option "Garruk · Male Half-Orc Warrior"
      - option "Vesha · Female Half-Orc Warrior"
      - option "Borin · Male Dwarf"
      - option "Brynja · Female Dwarf"
    - group [ref=e53]:
      - generic "Developer / demo tools" [ref=e54] [cursor=pointer]
      - option "Classic Blackjack (v1.2 · Re-split Aces)" [selected]
      - option "Five-Card Charlie Demo (v1.2 · Re-split Aces)"
      - option "Classic Blackjack"
      - option "Five-Card Charlie Demo"
```

# Test source

```ts
  1   | import { test, expect, type Page, type TestInfo } from '@playwright/test';
  2   | import { writeFileSync } from 'node:fs';
  3   | import { Buffer } from 'node:buffer';
  4   | 
  5   | const generic = 'Dealer: generic formal portrait';
  6   | async function start(page: Page, count: number) {
  7   |   await page.getByLabel('Total players', { exact: true }).selectOption(String(count));
  8   |   await page.getByRole('button', { name: 'Start table', exact: true }).click();
  9   | }
  10  | async function deal(page: Page) {
  11  |   await page.getByLabel('Your main wager', { exact: false }).fill('100');
  12  |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  13  | }
  14  | async function finish(page: Page) {
  15  |   if (await page.getByRole('button', { name: 'Decline', exact: true }).count()) await page.getByRole('button', { name: 'Decline', exact: true }).click();
  16  |   if (await page.getByRole('button', { name: 'Stand', exact: true }).count()) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  17  |   await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toBeVisible();
  18  | }
  19  | async function portrait(page: Page, name: string) {
  20  |   const dealer = page.getByRole('region', { name: 'Dealer', exact: true });
  21  |   const image = dealer.getByRole('img', { name, exact: true });
  22  |   await expect(image).toBeVisible();
  23  |   if (name !== 'Dealer portrait unavailable') await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(240);
  24  |   await expect(dealer.locator('.person-dealer,svg')).toHaveCount(0);
  25  |   return dealer;
  26  | }
  27  | async function capture(page: Page, info: TestInfo, name: string) {
  28  |   await expect(page.locator('.person-dealer')).toHaveCount(0);
  29  |   await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true });
  30  | }
  31  | test.afterEach(async ({ page }) => {
  32  |   await expect(page.locator('.person-dealer')).toHaveCount(0);
  33  |   expect(await page.locator('.dealer-zone img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  34  | });
  35  | 
  36  | test('[PRE-T11-B01] real unstarted setup preview has no roster identity and shows the supplied portrait', async ({ page }, info) => {
  37  |   await page.goto('/?fixture=player-setup'); const dealer = await portrait(page, generic);
  38  |   expect(await dealer.getAttribute('data-dealer-character')).toBeNull();
> 39  |   await expect(page.locator('.audit-list li')).toHaveCount(0);
      |                                                ^ Error: expect(locator).toHaveCount(expected) failed
  40  |   await capture(page, info, '01-setup-generic');
  41  | });
  42  | for (const count of [1, 4, 7]) test(`[PRE-T11-B02-${count}] eligible Celestine remains formal through active and complete ${count}-player rounds`, async ({ page }, info) => {
  43  |   await page.goto('/?fixture=player-setup'); await start(page, count);
  44  |   const dealer = await portrait(page, 'Dealer: Celestine'); await expect(dealer).toHaveAttribute('data-dealer-character', 'noble_female');
  45  |   await deal(page); await capture(page, info, `02-table-${count}-waiting`); await finish(page);
  46  |   await portrait(page, 'Dealer: Celestine'); await capture(page, info, `03-table-${count}-complete`);
  47  |   await page.getByRole('button', { name: 'Deal Again', exact: true }).click(); await portrait(page, 'Dealer: Celestine');
  48  |   await deal(page); await finish(page); await page.getByRole('button', { name: 'New table · reset to 1000 credits', exact: true }).click();
  49  |   await portrait(page, generic); await start(page, 1); await portrait(page, 'Dealer: Seraphine');
  50  |   await capture(page, info, `04-rotated-Seraphine-after-${count}`);
  51  | });
  52  | test('[PRE-T11-B03] seated Celestine selects eligible Seraphine while retaining the human identity', async ({ page }, info) => {
  53  |   await page.goto('/?fixture=player-setup'); await page.locator('.character-picker summary').click();
  54  |   await page.getByLabel('Your character', { exact: true }).selectOption('noble_female'); await start(page, 4);
  55  |   await portrait(page, 'Dealer: Seraphine'); await expect(page.locator('#player-hand')).toHaveAttribute('data-character', 'noble_female');
  56  |   await capture(page, info, '05-collision-Seraphine');
  57  | });
  58  | test('[PRE-T11-B04] all approved identities seated use only the non-roster generic without replacing any player', async ({ page }, info) => {
  59  |   await page.goto('/?fixture=player-setup');
  60  |   await page.locator('#root').evaluate(async root => {
  61  |     const app = '/src/ui/App.tsx', controller = '/src/browser/controller.ts', registry = '/src/presentation/formalDealers.ts', react = '/node_modules/.vite/deps/react.js', dom = '/node_modules/.vite/deps/react-dom_client.js';
  62  |     const { App } = await import(app), { createBrowserController } = await import(controller), { FORMAL_DEALER_CONFIGURATION } = await import(registry), { default: React } = await import(react), { default: ReactDOM } = await import(dom);
  63  |     const ids = ['elf_male', 'elf_female', 'knight_male', 'knight_female', 'mage_male', 'mage_female', 'noble_male', 'noble_female', 'halforc_male', 'halforc_female', 'dwarf_male', 'dwarf_female'];
  64  |     const picks = ['knight_female', 'mage_female', 'elf_female', 'halforc_female', 'elf_male', 'dwarf_male'];
  65  |     const choose = (n: number) => { const available = ids.filter(id => id !== 'noble_female'), index = 11 - n; for (let i = 0; i < index; i++) available.splice(available.indexOf(picks[i]), 1); return available.indexOf(picks[index]); };
  66  |     const mount = document.createElement('div'); root.replaceChildren(mount);
  67  |     ReactDOM.createRoot(mount).render(React.createElement(App, { controller: createBrowserController({ playerMode: true, deferPlayerStart: true, seed: 7 }), chooseCharacter: choose, dealerConfiguration: FORMAL_DEALER_CONFIGURATION }));
  68  |   });
  69  |   await page.locator('.character-picker summary').click(); await page.getByLabel('Your character', { exact: true }).selectOption('noble_female');
  70  |   await start(page, 7); const dealer = await portrait(page, generic); expect(await dealer.getAttribute('data-dealer-character')).toBeNull();
  71  |   const ids = await page.locator('[data-seat-anchor]').evaluateAll(els => els.map(el => el.getAttribute('data-character')));
  72  |   expect(new Set(ids).size).toBe(7); for (const id of ['noble_female', 'knight_female', 'mage_female', 'elf_female', 'halforc_female']) expect(ids).toContain(id);
  73  |   await deal(page); await capture(page, info, '06-all-pool-seated-generic'); await finish(page);
  74  | });
  75  | for (const emergency of [false, true]) test(`[PRE-T11-B05-${emergency}] failed roster image falls through ${emergency ? 'to neutral text when both images fail' : 'to decoded generic PNG'}`, async ({ page }, info) => {
  76  |   await page.route(emergency ? '**/characters/dealer/**/formal.png' : '**/characters/dealer/noble_female/formal.png', route => route.abort());
  77  |   await page.goto('/?fixture=player'); await portrait(page, emergency ? 'Dealer portrait unavailable' : generic);
  78  |   if (emergency) await expect(page.locator('.dealer-zone img')).toHaveCount(0);
  79  |   await deal(page); await expect(page.getByRole('button', { name: 'Stand', exact: true })).toBeEnabled();
  80  |   await capture(page, info, `07-image-failure-${emergency ? 'neutral' : 'generic'}`); await finish(page);
  81  | });
  82  | for (const [mode, width, height] of [['REDUCED_MOTION', 768, 1024], ['IMMEDIATE', 320, 720]] as const) test(`[PRE-T11-B06-${mode}] responsive generic fallback and terminal replay preserve live audit/cards`, async ({ page }, info) => {
  83  |   await page.setViewportSize({ width, height }); await page.goto(`/?fixture=player&dealer=legacy&motion=${mode}`);
  84  |   await portrait(page, generic); await deal(page); await finish(page);
  85  |   await expect(page.locator('.game-scene')).toHaveAttribute('data-presentation-mode', mode);
  86  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  87  |   const audit = await page.locator('.audit-list').innerHTML(), cards = await page.locator('.dealer-card-lane').innerHTML();
  88  |   await page.getByText('Developer / demo tools', { exact: true }).click();
  89  |   await page.getByRole('button', { name: 'View replay package', exact: true }).click();
  90  |   const replay = JSON.parse(await page.getByLabel('Completed replay JSON', { exact: true }).inputValue());
  91  |   expect(JSON.stringify(replay)).not.toMatch(/generic_female|formal\.png|characterId/);
  92  |   await page.getByRole('button', { name: 'Replay completed session', exact: true }).click();
  93  |   await expect(page.getByRole('region', { name: 'Replay result', exact: true })).toBeVisible();
  94  |   expect(await page.locator('.audit-list').innerHTML()).toBe(audit); expect(await page.locator('.dealer-card-lane').innerHTML()).toBe(cards);
  95  |   await portrait(page, generic); await capture(page, info, `08-${width}-${mode}-replay`);
  96  | });
  97  | test('[PRE-T11-B07] full motion Dealer remains formal at paused initial deal and real public reveal', async ({ page }, info) => {
  98  |   await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/?fixture=player-dealer-multi'); await portrait(page, 'Dealer: Celestine');
  99  |   await page.evaluate(() => {
  100 |     const observer = new MutationObserver(() => {
  101 |       const flight = document.querySelector('[data-initial-deal-flight]');
  102 |       if (flight) { flight.getAnimations({ subtree: true }).forEach(animation => animation.pause()); observer.disconnect(); }
  103 |     }); observer.observe(document.body, { childList: true, subtree: true });
  104 |   });
  105 |   await deal(page); await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'DEALING');
  106 |   await portrait(page, 'Dealer: Celestine');
  107 |   const pixels = async (name: string) => { const cdp = await page.context().newCDPSession(page); const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true }); await cdp.detach(); writeFileSync(info.outputPath(name + '.png'), Buffer.from(shot.data, 'base64')); };
  108 |   await pixels('09-active-DEALING'); await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  109 |   await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'WAITING_PLAYER');
  110 |   await page.evaluate(() => { const observer = new MutationObserver(() => { const card = document.querySelector('[data-dealer-reveal]'); if (card) { card.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 35; }); observer.disconnect(); } }); observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-dealer-reveal'] }); });
  111 |   await page.getByRole('button', { name: 'Stand', exact: true }).click(); await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'REVEALING');
  112 |   await portrait(page, 'Dealer: Celestine'); await pixels('10-active-REVEALING');
  113 |   await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  114 |   await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toBeVisible();
  115 |   await capture(page, info, '11-motion-complete');
  116 | });
  117 | 
```