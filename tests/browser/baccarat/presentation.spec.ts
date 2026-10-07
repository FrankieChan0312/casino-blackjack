import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { join } from 'node:path';
import { resolveGitDir } from '../../../scripts/git-directory.mjs';
const evidence=join(resolveGitDir(),'overnight/visual/m14');
test.use({reducedMotion:'no-preference',viewport:{width:1280,height:1500}});
async function capture(page:Page,name:string){
  mkdirSync(evidence,{recursive:true});
  const layers=page.locator('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]'),before=await layers.count();
  // Chromium captureBeyondViewport also temporarily resizes. Active frames use only the established viewport.
  const cdp=await page.context().newCDPSession(page);
  try{const metrics=await cdp.send('Page.getLayoutMetrics'),size=metrics.contentSize;
    const result=await cdp.send('Page.captureScreenshot',before?{format:'png',fromSurface:true,captureBeyondViewport:false}
      :{format:'png',fromSurface:true,captureBeyondViewport:true,clip:{x:0,y:0,width:Math.ceil(size.width),height:Math.ceil(size.height),scale:1}});
    writeFileSync(`${evidence}/${name}.png`,Buffer.from(result.data,'base64'));
  }finally{await cdp.detach();}
  const after=await layers.count();expect(after).toBe(before);
  writeFileSync(`${evidence}/${name}.json`,JSON.stringify({capture:before?'Native established viewport only; no resize':'Native settled full-page capture',beforeLayers:before,afterLayers:after},null,2)+'\n');
}
async function open(page:Page,fixture='both-third',mode=''){await page.goto(`/baccarat?baccaratFixture=${fixture}${mode?'&motion='+mode:''}`);await expect(page.getByRole('button',{name:'Place Bet · Player'})).toBeVisible();}
async function wager(page:Page,target='Player',amount='25'){await page.getByRole('button',{name:new RegExp(`^${target} `)}).click();await page.getByLabel('Wager amount',{exact:true}).fill(amount);await page.getByRole('button',{name:`Place Bet · ${target}`} ).click();}
async function authority(page:Page){return page.evaluate(()=>{const value=(window as unknown as{baccaratTestController:{getSnapshot():unknown;getDigest():string;exportReplay():unknown}}).baccaratTestController;return{view:value.getSnapshot(),digest:value.getDigest(),replay:value.exportReplay()};});}
async function pauseAt(page:Page,stage:string){await page.evaluate(stage=>{
  const observer=new MutationObserver(()=>{const layer=[...document.querySelectorAll<HTMLElement>('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')].find(element=>
    stage==='initial'?element.dataset.initialDealFlight:stage==='settlement'?element.dataset.wagerFlight:element.dataset.dealTarget?.endsWith(`/${stage}:2`));
    if(layer){for(const animation of layer.getAnimations({subtree:true})){animation.pause();animation.currentTime=stage==='initial'?20:80;}observer.disconnect();}
  });observer.observe(document.body,{childList:true});
},stage);}
async function settled(page:Page){await expect(page.locator('[data-game="baccarat"]')).toHaveAttribute('data-presentation-running','false');await expect(page.getByRole('status')).toContainText('ROUND COMPLETE');await expect(page.locator('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')).toHaveCount(0);}

