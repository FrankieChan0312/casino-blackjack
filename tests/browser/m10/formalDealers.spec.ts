import { test, expect, type Page } from '@playwright/test';

const pool=['noble_female','knight_female','mage_female','elf_female','halforc_female'];
const names=['Celestine','Seraphine','Nyra','Elaria','Vesha'];
async function start(page:Page,count:number){await page.getByLabel('Total players').selectOption(String(count));await page.getByRole('button',{name:'Start table',exact:true}).click();}
async function choose(page:Page,id:string){const picker=page.locator('.character-picker');if(!await picker.evaluate(el=>el.hasAttribute('open')))await picker.locator('summary').click();await page.getByLabel('Your character',{exact:true}).selectOption(id);}
async function deal(page:Page){await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();}
async function finish(page:Page){
  for(let i=0;i<20&&!await page.getByRole('region',{name:'Your round result',exact:true}).count();i++){
    if(await page.getByRole('button',{name:'Decline',exact:true}).count())await page.getByRole('button',{name:'Decline',exact:true}).click();
    else if(await page.getByRole('button',{name:'Stand',exact:true}).count())await page.getByRole('button',{name:'Stand',exact:true}).click();
    else break;
  }
  await expect(page.getByRole('region',{name:'Your round result',exact:true})).toBeVisible();
}
async function formal(page:Page,id:string){
  const dealer=page.getByRole('region',{name:'Dealer',exact:true}),index=pool.indexOf(id);
  await expect(dealer).toHaveAttribute('data-dealer-character',id);await expect(dealer).toHaveAttribute('data-dealer-art','formal');
  const portrait=dealer.getByRole('img',{name:`Dealer: ${names[index]}`,exact:true});await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute('src',`/characters/dealer/${id}/formal.png`);
  await expect(portrait).toHaveJSProperty('naturalWidth',240);await expect(portrait).toHaveJSProperty('naturalHeight',320);
  const players=await page.locator('[data-seat-anchor]').evaluateAll(els=>els.map(el=>el.getAttribute('data-character')));expect(players).not.toContain(id);
  return dealer;
}
async function geometry(page:Page){
  const r=await page.locator('.casino-table').evaluate(table=>{
    const rect=(el:Element)=>{const b=el.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height};};
    const image=table.querySelector<HTMLImageElement>('.dealer .casino-person')!,box=rect(image),scale=Math.min(box.w/image.naturalWidth,box.h/image.naturalHeight);
    const portrait={x:box.x+(box.w-image.naturalWidth*scale)/2,y:box.y+(box.h-image.naturalHeight*scale)/2,w:image.naturalWidth*scale,h:image.naturalHeight*scale};
    return {width:innerWidth,scroll:document.documentElement.scrollWidth,regions:[...table.querySelectorAll('.dealer,.seat')].map(el=>({name:el.getAttribute('aria-label'),...rect(el)})),
      portrait,objectFit:getComputedStyle(image).objectFit,lane:rect(table.querySelector('.dealer-card-lane')!),
      contents:[...table.querySelectorAll('.dealer-card-lane,.dealer-total,.dealer-state,.dealer-shoe,.table-inscription')].map(el=>({name:el.className,width:el.clientWidth,scroll:el.scrollWidth}))};
  });
  expect(r.scroll).toBeLessThanOrEqual(r.width);
  expect(r.objectFit).toBe('contain');
  for(const c of r.contents)expect(c.scroll,c.name).toBeLessThanOrEqual(c.width);
  for(let i=0;i<r.regions.length;i++)for(const b of r.regions.slice(i+1)){const a=r.regions[i];expect(a.x+a.w<=b.x+1||b.x+b.w<=a.x+1||a.y+a.h<=b.y+1||b.y+b.h<=a.y+1,`${a.name}/${b.name}`).toBe(true);}
  expect(r.portrait.x+r.portrait.w<=r.lane.x+1||r.portrait.y+r.portrait.h<=r.lane.y+1).toBe(true);
  return r;
}
test('[M10-F-E01] production rotates all five portraits on new tables, wraps, and preserves fresh-reload Celestine preference',async({page},info)=>{
  await page.goto('/?fixture=player-setup');
  for(let ordinal=0;ordinal<6;ordinal++){
    if(ordinal)await page.getByRole('button',{name:'New table · reset to 1000 credits',exact:true}).click();
    await start(page,1);await formal(page,pool[ordinal%5]);
    await expect(page.getByRole('region',{name:'Dealer',exact:true})).toHaveAttribute('data-dealer-presentation-state','IDLE');
    await page.screenshot({path:info.outputPath(`formal-${names[ordinal%5]}-desktop.png`),fullPage:true});
    await deal(page);await finish(page);
  }
  await page.reload();await start(page,1);await formal(page,'noble_female');
});
for(let count=1;count<=7;count++)test(`[M10-F-E02-${count}] ${count} real players preserve Dealer identity through avatar changes, resize, NEXT and REPEAT`,async({page},info)=>{
  await page.goto('/?fixture=player-setup');await start(page,count);const dealer=await formal(page,'noble_female');
  await expect(page.locator('[data-seat-anchor]')).toHaveCount(count);
  await page.locator('.character-picker summary').click();await expect(page.getByLabel('Your character',{exact:true}).locator('option[value="noble_female"]')).toBeDisabled();
  await deal(page);const audit=await page.locator('.audit-list').innerHTML(),cards=await page.locator('#player-hand .cards').innerHTML();
  await choose(page,'dwarf_female');expect(await page.locator('.audit-list').innerHTML()).toBe(audit);expect(await page.locator('#player-hand .cards').innerHTML()).toBe(cards);
  await page.setViewportSize({width:320,height:720});await formal(page,'noble_female');await geometry(page);
  if(count===7)await page.screenshot({path:info.outputPath('formal-7-mobile-active.png'),fullPage:true});
  await finish(page);await expect(dealer).toHaveAttribute('data-dealer-presentation-state','IDLE');
  await page.getByRole('button',{name:'Deal Again',exact:true}).click();await formal(page,'noble_female');await deal(page);await finish(page);
  await page.getByRole('button',{name:/^Repeat Bet/}).click();await formal(page,'noble_female');await finish(page);
});
test('[M10-F-E03] seated Celestine yields next eligible formal Seraphine without changing the player lineup',async({page},info)=>{
  await page.goto('/?fixture=player-setup');await choose(page,'noble_female');await start(page,4);
  await formal(page,'knight_female');await expect(page.locator('#player-hand')).toHaveAttribute('data-character','noble_female');
  await expect(page.locator('[data-seat-anchor]')).toHaveCount(4);await page.screenshot({path:info.outputPath('collision-Celestine-to-Seraphine.png'),fullPage:true});
});
test('[M10-F-E04] all five approved identities seated use non-roster fallback, preserve all seven players and retain that assignment',async({page},info)=>{
  await page.goto('/?fixture=player-setup');
  await page.locator('#root').evaluate(async root=>{
    const app='/src/ui/App.tsx',controller='/src/browser/controller.ts',registry='/src/presentation/formalDealers.ts',react='/node_modules/.vite/deps/react.js',dom='/node_modules/.vite/deps/react-dom_client.js';
    const {App}=await import(app),{createBrowserController}=await import(controller),{FORMAL_DEALER_CONFIGURATION}=await import(registry),{default:React}=await import(react),{default:ReactDOM}=await import(dom);
    const ids=['elf_male','elf_female','knight_male','knight_female','mage_male','mage_female','noble_male','noble_female','halforc_male','halforc_female','dwarf_male','dwarf_female'];
    const picks=['knight_female','mage_female','elf_female','halforc_female','elf_male','dwarf_male'];
    const choose=(n:number)=>{const available=ids.filter(id=>id!=='noble_female'),index=11-n;for(let i=0;i<index;i++)available.splice(available.indexOf(picks[i]),1);return available.indexOf(picks[index]);};
    const mount=document.createElement('div');root.replaceChildren(mount);
    ReactDOM.createRoot(mount).render(React.createElement(App,{controller:createBrowserController({playerMode:true,deferPlayerStart:true,seed:7}),chooseCharacter:choose,dealerConfiguration:FORMAL_DEALER_CONFIGURATION}));
  });
  await choose(page,'noble_female');await start(page,7);
  const dealer=page.getByRole('region',{name:'Dealer',exact:true});expect(await dealer.getAttribute('data-dealer-character')).toBeNull();
  await expect(dealer).toHaveAttribute('data-dealer-art','temporary-fallback');await expect(dealer.getByRole('img',{name:'Original illustrated female dealer in professional attire',exact:true})).toBeVisible();
  const ids=await page.locator('[data-seat-anchor]').evaluateAll(els=>els.map(el=>el.getAttribute('data-character')));expect(ids).toHaveLength(7);expect(new Set(ids).size).toBe(7);for(const id of pool)expect(ids).toContain(id);
  await deal(page);await page.screenshot({path:info.outputPath('all-pool-seated-7-generic.png'),fullPage:true});await finish(page);
  await page.getByRole('button',{name:'Deal Again',exact:true}).click();expect(await dealer.getAttribute('data-dealer-character')).toBeNull();
});
test('[M10-F-E05] missing runtime image retains generic illustration and functional authoritative cards/actions',async({page})=>{
  await page.route('**/characters/dealer/**/formal.png',route=>route.abort());await page.goto('/?fixture=player');
  const dealer=page.getByRole('region',{name:'Dealer',exact:true});await expect(dealer.locator('img')).toHaveCount(0);
  await expect(dealer.getByRole('img',{name:'Original illustrated female dealer in professional attire',exact:true})).toBeVisible();
  await deal(page);await expect(dealer.getByRole('img',{name:'Hidden dealer card',exact:true})).toBeVisible();await finish(page);
});
test('[M10-F-E06] formal1/4/7 players retain bounded cards/status/shoe/rules at desktop/tablet/mobile and text200',async({page},info)=>{
  for(const count of [1,4,7])for(const viewport of [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}]){
    await page.setViewportSize(viewport);await page.goto('/?fixture=player-setup');await start(page,count);await formal(page,'noble_female');await deal(page);
    for(const enlarged of [false,true]){
      if(enlarged)await page.addStyleTag({content:'html {font-size:200%;}'});
      await geometry(page);await page.screenshot({path:info.outputPath(`formal-table-${count}-${viewport.width}${enlarged?'-text200':''}.png`),fullPage:true});
    }
  }
});
test('[M10-F-E07] non-Celestine 7-player tablet/mobile public waiting/reveal/result states and keyboard focus remain readable',async({page},info)=>{
  await page.goto('/?fixture=player-setup');await start(page,1);await deal(page);await finish(page);
  await page.getByRole('button',{name:'New table · reset to 1000 credits',exact:true}).click();
  await start(page,7);await formal(page,'halforc_female');
  for(const viewport of [{width:768,height:1024},{width:320,height:720}]){await page.setViewportSize(viewport);await deal(page);await geometry(page);
    await page.screenshot({path:info.outputPath(`formal-Vesha-7-${viewport.width}-active.png`),fullPage:true});
    await finish(page);await expect(page.locator('#player-result')).toBeFocused();await geometry(page);
    await page.screenshot({path:info.outputPath(`formal-Vesha-7-${viewport.width}-complete.png`),fullPage:true});
    await page.getByRole('button',{name:'Deal Again',exact:true}).click();await formal(page,'halforc_female');
  }
});
test('[M10-F-E08] formal portrait remains observable with reduced motion, real hidden/public cards and keyboard Stand/results',async({page},info)=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?fixture=player');const dealer=await formal(page,'noble_female');await deal(page);
  await expect(dealer).toHaveAttribute('data-dealer-presentation-state','WAITING_PLAYER');await expect(dealer.getByRole('img',{name:'Hidden dealer card',exact:true})).toBeVisible();
  await page.screenshot({path:info.outputPath('formal-player-turn-desktop.png'),fullPage:true});
  await page.locator('#player-hand').focus();const stand=page.getByRole('button',{name:'Stand',exact:true});
  for(let i=0;i<12&&!await stand.evaluate(el=>el===document.activeElement);i++)await page.keyboard.press('Tab');await expect(stand).toBeFocused();
  const box=await stand.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Enter');await expect(page.locator('#player-result')).toBeFocused();await expect(dealer).toHaveAttribute('data-dealer-presentation-state','IDLE');
  await expect(dealer.getByRole('img',{name:'Hidden dealer card',exact:true})).toHaveCount(0);await formal(page,'noble_female');
  expect(await page.locator('body').innerText()).not.toMatch(/deckIndex|physicalCardId|hiddenRank|hiddenSuit/);
  await page.screenshot({path:info.outputPath('formal-round-complete-desktop.png'),fullPage:true});
});
