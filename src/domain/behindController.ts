// Domain controller primitives, distinct from the local HUMAN command facade.
// Local COMPUTER automation never selects advanced actions. Deterministic tests
// may drive these primitives as the target controller, never as its follower.
import { controllerId, controlledSeat, type BehindGameState, type BehindResult } from './behindGame.js';
import type { AdvancedHand } from './advancedGame.js';
import { evaluateHand } from './hand.js';
import { isBankroll, isCreditUnits } from './credits.js';
import { drawCard } from './shoe.js';
import { releaseTableSeats } from './table.js';

function replace(state: BehindGameState, hand: AdvancedHand): BehindGameState {
  return { ...state, table: { ...state.table, game: { ...state.table.game, round: { ...state.table.game.round!,
    players: state.table.game.round!.players.map((entry) => entry.handId === hand.handId ? hand : entry) } } } };
}
function integrity(state: BehindGameState): BehindGameState {
  return { ...state, followWindow: null, backInsurance: state.backInsurance.map((entry) => ({ ...entry, outcome: undefined })),
    table: { ...state.table, sideResults: [],
    insuranceDecisions: state.table.insuranceDecisions.map((entry) => ({ ...entry, outcome: undefined })),
    game: { ...state.table.game, table: releaseTableSeats(state.table.game.table),
      shoe: { ...state.table.game.shoe, retired: true }, round: { ...state.table.game.round!, phase: 'INTEGRITY_ERROR',
        integrityError: 'SHOE_EXHAUSTED_DURING_ROUND', currentSeat: null, currentHandId: null,
        players: state.table.game.round!.players.map((hand) => ({ ...hand, complete: true,
          outcome: undefined, outcomeReason: undefined })) } } } };
}
function selectNext(state: BehindGameState): BehindGameState {
  const round = state.table.game.round!;
  const hand = round.players.find((entry) => !entry.complete);
  if (hand?.origin === 'SPLIT' && hand.cards.length === 1) {
    const draw = drawCard(state.table.game.shoe);
    const next = { ...state, table: { ...state.table, game: { ...state.table.game, shoe: draw.shoe } } };
    if (!draw.ok) return integrity(next);
    const cards = [...hand.cards, draw.card];
    return selectNext(replace(next, { ...hand, cards, complete: hand.splitAces || evaluateHand(cards).isTwentyOne }));
  }
  return { ...state, table: { ...state.table, game: { ...state.table.game, round: { ...round,
    currentSeat: hand?.seatNumber ?? null, currentHandId: hand?.handId ?? null,
    phase: hand ? 'PLAYER_TURN' : 'DEALER_TURN' } } } };
}
function finishDouble(state: BehindGameState, handId: string): BehindGameState {
  const hand = state.table.game.round!.players.find((entry) => entry.handId === handId)!;
  const draw = drawCard(state.table.game.shoe);
  const next = { ...state, table: { ...state.table, game: { ...state.table.game, shoe: draw.shoe } } };
  if (!draw.ok) return integrity(next);
  const cards = [...hand.cards, draw.card];
  const bust = evaluateHand(cards).isBust;
  return selectNext(replace(next, { ...hand, cards, complete: true, decisionTaken: true,
    outcome: bust ? 'DEALER_WIN' : undefined, outcomeReason: bust ? 'PLAYER_BUST' : undefined }));
}
export function beginControllerDouble(state: BehindGameState, ownerId: string, handId: string): BehindResult {
  const round = state.table.game.round;
  if (state.table.phase !== 'CLOSED' || state.table.decisionPhase !== 'NONE' || state.followWindow
    || round?.phase !== 'PLAYER_TURN') return { ok: false, state, error: 'WRONG_PHASE' };
  const hand = round.players.find((entry) => entry.handId === handId);
  if (!hand || round.currentHandId !== handId || hand.complete) return { ok: false, state, error: 'WRONG_HAND' };
  if (controllerId(state, hand.seatNumber) !== ownerId) return { ok: false, state, error: 'NOT_CONTROLLER' };
  if (hand.cards.length !== 2 || hand.decisionTaken || hand.splitAces || evaluateHand(hand.cards).total >= 21) {
    return { ok: false, state, error: 'DOUBLE_NOT_ALLOWED' };
  }
  const humanController = controlledSeat(state) === hand.seatNumber;
  const bankroll = humanController ? state.human!.bankroll : state.computers[hand.seatNumber - 1].bankroll;
  if (!isBankroll(bankroll) || !isCreditUnits(bankroll.reserved + hand.stakeUnits)) {
    return { ok: false, state, error: 'INVALID_FUNDING' };
  }
  if (bankroll.available < hand.stakeUnits) return { ok: false, state, error: 'INSUFFICIENT_FUNDS' };
  const funded = { available: bankroll.available - hand.stakeUnits, reserved: bankroll.reserved + hand.stakeUnits };
  const next = replace({ ...state,
    human: humanController ? { ...state.human!, bankroll: funded } : state.human,
    computers: humanController ? state.computers : state.computers.map((entry) => entry.seatNumber === hand.seatNumber
      ? { ...entry, bankroll: funded } : entry) }, { ...hand, stakeUnits: hand.stakeUnits * 2, decisionTaken: true });
  const exposure = state.backExposures.find((entry) => entry.handId === handId);
  return { ok: true, state: exposure ? { ...next, followWindow: { kind: 'DOUBLE', handId,
    targetSeat: hand.seatNumber, wagerId: exposure.wagerId } } : finishDouble(next, handId) };
}
export function decideDoubleFollow(state: BehindGameState, handId: string, choice: 'ADD' | 'NO_ADD'): BehindResult {
  const window = state.followWindow;
  if (!window || window.kind !== 'DOUBLE' || window.handId !== handId || state.table.phase !== 'CLOSED') {
    return { ok: false, state, error: 'NO_FOLLOW_DECISION' };
  }
  if (choice !== 'ADD' && choice !== 'NO_ADD') return { ok: false, state, error: 'INVALID_FOLLOW_CHOICE' };
  const exposure = state.backExposures.find((entry) => entry.handId === handId)!;
  const bankroll = state.human!.bankroll;
  const insufficient = choice === 'ADD' && bankroll.available < exposure.stakeUnits;
  const add = choice === 'ADD' && !insufficient;
  // Failed funding changes neither money nor exposure; resolve the documented
  // NO_ADD fallback separately in this transition before exposing any card.
  const next: BehindGameState = { ...state, followWindow: null,
    human: add ? { ...state.human!, bankroll: { available: bankroll.available - exposure.stakeUnits,
      reserved: bankroll.reserved + exposure.stakeUnits } } : state.human,
    backExposures: add ? state.backExposures.map((entry) => entry === exposure
      ? { ...entry, stakeUnits: entry.stakeUnits * 2 } : entry) : state.backExposures,
    followDecisions: [...state.followDecisions, { kind: 'DOUBLE', handId, choice: add ? 'ADD' : 'NO_ADD',
      ...(insufficient ? { fundingError: 'INSUFFICIENT_FUNDS' as const } : {}) }] };
  return { ok: true, state: finishDouble(next, handId) };
}

