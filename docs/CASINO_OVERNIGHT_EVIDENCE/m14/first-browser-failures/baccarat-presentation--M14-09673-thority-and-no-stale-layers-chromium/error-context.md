# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: baccarat\presentation.spec.ts >> [M14-B02-initial] safe skip, settled authority and no stale layers
- Location: tests\browser\baccarat\presentation.spec.ts:32:62

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Skip animation' })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - main [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - paragraph [ref=e6]: Punto Banco · Eight decks
        - heading "Baccarat" [level=1] [ref=e7]
      - paragraph [ref=e8]: Simulation credits only.No real money or redemption value.
    - region "Baccarat table" [ref=e9]:
      - generic [ref=e10]:
        - 'img "Dealer: Celestine" [ref=e11]'
        - paragraph [ref=e12]: Celestine · Dealer
        - generic "Eight-deck shoe" [ref=e13]: 410 cards remaining
      - status [ref=e16]:
        - strong [ref=e17]: PLAYER WINS
        - generic [ref=e18]: ROUND COMPLETE
      - generic [ref=e19]:
        - region "Player hand" [ref=e20]:
          - heading "Player" [level=2] [ref=e21]
          - paragraph [ref=e22]: "Total: 9"
          - group "Player cards" [ref=e23]:
            - img "5 of clubs" [ref=e26]:
              - generic [ref=e27]:
                - text: "5"
                - generic [aria-hidden] [ref=e28]: ♣
              - generic [aria-hidden] [ref=e29]: ♣
              - generic [aria-hidden] [ref=e30]: "5"
            - img "K of clubs" [ref=e33]:
              - generic [ref=e34]:
                - text: K
                - generic [aria-hidden] [ref=e35]: ♣
              - generic [aria-hidden] [ref=e36]: ♣
              - generic [aria-hidden] [ref=e37]: K
            - img "4 of clubs" [ref=e40]:
              - generic [ref=e41]:
                - text: "4"
                - generic [aria-hidden] [ref=e42]: ♣
              - generic [aria-hidden] [ref=e43]: ♣
              - generic [aria-hidden] [ref=e44]: "4"
          - paragraph [ref=e45]: Player draws a third card
        - region "Banker hand" [ref=e46]:
          - heading "Banker" [level=2] [ref=e47]
          - paragraph [ref=e48]: "Total: 7"
          - group "Banker cards" [ref=e49]:
            - img "5 of clubs" [ref=e52]:
              - generic [ref=e53]:
                - text: "5"
                - generic [aria-hidden] [ref=e54]: ♣
              - generic [aria-hidden] [ref=e55]: ♣
              - generic [aria-hidden] [ref=e56]: "5"
            - img "K of clubs" [ref=e59]:
              - generic [ref=e60]:
                - text: K
                - generic [aria-hidden] [ref=e61]: ♣
              - generic [aria-hidden] [ref=e62]: ♣
              - generic [aria-hidden] [ref=e63]: K
            - img "2 of clubs" [ref=e66]:
              - generic [ref=e67]:
                - text: "2"
                - generic [aria-hidden] [ref=e68]: ♣
              - generic [aria-hidden] [ref=e69]: ♣
              - generic [aria-hidden] [ref=e70]: "2"
          - paragraph [ref=e71]: Banker draws a third card
      - region "Wager targets" [ref=e72]:
        - generic [ref=e73]:
          - button "Player 1:1" [disabled] [pressed] [ref=e74]:
            - text: Player
            - generic [ref=e75]: 1:1
          - generic [ref=e76]: 25 credits
          - generic [ref=e77]: WIN
        - generic [ref=e78]:
          - button "Tie 8:1" [disabled] [ref=e79]:
            - text: Tie
            - generic [ref=e80]: 8:1
          - generic [ref=e81]: No bet
        - generic [ref=e82]:
          - button "Banker 0.95:1" [disabled] [ref=e83]:
            - text: Banker
            - generic [ref=e84]: 0.95:1
          - generic [ref=e85]: No bet
      - region "Your Baccarat credits" [ref=e86]:
        - generic [ref=e87]:
          - 'img "Your character: Roland, Male Human Knight" [ref=e88]'
          - generic [ref=e89]:
            - strong [ref=e90]: You · Roland
            - generic [ref=e91]: Human
        - generic [ref=e92]:
          - generic [ref=e93]:
            - term [ref=e94]: Available
            - definition [ref=e95]: 1,025
          - generic [ref=e96]:
            - term [ref=e97]: Reserved
            - definition [ref=e98]: "0"
          - generic [ref=e99]:
            - term [ref=e100]: Pending return
            - definition [ref=e101]: "0"
      - region "Baccarat controls" [ref=e102]:
        - generic "Round result" [ref=e103]:
          - strong [ref=e104]: PLAYER WINS
          - paragraph [ref=e105]: Returned 50 credits · Net +25 credits
        - generic [ref=e106]:
          - button "Deal Again" [ref=e107] [cursor=pointer]
          - button "Repeat Bet" [ref=e108] [cursor=pointer]
        - generic [ref=e110] [cursor=pointer]:
          - checkbox "Reduce motion" [ref=e111]
          - text: Reduce motion
    - generic [ref=e112]:
      - group [ref=e113]:
        - generic "Change Character · Roland" [ref=e114] [cursor=pointer]
        - option "Caelan · Male Elf"
        - option "Elaria · Female Elf"
        - option "Roland · Male Human Knight" [selected]
        - option "Seraphine · Female Human Knight"
        - option "Alaric · Male Mage"
        - option "Nyra · Female Mage"
        - option "Lucien · Male Noble"
        - option "Celestine · Female Noble · Dealer (reserved)" [disabled]
        - option "Garruk · Male Half-Orc Warrior"
        - option "Vesha · Female Half-Orc Warrior"
        - option "Borin · Male Dwarf"
        - option "Brynja · Female Dwarf"
      - group [ref=e115]:
        - generic "Table rules" [ref=e116] [cursor=pointer]
  - navigation "Casino games" [ref=e117]:
    - link "Casino Lobby" [ref=e118] [cursor=pointer]:
      - /url: /casino
    - link "Blackjack" [ref=e119] [cursor=pointer]:
      - /url: /blackjack
    - link "Baccarat" [ref=e120] [cursor=pointer]:
      - /url: /baccarat
