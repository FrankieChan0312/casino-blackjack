import { expect, it } from 'vitest';
import * as game from '../../src/domain/behindGame.js';
import { accepted, behindFixture } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

function open(seated = false) {
  let state = accepted(game.openBehindBetting(behindFixture(['10', '9', '8', '9', '8', '9', '8', '8'],
    [seat(1, seated ? 'HUMAN' : 'COMPUTER'), seat(2), seat(3)])));
  for (const target of [1, 2, 3]) state = accepted(game.setBehindMainWager(state, target, 200));
  return state;
}
it('spectator backs an original hand without own MAIN; seated HUMAN backs another seat', () => {
  for (const seated of [false, true]) {
    const before = open(seated);
    const state = accepted(game.setBackWager(before, 2, 200));
    expect(state.backWagers).toEqual([{ participantId: 'local-human', targetSeat: 2,
      handId: 'round-1/seat-2', wagerId: 'round-1/seat-2/BACK/local-human', stakeUnits: 200 }]);
    expect(state.human!.bankroll).toEqual({ available: seated ? 1600 : 1800, reserved: seated ? 400 : 200 });
    expect(state.computers).toBe(before.computers);
  }
});
it.each([20, 2000])('accepts boundary %i including exact funds', (amount) => {
  const state = accepted(game.setBackWager(open(), 2, amount));
  expect(state.human!.bankroll).toEqual({ available: 2000 - amount, reserved: amount });
});
it.each([0, -20, 18, 21, 1999, 2002, 20.5, NaN, Infinity])('rejects invalid original %s atomically', (amount) => {
  const state = open();
  expect(game.setBackWager(state, 2, amount)).toEqual({ ok: false, state, error: 'INVALID_BACK_WAGER' });
  expect(game.setBackWager(state, 2, amount).state).toBe(state);
});
it('one target changes by delta, repeated target no-op, cancellation releases only once', () => {
  let state = accepted(game.setBackWager(open(), 2, 200));
  expect(game.setBackWager(state, 2, 200).state).toBe(state);
  state = accepted(game.setBackWager(state, 2, 300));
  expect(state.human!.bankroll).toEqual({ available: 1700, reserved: 300 });
  expect(state.backWagers).toHaveLength(1);
  state = accepted(game.setBackWager(state, 2, 100));
  expect(state.human!.bankroll).toEqual({ available: 1900, reserved: 100 });
  state = accepted(game.cancelBackWager(state, 2));
  expect(state.human!.bankroll).toEqual({ available: 2000, reserved: 0 });
  expect(state.backWagers).toEqual([]);
  expect(game.cancelBackWager(state, 2).state).toBe(state);
  expect(game.cancelBackWager(state, 2).ok).toBe(false);
});
it('multiple targets share one pool, exact combined funding succeeds and excessive funding rejects', () => {
  let state = accepted(game.setBackWager(open(), 2, 1200));
  const before = structuredClone(state);
  expect(game.setBackWager(state, 3, 802)).toEqual({ ok: false, state, error: 'INSUFFICIENT_FUNDS' });
  expect(state).toEqual(before);
  state = accepted(game.setBackWager(state, 3, 800));
  expect(state.human!.bankroll).toEqual({ available: 0, reserved: 2000 });
  expect(state.backWagers.map((wager) => [wager.targetSeat, wager.stakeUnits])).toEqual([[2, 1200], [3, 800]]);
  expect(game.setBackWager(state, 2, 1202).state).toBe(state);
});
it('own MAIN and back commitments share funds; main changes never spend reserved back stakes', () => {
  let state = accepted(game.setBackWager(open(true), 2, 1600));
  expect(game.setBehindMainWager(state, 1, 402).ok).toBe(false);
  state = accepted(game.setBehindMainWager(state, 1, 400));
  expect(state.human!.bankroll).toEqual({ available: 0, reserved: 2000 });
  state = accepted(game.cancelBehindMainWager(state, 1));
  expect(state.human!.bankroll).toEqual({ available: 400, reserved: 1600 });
  expect(state.backWagers[0].stakeUnits).toBe(1600);
});
it('own/empty/invalid/unfunded/sitting-out targets reject without changes', () => {
  let state = open(true);
  for (const target of [1, 4, 0, 8, 2.5, NaN]) {
    expect(game.setBackWager(state, target, 200).ok).toBe(false);
    expect(game.setBackWager(state, target, 200).state).toBe(state);
  }
  state = accepted(game.cancelBehindMainWager(state, 2));
  expect(game.setBackWager(state, 2, 200).ok).toBe(false);
  const out = accepted(game.openBehindBetting(behindFixture(undefined, [seat(2, 'COMPUTER', true)])));
  expect(game.setBackWager(out, 2, 200).state).toBe(out);
});
it('target MAIN cancellation atomically refunds dependent back only', () => {
  let state = accepted(game.setBackWager(accepted(game.setBackWager(open(true), 2, 200)), 3, 300));
  state = accepted(game.cancelBehindMainWager(state, 2));
  expect(state.human!.bankroll).toEqual({ available: 1500, reserved: 500 });
  expect(state.computers[1].bankroll).toEqual({ available: 2000, reserved: 0 });
  expect(state.backWagers.map((wager) => wager.targetSeat)).toEqual([3]);
  expect(game.cancelBehindMainWager(state, 2).state).toBe(state);
});
it('close freezes originals, consumes identical cards and RNG, and rejects every back edit', () => {
  const plain = open();
  const backed = accepted(game.setBackWager(plain, 2, 200));
  const without = accepted(game.closeBehindBetting(plain, 'unused', noRandom));
  const state = accepted(game.closeBehindBetting(backed, 'unused', noRandom));
  expect(state.table.game).toEqual(without.table.game);
  expect(state.table.game.shoe.inPlay).toHaveLength(8);
  expect(state.table.game.round!.players).toHaveLength(3);
  expect(Object.isFrozen(state.backWagers)).toBe(true);
  expect(Object.isFrozen(state.backWagers[0])).toBe(true);
  expect(game.setBackWager(state, 2, 300).state).toBe(state);
  expect(game.cancelBackWager(state, 2).state).toBe(state);
  expect(game.cancelBehindMainWager(state, 2).state).toBe(state);
});
it('close removes/refunds stale unfunded back target before dealing', () => {
  const backed = accepted(game.setBackWager(open(), 2, 200));
  // Fault seam: externally lost MAIN, with its actual controller reservation already released.
  const stale = { ...backed, table: { ...backed.table, wagers: backed.table.wagers.filter((wager) => wager.seatNumber !== 2) },
    computers: backed.computers.map((entry) => entry.seatNumber === 2
      ? { ...entry, bankroll: { available: 2000, reserved: 0 } } : entry) };
  const state = accepted(game.closeBehindBetting(stale, 'unused', noRandom));
  expect(state.backWagers).toEqual([]);
  expect(state.human!.bankroll).toEqual({ available: 2000, reserved: 0 });
  expect(state.table.game.round!.players.map((hand) => hand.seatNumber)).toEqual([1, 3]);
});
it('no side bet behind, no automatic COMPUTER back, no computer follower API', () => {
  const state = open(true);
  expect(state.backWagers).toEqual([]);
  expect(game.setBehindSideWager(state, 2, 'PAIR', 20)).toEqual({ ok: false, state, error: 'NOT_OWN_SEAT' });
  expect(game.setBehindSideWager(state, 2, 'THREE_CARD', 20).state).toBe(state);
  const bots = accepted(game.openBehindBetting(behindFixture(undefined, [seat(2)], false)));
  expect(game.setBackWager(bots, 2, 200)).toEqual({ ok: false, state: bots, error: 'NO_HUMAN_PARTICIPANT' });
});
