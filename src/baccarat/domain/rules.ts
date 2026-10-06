import type { PhysicalCard, Rank } from '../../domain/card.js';

export type Target = 'PLAYER' | 'BANKER' | 'TIE';
export const TARGETS: readonly Target[] = Object.freeze(['PLAYER', 'BANKER', 'TIE']);
export type Wagers = Readonly<Record<Target, number>>;
export const EMPTY_WAGERS: Wagers = Object.freeze({ PLAYER: 0, BANKER: 0, TIE: 0 });
export type Settlement = Readonly<{ target: Target; stakeUnits: number; grossUnits: number; netUnits: number;
  result: 'WIN' | 'LOSS' | 'PUSH' }>;
export type Draw = Readonly<{ zone: 'PLAYER' | 'BANKER'; index: number; card: PhysicalCard;
  totalAfter: number; reason: 'INITIAL' | 'THIRD' }>;
export type Round = Readonly<{ id: string; player: readonly PhysicalCard[]; banker: readonly PhysicalCard[];
  playerTotal: number; bankerTotal: number; playerInitial: number; bankerInitial: number;
  natural: boolean; playerNatural: boolean; bankerNatural: boolean;
  playerDecision: 'DRAW' | 'STAND' | 'NATURAL'; bankerDecision: 'DRAW' | 'STAND' | 'NATURAL';
  outcome: Target; draws: readonly Draw[]; wagers: Wagers; settlements: readonly Settlement[] }>;

export function value(rank: Rank): number {
  if (rank === 'A') return 1;
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 0;
  const result = Number(rank);
  if (!Number.isInteger(result) || result < 2 || result > 9) throw new RangeError('Invalid Baccarat rank');
  return result;
}
export function total(cards: readonly Pick<PhysicalCard, 'rank'>[]): number {
  return cards.reduce((sum, card) => sum + value(card.rank), 0) % 10;
}
function digit(number: number) {
  if (!Number.isInteger(number) || number < 0 || number > 9) throw new RangeError('Expected total/card value0–9');
}
export function playerDraws(initial: number): boolean { digit(initial); return initial <= 5; }
export function bankerDraws(initial: number, playerThird: number | null): boolean {
  digit(initial); if (playerThird !== null) digit(playerThird);
  if (initial >= 7) return false;
  if (playerThird === null) return initial <= 5;
  switch (initial) {
    case 0: case 1: case 2: return true;
    case 3: return playerThird !== 8;
    case 4: return playerThird >= 2 && playerThird <= 7;
    case 5: return playerThird >= 4 && playerThird <= 7;
    case 6: return playerThird === 6 || playerThird === 7;
    default: return false;
  }
}
export function settleWagers(wagers: Wagers, outcome: Target): readonly Settlement[] {
  if (!TARGETS.includes(outcome)) throw new RangeError('Invalid Baccarat outcome');
  for (const target of TARGETS) {
    const stake = wagers[target];
    if (!Number.isSafeInteger(stake) || stake < 0 || stake > 100000 || stake % 100 !== 0) {
      throw new RangeError('Wager must be1–1000 whole credits, or zero');
    }
  }
  return Object.freeze(TARGETS.filter(target => wagers[target] > 0).map(target => {
    const stakeUnits = wagers[target];
    if (!Number.isSafeInteger(stakeUnits) || stakeUnits < 100 || stakeUnits > 100000 || stakeUnits % 100 !== 0) {
      throw new RangeError('Wager must be1–1000 whole credits');
    }
    const result = target === outcome ? 'WIN' : outcome === 'TIE' && target !== 'TIE' ? 'PUSH' : 'LOSS';
    const grossUnits = result === 'PUSH' ? stakeUnits : result === 'LOSS' ? 0
      : target === 'PLAYER' ? stakeUnits * 2 : target === 'BANKER' ? stakeUnits / 100 * 195 : stakeUnits * 9;
    return Object.freeze({ target, stakeUnits, grossUnits, netUnits: grossUnits - stakeUnits, result });
  }));
}
export function resolveRound(id: string, cards: readonly PhysicalCard[], wagers: Wagers = EMPTY_WAGERS): Round {
  const player: PhysicalCard[] = [], banker: PhysicalCard[] = [], draws: Draw[] = [], seen = new Set<string>();
  let cursor = 0;
  function draw(zone: 'PLAYER' | 'BANKER', reason: 'INITIAL' | 'THIRD') {
    const original = cards[cursor++];
    if (!original || seen.has(original.id) || original.id !== `${original.deckIndex}:${original.suit}:${original.rank}`
      || !['clubs', 'diamonds', 'hearts', 'spades'].includes(original.suit)
      || !Number.isInteger(original.deckIndex) || original.deckIndex < 1 || original.deckIndex > 8) throw new Error('Baccarat draw integrity failure');
    value(original.rank); seen.add(original.id);
    const card = Object.freeze({ ...original });
    const hand = zone === 'PLAYER' ? player : banker; hand.push(card);
    draws.push(Object.freeze({ zone, index: hand.length - 1, card, totalAfter: total(hand), reason }));
  }
  draw('PLAYER', 'INITIAL'); draw('BANKER', 'INITIAL'); draw('PLAYER', 'INITIAL'); draw('BANKER', 'INITIAL');
  const playerInitial = total(player), bankerInitial = total(banker);
  const playerNatural = playerInitial >= 8, bankerNatural = bankerInitial >= 8, natural = playerNatural || bankerNatural;
  let playerDecision: Round['playerDecision'] = natural ? 'NATURAL' : 'STAND';
  let bankerDecision: Round['bankerDecision'] = natural ? 'NATURAL' : 'STAND';
  if (!natural) {
    if (playerDraws(playerInitial)) { playerDecision = 'DRAW'; draw('PLAYER', 'THIRD'); }
    if (bankerDraws(bankerInitial, playerDecision === 'DRAW' ? value(player[2].rank) : null)) {
      bankerDecision = 'DRAW'; draw('BANKER', 'THIRD');
    }
  }
  const playerTotal = total(player), bankerTotal = total(banker);
  const outcome: Target = playerTotal > bankerTotal ? 'PLAYER' : playerTotal < bankerTotal ? 'BANKER' : 'TIE';
  return Object.freeze({ id, player: Object.freeze(player), banker: Object.freeze(banker), playerInitial, bankerInitial,
    playerTotal, bankerTotal, natural, playerNatural, bankerNatural, playerDecision, bankerDecision, outcome,
    draws: Object.freeze(draws), wagers: Object.freeze({ ...wagers }), settlements: settleWagers(wagers, outcome) });
}