for(const [fixture,p,b,outcome]of[
  ['player-natural',2,2,'PLAYER WINS'],['banker-natural',2,2,'BANKER WINS'],['two-card',2,2,'BANKER WINS'],
  ['player-third',3,2,'PLAYER WINS'],['banker-third',2,3,'TIE'],['both-third',3,3,'PLAYER WINS'],['banker-win',3,3,'BANKER WINS'],['tie',2,2,'TIE'],
]as const)test(`[M14-B01-${fixture}] full resolved order, faces and three wager results`,async({page})=>{
  await open(page,fixture);for(const target of['Player','Banker','Tie'])await wager(page,target);
  await page.evaluate(()=>{const targets:string[]=[];(window as unknown as{baccaratObservedTargets:string[]}).baccaratObservedTargets=targets;
    new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node instanceof HTMLElement&&node.dataset.dealTarget)targets.push(node.dataset.dealTarget.split('/').at(-1)!);}).observe(document.body,{childList:true});});
  await page.getByRole('button',{name:'Deal',exact:true}).click();const before=await authority(page);await settled(page);
  expect(await authority(page)).toEqual(before);await expect(page.getByRole('status')).toContainText(outcome);
  await expect(page.getByRole('group',{name:'Player cards',exact:true}).getByRole('img')).toHaveCount(p);
  await expect(page.getByRole('group',{name:'Banker cards',exact:true}).getByRole('img')).toHaveCount(b);
  expect(await page.evaluate(()=>(window as unknown as{baccaratObservedTargets:string[]}).baccaratObservedTargets)).toEqual(['player:0','banker:0','player:1','banker:1',...p===3?['player:2']:[],...b===3?['banker:2']:[]]);
  if(fixture==='tie'){await expect(page.locator('[data-wager-target="PLAYER"]')).toContainText('PUSH');await expect(page.locator('[data-wager-target="BANKER"]')).toContainText('PUSH');await expect(page.locator('[data-credits="available"]')).toHaveText('1,200');}
  await capture(page,`branch-${fixture}`);
});
for(const stage of['initial','player','banker','settlement'])test(`[M14-B02-${stage}] safe skip, settled authority and no stale layers`,async({page})=>{
  await open(page);await wager(page);await pauseAt(page,stage);await page.getByRole('button',{name:'Deal',exact:true}).click();
  const flight=page.locator(stage==='initial'?'[data-initial-deal-flight]':stage==='settlement'?'[data-wager-flight]':`[data-deal-target$="/${stage}:2"]`);
  await expect(flight).toHaveCount(1);await expect(flight).toHaveAttribute('aria-hidden','true');
  expect(await flight.evaluate(element=>element.getAnimations({subtree:true}).map(animation=>animation.playState))).toEqual(['paused']);
  if(stage==='initial'){await expect(page.getByRole('status')).toContainText('DEALING');await expect(page.locator('.baccarat-hand-cards [role="img"]')).toHaveCount(0);await expect(page.locator('[aria-label="Round result"]')).toHaveCount(0);}
  if(stage==='player'||stage==='banker')await expect(page.getByRole('status')).toContainText(`${stage.toUpperCase()} DRAWS`);
  const before=await authority(page);expect((before.view as{phase:string}).phase).toBe('COMPLETE');
  await capture(page,`flight-${stage}`);await page.getByRole('button',{name:'Skip animation'}).click();await settled(page);
  await expect(page.locator('.baccarat-hand-cards [role="img"]')).toHaveCount(6);expect(await authority(page)).toEqual(before);
  await expect(page.locator('[data-hand="PLAYER"] .baccarat-total')).toHaveText('Total: 9');await expect(page.locator('[data-hand="BANKER"] .baccarat-total')).toHaveText('Total: 7');
  await page.getByRole('button',{name:'Deal Again'}).click();await expect(page.getByRole('status')).toHaveText('PLACE YOUR BET');await expect(page.locator('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')).toHaveCount(0);
});
for(const [fixture,target,amount,outcome,gross,label]of[
  ['player-natural','Player','25','WIN','5000','50'],['banker-natural','Banker','1','WIN','195','1.95'],['tie','Tie','25','WIN','22500','225'],
]as const)test(`[M14-B03-${target}] exact authority chip destination and amount`,async({page})=>{
  await open(page,fixture);await wager(page,target,amount);await pauseAt(page,'settlement');await page.getByRole('button',{name:'Deal',exact:true}).click();
  const flight=page.locator('[data-wager-flight]');await expect(flight).toHaveAttribute('data-wager-amount',gross);await expect(flight).toHaveAttribute('data-wager-outcome',outcome);await expect(flight).toHaveAttribute('data-wager-destination','local-credits');await expect(flight).toContainText(`${label} credits`);
  expect(await flight.evaluate(element=>element.getAnimations({subtree:true}).map(animation=>animation.playState))).toEqual(['paused']);
  await capture(page,`settlement-${target.toLowerCase()}`);await page.getByRole('button',{name:'Skip animation'}).click();await settled(page);
});
test('[M14-B04] full/reduced/immediate replay equivalence, OS and mid-sequence session reduce',async({page})=>{
  const results:unknown[]=[];for(const mode of['FULL_MOTION','REDUCED_MOTION','IMMEDIATE']){
    await page.emulateMedia({reducedMotion:mode==='REDUCED_MOTION'?'reduce':'no-preference'});await open(page,'both-third',mode==='IMMEDIATE'?mode:'');await wager(page);await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);
    await expect(page.locator('[data-game="baccarat"]')).toHaveAttribute('data-baccarat-motion',mode);const value=await authority(page);results.push({digest:value.digest,replay:value.replay});
    if(mode==='REDUCED_MOTION')await capture(page,'reduced-settled');
  }expect(results[1]).toEqual(results[0]);expect(results[2]).toEqual(results[0]);
  await open(page);await wager(page);await pauseAt(page,'player');await page.getByRole('button',{name:'Deal',exact:true}).click();await expect(page.locator('[data-deal-target$="/player:2"]')).toHaveCount(1);const before=await authority(page);
  await page.getByLabel('Reduce motion',{exact:true}).check();await settled(page);expect(await authority(page)).toEqual(before);
});
for(const width of[1280,768,320])test(`[M14-B05-${width}] responsive visible cards, formal Dealer and local HUD`,async({page})=>{
  await page.setViewportSize({width,height:width===768?1024:900});await open(page);await wager(page);await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.getByRole('img',{name:/Dealer: Celestine/})).toBeVisible();await expect(page.getByRole('img',{name:/Your character: Roland/})).toBeVisible();await capture(page,`responsive-${width}`);
});
test('[M14-B06] real React unmount cancels overlay and late completion',async({page})=>{
  await open(page);await wager(page);await pauseAt(page,'banker');await page.getByRole('button',{name:'Deal',exact:true}).click();await expect(page.locator('[data-deal-target$="/banker:2"]')).toHaveCount(1);const before=await authority(page);
  await page.evaluate(()=>(window as unknown as{baccaratTestUnmount():void}).baccaratTestUnmount());await expect(page.locator('[data-game="baccarat"]')).toHaveCount(0);await expect(page.locator('[data-initial-deal-flight],[data-action-card-flight],[data-wager-flight]')).toHaveCount(0);expect(await authority(page)).toEqual(before);
});
test('[M14-B07] existing native video tooling records representative six-card motion',async({browser,baseURL})=>{
  mkdirSync(evidence,{recursive:true});const context=await browser.newContext({baseURL,reducedMotion:'no-preference',viewport:{width:1280,height:1500},recordVideo:{dir:`${evidence}/video`,size:{width:1280,height:1500}}});
  const page=await context.newPage(),video=page.video()!;try{await open(page);await wager(page);await page.getByRole('button',{name:'Deal',exact:true}).click();await settled(page);await capture(page,'video-final-six');}finally{await context.close();await video.saveAs(`${evidence}/baccarat-six-card.webm`);}
});
test('[M14-B08] resize and visibility cleanup settle observation without commands',async({page})=>{
  for(const interruption of['resize','visibility']){
    await open(page);await wager(page);await pauseAt(page,'player');await page.getByRole('button',{name:'Deal',exact:true}).click();await expect(page.locator('[data-deal-target$="/player:2"]')).toHaveCount(1);const before=await authority(page);
    if(interruption==='resize')await page.setViewportSize({width:768,height:1024});
    else await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));Reflect.deleteProperty(document,'hidden');});
    await settled(page);expect(await authority(page)).toEqual(before);await expect(page.locator('.baccarat-hand-cards [role="img"]')).toHaveCount(6);
  }
});
