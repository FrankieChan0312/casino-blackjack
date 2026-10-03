# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pa1.spec.ts >> [PA1-E03] all twelve identities display the correct decoded portrait name archetype and human controller without changing cards
- Location: tests\browser\pa1.spec.ts:57:1

# Error details

```
Error: locator.screenshot: UNKNOWN: unknown error, open 'C:\Users\user\Documents\GitHub\casino-blackjack\docs\images\pa1-avatar-noble_female.png'
```

# Page snapshot

```yaml
- main [ref=e3]:
  - link "Skip to your hand and actions" [ref=e4] [cursor=pointer]:
    - /url: "#player-decisions"
  - generic [ref=e5]:
    - generic [ref=e6]:
      - paragraph [ref=e7]: An evening at the table
      - heading "Casino Blackjack" [level=1] [ref=e8]
    - paragraph [ref=e9]: Simulation credits only — no real-money gambling.Credits have no redemption value.
  - status [ref=e10]: Your turn
  - region "Blackjack table" [ref=e11]:
    - region "Dealer" [ref=e12]:
      - heading "Dealer" [level=2] [ref=e13]
      - img "Original illustrated female dealer in professional attire" [ref=e14]
      - generic [ref=e45]:
        - img "4 of clubs" [ref=e47]:
          - generic [ref=e48]:
            - text: "4"
            - generic [aria-hidden] [ref=e49]: ♣
          - generic [aria-hidden] [ref=e50]: ♣
          - generic [aria-hidden] [ref=e51]: "4"
        - img "Hidden dealer card" [ref=e52]: ◆
        - paragraph [ref=e53]: "Visible total: 4"
        - paragraph [ref=e54]: Hole card hidden
    - paragraph [ref=e55]:
      - text: BLACKJACK PAYS 3:2
      - generic [ref=e56]: DEALER STANDS ON ALL 17
    - generic [ref=e57]:
      - region "Seat 1" [ref=e58]:
        - generic [ref=e59]:
          - 'img "Computer guest: Elaria, Female Elf" [ref=e60]'
          - generic [ref=e61]:
            - heading "Elaria" [level=2] [ref=e62]
            - paragraph [ref=e63]: Female Elf
            - paragraph [ref=e64]:
              - text: Seat 1 · Computer
              - generic [ref=e65]: "MAIN: 25 credits"
        - article "Hand A" [ref=e66]:
          - generic [ref=e67]:
            - img "J of hearts" [ref=e68]:
              - generic [ref=e69]:
                - text: J
                - generic [aria-hidden] [ref=e70]: ♥
              - generic [aria-hidden] [ref=e71]: ♥
              - generic [aria-hidden] [ref=e72]: J
            - img "5 of diamonds" [ref=e73]:
              - generic [ref=e74]:
                - text: "5"
                - generic [aria-hidden] [ref=e75]: ♦
              - generic [aria-hidden] [ref=e76]: ♦
              - generic [aria-hidden] [ref=e77]: "5"
            - img "2 of clubs" [ref=e78]:
              - generic [ref=e79]:
                - text: "2"
                - generic [aria-hidden] [ref=e80]: ♣
              - generic [aria-hidden] [ref=e81]: ♣
              - generic [aria-hidden] [ref=e82]: "2"
          - paragraph [ref=e83]: "Total: 17 · Wager: 25"
          - paragraph [ref=e84]: Decisions complete
      - region "Seat 3" [ref=e85]:
        - generic [ref=e86]:
          - 'img "Computer guest: Caelan, Male Elf" [ref=e87]'
          - generic [ref=e88]:
            - heading "Caelan" [level=2] [ref=e89]
            - paragraph [ref=e90]: Male Elf
            - paragraph [ref=e91]:
              - text: Seat 3 · Computer
              - generic [ref=e92]: "MAIN: 25 credits"
        - article "Hand A" [ref=e93]:
          - generic [ref=e94]:
            - img "A of hearts" [ref=e95]:
              - generic [ref=e96]:
                - text: A
                - generic [aria-hidden] [ref=e97]: ♥
              - generic [aria-hidden] [ref=e98]: ♥
              - generic [aria-hidden] [ref=e99]: A
            - img "8 of spades" [ref=e100]:
              - generic [ref=e101]:
                - text: "8"
                - generic [aria-hidden] [ref=e102]: ♠
              - generic [aria-hidden] [ref=e103]: ♠
              - generic [aria-hidden] [ref=e104]: "8"
          - paragraph [ref=e105]: "Total: 19 · Wager: 25"
          - paragraph [ref=e106]: Decisions complete
      - region "Seat 4" [ref=e107]:
        - generic [ref=e108]:
          - 'img "Your avatar: Celestine, Female Noble" [ref=e109]'
          - generic [ref=e110]:
            - heading "Celestine" [level=2] [ref=e111]: ▸ Celestine
            - paragraph [ref=e112]: Female Noble
            - paragraph [ref=e113]:
              - text: Seat 4 · You · Human
              - generic [ref=e114]: "MAIN: 100 credits"
        - article "Hand A" [ref=e115]:
          - generic [ref=e116]:
            - heading "Hand A · Current hand" [level=3] [ref=e117]
            - generic [ref=e118]: ACTIVE
          - generic [ref=e119]:
            - img "5 of hearts" [ref=e120]:
              - generic [ref=e121]:
                - text: "5"
                - generic [aria-hidden] [ref=e122]: ♥
              - generic [aria-hidden] [ref=e123]: ♥
              - generic [aria-hidden] [ref=e124]: "5"
            - img "4 of spades" [ref=e125]:
              - generic [ref=e126]:
                - text: "4"
                - generic [aria-hidden] [ref=e127]: ♠
              - generic [aria-hidden] [ref=e128]: ♠
              - generic [aria-hidden] [ref=e129]: "4"
          - paragraph [ref=e130]: "Total: 9 · Wager: 100"
          - paragraph [ref=e131]: Playing
      - region "Seat 6" [ref=e132]:
        - generic [ref=e133]:
          - 'img "Computer guest: Roland, Male Human Knight" [ref=e134]'
          - generic [ref=e135]:
            - heading "Roland" [level=2] [ref=e136]
            - paragraph [ref=e137]: Male Human Knight
            - paragraph [ref=e138]:
              - text: Seat 6 · Computer
              - generic [ref=e139]: "MAIN: 25 credits"
        - article "Hand A" [ref=e140]:
          - generic [ref=e141]:
            - img "9 of hearts" [ref=e142]:
              - generic [ref=e143]:
                - text: "9"
                - generic [aria-hidden] [ref=e144]: ♥
              - generic [aria-hidden] [ref=e145]: ♥
              - generic [aria-hidden] [ref=e146]: "9"
            - img "6 of diamonds" [ref=e147]:
              - generic [ref=e148]:
                - text: "6"
                - generic [aria-hidden] [ref=e149]: ♦
              - generic [aria-hidden] [ref=e150]: ♦
              - generic [aria-hidden] [ref=e151]: "6"
          - paragraph [ref=e152]: "Total: 15 · Wager: 25"
          - paragraph [ref=e153]: Playing
  - generic [ref=e154]:
    - region "Primary actions" [ref=e155]:
      - generic [ref=e156]:
        - button "Hit" [ref=e157] [cursor=pointer]
        - button "Stand" [ref=e158] [cursor=pointer]
        - button "Double" [ref=e159] [cursor=pointer]
        - button "Split" [disabled] [ref=e160]
        - button "Surrender" [ref=e161] [cursor=pointer]
      - group [ref=e162]:
        - generic "Action guidance · Unavailable actions explained" [ref=e163] [cursor=pointer]
    - region "Your credits" [ref=e164]:
      - heading "Your simulation credits" [level=2] [ref=e165]
      - generic [ref=e166]:
        - generic [ref=e167]:
          - term [ref=e168]: Available
          - definition [ref=e169]: "900"
        - generic [ref=e170]:
          - term [ref=e171]: Reserved / current exposure
          - definition [ref=e172]: "100"
        - generic [ref=e173]:
          - term [ref=e174]: Pending return
          - definition [ref=e175]: "0"
  - paragraph [ref=e176]: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - group [ref=e177]:
    - generic "Change Character · Celestine" [active] [ref=e178] [cursor=pointer]
    - 'img "Your character: Celestine, Female Noble" [ref=e179]'
    - generic [ref=e180]: Your character
    - combobox "Your character" [ref=e181]:
      - option "Caelan · Male Elf"
      - option "Elaria · Female Elf"
      - option "Roland · Male Human Knight"
      - option "Seraphine · Female Human Knight"
      - option "Alaric · Male Mage"
      - option "Nyra · Female Mage"
      - option "Lucien · Male Noble"
      - option "Celestine · Female Noble" [selected]
      - option "Garruk · Male Half-Orc Warrior"
      - option "Vesha · Female Half-Orc Warrior"
      - option "Borin · Male Dwarf"
      - option "Brynja · Female Dwarf"
    - paragraph [ref=e182]: Choose at any time. If a guest has this character, they take your previous character.
  - group [ref=e183]:
    - generic "Developer / demo tools" [ref=e184] [cursor=pointer]
    - option "Classic Blackjack" [selected]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | 
  3   | async function lineup(page: Page) { return page.locator('.seats > .seat').evaluateAll(seats => seats.map(seat => seat.getAttribute('data-character'))); }
  4   | async function choose(page: Page, id: string) {
  5   |   const picker = page.locator('.character-picker');
  6   |   if (!await picker.evaluate(element => element.hasAttribute('open'))) await picker.locator('summary').click();
  7   |   await page.getByLabel('Your character',{exact:true}).selectOption(id);
  8   | }
  9   | async function deal(page: Page) {
  10  |   await page.getByLabel('Your main wager',{exact:false}).fill('100');
  11  |   await page.getByRole('button',{name:'Deal',exact:true}).click();
  12  | }
  13  | test('[PA1-E01] non-blocking default, collision exchange and persistent guests across active play Repeat Bet and Deal Again', async ({ page }) => {
  14  |   await page.goto('/?fixture=player');
  15  |   expect(await lineup(page)).toEqual(['elf_male','elf_female','knight_male','knight_female']);
  16  |   await expect(page.locator('.character-picker')).not.toHaveAttribute('open','');
  17  |   await expect(page.getByRole('button',{name:'Deal',exact:true})).toBeEnabled();
  18  |   const audit = await page.locator('.audit-list').innerHTML(); const funds = await page.locator('.credits').innerText();
  19  |   await choose(page,'elf_female');
  20  |   expect(await lineup(page)).toEqual(['elf_male','knight_male','elf_female','knight_female']);
  21  |   expect(await page.locator('.audit-list').innerHTML()).toBe(audit); expect(await page.locator('.credits').innerText()).toBe(funds);
  22  |   await deal(page); const cards = await page.locator('#player-hand .cards').innerHTML();
  23  |   const activeAudit = await page.locator('.audit-list').innerHTML();
  24  |   await choose(page,'noble_female');
  25  |   expect(await page.locator('#player-hand .cards').innerHTML()).toBe(cards);
  26  |   expect(await page.locator('.audit-list').innerHTML()).toBe(activeAudit);
  27  |   await expect(page.getByRole('button',{name:'Stand',exact:true})).toBeEnabled();
  28  |   const persistent = await lineup(page);
  29  |   await page.getByRole('button',{name:'Stand',exact:true}).click(); expect(await lineup(page)).toEqual(persistent);
  30  |   await page.getByRole('button',{name:/^Repeat Bet/}).click(); expect(await lineup(page)).toEqual(persistent);
  31  |   if (await page.getByRole('button',{name:'Decline',exact:true}).count()) await page.getByRole('button',{name:'Decline',exact:true}).click();
  32  |   while (await page.getByRole('button',{name:'Stand',exact:true}).count()) await page.getByRole('button',{name:'Stand',exact:true}).click();
  33  |   await page.getByRole('button',{name:'Deal Again',exact:true}).click(); expect(await lineup(page)).toEqual(persistent);
  34  |   await page.getByText('Developer / demo tools',{exact:true}).click(); await page.getByText('Advanced demo settings',{exact:true}).click();
  35  |   await page.getByRole('button',{name:'Start new demo session',exact:true}).click();
  36  |   expect(await lineup(page)).toEqual(['elf_male','elf_female','knight_male','knight_female']);
  37  | });
  38  | test('[PA1-E02] changing avatars leaves seeded replay commands gameplay digest funds and audit outcomes identical', async ({ page }) => {
  39  |   const receipts: string[] = [], results: string[] = [], audits: string[] = [];
  40  |   for (const change of [false,true]) {
  41  |     await page.goto('/?fixture=player');
  42  |     if (change) await choose(page,'dwarf_female');
  43  |     await deal(page); if (change) await choose(page,'noble_male');
  44  |     await page.getByRole('button',{name:'Stand',exact:true}).click();
  45  |     results.push(await page.getByRole('region',{name:'Your round result',exact:true}).innerText());
  46  |     audits.push(await page.locator('.audit-list').innerHTML());
  47  |     await page.getByText('Developer / demo tools',{exact:true}).click();
  48  |     await page.getByRole('button',{name:'View replay package',exact:true}).click();
  49  |     receipts.push(await page.getByLabel('Completed replay JSON',{exact:true}).inputValue());
  50  |     await page.getByRole('button',{name:'Replay completed session',exact:true}).click();
  51  |     results.push(await page.getByRole('region',{name:'Replay result',exact:true}).innerText());
  52  |   }
  53  |   expect(receipts[1]).toBe(receipts[0]); expect(audits[1]).toBe(audits[0]);
  54  |   expect(results[2]).toBe(results[0]); expect(results[3]).toBe(results[1]);
  55  |   expect(receipts[1]).not.toMatch(/character|Caelan|Lucien|Borin/);
  56  | });
  57  | test('[PA1-E03] all twelve identities display the correct decoded portrait name archetype and human controller without changing cards', async ({ page }) => {
  58  |   const roster = [
  59  |     ['elf_male','Caelan','Male Elf'],['elf_female','Elaria','Female Elf'],
  60  |     ['knight_male','Roland','Male Human Knight'],['knight_female','Seraphine','Female Human Knight'],
  61  |     ['mage_male','Alaric','Male Mage'],['mage_female','Nyra','Female Mage'],
  62  |     ['noble_male','Lucien','Male Noble'],['noble_female','Celestine','Female Noble'],
  63  |     ['halforc_male','Garruk','Male Half-Orc Warrior'],['halforc_female','Vesha','Female Half-Orc Warrior'],
  64  |     ['dwarf_male','Borin','Male Dwarf'],['dwarf_female','Brynja','Female Dwarf'],
  65  |   ];
  66  |   await page.goto('/?fixture=player'); await deal(page);
  67  |   const hand = page.locator('#player-hand'), cards = await hand.locator('.cards').innerHTML();
  68  |   for (const [id,name,archetype] of roster) {
  69  |     await choose(page,id);
  70  |     await expect(hand.getByRole('heading',{name,exact:true})).toBeVisible();
  71  |     await expect(hand.locator('.character-archetype')).toHaveText(archetype);
  72  |     await expect(hand.locator('.character-controller')).toContainText('Seat 4 · You · Human');
  73  |     const portrait = hand.getByRole('img',{name:`Your avatar: ${name}, ${archetype}`,exact:true});
  74  |     await expect(portrait).toBeVisible(); await expect(portrait).toHaveAttribute('src',`/characters/${id}.png`);
  75  |     await expect(portrait).toHaveJSProperty('naturalWidth',240); await expect(portrait).toHaveJSProperty('naturalHeight',320);
  76  |     expect(await hand.locator('.cards').innerHTML()).toBe(cards);
  77  |     const ids = await lineup(page); expect(new Set(ids).size).toBe(4);
> 78  |     await hand.screenshot({path:`docs/images/pa1-avatar-${id}.png`,animations:'disabled'});
      |                ^ Error: locator.screenshot: UNKNOWN: unknown error, open 'C:\Users\user\Documents\GitHub\casino-blackjack\docs\images\pa1-avatar-noble_female.png'
  79  |   }
  80  |   await expect(page.getByRole('img',{name:'Original illustrated female dealer in professional attire',exact:true})).toBeVisible();
  81  |   for (const seat of [1,3,6]) {
  82  |     const guest = page.getByRole('region',{name:`Seat ${seat}`,exact:true});
  83  |     await expect(guest.getByRole('img',{name:/^Computer guest: /})).toBeVisible();
  84  |     await expect(guest.locator('.character-controller')).toContainText(`Seat ${seat} · Computer`);
  85  |   }
  86  | });
  87  | 
  88  | test('[PA1-E04] character keyboard focus touch targets reduced motion and unclipped identities preserve cards at desktop tablet and mobile widths', async ({ page }) => {
  89  |   await page.emulateMedia({reducedMotion:'reduce'});
  90  |   for (const viewport of [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}]) {
  91  |     await page.setViewportSize(viewport); await page.goto('/?fixture=player'); await deal(page);
  92  |     const summary = page.locator('.character-picker summary');
  93  |     for (let i=0;i<30 && !await summary.evaluate(el=>el===document.activeElement);i++) await page.keyboard.press('Tab');
  94  |     await expect(summary).toBeFocused();
  95  |     expect(await summary.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
  96  |     expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  97  |     await page.keyboard.press('Enter'); await page.keyboard.press('Tab');
  98  |     const select = page.getByLabel('Your character',{exact:true}); await expect(select).toBeFocused();
  99  |     expect(await select.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
  100 |     expect((await select.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  101 |     await page.keyboard.press('End'); await page.keyboard.press('Enter'); await expect(select).toHaveValue('dwarf_female');
  102 |     await expect(page.locator('#player-hand').getByRole('heading',{name:'Brynja',exact:true})).toBeVisible();
  103 |     await select.selectOption('halforc_female');
  104 |     for (const seat of [1,3,4,6]) {
  105 |       const region = page.getByRole('region',{name:`Seat ${seat}`,exact:true});
  106 |       const identity = region.locator('.character-identity'); await expect(identity).toBeVisible();
  107 |       expect(await identity.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  108 |       const portrait = (await identity.locator('img').boundingBox())!;
  109 |       const text = (await identity.locator('div').boundingBox())!;
  110 |       expect(portrait.x+portrait.width<=text.x+1 || portrait.y+portrait.height<=text.y+1).toBe(true);
  111 |       if (viewport.width>600 || seat===4) {
  112 |         const cards = (await region.locator('article .cards').first().boundingBox())!;
  113 |         expect(cards.y).toBeGreaterThanOrEqual((await identity.boundingBox())!.y+(await identity.boundingBox())!.height);
  114 |       }
  115 |     }
  116 |     for (const name of ['Hit','Stand','Double','Surrender']) {
  117 |       const action = page.getByRole('button',{name,exact:true}); const box = (await action.boundingBox())!;
  118 |       expect(box.height).toBeGreaterThanOrEqual(44); expect(box.width).toBeGreaterThanOrEqual(44);
  119 |       expect(await action.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  120 |     }
  121 |     await expect(page.getByRole('img',{name:'Hidden dealer card',exact:true})).toBeVisible();
  122 |     expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  123 |     await page.screenshot({path:`docs/images/pa1-responsive-${viewport.width}.png`,fullPage:true,animations:'disabled'});
  124 |   }
  125 | });
  126 | 
  127 | test('[PA1-E05] failed portraits and 200 percent text enlargement retain readable character identity and playable controls', async ({ page }) => {
  128 |   await page.route('**/characters/*.png',route=>route.abort());
  129 |   for (const viewport of [{width:1280,height:900},{width:320,height:720}]) {
  130 |     await page.setViewportSize(viewport); await page.goto('/?fixture=player'); await deal(page); await choose(page,'knight_female');
  131 |     await page.addStyleTag({content:'html { font-size: 200%; }'});
  132 |     await expect(page.locator('#player-hand').getByRole('heading',{name:'Seraphine',exact:true})).toBeVisible();
  133 |     await expect(page.locator('#player-hand .character-archetype')).toHaveText('Female Human Knight');
  134 |     await expect(page.locator('#player-hand .character-controller')).toContainText('You · Human');
  135 |     await expect(page.locator('#player-hand .character-identity img')).toHaveJSProperty('naturalWidth',0);
  136 |     expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  137 |     expect(await page.locator('#player-hand .character-identity').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  138 |     await expect(page.getByRole('button',{name:'Stand',exact:true})).toBeEnabled();
  139 |     await page.screenshot({path:`docs/images/pa1-text-fallback-${viewport.width}.png`,fullPage:true,animations:'disabled'});
  140 |     await page.getByRole('button',{name:'Stand',exact:true}).click();
  141 |     await expect(page.getByRole('region',{name:'Your round result',exact:true})).toBeVisible();
  142 |   }
  143 | });
  144 | 
```