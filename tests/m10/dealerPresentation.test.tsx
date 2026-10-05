import { expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { characters, createCharacterLineup, type CharacterId } from '../../src/presentation/characters.js';
import { assignDealerIdentity, createDealerTableIdentity, changeDealerTableHuman, dealerPresentation,
  dealerPresentationState, DEALER_PRESENTATION_STATES } from '../../src/presentation/dealerPresentation.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { App } from '../../src/ui/App.js';
import { DealerZone } from '../../src/ui/DealerZone.js';
import { CharacterPicker } from '../../src/ui/CharacterPicker.js';

const seats = [[4],[3,4],[3,4,6],[1,3,4,6],[1,3,4,5,6],[1,2,3,4,5,6],[1,2,3,4,5,6,7]];
it('[M10-D01] eligible preference wins; collision falls back to the literal canonical first free ID', () => {
  const lineup = createCharacterLineup([1,3,6], () => 0);
  expect(assignDealerIdentity(lineup, 'noble_male')).toBe('noble_male');
  expect(assignDealerIdentity(lineup, 'elf_female')).toBe('mage_male');
  expect(assignDealerIdentity({ human:'knight_male',guests:{7:'mage_male',1:'elf_male'} }, 'elf_male')).toBe('elf_female');
});
for (let count=1;count<=7;count++) it(`[M10-D02-${count}] ${count} unchanged players leave an eligible reserved Dealer for every human and preference`, () => {
  for (const human of characters) for (const preferred of characters) for (const choose of [() => 0, (n:number) => n-1]) {
    const guests=seats[count-1].filter(seat=>seat!==4);
    const table=createDealerTableIdentity(guests,choose,human.id,preferred.id);
    const ids=[table.lineup.human,...Object.values(table.lineup.guests)];
    expect(ids).toHaveLength(count); expect(new Set(ids).size).toBe(count);
    expect(table.lineup).toEqual(createCharacterLineup(guests,choose,human.id));
    expect(ids).not.toContain(table.characterId);
    expect(characters.length - ids.length).toBeGreaterThanOrEqual(5);
    expect(Object.keys(table.lineup.guests).map(Number)).toEqual(guests);
    for (const selected of characters) {
      const changed=changeDealerTableHuman(table,selected.id);
      expect(changed.characterId).toBe(table.characterId);
      expect([changed.lineup.human,...Object.values(changed.lineup.guests)]).not.toContain(table.characterId);
      expect(new Set([changed.lineup.human,...Object.values(changed.lineup.guests)]).size).toBe(count);
      expect(Object.keys(changed.lineup.guests)).toEqual(Object.keys(table.lineup.guests));
      if(selected.id===table.characterId)expect(changed).toBe(table);
      else expect(changed.lineup.human).toBe(selected.id);
    }
  }
});
it('[M10-D03] absence of owner selection keeps all accepted player choices and no fabricated formal image', () => {
  const table=createDealerTableIdentity([1,3,6],()=>0);
  expect(table.characterId).toBeNull();
  for(const entry of characters)expect(changeDealerTableHuman(table,entry.id).lineup.human).toBe(entry.id);
  const html=renderToStaticMarkup(<DealerZone dealer={undefined} presentation={dealerPresentation(null,'IDLE')} />);
  expect(html).toContain('data-dealer-art="temporary-fallback"');
  expect(html).toContain('Original illustrated female dealer in professional attire');
  expect(html).not.toContain('<img'); expect(html).not.toContain('data-dealer-character=');
});
it('[M10-D04] assignment, human exchanges and every state render consume no entropy or controller events', () => {
  const lineup=createCharacterLineup([1,3,6],()=>0);
  let draws=0,events=0;
  const controller=createBrowserController({playerMode:true,random:{nextInt:n=>{draws++;return n-1;}}});
  const before=controller.getSnapshot(),count=draws;
  controller.subscribe(()=>events++);
  const entropy=vi.spyOn(crypto,'getRandomValues').mockImplementation(()=>{throw Error('Unexpected entropy');});
  const random=vi.spyOn(Math,'random').mockImplementation(()=>{throw Error('Unexpected entropy');});
  try {
    for(let i=0;i<10;i++)expect(assignDealerIdentity(lineup,'elf_male')).toBe('mage_male');
    for(const state of DEALER_PRESENTATION_STATES)renderToStaticMarkup(<DealerZone dealer={undefined} presentation={dealerPresentation('mage_male',state)} />);
    expect(entropy).not.toHaveBeenCalled(); expect(random).not.toHaveBeenCalled();
    expect(draws).toBe(count);expect(events).toBe(0);expect(controller.getSnapshot()).toBe(before);
  } finally {entropy.mockRestore();random.mockRestore();}
});
const stateCases = [
  [{awaitingPlayer:false},'IDLE'],
  [{awaitingPlayer:false,observation:'INITIAL_DEAL'},'DEALING'],
  [{awaitingPlayer:true},'WAITING_PLAYER'],
  [{awaitingPlayer:false,observation:'HOLE_REVEALED'},'REVEALING'],
  [{awaitingPlayer:false,observation:'DEALER_CARD_ADDED'},'DRAWING'],
  [{awaitingPlayer:false,observation:'RESULTS_COMMITTED'},'SETTLING'],
] as const;
it.each(stateCases)('[M10-D05] public fact fixture %j maps to %s without commands or timing', (facts,expected) => {
  const state=dealerPresentationState(facts);expect(state).toBe(expected);
  const html=renderToStaticMarkup(<DealerZone dealer={undefined} presentation={dealerPresentation('noble_male',state)} />);
  expect(html).toContain(`data-dealer-presentation-state="${expected}"`);
  expect(html).toContain('data-dealer-role="dealer"');expect(html).toContain('data-dealer-variant="formal"');
  expect(html).toContain('temporary-fallback');expect(html).not.toMatch(/onClick|onAnimation|setTimeout|deckIndex|physicalCardId/);
});
it('[M10-D06] interruption cancels cosmetic intent and preserves explicit public diagnostic text', () => {
  expect(dealerPresentationState({awaitingPlayer:true,interrupted:true,observation:'RESULTS_COMMITTED'})).toBe('IDLE');
  const html=renderToStaticMarkup(<DealerZone dealer={undefined} phase="INTEGRITY_ERROR" />);
  expect(html).toContain('data-dealer-status="Round interrupted"');
});
it('[M10-D07] only the configured Dealer option is reserved, with an explicit reason', () => {
  const html=renderToStaticMarkup(<CharacterPicker selected="knight_male" dealerCharacterId="noble_male" onSelect={()=>{}} />);
  expect([...html.matchAll(/disabled=""/g)]).toHaveLength(1);
  expect(html).toContain('value="noble_male" disabled=""');expect(html).toContain('Dealer (reserved for this table)');
});
it('[M10-D08] public waiting choice maps to attention; authoritative commit maps to quiet IDLE without invented event playback', () => {
  const controller=createBrowserController({playerMode:true,seed:7});
  controller.dispatch({type:'DEAL',amount:200});
  const html=renderToStaticMarkup(<App controller={controller} chooseCharacter={()=>0} dealerConfiguration={{preferredCharacterId:'noble_male'}} />);
  expect(html).toContain('data-dealer-character="noble_male"');expect(html).toContain('data-dealer-presentation-state="WAITING_PLAYER"');
  expect(html).toContain('Hidden dealer card');expect(html).toContain('Visible total: 4');
  controller.dispatch({type:'ACT',action:'STAND',handId:controller.getSnapshot().interaction.handId});
  expect(renderToStaticMarkup(<App controller={controller} chooseCharacter={()=>0} />)).toContain('data-dealer-presentation-state="IDLE"');
});
it('[M10-D09] shell/configured assignment preserves seeded commands, complete replay, digest, accounting and audit', () => {
  const receipts=[];
  for(const preferredCharacterId of [undefined,'noble_male','elf_male'] as const) {
    const c=createBrowserController({playerMode:true,deferPlayerStart:true,seed:7,clock:()=> '2026-01-01T00:00:00.000Z'});
    c.dispatch({type:'START',count:7});
    const configuration=preferredCharacterId?{preferredCharacterId}:undefined;
    const render=()=>renderToStaticMarkup(<App controller={c} chooseCharacter={()=>0} dealerConfiguration={configuration} />);
    render(); c.dispatch({type:'DEAL',amount:200});render();
    for(let i=0;i<20&&!c.getSnapshot().interaction.nextRound;i++){
      const v=c.getSnapshot(); expect(c.dispatch(v.interaction.insurance?{type:'ACE',choice:'DECLINE'}:{type:'ACT',action:'STAND',handId:v.interaction.handId})).toBe(true);render();
    }
    expect(c.getSnapshot().phase).toBe('COMMITTED');
    receipts.push({snapshot:c.getSnapshot(),replay:c.exportReplay()});
  }
  expect(receipts[1]).toEqual(receipts[0]);expect(receipts[2]).toEqual(receipts[0]);
  expect(JSON.stringify(receipts)).not.toMatch(/characterId|noble_male|variant/);
});
it('[M10-D10] public-only module and empty production configuration have no gameplay, timers or animation dependency', () => {
  const source=readFileSync('src/presentation/dealerPresentation.ts','utf8');
  expect(source).not.toMatch(/from ['"].*(domain|browser)|Math\.random|crypto|dispatch\s*\(|setTimeout|setInterval|motion/);
  expect(readFileSync('src/main.tsx','utf8')).not.toContain('dealerConfiguration');
  expect(DEALER_PRESENTATION_STATES).toEqual(['IDLE','DEALING','WAITING_PLAYER','REVEALING','DRAWING','SETTLING']);
  expect(characters.map(c=>c.id)).toHaveLength(12);
  // Explicit fixture preferences never imply owner approval or artwork availability.
  const preferred:CharacterId='noble_male';expect(dealerPresentation(preferred,'IDLE').asset).toBeNull();
});
