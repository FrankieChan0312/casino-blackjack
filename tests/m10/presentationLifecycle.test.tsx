import { expect, it, vi } from 'vitest';
import { connectPresentation, createPresentationRuntime } from '../../src/ui/PresentationProvider.js';
import { createPresentationFeed } from '../../src/presentation/events.js';

it('[T05-L01] mode reconnect retains mounted anchor refs while releasing old listeners and visual work',()=>{
  vi.stubGlobal('window',new EventTarget());vi.stubGlobal('document',Object.assign(new EventTarget(),{hidden:false}));
  const feed=createPresentationFeed(),runtime=createPresentationRuntime(),element={} as HTMLElement;
  runtime.anchors.register('deal-origin',element);
  try {
    const disconnect=connectPresentation(feed,runtime,'FULL_MOTION');disconnect();
    const reducedDisconnect=connectPresentation(feed,runtime,'REDUCED_MOTION');
    expect(runtime.anchors.get('deal-origin')).toBe(element);
    feed.append('r1','CLOSE',[{type:'DEALER_STATE',state:'WAITING_PLAYER'}]);
    expect(feed.getSnapshot().batches).toHaveLength(0);expect(runtime.timeline.getSnapshot().dealerState).toBe('WAITING_PLAYER');
    reducedDisconnect();feed.append('r1','CLOSE',[{type:'DEALER_STATE',state:'IDLE'}]);expect(feed.getSnapshot().batches).toHaveLength(1);
  } finally {vi.unstubAllGlobals();}
});
