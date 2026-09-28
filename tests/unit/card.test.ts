import { expect, test } from 'vitest';
import { createSixDeckInventory } from '../../src/domain/card.js';

// Independent rule facts; do not import the production enumeration lists.
const expectedSuits = ['clubs', 'diamonds', 'hearts', 'spades'];
const expectedRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

test('creates exactly 312 physical cards with 312 unique IDs', () => {
  const cards = createSixDeckInventory();

  expect(cards).toHaveLength(312);
  expect(new Set(cards.map((card) => card.id)).size).toBe(312);
});

test('contains exactly the four suits and thirteen ranks, with no Joker or extras', () => {
  const cards = createSixDeckInventory();

  expect(new Set(cards.map((card) => card.suit))).toEqual(new Set(expectedSuits));
  expect(new Set(cards.map((card) => card.rank))).toEqual(new Set(expectedRanks));
});

test('has six distinguishable copies of every rank/suit, one from each deck', () => {
  const cards = createSixDeckInventory();

  for (const suit of expectedSuits) {
    for (const rank of expectedRanks) {
      const copies = cards.filter((card) => card.suit === suit && card.rank === rank);

      expect(copies, `${suit}:${rank}`).toHaveLength(6);
      expect(new Set(copies.map((card) => card.id)).size).toBe(6);
      expect(new Set(copies.map((card) => card.deckIndex))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
    }
  }
});

test('contains exactly 52 different rank/suit combinations in each of six decks', () => {
  const cards = createSixDeckInventory();

  expect(new Set(cards.map((card) => card.deckIndex))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  for (const deckIndex of [1, 2, 3, 4, 5, 6]) {
    const deck = cards.filter((card) => card.deckIndex === deckIndex);

    expect(deck).toHaveLength(52);
    expect(new Set(deck.map((card) => `${card.suit}:${card.rank}`)).size).toBe(52);
  }
});

test('repeated creation matches the independently specified unshuffled order and IDs', () => {
  // Index arithmetic specifies the full order independently of the factory's loops.
  const expected = Array.from({ length: 312 }, (_, index) => {
    const deckIndex = Math.floor(index / 52) + 1;
    const suit = expectedSuits[Math.floor((index % 52) / 13)];
    const rank = expectedRanks[index % 13];

    return { id: `${deckIndex}:${suit}:${rank}`, deckIndex, suit, rank };
  });

  expect(createSixDeckInventory()).toEqual(expected);
  expect(createSixDeckInventory()).toEqual(expected);
});
