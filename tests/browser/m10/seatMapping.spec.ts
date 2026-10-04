import { test, expect, type Page } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { seatFacts, fiveCardHand } from '../../m10/seatFixtures.js';

const widths=[{width:1280,height:900},{width:768,height:1024},{width:320,height:720}];
const seats=[[4],[3,4],[3,4,6],[1,3,4,6],[1,3,4,5,6],[1,2,3,4,5,6],[1,2,3,4,5,6,7]];
async function geometry(page:Page){
  const r=await page.locator('.casino-table').evaluate(table=>{
    const rect=(el:Element)=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
    return {width:innerWidth,scroll:document.documentElement.scrollWidth,table:rect(table),regions:[...table.querySelectorAll('.dealer,.seat')].map(el=>({label:el.getAttribute('aria-label'),...rect(el)}))};
  });
  expect(r.scroll).toBeLessThanOrEqual(r.width);
  for(let i=0;i<r.regions.length;i++){
    const a=r.regions[i]; expect(a.x,a.label!).toBeGreaterThanOrEqual(r.table.x); expect(a.x+a.w,a.label!).toBeLessThanOrEqual(r.table.x+r.table.w);
    for(const b of r.regions.slice(i+1))expect(a.x+a.w<=b.x+1||b.x+b.w<=a.x+1||a.y+a.h<=b.y+1||b.y+b.h<=a.y+1,`${a.label} intersects ${b.label}`).toBe(true);
  }
  for(const cards of await page.locator('.seat .cards:visible').all())expect(await cards.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  for(const el of await page.locator('.player-dock button:visible, .seat summary:visible').all()){
    const box=(await el.boundingBox())!; expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
  }
  return r;
}
async function deal(page:Page){await page.getByLabel('Your main wager',{exact:false}).fill('100');await page.getByRole('button',{name:'Deal',exact:true}).click();}
for(let count=1;count<=7;count++)test(`[M10-S-E${count}] real ${count}-seat arc, stable resize, active and complete footprints`,async({page},info)=>{
  await page.goto('/?fixture=player-setup');await page.getByLabel('Total players').selectOption(String(count));await page.getByRole('button',{name:'Start table',exact:true}).click();
  const identity=await page.locator('[data-seat-anchor]').evaluateAll(els=>els.map(el=>({seat:el.getAttribute('data-seat-anchor'),slot:el.getAttribute('data-arc-slot'),avatar:el.getAttribute('data-character')})));
  expect(identity.map(s=>s.seat)).toEqual(seats[count-1].map(s=>`seat-${s}`));
  expect(identity.map(s=>Number(s.slot))).toEqual(Array.from({length:count},(_,i)=>i+1));
  const receipts=[];
  for(const viewport of widths){
    await page.setViewportSize(viewport);receipts.push(await geometry(page));
    expect(await page.locator('[data-seat-anchor]').evaluateAll(els=>els.map(el=>({seat:el.getAttribute('data-seat-anchor'),slot:el.getAttribute('data-arc-slot'),avatar:el.getAttribute('data-character')})))).toEqual(identity);
    const label=viewport.width===1280?'desktop':viewport.width===768?'tablet':'mobile';
    await page.screenshot({path:info.outputPath(`${label}-${count}-${viewport.width}.png`),fullPage:true});
  }
  await page.setViewportSize(widths[0]);await deal(page);receipts.push(await geometry(page));
  const hands=await page.locator('[data-hand-id]').evaluateAll(els=>els.map(el=>el.getAttribute('data-hand-id')));
  await page.screenshot({path:info.outputPath(`active-${count}-1280.png`),fullPage:true});
  for(const viewport of widths){await page.setViewportSize(viewport);receipts.push(await geometry(page));expect(await page.locator('[data-hand-id]').evaluateAll(els=>els.map(el=>el.getAttribute('data-hand-id')))).toEqual(hands);
    if(count===7 && viewport.width!==1280)await page.screenshot({path:info.outputPath(`${viewport.width===768?'tablet':'mobile'}-7-${viewport.width}.png`),fullPage:true});
  }
  await page.setViewportSize(widths[0]);
  for(let i=0;i<24 && !await page.getByRole('button',{name:'Deal Again',exact:true}).isVisible();i++){
    if(await page.getByRole('button',{name:'Decline',exact:true}).isVisible())await page.getByRole('button',{name:'Decline',exact:true}).click();
    else await page.getByRole('button',{name:'Stand',exact:true}).click();
  }
  await expect(page.locator('#player-result')).toBeVisible();receipts.push(await geometry(page));
  await page.screenshot({path:info.outputPath(`complete-${count}-1280.png`),fullPage:true});
  await page.getByRole('button',{name:'Deal Again',exact:true}).click();
  expect(await page.locator('[data-seat-anchor]').evaluateAll(els=>els.map(el=>el.getAttribute('data-character')))).toEqual(identity.map(s=>s.avatar));
  writeFileSync(info.outputPath(`mapping-${count}.json`),JSON.stringify(receipts,null,2));
});
test('[M10-S-E08] seven actual players retain public five-card long-name fixtures and 200% text',async({page},info)=>{
  for(const viewport of widths){
    await page.setViewportSize(viewport);await page.goto('/?fixture=player-setup');await page.getByLabel('Total players').selectOption('7');await page.getByRole('button',{name:'Start table',exact:true}).click();await deal(page);
    const guest=page.getByRole('region',{name:'Seat 3',exact:true});
    await guest.evaluate(async(el,facts)=>{
      const unitUrl='/src/ui/SeatUnit.tsx',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';
      const {SeatUnit}=await import(unitUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);
      el.replaceChildren();el.setAttribute('data-hand-count','1');ReactDOM.createRoot(el).render(React.createElement(SeatUnit,facts));
    },{...seatFacts,seat:{...seatFacts.seat,seatNumber:3},avatar:{...seatFacts.avatar!,name:'Seraphine of the Silver Moon Court'},hands:[{...fiveCardHand,handId:'layout/seat-3'}],currentSeat:3,currentHandId:'layout/seat-3'});
    await expect(guest.getByRole('heading',{name:'Seraphine of the Silver Moon Court',exact:true})).toBeVisible();
    if(viewport.width===320)await guest.locator('summary').click();
    await expect(guest.locator('.card')).toHaveCount(5);await geometry(page);
    await page.screenshot({path:info.outputPath(`edge-public-five-longname-${viewport.width}.png`),fullPage:true});
    await page.addStyleTag({content:'html {font-size:200%;}'});await geometry(page);
    await page.screenshot({path:info.outputPath(`text-seven-five-${viewport.width}.png`),fullPage:true});
  }
});
test('[M10-S-E09] real seven-player Split and Insurance retain local ownership, focus, safe density and enlarged text',async({page},info)=>{
  for(const viewport of widths)for(const fixture of ['player-seven-split','player-seven-insurance']){
    await page.setViewportSize(viewport);await page.goto(`/?fixture=${fixture}`);await deal(page);
    if(fixture.endsWith('split')){await page.getByRole('button',{name:'Split',exact:true}).click();await expect(page.locator('#player-hand article')).toHaveCount(2);}
    else {await expect(page.getByRole('button',{name:'Decline',exact:true})).toBeVisible();await expect(page.locator('.decision')).toBeFocused();}
    await geometry(page);await page.screenshot({path:info.outputPath(`edge-${fixture}-${viewport.width}.png`),fullPage:true});
    await page.addStyleTag({content:'html {font-size:200%;}'});await geometry(page);
    await page.screenshot({path:info.outputPath(`text-${fixture}-${viewport.width}.png`),fullPage:true});
  }
});
