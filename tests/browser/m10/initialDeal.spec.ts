import { test, expect, type Page } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { Buffer } from 'node:buffer';

test.use({ reducedMotion: 'no-preference' });
const seats: Record<number, number[]> = { 1: [4], 4: [1,3,4,6], 7: [1,2,3,4,5,6,7] };
type Trace = { arrivals: string[]; flights: string[]; duplicate: boolean; overlap: boolean; started: number; finished: number; paused: boolean; checkpoints: string[]; interruptions: string[]; pauseStates: string[][] };
async function setup(page: Page, count: number) {
  await page.goto('/?fixture=player-setup');
  await page.getByLabel('Total players', { exact: true }).selectOption(String(count));
  await page.getByRole('button', { name: 'Start table', exact: true }).click();
  await page.getByLabel('Your main wager', { exact: false }).fill('100');
}
async function observe(page: Page, checkpoints: string[] = []) {
  await page.evaluate(checkpoints => {
    const trace: Trace = { arrivals: [], flights: [], duplicate: false, overlap: false, started: performance.now(), finished: 0, paused: false, checkpoints, interruptions: [], pauseStates: [] };
    (window as unknown as { dealTrace: Trace }).dealTrace = trace;
    window.addEventListener('resize', () => trace.interruptions.push('resize'));
    document.addEventListener('visibilitychange', () => trace.interruptions.push(`visibility:${document.hidden}`));
    new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) if (node instanceof HTMLElement && node.dataset.initialDealFlight) {
        const target = node.dataset.dealTarget!;
        if (trace.flights.includes(target)) trace.duplicate = true;
        trace.flights.push(target);
        trace.overlap ||= document.querySelectorAll('[data-initial-deal-flight]').length > 1;
        if (trace.checkpoints.includes(target)) {
          const animations = node.getAnimations({ subtree: true }); animations.forEach(animation => animation.pause()); trace.paused = true;
          trace.pauseStates.push(animations.map(animation => animation.playState));
        }
      }
      for (const element of document.querySelectorAll<HTMLElement>('[data-card-slot][data-deal-visible="true"]')) {
        const key = element.dataset.cardSlot!;
        if (Number(key.slice(key.lastIndexOf(':') + 1)) < 2 && !trace.arrivals.includes(key)) trace.arrivals.push(key);
      }
      if (document.querySelector('[data-initial-deal-running="false"]') && trace.flights.length) trace.finished = performance.now();
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-deal-visible','data-initial-deal-running'] });
  }, checkpoints);
}
const trace = (page: Page) => page.evaluate(() => (window as unknown as { dealTrace: Trace }).dealTrace);
for (const count of [1,4,7]) test(`[T06-B01-${count}] real FULL_MOTION two-pass order, one clone, no premature arrival`, async ({ page }, info) => {
  await setup(page, count); await observe(page);
  const dealer = await page.locator('[data-dealer-character]').getAttribute('data-dealer-character');
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
  await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'DEALING');
  expect(await page.locator('[data-initial-deal-flight] .card').evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  await expect(page.locator('[data-card-slot][data-deal-visible="true"]')).toHaveCount(0);
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  const result = await trace(page), order = [0,1].flatMap(index => [...seats[count].map(seat => `round-1/seat-${seat}:${index}`), `dealer:${index}`]);
  expect(result.flights).toEqual(order); expect(result.arrivals).toEqual(order);
  expect(result.duplicate).toBe(false); expect(result.overlap).toBe(false);
  expect(result.finished - result.started).toBeLessThan(4000);
  await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  await expect(page.getByRole('img', { name: 'Hidden dealer card', exact: true })).toHaveCount(1);
  await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-character', dealer!);
  writeFileSync(info.outputPath('sequence.json'), JSON.stringify(result, null, 2));
});

