import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../../src/ui/App.js';
import { credits } from '../../src/ui/presentation.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

function open(spectator = false) {
  const c = createBrowserController({ factory: () => behindFixture(['10', '5', '6', '8', '6', 'K'], spectator ? [seat(2)] : [seat(1, 'HUMAN'), seat(2)]), random: noRandom });
  c.dispatch({ type: 'OPEN' }); c.dispatch({ type: 'MAIN', seat: 2, amount: 200 }); return c;
}
it('[REG-M7-013] seat setup supports local seat selection, computer configuration and spectator mode', () => {
  const html = renderToStaticMarkup(<App controller={createBrowserController()} />);
  expect(html).toContain('Your seat'); expect(html).toContain('Spectator'); expect(html).toContain('Computer at Seat 7');
});
it('[REG-M7-014] seated player can reserve MAIN and independent side wagers', () => {
  const c = open(); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 }); c.dispatch({ type: 'SIDE', kind: 'PAIR', amount: 20 }); c.dispatch({ type: 'SIDE', kind: 'THREE_CARD', amount: 10 });
  expect(c.getSnapshot().human).toMatchObject({ available: 1770, reserved: 230 });
  const html = renderToStaticMarkup(<App controller={c} />); expect(html).toContain('Pair side bet'); expect(html).toContain('THREE_CARD side bet');
});
it('[REG-M7-015] spectator can back a funded computer seat without owning cards', () => {
  const c = open(true); expect(c.dispatch({ type: 'BACK', seat: 2, amount: 200 })).toBe(true);
  const html = renderToStaticMarkup(<App controller={c} />); expect(html).toContain('You follow Seat 2'); expect(html).toContain('Spectator — no card control');
});
it('[REG-M7-016] own-target wager query and handler reject without changing funds', () => {
  const c = open(); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 }); const before = c.getSnapshot().human;
  expect(c.queryWager({ type: 'BACK', seat: 1, amount: 20 })).toContain('cannot back your own seat');
  expect(c.dispatch({ type: 'BACK', seat: 1, amount: 20 })).toBe(false); expect(c.getSnapshot().human).toEqual(before);
});
it('[REG-M7-017] [UX-07] available/reserved/pending remain separate and half credits render exactly', () => {
  const c = open(); c.dispatch({ type: 'MAIN', seat: 1, amount: 50 }); const html = renderToStaticMarkup(<App controller={c} />);
  for (const label of ['Available', 'Reserved / current exposure', 'Pending return']) expect(html).toContain(label);
  expect(credits(25)).toBe('12.5'); expect(c.getSnapshot().pending).toBe(0);
});
it('[REG-M7-018] funding query does not mutate latest state and unfunded handler also rejects', () => {
  const c = open(); c.dispatch({ type: 'MAIN', seat: 1, amount: 2000 }); const before = c.getSnapshot();
  expect(c.queryWager({ type: 'SIDE', kind: 'PAIR', amount: 2 })).toBe('Not enough available credits.'); expect(c.getSnapshot()).toBe(before);
  expect(c.dispatch({ type: 'SIDE', kind: 'PAIR', amount: 2 })).toBe(false); expect(c.getSnapshot().human).toEqual(before.human);
});
it('[REG-M7-019] cancel/change moves only actual delta and MAIN cancellation refunds sides', () => {
  const c = open(); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 }); c.dispatch({ type: 'SIDE', kind: 'PAIR', amount: 20 });
  c.dispatch({ type: 'MAIN', seat: 1, amount: 100 }); expect(c.getSnapshot().human?.reserved).toBe(120);
  c.dispatch({ type: 'MAIN', seat: 1, amount: 0 }); expect(c.getSnapshot().human?.available).toBe(2000); expect(c.getSnapshot().sideWagers).toEqual([]);
});
it('[REG-M7-020] closed betting hides wager forms and direct late wagers reject', () => {
  const c = open(); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 }); c.dispatch({ type: 'CLOSE' });
  const html = renderToStaticMarkup(<App controller={c} />); expect(html).not.toContain('Betting controls'); expect(html).not.toContain('Close betting and deal');
  expect(c.dispatch({ type: 'BACK', seat: 2, amount: 200 })).toBe(false);
});
