import { expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { createBrowserController } from '../../src/browser/controller.js';
import { App } from '../../src/ui/App.js';
import { CLASSIC } from '../../src/domain/profile.js';
import { accepted, behindFixture } from '../helpers/behindFixture.js';
import * as game from '../../src/domain/behindGame.js';
import * as replayModule from '../../src/domain/replay.js';
import { noRandom } from '../helpers/tableFixture.js';
import { beginControllerSplit } from '../../src/domain/behindController.js';

it('[M9-016] explicit manual mode resets only at safe boundaries and retains accepted configuration flow', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 });
  expect(c.dispatch({ type: 'MODE', playerMode: false })).toBe(true);
  expect(c.getSnapshot()).toMatchObject({ playerMode: false, phase: 'CONFIGURING', seeded: false, lastBet: 0 });
  expect(c.getSnapshot().human).toMatchObject({ available: 2000, reserved: 0 });
  c.dispatch({ type: 'CONFIGURE', seats: [{ seatNumber: 1, occupancy: 'HUMAN', sittingOut: false }] });
  c.dispatch({ type: 'OPEN' }); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 }); c.dispatch({ type: 'CLOSE' });
  const active = c.getSnapshot(); expect(c.dispatch({ type: 'MODE', playerMode: true })).toBe(false);
  expect(c.getSnapshot()).toEqual({ ...active, feedback: 'Change mode only before play or after final settlement.' });
});

it('[M9-017] switching from completed manual demo prepares player seats and clears previous repeat stake', () => {
  const c = createBrowserController({ seed: 7 });
  c.dispatch({ type: 'CONFIGURE', seats: [{ seatNumber: 1, occupancy: 'HUMAN', sittingOut: false }] });
  c.dispatch({ type: 'OPEN' }); c.dispatch({ type: 'MAIN', seat: 1, amount: 200 }); c.dispatch({ type: 'CLOSE' });
  for (let n = 0; n < 20 && !c.getSnapshot().interaction.nextRound; n++) {
    const v = c.getSnapshot();
    if (v.interaction.insurance) c.dispatch({ type: 'ACE', choice: 'DECLINE' });
    else if (v.interaction.canAdvance) c.dispatch({ type: 'ADVANCE' });
    else c.dispatch({ type: 'ACT', action: 'STAND', handId: v.interaction.handId });
  }
  expect(c.getSnapshot().phase).toBe('COMMITTED');
  expect(c.dispatch({ type: 'MODE', playerMode: true })).toBe(true);
  expect(c.getSnapshot()).toMatchObject({ playerMode: true, phase: 'OPEN', seeded: false, lastBet: 0 });
  expect(c.getSnapshot().human).toMatchObject({ controlledSeat: 4, available: 2000, reserved: 0 });
  expect(c.getSnapshot().mainWagers.map(w => w.seat)).toEqual([1, 3, 6]);
  expect(c.getSnapshot().audit.slice(0, 2).map(e => e.type)).toEqual(['SESSION_START', 'SESSION_RESET']); expect(c.exportReplay()).toBeNull();
});

it('[M9-011] one Deal funds only the human and retains original bet through Double and Repeat', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 });
  expect(c.dispatch({ type: 'DEAL', amount: 200 })).toBe(true);
  expect(c.getSnapshot().lastBet).toBe(200);
  expect(c.dispatch({ type: 'ACT', action: 'DOUBLE', handId: c.getSnapshot().interaction.handId })).toBe(true);
  expect(c.getSnapshot().phase).toBe('COMMITTED'); expect(c.getSnapshot().ownResults[0].stake).toBe(400);
  const funds = c.getSnapshot().human!.available;
  expect(c.dispatch({ type: 'REPEAT' })).toBe(true);
  expect(c.getSnapshot().phase).toBe('CLOSED'); expect(c.getSnapshot().lastBet).toBe(200);
  expect(c.getSnapshot().mainWagers.find(w => w.seat === 4)?.amount).toBe(200);
  expect(c.getSnapshot().human).toMatchObject({ available: funds - 200, reserved: 200 });
  const p = c.exportReplay(); expect(p).toBeNull();
  expect(c.getSnapshot().shoeMessage).toBe('Existing 6-deck shoe continues');
});

it('[M9-012] invalid Deal and guest-only Close cannot start a player round', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 }); const before = c.getSnapshot();
  for (const amount of [0, 19, 21, 2002, NaN, Infinity]) expect(c.dispatch({ type: 'DEAL', amount })).toBe(false);
  expect(c.dispatch({ type: 'CLOSE' })).toBe(false);
  expect(c.getSnapshot().phase).toBe('OPEN'); expect(c.getSnapshot().human).toEqual(before.human);
  expect(c.getSnapshot().audit).toEqual(before.audit); expect(c.getSnapshot().lastBet).toBe(0);
});

