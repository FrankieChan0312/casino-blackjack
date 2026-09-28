import { createBankroll, isCreditUnits, releaseCredits, reserveCredits, type Bankroll } from './credits.js';
import type { RandomSource } from './random.js';
import type { SeatState } from './table.js';
import { advanceTableAutomation, configureTableSeats, createTableGame, hitTableSeat,
  resolveTableDealer, standTableSeat, startTableRound, type TableCommandResult, type TableGameState } from './tableGame.js';

export interface MainWager {
  readonly seatNumber: number;
  readonly stakeUnits: number;
}

export interface BettingGameState {
  readonly game: TableGameState;
  // Index seatNumber - 1; ownership persists independently of seat occupancy.
  readonly bankrolls: readonly Bankroll[];
  readonly phase: 'CONFIGURING' | 'OPEN' | 'CLOSED';
  readonly roundNumber: number;
  readonly wagers: readonly MainWager[];
}

export type BettingResult =
  | { readonly ok: true; readonly state: BettingGameState }
  | { readonly ok: false; readonly state: BettingGameState; readonly error: string };

export function createBettingGame(shoeId: string, random: RandomSource): BettingGameState {
  return { game: createTableGame(shoeId, random), bankrolls: Array.from({ length: 7 }, createBankroll),
    phase: 'CONFIGURING', roundNumber: 0, wagers: [] };
}

export function configureBettingSeats(state: BettingGameState, updates: readonly SeatState[]): BettingResult {
  if (state.phase !== 'CONFIGURING') return { ok: false, state, error: 'CONFIGURATION_LOCKED' };
  const result = configureTableSeats(state.game, updates);
  return result.ok ? { ok: true, state: { ...state, game: result.state } }
    : { ok: false, state, error: result.error };
}

export function openBetting(state: BettingGameState): BettingResult {
  if (state.phase !== 'CONFIGURING') return { ok: false, state, error: 'WRONG_PHASE' };
  return { ok: true, state: { ...state, phase: 'OPEN', roundNumber: state.roundNumber + 1 } };
}

export function isMainWager(amount: number): boolean {
  return isCreditUnits(amount) && amount >= 20 && amount <= 2000 && amount % 2 === 0;
}

// Set a target stake: duplicate requests have no additional financial effect.
export function setMainWager(state: BettingGameState, seatNumber: number, stakeUnits: number): BettingResult {
  if (state.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  const seat = state.game.table.seats.find((entry) => entry.seatNumber === seatNumber);
  if (!seat || seat.occupancy === 'EMPTY' || seat.sittingOut) return { ok: false, state, error: 'INELIGIBLE_SEAT' };
  if (!isMainWager(stakeUnits)) return { ok: false, state, error: 'INVALID_MAIN_WAGER' };
  const current = state.bankrolls[seatNumber - 1];
  const delta = stakeUnits - current.reserved;
  if (delta > current.available) return { ok: false, state, error: 'INSUFFICIENT_FUNDS' };
  if (delta === 0) return { ok: true, state };
  const bankroll = current.reserved === 0 ? reserveCredits(current, stakeUnits).bankroll
    : { available: current.available - delta, reserved: stakeUnits };
  const wagers = [...state.wagers.filter((entry) => entry.seatNumber !== seatNumber), { seatNumber, stakeUnits }]
    .sort((left, right) => left.seatNumber - right.seatNumber);
  return { ok: true, state: { ...state, wagers,
    bankrolls: state.bankrolls.map((entry, index) => index === seatNumber - 1 ? bankroll : entry) } };
}

export function cancelMainWager(state: BettingGameState, seatNumber: number): BettingResult {
  if (state.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  if (!state.wagers.some((entry) => entry.seatNumber === seatNumber)) return { ok: false, state, error: 'NO_WAGER' };
  const released = releaseCredits(state.bankrolls[seatNumber - 1]);
  if (!released.ok) return { ok: false, state, error: released.error };
  return { ok: true, state: { ...state, wagers: state.wagers.filter((entry) => entry.seatNumber !== seatNumber),
    bankrolls: state.bankrolls.map((entry, index) => index === seatNumber - 1 ? released.bankroll : entry) } };
}

export function closeBetting(state: BettingGameState, replacementShoeId: string, random: RandomSource): BettingResult {
  if (state.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  if (state.wagers.length === 0) return { ok: false, state, error: 'NO_FUNDED_SEATS' };
  // M2 already deals to occupied/non-sitting-out seats. Adapt only its input
  // participation, then retain the real configuration in the round snapshot.
  const seats = state.game.table.seats;
  const fundedGame = { ...state.game, table: { ...state.game.table,
    seats: seats.map((seat) => seat.occupancy !== 'EMPTY'
      && !state.wagers.some((wager) => wager.seatNumber === seat.seatNumber) ? { ...seat, sittingOut: true } : seat) } };
  const result = startTableRound(fundedGame, `round-${state.roundNumber}`, replacementShoeId, random);
  if (!result.ok) return { ok: false, state, error: result.error };
  const game = { ...result.state, table: { ...result.state.table, seats },
    round: { ...result.state.round!, seats: Object.freeze(seats.map((seat) => Object.freeze({ ...seat }))) } };
  return { ok: true, state: { ...state, game, phase: 'CLOSED',
    wagers: Object.freeze(state.wagers.map((wager) => Object.freeze({ ...wager }))) } };
}

function play(state: BettingGameState, command: (game: TableGameState) => TableCommandResult): BettingResult {
  if (state.phase !== 'CLOSED') return { ok: false, state, error: 'WRONG_PHASE' };
  const result = command(state.game);
  return result.ok ? { ok: true, state: result.state === state.game ? state : { ...state, game: result.state } }
    : { ok: false, state, error: result.error };
}

export function hitFundedSeat(state: BettingGameState, seatNumber: number): BettingResult {
  return play(state, (game) => hitTableSeat(game, seatNumber));
}
export function standFundedSeat(state: BettingGameState, seatNumber: number): BettingResult {
  return play(state, (game) => standTableSeat(game, seatNumber));
}
export function advanceFundedTable(state: BettingGameState): BettingResult {
  return play(state, advanceTableAutomation);
}
export function resolveFundedDealer(state: BettingGameState): BettingResult {
  return play(state, resolveTableDealer);
}
