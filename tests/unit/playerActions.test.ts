import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { Rank } from '../../src/domain/card.js';
import { hit, stand, startRound, type CommandResult, type GameState } from '../../src/domain/game.js';
import * as hand from '../../src/domain/hand.js';
import * as shoeModule from '../../src/domain/shoe.js';
import { expectAccounting, orderedShoe } from '../helpers/shoeFixture.js';

const noRandom = { nextInt: () => { throw new Error('Unexpected randomness'); } };
function accepted(result: CommandResult): GameState {
  if (!result.ok) throw new Error(result.error);
  return result.state;
}
function initial(ranks: readonly Rank[]): GameState {
  return accepted(startRound({ shoe: orderedShoe(ranks), round: null }, 'round', 'unused', noRandom));
}
function frozen(state: GameState): GameState {
  if (state.round) {
    Object.freeze(state.round.playerCards);
    Object.freeze(state.round.dealerCards);
    Object.freeze(state.round);
  }
  Object.freeze(state.shoe.available);
  Object.freeze(state.shoe.inPlay);
  Object.freeze(state.shoe.discarded);
  Object.freeze(state.shoe);
  return Object.freeze(state);
}
beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Uncontrolled RNG'); }); });
afterEach(() => vi.restoreAllMocks());

test('Hit 10+5 with 3 moves exactly the next physical card and remains at player turn with 18', () => {
  const old = frozen(initial(['10', '9', '5', '7', '3']));
  const snapshot = structuredClone(old);
  const draw = vi.spyOn(shoeModule, 'drawCard');
  const natural = vi.spyOn(hand, 'isNaturalBlackjack');
  const next = accepted(hit(old));
  expect(draw).toHaveBeenCalledExactlyOnceWith(old.shoe);
  expect(natural).not.toHaveBeenCalled();
  expect(next.round?.playerCards.map((card) => card.id)).toEqual(['1:clubs:10', '1:hearts:5', '1:clubs:3']);
  expect(next.round?.playerCards[2]).toBe(old.shoe.available[0]);
  expect(next.round?.playerCards[0]).toBe(old.round?.playerCards[0]);
  expect(next.round?.dealerCards).toBe(old.round?.dealerCards);
  expect(hand.evaluateHand(next.round!.playerCards).total).toBe(18);
  expect(next.round?.phase).toBe('PLAYER_TURN');
  expect(next.round).not.toHaveProperty('outcome');
  expect(next.shoe.available).toHaveLength(307);
  expect(next.shoe.inPlay).toHaveLength(5);
  expect(next.shoe.discarded).toBe(old.shoe.discarded);
  expect(next.shoe.cutPosition).toBe(old.shoe.cutPosition);
  expect(old).toEqual(snapshot);
  expectAccounting(next.shoe);
});

test('repeated Hits preserve order/accounting: 5+5, then 3 and 4 gives 13 then 17', () => {
  const old = frozen(initial(['5', '9', '5', '7', '3', '4']));
  const first = frozen(accepted(hit(old)));
  const second = accepted(hit(first));
  expect(hand.evaluateHand(first.round!.playerCards).total).toBe(13);
  expect(hand.evaluateHand(second.round!.playerCards).total).toBe(17);
  expect(first.round?.phase).toBe('PLAYER_TURN');
  expect(second.round?.phase).toBe('PLAYER_TURN');
  expect(second.round?.playerCards.map((card) => card.rank)).toEqual(['5', '5', '3', '4']);
  expect(second.round?.dealerCards).toBe(old.round?.dealerCards);
  expect(second.shoe.available).toHaveLength(306);
  expect(second.shoe.inPlay).toHaveLength(6);
  expectAccounting(first.shoe);
  expectAccounting(second.shoe);
});

test('Hit to ordinary 21 ends player decisions without natural classification or final result', () => {
  const old = frozen(initial(['10', '9', '5', '7', '6']));
  const natural = vi.spyOn(hand, 'isNaturalBlackjack');
  const next = accepted(hit(old));
  expect(hand.evaluateHand(next.round!.playerCards).total).toBe(21);
  expect(next.round?.playerCards).toHaveLength(3);
  expect(next.round?.phase).toBe('DEALER_TURN');
  expect(next.round).not.toHaveProperty('outcome');
  expect(natural).not.toHaveBeenCalled();
  expect(next.shoe.inPlay).toHaveLength(5);
  expect(next.shoe.discarded).toHaveLength(0);
  expectAccounting(next.shoe);
});

