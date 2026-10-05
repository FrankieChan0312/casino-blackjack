import { animate } from 'motion/mini';
import type { AnchorRegistry } from '../presentation/anchors.js';
import type { PresentationEvent } from '../presentation/events.js';
import { initialCardKey } from '../presentation/initialDeal.js';
import { MOTION_TOKENS } from '../presentation/motionTokens.js';
import type { VisualStep } from '../presentation/timeline.js';

export type SplitOrigins = Map<string, DOMRect>;
// Input capture precedes authoritative replacement; retain geometry only.
export function captureSplitOrigins(anchors: AnchorRegistry, origins: SplitOrigins) {
  origins.clear();
  for (const element of document.querySelectorAll<HTMLElement>('[data-card-slot]')) {
    const key = element.dataset.cardSlot!, box = anchors.measure(`card:${key}`);
    if (box) origins.set(key, box);
  }
}
export function playSplitMotion(event: Extract<PresentationEvent, { type: 'SPLIT_HANDS' }>, anchors: AnchorRegistry,
  origins: SplitOrigins, arrive: () => void): VisualStep | void {
  const layer = document.createElement('div');
  layer.dataset.splitFlight = event.id; layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { position: 'absolute', inset: '0', height: `${document.documentElement.scrollHeight}px`, overflow: 'clip', pointerEvents: 'none', zIndex: '100' });
  const controls = event.children.flatMap(child => {
    const targetKey = initialCardKey(child.handId, child.destination.index);
    const target = anchors.measure(`card:${targetKey}`), source = origins.get(initialCardKey(child.retained.handId, child.retained.index));
    const element = anchors.get(`card:${targetKey}`);
    if (!target || !source || !element) return [];
    const clone = element.cloneNode(true) as HTMLElement;
    clone.removeAttribute('role'); clone.removeAttribute('aria-label'); clone.removeAttribute('data-card-slot'); clone.removeAttribute('data-deal-visible');
    clone.dataset.splitTarget = targetKey;
    Object.assign(clone.style, { position: 'absolute', left: `${target.left + scrollX}px`, top: `${target.top + scrollY}px`,
      width: `${target.width}px`, height: `${target.height}px`, opacity: '1', margin: '0', animation: 'none' });
    layer.append(clone);
    const transform = `translate(${source.left - target.left}px, ${source.top - target.top}px)`;
    clone.style.transform = transform;
    return [animate(clone, { transform: [transform, 'translate(0px, 0px)'] }, { duration: MOTION_TOKENS.split, ease: [...MOTION_TOKENS.arrivalEase] })];
  });
  origins.clear();
  if (!controls.length) { arrive(); return; }
  document.body.append(layer);
  let settled = false;
  return { finished: Promise.all(controls.map(control => Promise.resolve(control))),
    cancel() { controls.forEach(control => control.cancel()); layer.remove(); },
    settle() { layer.remove(); if (!settled) { settled = true; arrive(); } } };
}
