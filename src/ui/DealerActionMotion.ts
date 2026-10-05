import { animate } from 'motion/mini';
import type { AnchorRegistry } from '../presentation/anchors.js';
import type { PresentationEvent } from '../presentation/events.js';
import { MOTION_TOKENS } from '../presentation/motionTokens.js';
import type { VisualStep } from '../presentation/timeline.js';

export function playDealerReveal(event: Extract<PresentationEvent, { type: 'REVEAL_HOLE_CARD' }>, anchors: AnchorRegistry,
  reveal: () => void, arrive: () => void): VisualStep | void {
  const element = anchors.get(`card:${event.card.handId}:${event.card.index}`);
  if (!element) { reveal(); arrive(); return; }
  let cancelled = false;
  element.dataset.dealerReveal = event.id;
  let controls = animate(element, { transform: ['perspective(600px) rotateY(0deg)', 'perspective(600px) rotateY(90deg)'] },
    { duration: MOTION_TOKENS.flip / 2, ease: [...MOTION_TOKENS.emphasisEase] });
  const finished = (async () => {
    await controls;
    if (cancelled) return;
    reveal();
    controls = animate(element, { transform: ['perspective(600px) rotateY(90deg)', 'perspective(600px) rotateY(0deg)'] },
      { duration: MOTION_TOKENS.flip / 2, ease: [...MOTION_TOKENS.emphasisEase] });
    await controls;
  })();
  return { finished, cancel() { cancelled = true; controls.cancel(); },
    settle() { delete element.dataset.dealerReveal; element.style.transform = ''; arrive(); } };
}
