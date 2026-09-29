import type { PhysicalCard } from './card.js';
import { isCreditUnits } from './credits.js';

export type PairCategory = 'PERFECT_PAIR' | 'COLOURED_PAIR' | 'MIXED_PAIR' | 'NONE';
export type ThreeCardCategory = 'SUITED_TRIPS' | 'STRAIGHT_FLUSH' | 'THREE_OF_A_KIND' | 'STRAIGHT' | 'FLUSH' | 'NONE';

function distinctCards(cards: readonly PhysicalCard[], count: number): void {
  if (cards.length !== count || new Set(cards.map((card) => card.id)).size !== count) {
    throw new Error('Side evaluation requires distinct original physical cards');
  }
}
export function classifyPair(cards: readonly PhysicalCard[]): PairCategory {
  distinctCards(cards, 2);
  const [first, second] = cards;
  if (first.rank !== second.rank) return 'NONE';
  if (first.suit === second.suit) return 'PERFECT_PAIR';
  const black = (card: PhysicalCard) => card.suit === 'clubs' || card.suit === 'spades';
  return black(first) === black(second) ? 'COLOURED_PAIR' : 'MIXED_PAIR';
}
export function classifyThreeCard(cards: readonly PhysicalCard[]): ThreeCardCategory {
  distinctCards(cards, 3);
  const suited = cards.every((card) => card.suit === cards[0].suit);
  const trips = cards.every((card) => card.rank === cards[0].rank);
  const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const ranks = cards.map((card) => rankOrder.indexOf(card.rank) + 1).sort((a, b) => a - b);
  const straight = (ranks[1] === ranks[0] + 1 && ranks[2] === ranks[1] + 1)
    || (ranks[0] === 1 && ranks[1] === 12 && ranks[2] === 13);
  if (trips && suited) return 'SUITED_TRIPS';
  if (straight && suited) return 'STRAIGHT_FLUSH';
  if (trips) return 'THREE_OF_A_KIND';
  if (straight) return 'STRAIGHT';
  return suited ? 'FLUSH' : 'NONE';
}
const grossMultipliers = Object.freeze({ PERFECT_PAIR: 26, COLOURED_PAIR: 13, MIXED_PAIR: 7,
  SUITED_TRIPS: 101, STRAIGHT_FLUSH: 41, THREE_OF_A_KIND: 31, STRAIGHT: 11, FLUSH: 6, NONE: 0 });
export function sideGross(stakeUnits: number, category: PairCategory | ThreeCardCategory): number {
  if (!isCreditUnits(stakeUnits) || stakeUnits < 2 || stakeUnits > 200 || stakeUnits % 2 !== 0) {
    throw new Error('Invalid original side stake');
  }
  return stakeUnits * grossMultipliers[category];
}
