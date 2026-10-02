import { character, characters, type CharacterId } from '../presentation/characters.js';

export function CharacterPicker({ selected, onSelect }: { selected: CharacterId; onSelect: (id: CharacterId) => void }) {
  const avatar = character(selected);
  return <details className="panel character-picker"><summary>Change Character · {avatar.name}</summary>
    <img src={avatar.portrait} width={60} height={80} alt={`Your character: ${avatar.name}, ${avatar.archetype}`} />
    <label htmlFor="human-character">Your character</label>
    <select id="human-character" value={selected} onChange={event => onSelect(event.target.value as CharacterId)}>
      {characters.map(entry => <option key={entry.id} value={entry.id}>{entry.name} · {entry.archetype}</option>)}
    </select>
    <p>Choose at any time. If a guest has this character, they take your previous character.</p>
  </details>;
}