it('[M9-013] unaffordable Repeat opens betting with feedback and never reduces or replenishes bet', () => {
  const c = createBrowserController({ playerMode: true, random: noRandom,
    factory: () => behindFixture(['10', '10', '5', '10', '10', '7', '7', '6', '7', '9']) });
  c.dispatch({ type: 'DEAL', amount: 2000 }); c.dispatch({ type: 'ACT', action: 'STAND', handId: c.getSnapshot().interaction.handId });
  expect(c.getSnapshot().human?.available).toBe(0);
  expect(c.dispatch({ type: 'REPEAT' })).toBe(false);
  expect(c.getSnapshot().phase).toBe('OPEN'); expect(c.getSnapshot().human).toMatchObject({ available: 0, reserved: 0 });
  expect(c.getSnapshot().lastBet).toBe(2000); expect(c.getSnapshot().mainWagers.some(w => w.seat === 4)).toBe(false);
  expect(c.getSnapshot().feedback).toBe('Not enough available credits.');
});

it('[M9-014] Deal Again clears optional stakes and preserves exact balances/history without reset', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 });
  c.dispatch({ type: 'MAIN', seat: 4, amount: 200 }); c.dispatch({ type: 'SIDE', kind: 'PAIR', amount: 10 }); c.dispatch({ type: 'BACK', seat: 1, amount: 20 });
  c.dispatch({ type: 'DEAL', amount: 200 }); c.dispatch({ type: 'ACT', action: 'STAND', handId: c.getSnapshot().interaction.handId });
  const done = c.getSnapshot(); expect(done.phase).toBe('COMMITTED');
  c.dispatch({ type: 'NEXT' });
  expect(c.getSnapshot().human).toEqual(done.human); expect(c.getSnapshot().sideWagers).toEqual([]); expect(c.getSnapshot().backWagers).toEqual([]);
  expect(c.getSnapshot().lastBet).toBe(200); expect(c.getSnapshot().audit.slice(0, done.audit.length)).toEqual(done.audit);
  expect(c.getSnapshot().audit.some(e => e.type === 'SESSION_RESET')).toBe(false);
});

it('[M9-015] compound Deal and Repeat reserve complete journal capacity before any mutation', () => {
  const recorder = replayModule.createReplaySession(7); const factory = vi.spyOn(replayModule, 'createReplaySession').mockReturnValue(recorder);
  try {
    const c = createBrowserController({ playerMode: true, seed: 7 });
    const cap = vi.spyOn(recorder, 'hasCapacity').mockImplementation((n = 1) => n < 5);
    const before = c.getSnapshot(); expect(c.dispatch({ type: 'DEAL', amount: 200 })).toBe(false);
    expect(c.getSnapshot()).toEqual({ ...before, feedback: expect.stringContaining('command limit reached') }); cap.mockRestore();
    c.dispatch({ type: 'DEAL', amount: 200 }); c.dispatch({ type: 'ACT', action: 'STAND', handId: c.getSnapshot().interaction.handId });
    const finished = c.getSnapshot(); const p = c.exportReplay();
    const cap2 = vi.spyOn(recorder, 'hasCapacity').mockImplementation((n = 1) => n < 11);
    expect(c.dispatch({ type: 'REPEAT' })).toBe(false);
    expect(c.getSnapshot()).toEqual({ ...finished, feedback: expect.stringContaining('command limit reached') });
    expect(c.exportReplay()).toEqual(p); cap2.mockRestore();
  } finally { factory.mockRestore(); }
});

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

it('[M9-006] automatic seats/dealer pause on human Insurance and never choose a human action', () => {
  const c = createBrowserController({ playerMode: true, random: noRandom,
    factory: () => behindFixture(['10', '10', '5', '10', 'A', '7', '7', '6', '7', '9']) });
  c.dispatch({ type: 'MAIN', seat: 4, amount: 200 }); c.dispatch({ type: 'CLOSE' });
  const insurance = c.getSnapshot(); expect(insurance.interaction.insurance?.role).toBe('MAIN');
  expect(insurance.round?.dealer.holeCard).toBeNull();
  expect(insurance.audit.filter(e => e.type === 'STAND')).toHaveLength(0);
  c.dispatch({ type: 'ACE', choice: 'DECLINE' });
  const human = c.getSnapshot(); expect(human.round?.currentSeat).toBe(4);
  expect(human.round?.seats[3].hands[0].cards.map(c => c.rank)).toEqual(['5', '6']);
  expect(human.round?.dealer.holeCard).toBeNull();
  expect(human.audit.filter(e => e.type === 'STAND').map(e => e.actorId)).toEqual(['computer-1', 'computer-3']);
  expect(c.dispatch({ type: 'ACT', action: 'STAND', handId: human.interaction.handId })).toBe(true);
  const done = c.getSnapshot(); expect(done.phase).toBe('COMMITTED');
  expect(done.human).toMatchObject({ available: 1800, reserved: 0 });
  expect(done.round?.dealer.total).toBe(20); expect(done.ownResults[0]).toMatchObject({ stake: 200, returned: 0 });
  expect(done.audit.filter(e => e.type === 'STAND').map(e => e.actorId)).toEqual(['computer-1', 'computer-3', 'local-human', 'computer-6']);
  const before = done.round; expect(c.dispatch({ type: 'ACT', action: 'HIT', handId: human.interaction.handId })).toBe(false);
  expect(c.getSnapshot().round).toEqual(before); expect(c.getSnapshot().phase).toBe('COMMITTED');
  expect(c.replayCompleted()).toBe(false);
});

