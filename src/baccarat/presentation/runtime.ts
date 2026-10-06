import { animate } from 'motion/mini';
import { createAnchorRegistry, type AnchorRegistry } from '../../presentation/anchors.js';
import { createPresentationTimeline, type EventPlayer, type VisualStep } from '../../presentation/timeline.js';
import { createInitialDealProjection } from '../../presentation/initialDeal.js';
import { createPlayerActionProjection } from '../../presentation/playerActions.js';
import { createDealerActionProjection } from '../../presentation/dealerActions.js';
import { createWagerProjection, wagerFlight, type WagerEvent } from '../../presentation/wagers.js';
import { MOTION_TOKENS } from '../../presentation/motionTokens.js';
import { playInitialDealFlight } from '../../ui/InitialDealFlight.js';
import type { SplitOrigins } from '../../ui/PlayerActionMotion.js';
import { baccaratCredits } from '../format.js';

export function playBaccaratWager(event: WagerEvent, anchors: AnchorRegistry, arrive: () => void): VisualStep | void {
  const flight = wagerFlight(event), source = anchors.measure(flight.from), target = anchors.measure(flight.to);
  if (!source || !target || flight.amount <= 0) { arrive(); return; }
  const layer = document.createElement('div'), stack = document.createElement('span'), disc = document.createElement('span'), label = document.createElement('span');
  Object.assign(layer.dataset, { wagerFlight: event.id, wagerStage: event.type, wagerKind: event.kind,
    wagerSeat: String(event.seat), wagerAmount: String(flight.amount), wagerDestination: flight.to });
  if (event.type === 'SETTLE_RESULT') layer.dataset.wagerOutcome = event.outcome;
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'absolute', inset: '0', height: `${document.documentElement.scrollHeight}px`, overflow: 'clip', pointerEvents: 'none', zIndex: '100' });
  const x = target.left + target.width / 2 + scrollX, y = target.top + target.height / 2 + scrollY;
  Object.assign(stack.style, { position: 'absolute', left: `${x}px`, top: `${y}px`, display: 'flex', alignItems: 'center', gap: '5px', transform: 'translate(-50%, -50%)', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', color: '#fff1bd' });
  Object.assign(disc.style, { display: 'inline-block', width: '28px', height: '24px', borderRadius: '50%', background: '#23564b', border: '3px dashed #d3b56d', boxShadow: '0 4px 0 #b79a54, 0 7px 8px #0008' });
  label.textContent = `${event.type === 'SETTLE_RESULT' ? event.outcome : event.kind} · ${baccaratCredits(flight.amount)} credits`;
  Object.assign(label.style, { background: '#15392eee', borderRadius: '4px', padding: '3px 5px' });
  stack.append(disc, label); layer.append(stack); document.body.append(layer);
  const start = `translate(calc(-50% + ${source.left + source.width / 2 + scrollX - x}px), calc(-50% + ${source.top + source.height / 2 + scrollY - y}px))`;
  const controls = animate(stack, { transform: [start, 'translate(-50%, -50%)'] }, { duration: MOTION_TOKENS.wager, ease: [...MOTION_TOKENS.arrivalEase] });
  let settled = false;
  return { finished: new Promise<void>((resolve, reject) => controls.then(resolve, reject)),
    cancel() { controls.cancel(); layer.remove(); }, settle() { layer.remove(); if (!settled) { settled = true; arrive(); } } };
}

// Existing scheduler/projections/lifecycle; only the Baccarat visual players differ.
export function createBaccaratPresentationRuntime(player?: EventPlayer) {
  const anchors = createAnchorRegistry(), initialDeal = createInitialDealProjection(), playerActions = createPlayerActionProjection();
  const dealerActions = createDealerActionProjection(), wagers = createWagerProjection(), splitOrigins: SplitOrigins = new Map();
  const timeline = createPresentationTimeline(event => {
    if (player) return player(event);
    if (event.type === 'DEAL_CARD') return playInitialDealFlight(event, anchors,
      () => event.reason === 'INITIAL' ? initialDeal.arrive(event) : playerActions.arrive(event));
    if (event.type === 'SETTLE_RESULT' || event.type === 'MOVE_WAGER') return playBaccaratWager(event, anchors, () => wagers.arrive(event));
  });
  timeline.subscribe(() => {
    const snapshot = timeline.getSnapshot();
    if (!snapshot.activeId && !snapshot.pending) { initialDeal.clear(); playerActions.clear(); dealerActions.clear(); wagers.clear(); splitOrigins.clear(); }
  });
  return { anchors, timeline, initialDeal, playerActions, dealerActions, wagers, splitOrigins };
}
