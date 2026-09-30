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

export const SEEDED_ALGORITHM = 'MULBERRY32_REJECTION_V1';
export function isSeed(seed: unknown): seed is number {
  return typeof seed === 'number' && Number.isInteger(seed) && seed >= 0 && seed <= 0xffffffff;
}
// Mulberry32: uint32 addition, XOR shifts and Math.imul. Private state stays in
// the closure. Bounded integers use rejection sampling, avoiding modulo bias.
export function createSeededRandom(seed: number): RandomSource {
  if (!isSeed(seed)) throw new RangeError('Seed must be an unsigned 32-bit integer');
  let state = seed;
  return Object.freeze({ nextInt(maxExclusive: number) {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > 0x100000000) {
      throw new RangeError('Seeded bound must be an integer in 1..2^32');
    }
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
    let value: number;
    do {
      state = (state + 0x6d2b79f5) >>> 0;
      let mixed = state;
      mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      value = (mixed ^ (mixed >>> 14)) >>> 0;
    } while (value >= limit);
    return value % maxExclusive;
  } });
}

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
