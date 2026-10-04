import { it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { mapSeats } from '../../src/presentation/seatMapping.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { Table } from '../../src/ui/Table.js';
import { createCharacterLineup } from '../../src/presentation/characters.js';
import { createBehindGame } from '../../src/domain/behindGame.js';
import { CLASSIC_V1_2 } from '../../src/domain/profile.js';

const sets=[[4],[3,4],[3,4,6],[1,3,4,6],[1,3,4,5,6],[1,2,3,4,5,6],[1,2,3,4,5,6,7]];
const angles=[[90],[160,20],[160,90,20],[160,113+1/3,66+2/3,20],[160,125,90,55,20],[160,132,104,76,48,20],[160,136+2/3,113+1/3,90,66+2/3,43+1/3,20]];
for(let count=1;count<=7;count++) it(`[M10-S${count}] literal count-specific mapping retains identities and public hand/turn facts`,()=>{
  const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7}); c.dispatch({type:'START',count});
  c.dispatch({type:'DEAL',amount:200}); const before=c.getSnapshot(), serialized=JSON.stringify(before);
  const mapped=mapSeats(sets[count-1]);
  expect(mapped.map(s=>s.seatNumber)).toEqual(sets[count-1]);
  expect(mapped.map(s=>s.slot)).toEqual(Array.from({length:count},(_,i)=>i+1));
  expect(mapped.find(s=>s.seatNumber===4)?.slot).toBe(Math.floor(count/2)+1);
  mapped.forEach((s,i)=>expect(s.angle).toBeCloseTo(angles[count-1][i],10));
  expect(mapSeats(sets[count-1])).toEqual(mapped);
  const lineup=createCharacterLineup(sets[count-1].filter(s=>s!==4),()=>0);
  const html=renderToStaticMarkup(<Table view={before} lineup={lineup}/>);
  expect([...html.matchAll(/data-seat-anchor="seat-(\d)"/g)].map(m=>Number(m[1]))).toEqual(sets[count-1]);
  expect([...html.matchAll(/data-arc-slot="(\d)"/g)].map(m=>Number(m[1]))).toEqual(mapped.map(s=>s.slot));
  expect([...html.matchAll(/id="player-hand"/g)]).toHaveLength(1);
  expect([...html.matchAll(/data-hand-id="([^"]+)"/g)].map(m=>m[1])).toEqual(before.round!.seats.flatMap(s=>s.hands.map(h=>h.handId)));
  expect(JSON.stringify(c.getSnapshot())).toBe(serialized);
});
it('[M10-S08] sitting-out occupancy keeps its slot; invalid/duplicate/unordered identity lists reject',()=>{
  expect(mapSeats([1,2,3,4,5,6,7]).filter(s=>s.seatNumber!==1).map(s=>s.slot)).toEqual([2,3,4,5,6,7]);
  const random={nextInt:(n:number)=>n-1},base=createBehindGame('mapping-low',random,true,CLASSIC_V1_2);
  const state={...base,computers:base.computers.map(p=>({...p,bankroll:{available:p.seatNumber===1?19:2000,reserved:0}}))};
  const c=createBrowserController({playerMode:true,deferPlayerStart:true,factory:()=>state,random});
  c.dispatch({type:'START',count:7}); const html=renderToStaticMarkup(<Table view={c.getSnapshot()}/>);
  expect([...html.matchAll(/data-seat-anchor="seat-(\d)"/g)].map(m=>Number(m[1]))).toEqual([1,2,3,4,5,6,7]);
  expect(html).toContain('data-arc-slot="1"'); expect(html).toContain('Sitting Out');
  for(const seats of [[],[4,4],[4,3],[0],[8],[1.5],[1,2,3,4,5,6,7,8]])expect(()=>mapSeats(seats)).toThrow();
});
