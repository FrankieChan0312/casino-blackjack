// E2E-only real-domain factories. This module is unreachable in normal builds.
import * as game from '../../src/domain/behindGame.js';
import { createSixDeckInventory, type Rank } from '../../src/domain/card.js';
import { createBrowserController } from '../../src/browser/controller.js';

export const fixtureRandom = { nextInt: (max: number) => max - 1 };
export function requireAccepted(result: game.BehindResult) {
  if (!result.ok) throw new Error(`Fixture command rejected: ${result.error}`);
  return result.state;
}
export function fixtureState(ranks: readonly Rank[]): game.BehindGameState {
  const initial = game.createBehindGame('e2e-only-controlled-shoe', fixtureRandom);
  const remaining = [...createSixDeckInventory()];
  const suits = ['clubs', 'diamonds', 'hearts', 'spades'] as const;
  const cards = ranks.map((rank, index) => {
    const position = remaining.findIndex((card) => card.rank === rank && card.suit === suits[index % 4]);
    if (position < 0) throw new Error('Invalid fixture inventory');
    return remaining.splice(position, 1)[0];
  });
  return { ...initial, table: { ...initial.table, game: { ...initial.table.game,
    shoe: { ...initial.table.game.shoe, available: [...cards, ...remaining] } } } };
}
export function createFixtureController(name: string | null) {
  if (!name) return createBrowserController();
  let state = fixtureState(['5', '6', '6', 'K', '2', '7']);
  if (name !== 'setup' && name !== 'basic') throw new Error('Unknown controlled fixture');
  if (name === 'basic') {
    state = requireAccepted(game.configureBehindSeats(state, [{ seatNumber: 1, occupancy: 'HUMAN', sittingOut: false }]));
    state = requireAccepted(game.openBehindBetting(state));
    state = requireAccepted(game.setBehindMainWager(state, 1, 200));
    state = requireAccepted(game.closeBehindBetting(state, 'unused', fixtureRandom));
  }
  return createBrowserController({ factory: () => state, random: fixtureRandom });
}
