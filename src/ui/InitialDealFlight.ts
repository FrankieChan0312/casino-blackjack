import { animate } from 'motion/mini';
import type { AnchorRegistry } from '../presentation/anchors.js';
import type { InitialCardEvent } from '../presentation/initialDeal.js';
import { initialCardKey } from '../presentation/initialDeal.js';
import { MOTION_TOKENS } from '../presentation/motionTokens.js';
import type { VisualStep } from '../presentation/timeline.js';

// One decorative card back. Identity and face remain solely in the authoritative DOM.
export function playInitialDealFlight(event: InitialCardEvent, anchors: AnchorRegistry, arrive: () => void): VisualStep | void {
  const origin = anchors.measure('deal-origin');
  const summaryId = typeof event.card.owner === 'number' ? `hand-summary:${event.card.owner}` as const : null;
  const summaryElement = summaryId ? anchors.get(summaryId) : null;
  const summaryTarget = summaryId && summaryElement?.closest('details')?.open === false ? anchors.measure(summaryId) : null;
  const cardTarget = summaryTarget ? null : anchors.measure(`card:${initialCardKey(event.card.handId, event.card.index)}`);
  const target = summaryTarget ?? cardTarget
    ?? anchors.measure(event.destination) ?? (typeof event.card.owner === 'number' ? anchors.measure(`seat-${event.card.owner}`) : null);
  if (!origin || !target) { arrive(); return; }
  const layer = document.createElement('div'), card = document.createElement('span');
  if (event.reason === 'INITIAL') layer.dataset.initialDealFlight = event.id;
  else { layer.dataset.actionCardFlight = event.id; layer.dataset.actionReason = event.reason; }
  layer.dataset.dealTarget = initialCardKey(event.card.handId, event.card.index);
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'absolute', left: '0', top: '0', width: '100%', height: `${document.documentElement.scrollHeight}px`,
    overflow: 'clip', pointerEvents: 'none', zIndex: '100' });
  card.className = 'card card-back'; card.textContent = '◆';
  const width = cardTarget?.width ?? Math.min(target.width, 64), height = cardTarget?.height ?? width * 1.375;
  const x = target.left + (target.width - width) / 2 + window.scrollX;
  const y = target.top + (target.height - height) / 2 + window.scrollY;
  Object.assign(card.style, { position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`, margin: '0', animation: 'none', opacity: '1' });
  layer.append(card); document.body.append(layer);
  const transform = `translate(${origin.left + origin.width / 2 + window.scrollX - x - width / 2}px, ${origin.top + origin.height / 2 + window.scrollY - y - height / 2}px) scale(.8) rotate(-6deg)`;
  card.style.transform = transform;
  const controls = animate(card, { transform: [transform, 'translate(0px, 0px) scale(1) rotate(0deg)'] },
    { duration: event.reason === 'INITIAL' ? MOTION_TOKENS.initialCardDeal : MOTION_TOKENS.cardDeal, ease: [...MOTION_TOKENS.arrivalEase] });
  let settled = false;
  return {
    finished: new Promise<void>((resolve, reject) => { controls.then(resolve, reject); }),
    cancel() { controls.cancel(); layer.remove(); },
    settle() { layer.remove(); if (!settled) { settled = true; arrive(); } },
  };
}
