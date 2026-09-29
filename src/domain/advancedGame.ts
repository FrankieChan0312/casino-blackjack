import * as betting from './bettingGame.js';
import type { PhysicalCard } from './card.js';
import { computerDecision } from './computer.js';
import { isBankroll, isCreditUnits } from './credits.js';
import { dealerShouldHit } from './dealer.js';
import type { OutcomeReason, RoundOutcome } from './game.js';
import { evaluateHand, isNaturalBlackjack } from './hand.js';
import { ordinaryOutcome } from './outcome.js';
import type { RandomSource } from './random.js';
import { completeShoeRound, drawCard } from './shoe.js';
import { releaseTableSeats, type SeatState } from './table.js';
import type { TableGameState, TableRoundState } from './tableGame.js';

export interface AdvancedHand {
  readonly handId: string;
  readonly rootHandId: string;
  readonly parentHandId: string | null;
  readonly seatNumber: number;
  readonly controller: 'HUMAN' | 'COMPUTER';
  readonly origin: 'ORIGINAL' | 'SPLIT';
  readonly originalCards: readonly PhysicalCard[];
  readonly cards: readonly PhysicalCard[];
  readonly splitAces: boolean;
  readonly stakeUnits: number;
  readonly decisionTaken: boolean;
  readonly complete: boolean;
  readonly outcome?: RoundOutcome | 'SURRENDERED';
  readonly outcomeReason?: OutcomeReason | 'LATE_SURRENDER';
}

export interface AdvancedRound extends Omit<TableRoundState, 'players'> {
  // Ordered leaves only: all hands for one seat precede the next seat.
  readonly players: readonly AdvancedHand[];
  readonly currentHandId: string | null;
  readonly dealerNaturalExcluded: boolean;
}
export interface HandWagerResult extends Omit<betting.MainWagerResult, 'outcome'> {
  readonly handId: string;
  readonly outcome: RoundOutcome | 'SURRENDERED' | 'VOID';
}
export interface AdvancedGameState extends Omit<betting.BettingGameState, 'game' | 'results'> {
  readonly game: Omit<TableGameState, 'round'> & { readonly round: AdvancedRound | null };
  readonly results: readonly HandWagerResult[];
}
export type AdvancedResult =
  | { readonly ok: true; readonly state: AdvancedGameState }
  | { readonly ok: false; readonly state: AdvancedGameState; readonly error: string };

export function createAdvancedGame(shoeId: string, random: RandomSource): AdvancedGameState {
  const state = betting.createBettingGame(shoeId, random);
  return { ...state, game: { ...state.game, round: null }, results: [] };
}

