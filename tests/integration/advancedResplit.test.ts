import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as advanced from '../../src/domain/advancedGame.js';
import * as shoe from '../../src/domain/shoe.js';
import { accepted, advancedTable, currentId, freezeDeep } from '../helpers/advancedFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Unexpected RNG'); }); });
afterEach(() => vi.restoreAllMocks());

function split(state: advanced.AdvancedGameState) {
  return accepted(advanced.splitAdvancedHand(state, 1, currentId(state)));
}
describe('M4 re-split and Split Aces', () => {
  it('second and third Split operations preserve depth-first ancestry and exact funds', () => {
    const start = advancedTable(['8', '10', '8', '7', '8', '8', '2', '3', '4', '5'], [seat(1, 'HUMAN')], [500]);
    const first = split(start);
    const second = split(first);
    expect(second.game.round?.players.map((hand) => hand.handId)).toEqual([
      'round-1/seat-1.1.1', 'round-1/seat-1.1.2', 'round-1/seat-1.2']);
    const third = split(second);
    expect(third.game.round?.players.map((hand) => hand.handId)).toEqual([
      'round-1/seat-1.1.1.1', 'round-1/seat-1.1.1.2', 'round-1/seat-1.1.2', 'round-1/seat-1.2']);
    expect(third.game.round?.players.map((hand) => hand.cards.map((card) => card.rank)))
      .toEqual([['8', '2'], ['8'], ['8'], ['8']]);
    expect(third.bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
    let state = third;
    for (const id of ['round-1/seat-1.1.1.1', 'round-1/seat-1.1.1.2', 'round-1/seat-1.1.2', 'round-1/seat-1.2']) {
      expect(currentId(state)).toBe(id);
      state = accepted(advanced.standAdvancedHand(state, 1, id));
    }
    expect(state.game.round?.players.map((hand) => hand.cards.map((card) => card.rank)))
      .toEqual([['8', '2'], ['8', '3'], ['8', '4'], ['8', '5']]);
    expect(state.game.round?.phase).toBe('DEALER_TURN');
    expectAccounting(state.game.shoe);
    const paid = accepted(advanced.settleAdvancedWagers(accepted(advanced.advanceAdvancedTable(state))));
    expect(paid.results).toHaveLength(4);
    expect(paid.results.every((entry) => entry.stakeUnits === 500 && entry.outcome === 'DEALER_WIN')).toBe(true);
    expect(paid.bankrolls[0]).toEqual({ available: 0, reserved: 0 });
  });
  it('rejects a fifth leaf with ample funds without cards, RNG or financial changes', () => {
    const state = split(split(split(advancedTable(['8', '10', '8', '7', '8', '8', '8']))));
    expect(state.bankrolls[0].available).toBe(1200);
    const before = structuredClone(state);
    freezeDeep(state);
    const draw = vi.spyOn(shoe, 'drawCard');
    const result = advanced.splitAdvancedHand(state, 1, currentId(state));
    expect(result).toEqual({ ok: false, state, error: 'HAND_LIMIT_REACHED' });
    expect(result.state).toBe(state);
    expect(state).toEqual(before);
    expect(draw).not.toHaveBeenCalled();
    expect(Math.random).not.toHaveBeenCalled();
  });
  it.each(['STAND', 'BUST'] as const)('%s leaf remains counted against the cap', (mode) => {
    const state = split(split(split(advancedTable(['8', '10', '8', '7', '8', '8', '8',
      ...(mode === 'BUST' ? ['K' as const] : []), '8']))));
    const next = accepted(mode === 'STAND' ? advanced.standAdvancedHand(state, 1, currentId(state))
      : advanced.hitAdvancedHand(state, 1, currentId(state)));
    expect(next.game.round?.players[0].complete).toBe(true);
    if (mode === 'BUST') expect(next.game.round?.players[0].outcomeReason).toBe('PLAYER_BUST');
    expect(next.game.round?.players[1].cards.map((card) => card.rank)).toEqual(['8', '8']);
    expect(advanced.splitAdvancedHand(next, 1, currentId(next))).toEqual({ ok: false, state: next, error: 'HAND_LIMIT_REACHED' });
    expect(next.game.round?.players).toHaveLength(4);
    expectAccounting(next.game.shoe);
  });
  it('rejects insufficient re-split funds below the independent leaf cap', () => {
    const state = split(advancedTable(['8', '10', '8', '7', '8'], [seat(1, 'HUMAN')], [1000]));
    expect(state.game.round?.players).toHaveLength(2);
    expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 2000 });
    const before = structuredClone(state);
    const draw = vi.spyOn(shoe, 'drawCard');
    const result = advanced.splitAdvancedHand(state, 1, currentId(state));
    expect(result).toEqual({ ok: false, state, error: 'INSUFFICIENT_FUNDS' });
    expect(result.state).toBe(state);
    expect(state).toEqual(before);
    expect(draw).not.toHaveBeenCalled();
  });
  it('re-splits the later child in place after the first leaf has finished', () => {
    const first = split(advancedTable(['8', '10', '8', '7', '2', '8', '3', '4']));
    const second = accepted(advanced.standAdvancedHand(first, 1, currentId(first)));
    const resplit = split(second);
    expect(resplit.game.round?.players.map((hand) => hand.handId)).toEqual([
      'round-1/seat-1.1', 'round-1/seat-1.2.1', 'round-1/seat-1.2.2']);
    expect(currentId(resplit)).toBe('round-1/seat-1.2.1');
    expect(resplit.game.round?.players.map((hand) => hand.cards.map((card) => card.rank)))
      .toEqual([['8', '2'], ['8', '3'], ['8']]);
    expectAccounting(resplit.game.shoe);
  });
  it('Split Aces draws exactly two ordered additions and completes both children', () => {
    const start = advancedTable(['A', '10', 'A', '7', 'A', 'K', '6']);
    const draw = vi.spyOn(shoe, 'drawCard');
    const next = split(start);
    expect(draw).toHaveBeenCalledTimes(2);
    expect(next.game.round?.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['A', 'A'], ['A', 'K']]);
    expect(next.game.round?.players.every((hand) => hand.splitAces && hand.complete)).toBe(true);
    expect(next.game.round?.phase).toBe('DEALER_TURN');
    expect(next.game.shoe.available[0].rank).toBe('6');
    expect(next.bankrolls[0]).toEqual({ available: 1600, reserved: 400 });
    expectAccounting(next.game.shoe);
  });
  it('Split Aces forbids Hit, Stand, Double and re-split even with a newly dealt Ace', () => {
    const state = split(advancedTable(['A', '10', 'A', '7', 'A', 'A']));
    const before = structuredClone(state);
    const draw = vi.spyOn(shoe, 'drawCard');
    for (const hand of state.game.round!.players) {
      for (const command of [advanced.hitAdvancedHand, advanced.standAdvancedHand, advanced.doubleAdvancedHand, advanced.splitAdvancedHand]) {
        const result = command(state, 1, hand.handId);
        expect(result.ok).toBe(false);
        expect(result.state).toBe(state);
      }
    }
    expect(state).toEqual(before);
    expect(draw).not.toHaveBeenCalled();
  });
  it.each([
    ['6', '10', '5', 'PUSH', 200], ['10', '7', undefined, 'PLAYER_WIN', 400],
  ] as const)('split A K remains ordinary against dealer %s/%s', (up, hole, extra, outcome, gross) => {
    const start = advancedTable(['A', up, 'A', hole, 'K', '10', ...(extra ? [extra] : [])]);
    const next = split(start);
    const done = accepted(advanced.advanceAdvancedTable(next));
    const paid = accepted(advanced.settleAdvancedWagers(done));
    expect(paid.results.map((entry) => [entry.outcome, entry.grossReturnUnits])).toEqual([[outcome, gross], [outcome, gross]]);
    expect(paid.results.every((entry) => entry.outcome !== 'PLAYER_BLACKJACK')).toBe(true);
    expect(done.game.round?.dealerCards).toHaveLength(extra ? 3 : 2);
    expectAccounting(done.game.shoe);
  });
});
