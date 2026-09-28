import type { HandEvaluation } from './hand.js';

// Only surviving ordinary player hands reach comparison; naturals/bust resolve earlier.
export function ordinaryOutcome(player: HandEvaluation, dealer: HandEvaluation) {
  if (dealer.isBust) return { outcome: 'PLAYER_WIN', outcomeReason: 'DEALER_BUST' } as const;
  if (player.total > dealer.total) return { outcome: 'PLAYER_WIN', outcomeReason: 'HIGHER_TOTAL' } as const;
  if (player.total < dealer.total) return { outcome: 'DEALER_WIN', outcomeReason: 'LOWER_TOTAL' } as const;
  return { outcome: 'PUSH', outcomeReason: 'EQUAL_TOTAL' } as const;
}
