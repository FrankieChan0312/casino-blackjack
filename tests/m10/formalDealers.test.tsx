import { expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { renderToStaticMarkup } from 'react-dom/server';
import { FORMAL_DEALER_POOL, FORMAL_DEALER_ASSETS, FORMAL_DEALER_CONFIGURATION } from '../../src/presentation/formalDealers.js';
import { characters, createCharacterLineup, type CharacterLineup } from '../../src/presentation/characters.js';
import { assignRotatingDealerIdentity, createDealerTableIdentity, changeDealerTableHuman, dealerPresentation,
  DEALER_PRESENTATION_STATES } from '../../src/presentation/dealerPresentation.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { App } from '../../src/ui/App.js';
import { DealerZone } from '../../src/ui/DealerZone.js';

const pool = ['noble_female','knight_female','mage_female','elf_female','halforc_female'] as const;
const seats = [[4],[3,4],[3,4,6],[1,3,4,6],[1,3,4,5,6],[1,2,3,4,5,6],[1,2,3,4,5,6,7]];
it('[M10-F01] exactly five owner-approved source/runtime pairs decode with manifest hashes, alpha and dimensions', () => {
  expect(FORMAL_DEALER_POOL).toEqual(pool);
  expect(FORMAL_DEALER_ASSETS.map(a=>a.characterId)).toEqual(pool);
  const audit=JSON.parse(execFileSync(process.execPath,['scripts/verify-dealer-assets.mjs'],{encoding:'utf8'}));
  expect(audit.status).toBe('PASS');expect(audit.files).toHaveLength(5);expect(audit.regeneratedArtwork).toBe(false);
  for(let i=0;i<5;i++) {
    const asset=FORMAL_DEALER_ASSETS[i],file=audit.files[i];
    expect(asset.role).toBe('dealer');expect(asset.variant).toBe('formal');
    expect(file.source.sha256).toBe(asset.provenance.derivedSource.sha256);expect(file.runtime.sha256).toBe(asset.sha256);
    expect([file.source.width,file.source.height]).toEqual([1086,1448]);
    expect([file.runtime.width,file.runtime.height]).toEqual([240,320]);
    expect(file.runtime.alphaExtrema).toEqual([0,255]);expect(file.runtime.transparentPixels).toBeGreaterThan(768);
    expect(file.runtime.visiblePixels).toBeGreaterThan(7680);expect(file.runtime.chunkCrcs).toBe('PASS');
    expect(file.source.path).toBe(`art/source/dealers/${pool[i]}/formal.png`);
    expect(file.runtime.path).toBe(`public/characters/dealer/${pool[i]}/formal.png`);
  }
});
it('[M10-F02] literal initial and subsequent session positions wrap through the approved order', () => {
  const lineup:CharacterLineup={human:'dwarf_male',guests:{}};
  const expected=[...pool,...pool];
  for(let ordinal=0;ordinal<10;ordinal++)expect(assignRotatingDealerIdentity(lineup,pool,'noble_female',ordinal)).toBe(expected[ordinal]);
});
it('[M10-F03] literal single/multiple/wrap collisions and complete exhaustion never select an unapproved identity', () => {
  expect(assignRotatingDealerIdentity({human:'noble_female',guests:{}},pool,'noble_female',0)).toBe('knight_female');
  expect(assignRotatingDealerIdentity({human:'noble_female',guests:{1:'knight_female'}},pool,'noble_female',0)).toBe('mage_female');
  expect(assignRotatingDealerIdentity({human:'noble_female',guests:{1:'knight_female',2:'mage_female'}},pool,'noble_female',0)).toBe('elf_female');
  expect(assignRotatingDealerIdentity({human:'noble_female',guests:{1:'knight_female',2:'mage_female',3:'elf_female'}},pool,'noble_female',0)).toBe('halforc_female');
  expect(assignRotatingDealerIdentity({human:'halforc_female',guests:{}},pool,'noble_female',4)).toBe('noble_female');
  expect(assignRotatingDealerIdentity({human:'noble_female',guests:{1:'knight_female',2:'mage_female',3:'elf_female',5:'halforc_female'}},pool,'noble_female',0)).toBeNull();
});
for(let count=1;count<=7;count++)it(`[M10-F04-${count}] actual count/seat lineup is unchanged for every human, pool position and first/last guest chooser`, () => {
  const guests=seats[count-1].filter(n=>n!==4);
  for(const human of characters)for(let ordinal=0;ordinal<5;ordinal++)for(const choose of [()=>0,(n:number)=>n-1]){
    const table=createDealerTableIdentity(guests,choose,human.id,'noble_female',pool,ordinal);
    expect(table.lineup).toEqual(createCharacterLineup(guests,choose,human.id));
    const seated=[table.lineup.human,...Object.values(table.lineup.guests)];
    expect(seated).toHaveLength(count);expect(new Set(seated).size).toBe(count);
    if(table.characterId) { expect(pool).toContain(table.characterId);expect(seated).not.toContain(table.characterId); }
    else expect(pool.every(id=>seated.includes(id))).toBe(true);
    for(const selected of characters){const changed=changeDealerTableHuman(table,selected.id);
      expect(changed.characterId).toBe(table.characterId);
      expect(Object.keys(changed.lineup.guests)).toEqual(Object.keys(table.lineup.guests));
      if(changed.characterId)expect([changed.lineup.human,...Object.values(changed.lineup.guests)]).not.toContain(changed.characterId);
    }
  }
});
it('[M10-F05] pure rotation consumes zero entropy/controller RNG/commands and preserves its snapshot', () => {
  let draws=0,events=0;
  const c=createBrowserController({playerMode:true,random:{nextInt:n=>{draws++;return n-1;}}}),before=c.getSnapshot(),count=draws;
  c.subscribe(()=>events++);const random=vi.spyOn(Math,'random').mockImplementation(()=>{throw Error('Unexpected RNG');});
  const entropy=vi.spyOn(crypto,'getRandomValues').mockImplementation(()=>{throw Error('Unexpected entropy');});
  try {for(let ordinal=0;ordinal<30;ordinal++)assignRotatingDealerIdentity({human:'knight_male',guests:{}},pool,'noble_female',ordinal);
    expect(random).not.toHaveBeenCalled();expect(entropy).not.toHaveBeenCalled();expect(draws).toBe(count);
    expect(events).toBe(0);expect(c.getSnapshot()).toBe(before);
  } finally {random.mockRestore();entropy.mockRestore();}
});
it('[M10-F06] full seeded replay/digest/results/audit match with and without formal rendering and visual rotation observations', () => {
  const receipts=[];
  for(const configuration of [undefined,FORMAL_DEALER_CONFIGURATION]) {
    const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7,clock:()=> '2026-01-01T00:00:00.000Z'});
    c.dispatch({type:'START',count:7});const render=()=>renderToStaticMarkup(<App controller={c} chooseCharacter={()=>0} dealerConfiguration={configuration} />);
    render();c.dispatch({type:'DEAL',amount:200});render();
    for(let i=0;i<20&&!c.getSnapshot().interaction.nextRound;i++){
      for(let ordinal=0;ordinal<5;ordinal++)assignRotatingDealerIdentity({human:'knight_male',guests:{}},pool,'noble_female',ordinal);
      const v=c.getSnapshot();expect(c.dispatch(v.interaction.insurance?{type:'ACE',choice:'DECLINE'}:{type:'ACT',action:'STAND',handId:v.interaction.handId})).toBe(true);render();
    }
    expect(c.getSnapshot().phase).toBe('COMMITTED');receipts.push({snapshot:c.getSnapshot(),replay:c.exportReplay()});
  }
  expect(receipts[1]).toEqual(receipts[0]);expect(JSON.stringify(receipts)).not.toMatch(/characterId|variant|formal\.png/);
});
it('[M10-F07] every static hook uses the same single portrait per identity; null/unavailable assets preserve generic Dealer', () => {
  for(const asset of FORMAL_DEALER_ASSETS)for(const state of DEALER_PRESENTATION_STATES){
    const html=renderToStaticMarkup(<DealerZone dealer={undefined} presentation={dealerPresentation(asset.characterId,state,FORMAL_DEALER_ASSETS)} />);
    expect(html).toContain(`src="${asset.src}"`);expect(html).toContain(`data-dealer-presentation-state="${state}"`);
    expect(html).toContain(`alt="Dealer: ${characters.find(c=>c.id===asset.characterId)!.name}"`);expect(html).not.toContain('formal casino attire');
  }
  for(const id of [null,'noble_female'] as const){const html=renderToStaticMarkup(<DealerZone dealer={undefined} presentation={dealerPresentation(id,'IDLE')} />);
    expect(html).toContain('temporary-fallback');expect(html).toContain('Original illustrated female dealer');expect(html).not.toContain('<img');}
  const main=readFileSync('src/main.tsx','utf8');expect(main).toContain('FORMAL_DEALER_CONFIGURATION');
  expect(readFileSync('src/presentation/formalDealers.ts','utf8')).not.toMatch(/Math\.random|setTimeout|setInterval|motion|dispatch\s*\(/);
});
it('[M10-F08] actual controller resets advance the ordinal; rounds and rejected resets retain it', () => {
  const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7});
  const assertSession=(ordinal:number,identity:typeof pool[number])=>{
    expect(c.getSnapshot().presentationSession).toBe(ordinal);
    expect(assignRotatingDealerIdentity({human:'knight_male',guests:{}},pool,'noble_female',ordinal)).toBe(identity);
  };
  const complete=()=>{
    for(let i=0;i<20&&!c.getSnapshot().interaction.nextRound;i++){
      const v=c.getSnapshot();
      expect(c.dispatch(v.interaction.insurance?{type:'ACE',choice:'DECLINE'}:{type:'ACT',action:'STAND',handId:v.interaction.handId})).toBe(true);
    }
    expect(c.getSnapshot().phase).toBe('COMMITTED');
  };
  assertSession(0,'noble_female');expect(c.dispatch({type:'START',count:1})).toBe(true);
  expect(c.dispatch({type:'NEW_TABLE'})).toBe(false);assertSession(0,'noble_female');
  expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);
  expect(c.dispatch({type:'MODE',playerMode:false})).toBe(false);
  expect(c.startDemo(c.getSnapshot().profileId,7)).toBe(false);assertSession(0,'noble_female');
  complete();expect(c.dispatch({type:'REPEAT'})).toBe(true);assertSession(0,'noble_female');
  complete();expect(c.dispatch({type:'NEXT'})).toBe(true);assertSession(0,'noble_female');
  expect(c.dispatch({type:'DEAL',amount:200})).toBe(true);complete();
  expect(c.dispatch({type:'NEW_TABLE'})).toBe(true);assertSession(1,'knight_female');
  expect(c.startDemo(c.getSnapshot().profileId,7)).toBe(true);assertSession(2,'mage_female');
  expect(c.dispatch({type:'MODE',playerMode:false})).toBe(true);assertSession(3,'elf_female');
  expect(c.dispatch({type:'MODE',playerMode:false})).toBe(true);assertSession(3,'elf_female');
  expect(c.dispatch({type:'MODE',playerMode:true})).toBe(true);assertSession(4,'halforc_female');
  expect(createBrowserController({playerMode:true,deferPlayerStart:true,seed:7}).getSnapshot().presentationSession).toBe(0);
});
