import type { BrowserController, BrowserView } from '../browser/controller.js';
import { explainReason } from '../browser/controller.js';
import { credits, handLabel } from './presentation.js';
import { Cards } from './Table.js';

const labels = { HIT: 'Hit', STAND: 'Stand', DOUBLE: 'Double', SPLIT: 'Split', SURRENDER: 'Surrender' };
export function Actions({ view, controller }: { view: BrowserView; controller: BrowserController }) {
  const local = view.round?.seats.find((seat) => seat.seatNumber === view.human?.controlledSeat);
  const current = local?.hands.find((hand) => hand.handId === view.interaction.handId);
  return <section id="local-actions" className="panel local-actions" aria-label="Primary actions" tabIndex={-1}><h2>Local player</h2>
    <p>{view.human?.controlledSeat ? `You control Seat ${view.human.controlledSeat}` : 'Spectator — no card control'}</p>
    {current && <><h3>{handLabel(current.handId)} · Your current hand</h3><Cards cards={current.cards} /><p>Total: {current.total}</p>
      <div className="button-row">{view.interaction.actions.map((entry) => <button key={entry.action} disabled={!entry.enabled}
        aria-describedby={!entry.enabled ? `reason-${entry.action}` : undefined}
        onClick={() => controller.dispatch({ type: 'ACT', action: entry.action, handId: current.handId })}>{labels[entry.action]}</button>)}</div>
      {(view.interaction.actions.some((entry) => entry.enabled && (entry.action === 'DOUBLE' || entry.action === 'SPLIT'))) && <p>Matching additional wager: {credits(current.stakeUnits)} credits</p>}
      {view.interaction.actions.filter((entry) => !entry.enabled).map((entry) => <p key={entry.action} id={`reason-${entry.action}`} className="reason">
        {labels[entry.action]} unavailable — {explainReason(entry.reason)}</p>)}
      <p>Surrender returns half your original wager and ends this hand.</p>
    </>}
    {!current && view.round && <p>No local gameplay actions available.</p>}
    {view.interaction.canAdvance && <button onClick={() => controller.dispatch({ type: 'ADVANCE' })}>Continue table</button>}
    <p className="shoe-status">{view.shoeMessage}</p>
  </section>;
}