for (const [count,width,height] of [[1,1280,900],[4,1280,900],[7,1280,900],[7,768,1024],[7,320,720]]) test(`[T06-B02-${count}-${width}] checkpoint captures actual start/first/second/settled`, async ({ page }, info) => {
  const root = 'docs/M10_T06_EVIDENCE/screenshots'; mkdirSync(root, { recursive: true });
    await page.setViewportSize({ width, height }); await setup(page, count);
    const checkpoints = count === 1 ? ['round-1/seat-4:0','dealer:0','round-1/seat-4:1','dealer:1']
      : [`round-1/seat-${seats[count][0]}:0`, `round-1/seat-${seats[count][Math.floor(count/2)]}:0`, `round-1/seat-${seats[count][0]}:1`, `round-1/seat-${seats[count][Math.floor(count/2)]}:1`];
    await observe(page, checkpoints); await page.getByRole('button', { name: 'Deal', exact: true }).click();
    for (const [index,target] of checkpoints.entries()) {
      await expect.poll(async () => (await trace(page)).paused && await page.locator(`[data-deal-target="${target}"]`).count() === 1).toBe(true);
      const before = await trace(page);
      if (width === 320 && index === 0) {
        const landing = await page.locator(`[data-deal-target="${target}"] .card`).evaluate(card => {
          const summary = document.querySelector<HTMLDetailsElement>('[data-seat-anchor="seat-1"] details')!;
          const box = summary.querySelector('summary')!.getBoundingClientRect();
          return { open: summary.open, actual: { x: parseFloat((card as HTMLElement).style.left) + parseFloat((card as HTMLElement).style.width)/2,
            y: parseFloat((card as HTMLElement).style.top) + parseFloat((card as HTMLElement).style.height)/2 },
            expected: { x: box.left + box.width/2 + scrollX, y: box.top + box.height/2 + scrollY } };
        });
        expect(landing.open).toBe(false);
        expect(Math.abs(landing.actual.x - landing.expected.x)).toBeLessThanOrEqual(1);
        expect(Math.abs(landing.actual.y - landing.expected.y)).toBeLessThanOrEqual(1);
        writeFileSync(info.outputPath('collapsed-summary-landing.json'), JSON.stringify(landing, null, 2));
      }
      const cdp = await page.context().newCDPSession(page);
      // Document-sized capture changes the viewport and correctly invokes resize settlement.
      // Native viewport pixels keep the real paused flight and lifecycle policy intact.
      await page.evaluate(() => scrollTo(0, 0));
      const capture = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
      await cdp.detach();
      writeFileSync(`${root}/${count}-${width}-${['start','mid-first-pass','end-first-pass','mid-second-pass'][index]}.png`, Buffer.from(capture.data, 'base64'));
      writeFileSync(info.outputPath(`capture-${index}.json`), JSON.stringify({ before, after: await trace(page) }, null, 2));
      await expect(page.locator(`[data-deal-target="${target}"]`)).toHaveCount(1);
      await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
      await page.evaluate(() => {
        const trace = (window as unknown as { dealTrace: Trace }).dealTrace;
        trace.paused = false; document.querySelectorAll<HTMLElement>('[data-initial-deal-flight]').forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.play()));
      });
    }
    await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `${root}/${count}-${width}-settled.png`, fullPage: true });
    writeFileSync(`${root}/${count}-${width}-sequence.json`, JSON.stringify(await trace(page), null, 2));
});

