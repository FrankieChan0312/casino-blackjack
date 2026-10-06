# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10.spec.ts >> [M10A-E06] real five-card two-split and four-leaf local HUDs preserve exact ownership across widths and200percent text
- Location: tests\browser\m10.spec.ts:343:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.casino-table')
    - locator resolved to visible <section data-player-count="4" data-dynamic-seats="true" data-felt-markings="true" aria-label="Blackjack table" class="table-surface casino-table">…</section>

```

# Page snapshot

```yaml
- main [ref=f8e3]:
  - link "Skip to your hand and actions" [ref=f8e4] [cursor=pointer]:
    - /url: "#player-decisions"
  - region "Blackjack game scene" [ref=f8e5]:
    - generic [ref=f8e6]:
      - heading "Casino Blackjack" [level=1] [ref=f8e8]
      - paragraph [ref=f8e9]: Simulation credits only — no real-money gambling.Credits have no redemption value.
    - generic [ref=f8e10]:
      - region "Blackjack table" [ref=f8e11]:
        - region "Dealer" [ref=f8e12]:
          - 'img "Dealer: Celestine" [ref=f8e13]'
          - heading "Dealer" [level=2] [ref=f8e14]
          - group "Dealer hand" [ref=f8e15]:
            - generic [ref=f8e17]:
              - img "9 of clubs" [ref=f8e18]:
                - generic [ref=f8e19]:
                  - text: "9"
                  - generic [aria-hidden] [ref=f8e20]: ♣
                - generic [aria-hidden] [ref=f8e21]: ♣
                - generic [aria-hidden] [ref=f8e22]: "9"
              - img "8 of diamonds" [ref=f8e23]:
                - generic [ref=f8e24]:
                  - text: "8"
                  - generic [aria-hidden] [ref=f8e25]: ♦
                - generic [aria-hidden] [ref=f8e26]: ♦
                - generic [aria-hidden] [ref=f8e27]: "8"
            - paragraph [ref=f8e28]: "Total: 17"
            - paragraph [ref=f8e29]: Dealer complete
          - group "Shoe and deal origin" [ref=f8e30]:
            - paragraph [ref=f8e32]:
              - text: Shoe · Deal origin
              - generic [ref=f8e33]: 6 decks
          - paragraph [ref=f8e34]:
            - text: BLACKJACK PAYS 3:2
            - generic [ref=f8e35]: DEALER STANDS ON ALL 17
        - generic [ref=f8e36]:
          - region "Seat 1" [ref=f8e37]:
            - generic [ref=f8e38]:
              - generic [ref=f8e39]:
                - 'img "Computer guest: Caelan, Male Elf" [ref=f8e40]'
                - generic [ref=f8e41]:
                  - heading "Caelan" [level=2] [ref=f8e42]
                  - paragraph [ref=f8e43]: Male Elf
                  - paragraph [ref=f8e44]: Seat 1 · Computer
              - paragraph [ref=f8e45]: "MAIN: 25 credits"
              - group [ref=f8e46]:
                - generic "Cards · 17" [ref=f8e47] [cursor=pointer]
          - region "Seat 3" [ref=f8e48]:
            - generic [ref=f8e49]:
              - generic [ref=f8e50]:
                - 'img "Computer guest: Elaria, Female Elf" [ref=f8e51]'
                - generic [ref=f8e52]:
                  - heading "Elaria" [level=2] [ref=f8e53]
                  - paragraph [ref=f8e54]: Female Elf
                  - paragraph [ref=f8e55]: Seat 3 · Computer
              - paragraph [ref=f8e56]: "MAIN: 25 credits"
              - group [ref=f8e57]:
                - generic "Cards · 17" [ref=f8e58] [cursor=pointer]
          - region "Seat 4" [ref=f8e59]:
            - group "Your player HUD" [ref=f8e60]:
              - generic [ref=f8e61]:
                - generic [ref=f8e62]:
                  - 'img "Your avatar: Roland, Male Human Knight" [ref=f8e63]'
                  - generic [ref=f8e64]:
                    - paragraph [ref=f8e65]: YOU
                    - heading "Roland" [level=2] [ref=f8e66]
                    - paragraph [ref=f8e67]: Male Human Knight
                    - paragraph [ref=f8e68]: Seat 4 · You · Human
                - paragraph [ref=f8e69]: "MAIN: 100 credits"
              - generic [ref=f8e70]:
                - article "Hand A.1.1" [ref=f8e71]:
                  - heading "Hand A.1.1" [level=3] [ref=f8e73]
                  - generic [ref=f8e74]:
                    - img "A of hearts" [ref=f8e75]:
                      - generic [ref=f8e76]:
                        - text: A
                        - generic [aria-hidden] [ref=f8e77]: ♥
                      - generic [aria-hidden] [ref=f8e78]: ♥
                      - generic [aria-hidden] [ref=f8e79]: A
                    - img "A of clubs" [ref=f8e80]:
                      - generic [ref=f8e81]:
                        - text: A
                        - generic [aria-hidden] [ref=f8e82]: ♣
                      - generic [aria-hidden] [ref=f8e83]: ♣
                      - generic [aria-hidden] [ref=f8e84]: A
                  - generic [ref=f8e85]:
                    - paragraph [ref=f8e86]:
                      - text: "Total:"
                      - strong [ref=f8e87]: "12"
                    - paragraph [ref=f8e88]: "Wager: 100 credits"
                    - paragraph [ref=f8e89]: Loss
                - article "Hand A.1.2" [ref=f8e90]:
                  - heading "Hand A.1.2" [level=3] [ref=f8e92]
                  - generic [ref=f8e93]:
                    - img "A of spades" [ref=f8e94]:
                      - generic [ref=f8e95]:
                        - text: A
                        - generic [aria-hidden] [ref=f8e96]: ♠
                      - generic [aria-hidden] [ref=f8e97]: ♠
                      - generic [aria-hidden] [ref=f8e98]: A
                    - img "A of diamonds" [ref=f8e99]:
                      - generic [ref=f8e100]:
                        - text: A
                        - generic [aria-hidden] [ref=f8e101]: ♦
                      - generic [aria-hidden] [ref=f8e102]: ♦
                      - generic [aria-hidden] [ref=f8e103]: A
                  - generic [ref=f8e104]:
                    - paragraph [ref=f8e105]:
                      - text: "Total:"
                      - strong [ref=f8e106]: "12"
                    - paragraph [ref=f8e107]: "Wager: 100 credits"
                    - paragraph [ref=f8e108]: Loss
                - article "Hand A.2" [ref=f8e109]:
                  - heading "Hand A.2" [level=3] [ref=f8e111]
                  - generic [ref=f8e112]:
                    - img "A of hearts" [ref=f8e113]:
                      - generic [ref=f8e114]:
                        - text: A
                        - generic [aria-hidden] [ref=f8e115]: ♥
                      - generic [aria-hidden] [ref=f8e116]: ♥
                      - generic [aria-hidden] [ref=f8e117]: A
                    - img "A of hearts" [ref=f8e118]:
                      - generic [ref=f8e119]:
                        - text: A
                        - generic [aria-hidden] [ref=f8e120]: ♥
                      - generic [aria-hidden] [ref=f8e121]: ♥
                      - generic [aria-hidden] [ref=f8e122]: A
                  - generic [ref=f8e123]:
                    - paragraph [ref=f8e124]:
                      - text: "Total:"
                      - strong [ref=f8e125]: "12"
                    - paragraph [ref=f8e126]: "Wager: 100 credits"
                    - paragraph [ref=f8e127]: Loss
                - article "Hand B" [ref=f8e128]:
                  - heading "Hand B" [level=3] [ref=f8e130]
                  - generic [ref=f8e131]:
                    - img "A of spades" [ref=f8e132]:
                      - generic [ref=f8e133]:
                        - text: A
                        - generic [aria-hidden] [ref=f8e134]: ♠
                      - generic [aria-hidden] [ref=f8e135]: ♠
                      - generic [aria-hidden] [ref=f8e136]: A
                    - img "A of spades" [ref=f8e137]:
                      - generic [ref=f8e138]:
                        - text: A
                        - generic [aria-hidden] [ref=f8e139]: ♠
                      - generic [aria-hidden] [ref=f8e140]: ♠
                      - generic [aria-hidden] [ref=f8e141]: A
                  - generic [ref=f8e142]:
                    - paragraph [ref=f8e143]:
                      - text: "Total:"
                      - strong [ref=f8e144]: "12"
                    - paragraph [ref=f8e145]: "Wager: 100 credits"
                    - paragraph [ref=f8e146]: Loss
          - region "Seat 6" [ref=f8e147]:
            - generic [ref=f8e148]:
              - generic [ref=f8e149]:
                - 'img "Computer guest: Seraphine, Female Human Knight" [ref=f8e150]'
                - generic [ref=f8e151]:
                  - heading "Seraphine" [level=2] [ref=f8e152]
                  - paragraph [ref=f8e153]: Female Human Knight
                  - paragraph [ref=f8e154]: Seat 6 · Computer
              - paragraph [ref=f8e155]: "MAIN: 25 credits"
              - group [ref=f8e156]:
                - generic "Cards · 17" [ref=f8e157] [cursor=pointer]
      - region "Your gameplay controls" [ref=f8e158]:
        - status [ref=f8e160]: Round complete
        - region "Your round result" [active] [ref=f8e161]:
          - paragraph [ref=f8e162]: "Net result: -400 credits"
          - generic [ref=f8e163]:
            - button "Deal Again" [ref=f8e164] [cursor=pointer]
            - button "Repeat Bet · 100 credits" [ref=f8e165] [cursor=pointer]
          - group [ref=f8e166]:
            - generic "Wager result details" [ref=f8e167] [cursor=pointer]
        - region "Your credits" [ref=f8e168]:
          - heading "Credits" [level=2] [ref=f8e169]
          - generic [ref=f8e170]:
            - generic [ref=f8e171]:
              - term [ref=f8e172]: Available
              - definition [ref=f8e173]: "600"
            - generic [ref=f8e174]:
              - term [ref=f8e175]: Reserved / current exposure
              - definition [ref=f8e176]: "0"
            - generic [ref=f8e177]:
              - term [ref=f8e178]: Pending return
              - definition [ref=f8e179]: "0"
    - paragraph [ref=f8e180]: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools" [ref=f8e181]:
    - generic [ref=f8e182]:
      - paragraph [ref=f8e183]: 4 players · 1 human · 3 computer guests
      - button "New table · reset to 1000 credits" [ref=f8e184] [cursor=pointer]
    - generic [ref=f8e185]:
      - generic [ref=f8e186]:
        - checkbox "Reduce motion" [checked] [disabled] [ref=f8e187]
        - text: Reduce motion
      - paragraph [ref=f8e188]: Reduced motion is enabled by your device.
    - group [ref=f8e189]:
      - generic "Change Character · Roland" [ref=f8e190] [cursor=pointer]
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
    - group [ref=f8e191]:
      - generic "Developer / demo tools" [ref=f8e192] [cursor=pointer]
      - option "Classic Blackjack (v1.2 · Re-split Aces)" [selected]
      - option "Five-Card Charlie Demo (v1.2 · Re-split Aces)"
      - option "Classic Blackjack"
      - option "Five-Card Charlie Demo"
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import { copyFileSync, writeFileSync } from 'node:fs';
  3   | import { seatFacts, fiveCardHand, splitHands } from '../m10/seatFixtures.js';
  4   | 
  5   | const viewports = [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 320, height: 720 }];
  6   | async function deal(page: Page, fixture = 'player') {
  7   |   await page.goto(`/?fixture=${fixture}`);
  8   |   await page.getByLabel('Your main wager', { exact: false }).fill('100');
  9   |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  10  | }
  11  | async function geometry(page: Page) {
> 12  |   const data = await page.locator('.casino-table').evaluate(table => {
      |                                                    ^ Error: locator.evaluate: Test timeout of 30000ms exceeded.
  13  |     const rect = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
  14  |     const anchors = [...table.querySelectorAll('.dealer, .seat')].map(el => ({ label: el.getAttribute('aria-label'), ...rect(el) }));
  15  |     return { table: rect(table), anchors, viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth };
  16  |   });
  17  |   expect(data.scrollWidth).toBeLessThanOrEqual(data.viewport.width);
  18  |   const dealer = data.anchors[0];
  19  |   expect(Math.abs(dealer.x + dealer.width / 2 - data.viewport.width / 2)).toBeLessThan(2);
  20  |   for (let i = 0; i < data.anchors.length; i++) {
  21  |     const a = data.anchors[i];
  22  |     expect(a.x, a.label!).toBeGreaterThanOrEqual(data.table.x);
  23  |     expect(a.x + a.width, a.label!).toBeLessThanOrEqual(data.table.x + data.table.width);
  24  |     for (const b of data.anchors.slice(i + 1)) {
  25  |       expect(a.x + a.width <= b.x + 1 || b.x + b.width <= a.x + 1 || a.y + a.height <= b.y + 1 || b.y + b.height <= a.y + 1,
  26  |         `${a.label} intersects ${b.label}`).toBe(true);
  27  |     }
  28  |   }
  29  |   for (const cards of await page.locator('.seat article .cards:visible').all()) {
  30  |     expect(await cards.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  31  |   }
  32  |   return data;
  33  | }
  34  | 
  35  | test('[M10-E01] current casino table anchors retain public players and usable controls at three viewports', async ({ page }) => {
  36  |   const receipts = [];
  37  |   for (const viewport of viewports) {
  38  |     await page.setViewportSize(viewport); await deal(page); await page.evaluate(() => scrollTo(0, 0));
  39  |     await expect(page.locator('[data-anchor="dealer-cards"]')).toBeVisible();
  40  |     await expect(page.locator('[data-anchor="table-centre"]')).toBeVisible();
  41  |     expect(await page.locator('[data-seat-anchor]').evaluateAll(els => els.map(el => el.getAttribute('data-seat-anchor')))).toEqual(['seat-1','seat-3','seat-4','seat-6']);
  42  |     await expect(page.getByRole('img', { name: 'Hidden dealer card', exact: true })).toBeVisible();
  43  |     receipts.push(await geometry(page));
  44  |     for (const name of ['Hit','Stand','Double','Split','Surrender']) {
  45  |       const button = page.getByRole('button', { name, exact: true });
  46  |       const box = (await button.boundingBox())!;
  47  |       expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
  48  |     }
  49  |     const stand = page.getByRole('button', { name: 'Stand', exact: true });
  50  |     if (viewport.width === 1280) { const box = (await stand.boundingBox())!; expect(box.y + box.height).toBeLessThanOrEqual(900); }
  51  |     await page.screenshot({ path: `docs/M10_T01_EVIDENCE/table-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
  52  |     await stand.click(); await expect(page.locator('#player-result')).toBeFocused();
  53  |     await page.getByRole('button', { name: 'Deal Again', exact: true }).click();
  54  |     await expect(page.getByLabel('Your main wager', { exact: false })).toBeFocused();
  55  |   }
  56  |   writeFileSync('docs/M10_T01_EVIDENCE/geometry.json', JSON.stringify(receipts, null, 2) + '\n');
  57  | });
  58  | 
  59  | test('[M10-E02] five actual cards and four actual split leaves use vertical flow without overlapping seat regions', async ({ page }) => {
  60  |   for (const viewport of viewports) {
  61  |     await page.setViewportSize(viewport); await deal(page, 'player-five');
  62  |     for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Hit', exact: true }).click();
  63  |     await expect(page.locator('#player-hand article .card')).toHaveCount(5); await geometry(page);
  64  |     await page.screenshot({ path: `docs/M10_T01_EVIDENCE/five-cards-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
  65  |     await page.getByRole('button', { name: 'Stand', exact: true }).click(); await expect(page.locator('#player-result')).toBeFocused();
  66  |     await deal(page, 'player-rsa-cap');
  67  |     for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Split', exact: true }).click();
  68  |     await expect(page.locator('#player-hand article')).toHaveCount(4); await geometry(page);
  69  |     const ids = await page.locator('#player-hand article').evaluateAll(els => els.map(el => el.getAttribute('data-hand-id')));
  70  |     expect(new Set(ids).size).toBe(4);
  71  |     await page.screenshot({ path: `docs/M10_T01_EVIDENCE/four-leaves-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
  72  |     await expect(page.getByRole('button', { name: 'Deal Again', exact: true })).toBeEnabled();
  73  |   }
  74  | });
  75  | 
  76  | test('[M10-E03] enlarged text failed portraits and reduced motion keep identity cards and keyboard decisions accessible', async ({ page }) => {
  77  |   await page.emulateMedia({ reducedMotion: 'reduce' });
  78  |   await page.route('**/characters/*.png', route => route.abort());
  79  |   for (const viewport of viewports) {
  80  |     await page.setViewportSize(viewport); await deal(page);
  81  |     await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  82  |     await expect(page.locator('#player-hand').getByRole('heading', { name: 'Roland', exact: true })).toBeVisible();
  83  |     await expect(page.locator('#player-hand .character-identity img')).toHaveJSProperty('naturalWidth', 0);
  84  |     await geometry(page);
  85  |     if (viewport.width === 320) {
  86  |       const guest = page.getByRole('region', { name: 'Seat 1', exact: true });
  87  |       await guest.locator('summary').click();
  88  |       await expect(guest.locator('.guest-mobile-cards .card').first()).toBeVisible(); await geometry(page);
  89  |     }
  90  |     await page.screenshot({ path: `docs/M10_T01_EVIDENCE/text-fallback-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
  91  |     await page.locator('#player-hand').focus();
  92  |     const stand = page.getByRole('button', { name: 'Stand', exact: true });
  93  |     for (let i = 0; i < 8 && !await stand.evaluate(el => el === document.activeElement); i++) await page.keyboard.press('Tab');
  94  |     await expect(stand).toBeFocused();
  95  |     expect(await stand.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  96  |     expect(await page.locator('#player-hand .card').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  97  |     await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
  98  |   }
  99  | });
  100 | 
  101 | test('[M10-E04] the table scene owns coherent local cards controls and exact credits through betting and play', async ({ page }, info) => {
  102 |   for (const viewport of viewports) {
  103 |     await page.setViewportSize(viewport); await page.goto('/?fixture=player');
  104 |     const scene = page.locator('.table-scene');
  105 |     await expect(scene.getByRole('region', { name: 'Your wager', exact: true })).toBeVisible();
  106 |     const save = async (state: string) => {
  107 |       const filename = `scene-${state}-${viewport.width}.png`, path = info.outputPath(filename);
  108 |       await page.screenshot({ path, fullPage: true, animations: 'disabled' });
  109 |       copyFileSync(path, `docs/M10_T01_EVIDENCE/repair09/${filename}`);
  110 |     };
  111 |     await page.evaluate(() => scrollTo(0, 0)); await save('open');
  112 |     await page.getByLabel('Your main wager', { exact: false }).fill('100');
```