// Only pre-deal commands use M3. An archived M4 round is not fed back to the
// one-hand engine. Restore it after configuration/bet edits; close creates a new round.
function preDeal(state: AdvancedGameState,
  command: (legacy: betting.BettingGameState) => betting.BettingResult): AdvancedResult {
  if (state.phase !== 'CONFIGURING' && state.phase !== 'OPEN') return { ok: false, state, error: 'WRONG_PHASE' };
  const legacy: betting.BettingGameState = { ...state, game: { ...state.game, round: null }, results: [] };
  const result = command(legacy);
  if (!result.ok) return { ok: false, state, error: result.error };
  if (result.state === legacy) return { ok: true, state };
  return { ok: true, state: { ...result.state,
    game: { ...result.state.game, round: state.game.round }, results: state.results } };
}
export function configureAdvancedSeats(state: AdvancedGameState, updates: readonly SeatState[]): AdvancedResult {
  return preDeal(state, (legacy) => betting.configureBettingSeats(legacy, updates));
}
export function openAdvancedBetting(state: AdvancedGameState): AdvancedResult {
  return preDeal(state, betting.openBetting);
}
export function setAdvancedWager(state: AdvancedGameState, seatNumber: number, stakeUnits: number): AdvancedResult {
  return preDeal(state, (legacy) => betting.setMainWager(legacy, seatNumber, stakeUnits));
}
export function cancelAdvancedWager(state: AdvancedGameState, seatNumber: number): AdvancedResult {
  return preDeal(state, (legacy) => betting.cancelMainWager(legacy, seatNumber));
}
export function closeAdvancedBetting(state: AdvancedGameState, replacementShoeId: string,
  random: RandomSource): AdvancedResult {
  if (state.phase !== 'OPEN') return { ok: false, state, error: 'BETTING_NOT_OPEN' };
  const dealt = betting.closeBetting({ ...state, game: { ...state.game, round: null }, results: [] }, replacementShoeId, random);
  if (!dealt.ok) return { ok: false, state, error: dealt.error };
  const round = dealt.state.game.round!;
  const players = round.players.map((player): AdvancedHand => {
    const handId = `${round.roundId}/seat-${player.seatNumber}`;
    return { ...player, handId, rootHandId: handId, parentHandId: null, origin: 'ORIGINAL',
      originalCards: Object.freeze([...player.cards]), splitAces: false, decisionTaken: false,
      stakeUnits: state.wagers.find((wager) => wager.seatNumber === player.seatNumber)!.stakeUnits };
  });
  return { ok: true, state: { ...dealt.state, results: [], game: { ...dealt.state.game,
    round: { ...round, players, currentHandId: players.find((hand) => !hand.complete)?.handId ?? null,
      // M3 initial dealing already performs immediate Ace/ten peek, without Insurance.
      dealerNaturalExcluded: round.phase !== 'INTEGRITY_ERROR' && !isNaturalBlackjack(round.dealerCards, true) } } } };
}

export function isAdvancedNatural(hand: AdvancedHand): boolean {
  return isNaturalBlackjack(hand.cards, hand.origin === 'ORIGINAL' && hand.parentHandId === null);
}

