import type { HandEvaluation } from './hand.js';

// S17: the dealer never chases the player's total and stops on bust.
export function dealerShouldHit(evaluation: HandEvaluation): boolean {
  return !evaluation.isBust && evaluation.total < 17;
}
