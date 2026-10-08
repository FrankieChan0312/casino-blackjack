import type { PhysicalCard, Rank } from '../../src/domain/card.js';
import { inventory } from '../../src/baccarat/domain/shoe.js';
import { applyCommand, createBaccarat, type State, type Command } from '../../src/baccarat/domain/engine.js';
import { LEGACY_RULES } from '../../src/baccarat/domain/config.js';
import type { WagerTarget } from '../../src/baccarat/domain/rules.js';
// Preserve original M12–M14 fixtures/assertions under their explicit version-1 contract.
export const createLegacyBaccarat = (seed: number, initialUnits = 100000, cards?: readonly PhysicalCard[]) => createBaccarat(seed, initialUnits, cards, LEGACY_RULES);
export const rank = (number: number): Rank => number === 0 ? 'K' : number === 1 ? 'A' : String(number) as Rank;
export const cards = (numbers: readonly number[]): readonly PhysicalCard[] => numbers.map((number, index) =>
  Object.freeze({ id: `${index + 1}:clubs:${rank(number)}`, deckIndex: index + 1, suit: 'clubs' as const, rank: rank(number) }));
export function ordered(numbers: readonly number[]) {
  const prefix = cards(numbers), ids = new Set(prefix.map(card => card.id));
  return [...prefix, ...inventory().filter(card => !ids.has(card.id))];
}
export const clock = () => '2026-10-07T00:00:00.000Z';
export function send(state: State, intent: Omit<Command, 'roundId' | 'requestId'> | { type: 'WAGER'; target: WagerTarget; amountUnits: number }): State {
  const result = applyCommand(state, { ...intent, requestId: `c${state.commands.length + 1}`, roundId: state.roundId } as Command, clock);
  if (!result.ok) throw new Error(result.error); return result.state;
}
