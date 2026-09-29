import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as a from '../../src/domain/advancedGame.js';
import { getPublicAdvancedView } from '../../src/domain/advancedPublicView.js';
import * as shoe from '../../src/domain/shoe.js';
import { accepted, advancedFixture, advancedTable, currentId, freezeDeep } from '../helpers/advancedFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Unexpected RNG'); }); });
afterEach(() => vi.restoreAllMocks());

const split = (state: a.AdvancedGameState) => accepted(a.splitAdvancedHand(state, 1, currentId(state)));
const stand = (state: a.AdvancedGameState) => accepted(a.standAdvancedHand(state, 1, currentId(state)));
const double = (state: a.AdvancedGameState) => accepted(a.doubleAdvancedHand(state, 1, currentId(state)));
function retainAvailable(state: a.AdvancedGameState, count: number): a.AdvancedGameState {
  return { ...state, game: { ...state.game, shoe: { ...state.game.shoe,
    available: state.game.shoe.available.slice(0, count),
    discarded: [...state.game.shoe.discarded, ...state.game.shoe.available.slice(count)] } } };
}
function verifyFailure(failed: a.AdvancedGameState, reserved: readonly number[]) {
  expect(failed.game.round?.phase).toBe('INTEGRITY_ERROR');
  expect(failed.game.round?.integrityError).toBe('SHOE_EXHAUSTED_DURING_ROUND');
  expect(failed.game.shoe.retired).toBe(true);
  expect(failed.game.shoe.shoeId).toBe('fixture');
  expect(failed.bankrolls.map((entry) => entry.reserved)).toEqual(reserved);
  expect(failed.game.round?.players.every((hand) => hand.outcome === undefined && hand.outcomeReason === undefined)).toBe(true);
  expect(a.getAdvancedResults(failed)).toEqual([]);
  expect(getPublicAdvancedView(failed).round?.dealer.holeCard).toBeNull();
  const before = structuredClone(failed);
  freezeDeep(failed);
  expect(a.settleAdvancedWagers(failed).ok).toBe(false);
  const refunded = accepted(a.voidAdvancedRound(failed));
  expect(refunded.game).toBe(failed.game);
  expect(refunded.bankrolls.every((entry) => entry.available === 2000 && entry.reserved === 0)).toBe(true);
  expect(refunded.results.reduce((sum, entry) => sum + entry.grossReturnUnits, 0)).toBe(reserved.reduce((sum, value) => sum + value, 0));
  expect(refunded.results.every((entry) => entry.status === 'REFUNDED' && entry.netUnits === 0 && entry.grossReturnUnits === entry.stakeUnits)).toBe(true);
  expect(a.voidAdvancedRound(refunded).state).toBe(refunded);
  expect(a.voidAdvancedRound(refunded).ok).toBe(false);
  expect(a.settleAdvancedWagers(refunded).state).toBe(refunded);
  expect(failed).toEqual(before);
  expectAccounting(failed.game.shoe);
  return refunded;
}

