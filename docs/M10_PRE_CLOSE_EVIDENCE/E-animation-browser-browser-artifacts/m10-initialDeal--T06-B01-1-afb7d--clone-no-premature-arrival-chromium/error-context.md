# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\initialDeal.spec.ts >> [T06-B01-1] real FULL_MOTION two-pass order, one clone, no premature arrival
- Location: tests\browser\m10\initialDeal.spec.ts:40:30

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "1"
Received: ""
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
          - 'img "Dealer: Celestine" [ref=e13]'
          - heading "Dealer" [level=2] [ref=e14]
          - group "Dealer hand" [ref=e15]:
            - generic [ref=e16]:
              - img "A of hearts" [ref=e18]:
                - generic [ref=e19]:
                  - text: A
                  - generic [aria-hidden] [ref=e20]: ♥
                - generic [aria-hidden] [ref=e21]: ♥
                - generic [aria-hidden] [ref=e22]: A
              - img "Hidden dealer card" [ref=e23]: ◆
            - paragraph [ref=e24]: "Visible total: 11"
            - paragraph [ref=e25]: Hole card hidden
          - group "Shoe and deal origin" [ref=e26]:
            - paragraph [ref=e28]:
              - text: Shoe · Deal origin
              - generic [ref=e29]: 6 decks
          - paragraph [ref=e30]:
            - text: BLACKJACK PAYS 3:2
            - generic [ref=e31]: DEALER STANDS ON ALL 17
        - region "Seat 4" [ref=e33]:
          - group "Your player HUD" [ref=e34]:
            - generic [ref=e35]:
              - generic [ref=e36]:
                - 'img "Your avatar: Roland, Male Human Knight" [ref=e37]'
                - generic [ref=e38]:
                  - paragraph [ref=e39]: YOU
                  - heading "Roland" [level=2] [ref=e40]
                  - paragraph [ref=e41]: Male Human Knight
                  - paragraph [ref=e42]: Seat 4 · You · Human
              - paragraph [ref=e43]: "MAIN: 100 credits"
            - article "Hand A" [ref=e45]:
              - heading "Hand A" [level=3] [ref=e47]
              - generic [ref=e48]:
                - img "J of hearts" [ref=e49]:
                  - generic [ref=e50]:
                    - text: J
                    - generic [aria-hidden] [ref=e51]: ♥
                  - generic [aria-hidden] [ref=e52]: ♥
                  - generic [aria-hidden] [ref=e53]: J
                - img "5 of hearts" [ref=e54]:
                  - generic [ref=e55]:
                    - text: "5"
                    - generic [aria-hidden] [ref=e56]: ♥
                  - generic [aria-hidden] [ref=e57]: ♥
                  - generic [aria-hidden] [ref=e58]: "5"
              - generic [ref=e59]:
                - paragraph [ref=e60]:
                  - text: "Total:"
                  - strong [ref=e61]: "15"
                - paragraph [ref=e62]: "Wager: 100 credits"
                - paragraph [ref=e63]: Playing
      - region "Your gameplay controls" [ref=e64]:
        - status [ref=e66]: Insurance / Even Money decision
        - region "Insurance decision" [active] [ref=e67]:
          - paragraph [ref=e68]:
            - generic [ref=e69]: Dealer shows Ace.
            - generic [ref=e70]: "Your MAIN · Seat 4 · Insurance amount: 50 credits"
          - generic [ref=e71]:
            - button "Buy Insurance" [ref=e72] [cursor=pointer]
            - button "Decline" [ref=e73] [cursor=pointer]
          - group [ref=e74]:
            - generic "Insurance and Even Money explained" [ref=e75] [cursor=pointer]
        - region "Your credits" [ref=e76]:
          - heading "Credits" [level=2] [ref=e77]
          - generic [ref=e78]:
            - generic [ref=e79]:
              - term [ref=e80]: Available
              - definition [ref=e81]: "900"
            - generic [ref=e82]:
              - term [ref=e83]: Reserved / current exposure
              - definition [ref=e84]: "100"
            - generic [ref=e85]:
              - term [ref=e86]: Pending return
              - definition [ref=e87]: "0"
        - generic [aria-hidden] [ref=e88]: Insurance wager
    - paragraph [ref=e89]: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools" [ref=e90]:
    - generic [ref=e91]:
      - paragraph [ref=e92]: 1 players · 1 human · 0 computer guests
      - button "New table · reset to 1000 credits" [disabled] [ref=e93]
    - generic [ref=e95]:
      - checkbox "Reduce motion" [ref=e96]
      - text: Reduce motion
    - group [ref=e97]:
      - generic "Change Character · Roland" [ref=e98] [cursor=pointer]
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
    - group [ref=e99]:
      - generic "Developer / demo tools" [ref=e100] [cursor=pointer]
      - option "Classic Blackjack" [selected]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import { writeFileSync, mkdirSync } from 'node:fs';
  3   | import { Buffer } from 'node:buffer';
  4   | 
  5   | test.use({ reducedMotion: 'no-preference' });
  6   | const seats: Record<number, number[]> = { 1: [4], 4: [1,3,4,6], 7: [1,2,3,4,5,6,7] };
  7   | type Trace = { arrivals: string[]; flights: string[]; duplicate: boolean; overlap: boolean; started: number; finished: number; paused: boolean; checkpoints: string[]; interruptions: string[]; pauseStates: string[][] };
  8   | async function setup(page: Page, count: number) {
  9   |   await page.goto('/?fixture=player-setup');
  10  |   await page.getByLabel('Total players', { exact: true }).selectOption(String(count));
  11  |   await page.getByRole('button', { name: 'Start table', exact: true }).click();
  12  |   await page.getByLabel('Your main wager', { exact: false }).fill('100');
  13  | }
  14  | async function observe(page: Page, checkpoints: string[] = []) {
  15  |   await page.evaluate(checkpoints => {
  16  |     const trace: Trace = { arrivals: [], flights: [], duplicate: false, overlap: false, started: performance.now(), finished: 0, paused: false, checkpoints, interruptions: [], pauseStates: [] };
  17  |     (window as unknown as { dealTrace: Trace }).dealTrace = trace;
  18  |     window.addEventListener('resize', () => trace.interruptions.push('resize'));
  19  |     document.addEventListener('visibilitychange', () => trace.interruptions.push(`visibility:${document.hidden}`));
  20  |     new MutationObserver(records => {
  21  |       for (const record of records) for (const node of record.addedNodes) if (node instanceof HTMLElement && node.dataset.initialDealFlight) {
  22  |         const target = node.dataset.dealTarget!;
  23  |         if (trace.flights.includes(target)) trace.duplicate = true;
  24  |         trace.flights.push(target);
  25  |         trace.overlap ||= document.querySelectorAll('[data-initial-deal-flight]').length > 1;
  26  |         if (trace.checkpoints.includes(target)) {
  27  |           const animations = node.getAnimations({ subtree: true }); animations.forEach(animation => animation.pause()); trace.paused = true;
  28  |           trace.pauseStates.push(animations.map(animation => animation.playState));
  29  |         }
  30  |       }
  31  |       for (const element of document.querySelectorAll<HTMLElement>('[data-card-slot][data-deal-visible="true"]')) {
  32  |         const key = element.dataset.cardSlot!;
  33  |         if (Number(key.slice(key.lastIndexOf(':') + 1)) < 2 && !trace.arrivals.includes(key)) trace.arrivals.push(key);
  34  |       }
  35  |       if (document.querySelector('[data-initial-deal-running="false"]') && trace.flights.length) trace.finished = performance.now();
  36  |     }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-deal-visible','data-initial-deal-running'] });
  37  |   }, checkpoints);
  38  | }
  39  | const trace = (page: Page) => page.evaluate(() => (window as unknown as { dealTrace: Trace }).dealTrace);
  40  | for (const count of [1,4,7]) test(`[T06-B01-${count}] real FULL_MOTION two-pass order, one clone, no premature arrival`, async ({ page }, info) => {
  41  |   await setup(page, count); await observe(page);
  42  |   const dealer = await page.locator('[data-dealer-character]').getAttribute('data-dealer-character');
  43  |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  44  |   await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
  45  |   await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'DEALING');
> 46  |   expect(await page.locator('[data-initial-deal-flight] .card').evaluate(element => getComputedStyle(element).opacity)).toBe('1');
      |                                                                                                                         ^ Error: expect(received).toBe(expected) // Object.is equality
  47  |   await expect(page.locator('[data-card-slot][data-deal-visible="true"]')).toHaveCount(0);
  48  |   await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  49  |   const result = await trace(page), order = [0,1].flatMap(index => [...seats[count].map(seat => `round-1/seat-${seat}:${index}`), `dealer:${index}`]);
  50  |   expect(result.flights).toEqual(order); expect(result.arrivals).toEqual(order);
  51  |   expect(result.duplicate).toBe(false); expect(result.overlap).toBe(false);
  52  |   expect(result.finished - result.started).toBeLessThan(4000);
  53  |   await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  54  |   await expect(page.getByRole('img', { name: 'Hidden dealer card', exact: true })).toHaveCount(1);
  55  |   await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-character', dealer!);
  56  |   writeFileSync(info.outputPath('sequence.json'), JSON.stringify(result, null, 2));
  57  | });
  58  | 
  59  | for (const [count,width,height] of [[1,1280,900],[4,1280,900],[7,1280,900],[7,768,1024],[7,320,720]]) test(`[T06-B02-${count}-${width}] checkpoint captures actual start/first/second/settled`, async ({ page }, info) => {
  60  |   const root = 'docs/M10_T06_EVIDENCE/screenshots'; mkdirSync(root, { recursive: true });
  61  |     await page.setViewportSize({ width, height }); await setup(page, count);
  62  |     const checkpoints = count === 1 ? ['round-1/seat-4:0','dealer:0','round-1/seat-4:1','dealer:1']
  63  |       : [`round-1/seat-${seats[count][0]}:0`, `round-1/seat-${seats[count][Math.floor(count/2)]}:0`, `round-1/seat-${seats[count][0]}:1`, `round-1/seat-${seats[count][Math.floor(count/2)]}:1`];
  64  |     await observe(page, checkpoints); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  65  |     for (const [index,target] of checkpoints.entries()) {
  66  |       await expect.poll(async () => (await trace(page)).paused && await page.locator(`[data-deal-target="${target}"]`).count() === 1).toBe(true);
  67  |       const before = await trace(page);
  68  |       if (width === 320 && index === 0) {
  69  |         const landing = await page.locator(`[data-deal-target="${target}"] .card`).evaluate(card => {
  70  |           const summary = document.querySelector<HTMLDetailsElement>('[data-seat-anchor="seat-1"] details')!;
  71  |           const box = summary.querySelector('summary')!.getBoundingClientRect();
  72  |           return { open: summary.open, actual: { x: parseFloat((card as HTMLElement).style.left) + parseFloat((card as HTMLElement).style.width)/2,
  73  |             y: parseFloat((card as HTMLElement).style.top) + parseFloat((card as HTMLElement).style.height)/2 },
  74  |             expected: { x: box.left + box.width/2 + scrollX, y: box.top + box.height/2 + scrollY } };
  75  |         });
  76  |         expect(landing.open).toBe(false);
  77  |         expect(Math.abs(landing.actual.x - landing.expected.x)).toBeLessThanOrEqual(1);
  78  |         expect(Math.abs(landing.actual.y - landing.expected.y)).toBeLessThanOrEqual(1);
  79  |         writeFileSync(info.outputPath('collapsed-summary-landing.json'), JSON.stringify(landing, null, 2));
  80  |       }
  81  |       const cdp = await page.context().newCDPSession(page);
  82  |       // Document-sized capture changes the viewport and correctly invokes resize settlement.
  83  |       // Native viewport pixels keep the real paused flight and lifecycle policy intact.
  84  |       await page.evaluate(() => scrollTo(0, 0));
  85  |       const capture = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  86  |       await cdp.detach();
  87  |       writeFileSync(`${root}/${count}-${width}-${['start','mid-first-pass','end-first-pass','mid-second-pass'][index]}.png`, Buffer.from(capture.data, 'base64'));
  88  |       writeFileSync(info.outputPath(`capture-${index}.json`), JSON.stringify({ before, after: await trace(page) }, null, 2));
  89  |       await expect(page.locator(`[data-deal-target="${target}"]`)).toHaveCount(1);
  90  |       await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
  91  |       await page.evaluate(() => {
  92  |         const trace = (window as unknown as { dealTrace: Trace }).dealTrace;
  93  |         trace.paused = false; document.querySelectorAll<HTMLElement>('[data-initial-deal-flight]').forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.play()));
  94  |       });
  95  |     }
  96  |     await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  97  |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  98  |     await page.screenshot({ path: `${root}/${count}-${width}-settled.png`, fullPage: true });
  99  |     writeFileSync(`${root}/${count}-${width}-sequence.json`, JSON.stringify(await trace(page), null, 2));
  100 | });
  101 | 
  102 | test('[T06-B03] skip/keyboard legal action settles before dispatch; new round/new table never replay stale cards', async ({ page }) => {
  103 |   await page.goto('/?fixture=player-split'); await observe(page);
  104 |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  105 |   await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
  106 |   await page.getByRole('button', { name: 'Split', exact: true }).focus(); await page.keyboard.press('Enter');
  107 |   await expect(page.locator('#player-hand article')).toHaveCount(2); await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  108 |   await expect(page.locator('#player-hand [data-deal-visible="false"]')).toHaveCount(0);
  109 |   for (let index = 0; index < 2; index++) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  110 |   const dealer = await page.locator('.dealer-zone').getAttribute('data-dealer-character');
  111 |   await page.getByRole('button', { name: /^Repeat Bet/ }).click();
  112 |   await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
  113 |   await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  114 |   await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  115 |   await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-character', dealer!);
  116 |   while (await page.getByRole('button', { name: 'Stand', exact: true }).count()) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  117 |   if (await page.getByRole('button', { name: 'Decline', exact: true }).count()) await page.getByRole('button', { name: 'Decline', exact: true }).click();
  118 |   while (await page.getByRole('button', { name: 'Stand', exact: true }).count()) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  119 |   await page.getByRole('button', { name: 'New table · reset to 1000 credits', exact: true }).click();
  120 |   await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0); await expect(page.locator('[data-card-slot]')).toHaveCount(0);
  121 | });
  122 | 
  123 | test('[T06-B04] resize/background/text200 settle safely, keep native focus and bounded geometry', async ({ page }) => {
  124 |   await setup(page, 7); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  125 |   await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(1);
  126 |   await page.setViewportSize({ width: 768, height: 1024 });
  127 |   await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  128 |   await expect(page.locator('[data-deal-visible="false"]')).toHaveCount(0);
  129 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  130 |   await page.goto('/?fixture=player-split'); await page.addStyleTag({ content: 'html {font-size: 200%}' });
  131 |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  132 |   await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  133 |   await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  134 |   await expect(page.locator('[data-deal-visible="false"]')).toHaveCount(0);
  135 |   const stand = page.getByRole('button', { name: 'Stand', exact: true }); await stand.focus(); await expect(stand).toBeFocused();
  136 |   const box = await stand.boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44);
  137 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  138 | });
  139 | 
  140 | test('[T06-B05] reduced preference settles without flights; IMMEDIATE uses the identical authoritative result', async ({ page }) => {
  141 |   await page.emulateMedia({ reducedMotion: 'reduce' }); await setup(page, 7); await observe(page);
  142 |   await page.getByRole('button', { name: 'Deal', exact: true }).click();
  143 |   await expect(page.locator('[data-deal-visible="false"]')).toHaveCount(0);
  144 |   await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  145 |   expect((await trace(page)).flights).toEqual([]);
  146 |   const result = await page.evaluate(async () => {
```