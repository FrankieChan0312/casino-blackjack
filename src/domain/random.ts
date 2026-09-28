import type { PhysicalCard } from './card.js';

export interface RandomSource {
  // maxExclusive is a positive safe integer; return an integer in [0, maxExclusive).
  nextInt(maxExclusive: number): number;
}

// Simulation only: this adapter makes no cryptographic/casino RNG claim.
export const mathRandomSource: RandomSource = {
  nextInt(maxExclusive) {
    if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
      throw new RangeError('maxExclusive must be a positive safe integer');
    }
    return Math.floor(Math.random() * maxExclusive);
  },
};

// Descending Fisher-Yates: copy the array, preserving the physical card objects.
export function shuffleCards(
  cards: readonly PhysicalCard[],
  random: RandomSource,
): readonly PhysicalCard[] {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const selected = random.nextInt(index + 1);
    if (!Number.isInteger(selected) || selected < 0 || selected > index) {
      throw new RangeError(`RandomSource.nextInt(${index + 1}) returned an invalid index`);
    }
    [shuffled[index], shuffled[selected]] = [shuffled[selected], shuffled[index]];
  }
  return shuffled;
}
