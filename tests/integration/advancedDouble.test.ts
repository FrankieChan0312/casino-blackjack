import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as advanced from '../../src/domain/advancedGame.js';
import * as shoe from '../../src/domain/shoe.js';
import { accepted, advancedTable, currentId, freezeDeep, withAvailable } from '../helpers/advancedFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Unexpected RNG'); }); });
afterEach(() => vi.restoreAllMocks());

describe('M4 funded Double', () => {
  it('original Double reserves matching stake, draws exactly one and ends below 21', () => {
    const start = advancedTable(['5', '10', '6', '7', '2']);
    freezeDeep(start);
    const draw = vi.spyOn(shoe, 'drawCard');
    const next = accepted(advanced.doubleAdvancedHand(start, 1, currentId(start)));
    expect(draw).toHaveBeenCalledTimes(1);
    expect(next.bankrolls[0]).toEqual({ available: 1600, reserved: 400 });
    expect(next.game.round?.players[0]).toMatchObject({ stakeUnits: 400, decisionTaken: true, complete: true });
    expect(next.game.round?.players[0].cards.map((card) => card.rank)).toEqual(['5', '6', '2']);
    expect(next.game.round?.phase).toBe('DEALER_TURN');
    expect(next.game.round?.currentHandId).toBeNull();
    expect(next.game.shoe.available).toHaveLength(307);
    expect(start.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
    expectAccounting(next.game.shoe);
  });
  it('accepts exact available funds', () => {
    const start = withAvailable(advancedTable(['5', '10', '6', '7', '10']), 200);
    expect(accepted(advanced.doubleAdvancedHand(start, 1, currentId(start))).bankrolls[0])
      .toEqual({ available: 0, reserved: 400 });
  });
  it.each([0, 199])('rejects available %i atomically before draw or progression', (amount) => {
    const state = withAvailable(advancedTable(['5', '10', '6', '7']), amount);
    const before = structuredClone(state);
    freezeDeep(state);
    const draw = vi.spyOn(shoe, 'drawCard');
    expect(advanced.doubleAdvancedHand(state, 1, currentId(state)))
      .toEqual({ ok: false, state, error: 'INSUFFICIENT_FUNDS' });
    expect(advanced.doubleAdvancedHand(state, 1, currentId(state)).state).toBe(state);
    expect(draw).not.toHaveBeenCalled();
    expect(Math.random).not.toHaveBeenCalled();
    expect(state).toEqual(before);
  });
  it('rejects Double on two-card 21 even in an active model fixture', () => {
    const natural = advancedTable(['A', '10', 'K', '7']);
    const hand = { ...natural.game.round!.players[0], complete: false, outcome: undefined, outcomeReason: undefined };
    const fixture = { ...natural, game: { ...natural.game, round: { ...natural.game.round!,
      phase: 'PLAYER_TURN' as const, currentSeat: 1, currentHandId: hand.handId, players: [hand] } } };
    expect(advanced.doubleAdvancedHand(fixture, 1, hand.handId)).toEqual({ ok: false, state: fixture, error: 'DOUBLE_NOT_ALLOWED' });
  });
  it('rejects after Hit even while total is below 21', () => {
    const start = advancedTable(['2', '10', '3', '7', '2']);
    const state = accepted(advanced.hitAdvancedHand(start, 1, currentId(start)));
    expect(advanced.doubleAdvancedHand(state, 1, currentId(state))).toEqual({ ok: false, state, error: 'DOUBLE_NOT_ALLOWED' });
  });
  it('rejects after Stand and duplicate Double/Hit/Stand after Double', () => {
    const start = advancedTable(['5', '10', '6', '7', '2']);
    const stood = accepted(advanced.standAdvancedHand(start, 1, currentId(start)));
    expect(advanced.doubleAdvancedHand(stood, 1, currentId(start)).state).toBe(stood);
    const doubled = accepted(advanced.doubleAdvancedHand(start, 1, currentId(start)));
    for (const command of [advanced.doubleAdvancedHand, advanced.hitAdvancedHand, advanced.standAdvancedHand]) {
      const result = command(doubled, 1, currentId(start));
      expect(result.ok).toBe(false);
      expect(result.state).toBe(doubled);
    }
  });
  it.each([
    ['10', 'PLAYER_WIN', 800, 2400], ['2', 'DEALER_WIN', 0, 1600], ['6', 'PUSH', 400, 2000],
  ] as const)('settles forced %s using full doubled stake: %s', (card, outcome, gross, final) => {
    const start = advancedTable(['5', '10', '6', '7', card]);
    const doubled = accepted(advanced.doubleAdvancedHand(start, 1, currentId(start)));
    const done = accepted(advanced.advanceAdvancedTable(doubled));
    expect(done.bankrolls[0]).toEqual({ available: 1600, reserved: 400 });
    const settled = accepted(advanced.settleAdvancedWagers(done));
    expect(settled.results[0]).toMatchObject({ stakeUnits: 400, outcome, grossReturnUnits: gross, netUnits: gross - 400 });
    expect(settled.bankrolls[0]).toEqual({ available: final, reserved: 0 });
  });
  it('allows DAS on a first-decision non-Ace split-origin model fixture', () => {
    const start = advancedTable(['5', '10', '6', '7', '10']);
    const original = start.game.round!.players[0];
    const hand = { ...original, handId: `${original.handId}.1`, origin: 'SPLIT' as const, parentHandId: original.handId };
    const fixture = { ...start, game: { ...start.game, round: { ...start.game.round!, players: [hand], currentHandId: hand.handId } } };
    const next = accepted(advanced.doubleAdvancedHand(fixture, 1, hand.handId));
    expect(next.game.round?.players[0]).toMatchObject({ stakeUnits: 400, origin: 'SPLIT', complete: true });
    expect(next.game.round?.players[0].cards.map((card) => card.rank)).toEqual(['5', '6', '10']);
  });
  it('rejects Double on a Split-Ace restricted model fixture', () => {
    const start = advancedTable(['A', '10', '6', '7']);
    const hand = { ...start.game.round!.players[0], origin: 'SPLIT' as const, splitAces: true };
    const fixture = { ...start, game: { ...start.game, round: { ...start.game.round!, players: [hand] } } };
    expect(advanced.doubleAdvancedHand(fixture, 1, hand.handId)).toEqual({ ok: false, state: fixture, error: 'DOUBLE_NOT_ALLOWED' });
  });
  it('post-Double exposure may exceed the original main-bet maximum', () => {
    const start = withAvailable(advancedTable(['5', '10', '6', '7', '10'], [seat(1, 'HUMAN')], [2000]), 2000);
    const next = accepted(advanced.doubleAdvancedHand(start, 1, currentId(start)));
    expect(next.game.round?.players[0].stakeUnits).toBe(4000);
    expect(next.bankrolls[0]).toEqual({ available: 0, reserved: 4000 });
  });
  it('pending Natural returns never fund another advanced action', () => {
    const start = advancedTable(['5', 'A', '10', '6', 'K', '7'], [seat(1, 'HUMAN'), seat(2)], [1000, 2000]);
    const state = withAvailable(start, 999);
    expect(advanced.getAdvancedResults(state)[0]).toMatchObject({ seatNumber: 2, grossReturnUnits: 5000, status: 'PENDING' });
    expect(state.bankrolls[1].available).toBe(0);
    expect(advanced.doubleAdvancedHand(state, 1, currentId(state))).toEqual({ ok: false, state, error: 'INSUFFICIENT_FUNDS' });
    expect(advanced.settleAdvancedWagers(state).ok).toBe(false);
  });
  it('requires the current HUMAN hand and advances to a later seat after Double', () => {
    const state = advancedTable(['5', '10', '10', '6', '7', '7', '2'], [seat(1, 'HUMAN'), seat(4)]);
    expect(advanced.doubleAdvancedHand(state, 4, 'round-1/seat-4').state).toBe(state);
    const next = accepted(advanced.doubleAdvancedHand(state, 1, currentId(state)));
    expect(next.game.round?.currentSeat).toBe(4);
    expect(advanced.doubleAdvancedHand(next, 4, currentId(next))).toEqual({ ok: false, state: next, error: 'NOT_HUMAN' });
  });
});
