import { expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { characters, createCharacterLineup, changeHumanCharacter, presentationChooser } from '../../src/presentation/characters.js';

it('[PA1-C01] manifest exactly matches the twelve canonical independent identities and verified production receipts', () => {
  expect(characters.map(c => [c.id, c.name, c.archetype])).toEqual([
    ['elf_male','Caelan','Male Elf'], ['elf_female','Elaria','Female Elf'],
    ['knight_male','Roland','Male Human Knight'], ['knight_female','Seraphine','Female Human Knight'],
    ['mage_male','Alaric','Male Mage'], ['mage_female','Nyra','Female Mage'],
    ['noble_male','Lucien','Male Noble'], ['noble_female','Celestine','Female Noble'],
    ['halforc_male','Garruk','Male Half-Orc Warrior'], ['halforc_female','Vesha','Female Half-Orc Warrior'],
    ['dwarf_male','Borin','Male Dwarf'], ['dwarf_female','Brynja','Female Dwarf'],
  ]);
  const receipt = JSON.parse(readFileSync('art/character-production.json','utf8'));
  for (const c of characters) {
    expect(c.portrait).toBe(`/characters/${c.id}.png`); expect([c.width,c.height]).toEqual([240,320]);
    const bytes = readFileSync(`public${c.portrait}`);
    expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.files.find((f: {id: string}) => f.id === c.id).outputSha256);
  }
});
it('[PA1-C02] deterministic chooser assigns distinct guests without replacement and excludes default Roland', () => {
  const bounds: number[] = [];
  expect(createCharacterLineup([1,3,6], n => { bounds.push(n); return 0; })).toEqual({
    human: 'knight_male', guests: {1:'elf_male',3:'elf_female',6:'knight_female'},
  });
  expect(bounds).toEqual([11,10,9]);
});
it('[PA1-C03] every human identity supports six unique guests with deterministic first and last choices', () => {
  for (const human of characters) for (const choose of [() => 0, (n: number) => n - 1]) {
    const lineup = createCharacterLineup([1,2,3,5,6,7],choose,human.id);
    expect(new Set([lineup.human,...Object.values(lineup.guests)]).size).toBe(7);
    expect(Object.values(lineup.guests)).not.toContain(human.id);
  }
});
it('[PA1-C04] occupied selection swaps only the collided guest; unoccupied selection preserves guests and immutable inputs', () => {
  const before = createCharacterLineup([1,3,6],() => 0);
  expect(changeHumanCharacter(before,'elf_female')).toEqual({human:'elf_female',guests:{1:'elf_male',3:'knight_male',6:'knight_female'}});
  expect(changeHumanCharacter(before,'noble_female').guests).toEqual(before.guests);
  expect(changeHumanCharacter(before,'knight_male')).toBe(before);
  expect(before.human).toBe('knight_male'); expect(before.guests[3]).toBe('elf_female');
  expect(Object.isFrozen(before.guests)).toBe(true);
});
it('[PA1-C05] invalid chooser results and duplicate or invalid seat inputs fail explicitly', () => {
  for (const result of [-1,.5,11,NaN]) expect(() => createCharacterLineup([1],() => result)).toThrow('Invalid presentation choice');
  for (const seats of [[1,1],[0],[8],[1.5],[1,2,3,4,5,6,7]]) expect(() => createCharacterLineup(seats,() => 0)).toThrow('Invalid presentation seats');
});
it('[PA1-C06] production assignment uses separate browser crypto entropy and never Math.random', () => {
  const random = vi.spyOn(Math,'random').mockImplementation(() => { throw new Error('Gameplay randomness touched'); });
  const entropy = vi.spyOn(crypto,'getRandomValues').mockImplementation(array => { (array as Uint32Array)[0] = 99; return array; });
  try { expect(presentationChooser(11)).toBe(0); expect(entropy).toHaveBeenCalledTimes(1); expect(random).not.toHaveBeenCalled(); }
  finally { entropy.mockRestore(); random.mockRestore(); }
});
