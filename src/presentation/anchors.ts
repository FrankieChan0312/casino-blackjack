import type { AnchorId } from './events.js';

export function createAnchorRegistry() {
  const elements = new Map<AnchorId, HTMLElement>();
  return {
    register(id: AnchorId, element: HTMLElement) {
      elements.set(id, element);
      return () => { if (elements.get(id) === element) elements.delete(id); };
    },
    get: (id: AnchorId) => elements.get(id) ?? null,
    // One demand-driven measurement. Mobile collapsed destinations may return null.
    measure(id: AnchorId) {
      const element = elements.get(id);
      return element?.isConnected && element.getClientRects().length ? element.getBoundingClientRect() : null;
    },
    clear: () => elements.clear(),
  };
}
export type AnchorRegistry = ReturnType<typeof createAnchorRegistry>;
