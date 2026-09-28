import { expect } from 'vitest';
import { createSixDeckInventory, type Rank, type Suit } from '../../src/domain/card.js';
import type { ShoeState } from '../../src/domain/shoe.js';

// Test-only top-of-shoe fixture: positions cycle clubs/diamonds/hearts/spades.
export function orderedShoe(ranks: readonly Rank[]): ShoeState {
  const remaining = [...createSixDeckInventory()];
  const suits: readonly Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];
  const top = ranks.map((rank, index) => {
    const position = remaining.findIndex((card) => card.rank === rank && card.suit === suits[index % 4]);
    if (position < 0) throw new Error('Fixture requests an unavailable physical card');
    return remaining.splice(position, 1)[0];
  });
  const available = [...top, ...remaining];
  available.forEach(Object.freeze);
  const shoe: ShoeState = Object.freeze({
    shoeId: 'fixture', available: Object.freeze(available),
    inPlay: Object.freeze([]), discarded: Object.freeze([]),
    cutPosition: 219, reshufflePending: false, retired: false,
  });
  expectAccounting(shoe);
  return shoe;
}

export function expectAccounting(shoe: ShoeState) {
  const ids = [...shoe.available, ...shoe.inPlay, ...shoe.discarded].map((card) => card.id);
  const expected: string[] = [];
  for (const deck of [1, 2, 3, 4, 5, 6]) {
    for (const suit of ['clubs', 'diamonds', 'hearts', 'spades']) {
      for (const rank of ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']) {
        expected.push(`${deck}:${suit}:${rank}`);
      }
    }
  }
  expect(ids).toHaveLength(312);
  expect(new Set(ids).size).toBe(312);
  expect(new Set(ids)).toEqual(new Set(expected));
}
