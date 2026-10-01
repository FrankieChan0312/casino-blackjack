import { expect, it } from 'vitest';
import * as game from '../../src/domain/advancedGame.js';
import { CLASSIC, CLASSIC_V1_2, CHARLIE_V1_2, type ProfileId } from '../../src/domain/profile.js';
import { evaluateHand } from '../../src/domain/hand.js';
import type { Rank } from '../../src/domain/card.js';
import { advancedTable, accepted, currentId, withAvailable, freezeDeep } from '../helpers/advancedFixture.js';

const root = 'round-1/seat-1';
function table(supplements: readonly Rank[], profileId: ProfileId = CLASSIC_V1_2) {
  // Explicit ordered cards: player A,A; dealer 9,8 = hard 17 (S17).
  return { ...advancedTable(['A','9','A','8', ...supplements]), profileId };
}
function split(state: game.AdvancedGameState) { return accepted(game.splitAdvancedHand(state, 1, currentId(state))); }
function opportunity(supplements: readonly Rank[] = ['A','9','6','9']) { return split(table(supplements)); }
function ranks(state: game.AdvancedGameState) { return state.game.round!.players.map(hand => hand.cards.map(card => card.rank)); }
function rejectUnchanged(state: game.AdvancedGameState, action: game.PlayerAction, error: string, handId = currentId(state)) {
  const before = JSON.stringify(state); freezeDeep(state);
  const commands = { HIT: game.hitAdvancedHand, STAND: game.standAdvancedHand, DOUBLE: game.doubleAdvancedHand,
    SPLIT: game.splitAdvancedHand, SURRENDER: game.surrenderAdvancedHand };
  expect(commands[action](state, 1, handId)).toEqual({ ok: false, state, error });
  expect(commands[action](state, 1, handId).state).toBe(state);
  expect(JSON.stringify(state)).toBe(before);
}

