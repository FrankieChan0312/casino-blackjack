import { createBaccaratController } from '../../src/baccarat/controller.js';
import { createBaccarat } from '../../src/baccarat/domain/engine.js';
import { inventory } from '../../src/baccarat/domain/shoe.js';
import type { Rank } from '../../src/domain/card.js';
// baccarat-e2e-only-controlled-shoe: eliminated by the production MODE branch.
const fixtures: Record<string, readonly number[]> = {
  'player-natural': [8,4,0,0,7,7], 'banker-natural': [3,9,0,0,7,7], tie: [8,8,0,0,7,7],
  'two-card': [6,7,0,0,9,9], 'player-third': [5,7,0,0,4,9],
  'banker-third': [7,5,0,0,2,9], 'both-third': [5,5,0,0,4,2], 'banker-win': [5,3,0,0,0,6],
};
export function createBaccaratFixture(name: string | null, unmount?: () => void) {
  let state = createBaccarat(77);
  if (name) {
    const numbers = fixtures[name]; if (!numbers) throw new Error('Unknown controlled Baccarat fixture');
    const all = inventory(), prefix = numbers.map((number,index) => {
      const rank: Rank = number === 0 ? 'K' : number === 1 ? 'A' : String(number) as Rank;
      return all.find(card=>card.deckIndex===index+1 && card.suit==='clubs' && card.rank===rank)!;
    });
    const ids = new Set(prefix.map(card=>card.id));state = createBaccarat(77,100000,[...prefix,...all.filter(card=>!ids.has(card.id))]);
  }
  const controller = createBaccaratController(state);
  // This diagnostic reference exists only in the excluded test factory.
  (window as unknown as { baccaratTestController: typeof controller }).baccaratTestController = controller;
  (window as unknown as { baccaratTestUnmount?: () => void }).baccaratTestUnmount = unmount;
  return controller;
}
