import { test, expect, type Page } from '@playwright/test';
import { capturePa1Evidence } from './pa1Evidence.js';

async function lineup(page: Page) { return page.locator('.seats > .seat').evaluateAll(seats => seats.map(seat => seat.getAttribute('data-character'))); }
async function choose(page: Page, id: string) {
  const picker = page.locator('.character-picker');
  if (!await picker.evaluate(element => element.hasAttribute('open'))) await picker.locator('summary').click();
  await page.getByLabel('Your character',{exact:true}).selectOption(id);
}
async function deal(page: Page) {
  await page.getByLabel('Your main wager',{exact:false}).fill('100');
  await page.getByRole('button',{name:'Deal',exact:true}).click();
}
test('[PA1-E01] non-blocking default, collision exchange and persistent guests across active play Repeat Bet and Deal Again', async ({ page }) => {
  await page.goto('/?fixture=player&dealer=legacy');
  expect(await lineup(page)).toEqual(['elf_male','elf_female','knight_male','knight_female']);
  await expect(page.locator('.character-picker')).not.toHaveAttribute('open','');
  await expect(page.getByRole('button',{name:'Deal',exact:true})).toBeEnabled();
  const audit = await page.locator('.audit-list').innerHTML(); const funds = await page.locator('.credits').innerText();
  await choose(page,'elf_female');
  expect(await lineup(page)).toEqual(['elf_male','knight_male','elf_female','knight_female']);
  expect(await page.locator('.audit-list').innerHTML()).toBe(audit); expect(await page.locator('.credits').innerText()).toBe(funds);
  await deal(page); const cards = await page.locator('#player-hand .cards').innerHTML();
  const activeAudit = await page.locator('.audit-list').innerHTML();
  await choose(page,'noble_female');
  expect(await page.locator('#player-hand .cards').innerHTML()).toBe(cards);
  expect(await page.locator('.audit-list').innerHTML()).toBe(activeAudit);
  await expect(page.getByRole('button',{name:'Stand',exact:true})).toBeEnabled();
  const persistent = await lineup(page);
  await page.getByRole('button',{name:'Stand',exact:true}).click(); expect(await lineup(page)).toEqual(persistent);
  await page.getByRole('button',{name:/^Repeat Bet/}).click(); expect(await lineup(page)).toEqual(persistent);
  if (await page.getByRole('button',{name:'Decline',exact:true}).count()) await page.getByRole('button',{name:'Decline',exact:true}).click();
  while (await page.getByRole('button',{name:'Stand',exact:true}).count()) await page.getByRole('button',{name:'Stand',exact:true}).click();
  await page.getByRole('button',{name:'Deal Again',exact:true}).click(); expect(await lineup(page)).toEqual(persistent);
  await page.getByText('Developer / demo tools',{exact:true}).click(); await page.getByText('Advanced demo settings',{exact:true}).click();
  await page.getByRole('button',{name:'Start new demo session',exact:true}).click();
  expect(await lineup(page)).toEqual(['elf_male','elf_female','knight_male','knight_female']);
});
test('[PA1-E02] changing avatars leaves seeded replay commands gameplay digest funds and audit outcomes identical', async ({ page }) => {
  const receipts: string[] = [], results: string[] = [], audits: string[] = [];
  for (const change of [false,true]) {
    await page.goto('/?fixture=player&dealer=legacy');
    if (change) await choose(page,'dwarf_female');
    await deal(page); if (change) await choose(page,'noble_male');
    await page.getByRole('button',{name:'Stand',exact:true}).click();
    results.push(await page.getByRole('region',{name:'Your round result',exact:true}).innerText());
    audits.push(await page.locator('.audit-list').innerHTML());
    await page.getByText('Developer / demo tools',{exact:true}).click();
    await page.getByRole('button',{name:'View replay package',exact:true}).click();
    receipts.push(await page.getByLabel('Completed replay JSON',{exact:true}).inputValue());
    await page.getByRole('button',{name:'Replay completed session',exact:true}).click();
    results.push(await page.getByRole('region',{name:'Replay result',exact:true}).innerText());
  }
  expect(receipts[1]).toBe(receipts[0]); expect(audits[1]).toBe(audits[0]);
  expect(results[2]).toBe(results[0]); expect(results[3]).toBe(results[1]);
  expect(receipts[1]).not.toMatch(/character|Caelan|Lucien|Borin/);
});
test('[PA1-E03] all twelve identities display the correct decoded portrait name archetype and human controller without changing cards', async ({ page }) => {
  const roster = [
    ['elf_male','Caelan','Male Elf'],['elf_female','Elaria','Female Elf'],
    ['knight_male','Roland','Male Human Knight'],['knight_female','Seraphine','Female Human Knight'],
    ['mage_male','Alaric','Male Mage'],['mage_female','Nyra','Female Mage'],
    ['noble_male','Lucien','Male Noble'],['noble_female','Celestine','Female Noble'],
    ['halforc_male','Garruk','Male Half-Orc Warrior'],['halforc_female','Vesha','Female Half-Orc Warrior'],
    ['dwarf_male','Borin','Male Dwarf'],['dwarf_female','Brynja','Female Dwarf'],
  ];
  await page.goto('/?fixture=player&dealer=legacy'); await deal(page);
  const hand = page.locator('#player-hand'), cards = await hand.locator('.cards').innerHTML();
  for (const [id,name,archetype] of roster) {
    await choose(page,id);
    await expect(hand.getByRole('heading',{name,exact:true})).toBeVisible();
    await expect(hand.locator('.character-archetype')).toHaveText(archetype);
    await expect(hand.locator('.character-controller')).toContainText('Seat 4 · You · Human');
    const portrait = hand.getByRole('img',{name:`Your avatar: ${name}, ${archetype}`,exact:true});
    await expect(portrait).toBeVisible(); await expect(portrait).toHaveAttribute('src',`/characters/${id}.png`);
    await expect(portrait).toHaveJSProperty('naturalWidth',240); await expect(portrait).toHaveJSProperty('naturalHeight',320);
    expect(await hand.locator('.cards').innerHTML()).toBe(cards);
    const ids = await lineup(page); expect(new Set(ids).size).toBe(4);
    await capturePa1Evidence(`docs/images/pa1-avatar-${id}.png`,test.info().outputPath(`pa1-avatar-${id}.png`),path=>hand.screenshot({path,animations:'disabled'}));
  }
  await expect(page.getByRole('img',{name:'Original illustrated female dealer in professional attire',exact:true})).toBeVisible();
  for (const seat of [1,3,6]) {
    const guest = page.getByRole('region',{name:`Seat ${seat}`,exact:true});
    await expect(guest.getByRole('img',{name:/^Computer guest: /})).toBeVisible();
    await expect(guest.locator('.character-controller')).toContainText(`Seat ${seat} · Computer`);
  }
});

