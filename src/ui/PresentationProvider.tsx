import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { MotionConfig, useReducedMotion } from 'motion/react';
import { animate } from 'motion/mini';
import { createAnchorRegistry } from '../presentation/anchors.js';
import { createPresentationTimeline, type VisualStep, type PresentationMode } from '../presentation/timeline.js';
import type { AnchorId, PresentationFeed } from '../presentation/events.js';
import { MOTION_TOKENS } from '../presentation/motionTokens.js';
import type { DealerPresentationState } from '../presentation/dealerPresentation.js';

// T05 default player deliberately has no gameplay tween. Later tasks supply visuals.
export function createPresentationRuntime() {
  return { anchors: createAnchorRegistry(), timeline: createPresentationTimeline() };
}
type Runtime = ReturnType<typeof createPresentationRuntime>;
const PresentationContext = createContext<Runtime | null>(null);
export const usePresentationRuntime = () => useContext(PresentationContext);
const emptySubscription = () => () => {};
const emptySnapshot = () => null;
export function useDealerPresentationState(fallback: DealerPresentationState): DealerPresentationState {
  const runtime = usePresentationRuntime();
  const snapshot = useSyncExternalStore(runtime?.timeline.subscribe ?? emptySubscription, runtime?.timeline.getSnapshot ?? emptySnapshot, emptySnapshot);
  return snapshot?.dealerState ?? fallback;
}

export function usePresentationAnchor(id: AnchorId) {
  const runtime = usePresentationRuntime();
  return useCallback((element: HTMLElement | null) => element && runtime ? runtime.anchors.register(id, element) : undefined, [runtime, id]);
}

// Demand-driven native Motion control, used by the isolated infrastructure harness.
// No domain/controller reference or command callback is accepted.
export function playMotionStep(element: HTMLElement, keyframes: { opacity: number[] }, duration = MOTION_TOKENS.resultEmphasis): VisualStep {
  const controls = animate(element, keyframes, { duration, ease: [...MOTION_TOKENS.arrivalEase] });
  return { finished: new Promise<void>((resolve, reject) => { controls.then(resolve, reject); }), cancel: () => controls.cancel(), settle: () => { element.style.opacity = String(keyframes.opacity.at(-1)); } };
}

export function connectPresentation(feed: PresentationFeed, runtime: Runtime, mode: PresentationMode) {
  runtime.timeline.setMode(mode);
  function consume() {
    const snapshot = feed.getSnapshot();
    runtime.timeline.begin(snapshot.generation);
    for (const batch of snapshot.batches) runtime.timeline.enqueue(batch.events);
    feed.acknowledge(snapshot.revision);
  }
  consume();
  const unsubscribe = feed.subscribe(consume);
  const settle = () => runtime.timeline.skip();
  const visibility = () => { if (document.hidden) settle(); };
  window.addEventListener('resize', settle);
  document.addEventListener('visibilitychange', visibility);
  return () => {
    unsubscribe(); window.removeEventListener('resize', settle); document.removeEventListener('visibilitychange', visibility);
    runtime.timeline.cancel();
  };
}

export function PresentationProvider({ feed, children }: { feed: PresentationFeed; children: ReactNode }) {
  const [runtime] = useState(createPresentationRuntime);
  const reduced = useReducedMotion();
  useEffect(() => connectPresentation(feed, runtime, reduced ? 'REDUCED_MOTION' : 'FULL_MOTION'), [feed, runtime, reduced]);
  return <MotionConfig reducedMotion="user"><PresentationContext.Provider value={runtime}>{children}</PresentationContext.Provider></MotionConfig>;
}
