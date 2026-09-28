import { expect, test } from 'vitest';
import { dealerShouldHit } from '../../src/domain/dealer.js';
import { ordinaryOutcome } from '../../src/domain/outcome.js';

function facts(total: number, isSoft = false) {
  return Object.freeze({ total, isSoft, isBust: total > 21, isTwentyOne: total === 21 });
}

test.each([false, true])('S17 explicitly hits below 17 and stops at 17+, soft=%s', (soft) => {
  for (const total of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) {
    expect(dealerShouldHit(facts(total, soft))).toBe(true);
  }
  for (const total of [17, 18, 19, 20, 21, 22, 25]) {
    expect(dealerShouldHit(facts(total, soft))).toBe(false);
  }
});

test.each([
  [20, 19, 'PLAYER_WIN', 'HIGHER_TOTAL'], [19, 20, 'DEALER_WIN', 'LOWER_TOTAL'],
  [20, 20, 'PUSH', 'EQUAL_TOTAL'], [18, 25, 'PLAYER_WIN', 'DEALER_BUST'],
  [21, 21, 'PUSH', 'EQUAL_TOTAL'],
] as const)('ordinary %i versus %i resolves %s / %s', (player, dealer, outcome, outcomeReason) => {
  expect(ordinaryOutcome(facts(player), facts(dealer))).toEqual({ outcome, outcomeReason });
});
