import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';

const generic = 'Dealer: generic formal portrait';
async function start(page: Page, count: number) {
  await page.getByLabel('Total players', { exact: true }).selectOption(String(count));
  await page.getByRole('button', { name: 'Start table', exact: true }).click();
}
async function deal(page: Page) {
  await page.getByLabel('Your main wager', { exact: false }).fill('100');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
}
async function finish(page: Page) {
  if (await page.getByRole('button', { name: 'Decline', exact: true }).count()) await page.getByRole('button', { name: 'Decline', exact: true }).click();
  if (await page.getByRole('button', { name: 'Stand', exact: true }).count()) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toBeVisible();
}
async function portrait(page: Page, name: string) {
  const dealer = page.getByRole('region', { name: 'Dealer', exact: true });
  const image = dealer.getByRole('img', { name, exact: true });
  await expect(image).toBeVisible();
  if (name !== 'Dealer portrait unavailable') await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(240);
  await expect(dealer.locator('.person-dealer,svg')).toHaveCount(0);
  return dealer;
}
async function capture(page: Page, info: TestInfo, name: string) {
  await expect(page.locator('.person-dealer')).toHaveCount(0);
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true });
}
test.afterEach(async ({ page }) => {
  await expect(page.locator('.person-dealer')).toHaveCount(0);
  expect(await page.locator('.dealer-zone img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
});

test('[PRE-T11-B01] real unstarted setup preview has no roster identity and shows the supplied portrait', async ({ page }, info) => {
  await page.goto('/?fixture=player-setup'); const dealer = await portrait(page, generic);
  expect(await dealer.getAttribute('data-dealer-character')).toBeNull();
  await expect(page.locator('.audit-list li')).toHaveCount(1);
  await expect(page.locator('.audit-list li')).toContainText('#1 system · SESSION_START · ACCEPTED');
  await expect(page.locator('[data-seat-anchor]')).toHaveCount(0);
  await capture(page, info, '01-setup-generic');
});
for (const count of [1, 4, 7]) test(`[PRE-T11-B02-${count}] eligible Celestine remains formal through active and complete ${count}-player rounds`, async ({ page }, info) => {
  await page.goto('/?fixture=player-setup'); await start(page, count);
  const dealer = await portrait(page, 'Dealer: Celestine'); await expect(dealer).toHaveAttribute('data-dealer-character', 'noble_female');
  await deal(page); await capture(page, info, `02-table-${count}-waiting`); await finish(page);
  await portrait(page, 'Dealer: Celestine'); await capture(page, info, `03-table-${count}-complete`);
  await page.getByRole('button', { name: 'Deal Again', exact: true }).click(); await portrait(page, 'Dealer: Celestine');
  await deal(page); await finish(page); await page.getByRole('button', { name: 'New table · reset to 1000 credits', exact: true }).click();
  await portrait(page, generic); await start(page, 1); await portrait(page, 'Dealer: Seraphine');
  await capture(page, info, `04-rotated-Seraphine-after-${count}`);
});
test('[PRE-T11-B03] seated Celestine selects eligible Seraphine while retaining the human identity', async ({ page }, info) => {
  await page.goto('/?fixture=player-setup'); await page.locator('.character-picker summary').click();
  await page.getByLabel('Your character', { exact: true }).selectOption('noble_female'); await start(page, 4);
  await portrait(page, 'Dealer: Seraphine'); await expect(page.locator('#player-hand')).toHaveAttribute('data-character', 'noble_female');
  await capture(page, info, '05-collision-Seraphine');
});
test('[PRE-T11-B04] all approved identities seated use only the non-roster generic without replacing any player', async ({ page }, info) => {
  await page.goto('/?fixture=player-setup');
  await page.locator('#root').evaluate(async root => {
    const app = '/src/ui/App.tsx', controller = '/src/browser/controller.ts', registry = '/src/presentation/formalDealers.ts', react = '/node_modules/.vite/deps/react.js', dom = '/node_modules/.vite/deps/react-dom_client.js';
    const { App } = await import(app), { createBrowserController } = await import(controller), { FORMAL_DEALER_CONFIGURATION } = await import(registry), { default: React } = await import(react), { default: ReactDOM } = await import(dom);
    const ids = ['elf_male', 'elf_female', 'knight_male', 'knight_female', 'mage_male', 'mage_female', 'noble_male', 'noble_female', 'halforc_male', 'halforc_female', 'dwarf_male', 'dwarf_female'];
    const picks = ['knight_female', 'mage_female', 'elf_female', 'halforc_female', 'elf_male', 'dwarf_male'];
    const choose = (n: number) => { const available = ids.filter(id => id !== 'noble_female'), index = 11 - n; for (let i = 0; i < index; i++) available.splice(available.indexOf(picks[i]), 1); return available.indexOf(picks[index]); };
    const mount = document.createElement('div'); root.replaceChildren(mount);
    ReactDOM.createRoot(mount).render(React.createElement(App, { controller: createBrowserController({ playerMode: true, deferPlayerStart: true, seed: 7 }), chooseCharacter: choose, dealerConfiguration: FORMAL_DEALER_CONFIGURATION }));
  });
  await page.locator('.character-picker summary').click(); await page.getByLabel('Your character', { exact: true }).selectOption('noble_female');
  await start(page, 7); const dealer = await portrait(page, generic); expect(await dealer.getAttribute('data-dealer-character')).toBeNull();
  const ids = await page.locator('[data-seat-anchor]').evaluateAll(els => els.map(el => el.getAttribute('data-character')));
  expect(new Set(ids).size).toBe(7); for (const id of ['noble_female', 'knight_female', 'mage_female', 'elf_female', 'halforc_female']) expect(ids).toContain(id);
  await deal(page); await capture(page, info, '06-all-pool-seated-generic'); await finish(page);
});
for (const emergency of [false, true]) test(`[PRE-T11-B05-${emergency}] failed roster image falls through ${emergency ? 'to neutral text when both images fail' : 'to decoded generic PNG'}`, async ({ page }, info) => {
  await page.route(emergency ? '**/characters/dealer/**/formal.png' : '**/characters/dealer/noble_female/formal.png', route => route.abort());
  await page.goto('/?fixture=player'); await portrait(page, emergency ? 'Dealer portrait unavailable' : generic);
  if (emergency) await expect(page.locator('.dealer-zone img')).toHaveCount(0);
  await deal(page); await expect(page.getByRole('button', { name: 'Stand', exact: true })).toBeEnabled();
  await capture(page, info, `07-image-failure-${emergency ? 'neutral' : 'generic'}`); await finish(page);
});
for (const [mode, width, height] of [['REDUCED_MOTION', 768, 1024], ['IMMEDIATE', 320, 720]] as const) test(`[PRE-T11-B06-${mode}] responsive generic fallback and terminal replay preserve live audit/cards`, async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: mode === 'IMMEDIATE' ? 'no-preference' : 'reduce' });
  await page.setViewportSize({ width, height }); await page.goto(`/?fixture=player&dealer=legacy&motion=${mode}`);
  await portrait(page, generic); await deal(page); await finish(page);
  await expect(page.locator('.game-scene')).toHaveAttribute('data-presentation-mode', mode);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const audit = await page.locator('.audit-list li').allTextContents(), cards = await page.locator('.dealer-card-lane').innerHTML();
  const credits = await page.getByRole('region', { name: 'Your credits', exact: true }).innerHTML();
  await page.getByText('Developer / demo tools', { exact: true }).click();
  await page.getByRole('button', { name: 'View replay package', exact: true }).click();
  const replay = JSON.parse(await page.getByLabel('Completed replay JSON', { exact: true }).inputValue());
  expect(JSON.stringify(replay)).not.toMatch(/generic_female|formal\.png|characterId/);
  await page.getByRole('button', { name: 'Replay completed session', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Replay result', exact: true })).toBeVisible();
  const after = await page.locator('.audit-list li').allTextContents();
  expect(after.slice(0, audit.length)).toEqual(audit); expect(after).toHaveLength(audit.length + 2);
  expect(after[audit.length]).toContain('REPLAY_START'); expect(after[audit.length + 1]).toContain('REPLAY_COMPLETE');
  expect(await page.locator('.dealer-card-lane').innerHTML()).toBe(cards);
  expect(await page.getByRole('region', { name: 'Your credits', exact: true }).innerHTML()).toBe(credits);
  expect(JSON.parse(await page.getByLabel('Completed replay JSON', { exact: true }).inputValue())).toEqual(replay);
  await portrait(page, generic); await capture(page, info, `08-${width}-${mode}-replay`);
});
test('[PRE-T11-B07] full motion Dealer remains formal at paused initial deal and real public reveal', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/?fixture=player-dealer-multi'); await portrait(page, 'Dealer: Celestine');
  await page.evaluate(() => {
    const observer = new MutationObserver(() => {
      const flight = document.querySelector('[data-initial-deal-flight]');
      if (flight) { flight.getAnimations({ subtree: true }).forEach(animation => animation.pause()); observer.disconnect(); }
    }); observer.observe(document.body, { childList: true, subtree: true });
  });
  await deal(page); await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'DEALING');
  await portrait(page, 'Dealer: Celestine');
  const pixels = async (name: string) => { const cdp = await page.context().newCDPSession(page); const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true }); await cdp.detach(); writeFileSync(info.outputPath(name + '.png'), Buffer.from(shot.data, 'base64')); };
  await pixels('09-active-DEALING'); await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'WAITING_PLAYER');
  await page.evaluate(() => { const observer = new MutationObserver(() => { const card = document.querySelector('[data-dealer-reveal]'); if (card) { card.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 35; }); observer.disconnect(); } }); observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-dealer-reveal'] }); });
  await page.getByRole('button', { name: 'Stand', exact: true }).click(); await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'REVEALING');
  await portrait(page, 'Dealer: Celestine'); await pixels('10-active-REVEALING');
  await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Your round result', exact: true })).toBeVisible();
  await capture(page, info, '11-motion-complete');
});
