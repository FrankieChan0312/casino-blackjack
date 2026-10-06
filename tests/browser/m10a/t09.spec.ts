import { test, expect, type Page } from '@playwright/test';
import { fiveCardHand, splitHands, seatFacts } from '../../m10/seatFixtures.js';
import { character } from '../../../src/presentation/characters.js';
const viewports=[{width:1280,height:900},{width:768,height:1024},{width:320,height:720}];
async function deal(page:Page,fixture:string){await page.goto('/?fixture='+fixture);await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();}
async function bounded(page:Page){
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const el of await page.locator('#player-hand .cards,#player-hand .hand-header,#player-hand .hud-hand-facts,#player-hand .character-identity,.seat-unit .character-identity,.seat-unit .seat-hand-facts:visible,.dealer-card-lane,.dealer-state,.dealer-total,.credits').all())expect(await el.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  const boxes=await page.locator('.casino-table .dealer,.casino-table .seat').evaluateAll(els=>els.map(el=>{const b=el.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,label:el.getAttribute('aria-label')};}));
  for(let i=0;i<boxes.length;i++)for(const b of boxes.slice(i+1)){const a=boxes[i];expect(a.x+a.width<=b.x+1||b.x+b.width<=a.x+1||a.y+a.height<=b.y+1||b.y+b.height<=a.y+1,`${a.label} intersects ${b.label}`).toBe(true);}
  for(const hand of await page.locator('.casino-table article:visible,.dealer-cards').all()){
    const cards=await hand.locator('.card').evaluateAll(els=>els.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};}));
    for(let i=0;i<cards.length;i++)for(const b of cards.slice(i+1)){const a=cards[i];expect(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y).toBe(true);}
  }
  for(const el of await page.locator('[data-control-surface] button:visible').all()){const b=(await el.boundingBox())!;expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);}
}
test('[M10A-T09-B01] actual2/3/4/5 cards keep every corner and exact total under three widths and text200',async({page},info)=>{
  for(const viewport of viewports){await page.setViewportSize(viewport);await deal(page,'player-five');
    for(const [count,total] of [[2,4],[3,6],[4,8],[5,10]]){
      await expect(page.locator('#player-hand .card')).toHaveCount(count);await expect(page.locator('#player-hand .hud-total')).toHaveText('Total: '+total);await expect(page.locator('#player-hand .hud-state')).toHaveText('Playing');await bounded(page);
      if(count>=3)await page.screenshot({path:info.outputPath(`edge-cards${count}-${viewport.width}.png`),fullPage:true});
      if(count<5)await page.getByRole('button',{name:'Hit',exact:true}).click();
    }
    await expect(page.getByRole('button',{name:'Double',exact:true})).toBeDisabled();await expect(page.getByRole('button',{name:'Stand',exact:true})).toBeEnabled();
    await page.addStyleTag({content:'html { font-size:200%; }'});await bounded(page);await page.screenshot({path:info.outputPath(`edge-five-text200-${viewport.width}.png`),fullPage:true});
  }
});
test('[M10A-T09-B02] active first and second Split plus four depth-first terminal leaves remain separate owners',async({page},info)=>{
  for(const viewport of viewports){await page.setViewportSize(viewport);await deal(page,'player-split');await page.getByRole('button',{name:'Split',exact:true}).click();
    await expect(page.locator('#player-hand [aria-current="true"]')).toHaveAttribute('data-hand-id','round-1/seat-4.1');await bounded(page);await page.screenshot({path:info.outputPath(`edge-split-first-${viewport.width}.png`),fullPage:true});
    await page.getByRole('button',{name:'Stand',exact:true}).click();await expect(page.locator('#player-hand [aria-current="true"]')).toHaveAttribute('data-hand-id','round-1/seat-4.2');await expect(page.locator('#player-hand .hud-total')).toHaveText(['Total: 10','Total: 11']);await bounded(page);await page.screenshot({path:info.outputPath(`edge-split-second-${viewport.width}.png`),fullPage:true});
    await deal(page,'player-rsa-cap');for(let i=0;i<3;i++)await page.getByRole('button',{name:'Split',exact:true}).click();
    await expect(page.locator('#player-hand .hud-hand')).toHaveCount(4);expect(await page.locator('#player-hand article').evaluateAll(els=>els.map(e=>e.getAttribute('data-hand-id')))).toEqual(['round-1/seat-4.1.1.1','round-1/seat-4.1.1.2','round-1/seat-4.1.2','round-1/seat-4.2']);
    await expect(page.locator('#player-hand .hud-wager')).toHaveText(Array(4).fill('Wager: 100 credits'));await expect(page.locator('#player-hand .hud-state')).toHaveText(Array(4).fill('Loss'));await expect(page.locator('.credits dd')).toHaveText(['600','0','0']);await bounded(page);
    await page.screenshot({path:info.outputPath(`edge-four-leaves-${viewport.width}.png`),fullPage:true});await page.addStyleTag({content:'html { font-size:200%; }'});await bounded(page);await page.screenshot({path:info.outputPath(`edge-four-leaves-text200-${viewport.width}.png`),fullPage:true});
    await page.getByRole('button',{name:'Deal Again',exact:true}).click();await expect(page.locator('#player-wager')).toBeFocused();
  }
});
for (const viewport of viewports) for (const fallback of [false,true]) {
  test(`[M10A-T09-B03-${viewport.width}-${fallback}] labelled public long-name four-result and five-card Dealer compositions remain bounded`,async({page},info)=>{
    if(fallback)await page.route('**/characters/*.png',route=>route.abort());else await page.unroute('**/characters/*.png');
    await page.setViewportSize(viewport);await deal(page,'player');
    const hands=splitHands.map(h=>({...h,handId:h.handId.replace('seat-1','seat-4')}));
    // Isolated public component layouts only; no controller/domain state is fabricated or command dispatched after mounting.
    await page.locator('#player-hand').evaluate(async(el,facts)=>{const componentUrl='/src/ui/LocalPlayerHud.tsx',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';const {LocalPlayerHud}=await import(componentUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);el.replaceChildren();el.setAttribute('data-layout-fixture','Public long-archetype four-leaf HUD');ReactDOM.createRoot(el).render(React.createElement(LocalPlayerHud,facts));},{seat:{seatNumber:4,occupancy:'HUMAN',sittingOut:false,controllerId:'human'},avatar:character('halforc_female'),hands,wager:100,currentHandId:'layout/seat-4.1.2',ownResults:[]});
    await page.getByRole('region',{name:'Seat 1',exact:true}).evaluate(async(el,facts)=>{const componentUrl='/src/ui/SeatUnit.tsx',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';const {SeatUnit}=await import(componentUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);el.replaceChildren();el.setAttribute('data-layout-fixture','Public long-name five-card guest');ReactDOM.createRoot(el).render(React.createElement(SeatUnit,facts));},{...seatFacts,currentSeat:4,currentHandId:'layout/seat-4.1.2',hands:[fiveCardHand]});
    await page.locator('.dealer-zone').evaluate(async(el,cards)=>{const componentUrl='/src/ui/DealerZone.tsx',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';const {DealerZone}=await import(componentUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);const mount=document.createElement('div');mount.setAttribute('data-layout-fixture','Isolated public five-card Dealer');el.replaceWith(mount);ReactDOM.createRoot(mount).render(React.createElement(DealerZone,{dealer:{upcard:cards[0],holeCard:cards[1],visibleCards:cards,total:20,status:'Dealer complete'}}));},fiveCardHand.cards);
    await expect(page.locator('#player-hand .character-archetype')).toHaveText('Female Half-Orc Warrior');await expect(page.getByRole('region',{name:'Seat 1',exact:true}).getByRole('heading',{name:'Seraphine',exact:true})).toBeVisible();
    await expect(page.locator('#player-hand .hud-state')).toHaveText(['Win','Playing','Bust','Push']);await expect(page.locator('.dealer .card')).toHaveCount(5);await expect(page.locator('.dealer-total')).toHaveText('Total: 20');
    if(viewport.width===320)await page.getByRole('region',{name:'Seat 1',exact:true}).locator('summary').click();
    if(fallback){const img=page.locator('#player-hand .character-identity img');await expect(img).toHaveJSProperty('complete',true);await expect(img).toHaveJSProperty('naturalWidth',0);}
    for(const enlarged of [false,true]){if(enlarged)await page.addStyleTag({content:'html { font-size:200%; }'});await bounded(page);await page.screenshot({path:info.outputPath(`edge-${fallback?'fallback':'long-names'}${enlarged?'-text200':''}-${viewport.width}.png`),fullPage:true});}
  });
}
