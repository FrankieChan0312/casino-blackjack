import { useSyncExternalStore } from 'react';
import type { BrowserView } from '../browser/controller.js';
import type { characters } from '../presentation/characters.js';
import { Cards } from './Cards.js';
import { PresentationAnchor } from './PresentationAnchor.js';
import { credits, handLabel, resultLabel } from './presentation.js';

type PublicHand = NonNullable<BrowserView['round']>['seats'][number]['hands'][number];
type SeatIdentity = BrowserView['configuration'][number];
const mobileQuery = '(max-width: 600px)';
function subscribeMobile(callback: () => void) {
  const query = matchMedia(mobileQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
const mobileSnapshot = () => matchMedia(mobileQuery).matches;
const serverSnapshot = () => false;

// Presentation consumes public facts; it never derives outcomes, funds or turns.
export function SeatUnit({ seat, avatar, hands, wager, currentSeat, currentHandId }: {
  seat: SeatIdentity; avatar?: typeof characters[number]; hands: readonly PublicHand[];
  wager: number; currentSeat?: number | null; currentHandId?: string | null;
}) {
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, serverSnapshot);
  return <div className="seat-unit" data-current-turn={currentSeat === seat.seatNumber || undefined}>
    <div className="character-identity">
      {avatar && <img src={avatar.portrait} width={60} height={80} alt={`Computer guest: ${avatar.name}, ${avatar.archetype}`} />}
      <div><h2 aria-label={avatar?.name}>{avatar?.name ?? `Seat ${seat.seatNumber}`}</h2>
        {currentSeat === seat.seatNumber && <p className="seat-turn">Current turn</p>}
        {avatar && <p className="character-archetype">{avatar.archetype}</p>}
        <p className="character-controller">Seat {seat.seatNumber} · {seat.occupancy === 'HUMAN' ? 'Human' : 'Computer'}{seat.sittingOut && ' · Sitting Out'}</p>
      </div>
    </div>
    {hands.length > 0 && <PresentationAnchor as="p" anchor={`wager:${seat.seatNumber}`} className="seat-main-wager" data-felt-destination="main-wager">MAIN: {credits(wager)} credits</PresentationAnchor>}
    {!hands.length && <div className="seat-waiting"><PresentationAnchor as="p" anchor={`wager:${seat.seatNumber}`} className="wager-chip" data-felt-destination="main-wager">MAIN: {credits(wager)} credits</PresentationAnchor>
      <p>{seat.sittingOut ? 'Sitting Out' : 'Waiting for the deal'}</p></div>}
    {hands.length > 0 && <details className="guest-mobile-cards seat-hands" open={!mobile}>
      <summary>Cards · {hands[0].total}</summary>
      {hands.map(hand => {
        const current = currentHandId === hand.handId;
        const status = hand.outcome ? resultLabel(hand.outcome, hand.outcomeReason)
          : hand.complete ? 'Decisions complete' : hand.cards.length === 1 ? 'Waiting for card' : 'Playing';
        return <PresentationAnchor as="article" anchor={`hand:${hand.handId}`} key={hand.handId} aria-label={handLabel(hand.handId)} data-hand-id={hand.handId} data-felt-destination="hand"
          className={`guest-desktop-hand ${current ? 'active-hand' : 'hand'}`}>
          <div className="hand-header"><h3>{handLabel(hand.handId)}{current && ' · Current hand'}</h3>
            {current && <span className="turn-marker">ACTIVE</span>}</div>
          <Cards cards={hand.cards} ownerId={hand.handId} />
          <div className="seat-hand-facts"><p className="seat-score" aria-label={`Total: ${hand.total}`}>{hand.total}</p>
            <p className="seat-hand-state" data-result={hand.outcome}>{status}</p>
            <PresentationAnchor as="p" anchor={`hand-wager:${hand.handId}`} className="seat-stake" data-felt-destination={hands.length === 1 ? 'main-wager' : 'hand-wager'}>{hands.length === 1 ? 'MAIN: ' : 'Wager: '}{credits(hand.stakeUnits)} credits</PresentationAnchor></div>
        </PresentationAnchor>;
      })}
    </details>}
  </div>;
}