```

# Test source

```ts
  1  | import { expect, test, type Page } from '@playwright/test';
  2  | import { mkdirSync } from 'node:fs';
  3  | const evidence='.git/overnight/visual/m14';
  4  | test.use({reducedMotion:'no-preference'});
  5  | async function capture(page:Page,name:string){mkdirSync(evidence,{recursive:true});await page.screenshot({path:`${evidence}/${name}.png`,fullPage:true});}
  6  | async function open(page:Page,fixture='both-third',mode=''){await page.goto(`/baccarat?baccaratFixture=${fixture}${mode?'&motion='+mode:''}`);await expect(page.getByRole('button',{name:'Place Bet · Player'})).toBeVisible();}
  7  | async function wager(page:Page,target='Player',amount='25'){await page.getByRole('button',{name:new RegExp(`^${target} `)}).click();await page.getByLabel('Wager amount',{exact:true}).fill(amount);await page.getByRole('button',{name:`Place Bet · ${target}`} ).click();}
  8  | async function authority(page:Page){return page.evaluate(()=>{const value=(window as unknown as{baccaratTestController:{getSnapshot():unknown;getDigest():string;exportReplay():unknown}}).baccaratTestController;return{view:value.getSnapshot(),digest:value.getDigest(),replay:value.exportReplay()};});}
  9  | async function pauseAt(page:Page,stage:string){await page.evaluate(stage=>{
  10 |   const observer=new MutationObserver(()=>{const layer=[...document.querySelectorAll<HTMLElement>('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')].find(element=>
  11 |     stage==='initial'?element.dataset.initialDealFlight:stage==='settlement'?element.dataset.wagerFlight:element.dataset.dealTarget?.endsWith(`/${stage}:2`));
  12 |     if(layer){for(const animation of layer.getAnimations({subtree:true})){animation.pause();animation.currentTime=stage==='initial'?20:80;}observer.disconnect();}
  13 |   });observer.observe(document.body,{childList:true});
  14 | },stage);}
  15 | async function settled(page:Page){await expect(page.locator('[data-game="baccarat"]')).toHaveAttribute('data-presentation-running','false');await expect(page.getByRole('status')).toContainText('ROUND COMPLETE');await expect(page.locator('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')).toHaveCount(0);}
  16 |
  17 | for(const [fixture,p,b,outcome]of[
  18 |   ['player-natural',2,2,'PLAYER WINS'],['banker-natural',2,2,'BANKER WINS'],['two-card',2,2,'BANKER WINS'],
  19 |   ['player-third',3,2,'PLAYER WINS'],['banker-third',2,3,'TIE'],['both-third',3,3,'PLAYER WINS'],['banker-win',3,3,'BANKER WINS'],['tie',2,2,'TIE'],
  20 | ]as const)test(`[M14-B01-${fixture}] full resolved order, faces and three wager results`,async({page})=>{
  21 |   await open(page,fixture);for(const target of['Player','Banker','Tie'])await wager(page,target);
  22 |   await page.evaluate(()=>{const targets:string[]=[];(window as unknown as{baccaratObservedTargets:string[]}).baccaratObservedTargets=targets;
  23 |     new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node instanceof HTMLElement&&node.dataset.dealTarget)targets.push(node.dataset.dealTarget.split('/').at(-1)!);}).observe(document.body,{childList:true});});
  24 |   await page.getByRole('button',{name:'Deal',exact:true}).click();const before=await authority(page);await settled(page);
  25 |   expect(await authority(page)).toEqual(before);await expect(page.getByRole('status')).toContainText(outcome);
  26 |   await expect(page.getByRole('group',{name:'Player cards',exact:true}).getByRole('img')).toHaveCount(p);
  27 |   await expect(page.getByRole('group',{name:'Banker cards',exact:true}).getByRole('img')).toHaveCount(b);
  28 |   expect(await page.evaluate(()=>(window as unknown as{baccaratObservedTargets:string[]}).baccaratObservedTargets)).toEqual(['player:0','banker:0','player:1','banker:1',...p===3?['player:2']:[],...b===3?['banker:2']:[]]);
  29 |   if(fixture==='tie'){await expect(page.locator('[data-wager-target="PLAYER"]')).toContainText('PUSH');await expect(page.locator('[data-wager-target="BANKER"]')).toContainText('PUSH');await expect(page.locator('[data-credits="available"]')).toHaveText('1,200');}
  30 |   await capture(page,`branch-${fixture}`);
  31 | });
  32 | for(const stage of['initial','player','banker','settlement'])test(`[M14-B02-${stage}] safe skip, settled authority and no stale layers`,async({page})=>{
  33 |   await open(page);await wager(page);await pauseAt(page,stage);await page.getByRole('button',{name:'Deal',exact:true}).click();
  34 |   const flight=page.locator(stage==='initial'?'[data-initial-deal-flight]':stage==='settlement'?'[data-wager-flight]':`[data-deal-target$="/${stage}:2"]`);
  35 |   await expect(flight).toHaveCount(1);await expect(flight).toHaveAttribute('aria-hidden','true');
  36 |   if(stage==='initial'){await expect(page.getByRole('status')).toContainText('DEALING');await expect(page.locator('.baccarat-hand-cards [role="img"]')).toHaveCount(0);await expect(page.locator('[aria-label="Round result"]')).toHaveCount(0);}
  37 |   if(stage==='player'||stage==='banker')await expect(page.getByRole('status')).toContainText(`${stage.toUpperCase()} DRAWS`);
  38 |   const before=await authority(page);expect((before.view as{phase:string}).phase).toBe('COMPLETE');
> 39 |   await capture(page,`flight-${stage}`);await page.getByRole('button',{name:'Skip animation'}).click();await settled(page);
     |                                                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  40 |   await expect(page.locator('.baccarat-hand-cards [role="img"]')).toHaveCount(6);expect(await authority(page)).toEqual(before);
  41 |   await expect(page.locator('[data-hand="PLAYER"] .baccarat-total')).toHaveText('Total: 9');await expect(page.locator('[data-hand="BANKER"] .baccarat-total')).toHaveText('Total: 7');
  42 |   await page.getByRole('button',{name:'Deal Again'}).click();await expect(page.getByRole('status')).toHaveText('PLACE YOUR BET');await expect(page.locator('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')).toHaveCount(0);
  43 | });
  44 | for(const [fixture,target,amount,outcome,gross,label]of[
  45 |   ['player-natural','Player','25','WIN','5000','50'],['banker-natural','Banker','1','WIN','195','1.95'],['tie','Tie','25','WIN','22500','225'],
  46 | ]as const)test(`[M14-B03-${target}] exact authority chip destination and amount`,async({page})=>{
  47 |   await open(page,fixture);await wager(page,target,amount);await pauseAt(page,'settlement');await page.getByRole('button',{name:'Deal',exact:true}).click();
  48 |   const flight=page.locator('[data-wager-flight]');await expect(flight).toHaveAttribute('data-wager-amount',gross);await expect(flight).toHaveAttribute('data-wager-outcome',outcome);await expect(flight).toHaveAttribute('data-wager-destination','local-credits');await expect(flight).toContainText(`${label} credits`);
  49 |   await capture(page,`settlement-${target.toLowerCase()}`);await page.getByRole('button',{name:'Skip animation'}).click();await settled(page);
  50 | });
  51 | test('[M14-B04] full/reduced/immediate replay equivalence, OS and mid-sequence session reduce',async({page})=>{
  52 |   const results:unknown[]=[];for(const mode of['FULL_MOTION','REDUCED_MOTION','IMMEDIATE']){
  53 |     await page.emulateMedia({reducedMotion:mode==='REDUCED_MOTION'?'reduce':'no-preference'});await open(page,'both-third',mode==='IMMEDIATE'?mode:'');await wager(page);await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);
  54 |     await expect(page.locator('[data-game="baccarat"]')).toHaveAttribute('data-baccarat-motion',mode);const value=await authority(page);results.push({digest:value.digest,replay:value.replay});
  55 |     if(mode==='REDUCED_MOTION')await capture(page,'reduced-settled');
  56 |   }expect(results[1]).toEqual(results[0]);expect(results[2]).toEqual(results[0]);
  57 |   await open(page);await wager(page);await pauseAt(page,'player');await page.getByRole('button',{name:'Deal',exact:true}).click();await expect(page.locator('[data-deal-target$="/player:2"]')).toHaveCount(1);const before=await authority(page);
  58 |   await page.getByLabel('Reduce motion',{exact:true}).check();await settled(page);expect(await authority(page)).toEqual(before);
  59 | });
  60 | for(const width of[1280,768,320])test(`[M14-B05-${width}] responsive visible cards, formal Dealer and local HUD`,async({page})=>{
  61 |   await page.setViewportSize({width,height:width===768?1024:900});await open(page);await wager(page);await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);
  62 |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.getByRole('img',{name:/Dealer: Celestine/})).toBeVisible();await expect(page.getByRole('img',{name:/Your character: Roland/})).toBeVisible();await capture(page,`responsive-${width}`);
  63 | });
  64 | test('[M14-B06] real React unmount cancels overlay and late completion',async({page})=>{
  65 |   await open(page);await wager(page);await pauseAt(page,'banker');await page.getByRole('button',{name:'Deal',exact:true}).click();await expect(page.locator('[data-deal-target$="/banker:2"]')).toHaveCount(1);const before=await authority(page);
  66 |   await page.evaluate(()=>(window as unknown as{baccaratTestUnmount():void}).baccaratTestUnmount());await expect(page.locator('[data-game="baccarat"]')).toHaveCount(0);await expect(page.locator('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')).toHaveCount(0);expect(await authority(page)).toEqual(before);
  67 | });
  68 | test('[M14-B07] existing native video tooling records representative six-card motion',async({browser,baseURL})=>{
  69 |   mkdirSync(evidence,{recursive:true});const context=await browser.newContext({baseURL,reducedMotion:'no-preference',viewport:{width:1280,height:1500},recordVideo:{dir:`${evidence}/video`,size:{width:1280,height:1500}}});
  70 |   const page=await context.newPage(),video=page.video()!;try{await open(page);await wager(page);await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);await capture(page,'video-final-six');}finally{await context.close();await video.saveAs(`${evidence}/baccarat-six-card.webm`);}
  71 | });
  72 |
```
