import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createGame, startRound, type GameState } from '../../src/domain/game.js';
import * as hand from '../../src/domain/hand.js';
import * as shoeModule from '../../src/domain/shoe.js';
import { expectAccounting, orderedShoe } from '../helpers/shoeFixture.js';

const noRandom = { nextInt: () => { throw new Error('Unexpected randomness'); } };
function start(state: GameState, id = 'round-1'): GameState {
  const result = startRound(state, id, 'replacement', noRandom);
  if (!result.ok) throw new Error(result.error);
  return result.state;
}
beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Uncontrolled RNG'); }); });
afterEach(() => vi.restoreAllMocks());

test('createGame starts with a complete shoe and no round', () => {
  const state = createGame('first', { nextInt: (bound) => bound - 1 });
  expect(state.round).toBeNull();
  expect(state.shoe.shoeId).toBe('first');
  expect(state.shoe.cutPosition).toBe(249);
  expect(state.shoe.available).toHaveLength(312);
  expectAccounting(state.shoe);
});

test('initial deal is exactly P1/upcard/P2/hole with no input mutation or ordinary comparison', () => {
  const input = Object.freeze({ shoe: orderedShoe(['10', '9', '8', '7']), round: null });
  const snapshot = structuredClone(input);
  const draw = vi.spyOn(shoeModule, 'drawCard');
  const state = start(input);
  expect(draw).toHaveBeenCalledTimes(4);
  expect(state.round?.playerCards.map((card) => card.id)).toEqual(['1:clubs:10', '1:hearts:8']);
  expect(state.round?.dealerCards.map((card) => card.id)).toEqual(['1:diamonds:9', '1:spades:7']);
  expect(state.round?.playerCards[0]).toBe(input.shoe.available[0]);
  expect(state.round?.dealerCards[1]).toBe(input.shoe.available[3]);
  expect(state.round?.phase).toBe('PLAYER_TURN');
  expect(state.round).not.toHaveProperty('outcome');
  expect(state.shoe.available).toHaveLength(308);
  expect(state.shoe.inPlay).toEqual(input.shoe.available.slice(0, 4));
  expect(state.shoe.discarded).toHaveLength(0);
  expect(state.shoe.shoeId).toBe('fixture');
  expect(input).toEqual(snapshot);
  expectAccounting(state.shoe);
});

test.each([
  [['A', '7', 'K', '7'], 'PLAYER_BLACKJACK', 'PLAYER_NATURAL'],
  [['10', 'A', '9', 'K'], 'DEALER_WIN', 'DEALER_NATURAL'],
  [['A', 'A', 'K', 'Q'], 'PUSH', 'BOTH_NATURAL'],
] as const)('initial natural matrix %j resolves %s without further draws', (ranks, outcome, reason) => {
  const input = { shoe: orderedShoe(ranks), round: null };
  const draw = vi.spyOn(shoeModule, 'drawCard');
  const state = start(input);
  expect(state.round?.phase).toBe('ROUND_COMPLETE');
  expect(state.round?.outcome).toBe(outcome);
  expect(state.round?.outcomeReason).toBe(reason);
  expect(draw).toHaveBeenCalledTimes(4);
  expect(state.shoe.available).toHaveLength(308);
  expect(state.shoe.inPlay).toHaveLength(0);
  expect(state.shoe.discarded).toEqual(input.shoe.available.slice(0, 4));
  expectAccounting(state.shoe);
});

test.each(['A', '10', 'J', 'Q', 'K'] as const)('upcard %s peeks for both positive and negative cases', (upcard) => {
  for (const hole of [upcard === 'A' ? 'K' : 'A', '6'] as const) {
    const classify = vi.spyOn(hand, 'isNaturalBlackjack');
    classify.mockClear();
    const state = start({ shoe: orderedShoe(['10', upcard, '9', hole]), round: null });
    expect(classify).toHaveBeenCalledTimes(2);
    expect(classify).toHaveBeenNthCalledWith(1, state.round?.playerCards, true);
    expect(classify).toHaveBeenNthCalledWith(2, state.round?.dealerCards, true);
    expect(state.round?.phase).toBe(hole === '6' ? 'PLAYER_TURN' : 'ROUND_COMPLETE');
    expect(state.round?.outcome).toBe(hole === '6' ? undefined : 'DEALER_WIN');
  }
});

