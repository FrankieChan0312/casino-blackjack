import { expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { digest } from '../../src/baccarat/domain/engine.js';
import { exportReplay, replay } from '../../src/baccarat/domain/replay.js';
import { ordered, send, createLegacyBaccarat as createBaccarat } from './fixtures.js';

it('[M12-P01] replay reconstructs wagers, exact draw order/decisions/result/accounting/journal', () => {
  let state=createBaccarat(55,100000,ordered([5,5,0,0,4,2]));
  for(const target of ['PLAYER','BANKER','TIE'] as const)state=send(state,{type:'WAGER',target,amountUnits:2500});
  state=send(send(state,{type:'DEAL'}),{type:'COMMIT'});state=send(state,{type:'REPEAT'});
  state=send(send(state,{type:'DEAL'}),{type:'COMMIT'});
  const result=replay(JSON.parse(JSON.stringify(exportReplay(state))),()=> '2026-10-08T00:00:00.000Z');
  expect(result.digest).toBe(digest(state));expect(result.state.round).toEqual(state.round);
  expect(result.state.commands).toEqual(state.commands);expect(result.state.shoe).toEqual(state.shoe);
  expect(result.state.journal.map(({timestamp: _timestamp,...entry})=>{void _timestamp;return entry;}))
    .toEqual(state.journal.map(({timestamp: _timestamp,...entry})=>{void _timestamp;return entry;}));
  expect(result.state.journal[0].timestamp).not.toBe(state.journal[0].timestamp);
});
it('[M12-P02] every24 seeded twenty-round replay yields identical authoritative digest', () => {
  for(let seed=1;seed<=24;seed++){
    let state=createBaccarat(seed);
    for(let round=0;round<20;round++){
      state=send(state,{type:'WAGER',target:round%2?'BANKER':'PLAYER',amountUnits:100});
      state=send(send(state,{type:'DEAL'}),{type:'COMMIT'});if(round<19)state=send(state,{type:'NEXT'});
    }
    expect(replay(exportReplay(state)).digest).toBe(digest(state));
  }
});
it('[M12-P03] malformed/tampered/duplicate/stale intents and invalid full inventory fail reconstruction', () => {
  let state=createBaccarat(1,100000,ordered([3,9,0,0,7,7]));
  state=send(state,{type:'WAGER',target:'BANKER',amountUnits:2500});state=send(send(state,{type:'DEAL'}),{type:'COMMIT'});
  const original=JSON.stringify(exportReplay(state));
  const mutate=(change:(value:Record<string,unknown>)=>void)=>{const data=JSON.parse(original);change(data);return data;};
  for(const input of [null,{},mutate(data=>{data.version=2;}),mutate(data=>{data.digest='fnv1a32-v1:00000000';}),
    mutate(data=>{const config=data.configuration as Record<string,unknown>;delete config.initialUnits;}),
    mutate(data=>{(data.configuration as {orderedIds:string[]}).orderedIds[0]='bad';}),
    mutate(data=>{const ids=(data.configuration as {orderedIds:string[]}).orderedIds;ids[0]=ids[1];}),
    mutate(data=>{(data.commands as {roundId:string}[])[1].roundId='stale';}),
    mutate(data=>{(data.commands as unknown[]).push((data.commands as unknown[])[0]);}),
    mutate(data=>{(data.commands as {amountUnits:number}[])[0].amountUnits=2600;}),
    mutate(data=>{(data.commands as Record<string,unknown>[])[0].avatar='noble_female';}),
  ])expect(()=>replay(input)).toThrow();
});
it('[M12-P04] headless source has no presentation/runtime/network capability or Blackjack mutation', () => {
  for(const file of readdirSync('src/baccarat/domain').filter(file=>file.endsWith('.ts'))){
    const source=readFileSync('src/baccarat/domain/'+file,'utf8');
    expect(source).not.toMatch(/from ['"].*(?:react|\/ui\/|\/presentation\/|\/browser\/)/);
    expect(source).not.toMatch(/\b(?:document|window|fetch|WebSocket|localStorage|sessionStorage|setTimeout|requestAnimationFrame)\b/);
  }
  const config=JSON.parse(readFileSync('tsconfig.baccarat.json','utf8'));expect(config.compilerOptions.lib).toEqual(['ES2023']);expect(config.compilerOptions.types).toEqual([]);
});
it('[M12-P05] actual multi-shoe rollover reconstructs without replacement, refills or lost credits', () => {
  let state=createBaccarat(81),ordinal=0,ids=new Set<string>();
  for(let round=0;round<180;round++){
    state=send(state,{type:'WAGER',target:'BANKER',amountUnits:100});state=send(state,{type:'DEAL'});
    if(state.shoe.ordinal!==ordinal){ids=new Set();ordinal=state.shoe.ordinal;}
    for(const draw of state.round!.draws){expect(ids.has(draw.card.id)).toBe(false);ids.add(draw.card.id);}
    state=send(state,{type:'COMMIT'});if(round<179)state=send(state,{type:'NEXT'});
  }
  expect(state.shoe.ordinal).toBeGreaterThanOrEqual(1);
  const reconstructed=replay(exportReplay(state));expect(reconstructed.state.shoe).toEqual(state.shoe);
  expect(reconstructed.digest).toBe(digest(state));expect(reconstructed.state.availableUnits).toBe(state.availableUnits);
});
