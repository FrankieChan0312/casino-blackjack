# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\compatibility.spec.ts >> [T10-B01-1] actual 1-player three-mode replay/package/audit equality and round/table lifecycle
- Location: tests\browser\m10\compatibility.spec.ts:32:84

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'New table · reset to 1000 credits', exact: true })
    - locator resolved to <button disabled>New table · reset to 1000 credits</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    28 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

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
            - paragraph [ref=e16]: Waiting for the initial deal
          - group "Shoe and deal origin" [ref=e17]:
            - paragraph [ref=e19]:
              - text: Shoe · Deal origin
              - generic [ref=e20]: 6 decks
          - paragraph [ref=e21]:
            - text: BLACKJACK PAYS 3:2
            - generic [ref=e22]: DEALER STANDS ON ALL 17
        - region "Seat 4" [ref=e24]:
          - group "Your player HUD" [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]:
                - 'img "Your avatar: Roland, Male Human Knight" [ref=e28]'
                - generic [ref=e29]:
                  - paragraph [ref=e30]: YOU
                  - heading "Roland" [level=2] [ref=e31]
                  - paragraph [ref=e32]: Male Human Knight
                  - paragraph [ref=e33]: Seat 4 · You · Human
              - paragraph [ref=e34]: "MAIN: 0 credits"
            - generic [ref=e36]:
              - generic [aria-hidden] [ref=e37]:
                - generic [ref=e38]: ♠
                - generic [ref=e39]: ♠
              - paragraph [ref=e40]: Your cards will be dealt here.
      - region "Your gameplay controls" [ref=e41]:
        - status [ref=e43]: Betting open
        - region "Your credits" [ref=e44]:
          - heading "Credits" [level=2] [ref=e45]
          - generic [ref=e46]:
            - generic [ref=e47]:
              - term [ref=e48]: Available
              - definition [ref=e49]: "900"
            - generic [ref=e50]:
              - term [ref=e51]: Reserved / current exposure
              - definition [ref=e52]: "0"
            - generic [ref=e53]:
              - term [ref=e54]: Pending return
              - definition [ref=e55]: "0"
        - region "Your wager" [ref=e56]:
          - heading "Take your seat" [level=2] [ref=e57]
          - generic [ref=e58]:
            - generic [ref=e59]:
              - text: Your main wager
              - generic [ref=e60]: (credits)
            - spinbutton "Your main wager (credits)" [active] [ref=e61]: "100"
            - generic [ref=e62]:
              - button "Choose 10 credits" [ref=e63] [cursor=pointer]: "10"
              - button "Choose 25 credits" [ref=e64] [cursor=pointer]: "25"
              - button "Choose 100 credits" [pressed] [ref=e65] [cursor=pointer]: "100"
            - button "Deal" [ref=e66] [cursor=pointer]
          - paragraph [ref=e67]: 10–1000 whole credits. Your guests are already ready to play.
          - group [ref=e68]:
            - generic "Optional wagers" [ref=e69] [cursor=pointer]
    - paragraph [ref=e70]: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools" [ref=e71]:
    - generic [ref=e72]:
      - paragraph [ref=e73]: 1 players · 1 human · 0 computer guests
      - button "New table · reset to 1000 credits" [disabled] [ref=e74]
    - generic [ref=e76]:
      - checkbox "Reduce motion" [ref=e77]
      - text: Reduce motion
    - group [ref=e78]:
      - generic "Change Character · Roland" [ref=e79] [cursor=pointer]
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
    - group [ref=e80]:
      - generic "Developer / demo tools" [ref=e81] [cursor=pointer]
      - region "Demo and audit tools" [ref=e82]:
        - heading "Demo and audit tools" [level=2] [ref=e83]
        - paragraph [ref=e84]: "Profile: Classic Blackjack · Reproducible seeded demo"
        - paragraph [ref=e85]: "Player Mode: guests and dealer progress automatically."
        - button "Open manual demo (resets credits)" [ref=e86] [cursor=pointer]
        - group [ref=e87]:
          - generic "Advanced demo settings" [ref=e88] [cursor=pointer]
          - option "Classic Blackjack (v1.2 · Re-split Aces)" [selected]
          - option "Five-Card Charlie Demo (v1.2 · Re-split Aces)"
          - option "Classic Blackjack"
          - option "Five-Card Charlie Demo"
        - paragraph [ref=e89]: Full replay export requires a finalized seeded session.
        - group [ref=e90]:
          - generic "Public audit history (31 events)" [ref=e91] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import { mkdirSync, writeFileSync } from 'node:fs';
  3   | import { Buffer } from 'node:buffer';
  4   |
  5   | test.use({reducedMotion:'no-preference'});
  6   | const modes=['FULL_MOTION','REDUCED_MOTION','IMMEDIATE'] as const;
  7   | const overlays='[data-initial-deal-flight],[data-action-card-flight],[data-split-flight],[data-dealer-reveal],[data-wager-flight]';
  8   | async function open(page:Page,fixture:string,mode:typeof modes[number]='FULL_MOTION') {
  9   |   await page.emulateMedia({reducedMotion:mode==='REDUCED_MOTION'?'reduce':'no-preference'});
  10  |   await page.goto(`/?fixture=${fixture}${mode==='IMMEDIATE'?'&motion=IMMEDIATE':''}`);
  11  |   await expect(page.locator('.game-scene')).toHaveAttribute('data-presentation-mode',mode);
  12  | }
  13  | async function settled(page:Page) {
  14  |   for(const flag of ['initial-deal','player-actions','dealer-actions','wagers']) await expect(page.locator('.game-scene')).toHaveAttribute(`data-${flag}-running`,'false');
  15  |   await expect(page.locator(overlays)).toHaveCount(0);
  16  | }
  17  | async function deal(page:Page) {
  18  |   await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();
  19  |   await settled(page);
  20  | }
  21  | async function finish(page:Page) {
  22  |   for(let index=0;index<10 && !await page.getByRole('button',{name:'Deal Again',exact:true}).count();index++) {
  23  |     const decline=page.getByRole('button',{name:'Decline',exact:true});
  24  |     if(await decline.count()) await decline.click(); else await page.getByRole('button',{name:'Stand',exact:true}).click();
  25  |   }
  26  |   await expect(page.getByRole('button',{name:'Deal Again',exact:true})).toBeEnabled();await settled(page);
  27  | }
  28  | async function capture(page:Page,path:string) {
  29  |   const cdp=await page.context().newCDPSession(page),shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
  30  |   await cdp.detach();writeFileSync(path,Buffer.from(shot.data,'base64'));
  31  | }
  32  | for(const [count,width,height] of [[1,1280,900],[4,768,1024],[7,320,720]] as const)test(`[T10-B01-${count}] actual ${count}-player three-mode replay/package/audit equality and round/table lifecycle`,async({page})=>{
  33  |   const receipts=[];
  34  |   for(const mode of modes) {
  35  |     await page.setViewportSize({width,height});await open(page,'player-setup',mode);
  36  |     await page.getByLabel('Total players',{exact:true}).selectOption(String(count));await page.getByRole('button',{name:'Start table',exact:true}).click();
  37  |     const dealer=await page.locator('.dealer-zone').getAttribute('data-dealer-character');
  38  |     await page.evaluate(()=>{
  39  |       const timing:{start:number|null;end:number|null;flights:number}={start:null,end:null,flights:0};(window as unknown as {initialTiming:typeof timing}).initialTiming=timing;
  40  |       new MutationObserver(records=>{for(const record of records){for(const node of record.addedNodes)if(node instanceof HTMLElement&&node.dataset.initialDealFlight){timing.start??=performance.now();timing.flights++;}
  41  |         if(record.type==='attributes'&&record.target instanceof HTMLElement&&record.target.dataset.initialDealRunning==='false'&&timing.start!==null) timing.end??=performance.now();
  42  |       }}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-initial-deal-running']});
  43  |     });
  44  |     await deal(page);await expect(page.locator('[data-seat-anchor]')).toHaveCount(count);
  45  |     const timing=await page.evaluate(()=>(window as unknown as {initialTiming:{start:number|null;end:number|null;flights:number}}).initialTiming);
  46  |     if(mode==='FULL_MOTION'){expect(timing.flights).toBe(count===1?4:count===4?10:16);expect(timing.end!-timing.start!).toBeLessThanOrEqual(2500);}else expect(timing.flights).toBe(0);
  47  |     const root=`docs/M10_T10_EVIDENCE/browser/${Date.now()}-${count}-${mode}`;mkdirSync(root,{recursive:true});await capture(page,`${root}/initial-settled.png`);
  48  |     await finish(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  49  |     await page.screenshot({path:`${root}/round-settled.png`,fullPage:true});
  50  |     const credits=await page.getByRole('region',{name:'Your credits',exact:true}).locator('dd').allTextContents();
  51  |     const cards=await page.locator('[data-card-slot]').evaluateAll(elements=>elements.map(element=>[element.getAttribute('data-card-slot'),element.getAttribute('aria-label'),getComputedStyle(element).opacity]));
  52  |     await page.getByText('Developer / demo tools',{exact:true}).click();await page.getByRole('button',{name:'View replay package',exact:true}).click();
  53  |     const packet=JSON.parse(await page.getByLabel('Completed replay JSON',{exact:true}).inputValue());
  54  |     await page.getByRole('button',{name:'Replay completed session',exact:true}).click();await expect(page.getByRole('region',{name:'Replay result',exact:true})).toBeVisible();
  55  |     const fingerprint=await page.locator('.replay-result > p').first().textContent(),audit=await page.locator('.audit-list').textContent();
  56  |     await expect(page.locator(overlays)).toHaveCount(0);receipts.push({credits,cards,packet,fingerprint,audit,dealer});
  57  |     writeFileSync(`${root}/receipt.json`,JSON.stringify({count,mode,viewport:{width,height},initialTiming:timing,credits,fingerprint,replay:'immediate terminal summary; original live table preserved',files:['initial-settled.png','round-settled.png']},null,2));
  58  |     await page.getByRole('button',{name:'Deal Again',exact:true}).click();await settled(page);
  59  |     await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-character',dealer!);await expect(page.locator('[data-seat-anchor]')).toHaveCount(count);
> 60  |     await page.getByRole('button',{name:'New table · reset to 1000 credits',exact:true}).click();await settled(page);
      |                                                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  61  |     await expect(page.locator('[data-card-slot]')).toHaveCount(0);await page.getByLabel('Total players',{exact:true}).selectOption(String(count));
  62  |     await page.getByRole('button',{name:'Start table',exact:true}).click();await settled(page);
  63  |     await expect(page.locator('.dealer-zone')).not.toHaveAttribute('data-dealer-character',dealer!);await expect(page.locator('[data-seat-anchor]')).toHaveCount(count);
  64  |   }
  65  |   expect(receipts[1]).toEqual(receipts[0]);expect(receipts[2]).toEqual(receipts[0]);
  66  | });
  67  | for(const mode of modes)test(`[T10-B02-${mode}] one-player forced Double, two Dealer draws and exact final credits`,async({page})=>{
  68  |   await open(page,'player-one-actions',mode);await deal(page);await page.getByRole('button',{name:'Double',exact:true}).click();await settled(page);
  69  |   await expect(page.locator('#player-hand [data-card-slot]')).toHaveCount(3);await expect(page.locator('.dealer-zone [data-card-slot]')).toHaveCount(4);
  70  |   await expect(page.locator('.dealer-total')).toHaveText('Total: 21');await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(['800','0','0']);
  71  | });
  72  | for(const mode of modes)test(`[T10-B03-${mode}] four RSA leaves and Insurance/Even Money settle without stale cards or money`,async({page})=>{
  73  |   await open(page,'player-rsa-cap',mode);await deal(page);
  74  |   for(let index=0;index<3;index++) await page.getByRole('button',{name:'Split',exact:true}).click();await settled(page);
  75  |   await expect(page.locator('.hud-hand')).toHaveCount(4);await expect(page.locator('#player-hand [data-card-slot]')).toHaveCount(8);
  76  |   await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(['600','0','0']);
  77  |   await open(page,'player-ace',mode);await deal(page);await page.getByRole('button',{name:'Buy Insurance',exact:true}).click();await settled(page);
  78  |   await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label','Hidden dealer card');await finish(page);
  79  |   await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(['850','0','0']);
  80  |   await open(page,'player-even-money',mode);await deal(page);await page.getByRole('button',{name:'Take Even Money',exact:true}).click();await settled(page);
  81  |   await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(['1,100','0','0']);
  82  | });
  83  | async function pausePhase(page:Page,phase:string) {
  84  |   await page.evaluate(phase=>{
  85  |     const observer=new MutationObserver(()=>{
  86  |       const selector=phase==='initial'?'[data-initial-deal-flight]':phase==='split'?'[data-split-flight]':phase==='reveal'?'[data-dealer-reveal]':phase==='draw'?'[data-action-card-flight][data-action-reason="DEALER"]':phase==='settlement'?'[data-wager-flight][data-wager-stage="SETTLE_RESULT"][data-wager-seat="4"]':'[data-action-card-flight]';
  87  |       const element=document.querySelector(selector);if(element){element.getAnimations({subtree:true}).forEach(animation=>{animation.pause();animation.currentTime=45;});observer.disconnect();}
  88  |     });observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-dealer-reveal']});
  89  |   },phase);
  90  | }
  91  | for(const phase of ['initial','Hit','Double','split','reveal','draw','settlement'])test(`[T10-B04-${phase}] native mid-sequence skip removes every overlay and presents exact current state`,async({page})=>{
  92  |   await open(page,phase==='split'?'player-split':phase==='draw'?'player-dealer-multi':'player-loss');
  93  |   if(phase==='initial'){await pausePhase(page,phase);await page.getByRole('button',{name:'Deal',exact:true}).click();}
  94  |   else{await deal(page);await pausePhase(page,phase);await page.getByRole('button',{name:phase==='split'?'Split':['reveal','draw','settlement'].includes(phase)?'Stand':phase,exact:true}).click();}
  95  |   const selector=phase==='initial'?'[data-initial-deal-flight]':phase==='split'?'[data-split-flight]':phase==='reveal'?'[data-dealer-reveal]':phase==='draw'?'[data-action-card-flight][data-action-reason="DEALER"]':phase==='settlement'?'[data-wager-flight][data-wager-stage="SETTLE_RESULT"][data-wager-seat="4"]':'[data-action-card-flight]';
  96  |   await expect(page.locator(selector)).toHaveCount(1);const dealer=await page.locator('.dealer-zone').getAttribute('data-dealer-character');
  97  |   await page.getByRole('button',{name:'Skip animations',exact:true}).click();await settled(page);
  98  |   await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-character',dealer!);await expect(page.locator('[data-deal-visible="false"]')).toHaveCount(0);
  99  |   if(phase==='Hit'||phase==='Double') await expect(page.locator('#player-hand [data-card-slot]')).toHaveCount(3);
  100 |   if(phase==='split') await expect(page.locator('.hud-hand')).toHaveCount(2);
  101 |   if(phase==='draw') await expect(page.locator('.dealer-total')).toHaveText('Total: 17');
  102 | });
  103 | test('[T10-B05] session preference flushes native Hit, uses a 44px keyboard target and persists across round/table',async({page})=>{
  104 |   await open(page,'player-loss');await deal(page);await pausePhase(page,'Hit');await page.getByRole('button',{name:'Hit',exact:true}).click();await expect(page.locator('[data-action-card-flight]')).toHaveCount(1);
  105 |   const before=await page.getByRole('region',{name:'Your credits',exact:true}).locator('dd').allTextContents();const audit=await page.locator('.audit-list').textContent();
  106 |   const checkbox=page.getByLabel('Reduce motion',{exact:true});await checkbox.focus();await page.keyboard.press('Space');await expect(checkbox).toBeChecked();await settled(page);
  107 |   await expect(page.locator('.game-scene')).toHaveAttribute('data-presentation-mode','REDUCED_MOTION');expect(await page.getByRole('region',{name:'Your credits',exact:true}).locator('dd').allTextContents()).toEqual(before);
  108 |   expect(await page.locator('.audit-list').textContent()).toBe(audit);expect(await checkbox.locator('..').evaluate(element=>element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  109 |   await finish(page);await page.getByRole('button',{name:'Deal Again',exact:true}).click();await settled(page);await expect(checkbox).toBeChecked();
  110 |   await page.getByRole('button',{name:'New table · reset to 1000 credits',exact:true}).click();await settled(page);await expect(checkbox).toBeChecked();await checkbox.uncheck();await expect(page.locator('.game-scene')).toHaveAttribute('data-presentation-mode','FULL_MOTION');
  111 | });
  112 | test('[T10-B06] actual media preference mid-Double clears all native controls and cannot be overridden',async({page})=>{
  113 |   await open(page,'player-loss');await deal(page);await pausePhase(page,'Double');await page.getByRole('button',{name:'Double',exact:true}).click();await expect(page.locator('[data-action-card-flight]')).toHaveCount(1);
  114 |   await page.emulateMedia({reducedMotion:'reduce'});await settled(page);await expect(page.getByLabel('Reduce motion',{exact:true})).toBeChecked();await expect(page.getByLabel('Reduce motion',{exact:true})).toBeDisabled();
  115 |   await expect(page.locator('#player-hand [data-card-slot]')).toHaveCount(3);await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(['800','0','0']);
  116 | });
  117 | test('[T10-B07] synthetic visibility suspension handles subsequent accepted Stand before resume without a stale flip/payout',async({page})=>{
  118 |   await open(page,'player-loss');await deal(page);await pausePhase(page,'Hit');await page.getByRole('button',{name:'Hit',exact:true}).click();await expect(page.locator('[data-action-card-flight]')).toHaveCount(1);
  119 |   await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await settled(page);
  120 |   await page.getByRole('button',{name:'Stand',exact:true}).click();await settled(page);await expect(page.locator('[data-card-slot="dealer:1"]')).toHaveAttribute('aria-label','9 of diamonds');
  121 |   await page.evaluate(()=>{delete (document as unknown as {hidden?:boolean}).hidden;document.dispatchEvent(new Event('visibilitychange'));});await settled(page);
  122 |   await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(['900','0','0']);
  123 | });
  124 | test('[T10-B08] real secondary App unmount cancels native transfer; later accepted commands create no ghost DOM',async({page})=>{
  125 |   await open(page,'player-loss');await settled(page);
  126 |   const result=await page.evaluate(async()=>{
  127 |     const appUrl='/src/ui/App.tsx',fixtureUrl='/tests/browser/fixtures.ts',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';
  128 |     const {App}=await import(appUrl),{createFixtureController}=await import(fixtureUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);
  129 |     const c=createFixtureController('player-loss'),host=document.createElement('div');document.body.append(host);const root=ReactDOM.createRoot(host);
  130 |     let signal!:()=>void;let acknowledged=new Promise<void>(resolve=>{signal=resolve;});const acknowledge=c.presentation.acknowledge;c.presentation.acknowledge=(revision:number)=>{acknowledge(revision);signal();};
  131 |     root.render(React.createElement(App,{controller:c}));await acknowledged;
  132 |     acknowledged=new Promise<void>(resolve=>{signal=resolve;});c.dispatch({type:'DEAL',amount:200});await acknowledged;
  133 |     const before=JSON.stringify(c.getSnapshot()),active=document.querySelectorAll('[data-wager-flight],[data-initial-deal-flight]').length;
  134 |     root.unmount();await Promise.resolve();const unchanged=JSON.stringify(c.getSnapshot())===before,empty=host.childNodes.length===0;
  135 |     const accepted=c.dispatch({type:'ACT',action:'HIT',handId:'round-1/seat-4'});await Promise.resolve();host.remove();
  136 |     return{active,unchanged,empty,accepted,overlays:document.querySelectorAll('[data-wager-flight],[data-initial-deal-flight],[data-action-card-flight],[data-split-flight],[data-dealer-reveal]').length};
  137 |   });expect(result.active).toBeGreaterThan(0);expect(result).toMatchObject({unchanged:true,empty:true,accepted:true,overlays:0});
  138 | });
  139 |
```
