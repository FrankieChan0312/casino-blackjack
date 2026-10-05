import type { BrowserView } from '../browser/controller.js';
import type { CSSProperties } from 'react';
import { credits, resultLabel, handLabel } from './presentation.js';
import { CasinoPerson } from './CasinoPerson.js';
import { character, type CharacterLineup } from '../presentation/characters.js';
import { TABLE_GEOMETRY, TABLE_SEAT_ANCHORS } from '../presentation/tableGeometry.js';
import { mapSeats } from '../presentation/seatMapping.js';
import { Cards } from './Cards.js';
import { PresentationAnchor } from './PresentationAnchor.js';
import { SeatUnit } from './SeatUnit.js';
import { LocalPlayerHud } from './LocalPlayerHud.js';
import { DealerZone } from './DealerZone.js';
import type { DealerPresentation } from '../presentation/dealerPresentation.js';

export { Cards } from './Cards.js';
export function Table({ view, lineup, dealerPresentation }: { view: BrowserView; lineup?: CharacterLineup; dealerPresentation?: DealerPresentation }) {
  const round = view.round;
  const otherSeats = view.configuration.filter(seat => seat.seatNumber !== view.human?.controlledSeat);
  const guests = otherSeats.filter(seat => seat.occupancy !== 'EMPTY');
  const occupied = view.configuration.filter(seat => seat.occupancy !== 'EMPTY');
  const mapping = view.playerMode && occupied.length ? mapSeats(occupied.map(seat => seat.seatNumber)) : [];
  const localRow = occupied.length < 5 ? guests.length ? 2 : 1
    : Math.max(...mapping.filter(seat => seat.seatNumber !== view.human?.controlledSeat).map(seat => seat.band)) + 2;
  return <section aria-label="Blackjack table" data-dynamic-seats={view.playerMode || undefined} data-dense-arc={view.playerMode && occupied.length >= 5 || undefined} data-player-count={view.playerMode ? occupied.length : undefined} data-felt-markings={view.playerMode || undefined} className={`table-surface${view.playerMode ? ' casino-table' : ''}`}>
    {view.playerMode ? <DealerZone dealer={round?.dealer} phase={round?.phase} presentation={dealerPresentation} /> : <section className="dealer panel" data-anchor="dealer" aria-label="Dealer"><h2>Dealer</h2>
      <div className="dealer-cards" data-anchor="dealer-cards">{round ? <><Cards cards={round.dealer.visibleCards} />
        {!round.dealer.holeCard && <span role="img" aria-label="Hidden dealer card" className="card card-back">◆</span>}
        <p className="dealer-total">{round.dealer.holeCard ? 'Total' : 'Visible total'}: {round.dealer.total}</p>
        <p className="dealer-state">{round.dealer.status}</p></> : <p>Waiting for the initial deal</p>}</div>
    </section>}
    <div className="seats">{view.configuration.filter(seat => !view.playerMode || seat.occupancy !== 'EMPTY').map((seat) => {
      const local = seat.seatNumber === view.human?.controlledSeat;
      const avatarId = lineup && (local ? lineup.human : lineup.guests[seat.seatNumber]);
      const avatar = avatarId ? character(avatarId) : undefined;
      const hands = round?.seats.find((entry) => entry.seatNumber === seat.seatNumber)?.hands ?? [];
      const wager = view.mainWagers.find((entry) => entry.seat === seat.seatNumber)?.amount ?? 0;
      const mapped = mapping.find(entry => entry.seatNumber === seat.seatNumber);
      const anchor = mapped ?? TABLE_SEAT_ANCHORS[seat.seatNumber - 1];
      const guestIndex = guests.findIndex(entry => entry.seatNumber === seat.seatNumber);
      const column = guests.length === 2 ? guestIndex * 2 + 1 : guestIndex + 1;
      const geometryStyle = view.playerMode ? {
        '--seat-depth': (anchor.y - TABLE_GEOMETRY.centre.y) / TABLE_GEOMETRY.radius.y,
        '--seat-shift': local ? 0 : anchor.x / 100 - (column - 0.5) / 3,
        '--arc-shift': anchor.x / 100 - 0.5, '--arc-column': column,
        '--arc-row': (mapped?.band ?? 0) + 1, '--arc-side': mapped?.side ?? 1, '--local-row': localRow,
      } as CSSProperties : undefined;
      return <PresentationAnchor as="section" anchor={`seat-${seat.seatNumber}`} key={seat.seatNumber} style={geometryStyle} data-arc-slot={mapped?.slot} data-arc-row={mapped ? mapped.band + 1 : undefined} data-scene-zone={view.playerMode ? local ? 'local-player' : 'remote-seat' : undefined} data-seat-anchor={view.playerMode ? `seat-${seat.seatNumber}` : undefined} data-anchor-x={view.playerMode ? anchor.x : undefined} data-anchor-y={view.playerMode ? anchor.y : undefined} data-character={lineup && (local ? lineup.human : lineup.guests[seat.seatNumber])} id={view.playerMode && local ? 'player-hand' : undefined} tabIndex={view.playerMode && local ? -1 : undefined} data-hand-count={hands.length} data-position={local ? 'local' : otherSeats.findIndex(entry => entry.seatNumber === seat.seatNumber) + 1} className={`seat panel ${local ? 'local' : ''} ${round?.currentSeat === seat.seatNumber ? 'turn-seat' : ''}`} aria-label={`Seat ${seat.seatNumber}`}>
        {view.playerMode ? local ? <LocalPlayerHud seat={seat} avatar={avatar} hands={hands} wager={wager}
          currentHandId={round?.currentHandId} ownResults={view.ownResults} /> : <SeatUnit seat={seat} avatar={avatar} hands={hands} wager={wager}
          currentSeat={round?.currentSeat} currentHandId={round?.currentHandId} /> : <>{avatar ? <div className="character-identity">
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
        {hands.map((hand) => <article key={hand.handId} aria-label={handLabel(hand.handId)} data-hand-id={hand.handId} className={`${view.playerMode && !local ? 'guest-desktop-hand ' : ''}${round?.currentHandId === hand.handId ? 'active-hand' : 'hand'}`}>
          <div className="hand-header">
            <h3>{handLabel(hand.handId)}{round?.currentHandId === hand.handId && ' · Current hand'}</h3>
            {round?.currentHandId === hand.handId && <span className="turn-marker">ACTIVE</span>}
          </div>
          <Cards cards={hand.cards} /><p>Total: {hand.total} · Wager: {credits(hand.stakeUnits)}</p>
          <p className={`result-badge ${hand.outcome === 'CHARLIE' ? 'charlie' : ''}`} data-result={hand.outcome}>{hand.outcome ? resultLabel(hand.outcome, hand.outcomeReason) : hand.complete ? 'Decisions complete' : hand.cards.length === 1 ? 'Waiting for card' : 'Playing'}</p>
          {hand.outcome === 'SURRENDERED' && view.ownResults.filter((result) => result.handId === hand.handId).map((result) =>
            <p key={result.handId}>Returned: {credits(result.returned)} · Lost: {credits(result.stake - result.returned)}</p>)}
        </article>)}</>}
      </PresentationAnchor>;
    })}</div>
  </section>;
}
