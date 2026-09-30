import { expect, it } from 'vitest';
import * as a from '../../src/domain/advancedGame.js';
import * as g from '../../src/domain/behindGame.js';
import { CLASSIC, CHARLIE, type ProfileId } from '../../src/domain/profile.js';
import type { Rank } from '../../src/domain/card.js';
import { advancedFixture, accepted, currentId } from '../helpers/advancedFixture.js';
import { behindFixture, accepted as backAccepted } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';
import { resultLabel } from '../../src/ui/presentation.js';

export function charlieTable(ranks: readonly Rank[], profileId: ProfileId = CHARLIE, seats = [seat(1, 'HUMAN')]) {
  let s = accepted(a.openAdvancedBetting({ ...advancedFixture(ranks, seats), profileId }));
  for (const entry of seats) s = accepted(a.setAdvancedWager(s, entry.seatNumber, 200));
  return accepted(a.closeAdvancedBetting(s, 'unused', noRandom));
}
const hit = (s: a.AdvancedGameState) => accepted(a.hitAdvancedHand(s, 1, currentId(s)));
const hits = (s: a.AdvancedGameState, n: number) => { for (let i = 0; i < n; i++) s = hit(s); return s; };
const first = (s: a.AdvancedGameState) => s.game.round!.players[0];
it('Classic five-card 20 is ordinary and remains playable', () => {
  const s = hits(charlieTable(['2','9','2','8','4','5','7'], CLASSIC), 3);
  expect(first(s).complete).toBe(false);
  expect(first(s).outcome).toBeUndefined();
  expect(first(s).cards).toHaveLength(5);
  expect(resultLabel(first(s).outcome)).not.toContain('Charlie');
});
it('Charlie five-card 20 is fixed, terminal and pays actual stake 1:1 exactly once', () => {
  const s = hits(charlieTable(['2','9','2','8','4','5','7']), 3);
  expect(first(s)).toMatchObject({ complete: true, outcome: 'CHARLIE', outcomeReason: 'FIVE_CARD_CHARLIE' });
  expect(a.hitAdvancedHand(s, 1, first(s).handId).ok).toBe(false);
  expect(a.getAdvancedResults(s)[0]).toMatchObject({ stakeUnits: 200, grossReturnUnits: 400, netUnits: 200 });
  const done = accepted(a.settleAdvancedWagers(accepted(a.resolveAdvancedDealer(s))));
  expect(done.bankrolls[0]).toEqual({ available: 2200, reserved: 0 });
  expect(a.settleAdvancedWagers(done)).toMatchObject({ ok: false, state: done });
});
it('fifth-card 21 is only Charlie, never Natural or stacked award', () => {
  const s = hits(charlieTable(['2','9','2','8','4','5','8']), 3);
  expect(first(s).outcome).toBe('CHARLIE');
  expect(a.getAdvancedResults(s)).toHaveLength(1);
  expect(a.getAdvancedResults(s)[0].grossReturnUnits).toBe(400);
  expect(resultLabel(first(s).outcome)).toBe('Charlie Win');
});
it('fifth-card 22 bust precedes Charlie', () => {
  const s = hits(charlieTable(['2','9','2','8','4','5','9']), 3);
  expect(first(s)).toMatchObject({ outcome: 'DEALER_WIN', outcomeReason: 'PLAYER_BUST', complete: true });
  expect(a.getAdvancedResults(s)[0].grossReturnUnits).toBe(0);
});
it('exactly four cards below 21 are active without Charlie', () => {
  const s = hits(charlieTable(['2','9','2','8','4','5']), 2);
  expect(first(s).complete).toBe(false);
  expect(first(s).outcome).toBeUndefined();
  expect(first(s).cards).toHaveLength(4);
});
it('three-card 21 stops before any Charlie chase', () => {
  const s = hit(charlieTable(['5','9','6','8','10']));
  expect(first(s).complete).toBe(true);
  expect(first(s).outcome).toBeUndefined();
  expect(a.hitAdvancedHand(s, 1, first(s).handId).ok).toBe(false);
});
it('four-card 21 stops before any Charlie chase', () => {
  const s = hits(charlieTable(['5','9','6','8','5','5']), 2);
  expect(first(s).complete).toBe(true);
  expect(first(s).cards).toHaveLength(4);
  expect(a.hitAdvancedHand(s, 1, first(s).handId).ok).toBe(false);
});
it('Dealer Natural resolves before player Hit in Charlie profile', () => {
  const s = charlieTable(['2','K','2','A','2','2','2']);
  expect(first(s).outcomeReason).toBe('DEALER_NATURAL');
  expect(a.hitAdvancedHand(s, 1, first(s).handId).ok).toBe(false);
});
it('fixed Charlie requires no dealer draws or total comparison', () => {
  const s = hits(charlieTable(['2','2','2','3','4','5','7']), 3);
  const done = accepted(a.resolveAdvancedDealer(s));
  expect(done.game.round!.dealerCards).toHaveLength(2);
  expect(first(done).outcome).toBe('CHARLIE');
});
it('non-Ace split child Charlie and sibling independent in depth-first order', () => {
  let s = accepted(a.splitAdvancedHand(charlieTable(['2','9','2','8','2','3','4','5','10']), 1, 'round-1/seat-1'));
  s = hits(s, 3);
  expect(first(s)).toMatchObject({ handId: 'round-1/seat-1.1', outcome: 'CHARLIE', stakeUnits: 200 });
  expect(s.game.round!.players[1].cards.map(c => c.rank)).toEqual(['2','10']);
  s = accepted(a.standAdvancedHand(s, 1, currentId(s)));
  s = accepted(a.resolveAdvancedDealer(s));
  expect(s.game.round!.players.map(h => h.outcome)).toEqual(['CHARLIE','DEALER_WIN']);
  expect(a.getAdvancedResults(s).map(r => r.grossReturnUnits)).toEqual([400,0]);
  expect(a.getAdvancedResults(s).every(r => r.handId !== 'round-1/seat-1')).toBe(true);
});
it('Split Aces restrictions prevent Charlie chase', () => {
  const s = accepted(a.splitAdvancedHand(charlieTable(['A','9','A','8','2','2']), 1, 'round-1/seat-1'));
  expect(s.game.round!.players.every(h => h.cards.length === 2 && h.complete && !h.outcome)).toBe(true);
  expect(a.hitAdvancedHand(s, 1, 'round-1/seat-1.1').ok).toBe(false);
});
it('Double draws one card then ends, never Charlie chase', () => {
  const s = accepted(a.doubleAdvancedHand(charlieTable(['2','9','2','8','2']), 1, 'round-1/seat-1'));
  expect(first(s)).toMatchObject({ complete: true, stakeUnits: 400 });
  expect(first(s).outcome).toBeUndefined();
  expect(first(s).cards).toHaveLength(3);
  expect(a.hitAdvancedHand(s, 1, first(s).handId).ok).toBe(false);
});
it('Bet Behind Charlie uses follower actual stake and side results remain independent', () => {
  let s = behindFixture(['2','9','2','8','3','3','6'], [seat(1)]);
  s = { ...s, table: { ...s.table, profileId: CHARLIE } };
  s = backAccepted(g.openBehindBetting(s));
  s = backAccepted(g.setBehindMainWager(s, 1, 200));
  s = backAccepted(g.setBackWager(s, 1, 50));
  s = backAccepted(g.closeBehindBetting(s, 'unused', noRandom));
  s = backAccepted(g.advanceBehindTable(s));
  expect(g.getBackResults(s)[0]).toMatchObject({ outcome: 'CHARLIE', stakeUnits: 50, grossReturnUnits: 100, netUnits: 50 });
  s = backAccepted(g.settleBehindWagers(s));
  expect(s.human!.bankroll).toEqual({ available: 2050, reserved: 0 });
});
it('Pair and Three-card records remain identical after Charlie Hits', () => {
  let s = behindFixture(['2','9','2','8','3','3','6']);
  s = { ...s, table: { ...s.table, profileId: CHARLIE } };
  s = backAccepted(g.openBehindBetting(s));
  s = backAccepted(g.setBehindMainWager(s, 1, 200));
  for (const type of ['PAIR','THREE_CARD'] as const) s = backAccepted(g.setBehindSideWager(s, 1, type, 20));
  s = backAccepted(g.closeBehindBetting(s, 'unused', noRandom));
  const side = s.table.sideResults;
  for (let i = 0; i < 3; i++) s = backAccepted(g.actBehindHand(s, 'round-1/seat-1', 'HIT'));
  expect(s.table.sideResults).toBe(side);
  expect(side.map(r => [r.type, r.category, r.grossReturnUnits])).toEqual([['PAIR','MIXED_PAIR',140],['THREE_CARD','NONE',0]]);
});
it('whole-round draw fault clears fixed Charlie and VOID refunds every actual stake once', () => {
  let s = charlieTable(['2','2','9','2','2','3','3','3','6'], CHARLIE, [seat(1,'HUMAN'), seat(2)]);
  s = hits(s, 3);
  expect(first(s).outcome).toBe('CHARLIE');
  const shoe = s.game.shoe;
  s = { ...s, game: { ...s.game, shoe: { ...shoe, available: [], discarded: [...shoe.discarded, ...shoe.available] } } };
  s = accepted(a.advanceAdvancedTable(s));
  expect(s.game.round!.phase).toBe('INTEGRITY_ERROR');
  expect(first(s).outcome).toBeUndefined();
  s = accepted(a.voidAdvancedRound(s));
  expect(s.results.map(r => [r.outcome, r.grossReturnUnits, r.netUnits])).toEqual([['VOID',200,0],['VOID',200,0]]);
  expect(a.voidAdvancedRound(s).ok).toBe(false);
});
