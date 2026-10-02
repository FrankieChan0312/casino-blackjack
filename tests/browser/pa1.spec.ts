import { test, expect, type Page } from '@playwright/test';

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
  await page.goto('/?fixture=player');
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
    await page.goto('/?fixture=player');
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
