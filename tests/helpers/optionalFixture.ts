import { expect } from 'vitest';
import * as optional from '../../src/domain/optionalGame.js';
import type { Rank } from '../../src/domain/card.js';
import type { SeatState } from '../../src/domain/table.js';
import { orderedShoe } from './shoeFixture.js';
import { seat } from './tableFixture.js';

export function accepted(result: optional.OptionalResult): optional.OptionalGameState {
  expect(result.ok, 'error' in result ? result.error : undefined).toBe(true);
  return result.state;
}
export function optionalOpen(ranks: readonly Rank[] = ['8', '6', '8', '10'],
  seats: readonly SeatState[] = [seat(1, 'HUMAN')]) {
  const state = optional.createOptionalGame('fixture', { nextInt: (max) => max - 1 });
  return accepted(optional.openOptionalBetting(accepted(optional.configureOptionalSeats({ ...state,
    game: { ...state.game, shoe: orderedShoe(ranks) } }, seats))));
}
export function fundedOpen(ranks?: readonly Rank[]) {
  return accepted(optional.setOptionalMainWager(optionalOpen(ranks), 1, 200));
}
