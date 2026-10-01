import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { createBrowserController } from '../../src/browser/controller.js';
import { App } from '../../src/ui/App.js';
import { CLASSIC } from '../../src/domain/profile.js';
import { behindFixture } from '../helpers/behindFixture.js';

it('[M9-001] player shell opens own betting table; manual callers retain configuration', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 });
  const v = c.getSnapshot();
  expect(v.phase).toBe('OPEN'); expect(v.human?.controlledSeat).toBe(4);
  expect(v.human?.available).toBe(2000); expect(v.human?.reserved).toBe(0);
  expect(v.profileId).toBe(CLASSIC); expect(v.round).toBeNull();
  const html = renderToStaticMarkup(createElement(App, { controller: c }));
  expect(html).toContain('player-mode'); expect(html).toContain('Blackjack table');
  expect(html).not.toContain('Set up your table');
  expect(createBrowserController().getSnapshot().phase).toBe('CONFIGURING');
});

it('[M9-003] three guests fund their own wagers and preserve human funds', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 });
  const v = c.getSnapshot();
  expect(v.configuration.filter(s => s.occupancy === 'COMPUTER').map(s => s.seatNumber)).toEqual([1, 3, 6]);
  expect(v.mainWagers).toEqual([{ seat: 1, amount: 50 }, { seat: 3, amount: 50 }, { seat: 6, amount: 50 }]);
  expect(v.human).toMatchObject({ available: 2000, reserved: 0 });
  expect(v.audit.filter(e => e.type === 'MAIN_SET').map(e => e.actorId)).toEqual(['computer-1', 'computer-3', 'computer-6']);
});

it('[M9-004] low computer funds use whole credits or sit out without replenishment', () => {
  const base = behindFixture();
  const initial = { ...base, computers: base.computers.map(p => ({ ...p,
    bankroll: { available: p.seatNumber === 1 ? 101 : p.seatNumber === 3 ? 37 : p.seatNumber === 6 ? 19 : 2000, reserved: 0 } })) };
  const c = createBrowserController({ playerMode: true, factory: () => initial });
  expect(c.getSnapshot().mainWagers).toEqual([{ seat: 1, amount: 50 }, { seat: 3, amount: 36 }]);
  expect(c.getSnapshot().configuration.find(s => s.seatNumber === 6)).toMatchObject({ occupancy: 'COMPUTER', sittingOut: true });
  expect(c.getSnapshot().human).toMatchObject({ available: 2000, reserved: 0 });
  expect(initial.computers[5].bankroll.available).toBe(19);
});

it('[M9-005] next betting round prepares the same guests and keeps human bankroll and audit', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 });
  c.dispatch({ type: 'MAIN', seat: 4, amount: 200 }); c.dispatch({ type: 'CLOSE' });
  for (let i = 0; i < 10 && !c.getSnapshot().interaction.nextRound; i++) {
    const v = c.getSnapshot();
    if (v.interaction.insurance) c.dispatch({ type: 'ACE', choice: 'DECLINE' });
    else if (v.interaction.canAdvance) c.dispatch({ type: 'ADVANCE' });
    else c.dispatch({ type: 'ACT', action: 'STAND', handId: v.interaction.handId });
  }
  const completed = c.getSnapshot(); expect(completed.phase).toBe('COMMITTED');
  expect(c.dispatch({ type: 'NEXT' })).toBe(true);
  expect(c.getSnapshot().phase).toBe('OPEN'); expect(c.getSnapshot().human).toEqual(completed.human);
  expect(c.getSnapshot().mainWagers).toEqual([{ seat: 1, amount: 50 }, { seat: 3, amount: 50 }, { seat: 6, amount: 50 }]);
  expect(c.getSnapshot().audit.slice(0, completed.audit.length)).toEqual(completed.audit);
  expect(c.getSnapshot().round).toBeNull();
});

it('[M9-002] explicit seeded session reset prepares player shell without exposing seed', () => {
  const c = createBrowserController({ playerMode: true });
  expect(c.startDemo(CLASSIC, 42)).toBe(true);
  expect(c.getSnapshot().phase).toBe('OPEN'); expect(c.getSnapshot().seeded).toBe(true);
  expect(c.getSnapshot().audit.some(e => e.type === 'SESSION_RESET')).toBe(true);
  expect(JSON.stringify(c.getSnapshot())).not.toMatch(/"seed"|deckIndex|originalCards|"shoe"/);
});
