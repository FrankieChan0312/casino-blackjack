import { character, characters, type CharacterId } from '../presentation/characters.js';

export function CharacterPicker({ selected, onSelect, dealerCharacterId }: {
  selected: CharacterId; onSelect: (id: CharacterId) => void; dealerCharacterId?: CharacterId | null;
}) {
  const avatar = character(selected);
  return <details className="panel character-picker"><summary>Change Character · {avatar.name}</summary>
    <img src={avatar.portrait} width={60} height={80} alt={`Your character: ${avatar.name}, ${avatar.archetype}`} />
    <label htmlFor="human-character">Your character</label>
    <select id="human-character" value={selected} onChange={event => onSelect(event.target.value as CharacterId)}>
      {characters.map(entry => <option key={entry.id} value={entry.id} disabled={entry.id === dealerCharacterId}>
        {entry.name} · {entry.archetype}{entry.id === dealerCharacterId && ' · Dealer (reserved for this table)'}</option>)}
    </select>
    <p>Choose at any time. If a guest has this character, they take your previous character.</p>
    {dealerCharacterId && <p>{character(dealerCharacterId).name} is reserved for the Dealer at this table.</p>}
  </details>;
}
