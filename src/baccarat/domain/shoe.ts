import type { PhysicalCard, Rank, Suit } from '../../domain/card.js';
import { createSeededRandom, isSeed, shuffleCards } from '../../domain/random.js';

const SUITS: readonly Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS: readonly Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export function inventory(): readonly PhysicalCard[] {
  return Object.freeze(Array.from({ length: 8 }, (_, index) => SUITS.flatMap(suit => RANKS.map(rank =>
    Object.freeze({ id: `${index + 1}:${suit}:${rank}`, deckIndex: index + 1, suit, rank })))).flat());
}
export function validateInventory(cards: readonly PhysicalCard[]) {
  if (cards.length !== 416) throw new Error('Eight-deck inventory must contain416 cards');
  const expected = new Set(inventory().map(card => card.id));
  for (const card of cards) {
    if (!expected.delete(card.id) || card.id !== `${card.deckIndex}:${card.suit}:${card.rank}`) {
      throw new Error('Invalid or duplicate physical card');
    }
  }
  if (expected.size) throw new Error('Missing physical card');
}
export type Shoe = Readonly<{ ordinal: number; cursor: number; retired: boolean; cards: readonly PhysicalCard[] }>;
export function createShoe(seed: number, ordinal = 0, ordered?: readonly PhysicalCard[]): Shoe {
  if (!isSeed(seed) || !Number.isSafeInteger(ordinal) || ordinal < 0) throw new RangeError('Invalid shoe seed/ordinal');
  const cards = ordered ?? shuffleCards(inventory(), createSeededRandom((seed + Math.imul(ordinal, 0x9e3779b9)) >>> 0));
  validateInventory(cards);
  return Object.freeze({ ordinal, cursor: 0, retired: false, cards: Object.freeze(cards.map(card => Object.freeze({ ...card }))) });
}
