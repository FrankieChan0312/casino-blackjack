import * as advanced from './advancedGame.js';
import { CLASSIC, type ProfileId } from './profile.js';
import { isMainWager } from './bettingGame.js';
import { isBankroll, isCreditUnits } from './credits.js';
import type { RandomSource } from './random.js';
import { freezeTableSeats, releaseTableSeats, type SeatState } from './table.js';
import { classifyPair, classifyThreeCard, sideGross, type PairCategory, type ThreeCardCategory } from './sideBets.js';
import { isNaturalBlackjack } from './hand.js';
import { completeShoeRound, drawCard, prepareShoeForNextRound } from './shoe.js';

export type SideWagerType = 'PAIR' | 'THREE_CARD';
export interface SideWager {
  readonly seatNumber: number;
  readonly type: SideWagerType;
  readonly stakeUnits: number;
}
export interface OptionalGameState extends advanced.AdvancedGameState {
  readonly sideWagers: readonly SideWager[];
  readonly sideResults: readonly SideResult[];
  // M4 gameplay is dormant while this explicit M5 decision phase is open.
  readonly decisionPhase: 'NONE' | 'INSURANCE';
  readonly insuranceDecisions: readonly InsuranceDecision[];
  readonly peekPerformed: boolean;
  readonly wagerResults: readonly OptionalWagerResult[];
}
interface WagerRecord {
  readonly roundId: string;
  readonly seatNumber: number;
  readonly wagerId: string;
  readonly stakeUnits: number;
  readonly grossReturnUnits: number;
  readonly netUnits: number;
  readonly status: 'PENDING' | 'COMMITTED' | 'REFUNDED';
}
export type OptionalWagerResult = WagerRecord & (
  | { readonly type: 'MAIN'; readonly handId: string; readonly outcome: OptionalMainResult['outcome'] }
  | { readonly type: SideWagerType; readonly handId: null; readonly outcome: PairCategory | ThreeCardCategory | 'VOID' }
  | { readonly type: 'INSURANCE'; readonly handId: null; readonly outcome: 'WIN' | 'LOSS' | 'VOID' }
);
export interface InsuranceDecision {
  readonly seatNumber: number;
  readonly choice: 'PENDING' | 'DECLINE' | 'INSURANCE' | 'EVEN_MONEY';
  readonly stakeUnits: number;
  readonly outcome?: 'WIN' | 'LOSS';
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

export function createOptionalGame(shoeId: string, random: RandomSource, profileId: ProfileId = CLASSIC): OptionalGameState {
  return { ...advanced.createAdvancedGame(shoeId, random, profileId), sideWagers: [], sideResults: [],
    decisionPhase: 'NONE', insuranceDecisions: [], peekPerformed: false, wagerResults: [] };
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
export function closeOptionalBetting(state: OptionalGameState, replacementShoeId: string, random: RandomSource,
  deferAceForBackBettors = false): OptionalResult {
  if (state.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  if (state.wagers.length === 0) return { ok: false, state, error: 'NO_FUNDED_SEATS' };
  const seats = state.game.table.seats;
  const frozen = freezeTableSeats({ ...state.game.table, seats: seats.map((seat) => seat.occupancy !== 'EMPTY'
    && !state.wagers.some((wager) => wager.seatNumber === seat.seatNumber) ? { ...seat, sittingOut: true } : seat) });
  if (!frozen.ok) return { ok: false, state, error: frozen.error };
  const roundId = `round-${state.roundNumber}`;
  let players = frozen.table.activeSeats!.map((seat): advanced.AdvancedHand => {
    const handId = `${roundId}/seat-${seat.seatNumber}`;
    return { seatNumber: seat.seatNumber, controller: seat.occupancy === 'HUMAN' ? 'HUMAN' : 'COMPUTER',
      handId, rootHandId: handId, parentHandId: null, origin: 'ORIGINAL', originalCards: [], cards: [],
      splitAces: false, decisionTaken: false, complete: false,
      stakeUnits: state.wagers.find((wager) => wager.seatNumber === seat.seatNumber)!.stakeUnits };
  });
  let shoe = prepareShoeForNextRound(state.game.shoe, replacementShoeId, random, 2 * players.length + 2);
  const dealerCards: advanced.AdvancedRound['dealerCards'][number][] = [];
  let fault: advanced.AdvancedRound['integrityError'];
  deal: for (let pass = 0; pass < 2; pass++) {
    for (let index = 0; index <= players.length; index++) {
      const draw = drawCard(shoe);
      shoe = draw.shoe;
      if (!draw.ok) { fault = draw.error; break deal; }
      if (index === players.length) dealerCards.push(draw.card);
      else players[index] = { ...players[index], cards: [...players[index].cards, draw.card] };
    }
  }
  players = players.map((hand) => ({ ...hand, originalCards: Object.freeze([...hand.cards]), complete: !!fault }));
  const round: advanced.AdvancedRound = { roundId, players, dealerCards,
    seats: Object.freeze(seats.map((seat) => Object.freeze({ ...seat }))),
    phase: fault ? 'INTEGRITY_ERROR' : 'PLAYER_TURN', integrityError: fault,
    currentSeat: null, currentHandId: null, dealerNaturalExcluded: false };
  const table = { ...frozen.table, seats };
  const dealt: OptionalGameState = { ...state, phase: 'CLOSED', results: [], sideResults: [],
    insuranceDecisions: [], decisionPhase: 'NONE', peekPerformed: false,
    wagers: Object.freeze(state.wagers.map((entry) => Object.freeze({ ...entry }))),
    game: { table: fault ? releaseTableSeats(table) : table,
      shoe: fault ? { ...shoe, retired: true } : shoe, round },
    sideWagers: Object.freeze(state.sideWagers.map((entry) => Object.freeze({ ...entry }))) };
  const sideResults = round.phase === 'INTEGRITY_ERROR' ? [] : state.sideWagers.map((wager): SideResult => {
    const original = round.players.find((hand) => hand.seatNumber === wager.seatNumber)!.originalCards;
    const category = wager.type === 'PAIR' ? classifyPair(original)
      : classifyThreeCard([...original, round.dealerCards[0]]);
    const grossReturnUnits = sideGross(wager.stakeUnits, category);
    return Object.freeze({ ...wager, roundId: round.roundId, category, grossReturnUnits,
      netUnits: grossReturnUnits - wager.stakeUnits, status: 'PENDING' });
  });
  let next = { ...dealt, sideResults: Object.freeze(sideResults) };
  if (fault) return { ok: true, state: next };
  if (dealerCards[0].rank === 'A') {
    next = { ...next, decisionPhase: 'INSURANCE', insuranceDecisions: players.map((hand) => ({
      seatNumber: hand.seatNumber, choice: hand.controller === 'COMPUTER' ? 'DECLINE' : 'PENDING', stakeUnits: 0 })) };
    if (deferAceForBackBettors || next.insuranceDecisions.some((entry) => entry.choice === 'PENDING')) return { ok: true, state: next };
  }
  return { ok: true, state: resolveInitialDecisions(next) };
}

// Additive M6 orchestration seam; original three-argument close behaviour is unchanged.
export function closeDeferredAceDecisions(state: OptionalGameState): OptionalResult {
  if (state.phase !== 'CLOSED' || state.decisionPhase !== 'INSURANCE' || state.peekPerformed
    || state.insuranceDecisions.some((entry) => entry.choice === 'PENDING')) {
    return { ok: false, state, error: 'INSURANCE_NOT_READY' };
  }
  return { ok: true, state: resolveInitialDecisions(state) };
}

// Called once, only after every Ace decision is closed (or directly for non-Ace).
function resolveInitialDecisions(state: OptionalGameState): OptionalGameState {
  const round = state.game.round!;
  const peek = ['A', '10', 'J', 'Q', 'K'].includes(round.dealerCards[0].rank);
  const dealerNatural = peek && isNaturalBlackjack(round.dealerCards, true);
  const players = round.players.map((hand): advanced.AdvancedHand => {
    const natural = isNaturalBlackjack(hand.originalCards, true);
    if (dealerNatural) return { ...hand, complete: true, outcome: natural ? 'PUSH' : 'DEALER_WIN',
      outcomeReason: natural ? 'BOTH_NATURAL' : 'DEALER_NATURAL' };
    return natural ? { ...hand, complete: true, outcome: 'PLAYER_BLACKJACK', outcomeReason: 'PLAYER_NATURAL' } : hand;
  });
  const current = players.find((hand) => !hand.complete);
  return { ...state, decisionPhase: 'NONE', peekPerformed: peek,
    insuranceDecisions: state.insuranceDecisions.map((entry) => entry.choice === 'INSURANCE'
      ? { ...entry, outcome: dealerNatural ? 'WIN' : 'LOSS' } : entry),
    game: { ...state.game, table: current ? state.game.table : releaseTableSeats(state.game.table),
      shoe: current ? state.game.shoe : completeShoeRound(state.game.shoe),
      round: { ...round, players, phase: current ? 'PLAYER_TURN' : 'ROUND_COMPLETE',
        currentSeat: current?.seatNumber ?? null, currentHandId: current?.handId ?? null,
        dealerNaturalExcluded: !dealerNatural } } };
}
export function decideInsurance(state: OptionalGameState, seatNumber: number, purchase: boolean): OptionalResult {
  if (state.phase !== 'CLOSED' || state.decisionPhase !== 'INSURANCE' || state.peekPerformed) {
    return { ok: false, state, error: 'INSURANCE_NOT_OPEN' };
  }
  const decision = state.insuranceDecisions.find((entry) => entry.seatNumber === seatNumber);
  if (!decision || decision.choice !== 'PENDING') return { ok: false, state, error: 'DECISION_CLOSED' };
  const stakeUnits = purchase ? state.wagers.find((entry) => entry.seatNumber === seatNumber)!.stakeUnits / 2 : 0;
  if (stakeUnits > state.bankrolls[seatNumber - 1].available) return { ok: false, state, error: 'INSUFFICIENT_FUNDS' };
  const next: OptionalGameState = { ...moveReserve(state, seatNumber, stakeUnits),
    insuranceDecisions: state.insuranceDecisions.map((entry) => entry === decision
      ? { seatNumber, choice: purchase ? 'INSURANCE' : 'DECLINE', stakeUnits } : entry) };
  return { ok: true, state: next.insuranceDecisions.some((entry) => entry.choice === 'PENDING')
    ? next : resolveInitialDecisions(next) };
}
export function electEvenMoney(state: OptionalGameState, seatNumber: number): OptionalResult {
  if (state.phase !== 'CLOSED' || state.decisionPhase !== 'INSURANCE' || state.peekPerformed) {
    return { ok: false, state, error: 'EVEN_MONEY_NOT_OPEN' };
  }
  const decision = state.insuranceDecisions.find((entry) => entry.seatNumber === seatNumber);
  const hand = state.game.round!.players.find((entry) => entry.seatNumber === seatNumber);
  if (!decision || decision.choice !== 'PENDING' || !hand || !advanced.isAdvancedNatural(hand)) {
    return { ok: false, state, error: 'EVEN_MONEY_NOT_ALLOWED' };
  }
  const next: OptionalGameState = { ...state, insuranceDecisions: state.insuranceDecisions.map((entry) => entry === decision
    ? { seatNumber, choice: 'EVEN_MONEY', stakeUnits: 0 } : entry) };
  return { ok: true, state: next.insuranceDecisions.some((entry) => entry.choice === 'PENDING')
    ? next : resolveInitialDecisions(next) };
}
export interface OptionalMainResult extends Omit<advanced.HandWagerResult, 'outcome'> {
  readonly outcome: advanced.HandWagerResult['outcome'] | 'EVEN_MONEY';
}
export function getOptionalMainResults(state: OptionalGameState): readonly OptionalMainResult[] {
  if (state.phase === 'COMMITTED' || state.phase === 'VOID') {
    return state.wagerResults.flatMap((entry) => entry.type === 'MAIN' ? [entry] : []);
  }
  if (state.decisionPhase === 'INSURANCE') return [];
  return advanced.getAdvancedResults(state).map((entry) => {
    const elected = state.insuranceDecisions.some((decision) => decision.seatNumber === entry.seatNumber
      && decision.choice === 'EVEN_MONEY');
    return elected && entry.outcome !== 'VOID' ? { ...entry, outcome: 'EVEN_MONEY' as const,
      grossReturnUnits: 2 * entry.stakeUnits, netUnits: entry.stakeUnits } : entry;
  });
}
function play(state: OptionalGameState, command: (state: advanced.AdvancedGameState) => advanced.AdvancedResult): OptionalResult {
  if (state.decisionPhase === 'INSURANCE') return { ok: false, state, error: 'INSURANCE_PENDING' };
  const result = adapt(state, command(state));
  return result.ok && result.state.game.round?.phase === 'INTEGRITY_ERROR'
    ? { ok: true, state: { ...result.state, sideResults: [], insuranceDecisions: result.state.insuranceDecisions
      .map((entry) => ({ ...entry, outcome: undefined })) } } : result;
}
export function hitOptionalHand(state: OptionalGameState, seatNumber: number, handId: string): OptionalResult {
  return play(state, (entry) => advanced.hitAdvancedHand(entry, seatNumber, handId));
}
export function standOptionalHand(state: OptionalGameState, seatNumber: number, handId: string): OptionalResult {
  return play(state, (entry) => advanced.standAdvancedHand(entry, seatNumber, handId));
}
export function doubleOptionalHand(state: OptionalGameState, seatNumber: number, handId: string): OptionalResult {
  return play(state, (entry) => advanced.doubleAdvancedHand(entry, seatNumber, handId));
}
export function splitOptionalHand(state: OptionalGameState, seatNumber: number, handId: string): OptionalResult {
  return play(state, (entry) => advanced.splitAdvancedHand(entry, seatNumber, handId));
}
export function surrenderOptionalHand(state: OptionalGameState, seatNumber: number, handId: string): OptionalResult {
  return play(state, (entry) => advanced.surrenderAdvancedHand(entry, seatNumber, handId));
}
export function advanceOptionalTable(state: OptionalGameState): OptionalResult {
  if (state.phase === 'CLOSED' && state.decisionPhase === 'INSURANCE') return { ok: true, state };
  return play(state, advanced.advanceAdvancedTable);
}
export function resolveOptionalDealer(state: OptionalGameState): OptionalResult {
  return play(state, advanced.resolveAdvancedDealer);
}

export function getOptionalWagerResults(state: OptionalGameState): readonly OptionalWagerResult[] {
  if (state.phase === 'COMMITTED' || state.phase === 'VOID') return state.wagerResults;
  const round = state.game.round;
  if (state.phase !== 'CLOSED' || !round || round.phase === 'INTEGRITY_ERROR') return [];
  const main = getOptionalMainResults(state).map((entry): OptionalWagerResult => ({ ...entry,
    type: 'MAIN', wagerId: `${entry.handId}/MAIN` }));
  const sides = state.sideResults.map((entry): OptionalWagerResult => ({ roundId: round.roundId,
    seatNumber: entry.seatNumber, wagerId: `${round.roundId}/seat-${entry.seatNumber}/${entry.type}`,
    type: entry.type, handId: null, stakeUnits: entry.stakeUnits, outcome: entry.category,
    grossReturnUnits: entry.grossReturnUnits, netUnits: entry.netUnits, status: 'PENDING' }));
  const insurance = state.insuranceDecisions.flatMap((entry): OptionalWagerResult[] => {
    if (entry.choice !== 'INSURANCE' || entry.outcome === undefined) return [];
    const gross = entry.outcome === 'WIN' ? entry.stakeUnits * 3 : 0;
    return [{ roundId: round.roundId, seatNumber: entry.seatNumber,
      wagerId: `${round.roundId}/seat-${entry.seatNumber}/INSURANCE`, type: 'INSURANCE', handId: null,
      stakeUnits: entry.stakeUnits, outcome: entry.outcome, grossReturnUnits: gross,
      netUnits: gross - entry.stakeUnits, status: 'PENDING' }];
  });
  return [...main, ...sides, ...insurance];
}
function commitRecords(state: OptionalGameState, records: readonly OptionalWagerResult[],
  phase: 'COMMITTED' | 'VOID'): OptionalResult {
  const bankrolls = state.bankrolls.map((bankroll, index) => {
    const own = records.filter((entry) => entry.seatNumber === index + 1);
    const stake = own.reduce((sum, entry) => sum + entry.stakeUnits, 0);
    const gross = own.reduce((sum, entry) => sum + entry.grossReturnUnits, 0);
    if (!isBankroll(bankroll) || bankroll.reserved !== stake || !isCreditUnits(bankroll.available + gross)) return null;
    return { available: bankroll.available + gross, reserved: 0 };
  });
  if (bankrolls.some((entry) => entry === null)) return { ok: false, state, error: 'INVALID_SETTLEMENT_FUNDS' };
  return { ok: true, state: { ...state, phase, bankrolls: bankrolls.map((entry) => entry!),
    sideResults: [], insuranceDecisions: state.insuranceDecisions.map((entry) => ({ ...entry, outcome: undefined })),
    wagerResults: Object.freeze(records.map((entry) => Object.freeze({ ...entry,
      status: phase === 'VOID' ? 'REFUNDED' as const : 'COMMITTED' as const }))) } };
}
export function settleOptionalWagers(state: OptionalGameState): OptionalResult {
  if (state.phase !== 'CLOSED' || state.decisionPhase !== 'NONE' || state.game.round?.phase !== 'ROUND_COMPLETE') {
    return { ok: false, state, error: 'SETTLEMENT_NOT_READY' };
  }
  const pending = getOptionalWagerResults(state);
  const expectedCount = state.game.round.players.length + state.sideWagers.length
    + state.insuranceDecisions.filter((entry) => entry.choice === 'INSURANCE').length;
  if (pending.length !== expectedCount) return { ok: false, state, error: 'MISSING_OUTCOMES' };
  return commitRecords(state, pending, 'COMMITTED');
}
export function voidOptionalRound(state: OptionalGameState): OptionalResult {
  const round = state.game.round;
  if (state.phase !== 'CLOSED' || !round || round.phase !== 'INTEGRITY_ERROR') return { ok: false, state, error: 'VOID_NOT_REQUIRED' };
  const record = (seatNumber: number, stakeUnits: number) => ({ roundId: round.roundId, seatNumber,
    stakeUnits, grossReturnUnits: stakeUnits, netUnits: 0, status: 'REFUNDED' as const, outcome: 'VOID' as const });
  const main = round.players.map((hand): OptionalWagerResult => ({ ...record(hand.seatNumber, hand.stakeUnits),
    handId: hand.handId, type: 'MAIN', wagerId: `${hand.handId}/MAIN` }));
  const sides = state.sideWagers.map((wager): OptionalWagerResult => ({ ...record(wager.seatNumber, wager.stakeUnits),
    handId: null, type: wager.type, wagerId: `${round.roundId}/seat-${wager.seatNumber}/${wager.type}` }));
  const insurance = state.insuranceDecisions.filter((entry) => entry.choice === 'INSURANCE')
    .map((entry): OptionalWagerResult => ({ ...record(entry.seatNumber, entry.stakeUnits), handId: null,
      type: 'INSURANCE', wagerId: `${round.roundId}/seat-${entry.seatNumber}/INSURANCE` }));
  return commitRecords(state, [...main, ...sides, ...insurance], 'VOID');
}
export function prepareNextOptionalRound(state: OptionalGameState): OptionalResult {
  if (state.phase !== 'COMMITTED' && state.phase !== 'VOID') return { ok: false, state, error: 'ROUND_NOT_FINALIZED' };
  return { ok: true, state: { ...state, phase: 'CONFIGURING', wagers: [], sideWagers: [], sideResults: [],
    results: [], wagerResults: [], insuranceDecisions: [], decisionPhase: 'NONE', peekPerformed: false } };
}
