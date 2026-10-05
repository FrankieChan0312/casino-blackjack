import type { BrowserView } from '../browser/controller.js';
import { dealerPresentation, type DealerPresentation } from '../presentation/dealerPresentation.js';
import { DealerAvatar } from './DealerAvatar.js';
import { Cards } from './Cards.js';
import { usePresentationAnchor } from './PresentationProvider.js';

export function DealerZone({ dealer, phase, presentation = dealerPresentation(null, 'IDLE') }: {
  dealer: NonNullable<BrowserView['round']>['dealer'] | undefined; phase?: NonNullable<BrowserView['round']>['phase'];
  presentation?: DealerPresentation;
}) {
  const status = phase === 'INTEGRITY_ERROR' ? 'Round interrupted' : dealer?.status ?? 'Waiting for the initial deal';
  const handAnchor = usePresentationAnchor('dealer-hand'), originAnchor = usePresentationAnchor('deal-origin');
  return <section className="dealer dealer-zone panel" data-anchor="dealer" data-scene-zone="dealer"
    data-dealer-status={status} data-dealer-character={presentation.characterId ?? undefined}
    data-dealer-role={presentation.role} data-dealer-variant={presentation.variant}
    data-dealer-presentation-state={presentation.presentationState}
    data-dealer-art={presentation.asset ? 'formal' : 'temporary-fallback'} aria-label="Dealer">
    <DealerAvatar asset={presentation.asset} />
    <h2>Dealer</h2>
    <div ref={handAnchor} className="dealer-cards" data-anchor="dealer-cards" data-felt-destination="dealer-hand" role="group" aria-label="Dealer hand">
      {dealer ? <>
        <div className="dealer-card-lane"><Cards cards={dealer.visibleCards} ownerId="dealer" />
          {!dealer.holeCard && <span role="img" aria-label="Hidden dealer card" className="card card-back">◆</span>}
        </div>
        <p className="dealer-total">{dealer.holeCard ? 'Total' : 'Visible total'}: {dealer.total}</p>
        <p className="dealer-state">{status}</p>
      </> : <p className="dealer-state">Waiting for the initial deal</p>}
    </div>
    <div ref={originAnchor} className="dealer-shoe" data-anchor="dealer-shoe" data-felt-destination="deal-origin" role="group" aria-label="Shoe and deal origin">
      <span className="shoe-placeholder" aria-hidden="true" />
      <p>Shoe · Deal origin <span>6 decks</span></p>
    </div>
    <p className="table-inscription" data-anchor="table-centre" data-felt-rules="true" aria-label="House rules">BLACKJACK PAYS 3:2 <span>DEALER STANDS ON ALL 17</span></p>
  </section>;
}
