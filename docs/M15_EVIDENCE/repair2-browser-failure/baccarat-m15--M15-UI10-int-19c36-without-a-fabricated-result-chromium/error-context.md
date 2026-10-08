# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: baccarat\m15.spec.ts >> [M15-UI10] integrity is unavailable, explicit refund retires shoe, next replaces without a fabricated result
- Location: tests\browser\baccarat\m15.spec.ts:149:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://127.0.0.1:4173/baccarat?baccaratFixture=m15-integrity", waiting until "load"

```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test';
  2   | import { mkdirSync, writeFileSync } from 'node:fs';
  3   | const evidence='.git/m15/visual';
  4   | const labels={PLAYER:'Player',BANKER:'Banker',TIE:'Tie',PLAYER_PAIR:'Player Pair',BANKER_PAIR:'Banker Pair'};
  5   | type Target=keyof typeof labels;
  6   | async function open(page:Page,fixture='m15-both-pair',motion=''){
> 7   |   await page.goto(`/baccarat?baccaratFixture=${fixture}${motion?'&motion='+motion:''}`);
      |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  8   |   await expect(page.getByRole('button',{name:'Place Bet · Player',exact:true})).toBeVisible();
  9   | }
  10  | async function bet(page:Page,target:Target,amount='25'){
  11  |   await page.locator(`[data-wager-target="${target}"] button`).click();
  12  |   await page.getByLabel('Wager amount',{exact:true}).fill(amount);
  13  |   await page.getByRole('button',{name:`Place Bet · ${labels[target]}`,exact:true}).click();
  14  | }
  15  | async function settled(page:Page){
  16  |   await expect(page.locator('[data-game="baccarat"]')).toHaveAttribute('data-presentation-running','false');
  17  |   await expect(page.locator('.baccarat-status')).toContainText('ROUND COMPLETE');
  18  |   await expect(page.locator('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')).toHaveCount(0);
  19  | }
  20  | async function capture(page:Page,name:string){mkdirSync(evidence,{recursive:true});await page.screenshot({path:`${evidence}/${name}.png`,fullPage:true});}
  21  | async function authority(page:Page){return page.evaluate(()=>{
  22  |   const controller=(window as unknown as{baccaratTestController:{getDigest():string;getSnapshot():unknown;exportReplay():unknown}}).baccaratTestController;
  23  |   return{digest:controller.getDigest(),view:controller.getSnapshot(),replay:controller.exportReplay()};
  24  | });}
  25  | for(const target of ['PLAYER','BANKER','TIE'] as const)test(`[M15-UI01-${target}] main wager only`,async({page})=>{
  26  |   await open(page,'m15-pair-loss');await bet(page,target);await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);
  27  |   await expect(page.locator('[data-credits="available"]')).toHaveText(target==='PLAYER'?'1,025':'975');
  28  |   await expect(page.locator('[data-wager-target="PLAYER_PAIR"]')).toContainText('No bet');
  29  |   await expect(page.locator('[data-wager-target="BANKER_PAIR"]')).toContainText('No bet');
  30  | });
  31  | const combinations:readonly(readonly Target[])[]=[['PLAYER_PAIR'],['BANKER_PAIR'],['PLAYER_PAIR','BANKER_PAIR'],['PLAYER','PLAYER_PAIR'],['BANKER','BANKER_PAIR'],['TIE','PLAYER_PAIR','BANKER_PAIR']];
  32  | for(const [index,targets]of combinations.entries())test(`[M15-UI02-${index}] optional wager composition ${targets.join('+')}`,async({page})=>{
  33  |   await open(page);for(const target of targets)await bet(page,target);
  34  |   await expect(page.locator('[data-credits="reserved"]')).toHaveText(String(targets.length*25));
  35  |   await capture(page,`selected-${index}`);
  36  |   await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);
  37  |   for(const target of targets)await expect(page.locator(`[data-wager-target="${target}"]`)).toContainText(target==='PLAYER'||target==='BANKER'?'PUSH':'WIN');
  38  |   const expected=[1275,1275,1550,1275,1275,1750][index];
  39  |   await expect(page.locator('[data-credits="available"]')).toHaveText(expected.toLocaleString('en-US'));
  40  |   await capture(page,`settled-${index}`);
  41  |   await page.getByRole('button',{name:'Repeat Bet'}).click();
  42  |   for(const target of targets)await expect(page.locator(`[data-wager-target="${target}"] [data-wager-units]`)).toHaveAttribute('data-wager-units','2500');
  43  |   await expect(page.locator('[data-credits="reserved"]')).toHaveText(String(targets.length*25));
  44  |   await page.getByRole('button',{name:'Clear Bets'}).click();await expect(page.locator('[data-credits="reserved"]')).toHaveText('0');
  45  | });
  46  | for(const [fixture,target,result]of[
  47  |   ['m15-player-pair','PLAYER_PAIR','WIN'],['m15-banker-pair','BANKER_PAIR','WIN'],['m15-pair-loss','PLAYER_PAIR','LOSS'],['m15-pair-loss','BANKER_PAIR','LOSS'],
  48  | ]as const)test(`[M15-UI03-${fixture}-${target}] first two rank result and exact payout`,async({page})=>{
  49  |   await open(page,fixture);await bet(page,target,'10');await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);
  50  |   await expect(page.locator(`[data-wager-target="${target}"]`)).toContainText(result);
  51  |   await expect(page.locator('[data-credits="available"]')).toHaveText(result==='WIN'?'1,110':'990');
  52  |   await capture(page,`${fixture}-${target.toLowerCase()}`);
  53  | });
  54  | test('[M15-UI04] exposure rejection and single main are authoritative, Clear atomic',async({page})=>{
  55  |   await open(page);await bet(page,'PLAYER','1000');const before=await authority(page);
  56  |   await bet(page,'PLAYER_PAIR','1');await expect(page.getByRole('alert')).toContainText('Insufficient');expect(await authority(page)).toEqual(before);
  57  |   await bet(page,'BANKER','1');await expect(page.getByRole('alert')).toContainText('one main');expect(await authority(page)).toEqual(before);
  58  |   await page.getByRole('button',{name:'Clear Bets'}).click();await expect(page.locator('[data-credits="available"]')).toHaveText('1,000');
  59  | });
  60  | test('[M15-UI05] cut reached, valid six-card round completes, next shoe changes ID/burn without credit/history reset; Repeat includes both pairs',async({page})=>{
  61  |   await open(page,'m15-cut');await capture(page,'shoe-normal');
  62  |   for(const target of ['BANKER','PLAYER_PAIR','BANKER_PAIR'] as const)await bet(page,target,'10');
  63  |   await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);
  64  |   await expect(page.locator('.baccarat-shoe')).toContainText('Cut card: REACHED');
  65  |   await expect(page.locator('[data-shoe-status]')).toHaveAttribute('data-shoe-status','CLOSED');
  66  |   await expect(page.locator('.baccarat-hand-cards [role="img"]')).toHaveCount(6);await capture(page,'cut-reached-closed');
  67  |   const before=await authority(page),view=before.view as{shoe:{id:string};history:unknown[];availableUnits:number};
  68  |   expect(view.history).toHaveLength(1);expect(view.availableUnits).toBe(122000);
  69  |   await page.getByRole('button',{name:'Repeat Bet'}).click();
  70  |   const after=await authority(page),next=after.view as{shoe:{id:string;generation:number;totalBurned:number};history:unknown[];availableUnits:number};
  71  |   expect(next.shoe.id).not.toBe(view.shoe.id);expect(next.shoe.generation).toBe(2);expect(next.shoe.totalBurned).toBeGreaterThanOrEqual(2);
  72  |   expect(next.history).toEqual(view.history);expect(next.availableUnits).toBe(119000);
  73  |   await expect(page.locator('[data-shoe-status]')).toContainText('NEW SHOE READY');
  74  |   await expect(page.locator('.baccarat-shoe')).toContainText('Cut card: ACTIVE');await capture(page,'new-shoe');
  75  |   for(const target of ['BANKER','PLAYER_PAIR','BANKER_PAIR'])await expect(page.locator(`[data-wager-target="${target}"] [data-wager-units]`)).toHaveAttribute('data-wager-units','1000');
  76  |   expect(JSON.stringify(after.view)).not.toMatch(/orderedIds|deckIndex|seed|cursor/);
  77  | });
  78  | for(const width of [1280,768,320])test(`[M15-UI06-${width}] responsive Pair controls keyboard/focus/touch/200% text`,async({page})=>{
  79  |   await page.setViewportSize({width,height:900});await open(page);await capture(page,`table-${width}`);
  80  |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  81  |   const button=page.getByRole('button',{name:'Player Pair 11:1',exact:true});
  82  |   await button.focus();await expect(button).toBeFocused();expect(await button.evaluate(element=>getComputedStyle(element).outlineStyle)).not.toBe('none');
  83  |   await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-pressed','true');
  84  |   for(const target of ['PLAYER_PAIR','BANKER_PAIR'])expect((await page.locator(`[data-wager-target="${target}"] button`).boundingBox())!.height).toBeGreaterThanOrEqual(44);
  85  |   await page.getByRole('button',{name:'Place Bet · Player Pair',exact:true}).focus();await page.keyboard.press('Enter');
  86  |   await bet(page,'BANKER_PAIR');await page.getByRole('button',{name:'Deal',exact:true}).focus();await page.keyboard.press('Enter');await settled(page);await capture(page,`pairs-settled-${width}`);
  87  |   await page.addStyleTag({content:'html { font-size:200% !important; }'});
  88  |   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  89  |   const shoe=(await page.locator('.baccarat-shoe').boundingBox())!,status=(await page.locator('.baccarat-status').boundingBox())!;
  90  |   expect(shoe.y+shoe.height).toBeLessThanOrEqual(status.y);await capture(page,`text-200-${width}`);
  91  | });
  92  | test('[M15-UI07] FULL/REDUCED/IMMEDIATE and skip pair settlement yield identical authority; results precede third cards',async({page})=>{
  93  |   test.setTimeout(60000);const values:unknown[]=[];
  94  |   for(const mode of ['FULL_MOTION','REDUCED_MOTION','IMMEDIATE']){
  95  |     await page.emulateMedia({reducedMotion:mode==='REDUCED_MOTION'?'reduce':'no-preference'});await open(page,'m15-both-pair',mode==='IMMEDIATE'?mode:'');
  96  |     for(const target of ['BANKER','PLAYER_PAIR','BANKER_PAIR'] as const)await bet(page,target,'10');
  97  |     await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);const result=await authority(page);values.push({digest:result.digest,replay:result.replay});
  98  |     await expect(page.locator('[data-game="baccarat"]')).toHaveAttribute('data-baccarat-motion',mode);
  99  |   }
  100 |   expect(values[1]).toEqual(values[0]);expect(values[2]).toEqual(values[0]);
  101 |   await open(page);await bet(page,'PLAYER_PAIR','10');await bet(page,'BANKER_PAIR','10');
  102 |   await page.evaluate(()=>{
  103 |     const observer=new MutationObserver(()=>{const layer=document.querySelector<HTMLElement>('[data-deal-target$="/player:2"]');if(layer){for(const animation of layer.getAnimations({subtree:true})){animation.pause();animation.currentTime=50;}observer.disconnect();}});
  104 |     observer.observe(document.body,{childList:true});
  105 |   });
  106 |   await page.getByRole('button',{name:'Deal',exact:true}).click();
  107 |   await expect(page.locator('[data-deal-target$="/player:2"]')).toHaveCount(1);
```