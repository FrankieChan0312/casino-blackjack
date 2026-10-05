# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10\compatibility.spec.ts >> [T10-B06] actual media preference mid-Double clears all native controls and cannot be overridden
- Location: tests\browser\m10\compatibility.spec.ts:112:1

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('.game-scene')
Expected: "false"
Received: "true"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('.game-scene') with timeout 5000ms
  - waiting for locator('.game-scene')
    13 × locator resolved to <section class="game-scene" data-wagers-running="true" data-initial-deal-delivered="10" aria-label="Blackjack game scene" data-initial-deal-running="false" data-player-actions-running="true" data-dealer-actions-running="true" data-presentation-mode="FULL_MOTION">…</section>
       - unexpected value "true"

```

```yaml
- region "Blackjack game scene":
  - heading "Casino Blackjack" [level=1]
  - paragraph: Simulation credits only — no real-money gambling. Credits have no redemption value.
  - region "Blackjack table"
  - region "Your gameplay controls"
  - paragraph: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
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
> 14  |   for(const flag of ['initial-deal','player-actions','dealer-actions','wagers']) await expect(page.locator('.game-scene')).toHaveAttribute(`data-${flag}-running`,'false');
      |                                                                                                                            ^ Error: expect(locator).toHaveAttribute(expected) failed
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
  60  |     await page.getByRole('button',{name:'New table · reset to 1000 credits',exact:true}).click();await settled(page);
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
```
