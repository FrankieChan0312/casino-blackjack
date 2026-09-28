import { expect } from 'vitest';
import type { Rank } from '../../src/domain/card.js';
import { closeBetting, configureBettingSeats, createBettingGame, openBetting, setMainWager,
  type BettingGameState, type BettingResult } from '../../src/domain/bettingGame.js';
import type { SeatState } from '../../src/domain/table.js';
import { orderedShoe } from './shoeFixture.js';
import { noRandom } from './tableFixture.js';

export function accepted(result: BettingResult): BettingGameState {
  expect(result.ok).toBe(true);
  return result.state;
}
export function bettingFixture(ranks: readonly Rank[], seats: readonly SeatState[]): BettingGameState {
  const state = createBettingGame('fixture', { nextInt: (max) => max - 1 });
  return accepted(configureBettingSeats({ ...state, game: { ...state.game, shoe: orderedShoe(ranks) } }, seats));
}
export function fundedTable(ranks: readonly Rank[], seats: readonly SeatState[], stakes = seats.map(() => 200)): BettingGameState {
  let state = accepted(openBetting(bettingFixture(ranks, seats)));
  seats.forEach((seat, index) => { state = accepted(setMainWager(state, seat.seatNumber, stakes[index])); });
  return accepted(closeBetting(state, 'unused', noRandom));
}
