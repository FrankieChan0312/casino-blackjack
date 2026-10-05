import { createElement, type HTMLAttributes } from 'react';
import type { AnchorId } from '../presentation/events.js';
import { usePresentationAnchor } from './PresentationProvider.js';

// Reuses the original semantic element; introduces no layout wrapper.
export function PresentationAnchor({ as = 'div', anchor, ...props }: HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'article' | 'p' | 'div'; anchor: AnchorId;
}) {
  return createElement(as, { ...props, ref: usePresentationAnchor(anchor) });
}
