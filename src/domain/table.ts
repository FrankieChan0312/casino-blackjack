export type Occupancy = 'EMPTY' | 'HUMAN' | 'COMPUTER';

export interface SeatState {
  readonly seatNumber: number;
  readonly occupancy: Occupancy;
  readonly sittingOut: boolean;
}

export interface TableState {
  readonly seats: readonly SeatState[];
  // null between rounds; a detached, frozen participation snapshot during play.
  readonly activeSeats: readonly SeatState[] | null;
}

export type TableConfigurationResult =
  | { readonly ok: true; readonly table: TableState }
  | { readonly ok: false; readonly table: TableState;
      readonly error: 'ROUND_ALREADY_ACTIVE' | 'INVALID_SEATS' | 'NO_ACTIVE_SEATS' };

export function createTable(): TableState {
  return {
    seats: Array.from({ length: 7 }, (_, index) => ({
      seatNumber: index + 1, occupancy: 'EMPTY', sittingOut: false,
    })),
    activeSeats: null,
  };
}

// Updates are atomic; unspecified positions retain their between-round setting.
export function configureSeats(table: TableState, updates: readonly SeatState[]): TableConfigurationResult {
  if (table.activeSeats !== null) return { ok: false, table, error: 'ROUND_ALREADY_ACTIVE' };
  const numbers = updates.map((seat) => seat.seatNumber);
  if (new Set(numbers).size !== numbers.length || updates.some((seat) =>
    !Number.isInteger(seat.seatNumber) || seat.seatNumber < 1 || seat.seatNumber > 7
    || !['EMPTY', 'HUMAN', 'COMPUTER'].includes(seat.occupancy)
    || typeof seat.sittingOut !== 'boolean' || (seat.occupancy === 'EMPTY' && seat.sittingOut))) {
    return { ok: false, table, error: 'INVALID_SEATS' };
  }
  const seats = table.seats.map((seat) => ({ ...updates.find((update) => update.seatNumber === seat.seatNumber) ?? seat }));
  if (seats.filter((seat) => seat.occupancy === 'HUMAN').length > 1) {
    return { ok: false, table, error: 'INVALID_SEATS' };
  }
  return { ok: true, table: { seats, activeSeats: null } };
}

export function getActiveSeats(table: TableState): readonly SeatState[] {
  return table.seats.filter((seat) => seat.occupancy !== 'EMPTY' && !seat.sittingOut);
}

export function freezeTableSeats(table: TableState): TableConfigurationResult {
  if (table.activeSeats !== null) return { ok: false, table, error: 'ROUND_ALREADY_ACTIVE' };
  const activeSeats = getActiveSeats(table);
  if (activeSeats.length === 0) return { ok: false, table, error: 'NO_ACTIVE_SEATS' };
  return { ok: true, table: { seats: table.seats,
    activeSeats: Object.freeze(activeSeats.map((seat) => Object.freeze({ ...seat }))),
  } };
}

export function releaseTableSeats(table: TableState): TableState {
  return { seats: table.seats, activeSeats: null };
}
