import { test, expect, type Page } from '@playwright/test';
const button=(p:Page,name:string)=>p.getByRole('button',{name,exact:true});
async function advanced(p:Page){await p.getByText('Advanced demo settings',{exact:true}).click();}
async function start(p:Page,profile='CHARLIE5_6D_S17_V1_1',seed='21'){
  await p.goto('/?fixture=setup');await advanced(p);await p.getByLabel('New session profile').selectOption(profile);
  await p.getByLabel('Optional reproducible demo seed').fill(seed);await button(p,'Start new demo session').click();
  await button(p,'Open betting').click();await button(p,'Set Your MAIN at Seat 1').click();await button(p,'Close betting and deal').click();
  if(await button(p,'Decline').count())await button(p,'Decline').click();
}
async function charlie(p:Page){for(let i=0;i<3;i++)await button(p,'Hit').click();await button(p,'Continue table').click();}
test('[REG-M8-079] Classic five-card hand has no Charlie result and can continue',async({page})=>{
  await page.goto('/?fixture=five');for(let i=0;i<3;i++)await button(page,'Hit').click();
  await expect(button(page,'Hit')).toBeEnabled();await expect(page.locator('body')).not.toContainText('Charlie');
});
test('[REG-M8-080] Charlie profile is selected explicitly before seeded play',async({page})=>{
  await start(page);await expect(page.getByRole('region',{name:'Demo and audit tools'})).toContainText('Profile: Five-Card Charlie Demo');
  await expect(page.getByRole('region',{name:'Demo and audit tools'})).toContainText('A legal Hit that brings the hand to exactly five cards with a total of 21 or less wins 1:1.');
  await expect(page.getByRole('region',{name:'Demo and audit tools'})).not.toContainText('fifth legal Hit');
  await expect(page.getByLabel('New session profile')).toBeDisabled();
});
test('[REG-M8-081] five-card Charlie presents normal 1:1 return and ends actions',async({page})=>{
  await page.goto('/?fixture=charlie');for(let i=0;i<3;i++)await button(page,'Hit').click();await button(page,'Continue table').click();
  await expect(page.getByRole('region',{name:'Main hand results'})).toContainText('Charlie Win');
  await expect(page.getByRole('region',{name:'Main hand results'})).toContainText('Returned: 200');await expect(button(page,'Hit')).toHaveCount(0);
});
test('[REG-M8-082] fifth-card 21 says Charlie Win rather than Blackjack',async({page})=>{
  await page.goto('/?fixture=charlie21');for(let i=0;i<3;i++)await button(page,'Hit').click();await button(page,'Continue table').click();
  const results=page.getByRole('region',{name:'Main hand results'});await expect(results).toContainText('Charlie Win');await expect(results).not.toContainText('Blackjack');
});
test('[REG-M8-083] profile and seed controls cannot change during active hidden-card round',async({page})=>{
  await start(page);await advanced(page);await expect(page.getByLabel('New session profile')).toBeDisabled();
  await expect(page.getByLabel('Optional reproducible demo seed')).toHaveCount(0);await expect(button(page,'Start new demo session')).toHaveCount(0);
});
test('[REG-M8-084] same seeded browser run reproduces public cards and terminal return',async({page})=>{
  await start(page);const cards=await page.getByRole('region',{name:'Primary actions'}).textContent();await charlie(page);
  const result=await page.getByRole('region',{name:'Main hand results'}).textContent();
  await start(page);expect(await page.getByRole('region',{name:'Primary actions'}).textContent()).toBe(cards);await charlie(page);
  expect(await page.getByRole('region',{name:'Main hand results'}).textContent()).toBe(result);
});
test('[REG-M8-085] replay JSON is available only at finalized seeded boundary and removed on next round',async({page})=>{
  await start(page);await expect(button(page,'View replay package')).toHaveCount(0);await expect(page.getByLabel('Completed replay JSON')).toHaveCount(0);
  await charlie(page);await button(page,'View replay package').click();await expect(page.getByLabel('Completed replay JSON')).toBeVisible();
  expect(JSON.parse(await page.getByLabel('Completed replay JSON').inputValue()).replayVersion).toBe(1);
  await button(page,'Next round').click();await expect(page.getByLabel('Completed replay JSON')).toHaveCount(0);await expect(button(page,'View replay package')).toHaveCount(0);
});
test('[REG-M8-086] completed replay reproduces result, is clearly marked and preserves original',async({page})=>{
  await start(page);await charlie(page);const before=await page.getByRole('region',{name:'Main hand results'}).textContent();
  await button(page,'Replay completed session').click();await expect(page.getByRole('region',{name:'Replay result'})).toContainText('Replay mode');
  await expect(page.getByRole('region',{name:'Replay result'})).toContainText('Charlie Win');expect(await page.getByRole('region',{name:'Main hand results'}).textContent()).toBe(before);
});
test('[REG-M8-087] public audit displays ordered attribution UTC amounts refunds and pre-round seat occupancy',async({page})=>{
  await start(page);await button(page,'Hit').click();await page.getByText(/Public audit history \(/).click();
  const items=page.locator('.audit-list li');const values=await items.evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('value'))));
  expect(values).toEqual(values.map((_,i)=>i+1));await expect(page.locator('.audit-list')).toContainText('local-human · HIT · ACCEPTED');
  await expect(page.locator('.audit-list')).toContainText('Stake / amount: 10');expect(await page.locator('.audit-list time').first().getAttribute('datetime')).toMatch(/Z$/);
  const configured=page.locator('.audit-list li').filter({hasText:'SEAT_CONFIGURED'});
  await expect(configured.filter({hasText:'Seat 1'})).toContainText('Human');
  await expect(configured.filter({hasText:'Seat 2'})).toContainText('Empty');
  for(const row of await configured.all())await expect(row).not.toContainText('Awaiting result');
  await expect(configured.filter({hasText:'Seat 1'})).not.toContainText('round-1');

  await page.goto('/?fixture=setup');await page.getByLabel('Computer at Seat 2',{exact:true}).check();
  await button(page,'Open betting').click();await page.getByText(/Public audit history \(/).click();
  await expect(configured.filter({hasText:'Seat 2'})).toContainText('Computer');
  await expect(configured.filter({hasText:'Seat 3'})).toContainText('Empty');
  await button(page,'Set Your MAIN at Seat 1').click();await button(page,'Set Pair side bet').click();
  await button(page,'Set Computer MAIN at Seat 2').click();await page.getByLabel('Bet Behind target',{exact:true}).selectOption('2');
  await button(page,'Set Bet Behind Seat 2').click();
  await button(page,'Cancel Your MAIN at Seat 1').click();await button(page,'Cancel Computer MAIN at Seat 2').click();
  for(const [type,stake] of [['MAIN_CANCEL','10'],['PAIR_CANCEL','1'],['BACK_CANCEL','10']]){
    const cancelled=page.locator('.audit-list li').filter({hasText:type});
    for(const row of await cancelled.all()){
      await expect(row).toContainText(`Stake / amount: ${stake}`);await expect(row).toContainText(`Returned ${stake}`);
    }
    expect(await cancelled.count()).toBeGreaterThan(0);
  }

  await page.goto('/?fixture=setup');await page.getByLabel('Sit out this round',{exact:true}).check();
  await button(page,'Open betting').click();await page.getByText(/Public audit history \(/).click();
  await expect(configured.filter({hasText:'Seat 1'})).toContainText('Sitting Out');
  for(const row of await configured.all())await expect(row).not.toContainText('Awaiting result');
});
test('[REG-M8-088] active audit leaks no known hole identity, physical ID, seed or future shoe',async({page})=>{
  await page.goto('/?fixture=basic');await page.getByText(/Public audit history \(/).click();const audit=await page.locator('.audit-list').textContent();
  expect(audit).not.toMatch(/K of spades|1:spades:K|seed|prng|shoe|rank|suit|deckIndex/i);
  const aria=await page.locator('body').ariaSnapshot();expect(aria).not.toContain('K of spades');
});
test('[REG-M8-089] active seeded DOM and accessible output omit seed value and replay package',async({page})=>{
  await start(page,'CHARLIE5_6D_S17_V1_1','4294967295');await page.getByText(/Public audit history \(/).click();
  expect(await page.locator('body').textContent()).not.toContain('4294967295');expect(await page.locator('body').ariaSnapshot()).not.toContain('4294967295');
  expect(await page.locator('body').evaluate(el=>el.outerHTML)).not.toMatch(/"seed"|randomAlgorithm|deckIndex/);
});
test('[REG-M8-090] M8 tools and replay JSON remain usable at 320px without overflow',async({page})=>{
  await page.setViewportSize({width:320,height:720});await start(page);await charlie(page);await button(page,'View replay package').click();
  await page.getByText(/Public audit history \(/).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const name of ['View replay package','Replay completed session','Copy replay JSON']){
    const target=button(page,name==='View replay package'?'Hide replay package':name);const box=await target.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});
test('[REG-M8-091] keyboard opens advanced settings, chooses profile and starts seeded session',async({page})=>{
  await page.goto('/?fixture=setup');const summary=page.getByText('Advanced demo settings',{exact:true});await summary.focus();await page.keyboard.press('Enter');
  await page.getByLabel('New session profile').focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Tab');
  await expect(page.getByLabel('Optional reproducible demo seed')).toBeFocused();await page.keyboard.type('21');await page.keyboard.press('Tab');
  await expect(button(page,'Start new demo session')).toBeFocused();await page.keyboard.press('Enter');
  await expect(page.getByRole('region',{name:'Demo and audit tools'})).toContainText('Profile: Five-Card Charlie Demo');
});
