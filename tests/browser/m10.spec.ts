import { test, expect, type Page } from '@playwright/test';
import { copyFileSync, writeFileSync } from 'node:fs';
import { seatFacts, fiveCardHand, splitHands } from '../m10/seatFixtures.js';

const viewports = [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 320, height: 720 }];
async function deal(page: Page, fixture = 'player') {
  await page.goto(`/?fixture=${fixture}`);
  await page.getByLabel('Your main wager', { exact: false }).fill('100');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
}
async function geometry(page: Page) {
  const data = await page.locator('.casino-table').evaluate(table => {
    const rect = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
    const anchors = [...table.querySelectorAll('.dealer, .seat')].map(el => ({ label: el.getAttribute('aria-label'), ...rect(el) }));
    return { table: rect(table), anchors, viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth };
  });
  expect(data.scrollWidth).toBeLessThanOrEqual(data.viewport.width);
  const dealer = data.anchors[0];
  expect(Math.abs(dealer.x + dealer.width / 2 - data.viewport.width / 2)).toBeLessThan(2);
  for (let i = 0; i < data.anchors.length; i++) {
    const a = data.anchors[i];
    expect(a.x, a.label!).toBeGreaterThanOrEqual(data.table.x);
    expect(a.x + a.width, a.label!).toBeLessThanOrEqual(data.table.x + data.table.width);
    for (const b of data.anchors.slice(i + 1)) {
      expect(a.x + a.width <= b.x + 1 || b.x + b.width <= a.x + 1 || a.y + a.height <= b.y + 1 || b.y + b.height <= a.y + 1,
        `${a.label} intersects ${b.label}`).toBe(true);
    }
  }
  for (const cards of await page.locator('.seat article .cards:visible').all()) {
    expect(await cards.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  }
  return data;
}

test('[M10-E01] current casino table anchors retain public players and usable controls at three viewports', async ({ page }) => {
  const receipts = [];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page); await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('[data-anchor="dealer-cards"]')).toBeVisible();
    await expect(page.locator('[data-anchor="table-centre"]')).toBeVisible();
    expect(await page.locator('[data-seat-anchor]').evaluateAll(els => els.map(el => el.getAttribute('data-seat-anchor')))).toEqual(['seat-1','seat-3','seat-4','seat-6']);
    await expect(page.getByRole('img', { name: 'Hidden dealer card', exact: true })).toBeVisible();
    receipts.push(await geometry(page));
    for (const name of ['Hit','Stand','Double','Split','Surrender']) {
      const button = page.getByRole('button', { name, exact: true });
      const box = (await button.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
    }
    const stand = page.getByRole('button', { name: 'Stand', exact: true });
    if (viewport.width === 1280) { const box = (await stand.boundingBox())!; expect(box.y + box.height).toBeLessThanOrEqual(900); }
    await page.screenshot({ path: `docs/M10_T01_EVIDENCE/table-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
    await stand.click(); await expect(page.locator('#player-result')).toBeFocused();
    await page.getByRole('button', { name: 'Deal Again', exact: true }).click();
    await expect(page.getByLabel('Your main wager', { exact: false })).toBeFocused();
  }
  writeFileSync('docs/M10_T01_EVIDENCE/geometry.json', JSON.stringify(receipts, null, 2) + '\n');
});

test('[M10-E02] five actual cards and four actual split leaves use vertical flow without overlapping seat regions', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page, 'player-five');
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Hit', exact: true }).click();
    await expect(page.locator('#player-hand article .card')).toHaveCount(5); await geometry(page);
    await page.screenshot({ path: `docs/M10_T01_EVIDENCE/five-cards-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: 'Stand', exact: true }).click(); await expect(page.locator('#player-result')).toBeFocused();
    await deal(page, 'player-rsa-cap');
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Split', exact: true }).click();
    await expect(page.locator('#player-hand article')).toHaveCount(4); await geometry(page);
    const ids = await page.locator('#player-hand article').evaluateAll(els => els.map(el => el.getAttribute('data-hand-id')));
    expect(new Set(ids).size).toBe(4);
    await page.screenshot({ path: `docs/M10_T01_EVIDENCE/four-leaves-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
    await expect(page.getByRole('button', { name: 'Deal Again', exact: true })).toBeEnabled();
  }
});

test('[M10-E03] enlarged text failed portraits and reduced motion keep identity cards and keyboard decisions accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/characters/*.png', route => route.abort());
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page);
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await expect(page.locator('#player-hand').getByRole('heading', { name: 'Roland', exact: true })).toBeVisible();
    await expect(page.locator('#player-hand .character-identity img')).toHaveJSProperty('naturalWidth', 0);
    await geometry(page);
    if (viewport.width === 320) {
      const guest = page.getByRole('region', { name: 'Seat 1', exact: true });
      await guest.locator('summary').click();
      await expect(guest.locator('.guest-mobile-cards .card').first()).toBeVisible(); await geometry(page);
    }
    await page.screenshot({ path: `docs/M10_T01_EVIDENCE/text-fallback-${viewport.width}.png`, fullPage: true, animations: 'disabled' });
    await page.locator('#player-hand').focus();
    const stand = page.getByRole('button', { name: 'Stand', exact: true });
    for (let i = 0; i < 8 && !await stand.evaluate(el => el === document.activeElement); i++) await page.keyboard.press('Tab');
    await expect(stand).toBeFocused();
    expect(await stand.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
    expect(await page.locator('#player-hand .card').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
  }
});

test('[M10-E04] the table scene owns coherent local cards controls and exact credits through betting and play', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player');
    const scene = page.locator('.table-scene');
    await expect(scene.getByRole('region', { name: 'Your wager', exact: true })).toBeVisible();
    const save = async (state: string) => {
      const filename = `scene-${state}-${viewport.width}.png`, path = info.outputPath(filename);
      await page.screenshot({ path, fullPage: true, animations: 'disabled' });
      copyFileSync(path, `docs/M10_T01_EVIDENCE/repair09/${filename}`);
    };
    await page.evaluate(() => scrollTo(0, 0)); await save('open');
    await page.getByLabel('Your main wager', { exact: false }).fill('100');
    await scene.getByRole('button', { name: 'Deal', exact: true }).click();
    const own = scene.getByRole('region', { name: 'Seat 4', exact: true });
    await expect(own.getByRole('img', { name: 'Your avatar: Roland, Male Human Knight', exact: true })).toBeVisible();
    await expect(own.getByRole('img', { name: '5 of hearts', exact: true })).toBeVisible();
    await expect(own.getByRole('img', { name: '4 of spades', exact: true })).toBeVisible();
    await expect(own.getByText('MAIN: 100 credits', { exact: true })).toBeVisible();
    await expect(scene.getByRole('region', { name: 'Your credits', exact: true }).locator('dd')).toHaveText(['900', '100', '0']);
    const positions = await scene.evaluate(el => {
      const rect = (selector: string) => { const r = el.querySelector(selector)!.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
      return { own: rect('#player-hand'), dock: rect('.player-dock'), table: rect('.casino-table') };
    });
    expect(Math.abs(positions.own.x + positions.own.width / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(Math.abs(positions.dock.x + positions.dock.width / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(positions.dock.y).toBeGreaterThanOrEqual(positions.own.y + positions.own.height);
    expect(positions.dock.y - positions.own.y - positions.own.height).toBeLessThanOrEqual(32);
    expect(positions.table.width).toBeGreaterThan(viewport.width * 0.8);
    await expect(scene.getByRole('region', { name: 'House rules', exact: true })).toHaveCount(0);
    await expect(scene.getByLabel('House rules', { exact: true })).toContainText('BLACKJACK PAYS 3:2');
    await expect(scene.getByLabel('House rules', { exact: true })).toContainText('DEALER STANDS ON ALL 17');
    expect(await scene.locator('.dealer > .casino-person').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await geometry(page); await page.evaluate(() => scrollTo(0, 0)); await save('dealt');
    await scene.getByRole('button', { name: 'Stand', exact: true }).click();
    await expect(scene.locator('#player-result')).toBeFocused();
    await scene.getByRole('button', { name: 'Deal Again', exact: true }).click();
    await expect(scene.getByLabel('Your main wager', { exact: false })).toBeFocused();
  }
});

test('[M10A-E01] one scene frame owns the existing game regions and keyboard play across desktop tablet and mobile', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player');
    const scene = page.getByRole('region', { name: 'Blackjack game scene', exact: true });
    const controls = scene.getByRole('region', { name: 'Your gameplay controls', exact: true });
    const support = page.getByRole('complementary', { name: 'Table preferences and demo tools', exact: true });
    await expect(scene.locator('.casino-header')).toContainText('Credits have no redemption value.');
    await expect(scene.locator('[data-scene-zone="dealer"]')).toHaveCount(1);
    await expect(scene.locator('[data-scene-zone="local-player"]')).toHaveCount(1);
    await expect(scene.locator('[data-scene-zone="remote-seat"]')).toHaveCount(3);
    await expect(controls).toHaveAttribute('aria-describedby', 'player-scene-status');
    await expect(controls.getByRole('status')).toHaveText('Betting open');
    await expect(controls.getByRole('region', { name: 'Your credits', exact: true }).locator('dd')).toHaveText(['1,000','0','0']);
    await expect(support.getByText('Change Character · Roland', { exact: true })).toBeVisible();
    if (viewport.width === 1280) await page.screenshot({ path: info.outputPath('frame-open-1280.png'), fullPage: true, animations: 'disabled' });
    await controls.getByLabel('Your main wager', { exact: false }).fill('100');
    await controls.getByRole('button', { name: 'Deal', exact: true }).click();
    await expect(controls.getByRole('status')).toHaveText('Your turn');
    await expect(controls.getByRole('region', { name: 'Your credits', exact: true }).locator('dd')).toHaveText(['900','100','0']);
    const boxes = await scene.evaluate(el => {
      const rect = (target: Element) => { const r = target.getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height }; };
      return { scene:rect(el),table:rect(el.querySelector('.casino-table')!),local:rect(el.querySelector('#player-hand')!),
        controls:rect(el.querySelector('#player-decisions')!),support:rect(document.querySelector('.scene-support')!),
        header:rect(el.querySelector('.casino-header')!),scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth };
    });
    expect(boxes.scene.width).toBeGreaterThan(viewport.width * .9);
    expect(boxes.table.width).toBeGreaterThan(viewport.width * .8);
    expect(boxes.header.height).toBeLessThan(boxes.table.height);
    expect(boxes.controls.y).toBeGreaterThanOrEqual(boxes.local.y + boxes.local.height);
    expect(boxes.support.y).toBeGreaterThanOrEqual(boxes.scene.y + boxes.scene.height);
    expect(boxes.scrollWidth).toBeLessThanOrEqual(boxes.viewport);
    const stand = controls.getByRole('button', { name:'Stand',exact:true });
    const target = (await stand.boundingBox())!;
    expect(target.width).toBeGreaterThanOrEqual(44); expect(target.height).toBeGreaterThanOrEqual(44);
    if (viewport.width === 1280) expect(target.y + target.height).toBeLessThanOrEqual(900);
    await page.evaluate(() => scrollTo(0,0));
    await page.screenshot({ path:info.outputPath(`frame-dealt-${viewport.width}.png`),fullPage:true,animations:'disabled' });
    await page.locator('#player-hand').focus();
    for (let i=0;i<8 && !await stand.evaluate(el => el === document.activeElement);i++) await page.keyboard.press('Tab');
    await expect(stand).toBeFocused(); await page.keyboard.press('Enter');
    await expect(scene.locator('#player-result')).toBeFocused();
    await expect(controls.getByRole('status')).toHaveText('Round complete');
    if (viewport.width === 1280) await page.screenshot({ path:info.outputPath('frame-results-1280.png'),fullPage:true,animations:'disabled' });
    await controls.getByRole('button', { name:'Deal Again',exact:true }).click();
    await expect(controls.getByLabel('Your main wager', { exact:false })).toBeFocused();
  }
});

test('[M10A-E02] camera repair enlarges existing gameplay footprints and retains native wager play', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const receipts = [];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player');
    const scene = page.getByRole('region', { name: 'Blackjack game scene', exact: true });
    const funds = scene.getByRole('region', { name: 'Your credits', exact: true }).locator('dd');
    const chip = scene.getByRole('button', { name: 'Choose 100 credits', exact: true });
    await chip.hover();
    const hoverRatio = await chip.evaluate(el => {
      const parse = (colour: string) => colour.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      const luminance = (rgb: number[]) => rgb.map(value => { const c = value / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; })
        .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
      const style = getComputedStyle(el), a = luminance(parse(style.color)), b = luminance(parse(style.backgroundColor));
      return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    });
    expect(hoverRatio).toBeGreaterThanOrEqual(4.5);
    await chip.click();
    await expect(scene.getByLabel('Your main wager', { exact: false })).toHaveValue('100');
    await expect(funds).toHaveText(['1,000', '0', '0']);
    if (viewport.width === 1280) await page.screenshot({ path: info.outputPath('camera-open-1280.png'), fullPage: true, animations: 'disabled' });
    await scene.getByRole('button', { name: 'Deal', exact: true }).click();
    await expect(funds).toHaveText(['900', '100', '0']);
    await expect(scene.locator('#player-hand article .card')).toHaveCount(2);
    const bounds = await scene.evaluate(el => {
      const size = (target: Element) => { const r = target.getBoundingClientRect(); return { width: r.width, height: r.height, bottom: r.bottom, top: r.top }; };
      const local = size(el.querySelector('#player-hand')!), dock = size(el.querySelector('.player-dock')!);
      return { dealer: size(el.querySelector('.dealer > .casino-person')!),
        portraits: [...el.querySelectorAll('.seat:not(.local) .character-identity img')].filter(target => target.getBoundingClientRect().width > 0).map(size),
        ownPortrait: size(el.querySelector('#player-hand .character-identity img')!), ownCard: size(el.querySelector('#player-hand article .card')!),
        dockGap: dock.top - local.bottom, sceneTransform: getComputedStyle(el).transform, sceneZoom: getComputedStyle(el).zoom };
    });
    expect(bounds.sceneTransform).toBe('none'); expect(bounds.sceneZoom).toBe('1');
    if (viewport.width === 1280) {
      // Independent dimensions from the owner-rejected8ae9ff2 capture, not subjective acceptance thresholds.
      expect(bounds.dealer.width).toBeGreaterThan(116); expect(bounds.dealer.height).toBeGreaterThan(144);
      expect(bounds.portraits).toHaveLength(3);
      for (const portrait of bounds.portraits) { expect(portrait.width).toBeGreaterThan(54); expect(portrait.height).toBeGreaterThan(72); }
      expect(bounds.ownPortrait.width).toBeGreaterThan(54); expect(bounds.ownPortrait.height).toBeGreaterThan(72);
      expect(bounds.ownCard.width).toBeGreaterThan(76); expect(bounds.ownCard.height).toBeGreaterThan(98);
      expect(bounds.dockGap).toBeGreaterThanOrEqual(0); expect(bounds.dockGap).toBeLessThan(12);
      const stand = (await scene.getByRole('button', { name: 'Stand', exact: true }).boundingBox())!;
      expect(stand.y + stand.height).toBeLessThanOrEqual(900);
    }
    receipts.push({ viewport, bounds, hoverRatio, geometry: await geometry(page) });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: info.outputPath(`camera-dealt-${viewport.width}.png`), fullPage: true, animations: 'disabled' });
    await scene.getByRole('button', { name: 'Stand', exact: true }).click();
    await expect(scene.locator('#player-result')).toBeFocused();
    await scene.getByRole('button', { name: 'Deal Again', exact: true }).click();
    await expect(scene.getByLabel('Your main wager', { exact: false })).toBeFocused();
  }
  writeFileSync(info.outputPath('camera-footprints.json'), JSON.stringify(receipts, null, 2) + '\n');
  await page.setViewportSize(viewports[0]); await deal(page);
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  const enlarged = await page.locator('.casino-table').evaluate(table => {
    const box = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
    return { rules: box(table.querySelector('.table-inscription')!), identities: [...table.querySelectorAll('.character-identity')].map(box) };
  });
  for (const identity of enlarged.identities) {
    const rules = enlarged.rules;
    expect(rules.x + rules.width <= identity.x || identity.x + identity.width <= rules.x || rules.y + rules.height <= identity.y || identity.y + identity.height <= rules.y).toBe(true);
  }
  await geometry(page);
  await page.screenshot({ path: info.outputPath('camera-text200-1280.png'), fullPage: true, animations: 'disabled' });
  writeFileSync(info.outputPath('camera-text200.json'), JSON.stringify(enlarged, null, 2) + '\n');
});

test('[M10A-E03] remote seat units own real public cards scores wagers and one semantic hand at all three widths', async ({ page }, info) => {
  for(const viewport of viewports){
    await page.setViewportSize(viewport);await deal(page);
    if(viewport.width===1280){
      await page.evaluate(()=>scrollTo(0,0));
      const rulesUnobstructed=await page.locator('.table-inscription').evaluate(rule=>{
        const range=document.createRange();range.selectNodeContents(rule.firstChild!);const r=range.getBoundingClientRect();
        return [.05,.5,.95].every(fraction=>rule.contains(document.elementFromPoint(r.x+r.width*fraction,r.y+r.height/2)));
      });
      expect(rulesUnobstructed).toBe(true);
    }
    for(const [seat,total,count] of [[1,17,3],[3,19,2],[6,15,2]]){
      const guest=page.getByRole('region',{name:`Seat ${seat}`,exact:true});
      await expect(guest.locator('.seat-unit')).toHaveCount(1);
      await expect(guest.locator('article')).toHaveCount(1);
      await expect(guest.locator('article .card')).toHaveCount(count);
      if(viewport.width===320){await expect(guest.locator('.seat-main-wager')).toHaveText('MAIN: 25 credits');
        await expect(guest.locator('.seat-main-wager')).toBeVisible();await guest.locator('summary').click();}
      await expect(guest.locator('.seat-score')).toHaveText(String(total));
      await expect(guest.locator('.seat-score')).toHaveAttribute('aria-label',`Total: ${total}`);
      await expect(guest.locator('.seat-stake')).toHaveText('MAIN: 25 credits');
      expect(await guest.locator('article').evaluate(el=>getComputedStyle(el).borderLeftWidth)).toBe('0px');
      const cards=await guest.locator('article .card').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}));
      for(let i=0;i<cards.length;i++)for(const b of cards.slice(i+1)){const a=cards[i];expect(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y).toBe(true);}
    }
    const result=await geometry(page);writeFileSync(info.outputPath(`seat-normal-${viewport.width}.json`),JSON.stringify(result,null,2)+'\n');
    await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`seat-normal-${viewport.width}.png`),fullPage:true,animations:'disabled'});
    await page.getByRole('button',{name:'Stand',exact:true}).click();await expect(page.locator('#player-result')).toBeFocused();
    await page.getByRole('button',{name:'Deal Again',exact:true}).click();await expect(page.getByLabel('Your main wager',{exact:false})).toBeFocused();
  }
});

test('[M10A-E04] public composition fixtures keep five remote cards and four labelled split leaves with real long names', async ({ page }, info) => {
  // These are explicitly labelled engineering layouts, not a fabricated played round or occupancy selector.
  for(const viewport of viewports)for(const scenario of ['five','split']){
    await page.setViewportSize(viewport);await deal(page);
    const hands=scenario==='five'?[fiveCardHand]:splitHands;
    const guest=page.getByRole('region',{name:'Seat 1',exact:true});
    await guest.evaluate(async (el,facts)=>{
      const unitUrl='/src/ui/SeatUnit.tsx',reactUrl='/node_modules/.vite/deps/react.js',rootUrl='/node_modules/.vite/deps/react-dom_client.js';
      const {SeatUnit}=await import(unitUrl),{default:React}=await import(reactUrl),{default:ReactDOM}=await import(rootUrl);
      el.replaceChildren();el.setAttribute('data-hand-count',String(facts.hands.length));
      ReactDOM.createRoot(el).render(React.createElement(SeatUnit,facts));
    },{...seatFacts,hands,currentHandId:scenario==='five'?fiveCardHand.handId:splitHands[1].handId});
    await expect(guest.getByRole('heading',{name:'Seraphine',exact:true})).toBeVisible();
    await expect(guest.locator('.character-archetype')).toHaveText('Female Human Knight');
    await expect(guest.locator('.seat-turn')).toHaveText('Current turn');
    await expect(guest.locator('.turn-marker')).toHaveCount(1);
    await expect(guest.locator('article')).toHaveCount(scenario==='five'?1:4);
    await expect(guest.locator('article .card')).toHaveCount(scenario==='five'?5:9);
    if(viewport.width===320)await guest.locator('summary').click();
    if(scenario==='five')await expect(guest.locator('.seat-stake')).toHaveText('MAIN: 25.5 credits');
    else {await expect(guest.locator('.seat-hand-state')).toHaveText(['Win','Playing','Bust','Push']);
      await expect(guest.locator('.seat-stake')).toHaveText(['Wager: 50 credits','Wager: 100 credits','Wager: 50 credits','Wager: 50 credits']);}
    expect(await guest.locator('.character-identity').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await geometry(page);await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:info.outputPath(`seat-${scenario}-${viewport.width}.png`),fullPage:true,animations:'disabled'});
    await page.addStyleTag({content:'html { font-size: 200%; }'});await geometry(page);
    await page.screenshot({path:info.outputPath(`seat-${scenario}-text200-${viewport.width}.png`),fullPage:true,animations:'disabled'});
  }
});

test('[M10A-E05] local HUD owns one real current hand and existing controls through active play and results', async ({page},info)=>{
  for(const viewport of viewports){
    await page.setViewportSize(viewport);await deal(page);
    const local=page.locator('#player-hand'),hud=local.getByRole('group',{name:'Your player HUD',exact:true});
    await expect(hud).toHaveAttribute('aria-controls','player-decisions');
    await expect(local.locator('.hud-hand')).toHaveCount(1);await expect(local.locator('article[aria-current="true"]')).toHaveCount(1);
    await expect(local.locator('.hud-total')).toHaveAttribute('aria-label','Total: 9');
    await expect(local.locator('.hud-wager')).toHaveText('Wager: 100 credits');
    await expect(local.locator('.hud-state')).toHaveText('Playing');await expect(local.getByText('MAIN: 100 credits',{exact:true})).toBeVisible();
    await expect(local.getByRole('img',{name:'5 of hearts',exact:true})).toBeVisible();await expect(local.getByRole('img',{name:'4 of spades',exact:true})).toBeVisible();
    await expect(page.locator('.local-actions .cards')).toHaveCount(0);await expect(page.locator('.seat-unit')).toHaveCount(3);
    await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(['900','100','0']);
    await geometry(page);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`hud-normal-${viewport.width}.png`),fullPage:true,animations:'disabled'});
    await expect(local).toBeFocused();const stand=page.getByRole('button',{name:'Stand',exact:true});
    for(let i=0;i<8&&!await stand.evaluate(el=>el===document.activeElement);i++)await page.keyboard.press('Tab');
    await expect(stand).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#player-result')).toBeFocused();
    await page.getByRole('button',{name:'Deal Again',exact:true}).click();await expect(page.getByLabel('Your main wager',{exact:false})).toBeFocused();
    await deal(page,'player-loss');await page.getByRole('button',{name:'Stand',exact:true}).click();
    await expect(local.locator('.hud-state')).toHaveText('Loss');await expect(local.locator('[aria-current]')).toHaveCount(0);
    await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(['900','0','0']);
    await geometry(page);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`hud-result-${viewport.width}.png`),fullPage:true,animations:'disabled'});
  }
});

for (const viewport of viewports) for (const scenario of ['five','two-split','four-split']) {
  test(`[M10A-E06-${viewport.width}-${scenario}] real local HUD preserves exact ownership at normal and200percent text`,async({page},info)=>{
    await page.setViewportSize(viewport);await deal(page,scenario==='five'?'player-five':scenario==='two-split'?'player-split':'player-rsa-cap');
    const local=page.locator('#player-hand');
    if(scenario==='five')for(let i=0;i<3;i++)await page.getByRole('button',{name:'Hit',exact:true}).click();
    else for(let i=0;i<(scenario==='two-split'?1:3);i++)await page.getByRole('button',{name:'Split',exact:true}).click();
    await expect(local.locator('.hud-hand')).toHaveCount(scenario==='five'?1:scenario==='two-split'?2:4);
    await expect(local.locator('article .card')).toHaveCount(scenario==='five'?5:scenario==='two-split'?3:8);
    await expect(local.locator('.hud-total')).toHaveText(scenario==='five'?['Total: 10']:scenario==='two-split'?['Total: 10','Total: 8']:['Total: 12','Total: 12','Total: 12','Total: 12']);
    await expect(local.locator('.hud-wager')).toHaveText(Array(scenario==='five'?1:scenario==='two-split'?2:4).fill('Wager: 100 credits'));
    await expect(local.locator('[aria-current="true"]')).toHaveCount(scenario==='four-split'?0:1);
    const funds=scenario==='five'?['900','100','0']:scenario==='two-split'?['800','200','0']:['600','0','0'];
    await expect(page.getByRole('region',{name:'Your credits',exact:true}).locator('dd')).toHaveText(funds);
    if(scenario==='four-split')await expect(local.locator('.hud-state')).toHaveText(['Loss','Loss','Loss','Loss']);
    await geometry(page);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath(`hud-${scenario}-${viewport.width}.png`),fullPage:true,animations:'disabled'});
    await page.addStyleTag({content:'html { font-size: 200%; }'});await geometry(page);
    await page.screenshot({path:info.outputPath(`hud-${scenario}-text200-${viewport.width}.png`),fullPage:true,animations:'disabled'});
    const control=page.getByRole('button',{name:scenario==='four-split'?'Deal Again':'Stand',exact:true});
    await control.click();await expect(page.locator(scenario==='four-split'?'#player-wager':scenario==='two-split'?'#player-hand':'#player-result')).toBeFocused();
    if(scenario==='two-split'){
      await expect(local.locator('article[aria-current="true"]')).toHaveAttribute('aria-label','Hand B');
      await expect(local.locator('article[aria-current="true"] .hud-total')).toHaveText('Total: 11');
      await expect(local.locator('article[aria-current="true"] .turn-marker')).toHaveText('ACTIVE');
    }
  });
}

test('[M10A-E07] Dealer workstation owns initial hidden and real revealed three-card states across all surfaces', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player&dealer=legacy');
    const dealer = page.getByRole('region', { name: 'Dealer', exact: true });
    await expect(dealer.getByRole('img', { name: 'Dealer: generic formal portrait', exact: true })).toBeVisible();
    await expect(dealer.getByText('Waiting for the initial deal', { exact: true })).toBeVisible();
    await expect(dealer.getByRole('group', { name: 'Shoe and deal origin', exact: true })).toBeVisible();
    await expect(dealer.getByLabel('House rules', { exact: true })).toContainText('BLACKJACK PAYS 3:2');
    await geometry(page); await page.screenshot({ path: info.outputPath(`dealer-open-${viewport.width}.png`), fullPage: true });
    await page.getByLabel('Your main wager', { exact: false }).fill('100'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
    await expect(dealer.getByRole('group', { name: 'Dealer hand', exact: true }).getByRole('img')).toHaveCount(2);
    await expect(dealer.getByRole('img', { name: 'Hidden dealer card', exact: true })).toBeVisible();
    await expect(dealer.locator('.dealer-total')).toHaveText('Visible total: 4'); await expect(dealer.locator('.dealer-state')).toHaveText('Hole card hidden');
    await expect(page.locator('.seat-unit')).toHaveCount(3); await expect(page.getByRole('group', { name: 'Your player HUD', exact: true })).toBeVisible();
    await geometry(page); await page.screenshot({ path: info.outputPath(`dealer-hidden-${viewport.width}.png`), fullPage: true });
    await page.locator('#player-hand').focus(); const stand = page.getByRole('button', { name: 'Stand', exact: true });
    for (let i = 0; i < 8 && !await stand.evaluate(el => el === document.activeElement); i++) await page.keyboard.press('Tab');
    await expect(stand).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
    await expect(dealer.locator('.dealer-card-lane .card')).toHaveCount(3);
    expect(await dealer.locator('.dealer-card-lane .card').evaluateAll(els => els.every(el => el.getAttribute('role') === 'img'))).toBe(true);
    expect(await dealer.locator('.dealer-card-lane .card').evaluateAll(els => els.map(el => el.getAttribute('aria-label')))).toEqual(['4 of clubs', 'K of clubs', '9 of spades']);
    await expect(dealer.locator('.dealer-total')).toHaveText('Total: 23'); await expect(dealer.locator('.dealer-state')).toHaveText('Bust');
    await expect(dealer.getByRole('img', { name: 'Hidden dealer card', exact: true })).toHaveCount(0);
    await geometry(page); await page.screenshot({ path: info.outputPath(`dealer-revealed-${viewport.width}.png`), fullPage: true });
    await page.getByRole('button', { name: 'Deal Again', exact: true }).click(); await expect(page.getByLabel('Your main wager', { exact: false })).toBeFocused();
    await deal(page, 'player-loss'); await page.getByRole('button', { name: 'Stand', exact: true }).click();
    await expect(dealer.locator('.dealer-state')).toHaveText('Dealer complete'); await expect(dealer.locator('.dealer-total')).toHaveText('Total: 19');
    await geometry(page); await page.screenshot({ path: info.outputPath(`dealer-complete-${viewport.width}.png`), fullPage: true });
  }
});

test('[M10A-E08] enlarged Dealer text retains public facts and unclipped workstation ownership with keyboard decisions', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page); await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    const dealer = page.getByRole('region', { name: 'Dealer', exact: true });
    for (const selector of ['.dealer-cards', '.dealer-total', '.dealer-state', '.dealer-shoe', '.table-inscription']) {
      await expect(dealer.locator(selector)).toBeVisible();
      expect(await dealer.locator(selector).evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    }
    await geometry(page); await page.screenshot({ path: info.outputPath(`dealer-text200-${viewport.width}.png`), fullPage: true });
    await page.locator('#player-hand').focus(); const stand = page.getByRole('button', { name: 'Stand', exact: true });
    for (let i = 0; i < 8 && !await stand.evaluate(el => el === document.activeElement); i++) await page.keyboard.press('Tab');
    await expect(stand).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
    await expect(dealer.locator('.dealer-total')).toHaveText('Total: 23'); await geometry(page);
    await page.screenshot({ path: info.outputPath(`dealer-revealed-text200-${viewport.width}.png`), fullPage: true });
  }
});

test('[M10A-E09] isolated public five-card Dealer composition preserves readable cards and surrounding accepted seats', async ({ page }, info) => {
  // Public layout fixture only: surrounding seed7 player state is not the fixture's played round.
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page);
    await page.locator('.dealer-zone').evaluate(async el => {
      const componentUrl = '/src/ui/DealerZone.tsx', reactUrl = '/node_modules/.vite/deps/react.js', rootUrl = '/node_modules/.vite/deps/react-dom_client.js';
      const { DealerZone } = await import(componentUrl), { default: React } = await import(reactUrl), { default: ReactDOM } = await import(rootUrl);
      const mount = document.createElement('div'); mount.setAttribute('data-layout-fixture', 'Isolated public five-card Dealer'); el.replaceWith(mount);
      ReactDOM.createRoot(mount).render(React.createElement(DealerZone, { dealer: { upcard: { rank: '2', suit: 'clubs' }, holeCard: { rank: '3', suit: 'diamonds' },
        visibleCards: [{ rank: '2', suit: 'clubs' }, { rank: '3', suit: 'diamonds' }, { rank: '4', suit: 'hearts' }, { rank: '5', suit: 'spades' }, { rank: '6', suit: 'clubs' }], total: 20, status: 'Dealer complete' } }));
    });
    const dealer = page.locator('.dealer-zone'); await expect(dealer.locator('.card')).toHaveCount(5);
    await expect(dealer.locator('.dealer-total')).toHaveText('Total: 20');
    for (const enlarged of [false, true]) {
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      await geometry(page);
      const cards = await dealer.locator('.card').evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
      for (let i = 0; i < cards.length; i++) for (const b of cards.slice(i + 1)) { const a = cards[i]; expect(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y).toBe(true); }
      expect(await dealer.locator('.dealer-card-lane').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      await page.screenshot({ path: info.outputPath(`dealer-five${enlarged ? '-text200' : ''}-${viewport.width}.png`), fullPage: true });
    }
  }
});

test('[M10A-E10] felt spots follow only occupied seats and real public hands through open play and settlement', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player');
    const table = page.locator('[data-felt-markings]');
    await expect(table).toHaveCount(1);
    expect(await table.locator('.seat').evaluateAll(els => els.map(el => el.getAttribute('data-seat-anchor')))).toEqual(['seat-1', 'seat-3', 'seat-4', 'seat-6']);
    await expect(table.locator('[data-felt-destination="main-wager"]:visible')).toHaveCount(4);
    await expect(table.locator('[data-felt-rules]')).toHaveText('BLACKJACK PAYS 3:2 DEALER STANDS ON ALL 17');
    await expect(table.locator('[data-felt-destination="deal-origin"]')).toHaveAttribute('data-anchor', 'dealer-shoe');
    await geometry(page); await page.screenshot({ path: info.outputPath(`felt-open-${viewport.width}.png`), fullPage: true });
    await page.getByLabel('Your main wager', { exact: false }).fill('100'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
    await expect(table.locator('article[data-felt-destination="hand"]')).toHaveCount(4);
    for (const hand of await table.locator('article[data-felt-destination="hand"]').all()) {
      expect(await hand.getAttribute('data-hand-id')).toBeTruthy();
      await expect(hand.locator('[data-felt-destination="main-wager"], [data-felt-destination="hand-wager"]')).toHaveCount(1);
    }
    await expect(page.locator('#player-hand [data-felt-destination="main-wager"]')).toHaveText('MAIN: 100 credits');
    await expect(page.locator('#player-hand [data-felt-destination="hand-wager"]')).toHaveText('Wager: 100 credits');
    await geometry(page); await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: info.outputPath(`felt-dealt-${viewport.width}.png`), fullPage: true });
    await page.getByRole('button', { name: 'Stand', exact: true }).click();
    await expect(page.locator('#player-result')).toBeFocused();
    await expect(table.locator('[data-felt-destination="dealer-hand"]')).toHaveAttribute('data-anchor', 'dealer-cards');
    await expect(table.getByRole('img', { name: 'Hidden dealer card', exact: true })).toHaveCount(0);
    await geometry(page); await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: info.outputPath(`felt-complete-${viewport.width}.png`), fullPage: true });
  }
});

test('[M10A-E11] real Split leaves keep exact wager destinations without repeating decorative hand outlines', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page, 'player-split');
    await page.getByRole('button', { name: 'Split', exact: true }).click();
    const local = page.locator('#player-hand');
    await expect(local.locator('article[data-felt-destination="hand"]')).toHaveCount(2);
    await expect(local.locator('[data-felt-destination="hand-wager"]')).toHaveText(['Wager: 100 credits', 'Wager: 100 credits']);
    await expect(local.locator('[data-felt-destination="main-wager"]')).toHaveCount(1);
    for (const cards of await local.locator('article .cards').all()) {
      expect(await cards.evaluate(el => getComputedStyle(el, '::after').content)).toBe('none');
    }
    await expect(local.locator('.turn-marker')).toHaveCount(1);
    await geometry(page); await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: info.outputPath(`felt-split-${viewport.width}.png`), fullPage: true });
  }
});

test('[M10A-E12] enlarged felt text and static guides preserve unobstructed keyboard focus and native controls', async ({ page }, info) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport); await deal(page);
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await geometry(page);
    for (const el of await page.locator('[data-felt-rules], #player-hand [data-felt-destination="main-wager"]').all()) {
      expect(await el.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    }
    const rules = page.locator('[data-felt-rules]');
    const decorative = await rules.evaluate(el => ({ content: getComputedStyle(el, '::before').content, pointerEvents: getComputedStyle(el, '::before').pointerEvents }));
    expect(decorative).toEqual({ content: '""', pointerEvents: 'none' });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: info.outputPath(`felt-text200-${viewport.width}.png`), fullPage: true });
    await page.locator('#player-hand').focus(); const stand = page.getByRole('button', { name: 'Stand', exact: true });
    for (let i = 0; i < 8 && !await stand.evaluate(el => el === document.activeElement); i++) await page.keyboard.press('Tab');
    await expect(stand).toBeFocused(); const box = await stand.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press('Enter'); await expect(page.locator('#player-result')).toBeFocused();
  }
});
