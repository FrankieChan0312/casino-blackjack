import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createSixDeckInventory } from '../../src/domain/card.js';
import {
  completeShoeRound, createShoe, drawCard, prepareShoeForNextRound, type ShoeState,
} from '../../src/domain/shoe.js';

// Independent inventory facts, not a production accounting helper.
const expectedIds = new Set<string>();
for (const deck of [1, 2, 3, 4, 5, 6]) {
  for (const suit of ['clubs', 'diamonds', 'hearts', 'spades']) {
    for (const rank of ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']) {
      expectedIds.add(`${deck}:${suit}:${rank}`);
    }
  }
}

function expectAccounting(shoe: ShoeState) {
  const groups = [shoe.available, shoe.inPlay, shoe.discarded];
  const ids = groups.flat().map((card) => card.id);
  expect(ids).toHaveLength(312);
  expect(new Set(ids).size).toBe(312);
  expect(new Set(ids)).toEqual(expectedIds);
  for (let index = 0; index < groups.length; index++) {
    const others = new Set(groups.slice(index + 1).flat().map((card) => card.id));
    expect(groups[index].every((card) => !others.has(card.id))).toBe(true);
  }
  expect(312 - shoe.available.length).toBe(shoe.inPlay.length + shoe.discarded.length);
}

function freezeShoe(shoe: ShoeState): ShoeState {
  for (const cards of [shoe.available, shoe.inPlay, shoe.discarded]) {
    cards.forEach(Object.freeze);
    Object.freeze(cards);
  }
  return Object.freeze(shoe);
}

// Keep each Fisher-Yates card in place, then select the supplied cut offset.
function creationRandom(cutOffset = 0) {
  let calls = 0;
  return {
    nextInt: vi.fn((bound: number) => {
      calls++;
      if (calls <= 311) {
        expect(bound).toBe(313 - calls);
        return bound - 1;
      }
      if (calls !== 312) throw new Error('Unexpected extra randomness');
      expect(bound).toBe(31);
      return cutOffset;
    }),
  };
}

function drawSuccessfully(shoe: ShoeState): ShoeState {
  const result = drawCard(freezeShoe(shoe));
  if (!result.ok) throw new Error(result.error);
  return result.shoe;
}

// Accounting-valid fault fixtures isolate the minimum-card guard from cut policy.
// With 0..4 remaining, pending=false is deliberately not a naturally reached state.
function remainingFixture(remaining: number): ShoeState {
  const cards = createSixDeckInventory();
  return freezeShoe({
    shoeId: 'old', available: cards.slice(0, remaining), inPlay: [],
    discarded: cards.slice(remaining), cutPosition: 219,
    reshufflePending: false, retired: false,
  });
}

beforeEach(() => {
  vi.spyOn(Math, 'random').mockImplementation(() => {
    throw new Error('Unexpected uncontrolled randomness');
  });
});
afterEach(() => vi.restoreAllMocks());

test('fresh shoe uses inventory, shuffle and one cut selection with exact initial accounting', () => {
  const random = creationRandom(30);
  const shoe = createShoe('first', random);
  expect(shoe.shoeId).toBe('first');
  expect(shoe.available).toHaveLength(312);
  expect(shoe.inPlay).toEqual([]);
  expect(shoe.discarded).toEqual([]);
  expect(shoe.cutPosition).toBe(249);
  expect(shoe.reshufflePending).toBe(false);
  expect(shoe.retired).toBe(false);
  expect(shoe.available[0].id).toBe('1:clubs:A');
  expect(shoe.available[311].id).toBe('6:spades:K');
  expect(random.nextInt).toHaveBeenCalledTimes(312);
  expectAccounting(shoe);
});

test('draw moves the exact front card to inPlay and preserves the input snapshot', () => {
  const shoe = freezeShoe(createShoe('first', creationRandom()));
  const snapshot = structuredClone(shoe);
  const result = drawCard(shoe);
  if (!result.ok) throw new Error(result.error);
  expect(result.card).toBe(shoe.available[0]);
  expect(result.card.id).toBe('1:clubs:A');
  expect(result.shoe.available).toEqual(shoe.available.slice(1));
  expect(result.shoe.available).toHaveLength(311);
  expect(result.shoe.inPlay).toEqual([result.card]);
  expect(result.shoe.inPlay[0]).toBe(result.card);
  expect(result.shoe.discarded).toBe(shoe.discarded);
  expect(result.shoe).not.toBe(shoe);
  expect(shoe).toEqual(snapshot);
  expectAccounting(result.shoe);
});

