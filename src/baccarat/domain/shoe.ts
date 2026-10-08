import type { PhysicalCard, Rank, Suit } from '../../domain/card.js';
import { createSeededRandom, isSeed, shuffleCards } from '../../domain/random.js';
import { DEFAULT_RULES, validateRules, type BaccaratRules } from './config.js';

const SUITS: readonly Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS: readonly Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export function inventory(deckCount = 8): readonly PhysicalCard[] {
  if (!Number.isInteger(deckCount) || deckCount < 1 || deckCount > 8) throw new RangeError('Invalid Baccarat deck count');
  return Object.freeze(Array.from({ length: deckCount }, (_, index) => SUITS.flatMap(suit => RANKS.map(rank =>
    Object.freeze({ id: `${index + 1}:${suit}:${rank}`, deckIndex: index + 1, suit, rank })))).flat());
}
export function validateInventory(cards: readonly PhysicalCard[], deckCount = 8) {
  if (cards.length !== deckCount * 52) throw new Error('Incorrect Baccarat inventory size');
  const expected = new Set(inventory(deckCount).map(card => card.id));
  for (const card of cards) {
    if (!expected.delete(card.id) || card.id !== `${card.deckIndex}:${card.suit}:${card.rank}`) {
      throw new Error('Invalid or duplicate physical card');
    }
  }
  if (expected.size) throw new Error('Missing physical card');
}
export type Shoe = Readonly<{ id: string; ordinal: number; cursor: number; retired: boolean; cards: readonly PhysicalCard[];
  initialSize: number; indicator: PhysicalCard | null; burnCount: number; totalBurned: number;
  cutPosition: number; cutReached: boolean; status: 'PLAYABLE' | 'CLOSING' | 'CLOSED'; roundNumber: number }>;
export function burnValue(rank: Rank): number {
  const index = RANKS.indexOf(rank);
  if (index < 0) throw new RangeError('Invalid Baccarat burn rank');
  return Math.min(index + 1, 10);
}
export const remainingCards = (shoe: Shoe) => shoe.initialSize - shoe.cursor;
export function mayBeginRound(shoe: Shoe): boolean {
  return !shoe.retired && shoe.status === 'PLAYABLE' && shoe.cursor < shoe.cutPosition && remainingCards(shoe) >= 6;
}
export function consumeRound(shoe: Shoe, count: number): Shoe {
  if (!mayBeginRound(shoe) || !Number.isInteger(count) || count < 4 || count > 6) throw new Error('Unsafe Baccarat round');
  const cursor = shoe.cursor + count, cutReached = cursor >= shoe.cutPosition;
  return Object.freeze({ ...shoe, cursor, cutReached, roundNumber: shoe.roundNumber + 1,
    status: cutReached || shoe.initialSize - cursor < 6 ? 'CLOSING' : 'PLAYABLE' });
}
export function closeAfterSettlement(shoe: Shoe): Shoe {
  return shoe.status === 'CLOSING' ? Object.freeze({ ...shoe, status: 'CLOSED' }) : shoe;
}
export function validateShoe(shoe: Shoe, rules: BaccaratRules): void {
  validateInventory(shoe.cards, rules.deckCount);
  const indicator = rules.burnEnabled ? shoe.cards[0] : null;
  const count = indicator ? burnValue(indicator.rank) : 0, totalBurned = indicator ? count + 1 : 0;
  const atBoundary = shoe.cursor >= shoe.cutPosition, safe = shoe.initialSize - shoe.cursor >= 6;
  if (!Number.isSafeInteger(shoe.ordinal) || shoe.ordinal < 0 || shoe.id !== `baccarat-shoe-${shoe.ordinal + 1}`
    || shoe.initialSize !== rules.deckCount * 52 || !Number.isInteger(shoe.cursor)
    || shoe.cursor < totalBurned || shoe.cursor > shoe.initialSize || shoe.burnCount !== count || shoe.totalBurned !== totalBurned
    || shoe.indicator?.id !== indicator?.id || shoe.indicator?.rank !== indicator?.rank || shoe.indicator?.suit !== indicator?.suit
    || shoe.cutPosition !== shoe.initialSize - rules.cutCardReserve || shoe.cutReached !== atBoundary
    || !Number.isSafeInteger(shoe.roundNumber) || shoe.roundNumber < 0
    || (shoe.status === 'PLAYABLE') !== (!atBoundary && safe)) throw new Error('Baccarat shoe audit integrity failure');
}
export function createShoe(seed: number, ordinal = 0, ordered?: readonly PhysicalCard[], rules: BaccaratRules = DEFAULT_RULES): Shoe {
  if (!isSeed(seed) || !Number.isSafeInteger(ordinal) || ordinal < 0) throw new RangeError('Invalid shoe seed/ordinal');
  validateRules(rules);
  const cards = ordered ?? shuffleCards(inventory(rules.deckCount), createSeededRandom((seed + Math.imul(ordinal, 0x9e3779b9)) >>> 0));
  validateInventory(cards, rules.deckCount);
  const frozen = Object.freeze(cards.map(card => Object.freeze({ ...card })));
  const indicator = rules.burnEnabled ? frozen[0] : null, burnCount = indicator ? burnValue(indicator.rank) : 0;
  const totalBurned = indicator ? burnCount + 1 : 0;
  return Object.freeze({ id: `baccarat-shoe-${ordinal + 1}`, ordinal, cursor: totalBurned, retired: false, cards: frozen,
    initialSize: frozen.length, indicator, burnCount, totalBurned, cutPosition: frozen.length - rules.cutCardReserve,
    cutReached: false, status: 'PLAYABLE', roundNumber: 0 });
}
