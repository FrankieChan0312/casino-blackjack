import { createSixDeckInventory, type PhysicalCard } from './card.js';
import { shuffleCards, type RandomSource } from './random.js';

// Selection is separate from storage; createShoe selects once per new shoe.
export function selectCutPosition(random: RandomSource): number {
  const offset = random.nextInt(31);
  if (!Number.isInteger(offset) || offset < 0 || offset >= 31) {
    throw new RangeError('RandomSource.nextInt(31) returned an invalid cut offset');
  }
  return 219 + offset;
}

export interface ShoeState {
  readonly shoeId: string;
  readonly available: readonly PhysicalCard[];
  readonly inPlay: readonly PhysicalCard[];
  readonly discarded: readonly PhysicalCard[];
  readonly cutPosition: number;
  readonly reshufflePending: boolean;
  readonly retired: boolean;
}

export function createShoe(shoeId: string, random: RandomSource): ShoeState {
  return {
    shoeId,
    available: shuffleCards(createSixDeckInventory(), random),
    inPlay: [],
    discarded: [],
    cutPosition: selectCutPosition(random),
    reshufflePending: false,
    retired: false,
  };
}

export type DrawResult =
  | { readonly ok: true; readonly shoe: ShoeState; readonly card: PhysicalCard }
  | { readonly ok: false; readonly shoe: ShoeState;
      readonly error: 'SHOE_EXHAUSTED_DURING_ROUND' | 'SHOE_RETIRED' };

// Top of shoe is available[0]. The caller retains the returned state on both paths.
export function drawCard(shoe: ShoeState): DrawResult {
  if (shoe.retired) return { ok: false, shoe, error: 'SHOE_RETIRED' };
  if (shoe.available.length === 0) {
    return {
      ok: false,
      shoe: { ...shoe, retired: true },
      error: 'SHOE_EXHAUSTED_DURING_ROUND',
    };
  }

  const card = shoe.available[0];
  const available = shoe.available.slice(1);
  return {
    ok: true,
    card,
    shoe: {
      ...shoe,
      available,
      inPlay: [...shoe.inPlay, card],
      reshufflePending: shoe.reshufflePending || 312 - available.length >= shoe.cutPosition,
    },
  };
}

// Normal completion only; retired shoes retain their in-play diagnostic cards.
export function completeShoeRound(shoe: ShoeState): ShoeState {
  if (shoe.retired) throw new Error('Cannot complete a retired shoe');
  if (shoe.inPlay.length === 0) return shoe;
  return { ...shoe, inPlay: [], discarded: [...shoe.discarded, ...shoe.inPlay] };
}

// Call at a round boundary. A retired shoe may still hold failed-round cards.
// Replacement returns a new active shoe; the old immutable snapshot is preserved.
export function prepareShoeForNextRound(
  shoe: ShoeState,
  replacementShoeId: string,
  random: RandomSource,
): ShoeState {
  if (!shoe.retired && shoe.inPlay.length > 0) {
    throw new Error('Complete in-play cards before preparing the next round');
  }
  if (shoe.retired || shoe.reshufflePending || shoe.available.length < 4) {
    if (replacementShoeId === shoe.shoeId) {
      throw new Error('Replacement shoe must have a different shoeId');
    }
    return createShoe(replacementShoeId, random);
  }
  return shoe;
}
