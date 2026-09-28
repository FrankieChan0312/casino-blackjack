import type { RandomSource } from './random.js';

// Select only; storing one cut position for a shoe's lifetime belongs to M1-T04.
export function selectCutPosition(random: RandomSource): number {
  const offset = random.nextInt(31);
  if (!Number.isInteger(offset) || offset < 0 || offset >= 31) {
    throw new RangeError('RandomSource.nextInt(31) returned an invalid cut offset');
  }
  return 219 + offset;
}
