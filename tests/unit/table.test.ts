import { describe, expect, it } from 'vitest';
import { configureSeats, createTable, freezeTableSeats, getActiveSeats, releaseTableSeats, type SeatState } from '../../src/domain/table.js';

describe('seven-seat table', () => {
  it('creates exactly seven stable, empty positions', () => {
    const table = createTable();
    expect(table.seats.map((seat) => seat.seatNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(table.seats.every((seat) => seat.occupancy === 'EMPTY' && !seat.sittingOut)).toBe(true);
    expect(getActiveSeats(table)).toEqual([]);
    expect(freezeTableSeats(table)).toEqual({ ok: false, table, error: 'NO_ACTIVE_SEATS' });
  });

  it('orders sparse seats and excludes both human and computer sitting out', () => {
    const result = configureSeats(createTable(), [
      { seatNumber: 7, occupancy: 'COMPUTER', sittingOut: false },
      { seatNumber: 5, occupancy: 'HUMAN', sittingOut: true },
      { seatNumber: 2, occupancy: 'COMPUTER', sittingOut: false },
      { seatNumber: 3, occupancy: 'COMPUTER', sittingOut: true },
    ]);
    expect(result.ok).toBe(true);
    expect(getActiveSeats(result.table).map((seat) => seat.seatNumber)).toEqual([2, 7]);
    expect(result.table.seats.map((seat) => seat.seatNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('accepts zero humans and rejects a second human even when sitting out', () => {
    const table = configureSeats(createTable(), [{ seatNumber: 2, occupancy: 'HUMAN', sittingOut: false }]).table;
    const result = configureSeats(table, [{ seatNumber: 4, occupancy: 'HUMAN', sittingOut: true }]);
    expect(result).toEqual({ ok: false, table, error: 'INVALID_SEATS' });
    expect(result.table).toBe(table);
    const replaced = configureSeats(table, [{ seatNumber: 2, occupancy: 'COMPUTER', sittingOut: false }]);
    expect(replaced.ok).toBe(true);
    expect(getActiveSeats(replaced.table)).toHaveLength(1);
  });

  it.each([0, 8, -1, 1.5, NaN, Infinity])('rejects invalid position %s unchanged', (seatNumber) => {
    const table = createTable();
    expect(configureSeats(table, [{ seatNumber, occupancy: 'COMPUTER', sittingOut: false }]))
      .toEqual({ ok: false, table, error: 'INVALID_SEATS' });
  });

  it('rejects duplicates and invalid runtime occupancy/participation', () => {
    const table = createTable();
    const seat: SeatState = { seatNumber: 1, occupancy: 'COMPUTER', sittingOut: false };
    for (const updates of [[seat, seat], [{ ...seat, occupancy: 'BOT' }],
      [{ ...seat, sittingOut: 'yes' }], [{ ...seat, occupancy: 'EMPTY', sittingOut: true }]]) {
      expect(configureSeats(table, updates as SeatState[])).toEqual({ ok: false, table, error: 'INVALID_SEATS' });
    }
  });

  it('detaches configuration and freezes participation until released', () => {
    const input: SeatState[] = [{ seatNumber: 6, occupancy: 'HUMAN', sittingOut: false }];
    const table = configureSeats(createTable(), input).table;
    input[0] = { seatNumber: 1, occupancy: 'EMPTY', sittingOut: false };
    const frozen = freezeTableSeats(table).table;
    expect(frozen.activeSeats).toEqual([{ seatNumber: 6, occupancy: 'HUMAN', sittingOut: false }]);
    expect(frozen.activeSeats?.[0]).not.toBe(table.seats[5]);
    expect(Object.isFrozen(frozen.activeSeats)).toBe(true);
    expect(Object.isFrozen(frozen.activeSeats?.[0])).toBe(true);
    expect(configureSeats(frozen, [])).toEqual({ ok: false, table: frozen, error: 'ROUND_ALREADY_ACTIVE' });
    expect(freezeTableSeats(frozen).ok).toBe(false);
    const released = releaseTableSeats(frozen);
    expect(configureSeats(released, [{ seatNumber: 6, occupancy: 'EMPTY', sittingOut: false }]).ok).toBe(true);
    expect(frozen.activeSeats).toHaveLength(1);
    expect(table.activeSeats).toBeNull();
  });
});
