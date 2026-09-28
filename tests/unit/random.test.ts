import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createSixDeckInventory, type PhysicalCard } from '../../src/domain/card.js';
import { mathRandomSource, shuffleCards } from '../../src/domain/random.js';
import { selectCutPosition } from '../../src/domain/shoe.js';

// Test-only scripted source: no seed/replay product API or random fallback.
function scriptedRandom(values: readonly number[]) {
  let index = 0;
  return {
    nextInt: vi.fn((): number => {
      if (index >= values.length) throw new Error('Scripted randomness exhausted');
      return values[index++];
    }),
  };
}

const sample: readonly PhysicalCard[] = Object.freeze([
  { id: 'A', deckIndex: 1, suit: 'clubs', rank: 'A' },
  { id: 'B', deckIndex: 1, suit: 'clubs', rank: '2' },
  { id: 'C', deckIndex: 1, suit: 'clubs', rank: '3' },
  { id: 'D', deckIndex: 1, suit: 'clubs', rank: '4' },
]);

beforeEach(() => {
  vi.spyOn(Math, 'random').mockImplementation(() => {
    throw new Error('Unexpected uncontrolled randomness');
  });
});
afterEach(() => vi.restoreAllMocks());

test('production adapter maps controlled Math.random values to bounded integers', () => {
  for (const [bound, midpoint] of [[1, 0], [2, 1], [31, 15], [312, 156]]) {
    vi.mocked(Math.random)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(1 - Number.EPSILON);
    expect(mathRandomSource.nextInt(bound)).toBe(0);
    expect(mathRandomSource.nextInt(bound)).toBe(midpoint);
    expect(mathRandomSource.nextInt(bound)).toBe(bound - 1);
  }
  expect(Math.random).toHaveBeenCalledTimes(12);
});

test('production adapter rejects invalid bounds before consuming randomness', () => {
  for (const bound of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    expect(() => mathRandomSource.nextInt(bound)).toThrow('positive safe integer');
  }
  expect(Math.random).not.toHaveBeenCalled();
});

test('scripted shuffle and cut consume exact bounds and repeat explicit results', () => {
  for (let run = 0; run < 2; run++) {
    const random = scriptedRandom([1, 0, 1, 30]);
    // ABCD -> ADCB -> CDAB -> CDAB; the fourth value selects the cut.
    expect(shuffleCards(sample, random).map((card) => card.id)).toEqual(['C', 'D', 'A', 'B']);
    expect(selectCutPosition(random)).toBe(249);
    expect(random.nextInt.mock.calls).toEqual([[4], [3], [2], [31]]);
  }
  expect(sample.map((card) => card.id)).toEqual(['A', 'B', 'C', 'D']);
});

test('empty and single-card shuffles copy the array without consuming randomness', () => {
  const random = scriptedRandom([]);
  for (const cards of [[], [sample[0]]]) {
    const result = shuffleCards(cards, random);
    expect(result).toEqual(cards);
    expect(result).not.toBe(cards);
  }
  expect(random.nextInt).not.toHaveBeenCalled();
});

test('six-deck shuffle preserves every physical card exactly once and leaves input intact', () => {
  const inventory = createSixDeckInventory();
  const snapshot = structuredClone(inventory);
  inventory.forEach(Object.freeze);
  Object.freeze(inventory);
  const random = scriptedRandom(Array.from({ length: 311 }, (_, index) => index % (312 - index)));
  const shuffled = shuffleCards(inventory, random);
  const originalIds = inventory.map((card) => card.id);

  expect(shuffled).toHaveLength(312);
  expect(new Set(shuffled.map((card) => card.id)).size).toBe(312);
  expect(new Set(shuffled.map((card) => card.id))).toEqual(new Set(originalIds));
  for (const card of inventory) {
    expect(shuffled.filter((candidate) => candidate.id === card.id)).toEqual([card]);
    expect(shuffled.find((candidate) => candidate.id === card.id)).toBe(card);
  }
  expect(shuffled).not.toBe(inventory);
  expect(inventory).toEqual(snapshot);
  expect(createSixDeckInventory()).toEqual(snapshot);
  expect(random.nextInt.mock.calls).toEqual(Array.from({ length: 311 }, (_, index) => [312 - index]));
});

test('invalid random indices fail fast without mutating input after a partial shuffle', () => {
  for (const invalid of [-1, 3, 0.5, NaN, Infinity]) {
    const random = scriptedRandom([0, invalid]);
    expect(() => shuffleCards(sample, random)).toThrow('RandomSource.nextInt(3)');
    expect(random.nextInt).toHaveBeenCalledTimes(2);
    expect(sample.map((card) => card.id)).toEqual(['A', 'B', 'C', 'D']);
  }
});

test('cut selection reaches the inclusive lower bound with exactly one call', () => {
  const random = scriptedRandom([0]);
  expect(selectCutPosition(random)).toBe(219);
  expect(random.nextInt.mock.calls).toEqual([[31]]);
});

test('cut selection reaches the inclusive upper bound with exactly one call', () => {
  const random = scriptedRandom([30]);
  expect(selectCutPosition(random)).toBe(249);
  expect(random.nextInt.mock.calls).toEqual([[31]]);
});

test('all 31 valid source results map to exactly the approved cut positions', () => {
  const random = scriptedRandom(Array.from({ length: 31 }, (_, index) => index));
  const positions = Array.from({ length: 31 }, () => selectCutPosition(random));
  expect(positions).toEqual([
    219, 220, 221, 222, 223, 224, 225, 226, 227, 228,
    229, 230, 231, 232, 233, 234, 235, 236, 237, 238,
    239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249,
  ]);
  expect(positions.every(Number.isInteger)).toBe(true);
  expect(positions).not.toContain(218);
  expect(positions).not.toContain(250);
  expect(random.nextInt.mock.calls).toEqual(Array.from({ length: 31 }, () => [31]));
});

test('invalid cut offsets, including those yielding 218/250, are rejected without retry', () => {
  for (const invalid of [-1, 31, 0.5, NaN, Infinity]) {
    const random = scriptedRandom([invalid]);
    expect(() => selectCutPosition(random)).toThrow('invalid cut offset');
    expect(random.nextInt).toHaveBeenCalledTimes(1);
  }
});