it('[RSA-001] historical V1.1 A+A Split-Ace child completes and cannot re-split', () => {
  const state = split(table(['A','9'], CLASSIC));
  expect(ranks(state)).toEqual([['A','A'],['A','9']]);
  expect(state.game.round!.players.every(hand => hand.complete)).toBe(true);
  rejectUnchanged(state, 'SPLIT', 'WRONG_PHASE', `${root}.1`);
});
it('[RSA-002] V1.2 original A,A may Split with a matching funded stake', () => {
  const before = table(['9','6']); const state = split(before);
  expect(state.bankrolls[0]).toEqual({ available: 1600, reserved: 400 });
  expect(state.game.round!.players).toHaveLength(2);
});
it('[RSA-003] each original Split-Ace child gets exactly one ordered supplement', () => {
  const before = table(['9','6']); const originals = before.game.round!.players[0].cards;
  const supplements = before.game.shoe.available.slice(0,2); const state = split(before);
  expect(state.game.round!.players.map(hand => hand.cards)).toEqual([[originals[0],supplements[0]],[originals[1],supplements[1]]]);
  expect(state.game.shoe.inPlay).toHaveLength(6);
});
it('[RSA-004] A+9 is complete Soft 20', () => {
  const hand = split(table(['9','6'])).game.round!.players[0];
  expect(evaluateHand(hand.cards)).toEqual({ total: 20, isSoft: true, isBust: false, isTwentyOne: false });
  expect(hand.complete).toBe(true);
});
it('[RSA-005] A+6 is complete Soft 17', () => {
  const hand = split(table(['6','9'])).game.round!.players[0];
  expect(evaluateHand(hand.cards)).toEqual({ total: 17, isSoft: true, isBust: false, isTwentyOne: false });
  expect(hand.complete).toBe(true);
});
it('[RSA-006] A+K after Split is complete ordinary 21 without a Natural result', () => {
  const hand = split(table(['K','9'])).game.round!.players[0];
  expect(evaluateHand(hand.cards).total).toBe(21); expect(hand.complete).toBe(true);
  expect(game.isAdvancedNatural(hand)).toBe(false); expect(hand.outcome).toBeUndefined();
});
it('[RSA-007] a funded V1.2 Split-Ace A+A exposes only SPLIT/STAND', () => {
  const state = opportunity();
  expect(ranks(state)).toEqual([['A','A'],['A']]); expect(currentId(state)).toBe(`${root}.1`);
  expect(state.game.round!.players[0].complete).toBe(false);
  expect((['HIT','STAND','DOUBLE','SPLIT','SURRENDER'] as const).filter(action => !game.getAdvancedActionError(state,1,currentId(state),action)))
    .toEqual(['STAND','SPLIT']);
});
it('[RSA-008] Stand declines RSA and keeps a complete Soft 12 without an extra card', () => {
  const before = opportunity(['A','9']); const state = accepted(game.standAdvancedHand(before,1,currentId(before)));
  expect(ranks(state)).toEqual([['A','A'],['A','9']]);
  expect(evaluateHand(state.game.round!.players[0].cards)).toEqual({ total: 12, isSoft: true, isBust: false, isTwentyOne: false });
  expect(state.game.round!.players[0]).toMatchObject({ complete: true, decisionTaken: true });
  expect(state.bankrolls).toEqual(before.bankrolls); expect(state.game.shoe.inPlay).toHaveLength(6);
});
it('[RSA-009] successful RSA replaces only the affected leaf in depth-first order', () => {
  const state = split(opportunity());
  expect(state.game.round!.players.map(hand => [hand.handId,hand.parentHandId])).toEqual([
    [`${root}.1.1`,`${root}.1`],[`${root}.1.2`,`${root}.1`],[`${root}.2`,root]]);
  expect(ranks(state)).toEqual([['A','9'],['A','6'],['A','9']]);
});
it('[RSA-010] RSA descendants each retain one original and exactly one supplement', () => {
  const before = opportunity(); const pair = before.game.round!.players[0].cards;
  const supplements = before.game.shoe.available.slice(0,2); const state = split(before);
  expect(state.game.round!.players.slice(0,2).map(hand => hand.cards)).toEqual([[pair[0],supplements[0]],[pair[1],supplements[1]]]);
  expect(state.game.round!.players.every(hand => hand.cards.length === 2 && hand.splitAces)).toBe(true);
});
it('[RSA-011] another Ace allows a second RSA while leaf capacity remains', () => {
  const firstRSA = split(opportunity(['A','A','9','6','9','9']));
  expect(currentId(firstRSA)).toBe(`${root}.1.1`); expect(firstRSA.game.round!.players).toHaveLength(3);
  const secondRSA = split(firstRSA); expect(secondRSA.game.round!.players).toHaveLength(4);
  expect(secondRSA.bankrolls[0]).toEqual({ available: 1200, reserved: 800 });
});
it('[RSA-012] four total leaves force complete A+A and never create a fifth leaf', () => {
  const state = split(split(opportunity(['A','A','A','A','A','A'])));
  expect(state.game.round!.players).toHaveLength(4);
  expect(ranks(state)).toEqual([['A','A'],['A','A'],['A','A'],['A','A']]);
  expect(state.game.round!.phase).toBe('DEALER_TURN');
  rejectUnchanged(state,'SPLIT','WRONG_PHASE',`${root}.1.1.1`);
});
it('[RSA-013] completed leaves still count and a cap rejection is atomic', () => {
  const legal = opportunity();
  // Handler fault seam: add two finished leaves while preserving the current
  // A+A to prove cap validation independently from activation completion.
  const state = { ...legal, game: { ...legal.game, round: { ...legal.game.round!, players: [
    ...legal.game.round!.players, ...[3,4].map(index => ({ ...legal.game.round!.players[0], handId: `${root}.${index}`, complete: true }))] } } };
  rejectUnchanged(state,'SPLIT','HAND_LIMIT_REACHED');
});
it('[RSA-014] exact available matching funds permit RSA', () => {
  const state = split(withAvailable(opportunity(),200));
  expect(state.bankrolls[0]).toEqual({ available: 0, reserved: 600 });
  expect(state.game.round!.players).toHaveLength(3);
});
it('[RSA-015] one half-credit unit short rejects RSA before every mutation', () => {
  rejectUnchanged(withAvailable(opportunity(),199),'SPLIT','INSUFFICIENT_FUNDS');
});
it('[RSA-016] rejected RSA preserves card source, shoe cursor, funds, turn and results', () => {
  const state = withAvailable(opportunity(),199); const shoe = state.game.shoe;
  rejectUnchanged(state,'SPLIT','INSUFFICIENT_FUNDS');
  expect(state.game.shoe).toBe(shoe); expect(state.game.shoe.available[0].rank).toBe('9');
  expect(state.game.shoe.inPlay).toHaveLength(5); expect(currentId(state)).toBe(`${root}.1`);
  expect(state.results).toEqual([]);
});
it('[RSA-017] authoritative Hit rejects an active RSA opportunity', () => {
  rejectUnchanged(opportunity(),'HIT','HIT_NOT_ALLOWED');
});
it('[RSA-018] authoritative Double rejects an active RSA opportunity', () => {
  rejectUnchanged(opportunity(),'DOUBLE','DOUBLE_NOT_ALLOWED');
});
it('[RSA-019] authoritative Surrender rejects an active RSA opportunity', () => {
  rejectUnchanged(opportunity(),'SURRENDER','SURRENDER_NOT_ALLOWED');
});
it('[RSA-020] RSA A+K pays ordinary 1:1 rather than Natural 3:2', () => {
  const state = split(opportunity(['A','K','9','6']));
  const finished = accepted(game.resolveAdvancedDealer(state)); const paid = accepted(game.settleAdvancedWagers(finished));
  expect(paid.results.map(result => [result.handId,result.outcome,result.grossReturnUnits])).toEqual([
    [`${root}.1.1`,'PLAYER_WIN',400],[`${root}.1.2`,'PLAYER_WIN',400],[`${root}.2`,'PUSH',200]]);
  expect(paid.bankrolls[0]).toEqual({ available: 2400, reserved: 0 });
});
it('[RSA-021] Charlie V1.2 still forbids Split-Ace Hit and Charlie chase', () => {
  const state = split(table(['A','9','6','9'],CHARLIE_V1_2));
  rejectUnchanged(state,'HIT','HIT_NOT_ALLOWED');
  const finished = accepted(game.resolveAdvancedDealer(split(state)));
  expect(finished.game.round!.players.every(hand => hand.cards.length === 2 && hand.outcome !== 'CHARLIE')).toBe(true);
});

it('RA1 activation forces complete A+A when matching RSA funds are unavailable', () => {
  for (const amount of [200,399]) {
    const state = split(withAvailable(table(['A','A']),amount));
    expect(state.game.round!.players.every(hand => hand.complete)).toBe(true);
    expect(state.game.round!.phase).toBe('DEALER_TURN'); expect(ranks(state)).toEqual([['A','A'],['A','A']]);
    expect(state.bankrolls[0].available).toBe(amount-200);
  }
});
it('RA1 current-hand and seat ownership reject stale or waiting descendant requests atomically', () => {
  const state = opportunity();
  expect(game.splitAdvancedHand(state,2,currentId(state))).toEqual({ok:false,state,error:'WRONG_SEAT'});
  rejectUnchanged(state,'SPLIT','WRONG_HAND',`${root}.2`);
  const next = split(state); expect(game.splitAdvancedHand(next,1,`${root}.1`).ok).toBe(false);
});
