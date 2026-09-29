import { expect } from 'vitest';
import * as game from '../../src/domain/behindGame.js';
import type { Rank } from '../../src/domain/card.js';
import type { SeatState } from '../../src/domain/table.js';
import { orderedShoe } from './shoeFixture.js';
import { seat } from './tableFixture.js';

export function accepted(result: game.BehindResult): game.BehindGameState {
  expect(result.ok, 'error' in result ? result.error : undefined).toBe(true);
  return result.state;
}
export function behindFixture(ranks: readonly Rank[] = ['10', '9', '10', '8'],
  seats: readonly SeatState[] = [seat(1, 'HUMAN')], withHuman = true): game.BehindGameState {
  const initial = game.createBehindGame('fixture', { nextInt: (max) => max - 1 }, withHuman);
  return accepted(game.configureBehindSeats({ ...initial, table: { ...initial.table,
    game: { ...initial.table.game, shoe: orderedShoe(ranks) } } }, seats));
}