function phaseError(state: AdvancedGameState, phase?: AdvancedRound['phase']): string | undefined {
  if (state.phase !== 'CLOSED') return 'WRONG_PHASE';
  const round = state.game.round;
  if (!round) return 'NO_ROUND';
  if (round.phase === 'ROUND_COMPLETE' || round.phase === 'INTEGRITY_ERROR') return 'ROUND_ALREADY_TERMINAL';
  if (phase && round.phase !== phase) return 'WRONG_PHASE';
  return undefined;
}
function humanError(state: AdvancedGameState, seatNumber: number, handId: string): string | undefined {
  const error = phaseError(state, 'PLAYER_TURN');
  if (error) return error;
  const round = state.game.round!;
  if (round.currentSeat !== seatNumber) return 'WRONG_SEAT';
  const hand = round.players.find((entry) => entry.handId === handId);
  if (round.currentHandId !== handId || !hand || hand.complete) return 'WRONG_HAND';
  if (hand.controller !== 'HUMAN') return 'NOT_HUMAN';
  return undefined;
}
function replaceHand(state: AdvancedGameState, hand: AdvancedHand): AdvancedGameState {
  const round = state.game.round!;
  return { ...state, game: { ...state.game, round: { ...round,
    players: round.players.map((entry) => entry.handId === hand.handId ? hand : entry) } } };
}
function selectNextHand(state: AdvancedGameState): AdvancedGameState {
  const round = state.game.round!;
  const current = round.players.find((hand) => !hand.complete);
  if (current?.origin === 'SPLIT' && current.cards.length === 1) {
    const draw = drawCard(state.game.shoe);
    const next = { ...state, game: { ...state.game, shoe: draw.shoe } };
    if (!draw.ok) return integrityFailure(next, draw.error);
    const cards = [...current.cards, draw.card];
    // Activate one child at a time. Split Aces/ordinary 21 end decisions,
    // but remain ordinary hands requiring shared dealer comparison.
    return selectNextHand(replaceHand(next, { ...current, cards,
      complete: current.splitAces || evaluateHand(cards).isTwentyOne }));
  }
  return { ...state, game: { ...state.game, round: { ...round,
    currentSeat: current?.seatNumber ?? null, currentHandId: current?.handId ?? null,
    phase: current ? 'PLAYER_TURN' : 'DEALER_TURN' } } };
}
function integrityFailure(state: AdvancedGameState,
  error: NonNullable<AdvancedRound['integrityError']>): AdvancedGameState {
  const round = state.game.round!;
  return { ...state, game: { ...state.game, table: releaseTableSeats(state.game.table),
    shoe: { ...state.game.shoe, retired: true }, round: { ...round, phase: 'INTEGRITY_ERROR',
      integrityError: error, currentSeat: null, currentHandId: null,
      players: round.players.map((hand) => ({ ...hand, complete: true, outcome: undefined, outcomeReason: undefined })) } } };
}
function applyAction(state: AdvancedGameState, action: 'HIT' | 'STAND' | 'DOUBLE'): AdvancedGameState {
  let hand = state.game.round!.players.find((entry) => entry.handId === state.game.round!.currentHandId)!;
  let next = state;
  if (action !== 'STAND') {
    const draw = drawCard(state.game.shoe);
    next = { ...state, game: { ...state.game, shoe: draw.shoe } };
    if (!draw.ok) return integrityFailure(next, draw.error);
    const cards = [...hand.cards, draw.card];
    const evaluation = evaluateHand(cards);
    hand = { ...hand, cards, decisionTaken: true,
      complete: action === 'DOUBLE' || evaluation.isBust || evaluation.isTwentyOne };
    if (evaluation.isBust) hand = { ...hand, outcome: 'DEALER_WIN', outcomeReason: 'PLAYER_BUST' };
  } else hand = { ...hand, decisionTaken: true, complete: true };
  return selectNextHand(replaceHand(next, hand));
}
export function hitAdvancedHand(state: AdvancedGameState, seatNumber: number, handId: string): AdvancedResult {
  const error = humanError(state, seatNumber, handId);
  return error ? { ok: false, state, error } : { ok: true, state: applyAction(state, 'HIT') };
}
export function standAdvancedHand(state: AdvancedGameState, seatNumber: number, handId: string): AdvancedResult {
  const error = humanError(state, seatNumber, handId);
  return error ? { ok: false, state, error } : { ok: true, state: applyAction(state, 'STAND') };
}
function additionalFundingError(state: AdvancedGameState, hand: AdvancedHand): string | undefined {
  const bankroll = state.bankrolls[hand.seatNumber - 1];
  if (!isBankroll(bankroll) || !isCreditUnits(hand.stakeUnits) || hand.stakeUnits === 0
    || !isCreditUnits(bankroll.reserved + hand.stakeUnits)) return 'INVALID_FUNDING';
  if (bankroll.available < hand.stakeUnits) return 'INSUFFICIENT_FUNDS';
  return undefined;
}
function reserveAdditional(state: AdvancedGameState, hand: AdvancedHand): AdvancedGameState {
  return { ...state, bankrolls: state.bankrolls.map((entry, index) => index === hand.seatNumber - 1
    ? { available: entry.available - hand.stakeUnits, reserved: entry.reserved + hand.stakeUnits } : entry) };
}
export function doubleAdvancedHand(state: AdvancedGameState, seatNumber: number, handId: string): AdvancedResult {
  const error = humanError(state, seatNumber, handId);
  if (error) return { ok: false, state, error };
  const hand = state.game.round!.players.find((entry) => entry.handId === handId)!;
  if (hand.cards.length !== 2 || hand.decisionTaken || hand.splitAces || evaluateHand(hand.cards).total >= 21) {
    return { ok: false, state, error: 'DOUBLE_NOT_ALLOWED' };
  }
  const fundingError = additionalFundingError(state, hand);
  if (fundingError) return { ok: false, state, error: fundingError };
  const funded = replaceHand(reserveAdditional(state, hand), { ...hand, stakeUnits: hand.stakeUnits * 2 });
  return { ok: true, state: applyAction(funded, 'DOUBLE') };
}
export function splitAdvancedHand(state: AdvancedGameState, seatNumber: number, handId: string): AdvancedResult {
  const error = humanError(state, seatNumber, handId);
  if (error) return { ok: false, state, error };
  const round = state.game.round!;
  const hand = round.players.find((entry) => entry.handId === handId)!;
  if (hand.cards.length !== 2 || hand.decisionTaken || hand.splitAces) {
    return { ok: false, state, error: 'SPLIT_NOT_ALLOWED' };
  }
  const [first, second] = hand.cards;
  const tenValues = ['10', 'J', 'Q', 'K'];
  if (first.rank !== second.rank && !(tenValues.includes(first.rank) && tenValues.includes(second.rank))) {
    return { ok: false, state, error: 'UNEQUAL_SPLIT_VALUE' };
  }
  if (round.players.filter((entry) => entry.rootHandId === hand.rootHandId).length >= 4) {
    return { ok: false, state, error: 'HAND_LIMIT_REACHED' };
  }
  const fundingError = additionalFundingError(state, hand);
  if (fundingError) return { ok: false, state, error: fundingError };
  const funded = reserveAdditional(state, hand);
  const children = hand.cards.map((card, index): AdvancedHand => ({ ...hand,
    handId: `${hand.handId}.${index + 1}`, parentHandId: hand.handId, origin: 'SPLIT', cards: [card],
    splitAces: first.rank === 'A', decisionTaken: false, complete: false, outcome: undefined, outcomeReason: undefined }));
  return { ok: true, state: selectNextHand({ ...funded, game: { ...funded.game, round: { ...round,
    players: round.players.flatMap((entry) => entry.handId === handId ? children : [entry]) } } }) };
}
export function surrenderAdvancedHand(state: AdvancedGameState, seatNumber: number, handId: string): AdvancedResult {
  const error = humanError(state, seatNumber, handId);
  if (error) return { ok: false, state, error };
  const round = state.game.round!;
  const hand = round.players.find((entry) => entry.handId === handId)!;
  if (!round.dealerNaturalExcluded || hand.origin !== 'ORIGINAL' || hand.parentHandId !== null
    || hand.splitAces || hand.cards.length !== 2 || hand.decisionTaken || isAdvancedNatural(hand)) {
    return { ok: false, state, error: 'SURRENDER_NOT_ALLOWED' };
  }
  return { ok: true, state: selectNextHand(replaceHand(state, { ...hand,
    decisionTaken: true, complete: true, outcome: 'SURRENDERED', outcomeReason: 'LATE_SURRENDER' })) };
}
export function resolveAdvancedDealer(state: AdvancedGameState): AdvancedResult {
  const error = phaseError(state, 'DEALER_TURN');
  if (error) return { ok: false, state, error };
  const round = state.game.round!;
  let next = state;
  let dealerCards = round.dealerCards;
  if (round.players.some((hand) => hand.outcome === undefined)) {
    while (dealerShouldHit(evaluateHand(dealerCards))) {
      const draw = drawCard(next.game.shoe);
      next = { ...next, game: { ...next.game, shoe: draw.shoe,
        round: { ...round, dealerCards } } };
      if (!draw.ok) return { ok: true, state: integrityFailure(next, draw.error) };
      dealerCards = [...dealerCards, draw.card];
    }
  }
  const dealer = evaluateHand(dealerCards);
  const players = round.players.map((hand) => hand.outcome !== undefined ? hand
    : { ...hand, ...ordinaryOutcome(evaluateHand(hand.cards), dealer) });
  return { ok: true, state: { ...next, game: { ...next.game, table: releaseTableSeats(next.game.table),
    shoe: completeShoeRound(next.game.shoe), round: { ...round, players, dealerCards, phase: 'ROUND_COMPLETE',
      currentSeat: null, currentHandId: null } } } };
}
export function advanceAdvancedTable(state: AdvancedGameState): AdvancedResult {
  const error = phaseError(state);
  if (error) return { ok: false, state, error };
  let next = state;
  while (next.game.round!.phase === 'PLAYER_TURN') {
    const hand = next.game.round!.players.find((entry) => entry.handId === next.game.round!.currentHandId)!;
    if (hand.controller === 'HUMAN') return { ok: true, state: next };
    next = applyAction(next, computerDecision(evaluateHand(hand.cards)));
  }
  return next.game.round!.phase === 'DEALER_TURN' ? resolveAdvancedDealer(next) : { ok: true, state: next };
}