test('[PA1-E04] character keyboard focus touch targets reduced motion and unclipped identities preserve cards at desktop tablet and mobile widths', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const viewport of [{width:1280,height:900},{width:768,height:1024},{width:320,height:720}]) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player&dealer=legacy'); await deal(page);
    const summary = page.locator('.character-picker summary');
    for (let i=0;i<30 && !await summary.evaluate(el=>el===document.activeElement);i++) await page.keyboard.press('Tab');
    await expect(summary).toBeFocused();
    expect(await summary.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
    expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press('Enter'); await page.keyboard.press('Tab');
    const select = page.getByLabel('Your character',{exact:true}); await expect(select).toBeFocused();
    expect(await select.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
    expect((await select.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press('End'); await page.keyboard.press('Enter'); await expect(select).toHaveValue('dwarf_female');
    await expect(page.locator('#player-hand').getByRole('heading',{name:'Brynja',exact:true})).toBeVisible();
    await select.selectOption('halforc_female');
    for (const seat of [1,3,4,6]) {
      const region = page.getByRole('region',{name:`Seat ${seat}`,exact:true});
      const identity = region.locator('.character-identity'); await expect(identity).toBeVisible();
      expect(await identity.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
      const portrait = (await identity.locator('img').boundingBox())!;
      const text = (await identity.locator('div').boundingBox())!;
      expect(portrait.x+portrait.width<=text.x+1 || portrait.y+portrait.height<=text.y+1).toBe(true);
      if (viewport.width>600 || seat===4) {
        const cards = (await region.locator('article .cards').first().boundingBox())!;
        expect(cards.y).toBeGreaterThanOrEqual((await identity.boundingBox())!.y+(await identity.boundingBox())!.height);
      }
    }
    for (const name of ['Hit','Stand','Double','Surrender']) {
      const action = page.getByRole('button',{name,exact:true}); const box = (await action.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44); expect(box.width).toBeGreaterThanOrEqual(44);
      expect(await action.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
    }
    await expect(page.getByRole('img',{name:'Hidden dealer card',exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await capturePa1Evidence(`docs/images/pa1-responsive-${viewport.width}.png`,test.info().outputPath(`pa1-responsive-${viewport.width}.png`),path=>page.screenshot({path,fullPage:true,animations:'disabled'}),{width:viewport.width,minHeight:viewport.height});
  }
});

test('[PA1-E05] failed portraits and 200 percent text enlargement retain readable character identity and playable controls', async ({ page }) => {
  await page.route('**/characters/*.png',route=>route.abort());
  for (const viewport of [{width:1280,height:900},{width:320,height:720}]) {
    await page.setViewportSize(viewport); await page.goto('/?fixture=player&dealer=legacy'); await deal(page); await choose(page,'knight_female');
    await page.addStyleTag({content:'html { font-size: 200%; }'});
    await expect(page.locator('#player-hand').getByRole('heading',{name:'Seraphine',exact:true})).toBeVisible();
    await expect(page.locator('#player-hand .character-archetype')).toHaveText('Female Human Knight');
    await expect(page.locator('#player-hand .character-controller')).toContainText('You · Human');
    await expect(page.locator('#player-hand .character-identity img')).toHaveJSProperty('naturalWidth',0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.locator('#player-hand .character-identity').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
    await expect(page.getByRole('button',{name:'Stand',exact:true})).toBeEnabled();
    await capturePa1Evidence(`docs/images/pa1-text-fallback-${viewport.width}.png`,test.info().outputPath(`pa1-text-fallback-${viewport.width}.png`),path=>page.screenshot({path,fullPage:true,animations:'disabled'}),{width:viewport.width,minHeight:viewport.height});
    await page.getByRole('button',{name:'Stand',exact:true}).click();
    await expect(page.getByRole('region',{name:'Your round result',exact:true})).toBeVisible();
  }
});
