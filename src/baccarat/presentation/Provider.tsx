import { createContext, useCallback, useContext, useLayoutEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { connectPresentation, consumePresentation } from '../../ui/PresentationProvider.js';
import { initialCardKey, initialCards } from '../../presentation/initialDeal.js';
import { playerCardKeys } from '../../presentation/playerActions.js';
import { wagerEvents } from '../../presentation/wagers.js';
import type { AnchorId, PresentationFeed } from '../../presentation/events.js';
import type { PresentationMode } from '../../presentation/timeline.js';
import { createBaccaratPresentationRuntime } from './runtime.js';

type Runtime = ReturnType<typeof createBaccaratPresentationRuntime>;
const Context = createContext<{ runtime: Runtime; feed: PresentationFeed; mode: PresentationMode;
  sessionReduced: boolean; systemReduced: boolean; setSessionReduced(value: boolean): void } | null>(null);
const emptySubscription = () => () => {}, emptySnapshot = () => null;
function subscribeReduced(changed: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', changed); return () => query.removeEventListener('change', changed);
}
const readReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function BaccaratPresentationProvider({ feed, mode, children }: { feed: PresentationFeed; mode?: PresentationMode; children: ReactNode }) {
  const [runtime] = useState(createBaccaratPresentationRuntime), [sessionReduced, setSessionReduced] = useState(false);
  const systemReduced = useSyncExternalStore(subscribeReduced, readReduced, () => false);
  const resolvedMode = sessionReduced || systemReduced ? 'REDUCED_MOTION' : mode ?? 'FULL_MOTION';
  const snapshot = useSyncExternalStore(feed.subscribe, feed.getSnapshot, feed.getSnapshot);
  useLayoutEffect(() => connectPresentation(feed, runtime, resolvedMode, true), [feed, runtime, resolvedMode]);
  useLayoutEffect(() => consumePresentation(feed, runtime, resolvedMode), [feed, runtime, resolvedMode, snapshot]);
  return <MotionConfig reducedMotion={resolvedMode === 'FULL_MOTION' ? 'user' : 'always'}><Context.Provider value={{ runtime, feed, mode: resolvedMode, sessionReduced, systemReduced, setSessionReduced }}>
    {resolvedMode !== 'FULL_MOTION' && <style>{'.baccarat-page *, .baccarat-page *::before, .baccarat-page *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }'}</style>}
    {children}</Context.Provider></MotionConfig>;
}

export function useBaccaratAnchor(id: AnchorId) {
  const runtime = useContext(Context)?.runtime;
  return useCallback((element: HTMLElement | null) => element && runtime ? runtime.anchors.register(id, element) : undefined, [runtime, id]);
}

export function useBaccaratPresentation() {
  const context = useContext(Context), runtime = context?.runtime;
  const initial = useSyncExternalStore(runtime?.initialDeal.subscribe ?? emptySubscription, runtime?.initialDeal.getSnapshot ?? emptySnapshot, emptySnapshot);
  const third = useSyncExternalStore(runtime?.playerActions.subscribe ?? emptySubscription, runtime?.playerActions.getSnapshot ?? emptySnapshot, emptySnapshot);
  const wagers = useSyncExternalStore(runtime?.wagers.subscribe ?? emptySubscription, runtime?.wagers.getSnapshot ?? emptySnapshot, emptySnapshot);
  const timeline = useSyncExternalStore(runtime?.timeline.subscribe ?? emptySubscription, runtime?.timeline.getSnapshot ?? emptySnapshot, emptySnapshot);
  const feed = useSyncExternalStore(context?.feed.subscribe ?? emptySubscription, context?.feed.getSnapshot ?? emptySnapshot, emptySnapshot);
  const events = context?.mode === 'FULL_MOTION' ? feed?.batches.flatMap(batch => batch.events) ?? [] : [];
  const initialKeys = context?.mode === 'FULL_MOTION' ? [...initial?.pending ?? [], ...initialCards(events).map(event => initialCardKey(event.card.handId, event.card.index))] : [];
  const keys = context?.mode === 'FULL_MOTION' ? [...initialKeys, ...third?.pending ?? [], ...playerCardKeys(events)] : [];
  const settling = context?.mode === 'FULL_MOTION' && (!!wagers?.pending.length || !!wagerEvents(events).length);
  return { ...context, mode: context?.mode ?? 'IMMEDIATE', cardsRunning: !!keys.length, initialRunning: !!initialKeys.length,
    running: !!keys.length || settling || !!timeline?.activeId || !!timeline?.pending, settling,
    visible: (handId: string, index: number) => !keys.includes(initialCardKey(handId, index)), skip: () => runtime?.timeline.skip() };
}
