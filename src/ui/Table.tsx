import type { BrowserView } from '../browser/controller.js';
import { credits, resultLabel, handLabel } from './presentation.js';

type PublicCard = NonNullable<BrowserView['round']>['dealer']['visibleCards'][number];
const suitSymbols = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
export function Cards({ cards }: { cards: readonly PublicCard[] }) {
  return <div className="cards">{cards.map((card, index) => <span key={index} className={`card ${card.suit}`} role="img"
    aria-label={`${card.rank} of ${card.suit}`}><b>{card.rank}<small aria-hidden="true">{suitSymbols[card.suit]}</small></b><span className="card-pip" aria-hidden="true">{suitSymbols[card.suit]}</span><b className="card-corner" aria-hidden="true">{card.rank}</b></span>)}</div>;
}
export function Table({ view }: { view: BrowserView }) {
  const round = view.round;
  const otherSeats = view.configuration.filter(seat => seat.seatNumber !== view.human?.controlledSeat);
  return <section aria-label="Blackjack table" className="table-surface">
    <section className="dealer panel" aria-label="Dealer"><h2>Dealer</h2>
      {round ? <><Cards cards={round.dealer.visibleCards} />
        {!round.dealer.holeCard && <span role="img" aria-label="Hidden dealer card" className="card card-back">◆</span>}
        <p className="dealer-total">{round.dealer.holeCard ? 'Total' : 'Visible total'}: {round.dealer.total}</p>
        <p className="dealer-state">{round.dealer.status}</p></> : <p>Waiting for the initial deal</p>}
    </section>
    <div className="seats">{view.configuration.map((seat) => {
      const local = seat.seatNumber === view.human?.controlledSeat;
      const hands = round?.seats.find((entry) => entry.seatNumber === seat.seatNumber)?.hands ?? [];
      const wager = view.mainWagers.find((entry) => entry.seat === seat.seatNumber)?.amount ?? 0;
      return <section key={seat.seatNumber} data-position={local ? 'local' : otherSeats.findIndex(entry => entry.seatNumber === seat.seatNumber) + 1} className={`seat panel ${local ? 'local' : ''} ${round?.currentSeat === seat.seatNumber ? 'turn-seat' : ''}`} aria-label={`Seat ${seat.seatNumber}`}>
        <h2>Seat {seat.seatNumber}{local && ' · You'}</h2>
        <p>{seat.occupancy === 'EMPTY' ? 'Empty' : seat.occupancy === 'HUMAN' ? 'Human' : 'Computer'}{seat.sittingOut && ' · Sitting Out'}</p>
        <p className="wager-chip">MAIN: {credits(wager)} credits</p>
        {hands.map((hand) => <article key={hand.handId} aria-label={handLabel(hand.handId)} data-hand-id={hand.handId} className={round?.currentHandId === hand.handId ? 'active-hand' : 'hand'}>
          <h3>{handLabel(hand.handId)}{round?.currentHandId === hand.handId && ' · Current hand'}</h3>
          {round?.currentHandId === hand.handId && <span className="turn-marker">ACTIVE</span>}
          <Cards cards={hand.cards} /><p>Total: {hand.total} · Wager: {credits(hand.stakeUnits)}</p>
          <p className={`result-badge ${hand.outcome === 'CHARLIE' ? 'charlie' : ''}`} data-result={hand.outcome}>{hand.outcome ? resultLabel(hand.outcome, hand.outcomeReason) : hand.complete ? 'Decisions complete' : hand.cards.length === 1 ? 'Waiting for card' : 'Playing'}</p>
          {hand.outcome === 'SURRENDERED' && view.ownResults.filter((result) => result.handId === hand.handId).map((result) =>
            <p key={result.handId}>Returned: {credits(result.returned)} · Lost: {credits(result.stake - result.returned)}</p>)}
        </article>)}
      </section>;
    })}</div>
  </section>;
}
