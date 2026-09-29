import { expect, it } from 'vitest';
import { createSixDeckInventory } from '../../src/domain/card.js';
import { classifyPair, classifyThreeCard, sideGross } from '../../src/domain/sideBets.js';

function cards(...ids: string[]) {
  return ids.map((id) => createSixDeckInventory().find((card) => card.id === id)!);
}
it.each([
  ['1:clubs:Q', '2:clubs:Q', 'PERFECT_PAIR', 520],
  ['1:clubs:Q', '1:spades:Q', 'COLOURED_PAIR', 260],
  ['1:hearts:Q', '1:diamonds:Q', 'COLOURED_PAIR', 260],
  ['1:clubs:Q', '1:hearts:Q', 'MIXED_PAIR', 140],
  ['1:spades:Q', '1:diamonds:Q', 'MIXED_PAIR', 140],
  ['1:clubs:K', '1:clubs:Q', 'NONE', 0],
  ['1:clubs:10', '1:clubs:J', 'NONE', 0],
])('Pair %s / %s -> %s only', (a, b, expected, gross) => {
  const category = classifyPair(cards(String(a), String(b)));
  expect(category).toBe(expected);
  expect(sideGross(20, category)).toBe(gross);
});
it.each([
  ['1:clubs:Q', '2:clubs:Q', '3:clubs:Q', 'SUITED_TRIPS', 2020],
  ['1:clubs:Q', '1:clubs:K', '1:clubs:A', 'STRAIGHT_FLUSH', 820],
  ['1:clubs:Q', '1:hearts:Q', '1:spades:Q', 'THREE_OF_A_KIND', 620],
  ['1:clubs:7', '1:hearts:8', '1:spades:9', 'STRAIGHT', 220],
  ['1:clubs:2', '1:clubs:5', '1:clubs:9', 'FLUSH', 120],
  ['1:clubs:2', '1:hearts:5', '1:clubs:9', 'NONE', 0],
  ['1:clubs:A', '1:hearts:2', '1:clubs:3', 'STRAIGHT', 220],
  ['1:clubs:Q', '1:hearts:K', '1:clubs:A', 'STRAIGHT', 220],
  ['1:clubs:K', '1:hearts:A', '1:clubs:2', 'NONE', 0],
  ['1:clubs:K', '1:clubs:A', '1:clubs:2', 'FLUSH', 120],
  ['1:clubs:10', '1:hearts:J', '1:clubs:Q', 'STRAIGHT', 220],
])('Three-card %s / %s / %s -> highest %s', (a, b, c, expected, gross) => {
  const category = classifyThreeCard(cards(String(a), String(b), String(c)));
  expect(category).toBe(expected);
  expect(sideGross(20, category)).toBe(gross);
});
it('rejects duplicate physical copies and wrong card counts', () => {
  expect(() => classifyPair(cards('1:clubs:Q', '1:clubs:Q'))).toThrow('distinct');
  expect(() => classifyThreeCard(cards('1:clubs:Q', '1:clubs:Q', '2:clubs:Q'))).toThrow('distinct');
  expect(() => classifyPair([])).toThrow('distinct');
});
