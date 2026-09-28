import { describe, expect, it } from 'vitest';
import { computerDecision } from '../../src/domain/computer.js';
import { evaluateHand } from '../../src/domain/hand.js';
import type { Rank } from '../../src/domain/card.js';
import { orderedShoe } from '../helpers/shoeFixture.js';

describe('deterministic M2 computer policy', () => {
  it.each([
    [['10', '6'], 'HIT'], [['A', '5'], 'HIT'], [['A', '6'], 'STAND'],
    [['10', '7'], 'STAND'], [['A', '9', '5'], 'HIT'], [['A', 'A', '9'], 'STAND'],
    [['10', '10'], 'STAND'], [['7', '7', '7'], 'STAND'],
  ] as const)('%j -> %s', (ranks, expected) => {
    const hand = evaluateHand(orderedShoe(ranks as readonly Rank[]).available.slice(0, ranks.length));
    expect(computerDecision(hand)).toBe(expected);
    expect(computerDecision(hand)).toBe(expected);
  });
});
