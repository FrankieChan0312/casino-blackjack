import type { DealerPresentationState } from './dealerPresentation.js';

// Public positions, not physical-card IDs. Hidden slots deliberately carry no face.
export type CardSlot = Readonly<{ roundId: string; owner: 'dealer' | number; handId: string; index: number }>;
export type PublicFace = Readonly<{ rank: string; suit: string }>;
export type AnchorId = 'deal-origin' | 'dealer-hand' | `seat-${number}` | `hand:${string}` | `wager:${number}` | `hand-wager:${string}`;
export type PresentationFact =
  | Readonly<{ type: 'DEAL_CARD'; card: CardSlot; face: PublicFace | null; reason: 'INITIAL' | 'HIT' | 'DOUBLE' | 'SUPPLEMENT' | 'DEALER'; destination: AnchorId }>
  | Readonly<{ type: 'REVEAL_HOLE_CARD'; card: CardSlot; face: PublicFace }>
  | Readonly<{ type: 'SPLIT_HANDS'; seat: number; parentHandId: string; children: readonly Readonly<{ handId: string; retained: CardSlot; destination: CardSlot }>[] }>
  | Readonly<{ type: 'EMPHASIZE_ACTIVE_HAND'; handId: string | null }>
  | Readonly<{ type: 'PLAYER_ACTION'; seat: number; handId: string; action: string }>
  | Readonly<{ type: 'DEALER_STATE'; state: DealerPresentationState }>
  | Readonly<{ type: 'MOVE_WAGER'; seat: number; amount: number; kind: string }>
  | Readonly<{ type: 'SETTLE_RESULT'; seat: number; handId?: string; kind: string; outcome: string; stake: number; returned: number }>;
export type PresentationEvent = PresentationFact & Readonly<{ id: string; generation: number; sequence: number; ordinal: number }>;
export type PresentationBatch = Readonly<{ generation: number; sequence: number; roundId: string; command: string; events: readonly PresentationEvent[] }>;

export function cardSlot(roundId: string, owner: 'dealer' | number, handId: string, index: number): CardSlot {
  return Object.freeze({ roundId, owner, handId, index });
}
export function cardSlotKey(slot: CardSlot): string {
  return `${slot.roundId}:${slot.owner}:${slot.handId}:${slot.index}`;
}

export function createPresentationFeed() {
  let generation = 0, sequence = 0;
  let snapshot: Readonly<{ generation: number; revision: number; roundId: string; batches: readonly PresentationBatch[]; fault: string }> =
    Object.freeze({ generation, revision: 0, roundId: '', batches: [], fault: '' });
  const listeners = new Set<() => void>();
  function notify() {
    for (const listener of listeners) {
      try { listener(); } catch { snapshot = Object.freeze({ ...snapshot, fault: 'Presentation subscriber failed' }); }
    }
  }
  function clear(roundId = '', fault = '') {
    generation++;
    snapshot = Object.freeze({ generation, revision: ++sequence, roundId, batches: [], fault });
    notify();
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    clear,
    fail() { clear(snapshot.roundId, 'Presentation observation failed; latest authority remains visible'); },
    append(roundId: string, command: string, facts: readonly PresentationFact[]) {
      if (snapshot.roundId !== roundId) clear(roundId);
      // Backlogged/headless consumers settle instead of accumulating command history.
      if (snapshot.batches.reduce((count, batch) => count + batch.events.length, 0) + facts.length > 512) {
        clear(roundId, 'Presentation backlog settled'); return;
      }
      const current = ++sequence;
      const events = facts.map((fact, ordinal) => Object.freeze({ ...fact, generation, sequence: current, ordinal,
        id: `${generation}:${current}:${ordinal}` }));
      const batch = Object.freeze({ generation, sequence: current, roundId, command, events: Object.freeze(events) });
      snapshot = Object.freeze({ ...snapshot, revision: current, batches: Object.freeze([...snapshot.batches, batch]) });
      notify();
    },
    acknowledge(through: number) {
      snapshot = Object.freeze({ ...snapshot, batches: Object.freeze(snapshot.batches.filter(batch => batch.sequence > through)) });
    },
  };
}
export type PresentationFeed = ReturnType<typeof createPresentationFeed>;
