import { describe, expect, it, vi } from 'vitest';
import { cancelMainWager, closeBetting, configureBettingSeats, openBetting, setMainWager } from '../../src/domain/bettingGame.js';
import { accepted, bettingFixture } from '../helpers/bettingFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

function opened() { return accepted(openBetting(bettingFixture(['10', '9', '10', '8'], [seat(1, 'HUMAN')]))); }

describe('funded main betting window', () => {
  it.each([20, 200, 2000])('accepts valid %i units including entire bankroll', (amount) => {
    const state = opened();
    const next = accepted(setMainWager(state, 1, amount));
    expect(next.bankrolls[0]).toEqual({ available: 2000 - amount, reserved: amount });
    expect(next.wagers).toEqual([{ seatNumber: 1, stakeUnits: amount }]);
    expect(next.game).toBe(state.game);
    expect(setMainWager(next, 1, amount).state).toBe(next);
  });
  it.each([0, -20, 18, 21, 2002, 20.5, NaN, Infinity])('rejects invalid main wager %s atomically', (amount) => {
    const state = opened();
    const before = structuredClone(state);
    expect(setMainWager(state, 1, amount)).toEqual({ ok: false, state, error: 'INVALID_MAIN_WAGER' });
    expect(setMainWager(state, 1, amount).state).toBe(state);
    expect(state).toEqual(before);
  });
  it('rejects one-unit-short and unaffordable increase without touching game or RNG', () => {
    const initial = opened();
    const state = { ...initial, bankrolls: [{ available: 199, reserved: 0 }, ...initial.bankrolls.slice(1)] };
    const before = structuredClone(state);
    expect(setMainWager(state, 1, 200)).toEqual({ ok: false, state, error: 'INSUFFICIENT_FUNDS' });
    const small = accepted(setMainWager(state, 1, 100));
    expect(setMainWager(small, 1, 200)).toEqual({ ok: false, state: small, error: 'INSUFFICIENT_FUNDS' });
    expect(small.bankrolls[0]).toEqual({ available: 99, reserved: 100 });
    expect(state).toEqual(before);
  });
  it('increases only the delta, decreases and cancels exactly once', () => {
    const original = accepted(setMainWager(opened(), 1, 200));
    const increased = accepted(setMainWager(original, 1, 300));
    expect(increased.bankrolls[0]).toEqual({ available: 1700, reserved: 300 });
    const decreased = accepted(setMainWager(increased, 1, 200));
    expect(decreased.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
    const cancelled = accepted(cancelMainWager(decreased, 1));
    expect(cancelled.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
    expect(cancelled.wagers).toEqual([]);
    expect(cancelMainWager(cancelled, 1)).toEqual({ ok: false, state: cancelled, error: 'NO_WAGER' });
    expect(original.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
  });
  it('requires OPEN betting and locks all configuration from open through close', () => {
    const initial = bettingFixture([], [seat(1)]);
    expect(setMainWager(initial, 1, 20).state).toBe(initial);
    expect(cancelMainWager(initial, 1).ok).toBe(false);
    expect(closeBetting(initial, 'unused', noRandom).ok).toBe(false);
    const state = accepted(openBetting(initial));
    for (const updates of [[seat(1, 'HUMAN')], [seat(2)], [seat(1, 'COMPUTER', true)],
      [{ seatNumber: 1, occupancy: 'EMPTY' as const, sittingOut: false }]]) {
      expect(configureBettingSeats(state, updates)).toEqual({ ok: false, state, error: 'CONFIGURATION_LOCKED' });
    }
    expect(openBetting(state).state).toBe(state);
  });
  it('rejects empty, sitting-out and nonexistent seat wagers', () => {
    const state = accepted(openBetting(bettingFixture([], [seat(3, 'COMPUTER', true)])));
    for (const number of [1, 3, 0, 8, 1.5, NaN]) {
      expect(setMainWager(state, number, 20)).toEqual({ ok: false, state, error: 'INELIGIBLE_SEAT' });
    }
  });
  it('never auto-bets for computers and rejects no-funded start before RNG', () => {
    const state = accepted(openBetting(bettingFixture([], [seat(1), seat(7)])));
    const random = { nextInt: vi.fn(() => { throw new Error('Unexpected RNG'); }) };
    expect(closeBetting(state, 'unused', random)).toEqual({ ok: false, state, error: 'NO_FUNDED_SEATS' });
    expect(random.nextInt).not.toHaveBeenCalled();
    expect(state.game.round).toBeNull();
    expect(state.wagers).toEqual([]);
  });
  it('deals exact sparse funded seats, skips unfunded occupancy, and freezes stakes', () => {
    let state = accepted(openBetting(bettingFixture(['2', '5', '7', '9', '3', '6', '8', '8'],
      [seat(1), seat(2), seat(4, 'HUMAN'), seat(5), seat(7)])));
    for (const number of [7, 2, 5]) state = accepted(setMainWager(state, number, number * 20));
    const before = structuredClone(state);
    const dealt = accepted(closeBetting(state, 'unused', noRandom));
    expect(dealt.game.round?.players.map((player) => [player.seatNumber, player.cards.map((card) => card.rank)]))
      .toEqual([[2, ['2', '3']], [5, ['5', '6']], [7, ['7', '8']]]);
    expect(dealt.game.round?.dealerCards.map((card) => card.rank)).toEqual(['9', '8']);
    expect(dealt.game.round?.seats).toEqual(state.game.table.seats);
    expect(dealt.game.table.seats[0].sittingOut).toBe(false);
    expect(dealt.game.table.activeSeats?.map((entry) => entry.seatNumber)).toEqual([2, 5, 7]);
    expectAccounting(dealt.game.shoe);
    expect(Object.isFrozen(dealt.wagers)).toBe(true);
    expect(dealt.wagers.every(Object.isFrozen)).toBe(true);
    for (const result of [setMainWager(dealt, 2, 200), cancelMainWager(dealt, 2),
      configureBettingSeats(dealt, [seat(1)]), closeBetting(dealt, 'unused', noRandom)]) {
      expect(result.ok).toBe(false);
      expect(result.state).toBe(dealt);
    }
    expect(state).toEqual(before);
  });
});
