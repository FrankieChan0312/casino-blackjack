import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as advanced from '../../src/domain/advancedGame.js';
import { getPublicAdvancedView } from '../../src/domain/advancedPublicView.js';
import * as shoe from '../../src/domain/shoe.js';
import { accepted, advancedTable, currentId, freezeDeep, withAvailable } from '../helpers/advancedFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Unexpected RNG'); }); });
afterEach(() => vi.restoreAllMocks());

describe('M4 funded Split', () => {
  const tenValues = ['10', 'J', 'Q', 'K'] as const;
  it.each(tenValues.flatMap((first) => tenValues.map((second) => [first, second] as const)))(
    'allows every ten-valued combination %s/%s', (first, second) => {
    const start = advancedTable([first, '10', second, '7', '2']);
    const next = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    expect(next.game.round?.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([[first, '2'], [second]]);
    expect(next.bankrolls[0]).toEqual({ available: 1600, reserved: 400 });
  });
  it.each(['2', '3', '4', '5', '6', '7', '8', '9'] as const)('allows equal numeric ranks %s', (rank) => {
    const start = advancedTable([rank, '10', rank, '7', '2']);
    expect(accepted(advanced.splitAdvancedHand(start, 1, currentId(start))).game.round?.players).toHaveLength(2);
  });
  it.each([['9', '8'], ['A', '10'], ['9', 'K']] as const)('rejects nonmatching %s/%s without drawing', (first, second) => {
    const start = advancedTable([first, '10', second, '7']);
    const draw = vi.spyOn(shoe, 'drawCard');
    const result = advanced.splitAdvancedHand(start, 1, currentId(start));
    expect(result.ok).toBe(false);
    expect(result.state).toBe(start);
    expect(draw).not.toHaveBeenCalled();
  });
  it('reserves exact funds and rejects one unit short with the entire snapshot unchanged', () => {
    const start = advancedTable(['8', '10', '8', '7', '3']);
    const exact = withAvailable(start, 200);
    expect(accepted(advanced.splitAdvancedHand(exact, 1, currentId(exact))).bankrolls[0]).toEqual({ available: 0, reserved: 400 });
    const short = withAvailable(start, 199);
    const before = structuredClone(short);
    freezeDeep(short);
    const draw = vi.spyOn(shoe, 'drawCard');
    const result = advanced.splitAdvancedHand(short, 1, currentId(short));
    expect(result).toEqual({ ok: false, state: short, error: 'INSUFFICIENT_FUNDS' });
    expect(result.state).toBe(short);
    expect(short).toEqual(before);
    expect(draw).not.toHaveBeenCalled();
    expect(Math.random).not.toHaveBeenCalled();
  });
  it('retains physical ownership and plays first child fully before dealing second child', () => {
    const start = advancedTable(['8', '10', '8', '7', '2', '3', '4']);
    freezeDeep(start);
    const original = start.game.round!.players[0];
    const split = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    const [first, second] = split.game.round!.players;
    expect(first.cards[0]).toBe(original.cards[0]);
    expect(second.cards[0]).toBe(original.cards[1]);
    expect(first.cards[1]).toBe(start.game.shoe.available[0]);
    expect(second.cards).toHaveLength(1);
    expect(first.originalCards).toBe(original.originalCards);
    expect(first).toMatchObject({ handId: 'round-1/seat-1.1', parentHandId: original.handId, rootHandId: original.handId, origin: 'SPLIT' });
    expect(currentId(split)).toBe(first.handId);
    const hit = accepted(advanced.hitAdvancedHand(split, 1, first.handId));
    expect(hit.game.round?.players[0].cards.map((card) => card.rank)).toEqual(['8', '2', '3']);
    expect(hit.game.round?.players[1].cards).toHaveLength(1);
    const stood = accepted(advanced.standAdvancedHand(hit, 1, first.handId));
    expect(currentId(stood)).toBe(second.handId);
    expect(stood.game.round?.players[1].cards.map((card) => card.rank)).toEqual(['8', '4']);
    expect(stood.game.round?.players[1].cards[1]).toBe(start.game.shoe.available[2]);
    expectAccounting(stood.game.shoe);
    expect(start.game.round?.players).toHaveLength(1);
  });
  it('the next seat waits while every child of this seat finishes', () => {
    const start = advancedTable(['8', '10', '10', '8', '7', '7', '2', '3'], [seat(1, 'HUMAN'), seat(4)]);
    const split = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    const first = accepted(advanced.standAdvancedHand(split, 1, currentId(split)));
    expect(first.game.round?.currentSeat).toBe(1);
    expect(advanced.advanceAdvancedTable(first).state).toBe(first);
    const second = accepted(advanced.standAdvancedHand(first, 1, currentId(first)));
    expect(second.game.round?.currentSeat).toBe(4);
    expect(currentId(second)).toBe('round-1/seat-4');
  });
  it('split A K is ordinary 21 and each child settles without a parent wager', () => {
    const start = advancedTable(['A', '10', 'A', '7', 'K', '9']);
    const split = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    expect(split.game.round?.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['A', 'K'], ['A', '9']]);
    expect(split.game.round?.players.every((hand) => !advanced.isAdvancedNatural(hand))).toBe(true);
    expect(advanced.getAdvancedResults(split)).toEqual([]);
    const paid = accepted(advanced.settleAdvancedWagers(accepted(advanced.advanceAdvancedTable(split))));
    expect(paid.results.map((result) => [result.handId, result.stakeUnits, result.outcome, result.grossReturnUnits]))
      .toEqual([['round-1/seat-1.1', 200, 'PLAYER_WIN', 400], ['round-1/seat-1.2', 200, 'PLAYER_WIN', 400]]);
    expect(paid.bankrolls[0]).toEqual({ available: 2400, reserved: 0 });
    expectAccounting(paid.game.shoe);
  });
  it('allows actual DAS while the waiting child receives its card only after forced completion', () => {
    const start = advancedTable(['8', '10', '8', '7', '3', '10', '2']);
    const split = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    const doubled = accepted(advanced.doubleAdvancedHand(split, 1, currentId(split)));
    expect(doubled.game.round?.players.map((hand) => hand.cards.map((card) => card.rank))).toEqual([['8', '3', '10'], ['8', '2']]);
    expect(doubled.game.round?.players.map((hand) => hand.stakeUnits)).toEqual([400, 200]);
    expect(doubled.bankrolls[0]).toEqual({ available: 1400, reserved: 600 });
    expect(currentId(doubled)).toBe('round-1/seat-1.2');
  });
  it('rejects Split after Hit/Stand/Double and duplicate parent requests', () => {
    const start = advancedTable(['8', '10', '8', '7', '2']);
    for (const command of [advanced.hitAdvancedHand, advanced.standAdvancedHand, advanced.doubleAdvancedHand, advanced.splitAdvancedHand]) {
      const next = accepted(command(start, 1, currentId(start)));
      const result = advanced.splitAdvancedHand(next, 1, currentId(start));
      expect(result.ok).toBe(false);
      expect(result.state).toBe(next);
    }
  });
  it('projects ordered children, leaves waiting cards undealt and hides dealer secrets', () => {
    const start = advancedTable(['8', 'K', '8', '6', '3']);
    const split = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    const view = getPublicAdvancedView(split);
    expect(view.round?.seats[0].hands.map((hand) => [hand.handId, hand.cards.length])).toEqual([
      ['round-1/seat-1.1', 2], ['round-1/seat-1.2', 1]]);
    expect(view.round?.dealer.holeCard).toBeNull();
    const text = JSON.stringify(view);
    expect(text).not.toMatch(/deckIndex|originalCards|parentHandId|cutPosition|shoeId/);
    for (const card of split.game.shoe.inPlay) expect(text).not.toContain(card.id);
  });
});
