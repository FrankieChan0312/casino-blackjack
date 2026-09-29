import { expect } from 'vitest';
import * as advanced from '../../src/domain/advancedGame.js';
import type { Rank } from '../../src/domain/card.js';
import type { SeatState } from '../../src/domain/table.js';
import { orderedShoe } from './shoeFixture.js';
import { noRandom, seat } from './tableFixture.js';

export function accepted(result: advanced.AdvancedResult): advanced.AdvancedGameState {
  expect(result.ok, 'error' in result ? result.error : undefined).toBe(true);
  return result.state;
}
export function advancedFixture(ranks: readonly Rank[], seats: readonly SeatState[] = [seat(1, 'HUMAN')]) {
  const state = advanced.createAdvancedGame('fixture', { nextInt: (max) => max - 1 });
  return accepted(advanced.configureAdvancedSeats({ ...state, game: { ...state.game, shoe: orderedShoe(ranks) } }, seats));
}
export function advancedTable(ranks: readonly Rank[], seats: readonly SeatState[] = [seat(1, 'HUMAN')],
  stakes = seats.map(() => 200)) {
  let state = accepted(advanced.openAdvancedBetting(advancedFixture(ranks, seats)));
  seats.forEach((entry, index) => { state = accepted(advanced.setAdvancedWager(state, entry.seatNumber, stakes[index])); });
  return accepted(advanced.closeAdvancedBetting(state, 'unused', noRandom));
}
export function currentId(state: advanced.AdvancedGameState): string {
  return state.game.round!.currentHandId!;
}
export function withAvailable(state: advanced.AdvancedGameState, amount: number, seatNumber = 1) {
  return { ...state, bankrolls: state.bankrolls.map((entry, index) => index === seatNumber - 1
    ? { ...entry, available: amount } : entry) };
}
export function freezeDeep(value: object) {
  for (const child of Object.values(value)) if (child && typeof child === 'object') freezeDeep(child);
  Object.freeze(value);
}
