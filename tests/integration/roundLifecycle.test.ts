import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createGame, hit, stand, startRound, resolveDealer, type GameState } from '../../src/domain/game.js';
import { evaluateHand } from '../../src/domain/hand.js';
import { getPublicView } from '../../src/domain/publicView.js';
import { expectAccounting, orderedShoe } from '../helpers/shoeFixture.js';

const noRandom = { nextInt: () => { throw new Error('Existing shoe must not consume randomness'); } };
function start(state: GameState, id = 'round') {
  const result = startRound(state, id, 'replacement', noRandom);
  expect(result.ok).toBe(true);
  return result.state;
}
beforeEach(() => { vi.spyOn(Math, 'random').mockImplementation(() => { throw new Error('Uncontrolled RNG'); }); });
afterEach(() => vi.restoreAllMocks());

test.each([219, 249])('cut %i crossed by Hit, completed by dealer, replaced only before the next deal', (cut) => {
  const original = orderedShoe(['10', '10', '5', '6', '3', '2']);
  const availableCount = 312 - (cut - 5);
  const shoe = { ...original, cutPosition: cut, available: original.available.slice(0, availableCount),
    discarded: original.available.slice(availableCount) };
  const dealt = start({ shoe, round: null });
  expect(312 - dealt.shoe.available.length).toBe(cut - 1);
  expect(dealt.shoe.reshufflePending).toBe(false);
  expect(getPublicView(dealt).round?.dealer.holeCard).toBeNull();
  const crossed = hit(dealt).state;
  expect(312 - crossed.shoe.available.length).toBe(cut);
  expect(crossed.shoe.reshufflePending).toBe(true);
  const stood = stand(crossed).state;
  const done = resolveDealer(stood).state;
  expect(done.round?.outcome).toBe('PUSH');
  expect(done.round?.dealerCards.map((card) => card.rank)).toEqual(['10', '6', '2']);
  expect(done.shoe.inPlay).toHaveLength(0);
  expect(done.shoe.discarded).toHaveLength(cut + 1);
  for (const state of [dealt, crossed, stood, done]) {
    expect(state.shoe.shoeId).toBe('fixture');
    expect(state.shoe.cutPosition).toBe(cut);
    expectAccounting(state.shoe);
  }
  const snapshot = structuredClone(done);
  const random = { nextInt: vi.fn((bound: number) => bound - 1) };
  const next = startRound(done, 'next', 'new-shoe', random).state;
  expect(next.shoe.shoeId).toBe('new-shoe');
  expect(next.shoe.cutPosition).toBe(249);
  expect(next.shoe.available).toHaveLength(308);
  expect(next.shoe.discarded).toHaveLength(0);
  expect(next.round?.playerCards.map((card) => card.id)).toEqual(['1:clubs:A', '1:clubs:3']);
  expect(random.nextInt).toHaveBeenCalledTimes(312);
  expectAccounting(next.shoe);
  expect(done).toEqual(snapshot);
});

test('two full ordinary rounds reuse shoe/cut, consume later cards and retain terminal snapshots', () => {
  const initial = { shoe: orderedShoe(['10', '10', '5', '6', '3', '2', '10', 'A', '9', '6']), round: null };
  const first = resolveDealer(stand(hit(start(initial)).state).state).state;
  const snapshot = structuredClone(first);
  expect(first.round?.outcome).toBe('PUSH');
  expect(first.shoe.discarded).toHaveLength(6);
  const next = start(first, 'second');
  expect(next.round?.playerCards.map((card) => card.rank)).toEqual(['10', '9']);
  expect(next.round?.dealerCards.map((card) => card.rank)).toEqual(['A', '6']);
  expect(next.shoe.available).toHaveLength(302);
  expect(next.shoe.discarded).toHaveLength(6);
  expect(next.shoe.inPlay).toHaveLength(4);
  const second = resolveDealer(stand(next).state).state;
  expect(second.round?.outcome).toBe('PLAYER_WIN');
  expect(second.shoe.discarded).toHaveLength(10);
  expect(second.shoe.available).toHaveLength(302);
  for (const state of [first, next, second]) {
    expect(state.shoe.shoeId).toBe('fixture');
    expect(state.shoe.cutPosition).toBe(219);
    expectAccounting(state.shoe);
  }
  expect(first).toEqual(snapshot);
});

