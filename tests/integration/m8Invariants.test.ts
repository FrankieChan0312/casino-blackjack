import { expect, it } from 'vitest';
import { createSeededRandom } from '../../src/domain/random.js';
import { createShoe, drawCard } from '../../src/domain/shoe.js';
import { createReplaySession, replay } from '../../src/domain/replay.js';
import { CLASSIC, CHARLIE } from '../../src/domain/profile.js';
import { evaluateHand } from '../../src/domain/hand.js';
import { expectAccounting } from '../helpers/shoeFixture.js';
import { send, closeAce, startSession, finishSession } from '../helpers/replayFixture.js';

export const INVARIANT_SEEDS = 256;
const clock=()=> '2026-09-30T05:00:00.000Z';
it('[REG-M8-067] 256 seeded shoes contain 312 distinct IDs and every draw is without replacement',()=>{
  for(let seed=0;seed<INVARIANT_SEEDS;seed++){
    let shoe=createShoe(`seed-${seed}`,createSeededRandom(seed));expectAccounting(shoe);const ids=new Set<string>();
    for(let n=0;n<312;n++){
      const result=drawCard(shoe);expect(result.ok).toBe(true);if(!result.ok)throw new Error(result.error);
      expect(ids.has(result.card.id)).toBe(false);ids.add(result.card.id);shoe=result.shoe;
    }
    expect(ids.size).toBe(312);expectAccounting(shoe);expect(shoe.available).toHaveLength(0);
  }
});
it('[REG-M8-068] 256 seeds reproduce shoe and cut, all cuts stay 219..249 and outcomes do not collapse',()=>{
  const cuts=new Set<number>();const tops=new Set<string>();const values=new Set<number>();
  for(let seed=0;seed<INVARIANT_SEEDS;seed++){
    const a=createShoe('s',createSeededRandom(seed)),b=createShoe('s',createSeededRandom(seed));
    expect(a).toEqual(b);expect(a.cutPosition).toBeGreaterThanOrEqual(219);expect(a.cutPosition).toBeLessThanOrEqual(249);
    cuts.add(a.cutPosition);tops.add(a.available.slice(0,5).map(c=>c.id).join(','));values.add(createSeededRandom(seed).nextInt(312));
  }
  expect(cuts.size).toBeGreaterThan(1);expect(tops.size).toBeGreaterThan(1);expect(values.size).toBeGreaterThan(1);
});
it('[REG-M8-069] cut crossing preserves shoe identity and position throughout seeded draws',()=>{
  for(let seed=0;seed<INVARIANT_SEEDS;seed++){
    let shoe=createShoe('s',createSeededRandom(seed));const cut=shoe.cutPosition;
    for(let n=1;n<=cut+5;n++){
      const result=drawCard(shoe);if(!result.ok)throw new Error(result.error);shoe=result.shoe;
      expect(shoe.shoeId).toBe('s');expect(shoe.cutPosition).toBe(cut);expect(shoe.reshufflePending).toBe(n>=cut);
    }
  }
});
it('[REG-M8-070] 256 three-round sessions conserve cards/funds/reservations, settle once and replay equally',()=>{
  for(let seed=0;seed<INVARIANT_SEEDS;seed++){
    const profile=seed%2?CHARLIE:CLASSIC;
    const s=createReplaySession(seed,profile,{clock});let accumulatedNet=0;
    send(s,{type:'CONFIGURE',seats:[{seatNumber:1,occupancy:'HUMAN',sittingOut:false},
      {seatNumber:2,occupancy:'COMPUTER',sittingOut:false},{seatNumber:3,occupancy:'COMPUTER',sittingOut:false}]});
    for(let round=1;round<=3;round++){
      send(s,{type:'OPEN'});for(const seat of [1,2,3])send(s,{type:'MAIN',seat,amount:20});
      send(s,{type:'BACK',seat:2,amount:20});send(s,{type:'CLOSE'});closeAce(s);
      const shoeId=s.getState().table.game.shoe.shoeId;
      function check(){
        const st=s.getState();expectAccounting(st.table.game.shoe);expect(st.table.game.shoe.shoeId).toBe(shoeId);
        expect(st.human!.bankroll.available).toBeGreaterThanOrEqual(0);expect(st.human!.bankroll.reserved).toBe(40);
        expect(st.computers.every(c=>c.bankroll.available>=0&&c.bankroll.reserved>=0)).toBe(true);
        expect(st.computers[1].bankroll.reserved+st.computers[2].bankroll.reserved+st.human!.bankroll.reserved).toBe(80);
      }
      check();
      while(s.getState().table.game.round!.phase==='PLAYER_TURN'){
        const r=s.getState().table.game.round!;const hand=r.players.find(h=>h.handId===r.currentHandId)!;
        send(s,hand.controller==='HUMAN'?{type:'ACT',handId:hand.handId,action:evaluateHand(hand.cards).total<17?'HIT':'STAND'}:{type:'ADVANCE'});check();
      }
      if(s.getState().table.game.round!.phase==='DEALER_TURN'){send(s,{type:'ADVANCE'});check();}
      send(s,{type:'SETTLE'});const state=s.getState();const records=[...state.table.wagerResults,...state.backResults];
      expect(records.reduce((sum,r)=>sum+r.stakeUnits,0)).toBe(80);
      for(const r of records){
        const ratio=r.outcome==='PLAYER_BLACKJACK'?2.5:r.outcome==='PLAYER_WIN'||r.outcome==='CHARLIE'?2:r.outcome==='PUSH'?1:0;
        expect(r.grossReturnUnits).toBe(r.stakeUnits*ratio);expect(r.netUnits).toBe(r.grossReturnUnits-r.stakeUnits);
        expect(r.status).toBe('COMMITTED');if(profile===CLASSIC)expect(r.outcome).not.toBe('CHARLIE');
      }
      accumulatedNet+=records.reduce((sum,r)=>sum+r.netUnits,0);
      expect(state.human!.bankroll.reserved).toBe(0);expect(state.computers.every(c=>c.bankroll.reserved===0)).toBe(true);
      expect(state.human!.bankroll.available+state.computers.reduce((sum,c)=>sum+c.bankroll.available,0)).toBe(16000+accumulatedNet);
      expect(s.dispatch({type:'SETTLE'})).toMatchObject({ok:false,state});expect(s.getState()).toBe(state);
      expectAccounting(state.table.game.shoe);
      if(round<3)send(s,{type:'NEXT'});
    }
    const p=s.exportPackage();expect(replay(p).outcomes).toEqual(s.getOutcomes());expect(replay(p).digest).toBe(p.outcomeDigest);
  }
}, 15000); // Fixed 256 x 3 real sessions plus replay; bounded allowance for full-suite CPU contention.
it('[REG-M8-071] 256 explicit fault sessions conserve actual stakes and VOID exactly once with replay equality',()=>{
  for(let seed=0;seed<INVARIANT_SEEDS;seed++){
    const s=startSession(seed,CHARLIE,false,true,clock);closeAce(s);
    if(s.getState().table.game.round!.phase!=='PLAYER_TURN'){finishSession(s);continue;}
    send(s,{type:'DEMO_DRAW_FAULT'});send(s,{type:'ACT',action:'HIT',handId:'round-1/seat-1'});send(s,{type:'VOID'});
    const state=s.getState();expectAccounting(state.table.game.shoe);expect(state.human!.bankroll).toEqual({available:2000,reserved:0});
    expect(state.table.wagerResults.every(r=>r.outcome==='VOID'&&r.netUnits===0&&r.grossReturnUnits===r.stakeUnits)).toBe(true);
    expect(s.dispatch({type:'VOID'})).toMatchObject({ok:false,state});expect(replay(s.exportPackage()).outcomes).toEqual(s.getOutcomes());
  }
});
it('[REG-M8-072] controlled fifth legal Hit across both profiles: exact Charlie eligibility/payout/terminal and no stacked Natural',()=>{
  for(const profile of [CLASSIC,CHARLIE]){
    const s=startSession(21,profile);closeAce(s);
    for(let n=0;n<3;n++){
      send(s,{type:'ACT',action:'HIT',handId:'round-1/seat-1'});const h=s.getState().table.game.round!.players[0];
      expect(h.cards).toHaveLength(n+3);expect(h.outcome==='CHARLIE').toBe(profile===CHARLIE&&n===2);
    }
    const h=s.getState().table.game.round!.players[0];if(profile===CHARLIE){
      expect(h.complete).toBe(true);expect(s.dispatch({type:'ACT',action:'HIT',handId:h.handId}).ok).toBe(false);
    }
    const result=replay(finishSession(s));expect(result.outcomes[0].resultRecords[0].outcome).not.toBe('PLAYER_BLACKJACK');
    if(profile===CHARLIE)expect(result.outcomes[0].resultRecords[0].grossReturnUnits).toBe(400);
  }
});
it('[REG-M8-073] Charlie follower result retains actual exposure through seeded replay',()=>{
  const s=startSession(22,CHARLIE,true);const p=finishSession(s);const result=replay(p).outcomes[0].backRecords[0];
  expect(result).toMatchObject({outcome:'CHARLIE',stakeUnits:50,grossReturnUnits:100,netUnits:50});
});