function controllerError(state: BehindGameState, ownerId: string, handId: string): string | undefined {
  const round = state.table.game.round;
  if (state.table.phase !== 'CLOSED' || state.table.decisionPhase !== 'NONE' || state.followWindow
    || round?.phase !== 'PLAYER_TURN') return 'WRONG_PHASE';
  const hand = round.players.find((entry) => entry.handId === handId);
  if (!hand || round.currentHandId !== handId || hand.complete) return 'WRONG_HAND';
  return controllerId(state, hand.seatNumber) !== ownerId ? 'NOT_CONTROLLER' : undefined;
}
export function standControllerHand(state: BehindGameState, ownerId: string, handId: string): BehindResult {
  const error = controllerError(state, ownerId, handId);
  if (error) return { ok: false, state, error };
  const hand = state.table.game.round!.players.find((entry) => entry.handId === handId)!;
  return { ok: true, state: selectNext(replace(state, { ...hand, complete: true, decisionTaken: true })) };
}
export function beginControllerSplit(state: BehindGameState, ownerId: string, handId: string): BehindResult {
  const error = controllerError(state, ownerId, handId);
  if (error) return { ok: false, state, error };
  const round = state.table.game.round!;
  const hand = round.players.find((entry) => entry.handId === handId)!;
  if (hand.cards.length !== 2 || hand.decisionTaken || hand.splitAces) return { ok: false, state, error: 'SPLIT_NOT_ALLOWED' };
  const [first, second] = hand.cards;
  const tens = ['10', 'J', 'Q', 'K'];
  if (first.rank !== second.rank && !(tens.includes(first.rank) && tens.includes(second.rank))) {
    return { ok: false, state, error: 'UNEQUAL_SPLIT_VALUE' };
  }
  if (round.players.filter((entry) => entry.rootHandId === hand.rootHandId).length >= 4) {
    return { ok: false, state, error: 'HAND_LIMIT_REACHED' };
  }
  const humanController = controlledSeat(state) === hand.seatNumber;
  const bankroll = humanController ? state.human!.bankroll : state.computers[hand.seatNumber - 1].bankroll;
  if (!isBankroll(bankroll) || !isCreditUnits(bankroll.reserved + hand.stakeUnits)) {
    return { ok: false, state, error: 'INVALID_FUNDING' };
  }
  if (bankroll.available < hand.stakeUnits) return { ok: false, state, error: 'INSUFFICIENT_FUNDS' };
  const funded = { available: bankroll.available - hand.stakeUnits, reserved: bankroll.reserved + hand.stakeUnits };
  const children = hand.cards.map((card, index): AdvancedHand => ({ ...hand,
    handId: `${handId}.${index + 1}`, parentHandId: handId, origin: 'SPLIT', cards: [card],
    splitAces: first.rank === 'A', decisionTaken: false, complete: false, outcome: undefined, outcomeReason: undefined }));
  const next: BehindGameState = { ...state,
    human: humanController ? { ...state.human!, bankroll: funded } : state.human,
    computers: humanController ? state.computers : state.computers.map((entry) => entry.seatNumber === hand.seatNumber
      ? { ...entry, bankroll: funded } : entry),
    table: { ...state.table, game: { ...state.table.game, round: { ...round,
      currentHandId: children[0].handId,
      players: round.players.flatMap((entry) => entry.handId === handId ? children : [entry]) } } } };
  const exposure = state.backExposures.find((entry) => entry.handId === handId);
  return { ok: true, state: exposure ? { ...next, followWindow: { kind: 'SPLIT', handId,
    targetSeat: hand.seatNumber, wagerId: exposure.wagerId } } : selectNext(next) };
}
export function decideSplitFollow(state: BehindGameState, handId: string, choice: 'ADD' | 'NO_ADD'): BehindResult {
  const window = state.followWindow;
  if (!window || window.kind !== 'SPLIT' || window.handId !== handId || state.table.phase !== 'CLOSED') {
    return { ok: false, state, error: 'NO_FOLLOW_DECISION' };
  }
  if (choice !== 'ADD' && choice !== 'NO_ADD') return { ok: false, state, error: 'INVALID_FOLLOW_CHOICE' };
  const exposure = state.backExposures.find((entry) => entry.handId === handId)!;
  const bankroll = state.human!.bankroll;
  const insufficient = choice === 'ADD' && bankroll.available < exposure.stakeUnits;
  const add = choice === 'ADD' && !insufficient;
  const children = [1, ...(add ? [2] : [])].map((index) => ({ ...exposure,
    handId: `${handId}.${index}`, parentHandId: handId }));
  const next: BehindGameState = { ...state, followWindow: null,
    human: add ? { ...state.human!, bankroll: { available: bankroll.available - exposure.stakeUnits,
      reserved: bankroll.reserved + exposure.stakeUnits } } : state.human,
    backExposures: state.backExposures.flatMap((entry) => entry === exposure ? children : [entry]),
    followDecisions: [...state.followDecisions, { kind: 'SPLIT', handId, choice: add ? 'ADD' : 'NO_ADD',
      ...(insufficient ? { fundingError: 'INSUFFICIENT_FUNDS' as const } : {}) }] };
  return { ok: true, state: selectNext(next) };
}
