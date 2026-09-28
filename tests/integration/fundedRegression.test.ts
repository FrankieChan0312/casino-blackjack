import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as shoeModule from '../../src/domain/shoe.js';
import * as betting from '../../src/domain/bettingGame.js';
import { getPublicTableView } from '../../src/domain/tablePublicView.js';
import { accepted, bettingFixture, fundedTable } from '../helpers/bettingFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Uncontrolled RNG'); }); });
afterEach(() => vi.restoreAllMocks());

function freezeDeep(value: object) {
  for (const child of Object.values(value)) if (child && typeof child === 'object') freezeDeep(child);
  Object.freeze(value);
}

describe('M3 funded gameplay and financial regression', () => {
  it.each(['HUMAN', 'COMPUTER'] as const)('%s alone reaches ordinary 21 and receives ordinary payout', (controller) => {
    const start = fundedTable(['10', '10', '5', '6', '6', '4'], [seat(4, controller)]);
    freezeDeep(start);
    const playing = controller === 'HUMAN' ? accepted(betting.hitFundedSeat(start, 4)) : start;
    const done = accepted(betting.advanceFundedTable(playing));
    expect(done.game.round?.players[0].cards.map((card) => card.rank)).toEqual(['10', '5', '6']);
    expect(done.game.round?.dealerCards.map((card) => card.rank)).toEqual(['10', '6', '4']);
    expect(done.game.round?.players[0].outcome).toBe('PLAYER_WIN');
    expect(accepted(betting.settleMainWagers(done)).bankrolls[3]).toEqual({ available: 2200, reserved: 0 });
    expectAccounting(done.game.shoe);
    expect(start.bankrolls[3]).toEqual({ available: 1800, reserved: 200 });
  });
  it('pauses at HUMAN without drawing or funding later computers', () => {
    const start = fundedTable(['8', '8', '5', '10', '9', '7', '5', '7', '7'], [seat(1), seat(4, 'HUMAN'), seat(7)]);
    const paused = accepted(betting.advanceFundedTable(start));
    expect(paused.game.round?.currentSeat).toBe(4);
    expect(paused.game.shoe.available).toHaveLength(304);
    expect(betting.advanceFundedTable(paused).state).toBe(paused);
    expect(getPublicTableView(paused.game).round?.dealer.holeCard).toBeNull();
    expect(betting.hitFundedSeat(paused, 7).state).toBe(paused);
    const done = accepted(betting.advanceFundedTable(accepted(betting.standFundedSeat(paused, 4))));
    expect(done.game.round?.players.map((player) => player.outcome)).toEqual(['PUSH', 'DEALER_WIN', 'PUSH']);
    const committed = accepted(betting.settleMainWagers(done));
    expect([0, 3, 6].map((index) => committed.bankrolls[index].available)).toEqual([2000, 1800, 2000]);
    expectAccounting(committed.game.shoe);
  });
  it.each(['A', '10', 'J', 'Q', 'K'] as const)('dealer Natural with %s upcard returns player Natural stake only', (upcard) => {
    const start = fundedTable(['A', '9', upcard, 'K', '8', upcard === 'A' ? 'Q' : 'A'], [seat(2), seat(7)]);
    expect(start.game.round?.phase).toBe('ROUND_COMPLETE');
    expect(start.game.shoe.available).toHaveLength(306);
    const committed = accepted(betting.settleMainWagers(start));
    expect(committed.results.map((result) => [result.outcome, result.grossReturnUnits])).toEqual([['PUSH', 200], ['DEALER_WIN', 0]]);
    expect(committed.bankrolls[1].available).toBe(2000);
    expect(committed.bankrolls[6].available).toBe(1800);
    expectAccounting(committed.game.shoe);
  });
  it.each([
    ['A', '6', [], ['A', '6']], ['10', '7', [], ['10', '7']],
    ['A', '5', ['2'], ['A', '5', '2']], ['10', '6', ['2'], ['10', '6', '2']],
  ] as const)('preserves funded dealer S17 for %s,%s', (first, second, draws, expected) => {
    const start = fundedTable(['10', first, '10', second, ...draws], [seat(1, 'HUMAN')]);
    const done = accepted(betting.resolveFundedDealer(accepted(betting.standFundedSeat(start, 1))));
    expect(done.game.round?.dealerCards.map((card) => card.rank)).toEqual(expected);
    expect(accepted(betting.settleMainWagers(done)).bankrolls[0].available).toBe(2200);
    expectAccounting(done.game.shoe);
  });
  it.each([219, 249])('preserves cut %i through gameplay and settlement, replaces at next funded deal', (cut) => {
    const initial = bettingFixture(['5', '10', '10', '10', '5', '10', '10', '6', '7', '4'], [seat(2), seat(5), seat(7)]);
    const remaining = 312 - (cut - 9);
    let state = accepted(betting.openBetting({ ...initial, game: { ...initial.game, shoe: { ...initial.game.shoe,
      cutPosition: cut, available: initial.game.shoe.available.slice(0, remaining),
      discarded: initial.game.shoe.available.slice(remaining) } } }));
    for (const number of [2, 5, 7]) state = accepted(betting.setMainWager(state, number, 200));
    const dealt = accepted(betting.closeBetting(state, 'unused', noRandom));
    expect(dealt.game.shoe.reshufflePending).toBe(false);
    const complete = accepted(betting.advanceFundedTable(dealt));
    expect(complete.game.shoe.shoeId).toBe('fixture');
    expect(complete.game.shoe.cutPosition).toBe(cut);
    expect(complete.game.shoe.reshufflePending).toBe(true);
    const committed = accepted(betting.settleMainWagers(complete));
    expect([1, 4, 6].map((index) => committed.bankrolls[index].available)).toEqual([1800, 2000, 2000]);
    let next = accepted(betting.openBetting(accepted(betting.prepareNextBettingRound(committed))));
    next = accepted(betting.setMainWager(next, 2, 200));
    const random = { nextInt: vi.fn((max: number) => max - 1) };
    const newDeal = accepted(betting.closeBetting(next, 'replacement', random));
    expect(newDeal.game.shoe.shoeId).toBe('replacement');
    expect(newDeal.game.shoe.available).toHaveLength(308);
    expect(random.nextInt).toHaveBeenCalledTimes(312);
    expect(newDeal.bankrolls[1]).toEqual({ available: 1600, reserved: 200 });
    expectAccounting(committed.game.shoe);
    expectAccounting(newDeal.game.shoe);
  });
  it('two rounds reuse a healthy shoe and preserve exact half-credit balances and archives', () => {
    const first = fundedTable(['A', '9', 'K', '8', '10', '10', '8', '9'], [seat(1)], [50]);
    const committed = accepted(betting.settleMainWagers(first));
    const before = structuredClone(committed);
    const configuring = accepted(betting.prepareNextBettingRound(committed));
    const open = accepted(betting.openBetting(configuring));
    const bet = accepted(betting.setMainWager(open, 1, 2000));
    const next = accepted(betting.closeBetting(bet, 'unused', noRandom));
    expect(next.game.round?.roundId).toBe('round-2');
    expect(next.game.round?.players[0].cards.map((card) => card.rank)).toEqual(['10', '8']);
    const final = accepted(betting.settleMainWagers(accepted(betting.advanceFundedTable(next))));
    expect(final.bankrolls[0]).toEqual({ available: 75, reserved: 0 });
    expect(final.results[0]).toMatchObject({ roundId: 'round-2', grossReturnUnits: 0, netUnits: -2000 });
    expect(final.game.shoe.shoeId).toBe('fixture');
    expect(final.game.shoe.discarded).toHaveLength(8);
    expect(committed).toEqual(before);
    const depleted = accepted(betting.openBetting(accepted(betting.prepareNextBettingRound(final))));
    expect(betting.setMainWager(depleted, 1, 76)).toEqual({ ok: false, state: depleted, error: 'INSUFFICIENT_FUNDS' });
    expect(accepted(betting.setMainWager(depleted, 1, 74)).bankrolls[0]).toEqual({ available: 1, reserved: 74 });
    expectAccounting(final.game.shoe);
  });
  it.each([0, 1, 3, 5])('partial initial fault after %i cards refunds every funded stake', (count) => {
    let state = accepted(betting.openBetting(bettingFixture([], [seat(2), seat(7)])));
    state = accepted(betting.setMainWager(state, 2, 20));
    state = accepted(betting.setMainWager(state, 7, 2000));
    const real = shoeModule.drawCard;
    let draws = 0;
    vi.spyOn(shoeModule, 'drawCard').mockImplementation((shoe) => draws++ < count ? real(shoe)
      : { ok: false, shoe: { ...shoe, retired: true }, error: 'SHOE_EXHAUSTED_DURING_ROUND' });
    const failed = accepted(betting.closeBetting(state, 'unused', noRandom));
    expect(failed.game.shoe.inPlay).toHaveLength(count);
    expect(getPublicTableView(failed.game).round?.dealer.holeCard).toBeNull();
    const refunded = accepted(betting.voidFinancialRound(failed));
    expect(refunded.results.map((result) => result.grossReturnUnits)).toEqual([20, 2000]);
    expect(refunded.bankrolls.every((bankroll) => bankroll.available === 2000 && bankroll.reserved === 0)).toBe(true);
    expectAccounting(refunded.game.shoe);
  });
  it('dealer fault after partial draws discards pending Natural and refunds the entire table', () => {
    const state = fundedTable(['A', '10', '2', 'K', '10', '2', '3'], [seat(1), seat(7)]);
    const real = shoeModule.drawCard;
    let draws = 0;
    vi.spyOn(shoeModule, 'drawCard').mockImplementation((shoe) => draws++ === 0 ? real(shoe)
      : { ok: false, shoe: { ...shoe, retired: true }, error: 'SHOE_EXHAUSTED_DURING_ROUND' });
    const failed = accepted(betting.advanceFundedTable(state));
    expect(failed.game.round?.dealerCards.map((card) => card.rank)).toEqual(['2', '2', '3']);
    expect(betting.getMainWagerResults(failed)).toEqual([]);
    const refunded = accepted(betting.voidFinancialRound(failed));
    expect(refunded.bankrolls.every((bankroll) => bankroll.available === 2000 && bankroll.reserved === 0)).toBe(true);
    expectAccounting(refunded.game.shoe);
  });
  it('rejects gameplay outside funded CLOSED phase and preserves all financial terminal state', () => {
    const initial = bettingFixture([], [seat(1, 'HUMAN')]);
    const open = accepted(betting.openBetting(initial));
    const committed = accepted(betting.settleMainWagers(fundedTable(['A', '9', 'K', '8'], [seat(1)])));
    for (const state of [initial, open, committed]) {
      const before = structuredClone(state);
      for (const result of [betting.hitFundedSeat(state, 1), betting.standFundedSeat(state, 1),
        betting.advanceFundedTable(state), betting.resolveFundedDealer(state)]) {
        expect(result).toEqual({ ok: false, state, error: 'WRONG_PHASE' });
        expect(result.state).toBe(state);
      }
      expect(state).toEqual(before);
    }
  });
  it('contains only M3 financial action state and integer monetary fields', () => {
    const state = accepted(betting.settleMainWagers(fundedTable(['A', '9', 'K', '8'], [seat(1)], [50])));
    const banned = /double|split|surrender|insurance|sidebet|betbehind|evenmoney|wallet|account/i;
    function inspect(value: unknown) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        expect(banned.test(key), key).toBe(false);
        if (['available', 'reserved', 'stakeUnits', 'grossReturnUnits', 'netUnits'].includes(key) && typeof child === 'number') {
          expect(Number.isSafeInteger(child), key).toBe(true);
          if (key !== 'netUnits') expect(child).toBeGreaterThanOrEqual(0);
        }
        inspect(child);
      }
    }
    inspect(state);
    expect(Object.keys(betting).some((key) => banned.test(key))).toBe(false);
  });
});
