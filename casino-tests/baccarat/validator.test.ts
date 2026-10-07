import { expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveGitDir } from '../../scripts/git-directory.mjs';
import { bankerDraws, resolveRound } from '../../src/baccarat/domain/rules.js';
import { cards } from './fixtures.js';

// Independent literal oracle from the owner table. No production decision or
// scoring function generates expected values, branches, indices or outcomes.
const MATRIX = ['DDDDDDDDDD','DDDDDDDDDD','DDDDDDDDDD','DDDDDDDDSD','SSDDDDDDSS','SSSSDDDDSS','SSSSSSDDSS','SSSSSSSSSS'];
const combinations = MATRIX.flatMap((row, banker) => [...row].map((expected, third) => ({banker,third,expected})));
it.each(combinations)('[M12-V01] independent Banker $banker / Player third $third -> $expected', ({banker,third,expected}) => {
  expect(bankerDraws(banker, third)).toBe(expected === 'D');
});
it('[M12-V02] exact decision inventory and eight standing branches', () => {
  expect(combinations).toHaveLength(80); expect(combinations.filter(item => item.expected === 'D')).toHaveLength(51);
  for (let banker=0; banker<8; banker++) expect(bankerDraws(banker,null)).toBe(banker < 6);
});
it('[M12-V03] all36 natural starting combinations prohibit every third card', () => {
  let count=0;
  for(let player=0;player<10;player++) for(let banker=0;banker<10;banker++) if(player>=8||banker>=8){
    const round=resolveRound('natural',cards([player,banker,0,0,7,7]));
    expect(round.natural).toBe(true);expect(round.draws).toHaveLength(4);
    expect([round.playerTotal,round.bankerTotal]).toEqual([player,banker]);count++;
  }
  expect(count).toBe(36);
});
it('[M12-V04] ten thousand independently predicted whole-round draw paths and outcomes', () => {
  let count=0,naturals=0,playerOnly=0,bankerOnly=0,both=0,neither=0;
  for(let player=0;player<10;player++)for(let banker=0;banker<10;banker++)for(let fifth=0;fifth<10;fifth++)for(let sixth=0;sixth<10;sixth++){
    const natural=player>=8||banker>=8, pDraw=!natural&&player<6;
    const bDraw=!natural&&(pDraw?MATRIX[banker][fifth]==='D':banker<6);
    const pFinal=(player+(pDraw?fifth:0))%10, bFinal=(banker+(bDraw?(pDraw?sixth:fifth):0))%10;
    const outcome=pFinal>bFinal?'PLAYER':pFinal<bFinal?'BANKER':'TIE';
    const round=resolveRound('exhaustive',cards([player,banker,0,0,fifth,sixth]));
    expect([round.playerTotal,round.bankerTotal,round.outcome,round.draws.length])
      .toEqual([pFinal,bFinal,outcome,4+Number(pDraw)+Number(bDraw)]);
    const zones=['PLAYER','BANKER','PLAYER','BANKER',...(pDraw?['PLAYER']:[]),...(bDraw?['BANKER']:[])];
    expect(round.draws.map(draw=>draw.zone)).toEqual(zones);
    count++;if(natural)naturals++;else if(pDraw&&bDraw)both++;else if(pDraw)playerOnly++;else if(bDraw)bankerOnly++;else neither++;
  }
  expect({count,naturals,playerOnly,bankerOnly,both,neither})
    .toEqual({count:10000,naturals:3600,playerOnly:1740,bankerOnly:1200,both:3060,neither:400});
  const directory=join(resolveGitDir(),'overnight/m12-validator');mkdirSync(directory,{recursive:true});
  writeFileSync(`${directory}/${Date.now()}-${process.pid}.json`,JSON.stringify({status:'PASS',bankerThird:80,
    drawDecisions:51,standDecisions:29,standingBranches:8,naturalPairs:36,
    resolved:{count,naturals,playerOnly,bankerOnly,both,neither},oracle:'Independent literal matrix and fixture arithmetic'},null,2)+'\n');
  console.info('Baccarat independent validator:80 Banker-third decisions (51draw/29stand),8 standing branches,36 naturals,10000 resolved scenarios; no production-generated expectations');
});