test('every draw through exhaustion preserves all IDs, cut position and shoe identity', () => {
  const random = creationRandom();
  let shoe = createShoe('first', random);
  const originalCards = [...shoe.available];
  for (let count = 1; count <= 312; count++) {
    shoe = drawSuccessfully(shoe);
    expect(shoe.available).toHaveLength(312 - count);
    expect(shoe.inPlay).toHaveLength(count);
    expect(shoe.inPlay[count - 1]).toBe(originalCards[count - 1]);
    expect(shoe.discarded).toHaveLength(0);
    expect(shoe.shoeId).toBe('first');
    expect(shoe.cutPosition).toBe(219);
    expect(shoe.retired).toBe(false);
    expect(shoe.reshufflePending).toBe(count >= 219);
    expectAccounting(shoe);
  }
  expect(random.nextInt).toHaveBeenCalledTimes(312);
});

test('completion moves inPlay once, preserving discards and cut across two round boundaries', () => {
  let shoe = createShoe('first', creationRandom(30));
  const originalCards = [...shoe.available];
  for (let count = 0; count < 5; count++) shoe = drawSuccessfully(shoe);
  const before = freezeShoe(shoe);
  shoe = completeShoeRound(before);
  expect(before.inPlay).toHaveLength(5);
  expect(before.discarded).toHaveLength(0);
  expect(shoe.available).toHaveLength(307);
  expect(shoe.available).toBe(before.available);
  expect(shoe.inPlay).toEqual([]);
  expect(shoe.discarded).toEqual(originalCards.slice(0, 5));
  expect(completeShoeRound(freezeShoe(shoe))).toBe(shoe);
  const noRandom = { nextInt: vi.fn(() => { throw new Error('Must reuse shoe'); }) };
  expect(prepareShoeForNextRound(shoe, 'unused', noRandom)).toBe(shoe);
  shoe = drawSuccessfully(shoe);
  shoe = completeShoeRound(freezeShoe(shoe));
  expect(shoe.available).toHaveLength(306);
  expect(shoe.discarded).toEqual(originalCards.slice(0, 6));
  expect(shoe.inPlay).toEqual([]);
  expect(shoe.cutPosition).toBe(249);
  expect(shoe.shoeId).toBe('first');
  expect(prepareShoeForNextRound(shoe, 'unused', noRandom)).toBe(shoe);
  expect(noRandom.nextInt).not.toHaveBeenCalled();
  expectAccounting(shoe);
});

test('cut hit and crossing defer replacement until completion and next-round preparation', () => {
  let shoe = createShoe('old', creationRandom());
  for (let count = 0; count < 218; count++) shoe = drawSuccessfully(shoe);
  expect(shoe.available).toHaveLength(94);
  expect(shoe.reshufflePending).toBe(false);
  shoe = drawSuccessfully(shoe);
  expect(shoe.available).toHaveLength(93);
  expect(shoe.reshufflePending).toBe(true);
  shoe = drawSuccessfully(shoe);
  expect(shoe.available).toHaveLength(92);
  expect(shoe.reshufflePending).toBe(true);
  expect(shoe.shoeId).toBe('old');
  expect(shoe.retired).toBe(false);
  expect(shoe.cutPosition).toBe(219);
  expectAccounting(shoe);
  const random = creationRandom(30);
  expect(() => prepareShoeForNextRound(shoe, 'new', random)).toThrow('Complete in-play');
  expect(random.nextInt).not.toHaveBeenCalled();
  const closed = freezeShoe(completeShoeRound(shoe));
  expect(closed.discarded).toHaveLength(220);
  expect(closed.reshufflePending).toBe(true);
  expect(closed.retired).toBe(false);
  expectAccounting(closed);
  const next = prepareShoeForNextRound(closed, 'new', random);
  expect(next.shoeId).toBe('new');
  expect(next.cutPosition).toBe(249);
  expect(next.available).toHaveLength(312);
  expect(next.inPlay).toEqual([]);
  expect(next.discarded).toEqual([]);
  expect(next.reshufflePending).toBe(false);
  expect(next.retired).toBe(false);
  expect(closed.available).toHaveLength(92);
  expectAccounting(next);
});

