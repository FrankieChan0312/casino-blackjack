import { expect, it } from 'vitest';
import { createBrowserController, type BrowserController } from '../../src/browser/controller.js';
import { observePresentation } from '../../src/browser/presentationObserver.js';
import { applySessionCommand, type SessionResult } from '../../src/domain/sessionCommand.js';
import { createPlayerActionProjection, playerCardKeys } from '../../src/presentation/playerActions.js';
import { createPresentationFeed, type PresentationEvent } from '../../src/presentation/events.js';
import { createPresentationTimeline } from '../../src/presentation/timeline.js';
import { createFixtureController, fixtureRandom, fixtureState, requireAccepted } from '../browser/fixtures.js';

function collect(controller: BrowserController) {
  const events: PresentationEvent[] = [];
  controller.presentation.acknowledge(controller.presentation.getSnapshot().revision);
  controller.presentation.subscribe(() => {
    const snapshot = controller.presentation.getSnapshot();
    events.push(...snapshot.batches.flatMap(batch => batch.events)); controller.presentation.acknowledge(snapshot.revision);
  });
  return events;
}
function act(controller: BrowserController, action: 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT') {
  expect(controller.dispatch({ type: 'ACT', action, handId: controller.getSnapshot().interaction.handId })).toBe(true);
}
it('[T07-E01] exact normal/split Hit target; Stand draws no card for that hand; Double draws exactly one', () => {
  for (const action of ['HIT','STAND','DOUBLE'] as const) {
    const controller = createFixtureController('player-loss'); controller.dispatch({ type: 'DEAL', amount: 200 });
    const events = collect(controller); act(controller, action);
    const cards = events.filter(event => event.type === 'DEAL_CARD' && event.card.owner === 4);
    expect(cards).toHaveLength(action === 'STAND' ? 0 : 1);
    if (action !== 'STAND') expect(cards[0]).toMatchObject({ reason: action, card: { owner: 4, handId: 'round-1/seat-4', index: 2 } });
    expect(new Set(events.map(event => event.id)).size).toBe(events.length);
  }
  const controller = createFixtureController('player-split'); controller.dispatch({ type: 'DEAL', amount: 200 }); act(controller, 'SPLIT');
  const events = collect(controller); act(controller, 'HIT');
  expect(events.find(event => event.type === 'DEAL_CARD')).toMatchObject({ reason: 'HIT', destination: 'hand:round-1/seat-4.1', card: { handId: 'round-1/seat-4.1', index: 2 } });
});
it('[T07-E02] literal retained ownership and depth-first four-leaf layout, no future sibling supplement', () => {
  const controller = createBrowserController({ playerMode: true, factory: () => fixtureState(['10','10','8','10','9','7','7','8','7','8','8','8','2','3','4','5']), random: fixtureRandom });
  controller.dispatch({ type: 'DEAL', amount: 200 }); const events = collect(controller);
  for (let index = 0; index < 3; index++) act(controller, 'SPLIT');
  const splits = events.filter(event => event.type === 'SPLIT_HANDS');
  expect(splits.map(event => event.children.map(child => [child.handId, child.retained.handId, child.retained.index, child.destination.index]))).toEqual([
    [['round-1/seat-4.1','round-1/seat-4',0,0],['round-1/seat-4.2','round-1/seat-4',1,0]],
    [['round-1/seat-4.1.1','round-1/seat-4.1',0,0],['round-1/seat-4.1.2','round-1/seat-4.1',1,0]],
    [['round-1/seat-4.1.1.1','round-1/seat-4.1.1',0,0],['round-1/seat-4.1.1.2','round-1/seat-4.1.1',1,0]],
  ]);
  expect(controller.getSnapshot().round?.seats.find(seat => seat.seatNumber === 4)?.hands.map(hand => [hand.handId, hand.cards.map(card => card.rank)])).toEqual([
    ['round-1/seat-4.1.1.1',['8','2']],['round-1/seat-4.1.1.2',['8']],['round-1/seat-4.1.2',['8']],['round-1/seat-4.2',['8']],
  ]);
  expect(events.filter(event => event.type === 'DEAL_CARD').map(event => [event.card.handId,event.face?.rank,event.reason])).toEqual([
    ['round-1/seat-4.1','8','SUPPLEMENT'],['round-1/seat-4.1.1','8','SUPPLEMENT'],['round-1/seat-4.1.1.1','2','SUPPLEMENT'],
  ]);
});
it('[T07-E03] atomic AI sibling supplement precedes its actual Hit; follower Double uses its receipt', () => {
  let before = fixtureState(['8','9','8','8','2','7','3','9']);
  for (const command of [{ type: 'CONFIGURE', seats: [{ seatNumber: 1, occupancy: 'COMPUTER', sittingOut: false }] },
    { type: 'OPEN' }, { type: 'MAIN', seat: 1, amount: 200 }, { type: 'CLOSE' },
    { type: 'CONTROLLER', action: 'SPLIT', ownerId: 'computer-1', handId: 'round-1/seat-1' }] as const) before = requireAccepted(applySessionCommand(before, command, fixtureRandom));
  const result: SessionResult = applySessionCommand(before, { type: 'ADVANCE' }, fixtureRandom);
  const facts = observePresentation(before, result, { type: 'ADVANCE' });
  expect(facts.filter(event => event.type === 'PLAYER_ACTION' || event.type === 'DEAL_CARD' && event.card.owner === 1).map(event =>
    event.type === 'PLAYER_ACTION' ? [event.handId,event.action] : event.type === 'DEAL_CARD' ? [event.card.handId,event.reason,event.face?.rank] : [])).toEqual([
    ['round-1/seat-1.1','HIT'],['round-1/seat-1.1','HIT','7'],['round-1/seat-1.1','STAND'],
    ['round-1/seat-1.2','SUPPLEMENT','3'],['round-1/seat-1.2','HIT'],['round-1/seat-1.2','HIT','9'],['round-1/seat-1.2','STAND'],
  ]);
  const controller = createFixtureController('follow-double'), events = collect(controller);
  expect(controller.dispatch({ type: 'FOLLOW', choice: 'NO_ADD' })).toBe(true);
  expect(events.find(event => event.type === 'DEAL_CARD')).toMatchObject({ reason: 'DOUBLE', card: { handId: 'round-1/seat-1', index: 2 } });
});
it('[T07-L01] settlement projection is idempotent, skips safely and ignores stale generations', () => {
  const feed = createPresentationFeed();
  feed.append('r1','ACT',[{ type: 'DEAL_CARD', reason: 'HIT', card: { roundId: 'r1', owner: 4, handId: 'h.2', index: 2 }, face: { rank: '5', suit: 'clubs' }, destination: 'hand:h.2' }]);
  const snapshot = feed.getSnapshot(), events = snapshot.batches[0].events, projection = createPlayerActionProjection();
  expect(playerCardKeys(events)).toEqual(['h.2:2']);
  projection.prepare(snapshot.generation, events); projection.prepare(snapshot.generation, events);
  expect(projection.getSnapshot().pending).toEqual(['h.2:2']);
  projection.arrive(events[0]); projection.arrive(events[0]); expect(projection.getSnapshot().pending).toEqual([]);
  projection.prepare(snapshot.generation + 1, events); projection.arrive(events[0]); expect(projection.getSnapshot().pending).toEqual(['h.2:2']);
  projection.clear(); expect(projection.getSnapshot().pending).toEqual([]);
});
it('[T07-P01] FULL/REDUCED/IMMEDIATE/skip presentation preserves seeded replay, audit and literal money', () => {
  const receipts = [];
  for (const mode of ['FULL_MOTION','REDUCED_MOTION','IMMEDIATE'] as const) {
    const controller = createBrowserController({ playerMode: true, seed: 7, clock: () => '2026-01-01T00:00:00.000Z' });
    const timeline = createPresentationTimeline(); timeline.setMode(mode);
    controller.presentation.subscribe(() => { const snapshot = controller.presentation.getSnapshot(); timeline.begin(snapshot.generation);
      timeline.enqueue(snapshot.batches.flatMap(batch => batch.events)); timeline.skip(); controller.presentation.acknowledge(snapshot.revision); });
    controller.dispatch({ type: 'DEAL', amount: 200 });
    while (!controller.getSnapshot().interaction.nextRound) {
      if (controller.getSnapshot().interaction.insurance) controller.dispatch({ type: 'ACE', choice: 'DECLINE' }); else act(controller, 'STAND');
    }
    expect(controller.replayCompleted()).toBe(true); receipts.push([controller.getSnapshot(), controller.exportReplay()]); timeline.dispose();
  }
  expect(receipts[1]).toEqual(receipts[0]); expect(receipts[2]).toEqual(receipts[0]);
});
