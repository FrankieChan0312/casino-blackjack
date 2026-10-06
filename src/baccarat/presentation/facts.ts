import type { PublicView } from '../domain/engine.js';
import { cardSlot, type PresentationFact } from '../../presentation/events.js';
import type { Target } from '../domain/rules.js';

export const baccaratHandId = (roundId: string, zone: 'PLAYER' | 'BANKER') => `${roundId}/${zone.toLowerCase()}`;
export const baccaratWagerSeat: Record<Target, number> = { PLAYER: 0, BANKER: 1, TIE: 2 };

// Copy resolved public facts. No scoring, drawing rules or payout calculation.
export function baccaratFacts(round: NonNullable<PublicView['round']>): readonly PresentationFact[] {
  return Object.freeze([
    ...round.draws.map((draw): PresentationFact => {
      const handId = baccaratHandId(round.id, draw.zone);
      return Object.freeze({ type: 'DEAL_CARD', card: cardSlot(round.id, draw.zone === 'PLAYER' ? 0 : 1, handId, draw.index),
        face: draw.card, reason: draw.reason === 'INITIAL' ? 'INITIAL' : 'SUPPLEMENT', destination: `card:${handId}:${draw.index}` });
    }),
    ...round.settlements.map((result): PresentationFact => Object.freeze({ type: 'SETTLE_RESULT',
      seat: baccaratWagerSeat[result.target], kind: `BACCARAT_${result.target}`, outcome: result.result,
      stake: result.stakeUnits, returned: result.grossUnits, returnTo: 'local-credits' })),
  ]);
}