test.each([0, 1, 2, 3])('pre-round guard replaces %i remaining cards before any deal', (remaining) => {
  const old = remainingFixture(remaining);
  expectAccounting(old);
  const next = prepareShoeForNextRound(old, 'new', creationRandom());
  expect(next.shoeId).toBe('new');
  expect(next.available).toHaveLength(312);
  expect(next.inPlay).toHaveLength(0);
  expect(next.discarded).toHaveLength(0);
  expect(old.available).toHaveLength(remaining);
  expectAccounting(next);
});

test('exactly four cards pass the minimum guard without promising a whole round cannot exhaust', () => {
  const old = remainingFixture(4);
  const random = { nextInt: vi.fn(() => { throw new Error('Must reuse shoe'); }) };
  let shoe = prepareShoeForNextRound(old, 'unused', random);
  expect(shoe).toBe(old);
  expect(random.nextInt).not.toHaveBeenCalled();
  for (let count = 0; count < 4; count++) shoe = drawSuccessfully(shoe);
  const result = drawCard(freezeShoe(shoe));
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('Expected exhaustion');
  expect(result.error).toBe('SHOE_EXHAUSTED_DURING_ROUND');
  expect(result.shoe.retired).toBe(true);
  expect(result).not.toHaveProperty('card');
  expect(result.shoe.shoeId).toBe('old');
  expect(result.shoe.available).toBe(shoe.available);
  expect(result.shoe.inPlay).toBe(shoe.inPlay);
  expect(result.shoe.discarded).toBe(shoe.discarded);
  expect(shoe.retired).toBe(false);
  expectAccounting(result.shoe);
  expect(drawCard(result.shoe)).toEqual({ ok: false, shoe: result.shoe, error: 'SHOE_RETIRED' });
  expect(() => completeShoeRound(result.shoe)).toThrow('retired');
  const next = prepareShoeForNextRound(freezeShoe(result.shoe), 'recovered', creationRandom(30));
  expect(next.shoeId).toBe('recovered');
  expect(next.available).toHaveLength(312);
  expect(next.inPlay).toEqual([]);
  expect(next.retired).toBe(false);
  expect(result.shoe.inPlay).toHaveLength(4);
  expectAccounting(next);
});

test('retirement alone blocks draws and forces replacement even with 312 available cards', () => {
  const retired = freezeShoe({ ...createShoe('old', creationRandom()), retired: true });
  const result = drawCard(retired);
  expect(result).toEqual({ ok: false, shoe: retired, error: 'SHOE_RETIRED' });
  expect(result.shoe).toBe(retired);
  const next = prepareShoeForNextRound(retired, 'new', creationRandom(30));
  expect(next.shoeId).toBe('new');
  expect(next.cutPosition).toBe(249);
  expect(next.retired).toBe(false);
  expectAccounting(next);
});

test('replacement is deterministic, uses shuffle, and requires a different ID before RNG use', () => {
  const old = remainingFixture(0);
  const unusedRandom = creationRandom();
  expect(() => prepareShoeForNextRound(old, 'old', unusedRandom)).toThrow('different shoeId');
  expect(unusedRandom.nextInt).not.toHaveBeenCalled();
  const makeRandom = () => ({ nextInt: vi.fn(() => 0) });
  const first = prepareShoeForNextRound(old, 'new', makeRandom());
  const second = prepareShoeForNextRound(old, 'new', makeRandom());
  expect(first).toEqual(second);
  // All-zero descending Fisher-Yates rotates the initial inventory left by one.
  expect(first.available.slice(0, 3).map((card) => card.id)).toEqual(['1:clubs:2', '1:clubs:3', '1:clubs:4']);
  expect(first.available[311].id).toBe('1:clubs:A');
  expect(first.cutPosition).toBe(219);
  expectAccounting(first);
});
