import type { BrowserView } from '../browser/controller.js';
import { useInitialDeal, usePresentationAnchor } from './PresentationProvider.js';

type PublicCard = NonNullable<BrowserView['round']>['dealer']['visibleCards'][number];
const suitSymbols = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
export function Cards({ cards, ownerId }: { cards: readonly PublicCard[]; ownerId?: string }) {
  return <div className="cards">{cards.map((card, index) => <PublicCardFace key={ownerId ? `${ownerId}:${index}` : index} card={card} index={index} ownerId={ownerId} />)}</div>;
}
function PublicCardFace({ card, index, ownerId }: { card: PublicCard; index: number; ownerId?: string }) {
  const deal = useInitialDeal(), ref = usePresentationAnchor(`card:${ownerId}:${index}`);
  const visible = !ownerId || deal.visible(ownerId, index);
  const back = ownerId === 'dealer' && index === 1 && deal.running;
  return <span ref={ownerId ? ref : undefined} data-card-slot={ownerId ? `${ownerId}:${index}` : undefined}
    data-deal-visible={ownerId ? String(visible) : undefined} style={{ opacity: visible ? 1 : 0 }} className={`card ${back ? 'card-back' : card.suit}`} role="img"
    aria-label={`${card.rank} of ${card.suit}`}>{back ? <span aria-hidden="true">◆</span> : <>
      <b>{card.rank}<small aria-hidden="true">{suitSymbols[card.suit]}</small></b><span className="card-pip" aria-hidden="true">{suitSymbols[card.suit]}</span><b className="card-corner" aria-hidden="true">{card.rank}</b></>}</span>;
}
export function HiddenDealerCard() {
  const deal = useInitialDeal(), ref = usePresentationAnchor('card:dealer:1');
  const visible = deal.visible('dealer', 1);
  return <span ref={ref} role="img" aria-label="Hidden dealer card" className="card card-back" data-card-slot="dealer:1"
    data-deal-visible={String(visible)} style={{ opacity: visible ? 1 : 0 }}>◆</span>;
}
