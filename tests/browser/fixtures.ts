// E2E-only real-domain factories. This module is unreachable in normal builds.
import * as game from '../../src/domain/behindGame.js';
import { createSixDeckInventory, type Rank } from '../../src/domain/card.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { beginControllerDouble, beginControllerSplit } from '../../src/domain/behindController.js';
import { CLASSIC, CHARLIE, CLASSIC_V1_2, type ProfileId } from '../../src/domain/profile.js';

export const fixtureRandom = { nextInt: (max: number) => max - 1 };
export function requireAccepted(result: game.BehindResult) {
  if (!result.ok) throw new Error(`Fixture command rejected: ${result.error}`);
  return result.state;
}
export function fixtureState(ranks: readonly Rank[], profileId: ProfileId = CLASSIC): game.BehindGameState {
  const initial = game.createBehindGame('e2e-only-controlled-shoe', fixtureRandom, true, profileId);
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
  if (!name) return createBrowserController({ playerMode: true });
  if (name === 'player') return createBrowserController({ playerMode: true, seed: 7, clock: () => '2026-01-01T00:00:00.000Z' });
  if (name === 'player-pending') {
    const controller = createBrowserController({ playerMode: true,
      factory: () => fixtureState(['10','10','8','10','10','7','7','8','7','9']),
      random: fixtureRandom, clock: () => '2026-01-01T00:00:00.000Z' });
    if (!controller.dispatch({ type: 'MAIN', seat: 4, amount: 200 })) throw new Error('Pending-return fixture main wager rejected');
    if (!controller.dispatch({ type: 'SIDE', kind: 'PAIR', amount: 20 })) throw new Error('Pending-return fixture side wager rejected');
    return controller;
  }
  const playerScenarios: Record<string, readonly Rank[]> = {
    'player-five': ['10','10','2','10','9','7','7','2','7','8','2','2','2'],
    'player-rsa': ['10','10','A','10','9','7','7','A','7','8','A','9','6','9'],
    'player-rsa-cap': ['10','10','A','10','9','7','7','A','7','8','A','A','A','A','A','A'],
    'player-ace': ['10', '10', '5', '10', 'A', '7', '7', '6', '7', '9'],
    'player-even-money': ['10', '10', 'A', '10', 'A', '7', '7', 'K', '7', '9'],
    'player-split': ['10', '10', '8', '10', '10', '7', '7', '8', '7', '9', '2', '3'],
    'player-natural': ['10', '10', 'A', '10', '10', '7', '7', 'K', '7', '9'],
    'player-loss': ['10', '10', '5', '10', '10', '7', '7', '6', '7', '9'],
    'player-push': ['10', '10', '10', '10', '10', '7', '7', '9', '7', '9'],
  };
  if (playerScenarios[name]) return createBrowserController({ playerMode: true, factory: () => fixtureState(playerScenarios[name],
    name.startsWith('player-rsa') ? CLASSIC_V1_2 : CLASSIC),
    random: fixtureRandom, clock: () => '2026-01-01T00:00:00.000Z' });
  const scenarios: Record<string, readonly Rank[]> = {
    setup: ['5', '6', '6', 'K', '2', '7'], basic: ['5', '6', '6', 'K', '2', '7'],
    poor: ['5', '6', '6', 'K', '2', '7'], split: ['8', '9', '8', 'K', '3', '4', '5'],
    resplit: ['8', '9', '8', 'K', '8', '3', '4', '5'], aces: ['A', '9', 'A', 'K', 'K', '5'],
    surrender: ['5', '6', '6', 'K'], insurance: ['5', 'A', '6', '9', '2'], natural: ['A', 'A', 'K', '9'],
    multi: ['10', '5', '6', '8', '6', 'K', '7', '9'], sides: ['8', '8', '8', '10'],
    spectator: ['5', '9', '6', '8', '9'], 'follow-double': ['5', '9', '6', '8', '9'],
    'follow-split': ['8', '9', '8', '8', '3', '4'], 'poor-follow': ['5', '9', '6', '8', '9'],
    five: ['2', '9', '2', '8', '2', '2', '2'], void: ['5', '9', '6', '8'],
    charlie: ['2','9','2','8','4','5','7'], charlie21: ['2','9','2','8','4','5','8'],
    'back-insurance': ['A', 'A', 'K', '9'], 'poor-insurance': ['5', 'A', '6', '9'],
  };
  const ranks = scenarios[name];
  if (!ranks) throw new Error('Unknown controlled fixture');
  let state = fixtureState(ranks);
  if (name === 'charlie' || name === 'charlie21') state = { ...state, table: { ...state.table, profileId: CHARLIE } };
  const spectator = ['spectator', 'follow-double', 'follow-split', 'poor-follow', 'back-insurance'].includes(name);
  if (name !== 'setup') {
    state = requireAccepted(game.configureBehindSeats(state, [{ seatNumber: 1, occupancy: spectator ? 'COMPUTER' : 'HUMAN', sittingOut: false },
      ...(name === 'multi' ? [{ seatNumber: 2, occupancy: 'COMPUTER' as const, sittingOut: false }] : [])]));
    state = requireAccepted(game.openBehindBetting(state));
    state = requireAccepted(game.setBehindMainWager(state, 1, ['poor', 'poor-insurance'].includes(name) ? 2000 : 200));
    if (name === 'multi') state = requireAccepted(game.setBehindMainWager(state, 2, 200));
    if (spectator) state = requireAccepted(game.setBackWager(state, 1, name === 'poor-follow' ? 1200 : 200));
    if (name === 'sides') for (const type of ['PAIR', 'THREE_CARD'] as const) state = requireAccepted(game.setBehindSideWager(state, 1, type, 20));
    state = requireAccepted(game.closeBehindBetting(state, 'unused', fixtureRandom));
    if (name === 'follow-double' || name === 'poor-follow') state = requireAccepted(beginControllerDouble(state, 'computer-1', 'round-1/seat-1'));
    if (name === 'follow-split') state = requireAccepted(beginControllerSplit(state, 'computer-1', 'round-1/seat-1'));
    if (name === 'void') {
      const shoe = state.table.game.shoe;
      // Fault injection preserves physical accounting; the next real draw fails.
      state = { ...state, table: { ...state.table, game: { ...state.table.game, shoe: { ...shoe,
        available: [], discarded: [...shoe.discarded, ...shoe.available] } } } };
    }
  }
  return createBrowserController({ factory: () => state, random: fixtureRandom, clock: () => '2026-01-01T00:00:00.000Z' });
}