test('[T06-B03] skip/keyboard legal action settles before dispatch; new round/new table never replay stale cards', async ({ page }) => {
  await page.goto('/?fixture=player-split'); await observe(page);
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
  await page.getByRole('button', { name: 'Split', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#player-hand article')).toHaveCount(2); await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  await expect(page.locator('#player-hand [data-deal-visible="false"]')).toHaveCount(0);
  for (let index = 0; index < 2; index++) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  const dealer = await page.locator('.dealer-zone').getAttribute('data-dealer-character');
  await page.getByRole('button', { name: /^Repeat Bet/ }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
  await page.getByRole('button', { name: 'Skip animations', exact: true }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-character', dealer!);
  while (await page.getByRole('button', { name: 'Stand', exact: true }).count()) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  if (await page.getByRole('button', { name: 'Decline', exact: true }).count()) await page.getByRole('button', { name: 'Decline', exact: true }).click();
  while (await page.getByRole('button', { name: 'Stand', exact: true }).count()) await page.getByRole('button', { name: 'Stand', exact: true }).click();
  await page.getByRole('button', { name: 'New table · reset to 1000 credits', exact: true }).click();
  await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0); await expect(page.locator('[data-card-slot]')).toHaveCount(0);
});

test('[T06-B04] resize/background/text200 settle safely, keep native focus and bounded geometry', async ({ page }) => {
  await setup(page, 7); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(1);
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  await expect(page.locator('[data-deal-visible="false"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/?fixture=player-split'); await page.addStyleTag({ content: 'html {font-size: 200%}' });
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  await expect(page.locator('[data-deal-visible="false"]')).toHaveCount(0);
  const stand = page.getByRole('button', { name: 'Stand', exact: true }); await stand.focus(); await expect(stand).toBeFocused();
  const box = await stand.boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('[T06-B05] reduced preference settles without flights; IMMEDIATE uses the identical authoritative result', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await setup(page, 7); await observe(page);
  await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('[data-deal-visible="false"]')).toHaveCount(0);
  await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
  expect((await trace(page)).flights).toEqual([]);
  const result = await page.evaluate(async () => {
    const fixtureUrl = '/tests/browser/fixtures.ts', providerUrl = '/src/ui/PresentationProvider.tsx';
    const { createFixtureController } = await import(fixtureUrl), { createPresentationRuntime, connectPresentation } = await import(providerUrl);
    const receipts = [];
    for (const mode of ['IMMEDIATE','REDUCED_MOTION']) {
      const controller = createFixtureController('player'), runtime = createPresentationRuntime();
      const disconnect = connectPresentation(controller.presentation, runtime, mode);
      controller.dispatch({ type: 'DEAL', amount: 200 });
      receipts.push({ authority: controller.getSnapshot(), projection: runtime.initialDeal.getSnapshot().pending, active: runtime.timeline.getSnapshot().activeId });
      disconnect();
    }
    return receipts;
  });
  expect(result[0]).toEqual(result[1]); expect(result[0].active).toBeNull(); expect(result[0].projection).toEqual([]);
  await page.screenshot({ path: 'docs/M10_T06_EVIDENCE/reduced-seven-settled.png', fullPage: true });
});

test('[T06-B06] real Provider unmount cancels the active flight, leaves authority and late callbacks unchanged', async ({ page }) => {
  await page.goto('/?fixture=player');
  const result = await page.evaluate(async () => {
    const providerUrl = '/src/ui/PresentationProvider.tsx', cardsUrl = '/src/ui/Cards.tsx', fixtureUrl = '/tests/browser/fixtures.ts';
    const reactUrl = '/node_modules/.vite/deps/react.js', rootUrl = '/node_modules/.vite/deps/react-dom_client.js';
    const { PresentationProvider, usePresentationAnchor, usePresentationRuntime } = await import(providerUrl), { Cards, HiddenDealerCard } = await import(cardsUrl);
    const { createFixtureController } = await import(fixtureUrl), { default: React } = await import(reactUrl), { default: ReactDOM } = await import(rootUrl);
    const controller = createFixtureController('player-split'); controller.dispatch({ type: 'DEAL', amount: 200 });
    const authority = JSON.stringify(controller.getSnapshot()), hand = controller.getSnapshot().round.seats.find((seat: { seatNumber: number }) => seat.seatNumber === 4).hands[0];
    const host = document.createElement('div'); document.body.append(host); const root = ReactDOM.createRoot(host);
    let runtime: ReturnType<typeof usePresentationRuntime>;
    function Probe() {
      runtime = usePresentationRuntime(); const origin = usePresentationAnchor('deal-origin');
      return React.createElement('div', null, React.createElement('div', { ref: origin }, 'Shoe'), React.createElement(Cards, { cards: hand.cards, ownerId: hand.handId }), React.createElement(HiddenDealerCard));
    }
    const started = new Promise<void>(resolve => {
      const observer = new MutationObserver(() => { if (document.querySelector('[data-initial-deal-flight]')) { observer.disconnect(); resolve(); } });
      observer.observe(document.body, { subtree: true, childList: true });
    });
    root.render(React.createElement(PresentationProvider, { feed: controller.presentation }, React.createElement(Probe))); await started;
    const active = runtime!.timeline.getSnapshot().activeId; root.unmount(); host.remove();
    await Promise.resolve();
    return { active, remaining: document.querySelectorAll('[data-initial-deal-flight]').length, snapshot: runtime!.timeline.getSnapshot(), same: JSON.stringify(controller.getSnapshot()) === authority };
  });
  expect(result.active).not.toBeNull(); expect(result.remaining).toBe(0); expect(result.snapshot).toMatchObject({ activeId: null, pending: 0 }); expect(result.same).toBe(true);
});

for (const [fixture,state] of [['player-natural','IDLE'],['player-ace','WAITING_PLAYER']]) test(`[T06-B07-${fixture}] post-deal Dealer state follows actual terminal/Insurance authority`, async ({ page }) => {
  await page.goto(`/?fixture=${fixture}`); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', 'DEALING');
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  await expect(page.locator('.dealer-zone')).toHaveAttribute('data-dealer-presentation-state', state);
  if (fixture === 'player-ace') await expect(page.getByRole('button', { name: 'Decline', exact: true })).toBeVisible();
  else await expect(page.getByRole('button', { name: 'Deal Again', exact: true })).toBeVisible();
});
test('[T06-B08] new table cancels an active terminal deal; later Hit stays immediate and fully visible', async ({ page }) => {
  await page.goto('/?fixture=player-natural'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'true');
  await page.getByRole('button', { name: 'New table · reset to 1000 credits', exact: true }).click();
  await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0); await expect(page.locator('[data-card-slot]')).toHaveCount(0);
  await page.goto('/?fixture=player-loss'); await page.getByRole('button', { name: 'Deal', exact: true }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-initial-deal-running', 'false');
  await page.getByRole('button', { name: 'Hit', exact: true }).click();
  await expect(page.locator('#player-hand [data-card-slot]')).toHaveCount(3);
  await expect(page.locator('#player-hand [data-deal-visible="false"]')).toHaveCount(0); await expect(page.locator('[data-initial-deal-flight]')).toHaveCount(0);
});
