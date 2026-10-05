import { expect, it } from 'vitest';
import { createInitialDealProjection, initialCards } from '../../src/presentation/initialDeal.js';
import { createPresentationFeed } from '../../src/presentation/events.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { createPresentationRuntime, consumePresentation } from '../../src/ui/PresentationProvider.js';
import { fixtureRandom, fixtureState } from '../browser/fixtures.js';

function initialFeed() {
  const feed = createPresentationFeed();
  feed.append('round-1', 'CLOSE', [
    { type: 'DEAL_CARD', card: { roundId: 'round-1', owner: 4, handId: 'round-1/seat-4', index: 0 }, face: { rank: '5', suit: 'clubs' }, reason: 'INITIAL', destination: 'hand:round-1/seat-4' },
    { type: 'DEAL_CARD', card: { roundId: 'round-1', owner: 'dealer', handId: 'dealer', index: 1 }, face: null, reason: 'INITIAL', destination: 'dealer-hand' },
  ]);
  return feed;
}
it('[T06-P01] hidden initial event is anonymous even when authority already permits the face', () => {
  const controller = createBrowserController({ playerMode: true, factory: () => fixtureState(['10','10','5','10','10','7','7','6','7','A']), random: fixtureRandom });
  controller.dispatch({ type: 'DEAL', amount: 200 });
  const events = initialCards(controller.presentation.getSnapshot().batches.flatMap(batch => batch.events));
  const hole = events.at(-1)!;
  expect(controller.getSnapshot().round?.dealer.holeCard).not.toBeNull();
  expect(hole.card).toEqual({ roundId: 'round-1', owner: 'dealer', handId: 'dealer', index: 1 });
  expect(hole.face).toBeNull();
  expect(Object.keys(hole).sort()).toEqual(['card','destination','face','generation','id','ordinal','reason','sequence','type']);
  expect(JSON.stringify(hole)).not.toMatch(/rank|suit|physical|deck|shoe/);
});
it('[T06-L01] projection reveals exactly each completed initial event and ignores stale completion', () => {
  const feed = initialFeed(), snapshot = feed.getSnapshot(), events = snapshot.batches.flatMap(batch => batch.events);
  const projection = createInitialDealProjection();
  projection.prepare(snapshot.generation, events);
  expect(projection.getSnapshot().pending).toEqual(['round-1/seat-4:0','dealer:1']);
  projection.arrive(initialCards(events)[0]); projection.arrive(initialCards(events)[0]);
  expect(projection.getSnapshot()).toEqual({ generation: snapshot.generation, pending: ['dealer:1'], delivered: 1 });
  projection.prepare(snapshot.generation + 1, []); projection.arrive(initialCards(events)[1]);
  expect(projection.getSnapshot()).toEqual({ generation: snapshot.generation + 1, pending: [], delivered: 0 });
});
it('[T06-L02] reduced/immediate skip every flight; a MAIN batch cannot prematurely clear the initial mask', () => {
  for (const mode of ['IMMEDIATE','REDUCED_MOTION'] as const) {
    const feed = initialFeed(), runtime = createPresentationRuntime();
    runtime.timeline.setMode(mode); consumePresentation(feed, runtime, mode);
    expect(runtime.initialDeal.getSnapshot().pending).toEqual([]);
    expect(runtime.timeline.getSnapshot()).toMatchObject({ activeId: null, pending: 0 });
    expect(feed.getSnapshot().batches).toEqual([]);
  }
});
it('[T06-E01] CLOSE captures literal initial cards before atomic AI Hits, independently of final hand length', () => {
  const controller = createBrowserController({ playerMode: true, factory: () => fixtureState(['5','6','10','10','6','5','5','6','7','6','7','2','10','10']), random: fixtureRandom });
  controller.dispatch({ type: 'DEAL', amount: 200 });
  const batches = controller.presentation.getSnapshot().batches;
  expect(initialCards(batches.flatMap(batch => batch.events)).map(event => [event.card.owner, event.card.index, event.face?.rank ?? 'hidden'])).toEqual([
    [1,0,'5'],[3,0,'6'],[4,0,'10'],[6,0,'10'],['dealer',0,'6'],[1,1,'5'],[3,1,'5'],[4,1,'6'],[6,1,'7'],['dealer',1,'hidden'],
  ]);
  expect(batches.find(batch => batch.command === 'ADVANCE')?.events.filter(event => event.type === 'DEAL_CARD').map(event => event.card.index)).toEqual([2,2,3]);
  expect(controller.getSnapshot().round?.seats.find(seat => seat.seatNumber === 3)?.hands[0].cards).toHaveLength(4);
});
it('[T06-L03] consuming an empty feed keeps snapshot identity stable for React external-store renders', () => {
  const feed = createPresentationFeed(), runtime = createPresentationRuntime(), before = feed.getSnapshot();
  consumePresentation(feed, runtime, 'FULL_MOTION'); consumePresentation(feed, runtime, 'FULL_MOTION');
  expect(feed.getSnapshot()).toBe(before);
});
it('[T06-E02] actual unfunded/sitting-out guest never receives a phantom initial event', () => {
  const state = fixtureState(['10','8','10','9','7','8','7','8']);
  const controller = createBrowserController({ playerMode: true, factory: () => ({ ...state,
    computers: state.computers.map((computer, index) => index === 0 ? { ...computer, bankroll: { available: 0, reserved: 0 } } : computer) }), random: fixtureRandom });
  controller.dispatch({ type: 'DEAL', amount: 200 });
  expect(controller.getSnapshot().configuration.find(seat => seat.seatNumber === 1)?.sittingOut).toBe(true);
  expect(initialCards(controller.presentation.getSnapshot().batches.flatMap(batch => batch.events)).map(event => event.card.owner)).toEqual([3,4,6,'dealer',3,4,6,'dealer']);
});
