import type { BrowserView } from '../browser/controller.js';
import { credits, resultLabel, handLabel } from './presentation.js';
import { CasinoPerson } from './CasinoPerson.js';
import { character, type CharacterLineup } from '../presentation/characters.js';

type PublicCard = NonNullable<BrowserView['round']>['dealer']['visibleCards'][number];
const suitSymbols = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
export function Cards({ cards }: { cards: readonly PublicCard[] }) {
  return <div className="cards">{cards.map((card, index) => <span key={index} className={`card ${card.suit}`} role="img"
    aria-label={`${card.rank} of ${card.suit}`}><b>{card.rank}<small aria-hidden="true">{suitSymbols[card.suit]}</small></b><span className="card-pip" aria-hidden="true">{suitSymbols[card.suit]}</span><b className="card-corner" aria-hidden="true">{card.rank}</b></span>)}</div>;
}
export function Table({ view, lineup }: { view: BrowserView; lineup?: CharacterLineup }) {
  const round = view.round;
  const otherSeats = view.configuration.filter(seat => seat.seatNumber !== view.human?.controlledSeat);
  return <section aria-label="Blackjack table" className="table-surface">
    <section className="dealer panel" aria-label="Dealer"><h2>Dealer</h2>
      {view.playerMode && <CasinoPerson kind="dealer" />}
      {round ? <><Cards cards={round.dealer.visibleCards} />
        {!round.dealer.holeCard && <span role="img" aria-label="Hidden dealer card" className="card card-back">◆</span>}
        <p className="dealer-total">{round.dealer.holeCard ? 'Total' : 'Visible total'}: {round.dealer.total}</p>
        <p className="dealer-state">{round.dealer.status}</p></> : <p>Waiting for the initial deal</p>}
    </section>
    {view.playerMode && <p className="table-inscription" aria-label="House rules">BLACKJACK PAYS 3:2 <span>DEALER STANDS ON ALL 17</span></p>}
    <div className="seats">{view.configuration.filter(seat => !view.playerMode || seat.occupancy !== 'EMPTY').map((seat) => {
      const local = seat.seatNumber === view.human?.controlledSeat;
      const avatarId = lineup && (local ? lineup.human : lineup.guests[seat.seatNumber]);
      const avatar = avatarId ? character(avatarId) : undefined;
      const hands = round?.seats.find((entry) => entry.seatNumber === seat.seatNumber)?.hands ?? [];
      const wager = view.mainWagers.find((entry) => entry.seat === seat.seatNumber)?.amount ?? 0;
      return <section key={seat.seatNumber} data-character={lineup && (local ? lineup.human : lineup.guests[seat.seatNumber])} id={view.playerMode && local ? 'player-hand' : undefined} tabIndex={view.playerMode && local ? -1 : undefined} data-hand-count={hands.length} data-position={local ? 'local' : otherSeats.findIndex(entry => entry.seatNumber === seat.seatNumber) + 1} className={`seat panel ${local ? 'local' : ''} ${round?.currentSeat === seat.seatNumber ? 'turn-seat' : ''}`} aria-label={`Seat ${seat.seatNumber}`}>
        {avatar ? <div className="character-identity">
          <img src={avatar.portrait} width={60} height={80} alt={`${local ? 'Your avatar' : 'Computer guest'}: ${avatar.name}, ${avatar.archetype}`} />
          <div><h2 aria-label={avatar.name}>{avatar.name}</h2><p className="character-archetype">{avatar.archetype}</p>
            <p className="character-controller">Seat {seat.seatNumber} · {local ? 'You · Human' : 'Computer'}{seat.sittingOut && ' · Sitting Out'}
              <span className="wager-chip">MAIN: {credits(wager)} credits</span></p>
          </div>
        </div> : <>
          {view.playerMode && !local && <CasinoPerson kind={seat.seatNumber === 3 ? 'gown' : seat.seatNumber === 6 ? 'tux' : 'suit'} />}
          <h2>Seat {seat.seatNumber}{local && ' · You'}</h2>
          <p>{seat.occupancy === 'EMPTY' ? 'Empty' : seat.occupancy === 'HUMAN' ? 'Human' : 'Computer'}{seat.sittingOut && ' · Sitting Out'}</p>
          <p className="wager-chip">MAIN: {credits(wager)} credits</p>
        </>}
        {view.playerMode && local && !hands.length && <div className="empty-hand"><div className="cards" aria-hidden="true"><span className="card card-back">♠</span><span className="card card-back">♠</span></div><p>Your cards will be dealt here.</p></div>}
        {view.playerMode && !local && <details className="guest-mobile-cards"><summary>Cards{hands[0] && ` · ${hands[0].total}`}</summary>
          {hands.map(hand => <div key={hand.handId}><p>{handLabel(hand.handId)} · Total: {hand.total} · {hand.outcome ? resultLabel(hand.outcome, hand.outcomeReason) : hand.complete ? 'Decisions complete' : 'Playing'}</p><Cards cards={hand.cards} /></div>)}
        </details>}
        {hands.map((hand) => <article key={hand.handId} aria-label={handLabel(hand.handId)} data-hand-id={hand.handId} className={`${view.playerMode && !local ? 'guest-desktop-hand ' : ''}${round?.currentHandId === hand.handId ? 'active-hand' : 'hand'}`}>
          <div className="hand-header">
            <h3>{handLabel(hand.handId)}{round?.currentHandId === hand.handId && ' · Current hand'}</h3>
            {round?.currentHandId === hand.handId && <span className="turn-marker">ACTIVE</span>}
          </div>
          <Cards cards={hand.cards} /><p>Total: {hand.total} · Wager: {credits(hand.stakeUnits)}</p>
          <p className={`result-badge ${hand.outcome === 'CHARLIE' ? 'charlie' : ''}`} data-result={hand.outcome}>{hand.outcome ? resultLabel(hand.outcome, hand.outcomeReason) : hand.complete ? 'Decisions complete' : hand.cards.length === 1 ? 'Waiting for card' : 'Playing'}</p>
          {hand.outcome === 'SURRENDERED' && view.ownResults.filter((result) => result.handId === hand.handId).map((result) =>
            <p key={result.handId}>Returned: {credits(result.returned)} · Lost: {credits(result.stake - result.returned)}</p>)}
        </article>)}
      </section>;
    })}</div>
  </section>;
}
