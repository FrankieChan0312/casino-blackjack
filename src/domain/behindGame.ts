import * as optional from './optionalGame.js';
import { createBankroll, type Bankroll } from './credits.js';
import type { RandomSource } from './random.js';
import type { SeatState } from './table.js';

export interface HumanParticipant {
  readonly participantId: 'local-human';
  readonly bankroll: Bankroll;
}
export interface ComputerParticipant {
  readonly participantId: string;
  readonly seatNumber: number;
  readonly bankroll: Bankroll;
}
export interface BehindGameState {
  // No spendable seat-bankroll copy is retained in the embedded engine.
  readonly table: Omit<optional.OptionalGameState, 'bankrolls'>;
  readonly human: HumanParticipant | null;
  // Stable seat-bound computer identities retain funds while unoccupied.
  readonly computers: readonly ComputerParticipant[];
}
export type BehindResult =
  | { readonly ok: true; readonly state: BehindGameState }
  | { readonly ok: false; readonly state: BehindGameState; readonly error: string };

export function createBehindGame(shoeId: string, random: RandomSource, withHuman = true): BehindGameState {
  const { bankrolls, ...table } = optional.createOptionalGame(shoeId, random);
  return { table, human: withHuman ? { participantId: 'local-human', bankroll: createBankroll() } : null,
    computers: bankrolls.map((bankroll, index) => ({ participantId: `computer-${index + 1}`,
      seatNumber: index + 1, bankroll })) };
}
export function controlledSeat(state: BehindGameState): number | null {
  return state.table.game.table.seats.find((seat) => seat.occupancy === 'HUMAN')?.seatNumber ?? null;
}
export function controllerId(state: BehindGameState, seatNumber: number): string | null {
  const seat = state.table.game.table.seats.find((entry) => entry.seatNumber === seatNumber);
  return !seat || seat.occupancy === 'EMPTY' ? null
    : seat.occupancy === 'HUMAN' ? state.human!.participantId : state.computers[seatNumber - 1].participantId;
}
// Transient adapter only. M1-M5 public contracts and their financial semantics stay intact.
function engine(state: BehindGameState): optional.OptionalGameState {
  const humanSeat = controlledSeat(state);
  return { ...state.table, bankrolls: state.computers.map((entry) => entry.seatNumber === humanSeat
    ? state.human!.bankroll : entry.bankroll) };
}
function run(state: BehindGameState, command: (entry: optional.OptionalGameState) => optional.OptionalResult): BehindResult {
  const input = engine(state);
  const result = command(input);
  if (!result.ok) return { ok: false, state, error: result.error };
  if (result.state === input) return { ok: true, state };
  const { bankrolls, ...table } = result.state;
  // Attribute funds using the input owner, including when configuration changes.
  const humanSeat = controlledSeat(state);
  return { ok: true, state: { ...state, table,
    human: state.human && humanSeat !== null ? { ...state.human, bankroll: bankrolls[humanSeat - 1] } : state.human,
    computers: state.computers.map((entry) => entry.seatNumber === humanSeat ? entry
      : { ...entry, bankroll: bankrolls[entry.seatNumber - 1] }) } };
}
export function configureBehindSeats(state: BehindGameState, updates: readonly SeatState[]): BehindResult {
  if (!state.human && updates.some((seat) => seat.occupancy === 'HUMAN')) {
    return { ok: false, state, error: 'NO_HUMAN_PARTICIPANT' };
  }
  return run(state, (entry) => optional.configureOptionalSeats(entry, updates));
}
export function openBehindBetting(state: BehindGameState): BehindResult {
  return run(state, optional.openOptionalBetting);
}
// Table setup explicitly funds COMPUTER mains; it never places automatic wagers.
export function setBehindMainWager(state: BehindGameState, seatNumber: number, stakeUnits: number): BehindResult {
  return run(state, (entry) => optional.setOptionalMainWager(entry, seatNumber, stakeUnits));
}
export function cancelBehindMainWager(state: BehindGameState, seatNumber: number): BehindResult {
  return run(state, (entry) => optional.cancelOptionalMainWager(entry, seatNumber));
}
export function setBehindSideWager(state: BehindGameState, seatNumber: number,
  type: optional.SideWagerType, stakeUnits: number): BehindResult {
  if (seatNumber !== controlledSeat(state)) return { ok: false, state, error: 'NOT_OWN_SEAT' };
  return run(state, (entry) => optional.setSideWager(entry, seatNumber, type, stakeUnits));
}
export function cancelBehindSideWager(state: BehindGameState, seatNumber: number, type: optional.SideWagerType): BehindResult {
  if (seatNumber !== controlledSeat(state)) return { ok: false, state, error: 'NOT_OWN_SEAT' };
  return run(state, (entry) => optional.cancelSideWager(entry, seatNumber, type));
}
export function closeBehindBetting(state: BehindGameState, replacementShoeId: string, random: RandomSource): BehindResult {
  return run(state, (entry) => optional.closeOptionalBetting(entry, replacementShoeId, random));
}
export function decideBehindMainInsurance(state: BehindGameState, purchase: boolean): BehindResult {
  const seat = controlledSeat(state);
  if (seat === null) return { ok: false, state, error: 'NOT_SEATED' };
  return run(state, (entry) => optional.decideInsurance(entry, seat, purchase));
}
export function electBehindMainEvenMoney(state: BehindGameState): BehindResult {
  const seat = controlledSeat(state);
  if (seat === null) return { ok: false, state, error: 'NOT_SEATED' };
  return run(state, (entry) => optional.electEvenMoney(entry, seat));
}
export function actBehindHand(state: BehindGameState, handId: string,
  action: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER'): BehindResult {
  const seat = controlledSeat(state);
  if (seat === null) return { ok: false, state, error: 'NOT_SEATED' };
  const commands = { HIT: optional.hitOptionalHand, STAND: optional.standOptionalHand,
    DOUBLE: optional.doubleOptionalHand, SPLIT: optional.splitOptionalHand, SURRENDER: optional.surrenderOptionalHand };
  if (!Object.hasOwn(commands, action)) return { ok: false, state, error: 'INVALID_ACTION' };
  return run(state, (entry) => commands[action](entry, seat, handId));
}
export function advanceBehindTable(state: BehindGameState): BehindResult {
  return run(state, optional.advanceOptionalTable);
}
export function settleBehindWagers(state: BehindGameState): BehindResult {
  return run(state, optional.settleOptionalWagers);
}
export function voidBehindRound(state: BehindGameState): BehindResult {
  return run(state, optional.voidOptionalRound);
}
export function prepareNextBehindRound(state: BehindGameState): BehindResult {
  return run(state, optional.prepareNextOptionalRound);
}
