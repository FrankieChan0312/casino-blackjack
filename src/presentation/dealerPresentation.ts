import { characters, createCharacterLineup, changeHumanCharacter, type CharacterId, type CharacterLineup,
  type PresentationChooser } from './characters.js';

export const DEALER_PRESENTATION_STATES = ['IDLE', 'DEALING', 'WAITING_PLAYER', 'REVEALING', 'DRAWING', 'SETTLING'] as const;
export type DealerPresentationState = typeof DEALER_PRESENTATION_STATES[number];
// These intents describe already-public observations; T05 owns their future feed.
export type DealerPublicObservation = 'INITIAL_DEAL' | 'HOLE_REVEALED' | 'DEALER_CARD_ADDED' | 'RESULTS_COMMITTED';
export function dealerPresentationState(facts: Readonly<{ awaitingPlayer: boolean; interrupted?: boolean;
  observation?: DealerPublicObservation }>): DealerPresentationState {
  if (facts.interrupted) return 'IDLE';
  switch (facts.observation) {
    case 'INITIAL_DEAL': return 'DEALING';
    case 'HOLE_REVEALED': return 'REVEALING';
    case 'DEALER_CARD_ADDED': return 'DRAWING';
    case 'RESULTS_COMMITTED': return 'SETTLING';
    default: return facts.awaitingPlayer ? 'WAITING_PLAYER' : 'IDLE';
  }
}

export function assignDealerIdentity(lineup: CharacterLineup, preferred: CharacterId): CharacterId {
  const seated = new Set([lineup.human, ...Object.values(lineup.guests)]);
  const eligible = characters.filter(entry => !seated.has(entry.id));
  const chosen = eligible.find(entry => entry.id === preferred) ?? eligible[0];
  if (!chosen) throw new Error('No eligible Dealer identity');
  return chosen.id;
}
export function assignRotatingDealerIdentity(lineup: CharacterLineup, pool: readonly CharacterId[],
  preferred: CharacterId, sessionOrdinal: number): CharacterId | null {
  const seated = new Set([lineup.human, ...Object.values(lineup.guests)]);
  const start = (pool.indexOf(preferred) + sessionOrdinal) % pool.length;
  for (let offset = 0; offset < pool.length; offset++) {
    const candidate = pool[(start + offset) % pool.length];
    if (!seated.has(candidate)) return candidate;
  }
  return null;
}
export type DealerTableIdentity = Readonly<{ lineup: CharacterLineup; characterId: CharacterId | null }>;
export function createDealerTableIdentity(guestSeats: readonly number[], choose?: PresentationChooser,
  human: CharacterId = 'knight_male', preferred?: CharacterId, rotationPool?: readonly CharacterId[], sessionOrdinal = 0): DealerTableIdentity {
  const lineup = createCharacterLineup(guestSeats, choose, human);
  // No owner-selected preferred ID means no identity assignment or artwork claim.
  return Object.freeze({ lineup, characterId: preferred ? rotationPool
    ? assignRotatingDealerIdentity(lineup, rotationPool, preferred, sessionOrdinal) : assignDealerIdentity(lineup, preferred) : null });
}
export function changeDealerTableHuman(table: DealerTableIdentity, selected: CharacterId): DealerTableIdentity {
  if (selected === table.characterId) return table;
  return Object.freeze({ ...table, lineup: changeHumanCharacter(table.lineup, selected) });
}

type HashedFile = Readonly<{ path: string; sha256: string }>;
export type DealerFormalAsset = Readonly<{
  characterId: CharacterId;
  role: 'dealer';
  variant: 'formal';
  format: 'png';
  transparent: true;
  width: 240;
  height: 320;
  aspectRatio: '3:4';
  src: string;
  sha256: string;
  safeCrop: 'contain-face-hair-upper-body';
  provenance: Readonly<{
    original: HashedFile;
    canonicalPlayer: HashedFile;
    derivedSource: HashedFile & Readonly<{ width: number; height: number }>;
    method: string;
    originalProvenanceReference: string;
    licensingReview: string;
  }>;
  review: Readonly<{ ownerApproval: string; identityComparison: string; decodedAssetEvidence: string;
    dealerZoneEvidence: string }>;
}>;
export type DealerConfiguration = Readonly<{ preferredCharacterId: CharacterId; assets?: readonly DealerFormalAsset[];
  rotationPool?: readonly CharacterId[] }>;
export type DealerPresentation = Readonly<{ characterId: CharacterId | null; role: 'dealer'; variant: 'formal';
  asset: DealerFormalAsset | null; presentationState: DealerPresentationState }>;
export function dealerPresentation(characterId: CharacterId | null, presentationState: DealerPresentationState,
  assets: readonly DealerFormalAsset[] = []): DealerPresentation {
  const asset = assets.find(entry => entry.characterId === characterId && entry.role === 'dealer' && entry.variant === 'formal') ?? null;
  return Object.freeze({ characterId, role: 'dealer', variant: 'formal', asset, presentationState });
}
