import { expect, test } from 'vitest';
import type { PhysicalCard, Rank } from '../../src/domain/card.js';
import { evaluateHand, isNaturalBlackjack } from '../../src/domain/hand.js';
import { createShoe } from '../../src/domain/shoe.js';

function hand(ranks: readonly Rank[]): readonly PhysicalCard[] {
  return Object.freeze(ranks.map((rank, index): PhysicalCard => Object.freeze({
    id: `${index + 1}:clubs:${rank}`, deckIndex: index + 1, suit: 'clubs', rank,
  })));
}

test('every supported rank has its explicit single-card value', () => {
  const values: readonly [Rank, number][] = [
    ['A', 11], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7],
    ['8', 8], ['9', 9], ['10', 10], ['J', 10], ['Q', 10], ['K', 10],
  ];
  for (const [rank, total] of values) {
    expect(evaluateHand(hand([rank])).total).toBe(total);
  }
});

// Independent expected totals and flags from R05, including all required cases.
const evaluations: readonly (readonly [readonly Rank[], number, boolean, boolean, boolean])[] = [
  [[], 0, false, false, false],
  [['2', '3'], 5, false, false, false],
  [['10', 'J'], 20, false, false, false],
  [['Q', 'K'], 20, false, false, false],
  [['A', '9'], 20, true, false, false],
  [['A', '9', '5'], 15, false, false, false],
  [['A', 'K'], 21, true, false, true],
  [['A', 'A'], 12, true, false, false],
  [['A', 'A', '9'], 21, true, false, true],
  [['A', 'A', '9', '9'], 20, false, false, false],
  [['A', 'A', 'A', '8'], 21, true, false, true],
  [['A', '6'], 17, true, false, false],
  [['A', '6', '10'], 17, false, false, false],
  [['A', 'A', '5'], 17, true, false, false],
  [['A', 'A', '5', '10'], 17, false, false, false],
  [['10', '8', '7'], 25, false, true, false],
  [['K', 'Q', '2'], 22, false, true, false],
  [['A', 'A', 'K', 'Q'], 22, false, true, false],
  [['A', '5', '5'], 21, true, false, true],
  [['7', '7', '7'], 21, false, false, true],
  [['10', '5', '6'], 21, false, false, true],
];

test.each(evaluations)('evaluates %j as total %i with explicit soft/bust/21 flags',
  (ranks, total, isSoft, isBust, isTwentyOne) => {
    expect(evaluateHand(hand(ranks))).toEqual({ total, isSoft, isBust, isTwentyOne });
    expect(evaluateHand(hand([...ranks].reverse()))).toEqual({ total, isSoft, isBust, isTwentyOne });
  });

test.each(['10', 'J', 'Q', 'K'] as const)('Ace plus %s is natural only with original-hand eligibility',
  (rank) => {
    for (const ranks of [['A', rank], [rank, 'A']] as const) {
      const cards = hand(ranks);
      expect(evaluateHand(cards)).toEqual({ total: 21, isSoft: true, isBust: false, isTwentyOne: true });
      expect(isNaturalBlackjack(cards, true)).toBe(true);
      expect(isNaturalBlackjack(cards, false)).toBe(false);
    }
  });

const nonNaturals: readonly (readonly Rank[])[] = [
  [], ['A'], ['K'], ['A', 'A'], ['A', '9'], ['Q', 'K'],
  ['A', '5', '5'], ['7', '7', '7'], ['10', '5', '6'], ['A', 'A', '9'],
];
test.each(nonNaturals.map((ranks) => [ranks] as const))('%j is not natural even when eligible', (ranks) => {
  expect(isNaturalBlackjack(hand(ranks), true)).toBe(false);
});

test('evaluation and natural classification preserve card objects, array order and shoe state', () => {
  const cards = hand(['A', '6', '10']);
  const snapshot = structuredClone(cards);
  const references = [...cards];
  evaluateHand(cards);
  isNaturalBlackjack(cards, true);
  isNaturalBlackjack(cards, false);
  expect(cards).toEqual(snapshot);
  cards.forEach((card, index) => expect(card).toBe(references[index]));

  // Read shared card references from an existing shoe; no draw/orchestration needed.
  const shoe = createShoe('evaluation-only', { nextInt: (bound) => bound - 1 });
  const shoeSnapshot = structuredClone(shoe);
  shoe.available.forEach(Object.freeze);
  Object.freeze(shoe.available);
  Object.freeze(shoe.inPlay);
  Object.freeze(shoe.discarded);
  Object.freeze(shoe);
  const sharedCards = Object.freeze(shoe.available.slice(0, 2));
  expect(evaluateHand(sharedCards)).toEqual({ total: 13, isSoft: true, isBust: false, isTwentyOne: false });
  expect(isNaturalBlackjack(sharedCards, true)).toBe(false);
  expect(shoe).toEqual(shoeSnapshot);
});
