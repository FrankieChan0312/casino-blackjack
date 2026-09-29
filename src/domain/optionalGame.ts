import * as advanced from './advancedGame.js';
import { isMainWager } from './bettingGame.js';
import { isCreditUnits } from './credits.js';
import type { RandomSource } from './random.js';
import type { SeatState } from './table.js';
import { classifyPair, classifyThreeCard, sideGross, type PairCategory, type ThreeCardCategory } from './sideBets.js';

export type SideWagerType = 'PAIR' | 'THREE_CARD';
export interface SideWager {
  readonly seatNumber: number;
  readonly type: SideWagerType;
  readonly stakeUnits: number;
}
export interface OptionalGameState extends advanced.AdvancedGameState {
  readonly sideWagers: readonly SideWager[];
  readonly sideResults: readonly SideResult[];
}
export interface SideResult extends SideWager {
  readonly roundId: string;
  readonly category: PairCategory | ThreeCardCategory;
  readonly grossReturnUnits: number;
  readonly netUnits: number;
  readonly status: 'PENDING';
}
export type OptionalResult =
  | { readonly ok: true; readonly state: OptionalGameState }
  | { readonly ok: false; readonly state: OptionalGameState; readonly error: string };

export function createOptionalGame(shoeId: string, random: RandomSource): OptionalGameState {
  return { ...advanced.createAdvancedGame(shoeId, random), sideWagers: [], sideResults: [] };
}
function adapt(state: OptionalGameState, result: advanced.AdvancedResult): OptionalResult {
  if (!result.ok) return { ok: false, state, error: result.error };
  return { ok: true, state: result.state === state ? state : { ...state, ...result.state } };
}
export function configureOptionalSeats(state: OptionalGameState, updates: readonly SeatState[]): OptionalResult {
  return adapt(state, advanced.configureAdvancedSeats(state, updates));
}
export function openOptionalBetting(state: OptionalGameState): OptionalResult {
  return adapt(state, advanced.openAdvancedBetting(state));
}
function seatError(state: OptionalGameState, seatNumber: number): string | undefined {
  if (state.phase !== 'OPEN') return 'BETTING_NOT_OPEN';
  const seat = state.game.table.seats.find((entry) => entry.seatNumber === seatNumber);
  if (!seat || seat.occupancy === 'EMPTY' || seat.sittingOut) return 'INELIGIBLE_SEAT';
  return undefined;
}
function moveReserve(state: OptionalGameState, seatNumber: number, delta: number): OptionalGameState {
  return { ...state, bankrolls: state.bankrolls.map((entry, index) => index === seatNumber - 1
    ? { available: entry.available - delta, reserved: entry.reserved + delta } : entry) };
}
export function setOptionalMainWager(state: OptionalGameState, seatNumber: number, stakeUnits: number): OptionalResult {
  const error = seatError(state, seatNumber);
  if (error) return { ok: false, state, error };
  if (!isMainWager(stakeUnits)) return { ok: false, state, error: 'INVALID_MAIN_WAGER' };
  const delta = stakeUnits - (state.wagers.find((entry) => entry.seatNumber === seatNumber)?.stakeUnits ?? 0);
  if (delta > state.bankrolls[seatNumber - 1].available) return { ok: false, state, error: 'INSUFFICIENT_FUNDS' };
  if (delta === 0) return { ok: true, state };
  return { ok: true, state: { ...moveReserve(state, seatNumber, delta),
    wagers: [...state.wagers.filter((entry) => entry.seatNumber !== seatNumber), { seatNumber, stakeUnits }]
      .sort((left, right) => left.seatNumber - right.seatNumber) } };
}
export function setSideWager(state: OptionalGameState, seatNumber: number,
  type: SideWagerType, stakeUnits: number): OptionalResult {
  const error = seatError(state, seatNumber);
  if (error) return { ok: false, state, error };
  if (type !== 'PAIR' && type !== 'THREE_CARD') return { ok: false, state, error: 'INVALID_SIDE_TYPE' };
  if (!state.wagers.some((entry) => entry.seatNumber === seatNumber)) return { ok: false, state, error: 'MAIN_REQUIRED' };
  if (!isCreditUnits(stakeUnits) || stakeUnits < 2 || stakeUnits > 200 || stakeUnits % 2 !== 0) {
    return { ok: false, state, error: 'INVALID_SIDE_WAGER' };
  }
  const delta = stakeUnits - (state.sideWagers.find((entry) => entry.seatNumber === seatNumber && entry.type === type)?.stakeUnits ?? 0);
  if (delta > state.bankrolls[seatNumber - 1].available) return { ok: false, state, error: 'INSUFFICIENT_FUNDS' };
  if (delta === 0) return { ok: true, state };
  return { ok: true, state: { ...moveReserve(state, seatNumber, delta),
    sideWagers: [...state.sideWagers.filter((entry) => entry.seatNumber !== seatNumber || entry.type !== type),
      { seatNumber, type, stakeUnits }] } };
}
export function cancelSideWager(state: OptionalGameState, seatNumber: number, type: SideWagerType): OptionalResult {
  if (state.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  const wager = state.sideWagers.find((entry) => entry.seatNumber === seatNumber && entry.type === type);
  if (!wager) return { ok: false, state, error: 'NO_WAGER' };
  return { ok: true, state: { ...moveReserve(state, seatNumber, -wager.stakeUnits),
    sideWagers: state.sideWagers.filter((entry) => entry !== wager) } };
}
export function cancelOptionalMainWager(state: OptionalGameState, seatNumber: number): OptionalResult {
  if (state.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  const main = state.wagers.find((entry) => entry.seatNumber === seatNumber);
  if (!main) return { ok: false, state, error: 'NO_WAGER' };
  const refund = main.stakeUnits + state.sideWagers.filter((entry) => entry.seatNumber === seatNumber)
    .reduce((sum, entry) => sum + entry.stakeUnits, 0);
  return { ok: true, state: { ...moveReserve(state, seatNumber, -refund),
    wagers: state.wagers.filter((entry) => entry !== main),
    sideWagers: state.sideWagers.filter((entry) => entry.seatNumber !== seatNumber) } };
}
export function closeOptionalBetting(state: OptionalGameState, replacementShoeId: string, random: RandomSource): OptionalResult {
  const result = adapt(state, advanced.closeAdvancedBetting(state, replacementShoeId, random));
  if (!result.ok) return result;
  const round = result.state.game.round!;
  const sideResults = round.phase === 'INTEGRITY_ERROR' ? [] : state.sideWagers.map((wager): SideResult => {
    const original = round.players.find((hand) => hand.seatNumber === wager.seatNumber)!.originalCards;
    const category = wager.type === 'PAIR' ? classifyPair(original)
      : classifyThreeCard([...original, round.dealerCards[0]]);
    const grossReturnUnits = sideGross(wager.stakeUnits, category);
    return Object.freeze({ ...wager, roundId: round.roundId, category, grossReturnUnits,
      netUnits: grossReturnUnits - wager.stakeUnits, status: 'PENDING' });
  });
  return { ok: true, state: { ...result.state, sideResults: Object.freeze(sideResults),
    sideWagers: Object.freeze(state.sideWagers.map((entry) => Object.freeze({ ...entry }))) } };
}
