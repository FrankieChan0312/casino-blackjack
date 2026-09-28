import type { HandEvaluation } from './hand.js';

// Intentionally simple M2 policy, not optimal/basic strategy or AI/ML.
// Only the computer's own evaluated public hand is an input.
export function computerDecision(hand: HandEvaluation): 'HIT' | 'STAND' {
  return hand.total < 17 ? 'HIT' : 'STAND';
}
