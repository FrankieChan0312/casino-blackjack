import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as advanced from '../../src/domain/advancedGame.js';
import * as shoe from '../../src/domain/shoe.js';
import { accepted, advancedTable, currentId, freezeDeep } from '../helpers/advancedFixture.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { seat } from '../helpers/tableFixture.js';

beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Unexpected RNG'); }); });
afterEach(() => vi.restoreAllMocks());

describe('M4 Late Surrender and leaf settlement', () => {
  it.each(['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const)(
    'allows original surrender after natural exclusion against %s', (up) => {
      const state = advancedTable(['10', up, '6', '5'], [seat(1, 'HUMAN')], [50]);
      expect(state.game.round?.dealerNaturalExcluded).toBe(true);
      freezeDeep(state);
      const draw = vi.spyOn(shoe, 'drawCard');
      const surrendered = accepted(advanced.surrenderAdvancedHand(state, 1, currentId(state)));
      expect(draw).not.toHaveBeenCalled();
      expect(surrendered.bankrolls).toBe(state.bankrolls);
      expect(surrendered.game.shoe).toBe(state.game.shoe);
      expect(surrendered.game.round?.players[0]).toMatchObject({ complete: true, outcome: 'SURRENDERED', outcomeReason: 'LATE_SURRENDER' });
      expect(advanced.getAdvancedResults(surrendered)).toEqual([{ roundId: 'round-1', seatNumber: 1,
        handId: 'round-1/seat-1', stakeUnits: 50, outcome: 'SURRENDERED', grossReturnUnits: 25, netUnits: -25, status: 'PENDING' }]);
      expect(surrendered.bankrolls[0]).toEqual({ available: 1950, reserved: 50 });
      expect(advanced.settleAdvancedWagers(surrendered).ok).toBe(false);
      const done = accepted(advanced.advanceAdvancedTable(surrendered));
      expect(draw).not.toHaveBeenCalled();
      const paid = accepted(advanced.settleAdvancedWagers(done));
      expect(paid.bankrolls[0]).toEqual({ available: 1975, reserved: 0 });
      expect(Number.isSafeInteger(paid.results[0].grossReturnUnits)).toBe(true);
      expectAccounting(paid.game.shoe);
    });
  it.each(['HIT', 'STAND', 'DOUBLE', 'SPLIT'] as const)('rejects surrender after %s unchanged', (action) => {
    const start = advancedTable(['8', '10', '8', '7', '2', '3']);
    const commands = { HIT: advanced.hitAdvancedHand, STAND: advanced.standAdvancedHand,
      DOUBLE: advanced.doubleAdvancedHand, SPLIT: advanced.splitAdvancedHand };
    const next = accepted(commands[action](start, 1, currentId(start)));
    const before = structuredClone(next);
    const result = advanced.surrenderAdvancedHand(next, 1, action === 'SPLIT' ? currentId(next) : currentId(start));
    expect(result.ok).toBe(false);
    expect(result.state).toBe(next);
    expect(next).toEqual(before);
  });
  it('rejects Natural even while another seat remains active', () => {
    const state = advancedTable(['A', '10', '6', 'K', '7', '5'], [seat(1, 'HUMAN'), seat(2)]);
    expect(advanced.surrenderAdvancedHand(state, 1, 'round-1/seat-1').state).toBe(state);
    const natural = state.game.round!.players[0];
    const fixture = { ...state, game: { ...state.game, round: { ...state.game.round!, currentSeat: 1,
      currentHandId: natural.handId, players: [{ ...natural, complete: false }, state.game.round!.players[1]] } } };
    expect(advanced.surrenderAdvancedHand(fixture, 1, natural.handId)).toEqual({ ok: false, state: fixture, error: 'SURRENDER_NOT_ALLOWED' });
  });
  it.each(['A', '10'] as const)('known dealer Natural with %s prevents surrender', (up) => {
    const state = advancedTable(['10', up, '6', up === 'A' ? 'K' : 'A']);
    expect(state.game.round?.dealerNaturalExcluded).toBe(false);
    expect(advanced.surrenderAdvancedHand(state, 1, 'round-1/seat-1').state).toBe(state);
    expect(state.game.round?.players[0].outcomeReason).toBe('DEALER_NATURAL');
  });
  it('requires explicit natural exclusion before surrender', () => {
    const start = advancedTable(['10', 'A', '6', '5']);
    const state = { ...start, game: { ...start.game, round: { ...start.game.round!, dealerNaturalExcluded: false } } };
    expect(advanced.surrenderAdvancedHand(state, 1, currentId(state))).toEqual({ ok: false, state, error: 'SURRENDER_NOT_ALLOWED' });
  });
  it('rejects surrender on either Split-Ace child', () => {
    const start = advancedTable(['A', '10', 'A', '7', 'A', 'K']);
    const state = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    for (const hand of state.game.round!.players) {
      expect(advanced.surrenderAdvancedHand(state, 1, hand.handId).ok).toBe(false);
      expect(advanced.surrenderAdvancedHand(state, 1, hand.handId).state).toBe(state);
    }
  });
  it.each([['2', 'DEALER_WIN', 0, 2000], ['9', 'PUSH', 200, 2200]] as const)(
    'settles mixed split win and %s independently with no parent entry', (secondCard, secondOutcome, secondGross, final) => {
      const start = advancedTable(['8', '10', '8', '7', 'K', secondCard]);
      const split = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
      const next = accepted(advanced.standAdvancedHand(split, 1, currentId(split)));
      const stood = accepted(advanced.standAdvancedHand(next, 1, currentId(next)));
      const done = accepted(advanced.advanceAdvancedTable(stood));
      expect(done.bankrolls[0]).toEqual({ available: 1600, reserved: 400 });
      const paid = accepted(advanced.settleAdvancedWagers(done));
      expect(paid.results.map((entry) => [entry.handId, entry.stakeUnits, entry.outcome, entry.grossReturnUnits, entry.netUnits]))
        .toEqual([['round-1/seat-1.1', 200, 'PLAYER_WIN', 400, 200],
          ['round-1/seat-1.2', 200, secondOutcome, secondGross, secondGross - 200]]);
      expect(paid.bankrolls[0]).toEqual({ available: final, reserved: 0 });
      expect(paid.results.some((entry) => entry.handId === currentId(start))).toBe(false);
    });
  it('settles a doubled split leaf using 400 units and its sibling using 200', () => {
    const start = advancedTable(['8', '10', '8', '7', '3', '10', '9']);
    const split = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    const doubled = accepted(advanced.doubleAdvancedHand(split, 1, currentId(split)));
    const done = accepted(advanced.advanceAdvancedTable(accepted(advanced.standAdvancedHand(doubled, 1, currentId(doubled)))));
    expect(done.bankrolls[0].available).toBe(1400);
    const paid = accepted(advanced.settleAdvancedWagers(done));
    expect(paid.results.map((entry) => [entry.stakeUnits, entry.outcome, entry.grossReturnUnits]))
      .toEqual([[400, 'PLAYER_WIN', 800], [200, 'PUSH', 200]]);
    expect(paid.bankrolls[0]).toEqual({ available: 2400, reserved: 0 });
  });
  it('surrender remains pending through another seat and retains its half loss at final comparison', () => {
    const start = advancedTable(['10', '10', '6', '6', '8', '10', '2'], [seat(1, 'HUMAN'), seat(4)]);
    const surrendered = accepted(advanced.surrenderAdvancedHand(start, 1, currentId(start)));
    expect(surrendered.game.round?.currentSeat).toBe(4);
    expect(surrendered.bankrolls[0]).toEqual({ available: 1800, reserved: 200 });
    const done = accepted(advanced.advanceAdvancedTable(surrendered));
    expect(done.game.round?.dealerCards.map((card) => card.rank)).toEqual(['6', '10', '2']);
    const paid = accepted(advanced.settleAdvancedWagers(done));
    expect(paid.results.map((entry) => [entry.outcome, entry.grossReturnUnits])).toEqual([['SURRENDERED', 100], ['PUSH', 200]]);
    expect(paid.bankrolls[0].available).toBe(1900);
    expect(paid.bankrolls[3].available).toBe(2000);
  });
  it('Natural plus surrender requires no dealer draw even below 17', () => {
    const start = advancedTable(['10', 'A', '6', '6', 'K', '5'], [seat(1, 'HUMAN'), seat(4)]);
    const surrendered = accepted(advanced.surrenderAdvancedHand(start, 1, currentId(start)));
    const draw = vi.spyOn(shoe, 'drawCard');
    const done = accepted(advanced.advanceAdvancedTable(surrendered));
    expect(draw).not.toHaveBeenCalled();
    expect(done.game.round?.dealerCards.map((card) => card.rank)).toEqual(['6', '5']);
    expect(accepted(advanced.settleAdvancedWagers(done)).results.map((entry) => entry.outcome)).toEqual(['SURRENDERED', 'PLAYER_BLACKJACK']);
  });
  it('commits every leaf once and rejects repeat settlement, refund and actions', () => {
    const start = advancedTable(['A', '10', 'A', '7', 'K', '9']);
    const split = accepted(advanced.splitAdvancedHand(start, 1, currentId(start)));
    const paid = accepted(advanced.settleAdvancedWagers(accepted(advanced.advanceAdvancedTable(split))));
    const before = structuredClone(paid);
    freezeDeep(paid);
    for (let repeat = 0; repeat < 2; repeat++) {
      for (const result of [advanced.settleAdvancedWagers(paid), advanced.voidAdvancedRound(paid),
        advanced.surrenderAdvancedHand(paid, 1, 'round-1/seat-1.1')]) {
        expect(result.ok).toBe(false);
        expect(result.state).toBe(paid);
      }
    }
    expect(paid).toEqual(before);
    expect(paid.results).toHaveLength(2);
    expect(paid.results.reduce((sum, entry) => sum + entry.netUnits, 0)).toBe(400);
  });
});