it('[M9-007] automatic seeded command progression exports a complete independently replayable session', () => {
  const c = createBrowserController({ playerMode: true, seed: 7 });
  c.dispatch({ type: 'MAIN', seat: 4, amount: 200 }); c.dispatch({ type: 'CLOSE' });
  expect(c.getSnapshot().round?.currentSeat).toBe(4);
  c.dispatch({ type: 'ACT', action: 'STAND', handId: c.getSnapshot().interaction.handId });
  expect(c.getSnapshot().phase).toBe('COMMITTED');
  const p = c.exportReplay()!;
  expect(p.commands.map(c => c.command.type)).toEqual(['CONFIGURE', 'OPEN', 'MAIN', 'MAIN', 'MAIN', 'MAIN', 'CLOSE', 'ADVANCE', 'ACT', 'ADVANCE', 'SETTLE']);
  expect(replayModule.replay(p).outcomes).toHaveLength(1);
  expect(c.replayCompleted()).toBe(true);
  expect(c.getSnapshot().replayResult?.outcomes[0].publicState.phase).toBe('COMMITTED');
});

it('[M9-008] composite capacity rejection occurs before state funds audit clock or journal mutation', () => {
  const recorder = replayModule.createReplaySession(7);
  const factory = vi.spyOn(replayModule, 'createReplaySession').mockReturnValue(recorder);
  try {
    const c = createBrowserController({ playerMode: true, seed: 7 });
    c.dispatch({ type: 'MAIN', seat: 4, amount: 200 });
    const capacity = vi.spyOn(recorder, 'hasCapacity').mockImplementation((n = 1) => n <= 2);
    const before = c.getSnapshot(); const recorded = recorder.getState();
    expect(c.dispatch({ type: 'CLOSE' })).toBe(false);
    expect(c.getSnapshot()).toEqual({ ...before, feedback: expect.stringContaining('command limit reached') });
    expect(recorder.getState()).toBe(recorded); capacity.mockRestore();
  } finally { factory.mockRestore(); }
});

it('[M9-009] real draw failure automatically voids/refunds exactly once in Player Mode', () => {
  let state = accepted(game.openBehindBetting(behindFixture(['5', '9', '6', '8'])));
  state = accepted(game.setBehindMainWager(state, 1, 200));
  state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  const shoe = state.table.game.shoe;
  state = { ...state, table: { ...state.table, game: { ...state.table.game,
    shoe: { ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] } } } };
  const c = createBrowserController({ playerMode: true, factory: () => state, random: noRandom });
  expect(c.dispatch({ type: 'ACT', action: 'HIT', handId: c.getSnapshot().interaction.handId })).toBe(true);
  expect(c.getSnapshot().phase).toBe('VOID'); expect(c.getSnapshot().human).toMatchObject({ available: 2000, reserved: 0 });
  expect(c.getSnapshot().ownResults[0]).toMatchObject({ outcome: 'VOID', stake: 200, returned: 200 });
  const before = c.getSnapshot().human;
  expect(c.dispatch({ type: 'ACT', action: 'HIT', handId: 'round-1/seat-1' })).toBe(false);
  expect(c.getSnapshot().human).toEqual(before);
});

it('[M9-010] automatic progression respects a real follower window until explicit NO ADD', () => {
  let state = behindFixture(['8', '9', '8', '8', '3', '4'], [{ seatNumber: 1, occupancy: 'COMPUTER', sittingOut: false }]);
  state = accepted(game.openBehindBetting(state)); state = accepted(game.setBehindMainWager(state, 1, 200));
  state = accepted(game.setBackWager(state, 1, 200)); state = accepted(game.closeBehindBetting(state, 'unused', noRandom));
  state = accepted(beginControllerSplit(state, 'computer-1', 'round-1/seat-1'));
  const c = createBrowserController({ playerMode: true, factory: () => state, random: noRandom });
  expect(c.getSnapshot().follow?.kind).toBe('SPLIT'); expect(c.getSnapshot().interaction.canAdvance).toBe(false);
  expect(c.getSnapshot().round?.seats[0].hands.map(h => h.cards.length)).toEqual([1, 1]);
  expect(c.dispatch({ type: 'FOLLOW', choice: 'NO_ADD' })).toBe(true);
  expect(c.getSnapshot().phase).toBe('COMMITTED'); expect(c.getSnapshot().trackedBack).toHaveLength(1);
  expect(c.getSnapshot().trackedBack[0].handId).toBe('round-1/seat-1.1');
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
