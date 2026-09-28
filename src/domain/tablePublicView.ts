import type { PhysicalCard } from './card.js';
import type { PublicCard } from './publicView.js';
import type { TableGameState } from './tableGame.js';

function publicCard(card: PhysicalCard): PublicCard {
  return { rank: card.rank, suit: card.suit };
}

export function getPublicTableView(state: TableGameState) {
  const configuration = state.table.seats.map((seat) => ({ seatNumber: seat.seatNumber,
    occupancy: seat.occupancy, sittingOut: seat.sittingOut }));
  const round = state.round;
  if (!round) return { configuration, round: null };
  const revealed = round.phase === 'DEALER_TURN' || round.phase === 'ROUND_COMPLETE';
  return { configuration, round: {
    roundId: round.roundId, phase: round.phase, currentSeat: round.currentSeat,
    seats: round.seats.map((seat) => {
      const player = round.players.find((hand) => hand.seatNumber === seat.seatNumber);
      return { seatNumber: seat.seatNumber, occupancy: seat.occupancy, sittingOut: seat.sittingOut,
        active: player !== undefined, cards: player?.cards.map(publicCard) ?? [],
        complete: player?.complete ?? false, outcome: player?.outcome, outcomeReason: player?.outcomeReason };
    }),
    dealer: {
      upcard: round.dealerCards[0] ? publicCard(round.dealerCards[0]) : null,
      holeCard: revealed && round.dealerCards[1] ? publicCard(round.dealerCards[1]) : null,
      visibleCards: (revealed ? round.dealerCards : round.dealerCards.slice(0, 1)).map(publicCard),
    },
    integrityError: round.integrityError,
  } };
}
