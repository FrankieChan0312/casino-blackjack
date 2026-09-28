import { expect } from 'vitest';
import type { Rank } from '../../src/domain/card.js';
import { configureSeats, createTable, type SeatState } from '../../src/domain/table.js';
import { startTableRound, type TableGameState } from '../../src/domain/tableGame.js';
import { orderedShoe } from './shoeFixture.js';

export const noRandom = { nextInt(): number { throw new Error('Unexpected randomness'); } };
export function tableFixture(ranks: readonly Rank[], seats: readonly SeatState[]): TableGameState {
  const configured = configureSeats(createTable(), seats);
  expect(configured.ok).toBe(true);
  return { table: configured.table, shoe: orderedShoe(ranks), round: null };
}
export function startedTable(ranks: readonly Rank[], seats: readonly SeatState[]): TableGameState {
  const result = startTableRound(tableFixture(ranks, seats), 'r1', 'unused', noRandom);
  expect(result.ok).toBe(true);
  return result.state;
}
export function seat(seatNumber: number, occupancy: 'HUMAN' | 'COMPUTER' = 'COMPUTER', sittingOut = false): SeatState {
  return { seatNumber, occupancy, sittingOut };
}
