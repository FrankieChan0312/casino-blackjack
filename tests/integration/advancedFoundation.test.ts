import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as advanced from '../../src/domain/advancedGame.js';
import { getPublicAdvancedView } from '../../src/domain/advancedPublicView.js';
import { accepted, advancedTable, currentId, freezeDeep } from '../helpers/advancedFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Unexpected RNG'); }); });
afterEach(() => vi.restoreAllMocks());

describe('M4 hand foundation', () => {
  it('preserves one-hand deal, Hit/Stand, S17 and exact ordinary settlement', () => {
    const start = advancedTable(['5', '10', '5', '6', '8', '2']);
    freezeDeep(start);
    const hit = accepted(advanced.hitAdvancedHand(start, 1, currentId(start)));
    const stood = accepted(advanced.standAdvancedHand(hit, 1, currentId(hit)));
    const done = accepted(advanced.advanceAdvancedTable(stood));
    expect(done.game.round?.players[0].cards.map((card) => card.rank)).toEqual(['5', '5', '8']);
    expect(done.game.round?.dealerCards.map((card) => card.rank)).toEqual(['10', '6', '2']);
    const paid = accepted(advanced.settleAdvancedWagers(done));
    expect(paid.bankrolls[0]).toEqual({ available: 2000, reserved: 0 });
    expect(paid.results).toEqual([{ roundId: 'round-1', seatNumber: 1, handId: 'round-1/seat-1',
      stakeUnits: 200, outcome: 'PUSH', grossReturnUnits: 200, netUnits: 0, status: 'COMMITTED' }]);
    expectAccounting(paid.game.shoe);
  });
  it('keeps stable identity and detached original-card lineage across decisions', () => {
    const start = advancedTable(['5', '10', '5', '7', '3']);
    const before = structuredClone(start);
    const next = accepted(advanced.hitAdvancedHand(start, 1, currentId(start)));
    expect(next.game.round?.players[0]).toMatchObject({ handId: 'round-1/seat-1', rootHandId: 'round-1/seat-1',
      parentHandId: null, origin: 'ORIGINAL', decisionTaken: true, complete: false, stakeUnits: 200 });
    expect(next.game.round?.players[0].originalCards.map((card) => card.rank)).toEqual(['5', '5']);
    expect(currentId(next)).toBe(currentId(start));
    expect(start).toEqual(before);
  });
  it('skips finished ordered fixture leaves and completes the seat before the next seat', () => {
    const dealt = advancedTable(['8', '10', '10', '8', '7', '7'], [seat(1, 'HUMAN'), seat(4)]);
    const round = dealt.game.round!;
    const original = round.players[0];
    const leaves = [1, 2, 3].map((index) => ({ ...original, handId: `${original.handId}.${index}`,
      origin: 'SPLIT' as const, parentHandId: original.handId, complete: index === 2 }));
    const fixture = { ...dealt, game: { ...dealt.game, round: { ...round,
      players: [...leaves, round.players[1]], currentHandId: leaves[0].handId } } };
    const first = accepted(advanced.standAdvancedHand(fixture, 1, leaves[0].handId));
    expect(first.game.round?.currentSeat).toBe(1);
    expect(currentId(first)).toBe(leaves[2].handId);
    expect(advanced.standAdvancedHand(first, 1, leaves[0].handId).state).toBe(first);
    const last = accepted(advanced.standAdvancedHand(first, 1, leaves[2].handId));
    expect(last.game.round?.currentSeat).toBe(4);
    expect(currentId(last)).toBe('round-1/seat-4');
    expect(last.game.round?.players.map((hand) => hand.handId)).toEqual([
      'round-1/seat-1.1', 'round-1/seat-1.2', 'round-1/seat-1.3', 'round-1/seat-4']);
    expect(last.game.shoe).toBe(dealt.game.shoe);
  });
  it('never treats split-origin A K metadata as an original Natural', () => {
    const dealt = advancedTable(['A', '10', 'K', '7']);
    const original = dealt.game.round!.players[0];
    expect(advanced.isAdvancedNatural(original)).toBe(true);
    expect(advanced.isAdvancedNatural({ ...original, origin: 'SPLIT', parentHandId: original.handId })).toBe(false);
    expect(advanced.isAdvancedNatural({ ...original, origin: 'SPLIT' })).toBe(false);
    expect(accepted(advanced.settleAdvancedWagers(dealt)).bankrolls[0].available).toBe(2300);
  });
  it('projects ordered public hands without physical identity, shoe or hidden dealer data', () => {
    const state = advancedTable(['8', 'K', '8', '6']);
    const view = getPublicAdvancedView(state);
    expect(view.round?.dealer.holeCard).toBeNull();
    expect(view.round?.dealer.visibleCards).toEqual([{ rank: 'K', suit: 'diamonds' }]);
    expect(view.round?.seats[0].hands[0]).toMatchObject({ handId: 'round-1/seat-1', stakeUnits: 200 });
    const serialized = JSON.stringify(view);
    for (const forbidden of ['deckIndex', 'originalCards', 'available', 'inPlay', 'cutPosition', 'shoeId', 'parentHandId']) {
      expect(serialized).not.toContain(forbidden);
    }
    for (const card of [...state.game.shoe.inPlay, ...state.game.shoe.available]) expect(serialized).not.toContain(card.id);
    const changedHole = { ...state, game: { ...state.game, round: { ...state.game.round!,
      dealerCards: [state.game.round!.dealerCards[0], { ...state.game.round!.dealerCards[1], rank: '5' as const }] } } };
    expect(getPublicAdvancedView(changedHole)).toEqual(view);
    expect(view.round?.seats[0].hands[0].cards[0]).not.toBe(state.game.round!.players[0].cards[0]);
  });
  it('requires current HUMAN identity and preserves terminal state on rejection', () => {
    const state = advancedTable(['10', '10', '8', '7']);
    expect(advanced.hitAdvancedHand(state, 2, currentId(state)).state).toBe(state);
    expect(advanced.hitAdvancedHand(state, 1, 'stale').state).toBe(state);
    const stood = accepted(advanced.standAdvancedHand(state, 1, currentId(state)));
    expect(advanced.hitAdvancedHand(stood, 1, currentId(state)).ok).toBe(false);
    const done = accepted(advanced.advanceAdvancedTable(stood));
    expect(advanced.advanceAdvancedTable(done).state).toBe(done);
    const bot = advancedTable(['10', '10', '8', '7'], [seat(1)]);
    expect(advanced.hitAdvancedHand(bot, 1, currentId(bot))).toEqual({ ok: false, state: bot, error: 'NOT_HUMAN' });
  });
  it('carries the same shoe and actual funds into a newly numbered round', () => {
    const start = advancedTable(['A', '9', 'K', '8', '10', '10', '8', '7']);
    const committed = accepted(advanced.settleAdvancedWagers(start));
    let next = accepted(advanced.openAdvancedBetting(accepted(advanced.prepareNextAdvancedRound(committed))));
    next = accepted(advanced.setAdvancedWager(next, 1, 200));
    next = accepted(advanced.closeAdvancedBetting(next, 'unused', { nextInt() { throw new Error('Unexpected RNG'); } }));
    expect(next.game.round?.roundId).toBe('round-2');
    expect(currentId(next)).toBe('round-2/seat-1');
    expect(next.bankrolls[0]).toEqual({ available: 2100, reserved: 200 });
    expect(next.game.shoe.shoeId).toBe('fixture');
    expectAccounting(next.game.shoe);
  });
});