test.each([0, 1, 2, 3, 4])('initial deal boundary with %i remaining cards', (remaining) => {
  const original = orderedShoe(['10', '10', '8', '7']);
  // Isolate pre-deal guard: pending=false is an accounting-valid fault fixture.
  const shoe = { ...original, available: original.available.slice(0, remaining), discarded: original.available.slice(remaining) };
  const random = { nextInt: vi.fn((bound: number) => bound - 1) };
  const next = startRound({ shoe, round: null }, 'round', 'replacement', random).state;
  expect(next.round?.phase).toBe('PLAYER_TURN');
  expect(next.shoe.shoeId).toBe(remaining === 4 ? 'fixture' : 'replacement');
  expect(next.shoe.available).toHaveLength(remaining === 4 ? 0 : 308);
  expect(random.nextInt).toHaveBeenCalledTimes(remaining === 4 ? 0 : 312);
  expect(next.round?.playerCards.map((card) => card.rank)).toEqual(remaining === 4 ? ['10', '8'] : ['A', '3']);
  expectAccounting(next.shoe);
});

test('repeated controlled creation/deal has explicit identities and cut, not only equal generated output', () => {
  const states: GameState[] = [];
  for (let run = 0; run < 2; run++) {
    const random = { nextInt: vi.fn((bound: number) => bound - 1) };
    const state = start(createGame('repeat', random));
    expect(state.round?.playerCards.map((card) => card.id)).toEqual(['1:clubs:A', '1:clubs:3']);
    expect(state.round?.dealerCards.map((card) => card.id)).toEqual(['1:clubs:2', '1:clubs:4']);
    expect(state.shoe.cutPosition).toBe(249);
    expect(state.round?.phase).toBe('PLAYER_TURN');
    expect(random.nextInt).toHaveBeenCalledTimes(312);
    states.push(state);
  }
  expect(states[0]).toEqual(states[1]);
});

test('natural remains PLAYER_BLACKJACK even when the next dealer card would make three-card 21', () => {
  const natural = start({ shoe: orderedShoe(['A', '7', 'K', '7', '7']), round: null });
  expect(evaluateHand([...natural.round!.dealerCards, natural.shoe.available[0]]).total).toBe(21);
  const snapshot = structuredClone(natural);
  expect(natural.round?.outcome).toBe('PLAYER_BLACKJACK');
  for (const command of [hit, stand, resolveDealer]) {
    expect(command(natural).ok).toBe(false);
    expect(command(natural).state).toBe(natural);
  }
  expect(natural).toEqual(snapshot);
  expect(natural.shoe.available).toHaveLength(308);
  expect(natural.round?.dealerCards).toHaveLength(2);
  expectAccounting(natural.shoe);
});

test('dealer integrity failure blocks all actions and forces replacement before later play', () => {
  const shoe = orderedShoe(['10', '2', '8', '3']);
  const depleted = { ...shoe, available: shoe.available.slice(0, 4), discarded: shoe.available.slice(4) };
  const failed = resolveDealer(stand(start({ shoe: depleted, round: null })).state).state;
  const snapshot = structuredClone(failed);
  expect(failed.round?.phase).toBe('INTEGRITY_ERROR');
  expect(failed.round?.outcome).toBeUndefined();
  for (const command of [hit, stand, resolveDealer]) expect(command(failed).ok).toBe(false);
  const recovered = startRound(failed, 'recovered', 'replacement', { nextInt: (bound) => bound - 1 }).state;
  expect(recovered.shoe.shoeId).toBe('replacement');
  expect(recovered.shoe.retired).toBe(false);
  expect(recovered.shoe.available).toHaveLength(308);
  expect(failed).toEqual(snapshot);
  expectAccounting(failed.shoe);
  expectAccounting(recovered.shoe);
});
