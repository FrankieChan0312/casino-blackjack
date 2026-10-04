import type { BrowserView } from '../browser/controller.js';
import { CasinoPerson } from './CasinoPerson.js';
import { Cards } from './Cards.js';

export function DealerZone({ dealer, phase }: { dealer: NonNullable<BrowserView['round']>['dealer'] | undefined; phase?: NonNullable<BrowserView['round']>['phase'] }) {
  const status = phase === 'INTEGRITY_ERROR' ? 'Round interrupted' : dealer?.status ?? 'Waiting for the initial deal';
  return <section className="dealer dealer-zone panel" data-anchor="dealer" data-scene-zone="dealer"
    data-dealer-status={status} aria-label="Dealer">
    <CasinoPerson kind="dealer" />
    <h2>Dealer</h2>
    <div className="dealer-cards" data-anchor="dealer-cards" role="group" aria-label="Dealer hand">
      {dealer ? <>
        <div className="dealer-card-lane"><Cards cards={dealer.visibleCards} />
          {!dealer.holeCard && <span role="img" aria-label="Hidden dealer card" className="card card-back">◆</span>}
        </div>
        <p className="dealer-total">{dealer.holeCard ? 'Total' : 'Visible total'}: {dealer.total}</p>
        <p className="dealer-state">{status}</p>
      </> : <p className="dealer-state">Waiting for the initial deal</p>}
    </div>
    <div className="dealer-shoe" data-anchor="dealer-shoe" role="group" aria-label="Shoe and deal origin">
      <span className="shoe-placeholder" aria-hidden="true" />
      <p>Shoe · Deal origin <span>6 decks</span></p>
    </div>
    <p className="table-inscription" data-anchor="table-centre" aria-label="House rules">BLACKJACK PAYS 3:2 <span>DEALER STANDS ON ALL 17</span></p>
  </section>;
}
