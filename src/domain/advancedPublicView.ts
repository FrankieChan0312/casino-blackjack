import type { AdvancedGameState } from './advancedGame.js';
import type { PhysicalCard } from './card.js';

function publicCard(card: PhysicalCard) {
  return { rank: card.rank, suit: card.suit };
}
export function getPublicAdvancedView(state: AdvancedGameState) {
  const configuration = state.game.table.seats.map((seat) => ({ seatNumber: seat.seatNumber,
    occupancy: seat.occupancy, sittingOut: seat.sittingOut }));
  const round = state.game.round;
  if (!round) return { configuration, round: null };
  const revealed = round.phase === 'DEALER_TURN' || round.phase === 'ROUND_COMPLETE';
  return { configuration, round: { roundId: round.roundId, phase: round.phase,
    currentSeat: round.currentSeat, currentHandId: round.currentHandId,
    seats: round.seats.map((seat) => ({ seatNumber: seat.seatNumber, occupancy: seat.occupancy,
      sittingOut: seat.sittingOut,
      hands: round.players.filter((hand) => hand.seatNumber === seat.seatNumber).map((hand) => ({
        handId: hand.handId, origin: hand.origin, cards: hand.cards.map(publicCard),
        stakeUnits: hand.stakeUnits, complete: hand.complete, outcome: hand.outcome, outcomeReason: hand.outcomeReason,
      })) })),
    dealer: { upcard: round.dealerCards[0] ? publicCard(round.dealerCards[0]) : null,
      holeCard: revealed && round.dealerCards[1] ? publicCard(round.dealerCards[1]) : null,
      visibleCards: (revealed ? round.dealerCards : round.dealerCards.slice(0, 1)).map(publicCard) },
    integrityError: round.integrityError,
  } };
}
