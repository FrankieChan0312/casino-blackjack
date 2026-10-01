import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as game from '../../src/domain/behindGame.js';
import { getPublicBehindView } from '../../src/domain/behindPublicView.js';
import { beginControllerSplit, decideSplitFollow, standControllerHand, beginControllerDouble } from '../../src/domain/behindController.js';
import { createReplaySession, replay, parseReplay, REPLAY_VERSION } from '../../src/domain/replay.js';
import { CLASSIC, CHARLIE, CLASSIC_V1_2, CHARLIE_V1_2, type ProfileId } from '../../src/domain/profile.js';
import type { Rank } from '../../src/domain/card.js';
import { behindFixture, accepted } from '../helpers/behindFixture.js';
import { noRandom, seat } from '../helpers/tableFixture.js';
import { freezeDeep } from '../helpers/advancedFixture.js';
import { send, startSession, closeAce, finishSession, type DemoSession } from '../helpers/replayFixture.js';

const root = 'round-1/seat-1';
function backed(supplements: readonly Rank[] = ['A','9','6','9'], stake = 200, profileId: ProfileId = CLASSIC_V1_2) {
  const initial = behindFixture(['A','9','A','8',...supplements],[seat(1)]);
  let state = accepted(game.openBehindBetting({...initial,table:{...initial.table,profileId}}));
  state = accepted(game.setBehindMainWager(state,1,200)); state = accepted(game.setBackWager(state,1,stake));
  return accepted(game.closeBehindBetting(state,'unused',noRandom));
}
function follow(state: game.BehindGameState, choice: 'ADD'|'NO_ADD', handId = root) {
  return accepted(decideSplitFollow(accepted(beginControllerSplit(state,'computer-1',handId)),handId,choice));
}
function exposures(state: game.BehindGameState) { return state.backExposures.map(e=>[e.handId,e.stakeUnits,e.parentHandId]); }
function session(profileId: ProfileId = CLASSIC_V1_2) {
  const s = createReplaySession(4689,profileId);
  send(s,{type:'CONFIGURE',seats:[seat(1,'HUMAN')]}); send(s,{type:'OPEN'}); send(s,{type:'MAIN',seat:1,amount:200}); send(s,{type:'CLOSE'});
  send(s,{type:'ACT',action:'SPLIT',handId:root}); return s;
}
function finishRSA(s: DemoSession) { send(s,{type:'ACT',action:'SPLIT',handId:`${root}.1`}); return finishSession(s); }

