import type { PresentationEvent } from './events.js';

export type InitialCardEvent = Extract<PresentationEvent, { type: 'DEAL_CARD' }>;
export const initialCardKey = (handId: string, index: number) => `${handId}:${index}`;
export const initialCards = (events: readonly PresentationEvent[]) => events.filter(
  (event): event is InitialCardEvent => event.type === 'DEAL_CARD' && event.reason === 'INITIAL');

// Only visual event completion is retained. No cards, game snapshot or command capability.
export function createInitialDealProjection() {
  let generation = -1;
  let snapshot: Readonly<{ generation: number; pending: readonly string[]; delivered: number }> =
    Object.freeze({ generation, pending: [], delivered: 0 });
  const listeners = new Set<() => void>();
  function update(pending: readonly string[], delivered: number) {
    snapshot = Object.freeze({ generation, pending: Object.freeze([...pending]), delivered });
    listeners.forEach(listener => listener());
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    prepare(nextGeneration: number, events: readonly PresentationEvent[]) {
      const keys = initialCards(events).map(event => initialCardKey(event.card.handId, event.card.index));
      if (generation !== nextGeneration) { generation = nextGeneration; update(keys, 0); }
      else if (keys.length) update([...snapshot.pending, ...keys.filter(key => !snapshot.pending.includes(key))], snapshot.delivered);
    },
    arrive(event: InitialCardEvent) {
      if (event.generation !== generation) return;
      const key = initialCardKey(event.card.handId, event.card.index);
      if (snapshot.pending.includes(key)) update(snapshot.pending.filter(entry => entry !== key), snapshot.delivered + 1);
    },
    clear() { if (snapshot.pending.length) update([], snapshot.delivered); },
  };
}
