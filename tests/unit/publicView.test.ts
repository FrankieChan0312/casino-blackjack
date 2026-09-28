import { expect, test } from 'vitest';
import { startRound, type GameState } from '../../src/domain/game.js';
import { getPublicView } from '../../src/domain/publicView.js';
import type { Rank } from '../../src/domain/card.js';
import { orderedShoe } from '../helpers/shoeFixture.js';

function dealt(ranks: readonly Rank[]): GameState {
  const result = startRound({ shoe: orderedShoe(ranks), round: null }, 'round-1', 'unused', {
    nextInt: () => { throw new Error('Unexpected shuffle'); },
  });
  if (!result.ok) throw new Error(result.error);
  return result.state;
}

test('no-round view exposes no shoe inventory or cut information', () => {
  expect(getPublicView({ shoe: orderedShoe([]), round: null })).toEqual({ round: null });
});

test.each(['A', '10', 'J', 'Q', 'K', '9'] as const)('non-terminal upcard %s hides hole data, including after negative peek', (upcard) => {
  const state = dealt(['10', upcard, '8', '6']);
  const view = getPublicView(state);
  expect(JSON.parse(JSON.stringify(view))).toEqual({ round: {
    roundId: 'round-1', phase: 'PLAYER_TURN',
    playerCards: [{ rank: '10', suit: 'clubs' }, { rank: '8', suit: 'hearts' }],
    dealer: { upcard: { rank: upcard, suit: 'diamonds' }, holeCard: null,
      visibleCards: [{ rank: upcard, suit: 'diamonds' }] },
  } });
  const serialized = JSON.stringify(view);
  expect(serialized).not.toContain('spades');
  expect(serialized).not.toContain('"6"');
  expect(serialized).not.toContain('1:spades:6');
  expect(serialized).not.toContain('total');
  expect(serialized).not.toContain('available');
  // Vary hidden rank/suit/ID while public facts remain identical.
  if (!state.round) throw new Error('Expected round');
  const differentHole = { ...state.round.dealerCards[1], id: 'secret-other', rank: '5' as const, suit: 'clubs' as const };
  expect(getPublicView({ ...state, round: { ...state.round,
    dealerCards: [state.round.dealerCards[0], differentHole],
  } })).toEqual(view);
});

test.each([
  [['A', '7', 'K', '7'], 'PLAYER_BLACKJACK'],
  [['10', 'A', '9', 'K'], 'DEALER_WIN'],
  [['A', 'A', 'K', 'Q'], 'PUSH'],
] as const)('terminal natural %j reveals both dealer cards and %s', (ranks, outcome) => {
  const view = getPublicView(dealt(ranks));
  expect(view.round?.phase).toBe('ROUND_COMPLETE');
  expect(view.round?.outcome).toBe(outcome);
  expect(view.round?.dealer).toEqual({
    upcard: { rank: ranks[1], suit: 'diamonds' },
    holeCard: { rank: ranks[3], suit: 'spades' },
    visibleCards: [{ rank: ranks[1], suit: 'diamonds' }, { rank: ranks[3], suit: 'spades' }],
  });
});

test('integrity view does not reveal a stored hole or fail when no upcard exists', () => {
  const state = dealt(['10', 'A', '8', '6']);
  if (!state.round) throw new Error('Expected round');
  const fault: GameState = { shoe: { ...state.shoe, retired: true }, round: {
    roundId: 'fault', phase: 'INTEGRITY_ERROR', playerCards: state.round.playerCards,
    dealerCards: state.round.dealerCards, integrityError: 'SHOE_EXHAUSTED_DURING_ROUND',
  } };
  const view = getPublicView(fault);
  expect(view.round?.dealer.holeCard).toBeNull();
  expect(view.round?.dealer.visibleCards).toEqual([{ rank: 'A', suit: 'diamonds' }]);
  expect(view.round?.outcome).toBeUndefined();
  expect(JSON.stringify(view)).not.toContain('spades');
  expect(JSON.stringify(view)).not.toContain('1:spades:6');
  expect(getPublicView({ ...fault, round: { ...fault.round!, playerCards: [], dealerCards: [] } }).round?.dealer)
    .toEqual({ upcard: null, holeCard: null, visibleCards: [] });
});

test('projection is deterministic, pure and returns detached public cards', () => {
  const state = dealt(['A', '7', 'K', '7']);
  if (!state.round) throw new Error('Expected round');
  const snapshot = structuredClone(state);
  Object.freeze(state.round.playerCards);
  Object.freeze(state.round.dealerCards);
  Object.freeze(state.round);
  Object.freeze(state.shoe.available);
  Object.freeze(state.shoe.inPlay);
  Object.freeze(state.shoe.discarded);
  Object.freeze(state.shoe);
  Object.freeze(state);
  const first = getPublicView(state);
  expect(getPublicView(state)).toEqual(first);
  expect(state).toEqual(snapshot);
  expect(first.round?.playerCards[0]).not.toBe(state.round.playerCards[0]);
  expect(first.round?.dealer.holeCard).not.toBe(state.round.dealerCards[1]);
  expect(first.round?.dealer.visibleCards[0]).not.toBe(state.round.dealerCards[0]);
  expect(Object.keys(first)).toEqual(['round']);
  expect(Object.keys(first.round!.playerCards[0])).toEqual(['rank', 'suit']);
});
