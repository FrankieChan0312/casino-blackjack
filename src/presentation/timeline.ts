import type { PresentationEvent } from './events.js';
import type { DealerPresentationState } from './dealerPresentation.js';

export type PresentationMode = 'FULL_MOTION' | 'REDUCED_MOTION' | 'IMMEDIATE';
export type VisualStep = Readonly<{ finished: PromiseLike<unknown>; cancel(): void; settle(): void }>;
export type EventPlayer = (event: PresentationEvent) => VisualStep | void;

// No timers or gameplay capability. A visual completion advances only this cursor.
export function createPresentationTimeline(play: EventPlayer = () => {}) {
  let generation = -1, mode: PresentationMode = 'IMMEDIATE';
  let epoch = 0, active: { event: PresentationEvent; step: VisualStep } | null = null;
  let disposed = false;
  let pending: PresentationEvent[] = [];
  const seen = new Set<string>(), listeners = new Set<() => void>();
  let dealerState: DealerPresentationState | null = null;
  let snapshot: Readonly<{ generation: number; mode: PresentationMode; activeId: string | null; pending: number;
    dealerState: DealerPresentationState | null; fault: string }> = Object.freeze({ generation, mode, activeId: null, pending: 0, dealerState, fault: '' });
  function notify(fault: string = snapshot.fault) {
    snapshot = Object.freeze({ generation, mode, activeId: active?.event.id ?? null, pending: pending.length, dealerState, fault });
    for (const listener of listeners) { try { listener(); } catch { snapshot = Object.freeze({ ...snapshot, fault: 'Presentation subscriber failed' }); } }
  }
  function finish(reason = '', settlePending = false) {
    epoch++;
    if (settlePending) for (const event of pending) { if (event.type === 'DEALER_STATE') dealerState = event.state; }
    else dealerState = null;
    const current = active; active = null; pending = [];
    try { current?.step.cancel(); } catch { reason = 'Presentation cancellation failed'; }
    try { current?.step.settle(); } catch { reason = 'Presentation settlement failed'; }
    notify(reason);
  }
  function drain() {
    while (!active && pending.length) {
      const event = pending.shift()!;
      if (event.type === 'DEALER_STATE') dealerState = event.state;
      if (mode !== 'FULL_MOTION') continue;
      let step: VisualStep | void;
      try { step = play(event); } catch { finish('Presentation player failed'); return; }
      if (!step) continue;
      const ticket = epoch;
      active = { event, step }; notify();
      Promise.resolve(step.finished).then(() => {
        if (ticket !== epoch || active?.event.id !== event.id) return;
        active = null;
        try { step.settle(); } catch { finish('Presentation settlement failed'); return; }
        drain();
      }, () => { if (ticket === epoch) finish('Presentation completion failed'); });
    }
    notify();
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    begin(nextGeneration: number) { if (nextGeneration !== generation) { finish(); generation = nextGeneration; dealerState = null; seen.clear(); notify(); } },
    enqueue(events: readonly PresentationEvent[]) {
      if (disposed) return;
      for (const event of events) if (event.generation === generation && !seen.has(event.id)) { seen.add(event.id); pending.push(event); }
      drain();
    },
    setMode(nextMode: PresentationMode) { mode = nextMode; if (mode !== 'FULL_MOTION') finish('', true); else notify(); },
    skip: () => finish('', true),
    cancel: () => finish(),
    dispose() { disposed = true; finish(); seen.clear(); listeners.clear(); },
  };
}
export type PresentationTimeline = ReturnType<typeof createPresentationTimeline>;
