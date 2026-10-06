import { useState } from 'react';
import { character } from '../presentation/characters.js';
import type { DealerFormalAsset } from '../presentation/dealerPresentation.js';
import { GENERIC_FORMAL_DEALER } from '../presentation/genericDealer.js';

export function DealerAvatar({ asset }: { asset: DealerFormalAsset | null }) {
  const [failed, setFailed] = useState<string | null>(null);
  const [genericFailed, setGenericFailed] = useState(false);
  const requested = asset && failed !== asset.src ? asset : null;
  if (!requested && genericFailed) return <span className="casino-person dealer-formal-portrait"
    role="img" aria-label="Dealer portrait unavailable" data-dealer-avatar="unavailable">Dealer</span>;
  const portrait = requested ?? GENERIC_FORMAL_DEALER;
  return <img className="casino-person dealer-formal-portrait" src={portrait.src} width={portrait.width} height={portrait.height}
    data-dealer-avatar={requested ? 'formal' : 'generic-formal'}
    alt={requested ? `Dealer: ${character(requested.characterId).name}` : 'Dealer: generic formal portrait'}
    onError={() => { if (requested) setFailed(requested.src); else setGenericFailed(true); }} />;
}