export function getAdvancedResults(state: AdvancedGameState): readonly HandWagerResult[] {
  if (state.phase === 'COMMITTED' || state.phase === 'VOID') return state.results;
  const round = state.game.round;
  if (state.phase !== 'CLOSED' || !round || round.phase === 'INTEGRITY_ERROR') return [];
  return round.players.flatMap((hand): HandWagerResult[] => {
    if (hand.outcome === undefined) return [];
    const stake = hand.stakeUnits;
    const gross = hand.outcome === 'SURRENDERED' ? stake / 2 : hand.outcome === 'PLAYER_BLACKJACK' ? (stake / 2) * 5
      : hand.outcome === 'PLAYER_WIN' ? stake * 2 : hand.outcome === 'PUSH' ? stake : 0;
    return [{ roundId: round.roundId, seatNumber: hand.seatNumber, handId: hand.handId, stakeUnits: stake,
      outcome: hand.outcome, grossReturnUnits: gross, netUnits: gross - stake, status: 'PENDING' }];
  });
}
export function settleAdvancedWagers(state: AdvancedGameState): AdvancedResult {
  if (state.phase !== 'CLOSED' || state.game.round?.phase !== 'ROUND_COMPLETE') {
    return { ok: false, state, error: 'SETTLEMENT_NOT_READY' };
  }
  const pending = getAdvancedResults(state);
  if (pending.length !== state.game.round.players.length) return { ok: false, state, error: 'MISSING_OUTCOMES' };
  const bankrolls = state.bankrolls.map((bankroll, index) => {
    const records = pending.filter((entry) => entry.seatNumber === index + 1);
    const stake = records.reduce((sum, entry) => sum + entry.stakeUnits, 0);
    const gross = records.reduce((sum, entry) => sum + entry.grossReturnUnits, 0);
    if (!isBankroll(bankroll) || bankroll.reserved !== stake || !isCreditUnits(bankroll.available + gross)) return null;
    return { available: bankroll.available + gross, reserved: 0 };
  });
  if (bankrolls.some((entry) => entry === null)) return { ok: false, state, error: 'INVALID_SETTLEMENT_FUNDS' };
  return { ok: true, state: { ...state, phase: 'COMMITTED', bankrolls: bankrolls.map((entry) => entry!),
    results: Object.freeze(pending.map((entry) => Object.freeze({ ...entry, status: 'COMMITTED' as const }))) } };
}
export function voidAdvancedRound(state: AdvancedGameState): AdvancedResult {
  if (state.phase !== 'CLOSED' || state.game.round?.phase !== 'INTEGRITY_ERROR') return { ok: false, state, error: 'VOID_NOT_REQUIRED' };
  const round = state.game.round;
  if (state.bankrolls.some((bankroll, index) => !isBankroll(bankroll)
    || bankroll.reserved !== round.players.filter((hand) => hand.seatNumber === index + 1)
      .reduce((sum, hand) => sum + hand.stakeUnits, 0))) return { ok: false, state, error: 'INVALID_REFUND_FUNDS' };
  return { ok: true, state: { ...state, phase: 'VOID',
    bankrolls: state.bankrolls.map((entry) => ({ available: entry.available + entry.reserved, reserved: 0 })),
    results: Object.freeze(round.players.map((hand): HandWagerResult => Object.freeze({ roundId: round.roundId,
      seatNumber: hand.seatNumber, handId: hand.handId, stakeUnits: hand.stakeUnits, outcome: 'VOID',
      grossReturnUnits: hand.stakeUnits, netUnits: 0, status: 'REFUNDED' }))) } };
}
export function prepareNextAdvancedRound(state: AdvancedGameState): AdvancedResult {
  if (state.phase !== 'COMMITTED' && state.phase !== 'VOID') return { ok: false, state, error: 'ROUND_NOT_FINALIZED' };
  return { ok: true, state: { ...state, phase: 'CONFIGURING', wagers: [], results: [] } };
}
