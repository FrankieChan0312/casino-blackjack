import * as optional from './optionalGame.js';
import { createBankroll, isBankroll, isCreditUnits, type Bankroll } from './credits.js';
import type { RandomSource } from './random.js';
import type { SeatState } from './table.js';
import { isMainWager } from './bettingGame.js';

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
  readonly backWagers: readonly BackWager[];
  readonly backExposures: readonly BackExposure[];
  readonly backResults: readonly BackResult[];
  readonly followWindow: { readonly kind: 'DOUBLE'; readonly handId: string; readonly targetSeat: number;
    readonly wagerId: string } | null;
  readonly followDecisions: readonly { readonly handId: string; readonly kind: 'DOUBLE'; readonly choice: 'ADD' | 'NO_ADD';
    readonly fundingError?: 'INSUFFICIENT_FUNDS' }[];
}
export interface BackExposure extends BackWager {
  readonly parentHandId: string | null;
}
export interface BackResult extends BackExposure {
  readonly roundId: string;
  readonly outcome: 'PLAYER_WIN' | 'DEALER_WIN' | 'PUSH' | 'PLAYER_BLACKJACK' | 'SURRENDERED' | 'VOID' | 'EVEN_MONEY';
  readonly grossReturnUnits: number;
  readonly netUnits: number;
  readonly status: 'PENDING' | 'COMMITTED' | 'REFUNDED';
}
export interface BackWager {
  readonly participantId: 'local-human';
  readonly wagerId: string;
  readonly targetSeat: number;
  readonly handId: string;
  readonly stakeUnits: number;
}
export type BehindResult =
  | { readonly ok: true; readonly state: BehindGameState }
  | { readonly ok: false; readonly state: BehindGameState; readonly error: string };

