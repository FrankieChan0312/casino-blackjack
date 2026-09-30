import type { BrowserView } from '../browser/controller.js';

export function credits(units: number) { return (units / 2).toLocaleString('en-US', { maximumFractionDigits: 1 }); }
export function handLabel(handId: string) {
  const path = handId.split('.').slice(1);
  return path.length ? `Hand ${path[0] === '1' ? 'A' : 'B'}${path.slice(1).map((part) => '.' + part).join('')}` : 'Hand A';
}
export function roundStatus(view: BrowserView) {
  if (view.phase === 'VOID' || view.round?.phase === 'INTEGRITY_ERROR') return 'Round interrupted';
  if (view.interaction.configuring) return 'Choose your seat or watch as a spectator';
  if (view.interaction.betting) return 'Betting open';
  if (view.follow) return 'Bet Behind follow decision';
  if (view.interaction.insurance) return 'Insurance / Even Money decision';
  if (view.phase === 'COMMITTED' || view.round?.phase === 'ROUND_COMPLETE') return 'Round complete';
  if (view.round?.phase === 'DEALER_TURN') return 'Dealer is drawing';
  return view.round?.currentSeat === view.human?.controlledSeat ? 'Your turn' : `Waiting for Seat ${view.round?.currentSeat ?? ''}`;
}
export function resultLabel(outcome: string | undefined, reason?: string) {
  if (reason === 'PLAYER_BUST') return 'Bust';
  return ({ PLAYER_BLACKJACK: 'Blackjack', PLAYER_WIN: 'Win', DEALER_WIN: 'Loss', PUSH: 'Push',
    SURRENDERED: 'Surrendered', VOID: 'VOID / Integrity Error', EVEN_MONEY: 'Even Money', WIN: 'Win', LOSS: 'Loss',
    PERFECT_PAIR: 'Perfect Pair', COLOURED_PAIR: 'Coloured Pair', MIXED_PAIR: 'Mixed Pair', NONE: 'No Win',
    SUITED_TRIPS: 'Suited Trips', STRAIGHT_FLUSH: 'Straight Flush', THREE_OF_A_KIND: 'Three of a Kind', STRAIGHT: 'Straight', FLUSH: 'Flush',
  } as Record<string, string>)[outcome ?? ''] ?? 'Awaiting result';
}
