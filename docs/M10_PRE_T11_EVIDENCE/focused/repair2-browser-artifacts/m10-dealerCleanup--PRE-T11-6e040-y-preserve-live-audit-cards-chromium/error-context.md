# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\dealerCleanup.spec.ts >> [PRE-T11-B06-REDUCED_MOTION] responsive generic fallback and terminal replay preserve live audit/cards
- Location: tests\browser\m10\dealerCleanup.spec.ts:84:104

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'View replay package', exact: true })

```

# Page snapshot

```yaml
- main [ref=e3]:
  - link "Skip to your hand and actions" [ref=e4] [cursor=pointer]:
    - /url: "#player-decisions"
  - region "Blackjack game scene" [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - paragraph [ref=e8]: An evening at the table
        - heading "Casino Blackjack" [level=1] [ref=e9]
      - paragraph [ref=e10]: Simulation credits only — no real-money gambling.Credits have no redemption value.
    - generic [ref=e11]:
      - region "Blackjack table" [ref=e12]:
        - region "Dealer" [ref=e13]:
          - 'img "Dealer: generic formal portrait" [ref=e14]'
          - heading "Dealer" [level=2] [ref=e15]
          - group "Dealer hand" [ref=e16]:
            - generic [ref=e18]:
              - img "4 of clubs" [ref=e19]:
                - generic [ref=e20]:
                  - text: "4"
                  - generic [aria-hidden] [ref=e21]: ♣
                - generic [aria-hidden] [ref=e22]: ♣
                - generic [aria-hidden] [ref=e23]: "4"
              - img "K of clubs" [ref=e24]:
                - generic [ref=e25]:
                  - text: K
                  - generic [aria-hidden] [ref=e26]: ♣
                - generic [aria-hidden] [ref=e27]: ♣
                - generic [aria-hidden] [ref=e28]: K
              - img "9 of spades" [ref=e29]:
                - generic [ref=e30]:
                  - text: "9"
                  - generic [aria-hidden] [ref=e31]: ♠
                - generic [aria-hidden] [ref=e32]: ♠
                - generic [aria-hidden] [ref=e33]: "9"
            - paragraph [ref=e34]: "Total: 23"
            - paragraph [ref=e35]: Bust
          - group "Shoe and deal origin" [ref=e36]:
            - paragraph [ref=e38]:
              - text: Shoe · Deal origin
              - generic [ref=e39]: 6 decks
          - paragraph [ref=e40]:
            - text: BLACKJACK PAYS 3:2
            - generic [ref=e41]: DEALER STANDS ON ALL 17
        - generic [ref=e42]:
          - region "Seat 1" [ref=e43]:
            - generic [ref=e44]:
              - generic [ref=e45]:
                - 'img "Computer guest: Caelan, Male Elf" [ref=e46]'
                - generic [ref=e47]:
                  - heading "Caelan" [level=2] [ref=e48]
                  - paragraph [ref=e49]: Male Elf
                  - paragraph [ref=e50]: Seat 1 · Computer
              - group [ref=e51]:
                - article "Hand A" [ref=e52]:
                  - generic [ref=e53]:
                    - img "J of hearts" [ref=e54]:
                      - generic [ref=e55]:
                        - text: J
                        - generic [aria-hidden] [ref=e56]: ♥
                      - generic [aria-hidden] [ref=e57]: ♥
                      - generic [aria-hidden] [ref=e58]: J
                    - img "5 of diamonds" [ref=e59]:
                      - generic [ref=e60]:
                        - text: "5"
                        - generic [aria-hidden] [ref=e61]: ♦
                      - generic [aria-hidden] [ref=e62]: ♦
                      - generic [aria-hidden] [ref=e63]: "5"
                    - img "2 of clubs" [ref=e64]:
                      - generic [ref=e65]:
                        - text: "2"
                        - generic [aria-hidden] [ref=e66]: ♣
                      - generic [aria-hidden] [ref=e67]: ♣
                      - generic [aria-hidden] [ref=e68]: "2"
                  - generic [ref=e69]:
                    - paragraph [ref=e70]: "17"
                    - paragraph [ref=e71]: Win
                    - paragraph [ref=e72]: "MAIN: 25 credits"
          - region "Seat 3" [ref=e73]:
            - generic [ref=e74]:
              - generic [ref=e75]:
                - 'img "Computer guest: Elaria, Female Elf" [ref=e76]'
                - generic [ref=e77]:
                  - heading "Elaria" [level=2] [ref=e78]
                  - paragraph [ref=e79]: Female Elf
                  - paragraph [ref=e80]: Seat 3 · Computer
              - group [ref=e81]:
                - article "Hand A" [ref=e82]:
                  - generic [ref=e83]:
                    - img "A of hearts" [ref=e84]:
                      - generic [ref=e85]:
                        - text: A
                        - generic [aria-hidden] [ref=e86]: ♥
                      - generic [aria-hidden] [ref=e87]: ♥
                      - generic [aria-hidden] [ref=e88]: A
                    - img "8 of spades" [ref=e89]:
                      - generic [ref=e90]:
                        - text: "8"
                        - generic [aria-hidden] [ref=e91]: ♠
                      - generic [aria-hidden] [ref=e92]: ♠
                      - generic [aria-hidden] [ref=e93]: "8"
                  - generic [ref=e94]:
                    - paragraph [ref=e95]: "19"
                    - paragraph [ref=e96]: Win
                    - paragraph [ref=e97]: "MAIN: 25 credits"
          - region "Seat 4" [ref=e98]:
            - group "Your player HUD" [ref=e99]:
              - generic [ref=e100]:
                - generic [ref=e101]:
                  - 'img "Your avatar: Roland, Male Human Knight" [ref=e102]'
                  - generic [ref=e103]:
                    - paragraph [ref=e104]: YOU
                    - heading "Roland" [level=2] [ref=e105]
                    - paragraph [ref=e106]: Male Human Knight
                    - paragraph [ref=e107]: Seat 4 · You · Human
                - paragraph [ref=e108]: "MAIN: 100 credits"
              - article "Hand A" [ref=e110]:
                - heading "Hand A" [level=3] [ref=e112]
                - generic [ref=e113]:
                  - img "5 of hearts" [ref=e114]:
                    - generic [ref=e115]:
                      - text: "5"
                      - generic [aria-hidden] [ref=e116]: ♥
                    - generic [aria-hidden] [ref=e117]: ♥
                    - generic [aria-hidden] [ref=e118]: "5"
                  - img "4 of spades" [ref=e119]:
                    - generic [ref=e120]:
                      - text: "4"
                      - generic [aria-hidden] [ref=e121]: ♠
                    - generic [aria-hidden] [ref=e122]: ♠
                    - generic [aria-hidden] [ref=e123]: "4"
                - generic [ref=e124]:
                  - paragraph [ref=e125]:
                    - text: "Total:"
                    - strong [ref=e126]: "9"
                  - paragraph [ref=e127]: "Wager: 100 credits"
                  - paragraph [ref=e128]: Win
          - region "Seat 6" [ref=e129]:
            - generic [ref=e130]:
              - generic [ref=e131]:
                - 'img "Computer guest: Seraphine, Female Human Knight" [ref=e132]'
                - generic [ref=e133]:
                  - heading "Seraphine" [level=2] [ref=e134]
                  - paragraph [ref=e135]: Female Human Knight
                  - paragraph [ref=e136]: Seat 6 · Computer
              - group [ref=e137]:
                - article "Hand A" [ref=e138]:
                  - generic [ref=e139]:
                    - img "9 of hearts" [ref=e140]:
                      - generic [ref=e141]:
                        - text: "9"
                        - generic [aria-hidden] [ref=e142]: ♥
                      - generic [aria-hidden] [ref=e143]: ♥
                      - generic [aria-hidden] [ref=e144]: "9"
                    - img "6 of diamonds" [ref=e145]:
                      - generic [ref=e146]:
                        - text: "6"
                        - generic [aria-hidden] [ref=e147]: ♦
                      - generic [aria-hidden] [ref=e148]: ♦
                      - generic [aria-hidden] [ref=e149]: "6"
                    - img "K of spades" [ref=e150]:
                      - generic [ref=e151]:
                        - text: K
                        - generic [aria-hidden] [ref=e152]: ♠
                      - generic [aria-hidden] [ref=e153]: ♠
                      - generic [aria-hidden] [ref=e154]: K
                  - generic [ref=e155]:
                    - paragraph [ref=e156]: "25"
                    - paragraph [ref=e157]: Bust
                    - paragraph [ref=e158]: "MAIN: 25 credits"
      - region "Your gameplay controls" [ref=e159]:
        - status [ref=e161]: Round complete
        - region "Your round result" [ref=e162]:
          - paragraph [ref=e163]: "Net result: 100 credits"
          - generic [ref=e164]:
            - button "Deal Again" [ref=e165] [cursor=pointer]
            - button "Repeat Bet · 100 credits" [ref=e166] [cursor=pointer]
          - group [ref=e167]:
            - generic "Wager result details" [ref=e168] [cursor=pointer]
        - region "Your credits" [ref=e169]:
          - heading "Credits" [level=2] [ref=e170]
          - generic [ref=e171]:
            - generic [ref=e172]:
              - term [ref=e173]: Available
              - definition [ref=e174]: 1,100
            - generic [ref=e175]:
              - term [ref=e176]: Reserved / current exposure
              - definition [ref=e177]: "0"
            - generic [ref=e178]:
              - term [ref=e179]: Pending return
              - definition [ref=e180]: "0"
    - paragraph [ref=e181]: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools" [ref=e182]:
    - generic [ref=e183]:
      - paragraph [ref=e184]: 4 players · 1 human · 3 computer guests
      - button "New table · reset to 1000 credits" [ref=e185] [cursor=pointer]
    - generic [ref=e186]:
      - generic [ref=e187]:
        - checkbox "Reduce motion" [checked] [disabled] [ref=e188]
        - text: Reduce motion
      - paragraph [ref=e189]: Reduced motion is enabled by your device.
    - group [ref=e190]:
      - generic "Change Character · Roland" [ref=e191] [cursor=pointer]
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
    - group [ref=e192]:
      - generic "Developer / demo tools" [ref=e193] [cursor=pointer]
      - region "Demo and audit tools" [ref=e194]:
        - heading "Demo and audit tools" [level=2] [ref=e195]
        - paragraph [ref=e196]: "Profile: Classic Blackjack · Reproducible seeded demo"
        - paragraph [ref=e197]: "Player Mode: guests and dealer progress automatically."
        - button "Open manual demo (resets credits)" [ref=e198] [cursor=pointer]
        - group [ref=e199]:
          - generic "Advanced demo settings" [ref=e200] [cursor=pointer]
          - option "Classic Blackjack (v1.2 · Re-split Aces)" [selected]
          - option "Five-Card Charlie Demo (v1.2 · Re-split Aces)"
          - option "Classic Blackjack"
          - option "Five-Card Charlie Demo"
        - generic [ref=e201]:
          - paragraph [ref=e202]: Completed-session replay is available. Export includes deterministic seed information.
          - generic [ref=e203]:
            - button "Hide replay package" [ref=e204] [cursor=pointer]
            - button "Replay completed session" [active] [ref=e205] [cursor=pointer]
          - generic [ref=e206]: Completed replay JSON
          - textbox "Completed replay JSON" [ref=e207]: "{ \"replayVersion\": 1, \"configuration\": { \"seed\": 7, \"profileId\": \"CLASSIC_6D_S17_V1_2\", \"randomAlgorithm\": \"MULBERRY32_REJECTION_V1\", \"initialCreditUnits\": 2000, \"withHuman\": true, \"demoFaults\": false }, \"commands\": [ { \"sequence\": 1, \"command\": { \"type\": \"CONFIGURE\", \"seats\": [ { \"seatNumber\": 1, \"occupancy\": \"COMPUTER\", \"sittingOut\": false }, { \"seatNumber\": 2, \"occupancy\": \"EMPTY\", \"sittingOut\": false }, { \"seatNumber\": 3, \"occupancy\": \"COMPUTER\", \"sittingOut\": false }, { \"seatNumber\": 4, \"occupancy\": \"HUMAN\", \"sittingOut\": false }, { \"seatNumber\": 5, \"occupancy\": \"EMPTY\", \"sittingOut\": false }, { \"seatNumber\": 6, \"occupancy\": \"COMPUTER\", \"sittingOut\": false }, { \"seatNumber\": 7, \"occupancy\": \"EMPTY\", \"sittingOut\": false } ] } }, { \"sequence\": 2, \"command\": { \"type\": \"OPEN\" } }, { \"sequence\": 3, \"command\": { \"type\": \"MAIN\", \"seat\": 1, \"amount\": 50 } }, { \"sequence\": 4, \"command\": { \"type\": \"MAIN\", \"seat\": 3, \"amount\": 50 } }, { \"sequence\": 5, \"command\": { \"type\": \"MAIN\", \"seat\": 6, \"amount\": 50 } }, { \"sequence\": 6, \"command\": { \"type\": \"MAIN\", \"seat\": 4, \"amount\": 200 } }, { \"sequence\": 7, \"command\": { \"type\": \"CLOSE\" } }, { \"sequence\": 8, \"command\": { \"type\": \"ADVANCE\" } }, { \"sequence\": 9, \"command\": { \"type\": \"ACT\", \"action\": \"STAND\", \"handId\": \"round-1/seat-4\" } }, { \"sequence\": 10, \"command\": { \"type\": \"ADVANCE\" } }, { \"sequence\": 11, \"command\": { \"type\": \"SETTLE\" } } ], \"outcomeDigest\": \"fnv1a32-v1:b45ff462\" }"
          - button "Copy replay JSON" [ref=e208] [cursor=pointer]
          - status
        - region "Replay result" [ref=e209]:
          - heading "Replay mode · completed session" [level=3] [ref=e210]
          - paragraph [ref=e211]: "Original table results are preserved. Fingerprint: fnv1a32-v1:b45ff462"
          - generic [ref=e212]:
            - paragraph [ref=e213]: round-1
            - paragraph [ref=e214]: Win · Stake 25 · Returned 50
            - paragraph [ref=e215]: Win · Stake 25 · Returned 50
            - paragraph [ref=e216]: Win · Stake 100 · Returned 200
            - paragraph [ref=e217]: Loss · Stake 25 · Returned 0
        - group [ref=e218]:
          - generic "Public audit history (31 events)" [ref=e219] [cursor=pointer]
```

# Test source

```ts
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
  39  |   await expect(page.locator('.audit-list li')).toHaveCount(1);
  40  |   await expect(page.locator('.audit-list li')).toContainText('#1 system · SESSION_START · ACCEPTED');
  41  |   await expect(page.locator('[data-seat-anchor]')).toHaveCount(0);
  42  |   await capture(page, info, '01-setup-generic');
  43  | });
  44  | for (const count of [1, 4, 7]) test(`[PRE-T11-B02-${count}] eligible Celestine remains formal through active and complete ${count}-player rounds`, async ({ page }, info) => {
  45  |   await page.goto('/?fixture=player-setup'); await start(page, count);
  46  |   const dealer = await portrait(page, 'Dealer: Celestine'); await expect(dealer).toHaveAttribute('data-dealer-character', 'noble_female');
  47  |   await deal(page); await capture(page, info, `02-table-${count}-waiting`); await finish(page);
  48  |   await portrait(page, 'Dealer: Celestine'); await capture(page, info, `03-table-${count}-complete`);
  49  |   await page.getByRole('button', { name: 'Deal Again', exact: true }).click(); await portrait(page, 'Dealer: Celestine');
  50  |   await deal(page); await finish(page); await page.getByRole('button', { name: 'New table · reset to 1000 credits', exact: true }).click();
  51  |   await portrait(page, generic); await start(page, 1); await portrait(page, 'Dealer: Seraphine');
  52  |   await capture(page, info, `04-rotated-Seraphine-after-${count}`);
  53  | });
  54  | test('[PRE-T11-B03] seated Celestine selects eligible Seraphine while retaining the human identity', async ({ page }, info) => {
  55  |   await page.goto('/?fixture=player-setup'); await page.locator('.character-picker summary').click();
  56  |   await page.getByLabel('Your character', { exact: true }).selectOption('noble_female'); await start(page, 4);
  57  |   await portrait(page, 'Dealer: Seraphine'); await expect(page.locator('#player-hand')).toHaveAttribute('data-character', 'noble_female');
  58  |   await capture(page, info, '05-collision-Seraphine');
  59  | });
  60  | test('[PRE-T11-B04] all approved identities seated use only the non-roster generic without replacing any player', async ({ page }, info) => {
  61  |   await page.goto('/?fixture=player-setup');
  62  |   await page.locator('#root').evaluate(async root => {
  63  |     const app = '/src/ui/App.tsx', controller = '/src/browser/controller.ts', registry = '/src/presentation/formalDealers.ts', react = '/node_modules/.vite/deps/react.js', dom = '/node_modules/.vite/deps/react-dom_client.js';
  64  |     const { App } = await import(app), { createBrowserController } = await import(controller), { FORMAL_DEALER_CONFIGURATION } = await import(registry), { default: React } = await import(react), { default: ReactDOM } = await import(dom);
  65  |     const ids = ['elf_male', 'elf_female', 'knight_male', 'knight_female', 'mage_male', 'mage_female', 'noble_male', 'noble_female', 'halforc_male', 'halforc_female', 'dwarf_male', 'dwarf_female'];
  66  |     const picks = ['knight_female', 'mage_female', 'elf_female', 'halforc_female', 'elf_male', 'dwarf_male'];
  67  |     const choose = (n: number) => { const available = ids.filter(id => id !== 'noble_female'), index = 11 - n; for (let i = 0; i < index; i++) available.splice(available.indexOf(picks[i]), 1); return available.indexOf(picks[index]); };
  68  |     const mount = document.createElement('div'); root.replaceChildren(mount);
  69  |     ReactDOM.createRoot(mount).render(React.createElement(App, { controller: createBrowserController({ playerMode: true, deferPlayerStart: true, seed: 7 }), chooseCharacter: choose, dealerConfiguration: FORMAL_DEALER_CONFIGURATION }));
  70  |   });
  71  |   await page.locator('.character-picker summary').click(); await page.getByLabel('Your character', { exact: true }).selectOption('noble_female');
  72  |   await start(page, 7); const dealer = await portrait(page, generic); expect(await dealer.getAttribute('data-dealer-character')).toBeNull();
  73  |   const ids = await page.locator('[data-seat-anchor]').evaluateAll(els => els.map(el => el.getAttribute('data-character')));
  74  |   expect(new Set(ids).size).toBe(7); for (const id of ['noble_female', 'knight_female', 'mage_female', 'elf_female', 'halforc_female']) expect(ids).toContain(id);
  75  |   await deal(page); await capture(page, info, '06-all-pool-seated-generic'); await finish(page);
  76  | });
  77  | for (const emergency of [false, true]) test(`[PRE-T11-B05-${emergency}] failed roster image falls through ${emergency ? 'to neutral text when both images fail' : 'to decoded generic PNG'}`, async ({ page }, info) => {
  78  |   await page.route(emergency ? '**/characters/dealer/**/formal.png' : '**/characters/dealer/noble_female/formal.png', route => route.abort());
  79  |   await page.goto('/?fixture=player'); await portrait(page, emergency ? 'Dealer portrait unavailable' : generic);
  80  |   if (emergency) await expect(page.locator('.dealer-zone img')).toHaveCount(0);
  81  |   await deal(page); await expect(page.getByRole('button', { name: 'Stand', exact: true })).toBeEnabled();
  82  |   await capture(page, info, `07-image-failure-${emergency ? 'neutral' : 'generic'}`); await finish(page);
  83  | });
  84  | for (const [mode, width, height] of [['REDUCED_MOTION', 768, 1024], ['IMMEDIATE', 320, 720]] as const) test(`[PRE-T11-B06-${mode}] responsive generic fallback and terminal replay preserve live audit/cards`, async ({ page }, info) => {
  85  |   await page.emulateMedia({ reducedMotion: mode === 'IMMEDIATE' ? 'no-preference' : 'reduce' });
  86  |   await page.setViewportSize({ width, height }); await page.goto(`/?fixture=player&dealer=legacy&motion=${mode}`);
  87  |   await portrait(page, generic); await deal(page); await finish(page);
  88  |   await expect(page.locator('.game-scene')).toHaveAttribute('data-presentation-mode', mode);
  89  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  90  |   const audit = await page.locator('.audit-list li').allTextContents(), cards = await page.locator('.dealer-card-lane').innerHTML();
  91  |   const credits = await page.getByRole('region', { name: 'Your credits', exact: true }).innerHTML();
  92  |   await page.getByText('Developer / demo tools', { exact: true }).click();
  93  |   await page.getByRole('button', { name: 'View replay package', exact: true }).click();
  94  |   const replay = JSON.parse(await page.getByLabel('Completed replay JSON', { exact: true }).inputValue());
  95  |   expect(JSON.stringify(replay)).not.toMatch(/generic_female|formal\.png|characterId/);
  96  |   await page.getByRole('button', { name: 'Replay completed session', exact: true }).click();
  97  |   await expect(page.getByRole('region', { name: 'Replay result', exact: true })).toBeVisible();
  98  |   const after = await page.locator('.audit-list li').allTextContents();
  99  |   expect(after.slice(0, audit.length)).toEqual(audit); expect(after).toHaveLength(audit.length + 2);
  100 |   expect(after[audit.length]).toContain('REPLAY_START'); expect(after[audit.length + 1]).toContain('REPLAY_COMPLETE');
  101 |   expect(await page.locator('.dealer-card-lane').innerHTML()).toBe(cards);
  102 |   expect(await page.getByRole('region', { name: 'Your credits', exact: true }).innerHTML()).toBe(credits);
> 103 |   await page.getByRole('button', { name: 'View replay package', exact: true }).click();
      |                                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  104 |   expect(JSON.parse(await page.getByLabel('Completed replay JSON', { exact: true }).inputValue())).toEqual(replay);
  105 |   await portrait(page, generic); await capture(page, info, `08-${width}-${mode}-replay`);
  106 | });
  107 | test('[PRE-T11-B07] full motion Dealer remains formal at paused initial deal and real public reveal', async ({ page }, info) => {
  108 |   await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/?fixture=player-dealer-multi'); await portrait(page, 'Dealer: Celestine');
  109 |   await page.evaluate(() => {
  110 |     const observer = new MutationObserver(() => {
  111 |       const flight = document.querySelector('[data-initial-deal-flight]');
  112 |       if (flight) { flight.getAnimations({ subtree: true }).forEach(animation => animation.pause()); observer.disconnect(); }
  113 |     }); observer.observe(document.body, { childList: true, subtree: true });
  114 |   });
  115 |   await deal(page); await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'DEALING');
  116 |   await portrait(page, 'Dealer: Celestine');
  117 |   const pixels = async (name: string) => { const cdp = await page.context().newCDPSession(page); const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true }); await cdp.detach(); writeFileSync(info.outputPath(name + '.png'), Buffer.from(shot.data, 'base64')); };
  118 |   await pixels('09-active-DEALING'); await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  119 |   await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'WAITING_PLAYER');
  120 |   await page.evaluate(() => { const observer = new MutationObserver(() => { const card = document.querySelector('[data-dealer-reveal]'); if (card) { card.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 35; }); observer.disconnect(); } }); observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-dealer-reveal'] }); });
  121 |   await page.getByRole('button', { name: 'Stand', exact: true }).click(); await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'REVEALING');
  122 |   await portrait(page, 'Dealer: Celestine'); await pixels('10-active-REVEALING');
  123 |   await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  124 |   await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toBeVisible();
  125 |   await capture(page, info, '11-motion-complete');
  126 | });
  127 | 
```