it('[RSA-022] RSA ADD creates equal actual exposure on both ordered descendants', () => {
  const before = follow(backed(),'ADD'); const state = follow(before,'ADD',`${root}.1`);
  expect(exposures(state)).toEqual([[`${root}.1.1`,200,`${root}.1`],[`${root}.1.2`,200,`${root}.1`],[`${root}.2`,200,root]]);
  expect(state.human!.bankroll).toEqual({available:1400,reserved:600});
  expect(state.computers[0].bankroll).toEqual({available:1400,reserved:600});
});
it('[RSA-023] RSA NO_ADD retains only the first ordered descendant exposure', () => {
  const before = follow(backed(),'ADD'); const state = follow(before,'NO_ADD',`${root}.1`);
  expect(exposures(state)).toEqual([[`${root}.1.1`,200,`${root}.1`],[`${root}.2`,200,root]]);
  expect(state.human!.bankroll).toEqual(before.human!.bankroll); expect(state.computers[0].bankroll.reserved).toBe(600);
});
it('[RSA-024] insufficient follower ADD falls back without blocking controller RSA or inventing exposure', () => {
  const before = follow(backed(['A','9','6','9'],1200),'NO_ADD'); const state = follow(before,'ADD',`${root}.1`);
  expect(state.followDecisions.at(-1)).toEqual({kind:'SPLIT',handId:`${root}.1`,choice:'NO_ADD',fundingError:'INSUFFICIENT_FUNDS'});
  expect(exposures(state)).toEqual([[`${root}.1.1`,1200,`${root}.1`]]); expect(state.human!.bankroll).toEqual({available:800,reserved:1200});
  expect(state.computers[0].bankroll.reserved).toBe(600); expect(state.table.game.round!.players).toHaveLength(3);
  const paid = accepted(game.settleBehindWagers(accepted(game.advanceBehindTable(state))));
  expect(paid.backResults.map(r=>[r.stakeUnits,r.grossReturnUnits])).toEqual([[1200,2400]]);
  expect(paid.human!.bankroll).toEqual({available:3200,reserved:0});
});
it('[RSA-025] every RSA follow decision closes before any new child supplement is drawn or exposed', () => {
  const before = follow(backed(),'ADD'); const state = accepted(beginControllerSplit(before,'computer-1',`${root}.1`));
  expect(state.table.game.shoe).toBe(before.table.game.shoe); expect(state.table.game.shoe.inPlay).toHaveLength(5);
  expect(getPublicBehindView(state).round!.seats[0].hands.map(h=>h.cards.map(c=>c.rank))).toEqual([['A'],['A'],['A']]);
  expect(state.followWindow).toMatchObject({kind:'SPLIT',handId:`${root}.1`});
  expect(game.advanceBehindTable(state).state).toBe(state); expect(game.actBehindHand(state,`${root}.1.1`,'HIT').state).toBe(state);
  expect(state.human!.bankroll).toEqual(before.human!.bankroll);
  const closed = accepted(decideSplitFollow(state,`${root}.1`,'ADD'));
  expect(closed.table.game.shoe.inPlay).toHaveLength(8);
  expect(closed.table.game.round!.players.map(h=>h.cards.map(c=>c.rank))).toEqual([['A','9'],['A','6'],['A','9']]);
});
it('[RSA-026] a tracked RSA descendant creates another fresh pre-card follow window', () => {
  const original = follow(backed(['A','A','9','6','9','9']),'ADD'); const firstRSA = follow(original,'ADD',`${root}.1`);
  expect(firstRSA.table.game.round!.currentHandId).toBe(`${root}.1.1`);
  const pending = accepted(beginControllerSplit(firstRSA,'computer-1',`${root}.1.1`));
  expect(pending.followWindow).toMatchObject({kind:'SPLIT',handId:`${root}.1.1`});
  expect(pending.table.game.shoe).toBe(firstRSA.table.game.shoe); expect(pending.table.game.round!.players.map(h=>h.cards.length)).toEqual([1,1,1,1]);
  const state = accepted(decideSplitFollow(pending,`${root}.1.1`,'ADD'));
  expect(exposures(state)).toEqual([[`${root}.1.1.1`,200,`${root}.1.1`],[`${root}.1.1.2`,200,`${root}.1.1`],
    [`${root}.1.2`,200,`${root}.1`],[`${root}.2`,200,root]]);
  expect(state.followDecisions.map(d=>d.handId)).toEqual([root,`${root}.1`,`${root}.1.1`]);
  expect(state.table.game.round!.players.every(h=>h.complete && h.cards.length===2)).toBe(true);
});
it('[RSA-027] captured baseline V1.1 Classic and Charlie packages preserve exact outcomes and digests', () => {
  for (const [id,digest] of [[CLASSIC,'fnv1a32-v1:9ecbae88'],[CHARLIE,'fnv1a32-v1:e22e082f']]) {
    const fixture = JSON.parse(readFileSync(`tests/ra1/fixtures/${id}.json`,'utf8'));
    expect(fixture.baseline).toBe('8326f846ad753b79fd8d35f76b00f28854e2f448'); expect(fixture.package.outcomeDigest).toBe(digest);
    const result = replay(fixture.package); expect(result.digest).toBe(digest); expect(result.outcomes).toEqual(fixture.outcomes);
    expect(result.publicState.round!.seats[0].hands.map(h=>h.cards.map(c=>c.rank))).toEqual([['A','A'],['A','4']]);
  }
});
it('[RSA-028] V1.2 Classic and Charlie RSA deterministically replay exact ordered ordinary results under schema v1', () => {
  for (const id of [CLASSIC_V1_2,CHARLIE_V1_2]) {
    const s = session(id); const p = finishRSA(s); const r = replay(JSON.stringify(p));
    expect(REPLAY_VERSION).toBe(1); expect(parseReplay(p).configuration.profileId).toBe(id);
    expect(r.digest).toBe(p.outcomeDigest); expect(r.outcomes).toEqual(s.getOutcomes()); expect(r).toEqual(replay(p));
    expect(r.publicState.round!.seats[0].hands.map(h=>[h.handId,h.cards.map(c=>c.rank),h.outcome])).toEqual([
      [`${root}.1.1`,['A','4'],'DEALER_WIN'],[`${root}.1.2`,['A','4'],'DEALER_WIN'],[`${root}.2`,['A','K'],'PUSH']]);
    expect(r.outcomes[0].resultRecords.map(result=>result.grossReturnUnits)).toEqual([0,0,200]);
    expect(r.publicState.human).toMatchObject({available:1600,reserved:0});
  }
});
it('[RSA-029] audit attributes the RSA parent Split and ordered children to the same command with no hidden cards', () => {
  const s = session(); finishRSA(s);
  const events = s.getAudit(); const parent = events.find(e=>e.type==='SPLIT' && e.handId===`${root}.1`)!;
  expect(parent).toMatchObject({actorId:'local-human',seat:1,amountUnits:200,profileId:'CLASSIC_6D_S17_V1_2',status:'ACCEPTED'});
  const children = events.filter(e=>e.type==='SPLIT_CHILD' && e.commandId===parent.commandId);
  expect(children.map(e=>e.handId)).toEqual([`${root}.1.1`,`${root}.1.2`]); expect(children[0].sequence).toBeGreaterThan(parent.sequence);
  expect(events.filter(e=>e.type==='WAGER_SETTLEMENT').map(e=>e.handId)).toEqual([`${root}.1.1`,`${root}.1.2`,`${root}.2`]);
  expect(JSON.stringify(events)).not.toMatch(/deckIndex|physical|"cards"|"seed"|availableCards/);
});
it('RA1 follower exact funds ADD is accepted on the affected RSA attachment', () => {
  const state = follow(follow(backed(['A','9','6','9'],1000),'NO_ADD'),'ADD',`${root}.1`);
  expect(state.human!.bankroll).toEqual({available:0,reserved:2000});
  expect(exposures(state)).toEqual([[`${root}.1.1`,1000,`${root}.1`],[`${root}.1.2`,1000,`${root}.1`]]);
});
it('RA1 controller RSA validation preserves funds/cards/window on insufficient funds, cap and wrong ownership', () => {
  const initial = follow(backed(),'ADD');
  const short = {...initial,computers:initial.computers.map((c,i)=>i===0?{...c,bankroll:{...c.bankroll,available:199}}:c)};
  const limited = {...initial,table:{...initial.table,game:{...initial.table.game,round:{...initial.table.game.round!,players:[
    ...initial.table.game.round!.players,...[3,4].map(n=>({...initial.table.game.round!.players[0],handId:`${root}.${n}`,complete:true}))]}}}};
  for (const [state,error] of [[short,'INSUFFICIENT_FUNDS'],[limited,'HAND_LIMIT_REACHED']] as const) {
    const bytes = JSON.stringify(state); freezeDeep(state);
    expect(beginControllerSplit(state,'computer-1',`${root}.1`)).toEqual({ok:false,state,error}); expect(JSON.stringify(state)).toBe(bytes);
  }
  expect(beginControllerSplit(initial,'local-human',`${root}.1`)).toEqual({ok:false,state:initial,error:'NOT_CONTROLLER'});
  expect(beginControllerDouble(initial,'computer-1',`${root}.1`)).toEqual({ok:false,state:initial,error:'DOUBLE_NOT_ALLOWED'});
});
it('RA1 controller Stand declines RSA and computer automation never Hits a Split-Ace opportunity', () => {
  const before = follow(backed(),'ADD'); const stood = accepted(standControllerHand(before,'computer-1',`${root}.1`));
  expect(stood.table.game.round!.players[0]).toMatchObject({complete:true,decisionTaken:true});
  expect(stood.table.game.round!.players[0].cards.map(c=>c.rank)).toEqual(['A','A']);
  const automatic = accepted(game.advanceBehindTable(before));
  expect(automatic.table.game.round!.players.map(h=>h.cards.map(c=>c.rank))).toEqual([['A','A'],['A','9']]);
});
it('RA1 replay rejection preserves gameplay and accepted journal including deterministic subsequent draws', () => {
  const rejected = session(); const before = rejected.getState(); const bytes = JSON.stringify(before);
  expect(rejected.dispatch({type:'ACT',action:'HIT',handId:`${root}.1`})).toEqual({ok:false,state:before,error:'HIT_NOT_ALLOWED'});
  expect(rejected.getState()).toBe(before); expect(JSON.stringify(rejected.getState())).toBe(bytes);
  expect(rejected.getAudit().at(-1)).toMatchObject({type:'HIT',status:'REJECTED',reason:'HIT_NOT_ALLOWED'});
  const withAttempt = finishRSA(rejected); const withoutAttempt = finishRSA(session());
  expect(withAttempt).toEqual(withoutAttempt); expect(rejected.getOutcomes()).toEqual(replay(withoutAttempt).outcomes);
});
it('RA1 V1.2 Charlie remains independently enabled for eligible non-Ace five-card hands only', () => {
  for (const id of [CLASSIC_V1_2,CHARLIE_V1_2]) {
    const s = startSession(21,id); closeAce(s);
    for (let n=0;n<3;n++) send(s,{type:'ACT',action:'HIT',handId:root});
    const hand = s.getState().table.game.round!.players[0]; expect(hand.cards).toHaveLength(5);
    expect(hand.cards.map(card=>card.rank)).toEqual(['4','5','5','4','3']); // 21, so both profiles end decisions.
    if (id===CHARLIE_V1_2) {
      expect(hand).toMatchObject({outcome:'CHARLIE',outcomeReason:'FIVE_CARD_CHARLIE',complete:true});
      const before = s.getState(); expect(s.dispatch({type:'ACT',action:'HIT',handId:root}).ok).toBe(false); expect(s.getState()).toBe(before);
      expect(replay(finishSession(s)).outcomes[0].resultRecords[0]).toMatchObject({outcome:'CHARLIE',grossReturnUnits:400});
    } else { expect(hand.outcome).toBeUndefined(); expect(hand.complete).toBe(true); finishSession(s); }
  }
});
