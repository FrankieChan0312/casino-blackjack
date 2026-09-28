import type { PhysicalCard, Rank } from './card.js';

export interface HandEvaluation {
  readonly total: number;
  readonly isSoft: boolean;
  readonly isBust: boolean;
  readonly isTwentyOne: boolean;
}

function isTenValued(rank: Rank): boolean {
  return rank === '10' || rank === 'J' || rank === 'Q' || rank === 'K';
}

// Empty hands total zero. Evaluation never changes the cards or their order.
export function evaluateHand(cards: readonly PhysicalCard[]): HandEvaluation {
  let total = 0;
  let highAces = 0;
  for (const { rank } of cards) {
    if (rank === 'A') {
      total += 11;
      highAces++;
    } else {
      total += isTenValued(rank) ? 10 : Number(rank);
    }
  }
  while (total > 21 && highAces > 0) {
    total -= 10;
    highAces--;
  }
  return { total, isSoft: highAces > 0, isBust: total > 21, isTwentyOne: total === 21 };
}

// Eligibility must be explicit: only an original, unsplit hand can be natural.
export function isNaturalBlackjack(
  cards: readonly PhysicalCard[],
  originalHandEligible: boolean,
): boolean {
  if (!originalHandEligible || cards.length !== 2) return false;
  const [first, second] = cards;
  return (first.rank === 'A' && isTenValued(second.rank))
    || (second.rank === 'A' && isTenValued(first.rank));
}
