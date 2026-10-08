import { createBaccaratController } from '../../src/baccarat/controller.js';
import { createBaccarat } from '../../src/baccarat/domain/engine.js';
import { inventory } from '../../src/baccarat/domain/shoe.js';
import { DEFAULT_RULES, LEGACY_RULES } from '../../src/baccarat/domain/config.js';
import type { Rank } from '../../src/domain/card.js';
// baccarat-e2e-only-controlled-shoe: eliminated by the production MODE branch.
const fixtures: Record<string, readonly number[]> = {
  'player-natural': [8,4,0,0,7,7], 'banker-natural': [3,9,0,0,7,7], tie: [8,8,0,0,7,7],
  'two-card': [6,7,0,0,9,9], 'player-third': [5,7,0,0,4,9],
  'banker-third': [7,5,0,0,2,9], 'both-third': [5,5,0,0,4,2], 'banker-win': [5,3,0,0,0,6],
};
const m15Fixtures: Record<string, readonly Rank[]> = {
  'm15-player-pair': ['4','6','4','A','9','9'],
  'm15-banker-pair': ['8','4','K','4','7','7'],
  'm15-both-pair': ['7','K','7','K','K','4'],
  'm15-pair-loss': ['8','4','K','2','7','7'],
  'm15-cut': ['7','K','7','K','K','4'],
};
export function createBaccaratFixture(name: string | null, unmount?: () => void) {
  let state = createBaccarat(77);
  if (name === 'm15-integrity') {
    state = Object.freeze({ ...state, shoe: Object.freeze({ ...state.shoe, cards: Object.freeze(state.shoe.cards.slice(0,12)) }) });
  } else if (name && name in m15Fixtures) {
    // Indicator K + ten additional burns; gameplay starts at index11.
    const all = inventory(), ranks: readonly Rank[] = ['K',...Array<Rank>(10).fill('A'),...m15Fixtures[name]];
    const used = new Set<string>();
    const prefix = ranks.map(rank => { const card = all.find(card => card.rank === rank && !used.has(card.id))!; used.add(card.id); return card; });
    const rules = name === 'm15-cut' ? { ...DEFAULT_RULES, cutCardReserve: 399 } : DEFAULT_RULES;
    state = createBaccarat(77,100000,[...prefix,...all.filter(card=>!used.has(card.id))],rules);
  } else if (name) {
    const numbers = fixtures[name]; if (!numbers) throw new Error('Unknown controlled Baccarat fixture');
    const all = inventory(), prefix = numbers.map((number,index) => {
      const rank: Rank = number === 0 ? 'K' : number === 1 ? 'A' : String(number) as Rank;
      return all.find(card=>card.deckIndex===index+1 && card.suit==='clubs' && card.rank===rank)!;
    });
    const ids = new Set(prefix.map(card=>card.id));state = createBaccarat(77,100000,[...prefix,...all.filter(card=>!ids.has(card.id))],LEGACY_RULES);
  }
  const controller = createBaccaratController(state);
  // This diagnostic reference exists only in the excluded test factory.
  (window as unknown as { baccaratTestController: typeof controller }).baccaratTestController = controller;
  (window as unknown as { baccaratTestUnmount?: () => void }).baccaratTestUnmount = unmount;
  return controller;
}