test.each(['2', '3', '4', '5', '6', '7', '8', '9'] as const)('upcard %s does not peek', (upcard) => {
  const classify = vi.spyOn(hand, 'isNaturalBlackjack');
  const state = start({ shoe: orderedShoe(['10', upcard, '9', 'A']), round: null });
  expect(classify).toHaveBeenCalledExactlyOnceWith(state.round?.playerCards, true);
  expect(state.round?.phase).toBe('PLAYER_TURN');
  expect(state.round).not.toHaveProperty('outcome');
});

test('a second start while active is rejected without draws or state changes', () => {
  const state = start({ shoe: orderedShoe(['10', '9', '8', '7']), round: null });
  const draw = vi.spyOn(shoeModule, 'drawCard');
  expect(startRound(state, 'another', 'replacement', noRandom)).toEqual({
    ok: false, state, error: 'ROUND_ALREADY_ACTIVE',
  });
  expect(startRound(state, 'another', 'replacement', noRandom).state).toBe(state);
  expect(draw).not.toHaveBeenCalled();
});

test('next start reuses a healthy terminal shoe and leaves the prior round snapshot intact', () => {
  const first = start({ shoe: orderedShoe(['A', '7', 'K', '7', '10', '9', '8', '6']), round: null });
  const snapshot = structuredClone(first);
  const second = start(first, 'round-2');
  expect(second.round?.roundId).toBe('round-2');
  expect(second.round?.phase).toBe('PLAYER_TURN');
  expect(second.round?.playerCards.map((card) => card.rank)).toEqual(['10', '8']);
  expect(second.shoe.available).toHaveLength(304);
  expect(second.shoe.inPlay).toHaveLength(4);
  expect(second.shoe.discarded).toHaveLength(4);
  expect(second.shoe.shoeId).toBe(first.shoe.shoeId);
  expect(second.shoe.cutPosition).toBe(first.shoe.cutPosition);
  expect(first).toEqual(snapshot);
  expectAccounting(second.shoe);
});

test.each(['pending', 'retired', 'insufficient'] as const)('start prepares a replacement for %s before dealing', (condition) => {
  const original = orderedShoe([]);
  const shoe = condition === 'insufficient'
    ? { ...original, available: original.available.slice(0, 3), discarded: original.available.slice(3) }
    : { ...original, reshufflePending: condition === 'pending', retired: condition === 'retired' };
  const random = { nextInt: vi.fn((bound: number) => bound - 1) };
  const result = startRound({ shoe, round: null }, 'new-round', 'new-shoe', random);
  expect(result.ok).toBe(true);
  expect(result.state.shoe.shoeId).toBe('new-shoe');
  expect(result.state.shoe.cutPosition).toBe(249);
  expect(result.state.shoe.available).toHaveLength(308);
  expect(result.state.round?.playerCards.map((card) => card.id)).toEqual(['1:clubs:A', '1:clubs:3']);
  expect(random.nextInt).toHaveBeenCalledTimes(312);
  expectAccounting(result.state.shoe);
});

test.each([0, 1, 2, 3])('integrity failure after %i draws stops dealing, retires shoe and preserves partial cards', (successes) => {
  const input = { shoe: orderedShoe(['10', 'A', '9', '6']), round: null };
  const realDraw = shoeModule.drawCard;
  let calls = 0;
  const draw = vi.spyOn(shoeModule, 'drawCard').mockImplementation((shoe) => {
    if (calls++ < successes) return realDraw(shoe);
    // Fault injection after pre-deal guard: account remaining cards as discarded,
    // then let the real draw operation return the empty-shoe integrity failure.
    return realDraw({ ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] });
  });
  const state = start(input);
  expect(draw).toHaveBeenCalledTimes(successes + 1);
  expect(state.round?.phase).toBe('INTEGRITY_ERROR');
  expect(state.round?.integrityError).toBe('SHOE_EXHAUSTED_DURING_ROUND');
  expect(state.round).not.toHaveProperty('outcome');
  expect(state.round?.playerCards).toEqual(input.shoe.available.slice(0, successes).filter((_, i) => i % 2 === 0));
  expect(state.round?.dealerCards).toEqual(input.shoe.available.slice(0, successes).filter((_, i) => i % 2 === 1));
  expect(state.shoe.inPlay).toHaveLength(successes);
  expect(state.shoe.retired).toBe(true);
  expect(state.shoe.shoeId).toBe('fixture');
  expectAccounting(state.shoe);
  draw.mockRestore();
  const recovered = startRound(state, 'recovered', 'replacement', { nextInt: (bound) => bound - 1 });
  expect(recovered.state.shoe.shoeId).toBe('replacement');
  expect(recovered.state.shoe.retired).toBe(false);
  expect(state.shoe.retired).toBe(true);
});