export function createBehindGame(shoeId: string, random: RandomSource, withHuman = true): BehindGameState {
  const { bankrolls, ...table } = optional.createOptionalGame(shoeId, random);
  return { table, backWagers: [], backExposures: [], backResults: [], followWindow: null, followDecisions: [],
    human: withHuman ? { participantId: 'local-human', bankroll: createBankroll() } : null,
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
    ? { ...state.human!.bankroll, reserved: state.human!.bankroll.reserved - backReserve(state) } : entry.bankroll) };
}
function backReserve(state: BehindGameState): number {
  if (state.table.phase === 'COMMITTED' || state.table.phase === 'VOID') return 0;
  return (state.table.phase === 'CLOSED' ? state.backExposures : state.backWagers)
    .reduce((sum, wager) => sum + wager.stakeUnits, 0);
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
    human: state.human && humanSeat !== null ? { ...state.human, bankroll: {
      ...bankrolls[humanSeat - 1], reserved: bankrolls[humanSeat - 1].reserved + backReserve(state) } } : state.human,
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
  const result = run(state, (entry) => optional.cancelOptionalMainWager(entry, seatNumber));
  if (!result.ok) return result;
  const dependent = result.state.backWagers.find((wager) => wager.targetSeat === seatNumber);
  return dependent ? { ok: true, state: removeBackWager(result.state, dependent) } : result;
}
function moveBackReserve(state: BehindGameState, delta: number): BehindGameState {
  const human = state.human!;
  return { ...state, human: { ...human, bankroll: { available: human.bankroll.available - delta,
    reserved: human.bankroll.reserved + delta } } };
}
function removeBackWager(state: BehindGameState, wager: BackWager): BehindGameState {
  return { ...moveBackReserve(state, -wager.stakeUnits), backWagers: state.backWagers.filter((entry) => entry !== wager) };
}
function qualifyingTarget(state: BehindGameState, targetSeat: number): boolean {
  const seat = state.table.game.table.seats.find((entry) => entry.seatNumber === targetSeat);
  const wager = state.table.wagers.find((entry) => entry.seatNumber === targetSeat);
  return !!seat && seat.occupancy !== 'EMPTY' && !seat.sittingOut && targetSeat !== controlledSeat(state)
    && !!wager && isMainWager(wager.stakeUnits)
    && state.computers[targetSeat - 1].bankroll.reserved >= wager.stakeUnits;
}
// Target-stake semantics: a repeated same-target request never creates a second wager.
export function setBackWager(state: BehindGameState, targetSeat: number, stakeUnits: number): BehindResult {
  if (state.table.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  if (!state.human) return { ok: false, state, error: 'NO_HUMAN_PARTICIPANT' };
  if (!qualifyingTarget(state, targetSeat)) return { ok: false, state, error: 'INELIGIBLE_BACK_TARGET' };
  if (!isMainWager(stakeUnits)) return { ok: false, state, error: 'INVALID_BACK_WAGER' };
  const existing = state.backWagers.find((entry) => entry.targetSeat === targetSeat);
  const delta = stakeUnits - (existing?.stakeUnits ?? 0);
  if (delta > state.human.bankroll.available) return { ok: false, state, error: 'INSUFFICIENT_FUNDS' };
  if (delta === 0) return { ok: true, state };
  const handId = `round-${state.table.roundNumber}/seat-${targetSeat}`;
  const wager: BackWager = { participantId: state.human.participantId, targetSeat, handId,
    wagerId: `${handId}/BACK/${state.human.participantId}`, stakeUnits };
  return { ok: true, state: { ...moveBackReserve(state, delta),
    backWagers: [...state.backWagers.filter((entry) => entry !== existing), wager]
      .sort((left, right) => left.targetSeat - right.targetSeat) } };
}
export function cancelBackWager(state: BehindGameState, targetSeat: number): BehindResult {
  if (state.table.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  const wager = state.backWagers.find((entry) => entry.targetSeat === targetSeat);
  return wager ? { ok: true, state: removeBackWager(state, wager) } : { ok: false, state, error: 'NO_BACK_WAGER' };
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
  if (state.table.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  let eligible = state;
  for (const wager of state.backWagers) {
    if (!qualifyingTarget(state, wager.targetSeat)) eligible = removeBackWager(eligible, wager);
  }
  const result = run(eligible, (entry) => optional.closeOptionalBetting(entry, replacementShoeId, random));
  if (!result.ok) return { ok: false, state, error: result.error };
  return { ok: true, state: { ...result.state,
    backExposures: Object.freeze(result.state.backWagers.map((wager) => Object.freeze({ ...wager, parentHandId: null }))),
    backWagers: Object.freeze(result.state.backWagers.map((wager) => Object.freeze({ ...wager }))) } };
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
  if (state.followWindow) return { ok: false, state, error: 'FOLLOW_PENDING' };
  const seat = controlledSeat(state);
  if (seat === null) return { ok: false, state, error: 'NOT_SEATED' };
  const commands = { HIT: optional.hitOptionalHand, STAND: optional.standOptionalHand,
    DOUBLE: optional.doubleOptionalHand, SPLIT: optional.splitOptionalHand, SURRENDER: optional.surrenderOptionalHand };
  if (!Object.hasOwn(commands, action)) return { ok: false, state, error: 'INVALID_ACTION' };
  return run(state, (entry) => commands[action](entry, seat, handId));
}
export function advanceBehindTable(state: BehindGameState): BehindResult {
  if (state.followWindow) return { ok: true, state };
  return run(state, optional.advanceOptionalTable);
}
export function settleBehindWagers(state: BehindGameState): BehindResult {
  if (state.followWindow) return { ok: false, state, error: 'FOLLOW_PENDING' };
  const records = getBackResults(state);
  if (state.table.phase !== 'CLOSED' || records.length !== state.backExposures.length) {
    return { ok: false, state, error: 'SETTLEMENT_NOT_READY' };
  }
  const main = run(state, optional.settleOptionalWagers);
  if (!main.ok) return main;
  const human = main.state.human;
  const gross = records.reduce((sum, record) => sum + record.grossReturnUnits, 0);
  if (human && (!isBankroll(human.bankroll) || human.bankroll.reserved !== backReserve(state)
    || !isCreditUnits(human.bankroll.available + gross))) return { ok: false, state, error: 'INVALID_BACK_SETTLEMENT' };
  return { ok: true, state: { ...main.state,
    human: human ? { ...human, bankroll: { available: human.bankroll.available + gross, reserved: 0 } } : null,
    backResults: Object.freeze(records.map((record) => Object.freeze({ ...record, status: 'COMMITTED' as const }))) } };
}
export function getBackResults(state: BehindGameState): readonly BackResult[] {
  if (state.table.phase === 'COMMITTED' || state.table.phase === 'VOID') return state.backResults;
  const round = state.table.game.round;
  if (state.table.phase !== 'CLOSED' || !round || round.phase === 'INTEGRITY_ERROR'
    || state.table.decisionPhase !== 'NONE') return [];
  return state.backExposures.flatMap((exposure): BackResult[] => {
    const outcome = round.players.find((hand) => hand.handId === exposure.handId)?.outcome;
    if (!outcome) return [];
    const stake = exposure.stakeUnits;
    const gross = outcome === 'PLAYER_BLACKJACK' ? stake / 2 * 5 : outcome === 'PLAYER_WIN' ? stake * 2
      : outcome === 'PUSH' ? stake : outcome === 'SURRENDERED' ? stake / 2 : 0;
    return [{ ...exposure, roundId: round.roundId, outcome, grossReturnUnits: gross,
      netUnits: gross - stake, status: 'PENDING' }];
  });
}
export function voidBehindRound(state: BehindGameState): BehindResult {
  if (state.backWagers.length) return { ok: false, state, error: 'BACK_SETTLEMENT_NOT_IMPLEMENTED' };
  return run(state, optional.voidOptionalRound);
}
export function prepareNextBehindRound(state: BehindGameState): BehindResult {
  const result = run(state, optional.prepareNextOptionalRound);
  return result.ok ? { ok: true, state: { ...result.state, backWagers: [], backExposures: [], backResults: [],
    followWindow: null, followDecisions: [] } } : result;
}
