import { useState } from 'react';
import { character } from '../presentation/characters.js';
import type { DealerFormalAsset } from '../presentation/dealerPresentation.js';
import { CasinoPerson } from './CasinoPerson.js';

export function DealerAvatar({ asset }: { asset: DealerFormalAsset | null }) {
  const [failed, setFailed] = useState<DealerFormalAsset | null>(null);
  if (!asset || failed === asset) return <CasinoPerson kind="dealer" />;
  return <img className="casino-person dealer-formal-portrait" src={asset.src} width={asset.width} height={asset.height}
    alt={`Dealer: ${character(asset.characterId).name}`} onError={() => setFailed(asset)} />;
}
