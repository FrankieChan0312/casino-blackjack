import { afterEach, describe, expect, it, vi } from 'vitest';
import * as shoeModule from '../../src/domain/shoe.js';
import { advanceFundedTable, closeBetting, configureBettingSeats, getMainWagerResults, hitFundedSeat,
  openBetting, prepareNextBettingRound, setMainWager, settleMainWagers, voidFinancialRound } from '../../src/domain/bettingGame.js';
import { accepted, bettingFixture, fundedTable } from '../helpers/bettingFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

afterEach(() => vi.restoreAllMocks());
function failDraw() {
  return vi.spyOn(shoeModule, 'drawCard').mockImplementation((shoe) => ({ ok: false,
    shoe: { ...shoe, retired: true }, error: 'SHOE_EXHAUSTED_DURING_ROUND' }));
}

describe('financial VOID and next-round lifecycle', () => {
  it('refunds one human exactly once and excludes normal settlement', () => {
    const state = fundedTable(['10', '9', '5', '8'], [seat(1, 'HUMAN')]);
    failDraw();
    const failed = accepted(hitFundedSeat(state, 1));
    expect(failed.game.round?.phase).toBe('INTEGRITY_ERROR');
    expect(failed.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
    expect(prepareNextBettingRound(failed).ok).toBe(false);
    expect(settleMainWagers(failed).ok).toBe(false);
    const refunded = accepted(voidFinancialRound(failed));
    expect(refunded.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
    expect(refunded.results).toEqual([{ roundId: 'round-1', seatNumber: 1, stakeUnits: 200,
      outcome: 'VOID', grossReturnUnits: 200, netUnits: 0, status: 'REFUNDED' }]);
    expect(refunded.game).toBe(failed.game);
    expect(refunded.game.shoe.retired).toBe(true);
    for (let i = 0; i < 2; i++) {
      expect(voidFinancialRound(refunded)).toEqual({ ok: false, state: refunded, error: 'VOID_NOT_REQUIRED' });
      expect(settleMainWagers(refunded)).toEqual({ ok: false, state: refunded, error: 'SETTLEMENT_NOT_READY' });
    }
    expectAccounting(refunded.game.shoe);
  });
  it('discards pending Natural and loss and refunds every actual stake across seats', () => {
    const state = fundedTable(['10', 'A', '2', '2', '8', 'K', '2', '2', 'K'],
      [seat(1, 'HUMAN'), seat(4), seat(7)], [200, 50, 2000]);
    const busted = accepted(hitFundedSeat(state, 1));
    expect(getMainWagerResults(busted).map((result) => [result.outcome, result.grossReturnUnits]))
      .toEqual([['DEALER_WIN', 0], ['PLAYER_BLACKJACK', 125]]);
    expect(busted.bankrolls.map((bankroll) => bankroll.available)).toEqual([1800, 2000, 2000, 1950, 2000, 2000, 0]);
    failDraw();
    const failed = accepted(advanceFundedTable(busted));
    expect(getMainWagerResults(failed)).toEqual([]);
    const refunded = accepted(voidFinancialRound(failed));
    expect(refunded.results.map((result) => [result.seatNumber, result.stakeUnits, result.grossReturnUnits, result.netUnits]))
      .toEqual([[1, 200, 200, 0], [4, 50, 50, 0], [7, 2000, 2000, 0]]);
    expect(refunded.bankrolls).toEqual(Array.from({ length: 7 }, () => ({ available: 2000, reserved: 0 })));
    expect(getMainWagerResults(refunded).every((result) => result.status === 'REFUNDED' && result.outcome === 'VOID')).toBe(true);
    expect(refunded.game.round?.players.every((player) => player.outcome === undefined)).toBe(true);
    expect(refunded.game.shoe.inPlay).toHaveLength(9);
    expect(refunded.game.shoe.discarded).toHaveLength(0);
    expectAccounting(refunded.game.shoe);
  });
  it('rejects voluntary VOID during valid play or after committed normal payout', () => {
    const playing = fundedTable(['10', '9', '10', '8'], [seat(1)]);
    expect(voidFinancialRound(playing)).toEqual({ ok: false, state: playing, error: 'VOID_NOT_REQUIRED' });
    const complete = accepted(advanceFundedTable(playing));
    expect(voidFinancialRound(complete).ok).toBe(false);
    const committed = accepted(settleMainWagers(complete));
    const before = structuredClone(committed);
    expect(voidFinancialRound(committed)).toEqual({ ok: false, state: committed, error: 'VOID_NOT_REQUIRED' });
    expect(committed.bankrolls[0]).toEqual({ available: 2200, reserved: 0 });
    expect(committed).toEqual(before);
  });
  it('replaces a retired failed shoe only on the next explicitly funded deal', () => {
    const initial = bettingFixture(['A', '2', '2', 'K', '2', '2'], [seat(2), seat(7)]);
    const short = { ...initial, game: { ...initial.game, shoe: { ...initial.game.shoe,
      available: initial.game.shoe.available.slice(0, 6), discarded: initial.game.shoe.available.slice(6) } } };
    let betting = accepted(openBetting(short));
    for (const number of [2, 7]) betting = accepted(setMainWager(betting, number, 200));
    const failed = accepted(advanceFundedTable(accepted(closeBetting(betting, 'unused', noRandom))));
    expect(failed.game.round?.phase).toBe('INTEGRITY_ERROR');
    const refunded = accepted(voidFinancialRound(failed));
    const before = structuredClone(refunded);
    const configuring = accepted(prepareNextBettingRound(refunded));
    expect(configuring.game).toBe(refunded.game);
    expect(configuring.bankrolls).toBe(refunded.bankrolls);
    expect(configuring.wagers).toEqual([]);
    let next = accepted(openBetting(configuring));
    expect(closeBetting(next, 'new-shoe', noRandom).ok).toBe(false);
    next = accepted(setMainWager(next, 7, 300));
    const random = { nextInt: vi.fn((max: number) => max - 1) };
    const dealt = accepted(closeBetting(next, 'new-shoe', random));
    expect(dealt.game.round?.roundId).toBe('round-2');
    expect(dealt.game.round?.players.map((player) => player.seatNumber)).toEqual([7]);
    expect(dealt.bankrolls[6]).toEqual({ available: 1700, reserved: 300 });
    expect(dealt.bankrolls[1]).toEqual({ available: 2000, reserved: 0 });
    expect(dealt.game.shoe.shoeId).toBe('new-shoe');
    expect(dealt.game.shoe.retired).toBe(false);
    expect(random.nextInt).toHaveBeenCalledTimes(312);
    expectAccounting(dealt.game.shoe);
    expectAccounting(refunded.game.shoe);
    expect(refunded).toEqual(before);
  });
  it('carries actual winnings through leave/rejoin/controller changes without minting credits', () => {
    const done = accepted(settleMainWagers(fundedTable(['A', '9', 'K', '8'], [seat(1)], [50])));
    let configuring = accepted(prepareNextBettingRound(done));
    expect(configuring.bankrolls[0].available).toBe(2075);
    for (const occupancy of ['EMPTY', 'HUMAN', 'COMPUTER'] as const) {
      configuring = accepted(configureBettingSeats(configuring, [{ seatNumber: 1, occupancy, sittingOut: false }]));
      expect(configuring.bankrolls[0]).toEqual({ available: 2075, reserved: 0 });
      expect(configuring.game.shoe).toBe(done.game.shoe);
    }
    const betting = accepted(setMainWager(accepted(openBetting(configuring)), 1, 2000));
    expect(betting.bankrolls[0]).toEqual({ available: 75, reserved: 2000 });
    expect(done.results[0]).toMatchObject({ grossReturnUnits: 125, status: 'COMMITTED' });
  });
  it('does not allow next-round creation during betting, play or uncommitted completion', () => {
    const configuring = bettingFixture([], [seat(1)]);
    const open = accepted(openBetting(configuring));
    const playing = fundedTable(['10', '9', '10', '8'], [seat(1)]);
    const complete = accepted(advanceFundedTable(playing));
    for (const state of [configuring, open, playing, complete]) {
      expect(prepareNextBettingRound(state)).toEqual({ ok: false, state, error: 'ROUND_NOT_FINALIZED' });
    }
  });
  it('VOID returns actual reserved units rather than reconstructing a payout', () => {
    const playing = fundedTable(['10', '9', '5', '8'], [seat(1, 'HUMAN')]);
    failDraw();
    const failed = accepted(hitFundedSeat(playing, 1));
    // Diagnostic discrepancy: refund what was actually debited, not a stale wager.
    const actual = { ...failed, bankrolls: [{ available: 1850, reserved: 150 }, ...failed.bankrolls.slice(1)] };
    const refunded = accepted(voidFinancialRound(actual));
    expect(refunded.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
    expect(refunded.results[0]).toMatchObject({ stakeUnits: 150, grossReturnUnits: 150, netUnits: 0 });
  });
});
