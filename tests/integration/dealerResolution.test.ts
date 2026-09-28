import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { Rank } from '../../src/domain/card.js';
import { hit, stand, startRound, resolveDealer, type GameState } from '../../src/domain/game.js';
import { getPublicView } from '../../src/domain/publicView.js';
import * as shoeModule from '../../src/domain/shoe.js';
import { expectAccounting, orderedShoe } from '../helpers/shoeFixture.js';

const noRandom = { nextInt: () => { throw new Error('Unexpected RNG'); } };
function start(ranks: readonly Rank[]) {
  return startRound({ shoe: orderedShoe(ranks), round: null }, 'round', 'unused', noRandom).state;
}
beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Uncontrolled RNG'); }); });
afterEach(() => vi.restoreAllMocks());

test.each([
  [['10', '10', '8', '6', '2'], ['10', '6', '2'], 'PUSH', 'EQUAL_TOTAL'],
  [['10', 'A', '8', '5', '2'], ['A', '5', '2'], 'PUSH', 'EQUAL_TOTAL'],
  [['10', '10', '8', '7'], ['10', '7'], 'PLAYER_WIN', 'HIGHER_TOTAL'],
  [['10', 'A', '8', '6'], ['A', '6'], 'PLAYER_WIN', 'HIGHER_TOTAL'],
  [['10', '10', '8', '6', 'K'], ['10', '6', 'K'], 'PLAYER_WIN', 'DEALER_BUST'],
  [['10', '10', '10', '9'], ['10', '9'], 'PLAYER_WIN', 'HIGHER_TOTAL'],
  [['10', '10', '9', '10'], ['10', '10'], 'DEALER_WIN', 'LOWER_TOTAL'],
  [['10', '10', '10', '10'], ['10', '10'], 'PUSH', 'EQUAL_TOTAL'],
  [['10', '2', '8', '3', '4', '8'], ['2', '3', '4', '8'], 'PLAYER_WIN', 'HIGHER_TOTAL'],
] as const)('dealer sequence %j resolves with exact cards %j and %s/%s', (ranks, expected, outcome, reason) => {
  const input = stand(start(ranks)).state;
  const snapshot = structuredClone(input);
  const draw = vi.spyOn(shoeModule, 'drawCard');
  const result = resolveDealer(input);
  expect(result.ok).toBe(true);
  const next = result.state;
  expect(next.round?.dealerCards.map((card) => card.rank)).toEqual(expected);
  expect(next.round?.playerCards).toBe(input.round?.playerCards);
  expect(next.round?.phase).toBe('ROUND_COMPLETE');
  expect(next.round?.outcome).toBe(outcome);
  expect(next.round?.outcomeReason).toBe(reason);
  expect(draw).toHaveBeenCalledTimes(expected.length - 2);
  expect(next.shoe.available).toHaveLength(310 - expected.length);
  expect(next.shoe.inPlay).toHaveLength(0);
  expect(next.shoe.discarded).toEqual([...input.shoe.inPlay, ...input.shoe.available.slice(0, expected.length - 2)]);
  expectAccounting(next.shoe);
  expect(input).toEqual(snapshot);
  expect(getPublicView(next).round?.dealer.visibleCards.map((card) => card.rank)).toEqual(expected);
  expect(getPublicView(next).round?.dealer.holeCard?.rank).toBe(expected[1]);
  const terminal = structuredClone(next);
  for (const command of [hit, stand, resolveDealer]) {
    expect(command(next)).toEqual({ ok: false, state: next, error: 'ROUND_ALREADY_TERMINAL' });
    expect(command(next).state).toBe(next);
  }
  expect(next).toEqual(terminal);
  expect(draw).toHaveBeenCalledTimes(expected.length - 2);
});

test('three-card player 21 resolves as ordinary win, never PLAYER_BLACKJACK', () => {
  const ready = hit(start(['10', '10', '5', '7', '6'])).state;
  expect(ready.round?.phase).toBe('DEALER_TURN');
  const done = resolveDealer(ready).state;
  expect(done.round?.outcome).toBe('PLAYER_WIN');
  expect(done.round?.outcomeReason).toBe('HIGHER_TOTAL');
});

test('dealer resolution rejects no round, player turn, bust, naturals and integrity states without a draw', () => {
  const active = start(['10', '10', '8', '6', '7']);
  const bust = hit(active).state;
  const natural = start(['A', '7', 'K', '7', '7']);
  const dealerNatural = start(['10', 'A', '9', 'K']);
  const both = start(['A', 'A', 'K', 'K']);
  const integrity: GameState = { ...active, round: { ...active.round!, phase: 'INTEGRITY_ERROR',
    integrityError: 'SHOE_EXHAUSTED_DURING_ROUND' } };
  const states = [
    [{ shoe: active.shoe, round: null }, 'NO_ROUND'], [active, 'WRONG_PHASE'],
    [bust, 'ROUND_ALREADY_TERMINAL'], [natural, 'ROUND_ALREADY_TERMINAL'],
    [dealerNatural, 'ROUND_ALREADY_TERMINAL'], [both, 'ROUND_ALREADY_TERMINAL'],
    [integrity, 'ROUND_ALREADY_TERMINAL'],
  ] as const;
  const draw = vi.spyOn(shoeModule, 'drawCard');
  for (const [state, error] of states) {
    const snapshot = structuredClone(state);
    expect(resolveDealer(state)).toEqual({ ok: false, state, error });
    expect(resolveDealer(state).state).toBe(state);
    expect(state).toEqual(snapshot);
  }
  expect(draw).not.toHaveBeenCalled();
  expect(bust.round?.outcome).toBe('DEALER_WIN');
  expect(natural.round?.outcome).toBe('PLAYER_BLACKJACK');
});

test.each([0, 1])('dealer exhaustion after %i draws preserves partial hand and retires shoe', (successes) => {
  const active = stand(start(['10', '2', '8', '3', '4'])).state;
  const input = { ...active, shoe: { ...active.shoe,
    available: active.shoe.available.slice(0, successes),
    discarded: [...active.shoe.discarded, ...active.shoe.available.slice(successes)],
  } };
  const snapshot = structuredClone(input);
  const result = resolveDealer(input);
  expect(result.ok).toBe(true);
  const failed = result.state;
  expect(failed.round?.phase).toBe('INTEGRITY_ERROR');
  expect(failed.round?.integrityError).toBe('SHOE_EXHAUSTED_DURING_ROUND');
  expect(failed.round).not.toHaveProperty('outcome');
  expect(failed.round?.dealerCards.map((card) => card.rank)).toEqual(successes ? ['2', '3', '4'] : ['2', '3']);
  expect(failed.shoe.retired).toBe(true);
  expect(failed.shoe.shoeId).toBe('fixture');
  expect(failed.shoe.inPlay).toHaveLength(4 + successes);
  expectAccounting(failed.shoe);
  expect(input).toEqual(snapshot);
  expect(resolveDealer(failed).ok).toBe(false);
  expect(getPublicView(failed).round?.dealer.holeCard).toBeNull();
});
