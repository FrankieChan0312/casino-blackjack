// Presentation identities never enter domain commands, replay or audit outcomes.
const roster = [
  ['elf_male', 'Caelan', 'Male Elf'],
  ['elf_female', 'Elaria', 'Female Elf'],
  ['knight_male', 'Roland', 'Male Human Knight'],
  ['knight_female', 'Seraphine', 'Female Human Knight'],
  ['mage_male', 'Alaric', 'Male Mage'],
  ['mage_female', 'Nyra', 'Female Mage'],
  ['noble_male', 'Lucien', 'Male Noble'],
  ['noble_female', 'Celestine', 'Female Noble'],
  ['halforc_male', 'Garruk', 'Male Half-Orc Warrior'],
  ['halforc_female', 'Vesha', 'Female Half-Orc Warrior'],
  ['dwarf_male', 'Borin', 'Male Dwarf'],
  ['dwarf_female', 'Brynja', 'Female Dwarf'],
] as const;
export type CharacterId = typeof roster[number][0];
export const characters = Object.freeze(roster.map(([id, name, archetype]) => Object.freeze({
  id, name, archetype, portrait: `/characters/${id}.png`, width: 240, height: 320,
})));
export function character(id: CharacterId) { return characters.find(entry => entry.id === id)!; }
export type PresentationChooser = (count: number) => number;
// Browser entropy is separate from gameplay randomness.
export const presentationChooser: PresentationChooser = count => {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] % count;
};
export type CharacterLineup = Readonly<{ human: CharacterId; guests: Readonly<Record<number, CharacterId>> }>;
export function createCharacterLineup(guestSeats: readonly number[], choose: PresentationChooser = presentationChooser,
  human: CharacterId = 'knight_male'): CharacterLineup {
  if (guestSeats.length > 6 || new Set(guestSeats).size !== guestSeats.length ||
    guestSeats.some(seat => !Number.isInteger(seat) || seat < 1 || seat > 7)) throw new Error('Invalid presentation seats');
  const available = characters.filter(entry => entry.id !== human).map(entry => entry.id);
  const guests: Record<number, CharacterId> = {};
  for (const seat of guestSeats) {
    const index = choose(available.length);
    if (!Number.isInteger(index) || index < 0 || index >= available.length) throw new Error('Invalid presentation choice');
    guests[seat] = available.splice(index, 1)[0];
  }
  return Object.freeze({ human, guests: Object.freeze(guests) });
}
export function changeHumanCharacter(lineup: CharacterLineup, selected: CharacterId): CharacterLineup {
  if (selected === lineup.human) return lineup;
  const guests = { ...lineup.guests };
  for (const seat of Object.keys(guests).map(Number)) if (guests[seat] === selected) guests[seat] = lineup.human;
  return Object.freeze({ human: selected, guests: Object.freeze(guests) });
}
