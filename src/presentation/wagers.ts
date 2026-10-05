import type { AnchorId, PresentationEvent } from './events.js';

export type WagerEvent = Extract<PresentationEvent, { type: 'MOVE_WAGER' | 'SETTLE_RESULT' }>;
export function wagerEvents(events: readonly PresentationEvent[]): WagerEvent[] {
  return events.filter((event): event is WagerEvent => event.type === 'MOVE_WAGER' || event.type === 'SETTLE_RESULT');
}
export function wagerFlight(event: WagerEvent): Readonly<{ amount: number; from: AnchorId; to: AnchorId }> {
  const account = event.returnTo ?? `seat-${event.seat}`;
  const spot: AnchorId = event.kind.endsWith('INSURANCE') && account === 'local-credits' ? 'insurance-wager'
    : event.handId ? `hand-wager:${event.handId}` : `wager:${event.seat}`;
  return event.type === 'MOVE_WAGER' ? event.kind.endsWith('_CANCELLED') ? { amount: event.amount, from: spot, to: account } : { amount: event.amount, from: account, to: spot }
    : { amount: event.returned > 0 ? event.returned : event.stake, from: spot, to: event.returned > 0 ? account : 'dealer-hand' };
}
// Event completion only. Visible credits and all amounts remain authoritative.
export function createWagerProjection() {
  let snapshot: Readonly<{ generation: number; pending: readonly string[] }> = Object.freeze({ generation:-1,pending:[] });
  const listeners = new Set<() => void>();
  function update(generation:number,pending:readonly string[]) { snapshot=Object.freeze({generation,pending:Object.freeze([...new Set(pending)])});listeners.forEach(listener=>listener()); }
  return {
    getSnapshot:()=>snapshot,
    subscribe(listener:()=>void){listeners.add(listener);return()=>{listeners.delete(listener);};},
    prepare(generation:number,events:readonly PresentationEvent[]){const keys=wagerEvents(events).map(event=>event.id);if(generation!==snapshot.generation||keys.length)update(generation,[...(generation===snapshot.generation?snapshot.pending:[]),...keys]);},
    arrive(event:WagerEvent){if(event.generation===snapshot.generation&&snapshot.pending.includes(event.id))update(snapshot.generation,snapshot.pending.filter(id=>id!==event.id));},
    clear(){if(snapshot.pending.length)update(snapshot.generation,[]);},
  };
}