test('player bust resolves immediately and discards all inPlay once without evaluating/drawing dealer', () => {
  const old = frozen(initial(['10', '9', '8', '7', '7']));
  const snapshot = structuredClone(old);
  const draw = vi.spyOn(shoeModule, 'drawCard');
  const evaluate = vi.spyOn(hand, 'evaluateHand');
  const next = accepted(hit(old));
  expect(next.round?.phase).toBe('ROUND_COMPLETE');
  expect(next.round?.outcome).toBe('DEALER_WIN');
  expect(next.round?.outcomeReason).toBe('PLAYER_BUST');
  expect(next.round?.playerCards.map((card) => card.rank)).toEqual(['10', '8', '7']);
  expect(evaluate).toHaveBeenCalledExactlyOnceWith(next.round?.playerCards);
  expect(draw).toHaveBeenCalledTimes(1);
  expect(next.round?.dealerCards).toBe(old.round?.dealerCards);
  expect(next.shoe.available).toHaveLength(307);
  expect(next.shoe.inPlay).toHaveLength(0);
  expect(next.shoe.discarded).toEqual([...old.shoe.inPlay, old.shoe.available[0]]);
  expect(old).toEqual(snapshot);
  expectAccounting(next.shoe);
});

test('Stand changes only phase, draws nothing, and does not resolve ordinary results', () => {
  const old = frozen(initial(['10', '9', '5', '7']));
  const snapshot = structuredClone(old);
  const draw = vi.spyOn(shoeModule, 'drawCard');
  const next = accepted(stand(old));
  expect(next.round).toEqual({ ...old.round, phase: 'DEALER_TURN' });
  expect(next.shoe).toBe(old.shoe);
  expect(next.round?.playerCards).toBe(old.round?.playerCards);
  expect(next.round?.dealerCards).toBe(old.round?.dealerCards);
  expect(next.round).not.toHaveProperty('outcome');
  expect(draw).not.toHaveBeenCalled();
  expect(old).toEqual(snapshot);
});

test.each([['Hit', hit], ['Stand', stand]] as const)('%s rejects absent, wrong-phase, natural, bust and integrity states unchanged', (_, action) => {
  const active = initial(['10', '9', '8', '7', '7']);
  const bust = accepted(hit(active));
  const dealer = accepted(stand(active));
  const natural = initial(['A', '9', 'K', '7']);
  if (!active.round) throw new Error('Expected round');
  const integrity: GameState = { ...active, round: { ...active.round,
    phase: 'INTEGRITY_ERROR', integrityError: 'SHOE_EXHAUSTED_DURING_ROUND',
  } };
  const flagged: GameState = { ...active, round: { ...active.round, integrityError: 'SHOE_RETIRED' } };
  const cases = [
    [{ shoe: active.shoe, round: null }, 'NO_ROUND'], [dealer, 'WRONG_PHASE'],
    [bust, 'ROUND_ALREADY_TERMINAL'], [natural, 'ROUND_ALREADY_TERMINAL'],
    [integrity, 'ROUND_ALREADY_TERMINAL'], [flagged, 'ROUND_ALREADY_TERMINAL'],
  ] as const;
  const draw = vi.spyOn(shoeModule, 'drawCard');
  for (const [state, error] of cases) {
    frozen(state);
    const snapshot = structuredClone(state);
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = action(state);
      expect(result).toEqual({ ok: false, state, error });
      expect(result.state).toBe(state);
      expect(state).toEqual(snapshot);
    }
  }
  expect(draw).not.toHaveBeenCalled();
});

test('startRound also rejects the newly reachable DEALER_TURN without consuming cards or RNG', () => {
  const state = frozen(accepted(stand(initial(['10', '9', '5', '7']))));
  expect(startRound(state, 'another', 'new-shoe', noRandom)).toEqual({
    ok: false, state, error: 'ROUND_ALREADY_ACTIVE',
  });
});

test('empty-shoe Hit enters integrity error with exact prior hands, retired shoe and no normal outcome', () => {
  const active = initial(['10', 'A', '5', '6']);
  // Accounting-valid exhaustion fault; move undealt cards out of available.
  const old = frozen({ ...active, shoe: { ...active.shoe, available: [],
    discarded: [...active.shoe.discarded, ...active.shoe.available],
  } });
  const snapshot = structuredClone(old);
  const draw = vi.spyOn(shoeModule, 'drawCard');
  const next = accepted(hit(old));
  expect(draw).toHaveBeenCalledExactlyOnceWith(old.shoe);
  expect(next.round?.phase).toBe('INTEGRITY_ERROR');
  expect(next.round?.integrityError).toBe('SHOE_EXHAUSTED_DURING_ROUND');
  expect(next.round).not.toHaveProperty('outcome');
  expect(next.round?.playerCards).toBe(old.round?.playerCards);
  expect(next.round?.dealerCards).toBe(old.round?.dealerCards);
  expect(next.shoe).toEqual({ ...old.shoe, retired: true });
  expect(next.shoe.shoeId).toBe(old.shoe.shoeId);
  expect(hit(next).ok).toBe(false);
  expect(stand(next).ok).toBe(false);
  expect(draw).toHaveBeenCalledTimes(1);
  expect(old).toEqual(snapshot);
  expectAccounting(next.shoe);
});
