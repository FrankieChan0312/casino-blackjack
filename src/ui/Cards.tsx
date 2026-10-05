import type { BrowserView } from '../browser/controller.js';

type PublicCard = NonNullable<BrowserView['round']>['dealer']['visibleCards'][number];
const suitSymbols = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
export function Cards({ cards, ownerId }: { cards: readonly PublicCard[]; ownerId?: string }) {
  return <div className="cards">{cards.map((card, index) => <span key={ownerId ? `${ownerId}:${index}` : index} data-card-slot={ownerId ? `${ownerId}:${index}` : undefined} className={`card ${card.suit}`} role="img"
    aria-label={`${card.rank} of ${card.suit}`}><b>{card.rank}<small aria-hidden="true">{suitSymbols[card.suit]}</small></b><span className="card-pip" aria-hidden="true">{suitSymbols[card.suit]}</span><b className="card-corner" aria-hidden="true">{card.rank}</b></span>)}</div>;
}
