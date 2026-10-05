import type { PresentationEvent } from './events.js';
import { initialCardKey } from './initialDeal.js';

export function dealerCardKeys(events: readonly PresentationEvent[]) {
  return events.flatMap(event => event.type === 'REVEAL_HOLE_CARD' || event.type === 'DEAL_CARD' && event.reason === 'DEALER'
    ? [initialCardKey(event.card.handId, event.card.index)] : []);
}
// Visual positions only. No secret face or duplicate Dealer strategy/state.
export function createDealerActionProjection() {
  let snapshot: Readonly<{ generation: number; pending: readonly string[]; revealed: readonly string[] }> =
    Object.freeze({ generation: -1, pending: [], revealed: [] });
  const listeners = new Set<() => void>();
  function update(generation: number, pending: readonly string[], revealed: readonly string[]) {
    snapshot = Object.freeze({ generation, pending: Object.freeze([...new Set(pending)]), revealed: Object.freeze([...new Set(revealed)]) });
    listeners.forEach(listener => listener());
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    prepare(generation: number, events: readonly PresentationEvent[]) {
      const keys = dealerCardKeys(events);
      if (generation !== snapshot.generation) update(generation, keys, []);
      else if (keys.length) update(generation, [...snapshot.pending, ...keys], snapshot.revealed);
    },
    reveal(event: PresentationEvent) {
      const key = event.type === 'REVEAL_HOLE_CARD' ? initialCardKey(event.card.handId, event.card.index) : '';
      if (event.generation === snapshot.generation && snapshot.pending.includes(key)) update(snapshot.generation, snapshot.pending, [...snapshot.revealed, key]);
    },
    arrive(event: PresentationEvent) {
      if (event.generation !== snapshot.generation) return;
      const keys = dealerCardKeys([event]);
      update(snapshot.generation, snapshot.pending.filter(key => !keys.includes(key)), snapshot.revealed.filter(key => !keys.includes(key)));
    },
    clear() { if (snapshot.pending.length) update(snapshot.generation, [], []); },
  };
}
