import type { PhysicalCard } from './card.js';
import { evaluateHand, isNaturalBlackjack } from './hand.js';
import type { RandomSource } from './random.js';
import { completeShoeRound, createShoe, drawCard, prepareShoeForNextRound, type ShoeState } from './shoe.js';

export type RoundPhase = 'PLAYER_TURN' | 'DEALER_TURN' | 'ROUND_COMPLETE' | 'INTEGRITY_ERROR';
export type RoundOutcome = 'PLAYER_BLACKJACK' | 'DEALER_WIN' | 'PUSH';
export type OutcomeReason = 'PLAYER_NATURAL' | 'DEALER_NATURAL' | 'BOTH_NATURAL' | 'PLAYER_BUST';

export interface RoundState {
  readonly roundId: string;
  readonly phase: RoundPhase;
  readonly playerCards: readonly PhysicalCard[];
  // Index 0 is the upcard; index 1 is the internal hole card.
  readonly dealerCards: readonly PhysicalCard[];
  readonly outcome?: RoundOutcome;
  readonly outcomeReason?: OutcomeReason;
  readonly integrityError?: 'SHOE_EXHAUSTED_DURING_ROUND' | 'SHOE_RETIRED';
}

export interface GameState {
  readonly shoe: ShoeState;
  readonly round: RoundState | null;
}

export type ActionError = 'ROUND_ALREADY_ACTIVE' | 'NO_ROUND' | 'WRONG_PHASE' | 'ROUND_ALREADY_TERMINAL';

export type CommandResult =
  | { readonly ok: true; readonly state: GameState }
  | { readonly ok: false; readonly state: GameState; readonly error: ActionError };

export function createGame(shoeId: string, random: RandomSource): GameState {
  return { shoe: createShoe(shoeId, random), round: null };
}

// Caller supplies identities. Accepted commands may end in INTEGRITY_ERROR;
// ok=false is reserved for a rejected request that leaves state untouched.
export function startRound(
  state: GameState,
  roundId: string,
  replacementShoeId: string,
  random: RandomSource,
): CommandResult {
  if (state.round?.phase === 'PLAYER_TURN' || state.round?.phase === 'DEALER_TURN') {
    return { ok: false, state, error: 'ROUND_ALREADY_ACTIVE' };
  }
  let shoe = prepareShoeForNextRound(state.shoe, replacementShoeId, random);
  const playerCards: PhysicalCard[] = [];
  const dealerCards: PhysicalCard[] = [];
  // P1, dealer upcard, P2, dealer hole card; no partial deal is publicly returned.
  for (let index = 0; index < 4; index++) {
    const draw = drawCard(shoe);
    shoe = draw.shoe;
    if (!draw.ok) {
      return { ok: true, state: { shoe, round: {
        roundId, phase: 'INTEGRITY_ERROR', playerCards, dealerCards, integrityError: draw.error,
      } } };
    }
    (index % 2 === 0 ? playerCards : dealerCards).push(draw.card);
  }

  // These are newly dealt original hands. No ordinary total comparison occurs.
  const playerNatural = isNaturalBlackjack(playerCards, true);
  const upcard = dealerCards[0].rank;
  const peekRequired = upcard === 'A' || upcard === '10' || upcard === 'J'
    || upcard === 'Q' || upcard === 'K';
  const dealerNatural = peekRequired && isNaturalBlackjack(dealerCards, true);
  if (playerNatural || dealerNatural) {
    return { ok: true, state: { shoe: completeShoeRound(shoe), round: {
      roundId, phase: 'ROUND_COMPLETE', playerCards, dealerCards,
      outcome: dealerNatural ? (playerNatural ? 'PUSH' : 'DEALER_WIN') : 'PLAYER_BLACKJACK',
      outcomeReason: dealerNatural ? (playerNatural ? 'BOTH_NATURAL' : 'DEALER_NATURAL') : 'PLAYER_NATURAL',
    } } };
  }
  return { ok: true, state: { shoe, round: { roundId, phase: 'PLAYER_TURN', playerCards, dealerCards } } };
}

function playerActionError(round: RoundState): ActionError | undefined {
  if (round.phase === 'ROUND_COMPLETE' || round.phase === 'INTEGRITY_ERROR' || round.integrityError !== undefined) {
    return 'ROUND_ALREADY_TERMINAL';
  }
  if (round.phase !== 'PLAYER_TURN') return 'WRONG_PHASE';
  return undefined;
}

export function hit(state: GameState): CommandResult {
  const round = state.round;
  if (!round) return { ok: false, state, error: 'NO_ROUND' };
  const error = playerActionError(round);
  if (error) return { ok: false, state, error };

  const draw = drawCard(state.shoe);
  if (!draw.ok) {
    return { ok: true, state: { shoe: draw.shoe, round: {
      ...round, phase: 'INTEGRITY_ERROR', integrityError: draw.error,
    } } };
  }
  const playerCards = [...round.playerCards, draw.card];
  const evaluation = evaluateHand(playerCards);
  if (evaluation.isBust) {
    return { ok: true, state: { shoe: completeShoeRound(draw.shoe), round: {
      ...round, playerCards, phase: 'ROUND_COMPLETE', outcome: 'DEALER_WIN', outcomeReason: 'PLAYER_BUST',
    } } };
  }
  return { ok: true, state: { shoe: draw.shoe, round: {
    ...round, playerCards, phase: evaluation.isTwentyOne ? 'DEALER_TURN' : 'PLAYER_TURN',
  } } };
}

export function stand(state: GameState): CommandResult {
  const round = state.round;
  if (!round) return { ok: false, state, error: 'NO_ROUND' };
  const error = playerActionError(round);
  if (error) return { ok: false, state, error };
  return { ok: true, state: { shoe: state.shoe, round: { ...round, phase: 'DEALER_TURN' } } };
}
