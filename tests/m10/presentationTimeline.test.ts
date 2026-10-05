import { expect, it, vi } from 'vitest';
import { createPresentationFeed, type PresentationEvent } from '../../src/presentation/events.js';
import { createPresentationTimeline, type PresentationMode } from '../../src/presentation/timeline.js';
import { createAnchorRegistry } from '../../src/presentation/anchors.js';

function events() {
  const feed = createPresentationFeed();
  feed.append('round-1', 'CLOSE', [{ type: 'DEALER_STATE', state: 'DEALING' }, { type: 'DEALER_STATE', state: 'WAITING_PLAYER' }]);
  return feed.getSnapshot().batches[0].events;
}
function controlled() {
  const played: string[] = [], cancelled: string[] = [], settled: string[] = [], completions: (() => void)[] = [];
  const timeline = createPresentationTimeline(event => {
    played.push(event.id);
    return { finished: new Promise<void>(resolve => completions.push(resolve)), cancel: () => { cancelled.push(event.id); }, settle: () => { settled.push(event.id); } };
  });
  timeline.begin(1); timeline.setMode('FULL_MOTION');
  return { timeline, played, cancelled, settled, completions };
}
it('[T05-Q01] sequence IDs use generation/command sequence/ordinal and zero entropy or clock', () => {
  const random = vi.spyOn(Math, 'random').mockImplementation(() => { throw Error('Unexpected entropy'); });
  const clock = vi.spyOn(Date, 'now').mockImplementation(() => { throw Error('Unexpected clock'); });
  try { expect(events().map(e => e.id)).toEqual(['1:2:0', '1:2:1']); expect(events()).toEqual(events()); }
  finally { random.mockRestore(); clock.mockRestore(); }
});
it('[T05-Q02] feed retains synchronous batches until acknowledgement and discards the old round', () => {
  const feed = createPresentationFeed();
  feed.append('r1','MAIN',[{type:'MOVE_WAGER',seat:4,amount:200,kind:'MAIN'}]);
  feed.append('r1','CLOSE',[{type:'DEALER_STATE',state:'DEALING'}]);
  expect(feed.getSnapshot().batches.map(b=>b.command)).toEqual(['MAIN','CLOSE']);
  feed.acknowledge(2); expect(feed.getSnapshot().batches.map(b=>b.command)).toEqual(['CLOSE']);
  feed.append('r2','CLOSE',[{type:'DEALER_STATE',state:'DEALING'}]);
  expect(feed.getSnapshot().generation).toBe(2); expect(feed.getSnapshot().batches).toHaveLength(1);
});
it('[T05-Q03] completion plays one ordered event at a time and never repeats acknowledged IDs', async () => {
  const run=controlled(), batch=events(); run.timeline.enqueue(batch); run.timeline.enqueue(batch);
  expect(run.played).toEqual(['1:2:0']); expect(run.timeline.getSnapshot().pending).toBe(1);
  run.completions[0](); await Promise.resolve(); expect(run.played).toEqual(['1:2:0','1:2:1']);
  run.completions[1](); await Promise.resolve(); run.timeline.enqueue(batch);
  expect(run.settled).toEqual(['1:2:0','1:2:1']); expect(run.timeline.getSnapshot().activeId).toBeNull();
});
for(const mode of ['IMMEDIATE','REDUCED_MOTION'] as PresentationMode[])it(`[T05-Q04-${mode}] ordered facts settle directly without creating visual controls`,()=>{
  const run=controlled();run.timeline.setMode(mode);run.timeline.enqueue(events());
  expect(run.played).toEqual([]);expect(run.timeline.getSnapshot()).toMatchObject({activeId:null,pending:0,dealerState:'WAITING_PLAYER'});
});
it('[T05-Q05] skip cancels/settles current tween, drops stale work and does not replay after late completion',async()=>{
  const run=controlled();run.timeline.enqueue(events());run.timeline.skip();
  expect(run.cancelled).toEqual(['1:2:0']);expect(run.settled).toEqual(['1:2:0']);
  expect(run.timeline.getSnapshot()).toMatchObject({activeId:null,pending:0});
  run.completions[0]();await Promise.resolve();run.timeline.enqueue(events());expect(run.played).toEqual(['1:2:0']);
});
it('[T05-Q06] generation invalidates active/pending events and rejects old batches',async()=>{
  const run=controlled();run.timeline.enqueue(events());run.timeline.begin(2);run.timeline.enqueue(events());
  run.completions[0]();await Promise.resolve();expect(run.played).toEqual(['1:2:0']);
  expect(run.timeline.getSnapshot()).toMatchObject({generation:2,activeId:null,pending:0,dealerState:null});
});
it('[T05-Q07] reduced-motion toggle settles an active tween immediately',()=>{
  const run=controlled();run.timeline.enqueue(events());run.timeline.setMode('REDUCED_MOTION');
  expect(run.cancelled).toHaveLength(1);expect(run.settled).toHaveLength(1);expect(run.timeline.getSnapshot().pending).toBe(0);
});
it('[T05-Q08] player rejection and thrown visual cleanup are contained and diagnosed',async()=>{
  const rejected=createPresentationTimeline(()=>({finished:Promise.reject(Error('visual')),cancel(){throw Error('cancel');},settle(){throw Error('settle');}}));
  rejected.begin(1);rejected.setMode('FULL_MOTION');rejected.enqueue(events());await Promise.resolve();
  expect(rejected.getSnapshot()).toMatchObject({activeId:null,pending:0,fault:'Presentation settlement failed'});
  const failed=createPresentationTimeline(()=>{throw Error('player');});failed.begin(1);failed.setMode('FULL_MOTION');failed.enqueue(events());
  expect(failed.getSnapshot().fault).toBe('Presentation player failed');
});
it('[T05-Q09] cancellation/disposal releases visual controls and listeners',()=>{
  const run=controlled(),listener=vi.fn();run.timeline.subscribe(listener);run.timeline.enqueue(events());run.timeline.dispose();
  const count=listener.mock.calls.length;run.timeline.enqueue(events());expect(listener).toHaveBeenCalledTimes(count);
  expect(run.cancelled).toHaveLength(1);expect(run.timeline.getSnapshot().activeId).toBeNull();
});
it('[T05-Q10] headless backlog is bounded and presentation subscriber failure has explicit diagnostic',()=>{
  const feed=createPresentationFeed();feed.subscribe(()=>{throw Error('visual');});
  feed.append('r1','CLOSE',[{type:'DEALER_STATE',state:'IDLE'}]);expect(feed.getSnapshot().fault).toContain('subscriber failed');
  for(let i=0;i<513;i++)feed.append('r1','MAIN',[{type:'MOVE_WAGER',seat:4,amount:20,kind:'MAIN'}]);
  expect(feed.getSnapshot().batches.length).toBeLessThanOrEqual(512);expect(feed.getSnapshot().generation).toBeGreaterThan(1);
});
it('[T05-A01] demand-driven anchors clean up without removing replacements or measuring in a loop',()=>{
  const registry=createAnchorRegistry(),measure=vi.fn(()=>({x:20,y:30}));
  const first={isConnected:true,getClientRects:()=>[{}],getBoundingClientRect:measure} as unknown as HTMLElement;
  const second={...first} as HTMLElement;
  const cleanup=registry.register('deal-origin',first);expect(measure).not.toHaveBeenCalled();
  registry.register('deal-origin',second);cleanup();expect(registry.get('deal-origin')).toBe(second);
  expect(registry.measure('deal-origin')).toEqual({x:20,y:30});expect(measure).toHaveBeenCalledTimes(1);
  registry.clear();expect(registry.measure('deal-origin')).toBeNull();
  registry.register('dealer-hand',{isConnected:false} as HTMLElement);expect(registry.measure('dealer-hand')).toBeNull();
});
it('[T05-Q11] queue accepts facts only and cannot mutate the frozen input events',()=>{
  const batch=events(),before=JSON.stringify(batch),run=controlled();run.timeline.enqueue(batch);run.timeline.cancel();
  expect(JSON.stringify(batch)).toBe(before);expect(Object.isFrozen(batch[0])).toBe(true);
  expect(Object.keys(run.timeline)).not.toContain('dispatch');
  expect(batch.every((event:PresentationEvent)=>!('random' in event))).toBe(true);
});
