import type { BrowserView } from '../browser/controller.js';
import type { characters } from '../presentation/characters.js';
import { Cards } from './Cards.js';
import { credits, handLabel, resultLabel } from './presentation.js';

type PublicHand = NonNullable<BrowserView['round']>['seats'][number]['hands'][number];
export function LocalPlayerHud({ seat, avatar, hands, wager, currentHandId, ownResults }: {
  seat: BrowserView['configuration'][number]; avatar?: typeof characters[number];
  hands: readonly PublicHand[]; wager: number; currentHandId?: string | null;
  ownResults: BrowserView['ownResults'];
}) {
  return <div className="local-player-hud" role="group" aria-label="Your player HUD"
    aria-describedby="player-scene-status" aria-controls="player-decisions">
    <div className="hud-identity">
      <div className="character-identity">
        {avatar && <img src={avatar.portrait} width={60} height={80} alt={`Your avatar: ${avatar.name}, ${avatar.archetype}`} />}
        <div><p className="hud-you">YOU</p><h2 aria-label={avatar?.name}>{avatar?.name ?? `Seat ${seat.seatNumber} · You`}</h2>
          {avatar && <p className="character-archetype">{avatar.archetype}</p>}
          <p className="character-controller">Seat {seat.seatNumber} · You · Human{seat.sittingOut && ' · Sitting Out'}</p></div>
      </div>
      <p className="wager-chip" data-felt-destination="main-wager">MAIN: {credits(wager)} credits</p>
    </div>
    <div className="hud-hands">
      {!hands.length && <div className="empty-hand" data-felt-destination="hand"><div className="cards" aria-hidden="true"><span className="card card-back">♠</span><span className="card card-back">♠</span></div><p>Your cards will be dealt here.</p></div>}
      {hands.map(hand => {
        const current = currentHandId === hand.handId;
        const status = hand.outcome ? resultLabel(hand.outcome, hand.outcomeReason)
          : hand.complete ? 'Decisions complete' : hand.cards.length === 1 ? 'Waiting for card' : 'Playing';
        return <article key={hand.handId} className={`hud-hand ${current ? 'active-hand' : 'hand'}`}
          aria-label={handLabel(hand.handId)} aria-current={current ? 'true' : undefined} data-hand-id={hand.handId} data-felt-destination="hand">
          <div className="hand-header"><h3>{handLabel(hand.handId)}{current && ' · Current hand'}</h3>
            {current && <span className="turn-marker">ACTIVE</span>}</div>
          <Cards cards={hand.cards} />
          <div className="hud-hand-facts"><p className="hud-total" aria-label={`Total: ${hand.total}`}>Total: <strong>{hand.total}</strong></p>
            <p className="hud-wager" data-felt-destination="hand-wager">Wager: {credits(hand.stakeUnits)} credits</p>
            <p className="hud-state" data-result={hand.outcome}>{status}</p></div>
          {hand.outcome === 'SURRENDERED' && ownResults.filter(result => result.handId === hand.handId).map(result =>
            <p key={result.handId} className="hud-return">Returned: {credits(result.returned)} · Lost: {credits(result.stake - result.returned)}</p>)}
        </article>;
      })}
    </div>
  </div>;
}
