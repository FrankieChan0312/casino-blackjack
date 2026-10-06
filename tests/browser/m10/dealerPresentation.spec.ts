import { test, expect, type Page } from '@playwright/test';
import { writeFileSync } from 'node:fs';

// Configured identity is an isolated engineering fixture, never an owner selection.
async function configuredFixture(page:Page) {
  await page.goto('/?fixture=player-setup&dealer=legacy');
  await page.locator('#root').evaluate(async root=>{
    const appUrl='/src/ui/App.tsx',controllerUrl='/src/browser/controller.ts',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';
    const {App}=await import(appUrl),{createBrowserController}=await import(controllerUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);
    const container=document.createElement('div');root.replaceChildren(container);
    ReactDOM.createRoot(container).render(React.createElement(App,{controller:createBrowserController({playerMode:true,deferPlayerStart:true,seed:7}),chooseCharacter:()=>0,dealerConfiguration:{preferredCharacterId:'noble_male'}}));
  });
  await expect(page.getByRole('button',{name:'Start table',exact:true})).toBeVisible();
}
async function start(page:Page,count:number){await page.getByLabel('Total players').selectOption(String(count));await page.getByRole('button',{name:'Start table',exact:true}).click();}
async function deal(page:Page){await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();}
async function finish(page:Page){
  if(await page.getByRole('button',{name:'Decline',exact:true}).count())await page.getByRole('button',{name:'Decline',exact:true}).click();
  if(await page.getByRole('button',{name:'Stand',exact:true}).count())await page.getByRole('button',{name:'Stand',exact:true}).click();
  await expect(page.getByRole('region',{name:'Your round result',exact:true})).toBeVisible();
}
const expected=['noble_male','noble_male','noble_male','noble_male','noble_male','noble_male','noble_female'];
for(let count=1;count<=7;count++)test(`[M10-D-E${count}] configured ${count}-player table reserves deterministic Dealer and keeps real participants`,async({page})=>{
  await configuredFixture(page);await start(page,count);
  const dealer=page.getByRole('region',{name:'Dealer',exact:true});
  await expect(dealer).toHaveAttribute('data-dealer-character',expected[count-1]);
  await expect(dealer).toHaveAttribute('data-dealer-art','generic-formal');
  await expect(page.locator('[data-seat-anchor]')).toHaveCount(count);
  const lineup=await page.locator('[data-seat-anchor]').evaluateAll(els=>els.map(el=>el.getAttribute('data-character')));
  expect(new Set(lineup).size).toBe(count);expect(lineup).not.toContain(expected[count-1]);
  await page.locator('.character-picker summary').click();
  await expect(page.getByLabel('Your character',{exact:true}).locator(`option[value="${expected[count-1]}"]`)).toBeDisabled();
  await deal(page);await expect(dealer).toHaveAttribute('data-dealer-presentation-state','WAITING_PLAYER');
  const before=await page.locator('.audit-list').innerHTML(),cards=await page.locator('#player-hand .cards').innerHTML();
  await page.getByLabel('Your character',{exact:true}).selectOption('elf_female');
  expect(await page.locator('.audit-list').innerHTML()).toBe(before);expect(await page.locator('#player-hand .cards').innerHTML()).toBe(cards);
  await page.setViewportSize({width:320,height:720});await expect(dealer).toHaveAttribute('data-dealer-character',expected[count-1]);
  if(count===1)await expect(page.getByRole('region',{name:'Insurance decision',exact:true})).toBeVisible();
  await finish(page);await expect(dealer).toHaveAttribute('data-dealer-presentation-state','IDLE');
  await page.getByRole('button',{name:'Deal Again',exact:true}).click();await deal(page);
  await expect(dealer).toHaveAttribute('data-dealer-character',expected[count-1]);
  await finish(page);
  await page.getByRole('button',{name:/^Repeat Bet/}).click();
  await expect(dealer).toHaveAttribute('data-dealer-character',expected[count-1]);
});
test('[M10-D-E08] explicit unconfigured fallback retains actual1/4/7 players, public cards and placement at three widths plus text200',async({page},info)=>{
  const receipts=[];
  for(const count of [1,4,7])for(const viewport of [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}]){
    await page.setViewportSize(viewport);await page.goto('/?fixture=player-setup&dealer=legacy');await start(page,count);await deal(page);
    const dealer=page.getByRole('region',{name:'Dealer',exact:true});
    await expect(dealer).toHaveAttribute('data-dealer-art','generic-formal');
    expect(await dealer.getAttribute('data-dealer-character')).toBeNull();
    await expect(dealer.getByRole('img',{name:'Dealer: generic formal portrait',exact:true})).toBeVisible();
    await expect(dealer.getByRole('img',{name:'Hidden dealer card',exact:true})).toBeVisible();await expect(dealer.locator('img[data-dealer-avatar="generic-formal"]')).toHaveCount(1);
    await expect(page.locator('[data-seat-anchor]')).toHaveCount(count);
    const measure=()=>page.locator('.casino-table').evaluate(table=>{
      const rect=(el:Element)=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
      return {width:innerWidth,scroll:document.documentElement.scrollWidth,regions:[...table.querySelectorAll('.dealer,.seat')].map(el=>({label:el.getAttribute('aria-label'),...rect(el)})),dealerChildren:[...table.querySelectorAll('.dealer-card-lane,.dealer-total,.dealer-state')].map(el=>({width:el.clientWidth,scroll:el.scrollWidth}))};
    });
    for(const enlarged of [false,true]){
      if(enlarged)await page.addStyleTag({content:'html {font-size:200%;}'});
      const r=await measure();expect(r.scroll).toBeLessThanOrEqual(r.width);
      for(const box of r.dealerChildren)expect(box.scroll).toBeLessThanOrEqual(box.width);
      for(let i=0;i<r.regions.length;i++)for(const b of r.regions.slice(i+1)){const a=r.regions[i];expect(a.x+a.w<=b.x+1||b.x+b.w<=a.x+1||a.y+a.h<=b.y+1||b.y+b.h<=a.y+1,`${a.label}/${b.label}`).toBe(true);}
      await page.screenshot({path:info.outputPath(`dealer-table-${count}-${viewport.width}${enlarged?'-text200':''}.png`),fullPage:true});receipts.push({count,viewport,enlarged,...r});
    }
  }
  writeFileSync(info.outputPath('dealer-layout.json'),JSON.stringify(receipts,null,2));
});
test('[M10-D-E09] intentionally invalid image contract fixture falls back without a broken portrait or new artwork',async({page})=>{
  await page.goto('/?fixture=player&dealer=legacy');
  const dealer=page.getByRole('region',{name:'Dealer',exact:true});
  await dealer.evaluate(async el=>{
    const avatarUrl='/src/ui/DealerAvatar.tsx',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';
    const {DealerAvatar}=await import(avatarUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);
    const slot=document.createElement('div');el.querySelector('.casino-person')!.replaceWith(slot);
    // Deliberately undecodable data URI; no source, generated art or usable asset claim.
    ReactDOM.createRoot(slot).render(React.createElement(DealerAvatar,{asset:{characterId:'noble_male',src:'data:image/png;base64,invalid',width:240,height:320}}));
  });
  await expect(dealer.locator('img[data-dealer-avatar="generic-formal"]')).toHaveCount(1);
  await expect(dealer.getByRole('img',{name:'Dealer: generic formal portrait',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Deal',exact:true})).toBeEnabled();
});
