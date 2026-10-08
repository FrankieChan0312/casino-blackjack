import type { Rank } from '../../src/domain/card.js';
import { inventory } from '../../src/baccarat/domain/shoe.js';
import { DEFAULT_RULES, type BaccaratRules } from '../../src/baccarat/domain/config.js';
import { createBaccarat } from '../../src/baccarat/domain/engine.js';

export const RANKS: readonly Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
// Independent literal burn oracle; production burnValue is never used here.
export const BURN = [1,2,3,4,5,6,7,8,9,10,10,10,10];
export function fixture(ranks: readonly Rank[], indicator: Rank = 'K', rules: BaccaratRules = DEFAULT_RULES, credits = 100000) {
  const all = inventory(rules.deckCount), used = new Set<string>();
  const initial: Rank[] = rules.burnEnabled ? [indicator,...Array<Rank>(BURN[RANKS.indexOf(indicator)]).fill('A'),...ranks] : [...ranks];
  const prefix = initial.map(rank => {
    const card = all.find(card => card.rank === rank && !used.has(card.id));
    if (!card) throw new Error('Fixture inventory exhausted');
    used.add(card.id); return card;
  });
  return createBaccarat(77,credits,[...prefix,...all.filter(card => !used.has(card.id))],rules);
}