describe('M4 integrity, actual exposure and recovery', () => {
  it('Double exhaustion preserves original cards and its newly reserved matching amount', () => {
    const state = retainAvailable(advancedTable(['5', '10', '6', '7']), 0);
    const failed = double(state);
    expect(failed.game.round?.players[0].cards).toEqual(state.game.round?.players[0].cards);
    expect(failed.game.shoe.inPlay).toHaveLength(4);
    verifyFailure(failed, [400, 0, 0, 0, 0, 0, 0]);
  });
  it.each(['FIRST', 'LATER', 'RESPLIT'] as const)('%s split-child draw exhaustion preserves ordered diagnostics', (stage) => {
    const start = advancedTable(['8', '10', '8', '7', '8']);
    const ready = retainAvailable(stage === 'FIRST' ? start : split(start), 0);
    const failed = stage === 'LATER' ? stand(ready) : split(ready);
    expect(failed.game.round?.players.map((hand) => hand.cards.map((card) => card.rank)))
      .toEqual(stage === 'FIRST' ? [['8'], ['8']] : stage === 'LATER' ? [['8', '8'], ['8']] : [['8'], ['8'], ['8']]);
    expect(failed.game.shoe.inPlay).toHaveLength(stage === 'FIRST' ? 4 : 5);
    verifyFailure(failed, [stage === 'RESPLIT' ? 600 : 400, 0, 0, 0, 0, 0, 0]);
  });
  it('second Split-Ace addition can fail after the first child completed normally', () => {
    const state = retainAvailable(advancedTable(['A', '10', 'A', '7', 'K']), 1);
    const failed = split(state);
    expect(failed.game.round?.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['A', 'K'], ['A']]);
    expect(failed.game.shoe.inPlay).toHaveLength(5);
    verifyFailure(failed, [400, 0, 0, 0, 0, 0, 0]);
  });
  it('dealer partial-draw failure clears a pending split bust and refunds doubled/re-split exposure', () => {
    const start = advancedTable(['8', '2', '8', '2', '8', '3', 'K', 'K', 'K', '2', '3']);
    const resplit = split(split(start));
    const doubled = double(resplit); // 8+3+K=21; sibling receives K.
    const busted = accepted(a.hitAdvancedHand(doubled, 1, currentId(doubled))); // 8+K+K bust; last child gets 2.
    expect(a.getAdvancedResults(busted)[0]).toMatchObject({ outcome: 'DEALER_WIN', grossReturnUnits: 0 });
    const dealer = retainAvailable(stand(busted), 1);
    const failed = accepted(a.advanceAdvancedTable(dealer));
    expect(failed.game.round?.dealerCards.map((card) => card.rank)).toEqual(['2', '2', '3']);
    expect(failed.game.round?.players[1].cards.map((card) => card.rank)).toEqual(['8', 'K', 'K']);
    verifyFailure(failed, [800, 0, 0, 0, 0, 0, 0]);
  });
  it('VOID refunds four actually doubled leaves, not a maximum hypothetical exposure', () => {
    let state = split(split(split(advancedTable(['8', '10', '8', '6', '8', '8', '3', '10', '3', '10', '3', '10', '3', '10']))));
    for (let hand = 0; hand < 4; hand++) state = double(state);
    expect(state.game.round?.players.map((hand) => hand.stakeUnits)).toEqual([400, 400, 400, 400]);
    expect(state.bankrolls[0]).toEqual({ available: 400, reserved: 1600 });
    const failed = accepted(a.advanceAdvancedTable(retainAvailable(state, 0)));
    const refunded = verifyFailure(failed, [1600, 0, 0, 0, 0, 0, 0]);
    expect(refunded.results).toHaveLength(4);
    expect(refunded.results.map((entry) => entry.grossReturnUnits)).toEqual([400, 400, 400, 400]);
  });
  it('failed funding never contributes a hypothetical Double reserve to VOID', () => {
    const start = advancedTable(['8', '10', '8', '6', '3', '2'], [seat(1, 'HUMAN')], [1000]);
    const state = split(start);
    expect(a.doubleAdvancedHand(state, 1, currentId(state))).toEqual({ ok: false, state, error: 'INSUFFICIENT_FUNDS' });
    const failed = stand(retainAvailable(state, 0));
    expect(failed.bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
    const refunded = verifyFailure(failed, [2000, 0, 0, 0, 0, 0, 0]);
    expect(refunded.results.map((entry) => entry.grossReturnUnits)).toEqual([1000, 1000]);
  });
  it('whole-table failure discards pending Natural and surrender before refunding all seats', () => {
    const start = advancedTable(['10', 'A', '5', '6', '6', 'K', '5', '5'], [seat(1, 'HUMAN'), seat(4), seat(7)]);
    const surrendered = accepted(a.surrenderAdvancedHand(start, 1, currentId(start)));
    expect(a.getAdvancedResults(surrendered).map((entry) => entry.outcome)).toEqual(['SURRENDERED', 'PLAYER_BLACKJACK']);
    const failed = accepted(a.advanceAdvancedTable(retainAvailable(surrendered, 0)));
    verifyFailure(failed, [200, 0, 0, 200, 0, 0, 200]);
  });
  it('next explicit funded round replaces the failed shoe once and retains the archived failure', () => {
    const failed = double(retainAvailable(advancedTable(['5', '10', '6', '7']), 0));
    const refunded = verifyFailure(failed, [400, 0, 0, 0, 0, 0, 0]);
    const archived = structuredClone(refunded);
    let next = accepted(a.prepareNextAdvancedRound(refunded));
    expect(next.game.shoe).toBe(failed.game.shoe);
    next = accepted(a.openAdvancedBetting(next));
    expect(a.closeAdvancedBetting(next, 'replacement', noRandom).ok).toBe(false);
    next = accepted(a.setAdvancedWager(next, 1, 200));
    const random = { nextInt: vi.fn((max: number) => max - 1) };
    next = accepted(a.closeAdvancedBetting(next, 'replacement', random));
    expect(random.nextInt).toHaveBeenCalledTimes(312);
    expect(next.game.shoe.shoeId).toBe('replacement');
    expect(next.game.shoe.retired).toBe(false);
    expect(next.game.round?.roundId).toBe('round-2');
    expect(next.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
    expect(refunded).toEqual(archived);
    expectAccounting(next.game.shoe);
  });
  it.each([0, 1, 3, 5])('initial draw fault after %i cards retains every funded original for VOID', (count) => {
    let state = accepted(a.openAdvancedBetting(advancedFixture([], [seat(1, 'HUMAN'), seat(4)])));
    state = accepted(a.setAdvancedWager(state, 1, 200));
    state = accepted(a.setAdvancedWager(state, 4, 200));
    const real = shoe.drawCard;
    let draws = 0;
    vi.spyOn(shoe, 'drawCard').mockImplementation((current) => draws++ < count ? real(current)
      : real({ ...current, available: [], discarded: [...current.discarded, ...current.available] }));
    const failed = accepted(a.closeAdvancedBetting(state, 'unused', noRandom));
    expect(failed.game.shoe.inPlay).toHaveLength(count);
    verifyFailure(failed, [200, 0, 0, 200, 0, 0, 0]);
  });
  it.each([219, 249])('advanced draws cross cut %i without any mid-round shoe replacement', (cut) => {
    const original = advancedTable(['8', '10', '8', '7', '3', '10', '9']);
    const count = 312 - cut + 1;
    const ready = retainAvailable(original, count);
    const state = { ...ready, game: { ...ready.game, shoe: { ...ready.game.shoe, cutPosition: cut, reshufflePending: false } } };
    const done = accepted(a.advanceAdvancedTable(stand(double(split(state)))));
    expect(done.game.shoe.shoeId).toBe('fixture');
    expect(done.game.shoe.cutPosition).toBe(cut);
    expect(done.game.shoe.reshufflePending).toBe(true);
    expect(done.game.shoe.retired).toBe(false);
    expectAccounting(done.game.shoe);
    const paid = accepted(a.settleAdvancedWagers(done));
    expect(paid.bankrolls[0].available).toBe(2400);
  });
});
