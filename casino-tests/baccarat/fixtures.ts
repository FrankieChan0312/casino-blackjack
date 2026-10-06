import type { PhysicalCard, Rank } from '../../src/domain/card.js';
import { inventory } from '../../src/baccarat/domain/shoe.js';
import { applyCommand, type State, type Command } from '../../src/baccarat/domain/engine.js';
export const rank = (number: number): Rank => number === 0 ? 'K' : number === 1 ? 'A' : String(number) as Rank;
export const cards = (numbers: readonly number[]): readonly PhysicalCard[] => numbers.map((number, index) =>
  Object.freeze({ id: `${index + 1}:clubs:${rank(number)}`, deckIndex: index + 1, suit: 'clubs' as const, rank: rank(number) }));
export function ordered(numbers: readonly number[]) {
  const prefix = cards(numbers), ids = new Set(prefix.map(card => card.id));
  return [...prefix, ...inventory().filter(card => !ids.has(card.id))];
}
export const clock = () => '2026-10-07T00:00:00.000Z';
export function send(state: State, intent: Omit<Command, 'roundId' | 'requestId'> | { type: 'WAGER'; target: 'PLAYER' | 'BANKER' | 'TIE'; amountUnits: number }): State {
  const result = applyCommand(state, { ...intent, requestId: `c${state.commands.length + 1}`, roundId: state.roundId } as Command, clock);
  if (!result.ok) throw new Error(result.error); return result.state;
}
