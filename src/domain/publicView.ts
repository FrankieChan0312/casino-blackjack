import type { PhysicalCard, Rank, Suit } from './card.js';
import type { GameState, OutcomeReason, RoundOutcome, RoundPhase, RoundState } from './game.js';

export interface PublicCard {
  readonly rank: Rank;
  readonly suit: Suit;
}

export interface PublicRoundView {
  readonly roundId: string;
  readonly phase: RoundPhase;
  readonly playerCards: readonly PublicCard[];
  readonly dealer: {
    readonly upcard: PublicCard | null;
    readonly holeCard: PublicCard | null;
    readonly visibleCards: readonly PublicCard[];
  };
  readonly outcome?: RoundOutcome;
  readonly outcomeReason?: OutcomeReason;
  readonly integrityError?: RoundState['integrityError'];
}

export interface PublicGameView {
  readonly round: PublicRoundView | null;
}

function publicCard(card: PhysicalCard): PublicCard {
  return { rank: card.rank, suit: card.suit };
}

// Build an allowlisted copy: never return internal cards, shoe order or totals.
export function getPublicView(state: GameState): PublicGameView {
  const round = state.round;
  if (round === null) return { round: null };
  // DESIGN section 12 authorizes reveal as player decisions end, before dealer draws.
  const revealed = round.phase === 'DEALER_TURN' || round.phase === 'ROUND_COMPLETE';
  return { round: {
    roundId: round.roundId,
    phase: round.phase,
    playerCards: round.playerCards.map(publicCard),
    dealer: {
      upcard: round.dealerCards[0] ? publicCard(round.dealerCards[0]) : null,
      holeCard: revealed && round.dealerCards[1] ? publicCard(round.dealerCards[1]) : null,
      visibleCards: (revealed ? round.dealerCards : round.dealerCards.slice(0, 1)).map(publicCard),
    },
    outcome: round.outcome,
    outcomeReason: round.outcomeReason,
    integrityError: round.integrityError,
  } };
}
