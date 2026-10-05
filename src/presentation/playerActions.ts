import type { PresentationEvent } from './events.js';
import { initialCardKey } from './initialDeal.js';

export type PlayerCardEvent = Extract<PresentationEvent, { type: 'DEAL_CARD' }>;
export function playerCardKeys(events: readonly PresentationEvent[]): string[] {
  return events.flatMap(event => event.type === 'DEAL_CARD' && event.reason !== 'INITIAL' && event.reason !== 'DEALER'
    ? [initialCardKey(event.card.handId, event.card.index)] : event.type === 'SPLIT_HANDS'
      ? event.children.map(child => initialCardKey(child.handId, child.destination.index)) : []);
}

// Settlement keys only; authority owns every hand, card, wager and active turn.
export function createPlayerActionProjection() {
  let snapshot: Readonly<{ generation: number; pending: readonly string[] }> = Object.freeze({ generation: -1, pending: [] });
  const listeners = new Set<() => void>();
  function update(generation: number, pending: readonly string[]) {
    snapshot = Object.freeze({ generation, pending: Object.freeze([...new Set(pending)]) });
    listeners.forEach(listener => listener());
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    prepare(generation: number, events: readonly PresentationEvent[]) {
      const keys = playerCardKeys(events);
      if (generation !== snapshot.generation || keys.length) update(generation,
        [...(generation === snapshot.generation ? snapshot.pending : []), ...keys]);
    },
    arrive(event: PresentationEvent) {
      if (event.generation !== snapshot.generation) return;
      const keys = playerCardKeys([event]);
      if (keys.some(key => snapshot.pending.includes(key))) update(snapshot.generation, snapshot.pending.filter(key => !keys.includes(key)));
    },
    clear() { if (snapshot.pending.length) update(snapshot.generation, []); },
  };
}
