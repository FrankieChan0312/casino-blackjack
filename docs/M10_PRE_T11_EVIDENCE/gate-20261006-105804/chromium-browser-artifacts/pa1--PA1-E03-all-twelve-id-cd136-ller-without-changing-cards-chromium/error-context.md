# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pa1.spec.ts >> [PA1-E03] all twelve identities display the correct decoded portrait name archetype and human controller without changing cards
- Location: tests\browser\pa1.spec.ts:58:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('img', { name: 'Original illustrated female dealer in professional attire', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('img', { name: 'Original illustrated female dealer in professional attire', exact: true }) with timeout 5000ms
  - waiting for getByRole('img', { name: 'Original illustrated female dealer in professional attire', exact: true })

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
        - 'img "Dealer: generic formal portrait"'
        - heading "Dealer" [level=2]
        - group "Dealer hand":
          - img "4 of clubs": "4"
          - img "Hidden dealer card": ◆
          - paragraph: "Visible total: 4"
          - paragraph: Hole card hidden
        - group "Shoe and deal origin":
          - paragraph: Shoe · Deal origin 6 decks
        - paragraph: BLACKJACK PAYS 3:2 DEALER STANDS ON ALL 17
      - region "Seat 1":
        - 'img "Computer guest: Elaria, Female Elf"'
        - heading "Elaria" [level=2]
        - paragraph: Female Elf
        - paragraph: Seat 1 · Computer
        - group:
          - article "Hand A":
            - img "J of hearts": J
            - img "5 of diamonds": "5"
            - img "2 of clubs": "2"
            - paragraph: "17"
            - paragraph: Decisions complete
            - paragraph: "MAIN: 25 credits"
      - region "Seat 3":
        - 'img "Computer guest: Caelan, Male Elf"'
        - heading "Caelan" [level=2]
        - paragraph: Male Elf
        - paragraph: Seat 3 · Computer
        - group:
          - article "Hand A":
            - img "A of hearts": A
            - img "8 of spades": "8"
            - paragraph: "19"
            - paragraph: Decisions complete
            - paragraph: "MAIN: 25 credits"
      - region "Seat 4":
        - group "Your player HUD":
          - 'img "Your avatar: Brynja, Female Dwarf"'
          - paragraph: YOU
          - heading "Brynja" [level=2]: ▸ Brynja
          - paragraph: Female Dwarf
          - paragraph: Seat 4 · You · Human
          - paragraph: "MAIN: 100 credits"
          - article "Hand A":
            - heading "Hand A · Current hand" [level=3]
            - text: ACTIVE
            - img "5 of hearts": "5"
            - img "4 of spades": "4"
            - paragraph:
              - text: "Total:"
              - strong: "9"
            - paragraph: "Wager: 100 credits"
            - paragraph: Playing
      - region "Seat 6":
        - 'img "Computer guest: Roland, Male Human Knight"'
        - heading "Roland" [level=2]
        - paragraph: Male Human Knight
        - paragraph: Seat 6 · Computer
        - group:
          - article "Hand A":
            - img "9 of hearts": "9"
            - img "6 of diamonds": "6"
            - paragraph: "15"
            - paragraph: Playing
            - paragraph: "MAIN: 25 credits"
    - region "Your gameplay controls":
      - status: Your turn
      - text: · Hand A
      - region "Primary actions":
        - button "Hit"
        - button "Stand"
        - button "Double"
        - button "Split" [disabled]
        - button "Surrender"
        - group: Action guidance · Unavailable actions explained
      - region "Your credits":
        - heading "Credits" [level=2]
        - term: Available
        - definition: "900"
        - term: Reserved / current exposure
        - definition: "100"
        - term: Pending return
        - definition: "0"
    - paragraph: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools":
    - paragraph: 4 players · 1 human · 3 computer guests
    - button "New table · reset to 1000 credits" [disabled]
    - checkbox "Reduce motion" [checked] [disabled]
    - text: Reduce motion
    - paragraph: Reduced motion is enabled by your device.
    - group:
      - text: Change Character · Brynja
      - 'img "Your character: Brynja, Female Dwarf"'
      - text: Your character
      - combobox "Your character":
        - option "Caelan · Male Elf"
        - option "Elaria · Female Elf"
        - option "Roland · Male Human Knight"
        - option "Seraphine · Female Human Knight"
        - option "Alaric · Male Mage"
        - option "Nyra · Female Mage"
        - option "Lucien · Male Noble"
        - option "Celestine · Female Noble"
        - option "Garruk · Male Half-Orc Warrior"
        - option "Vesha · Female Half-Orc Warrior"
        - option "Borin · Male Dwarf"
        - option "Brynja · Female Dwarf" [selected]
      - paragraph: Choose at any time. If a guest has this character, they take your previous character.
    - group: Developer / demo tools
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import { capturePa1Evidence } from './pa1Evidence.js';
  3   | 
  4   | async function lineup(page: Page) { return page.locator('.seats > .seat').evaluateAll(seats => seats.map(seat => seat.getAttribute('data-character'))); }
  5   | async function choose(page: Page, id: string) {
  6   |   const picker = page.locator('.character-picker');
  7   |   if (!await picker.evaluate(element => element.hasAttribute('open'))) await picker.locator('summary').click();
  8   |   await page.getByLabel('Your character',{exact:true}).selectOption(id);
  9   | }
  10  | async function deal(page: Page) {
  11  |   await page.getByLabel('Your main wager',{exact:false}).fill('100');
  12  |   await page.getByRole('button',{name:'Deal',exact:true}).click();
  13  | }
  14  | test('[PA1-E01] non-blocking default, collision exchange and persistent guests across active play Repeat Bet and Deal Again', async ({ page }) => {
  15  |   await page.goto('/?fixture=player&dealer=legacy');
  16  |   expect(await lineup(page)).toEqual(['elf_male','elf_female','knight_male','knight_female']);
  17  |   await expect(page.locator('.character-picker')).not.toHaveAttribute('open','');
  18  |   await expect(page.getByRole('button',{name:'Deal',exact:true})).toBeEnabled();
  19  |   const audit = await page.locator('.audit-list').innerHTML(); const funds = await page.locator('.credits').innerText();
  20  |   await choose(page,'elf_female');
  21  |   expect(await lineup(page)).toEqual(['elf_male','knight_male','elf_female','knight_female']);
  22  |   expect(await page.locator('.audit-list').innerHTML()).toBe(audit); expect(await page.locator('.credits').innerText()).toBe(funds);
  23  |   await deal(page); const cards = await page.locator('#player-hand .cards').innerHTML();
  24  |   const activeAudit = await page.locator('.audit-list').innerHTML();
  25  |   await choose(page,'noble_female');
  26  |   expect(await page.locator('#player-hand .cards').innerHTML()).toBe(cards);
  27  |   expect(await page.locator('.audit-list').innerHTML()).toBe(activeAudit);
  28  |   await expect(page.getByRole('button',{name:'Stand',exact:true})).toBeEnabled();
  29  |   const persistent = await lineup(page);
  30  |   await page.getByRole('button',{name:'Stand',exact:true}).click(); expect(await lineup(page)).toEqual(persistent);
  31  |   await page.getByRole('button',{name:/^Repeat Bet/}).click(); expect(await lineup(page)).toEqual(persistent);
  32  |   if (await page.getByRole('button',{name:'Decline',exact:true}).count()) await page.getByRole('button',{name:'Decline',exact:true}).click();
  33  |   while (await page.getByRole('button',{name:'Stand',exact:true}).count()) await page.getByRole('button',{name:'Stand',exact:true}).click();
  34  |   await page.getByRole('button',{name:'Deal Again',exact:true}).click(); expect(await lineup(page)).toEqual(persistent);
  35  |   await page.getByText('Developer / demo tools',{exact:true}).click(); await page.getByText('Advanced demo settings',{exact:true}).click();
  36  |   await page.getByRole('button',{name:'Start new demo session',exact:true}).click();
  37  |   expect(await lineup(page)).toEqual(['elf_male','elf_female','knight_male','knight_female']);
  38  | });
  39  | test('[PA1-E02] changing avatars leaves seeded replay commands gameplay digest funds and audit outcomes identical', async ({ page }) => {
  40  |   const receipts: string[] = [], results: string[] = [], audits: string[] = [];
  41  |   for (const change of [false,true]) {
  42  |     await page.goto('/?fixture=player&dealer=legacy');
  43  |     if (change) await choose(page,'dwarf_female');
  44  |     await deal(page); if (change) await choose(page,'noble_male');
  45  |     await page.getByRole('button',{name:'Stand',exact:true}).click();
  46  |     results.push(await page.getByRole('region',{name:'Your round result',exact:true}).innerText());
  47  |     audits.push(await page.locator('.audit-list').innerHTML());
  48  |     await page.getByText('Developer / demo tools',{exact:true}).click();
  49  |     await page.getByRole('button',{name:'View replay package',exact:true}).click();
  50  |     receipts.push(await page.getByLabel('Completed replay JSON',{exact:true}).inputValue());
  51  |     await page.getByRole('button',{name:'Replay completed session',exact:true}).click();
  52  |     results.push(await page.getByRole('region',{name:'Replay result',exact:true}).innerText());
  53  |   }
  54  |   expect(receipts[1]).toBe(receipts[0]); expect(audits[1]).toBe(audits[0]);
  55  |   expect(results[2]).toBe(results[0]); expect(results[3]).toBe(results[1]);
  56  |   expect(receipts[1]).not.toMatch(/character|Caelan|Lucien|Borin/);
  57  | });
  58  | test('[PA1-E03] all twelve identities display the correct decoded portrait name archetype and human controller without changing cards', async ({ page }) => {
  59  |   const roster = [
  60  |     ['elf_male','Caelan','Male Elf'],['elf_female','Elaria','Female Elf'],
  61  |     ['knight_male','Roland','Male Human Knight'],['knight_female','Seraphine','Female Human Knight'],
  62  |     ['mage_male','Alaric','Male Mage'],['mage_female','Nyra','Female Mage'],
  63  |     ['noble_male','Lucien','Male Noble'],['noble_female','Celestine','Female Noble'],
  64  |     ['halforc_male','Garruk','Male Half-Orc Warrior'],['halforc_female','Vesha','Female Half-Orc Warrior'],
  65  |     ['dwarf_male','Borin','Male Dwarf'],['dwarf_female','Brynja','Female Dwarf'],
  66  |   ];
  67  |   await page.goto('/?fixture=player&dealer=legacy'); await deal(page);
  68  |   const hand = page.locator('#player-hand'), cards = await hand.locator('.cards').innerHTML();
  69  |   for (const [id,name,archetype] of roster) {
  70  |     await choose(page,id);
  71  |     await expect(hand.getByRole('heading',{name,exact:true})).toBeVisible();
  72  |     await expect(hand.locator('.character-archetype')).toHaveText(archetype);
  73  |     await expect(hand.locator('.character-controller')).toContainText('Seat 4 · You · Human');
  74  |     const portrait = hand.getByRole('img',{name:`Your avatar: ${name}, ${archetype}`,exact:true});
  75  |     await expect(portrait).toBeVisible(); await expect(portrait).toHaveAttribute('src',`/characters/${id}.png`);
  76  |     await expect(portrait).toHaveJSProperty('naturalWidth',240); await expect(portrait).toHaveJSProperty('naturalHeight',320);
  77  |     expect(await hand.locator('.cards').innerHTML()).toBe(cards);
  78  |     const ids = await lineup(page); expect(new Set(ids).size).toBe(4);
  79  |     await capturePa1Evidence(`docs/images/pa1-avatar-${id}.png`,test.info().outputPath(`pa1-avatar-${id}.png`),path=>hand.screenshot({path,animations:'disabled'}));
  80  |   }
> 81  |   await expect(page.getByRole('img',{name:'Original illustrated female dealer in professional attire',exact:true})).toBeVisible();
      |                                                                                                                     ^ Error: expect(locator).toBeVisible() failed
  82  |   for (const seat of [1,3,6]) {
  83  |     const guest = page.getByRole('region',{name:`Seat ${seat}`,exact:true});
  84  |     await expect(guest.getByRole('img',{name:/^Computer guest: /})).toBeVisible();
  85  |     await expect(guest.locator('.character-controller')).toContainText(`Seat ${seat} · Computer`);
  86  |   }
  87  | });
  88  | 
  89  | test('[PA1-E04] character keyboard focus touch targets reduced motion and unclipped identities preserve cards at desktop tablet and mobile widths', async ({ page }) => {
  90  |   await page.emulateMedia({reducedMotion:'reduce'});
  91  |   for (const viewport of [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}]) {
  92  |     await page.setViewportSize(viewport); await page.goto('/?fixture=player&dealer=legacy'); await deal(page);
  93  |     const summary = page.locator('.character-picker summary');
  94  |     for (let i=0;i<30 && !await summary.evaluate(el=>el===document.activeElement);i++) await page.keyboard.press('Tab');
  95  |     await expect(summary).toBeFocused();
  96  |     expect(await summary.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
  97  |     expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  98  |     await page.keyboard.press('Enter'); await page.keyboard.press('Tab');
  99  |     const select = page.getByLabel('Your character',{exact:true}); await expect(select).toBeFocused();
  100 |     expect(await select.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
  101 |     expect((await select.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  102 |     await page.keyboard.press('End'); await page.keyboard.press('Enter'); await expect(select).toHaveValue('dwarf_female');
  103 |     await expect(page.locator('#player-hand').getByRole('heading',{name:'Brynja',exact:true})).toBeVisible();
  104 |     await select.selectOption('halforc_female');
  105 |     for (const seat of [1,3,4,6]) {
  106 |       const region = page.getByRole('region',{name:`Seat ${seat}`,exact:true});
  107 |       const identity = region.locator('.character-identity'); await expect(identity).toBeVisible();
  108 |       expect(await identity.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  109 |       const portrait = (await identity.locator('img').boundingBox())!;
  110 |       const text = (await identity.locator('div').boundingBox())!;
  111 |       expect(portrait.x+portrait.width<=text.x+1 || portrait.y+portrait.height<=text.y+1).toBe(true);
  112 |       if (viewport.width>600 || seat===4) {
  113 |         const cards = (await region.locator('article .cards').first().boundingBox())!;
  114 |         expect(cards.y).toBeGreaterThanOrEqual((await identity.boundingBox())!.y+(await identity.boundingBox())!.height);
  115 |       }
  116 |     }
  117 |     for (const name of ['Hit','Stand','Double','Surrender']) {
  118 |       const action = page.getByRole('button',{name,exact:true}); const box = (await action.boundingBox())!;
  119 |       expect(box.height).toBeGreaterThanOrEqual(44); expect(box.width).toBeGreaterThanOrEqual(44);
  120 |       expect(await action.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  121 |     }
  122 |     await expect(page.getByRole('img',{name:'Hidden dealer card',exact:true})).toBeVisible();
  123 |     expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  124 |     await capturePa1Evidence(`docs/images/pa1-responsive-${viewport.width}.png`,test.info().outputPath(`pa1-responsive-${viewport.width}.png`),path=>page.screenshot({path,fullPage:true,animations:'disabled'}),{width:viewport.width,minHeight:viewport.height});
  125 |   }
  126 | });
  127 | 
  128 | test('[PA1-E05] failed portraits and 200 percent text enlargement retain readable character identity and playable controls', async ({ page }) => {
  129 |   await page.route('**/characters/*.png',route=>route.abort());
  130 |   for (const viewport of [{width:1280,height:900},{width:320,height:720}]) {
  131 |     await page.setViewportSize(viewport); await page.goto('/?fixture=player&dealer=legacy'); await deal(page); await choose(page,'knight_female');
  132 |     await page.addStyleTag({content:'html { font-size: 200%; }'});
  133 |     await expect(page.locator('#player-hand').getByRole('heading',{name:'Seraphine',exact:true})).toBeVisible();
  134 |     await expect(page.locator('#player-hand .character-archetype')).toHaveText('Female Human Knight');
  135 |     await expect(page.locator('#player-hand .character-controller')).toContainText('You · Human');
  136 |     await expect(page.locator('#player-hand .character-identity img')).toHaveJSProperty('naturalWidth',0);
  137 |     expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  138 |     expect(await page.locator('#player-hand .character-identity').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  139 |     await expect(page.getByRole('button',{name:'Stand',exact:true})).toBeEnabled();
  140 |     await capturePa1Evidence(`docs/images/pa1-text-fallback-${viewport.width}.png`,test.info().outputPath(`pa1-text-fallback-${viewport.width}.png`),path=>page.screenshot({path,fullPage:true,animations:'disabled'}),{width:viewport.width,minHeight:viewport.height});
  141 |     await page.getByRole('button',{name:'Stand',exact:true}).click();
  142 |     await expect(page.getByRole('region',{name:'Your round result',exact:true})).toBeVisible();
  143 |   }
  144 | });
  145 | 
```