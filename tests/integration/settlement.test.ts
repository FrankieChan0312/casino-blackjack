import { describe, expect, it } from 'vitest';
import { advanceFundedTable, getMainWagerResults, hitFundedSeat, openBetting, setMainWager,
  settleMainWagers, standFundedSeat } from '../../src/domain/bettingGame.js';
import { accepted, fundedTable } from '../helpers/bettingFixture.js';
import { seat } from '../helpers/tableFixture.js';

describe('main wager settlement', () => {
  it.each([
    { ranks: ['10', '10', '10', '7'] as const, outcome: 'PLAYER_WIN', gross: 400, net: 200, final: 2200 },
    { ranks: ['A', '10', 'K', '7'] as const, outcome: 'PLAYER_BLACKJACK', gross: 500, net: 300, final: 2300 },
    { ranks: ['10', '10', '8', '8'] as const, outcome: 'PUSH', gross: 200, net: 0, final: 2000 },
    { ranks: ['10', '10', '7', '8'] as const, outcome: 'DEALER_WIN', gross: 0, net: -200, final: 1800 },
  ])('settles $outcome with independently specified gross/net/final', ({ ranks, outcome, gross, net, final }) => {
    const dealt = fundedTable(ranks, [seat(1)]);
    const done = dealt.game.round?.phase === 'ROUND_COMPLETE' ? dealt : accepted(advanceFundedTable(dealt));
    expect(done.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
    expect(getMainWagerResults(done)).toEqual([{ roundId: 'round-1', seatNumber: 1, stakeUnits: 200,
      outcome, grossReturnUnits: gross, netUnits: net, status: 'PENDING' }]);
    const before = structuredClone(done);
    const committed = accepted(settleMainWagers(done));
    expect(committed.phase).toBe('COMMITTED');
    expect(committed.bankrolls[0]).toEqual({ available: final, reserved: 0 });
    expect(committed.results).toEqual([{ roundId: 'round-1', seatNumber: 1, stakeUnits: 200,
      outcome, grossReturnUnits: gross, netUnits: net, status: 'COMMITTED' }]);
    expect(getMainWagerResults(committed)).toBe(committed.results);
    for (let repeat = 0; repeat < 2; repeat++) {
      expect(settleMainWagers(committed)).toEqual({ ok: false, state: committed, error: 'SETTLEMENT_NOT_READY' });
      expect(settleMainWagers(committed).state).toBe(committed);
    }
    expect(done).toEqual(before);
  });
  it('pays a 25-credit natural exactly in half-credit units', () => {
    const state = fundedTable(['A', '9', 'K', '8'], [seat(4)], [50]);
    const done = accepted(settleMainWagers(state));
    expect(done.bankrolls[3]).toEqual({ available: 2075, reserved: 0 });
    expect(done.results[0]).toMatchObject({ stakeUnits: 50, grossReturnUnits: 125, netUnits: 75 });
    expect(Number.isSafeInteger(done.bankrolls[3].available)).toBe(true);
  });
  it('keeps early Natural proceeds unavailable while another human plays', () => {
    const state = fundedTable(['A', '10', '9', 'K', '7', '8'], [seat(1), seat(2, 'HUMAN')], [2000, 200]);
    expect(state.game.round?.phase).toBe('PLAYER_TURN');
    expect(getMainWagerResults(state)).toEqual([{ roundId: 'round-1', seatNumber: 1, stakeUnits: 2000,
      outcome: 'PLAYER_BLACKJACK', grossReturnUnits: 5000, netUnits: 3000, status: 'PENDING' }]);
    expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
    expect(settleMainWagers(state).state).toBe(state);
    expect(settleMainWagers(state).ok).toBe(false);
    expect(setMainWager(state, 1, 20).ok).toBe(false);
    expect(openBetting(state).ok).toBe(false);
    const dealer = accepted(standFundedSeat(state, 2));
    expect(settleMainWagers(dealer).ok).toBe(false);
    const complete = accepted(advanceFundedTable(dealer));
    expect(complete.bankrolls[0].available).toBe(0);
    const committed = accepted(settleMainWagers(complete));
    expect(committed.bankrolls[0]).toEqual({ available: 5000, reserved: 0 });
  });
  it('settles player bust as a loss without deducting the reserved stake again', () => {
    const state = fundedTable(['10', '9', '8', '8', 'K'], [seat(1, 'HUMAN')]);
    const busted = accepted(hitFundedSeat(state, 1));
    expect(getMainWagerResults(busted)[0]).toMatchObject({ outcome: 'DEALER_WIN', grossReturnUnits: 0, netUnits: -200 });
    const done = accepted(settleMainWagers(accepted(advanceFundedTable(busted))));
    expect(done.bankrolls[0]).toEqual({ available: 1800, reserved: 0 });
    expect(done.game.round?.players[0].outcomeReason).toBe('PLAYER_BUST');
  });
  it('reconciles seven mixed seats independently against one shared dealer', () => {
    const dealt = fundedTable(['10', 'A', '10', '10', '10', '9', '10', '9',
      '8', 'K', '10', '9', '8', '8', '10', '7', '5', '3'],
    [seat(1, 'HUMAN'), seat(2), seat(3), seat(4), seat(5), seat(6), seat(7)]);
    const done = accepted(advanceFundedTable(accepted(hitFundedSeat(dealt, 1))));
    expect(done.game.round?.dealerCards.map((card) => card.rank)).toEqual(['9', '7', '3']);
    expect(done.bankrolls.map((bankroll) => bankroll.available)).toEqual([1800, 1800, 1800, 1800, 1800, 1800, 1800]);
    const committed = accepted(settleMainWagers(done));
    expect(committed.results.map((result) => [result.outcome, result.grossReturnUnits, result.netUnits])).toEqual([
      ['DEALER_WIN', 0, -200], ['PLAYER_BLACKJACK', 500, 300], ['PLAYER_WIN', 400, 200],
      ['PUSH', 200, 0], ['DEALER_WIN', 0, -200], ['DEALER_WIN', 0, -200], ['PLAYER_WIN', 400, 200],
    ]);
    expect(committed.bankrolls.map((bankroll) => bankroll.available)).toEqual([1800, 2300, 2200, 2000, 1800, 1800, 2200]);
    expect(committed.bankrolls.every((bankroll) => bankroll.reserved === 0)).toBe(true);
    expect(committed.bankrolls.reduce((sum, bankroll) => sum + bankroll.available, 0)).toBe(14100);
    expect(committed.results.reduce((sum, result) => sum + result.netUnits, 0)).toBe(100);
    expect(committed.results).toHaveLength(7);
    expect(Object.isFrozen(committed.results)).toBe(true);
  });
  it('validates all settlement funds before any seat is credited', () => {
    const done = fundedTable(['A', 'A', '9', 'K', 'Q', '8'], [seat(1), seat(2)]);
    const bad = { ...done, bankrolls: done.bankrolls.map((bankroll, index) => index === 1
      ? { ...bankroll, reserved: 198 } : bankroll) };
    const before = structuredClone(bad);
    expect(settleMainWagers(bad)).toEqual({ ok: false, state: bad, error: 'INVALID_SETTLEMENT_FUNDS' });
    expect(bad).toEqual(before);
  });
});
