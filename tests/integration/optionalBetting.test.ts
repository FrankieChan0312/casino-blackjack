import { describe, expect, it } from 'vitest';
import * as game from '../../src/domain/optionalGame.js';
import { accepted, fundedOpen, optionalOpen } from '../helpers/optionalFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

describe('M5 side wager reservations', () => {
  for (const type of ['PAIR', 'THREE_CARD'] as const) {
    it.each([2, 200])(`${type} accepts boundary %i`, (amount) => {
      const state = accepted(game.setSideWager(fundedOpen(), 1, type, amount));
      expect(state.bankrolls[0]).toEqual({ available: 1800 - amount, reserved: 200 + amount });
      expect(state.sideWagers).toEqual([{ seatNumber: 1, type, stakeUnits: amount }]);
    });
    it.each([0, 1, 3, 201, 202, -2, 2.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(`${type} rejects %s atomically`, (amount) => {
      const state = fundedOpen();
      expect(game.setSideWager(state, 1, type, amount)).toMatchObject({ ok: false, state });
      expect(game.setSideWager(state, 1, type, amount).state).toBe(state);
    });
  }
  it('requires own occupied active funded main', () => {
    const state = optionalOpen();
    expect(game.setSideWager(state, 1, 'PAIR', 2)).toMatchObject({ ok: false, error: 'MAIN_REQUIRED' });
    expect(game.setSideWager(state, 2, 'PAIR', 2)).toMatchObject({ ok: false, error: 'INELIGIBLE_SEAT' });
    const sitting = optionalOpen(undefined, [seat(1, 'HUMAN', true)]);
    expect(game.setSideWager(sitting, 1, 'THREE_CARD', 2).ok).toBe(false);
  });
  it('allows exact funds; insufficient placement/increase leaves the input reference', () => {
    let state = accepted(game.setOptionalMainWager(optionalOpen(), 1, 1998));
    state = accepted(game.setSideWager(state, 1, 'PAIR', 2));
    expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
    expect(game.setSideWager(state, 1, 'PAIR', 4).state).toBe(state);
    expect(game.setSideWager(state, 1, 'THREE_CARD', 2).state).toBe(state);
  });
  it('reserves/releases only delta; identical target no-op; cancellation once', () => {
    let state = accepted(game.setSideWager(fundedOpen(), 1, 'PAIR', 20));
    expect(game.setSideWager(state, 1, 'PAIR', 20).state).toBe(state);
    state = accepted(game.setSideWager(state, 1, 'PAIR', 40));
    expect(state.bankrolls[0]).toEqual({ available: 1760, reserved: 240 });
    state = accepted(game.setSideWager(state, 1, 'PAIR', 10));
    expect(state.bankrolls[0]).toEqual({ available: 1790, reserved: 210 });
    state = accepted(game.cancelSideWager(state, 1, 'PAIR'));
    expect(state.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
    expect(game.cancelSideWager(state, 1, 'PAIR').state).toBe(state);
  });
  it('main changes preserve sides; main cancellation refunds all three once', () => {
    let state = accepted(game.setSideWager(fundedOpen(), 1, 'PAIR', 20));
    state = accepted(game.setSideWager(state, 1, 'THREE_CARD', 40));
    state = accepted(game.setOptionalMainWager(state, 1, 300));
    expect(state.bankrolls[0]).toEqual({ available: 1640, reserved: 360 });
    state = accepted(game.setOptionalMainWager(state, 1, 100));
    expect(state.bankrolls[0]).toEqual({ available: 1840, reserved: 160 });
    state = accepted(game.cancelOptionalMainWager(state, 1));
    expect(state.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
    expect([state.wagers, state.sideWagers]).toEqual([[], []]);
    expect(game.cancelOptionalMainWager(state, 1).state).toBe(state);
  });
  it('close freezes all wager types and rejects every editing command', () => {
    let state = accepted(game.setSideWager(fundedOpen(), 1, 'PAIR', 20));
    state = accepted(game.setSideWager(state, 1, 'THREE_CARD', 40));
    state = accepted(game.closeOptionalBetting(state, 'unused', noRandom));
    expect(Object.isFrozen(state.wagers)).toBe(true);
    expect(Object.isFrozen(state.sideWagers)).toBe(true);
    for (const result of [game.setSideWager(state, 1, 'PAIR', 40), game.cancelSideWager(state, 1, 'PAIR'),
      game.setOptionalMainWager(state, 1, 300), game.cancelOptionalMainWager(state, 1)]) {
      expect(result.ok).toBe(false);
      expect(result.state).toBe(state);
    }
  });
  it('wagering consumes no cards/RNG; computers get no automatic side wager or follower model', () => {
    let state = optionalOpen(undefined, [seat(1, 'COMPUTER')]);
    const shoe = state.game.shoe;
    state = accepted(game.setOptionalMainWager(state, 1, 200));
    expect(state.sideWagers).toEqual([]);
    state = accepted(game.setSideWager(state, 1, 'PAIR', 2));
    expect(state.game.shoe).toBe(shoe);
    expect(state.game.round).toBeNull();
    expect(Object.keys(state.sideWagers[0]).sort()).toEqual(['seatNumber', 'stakeUnits', 'type']);
  });
});
