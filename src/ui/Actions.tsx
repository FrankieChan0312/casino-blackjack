import type { BrowserController, BrowserView } from '../browser/controller.js';
import { explainReason } from '../browser/controller.js';
import { credits, handLabel } from './presentation.js';
import { Cards } from './Table.js';

const labels = { HIT: 'Hit', STAND: 'Stand', DOUBLE: 'Double', SPLIT: 'Split', SURRENDER: 'Surrender' };
export function Actions({ view, controller }: { view: BrowserView; controller: BrowserController }) {
  const local = view.round?.seats.find((seat) => seat.seatNumber === view.human?.controlledSeat);
  const current = local?.hands.find((hand) => hand.handId === view.interaction.handId);
  const rsa = view.interaction.actions.some(entry => entry.action === 'HIT' && entry.reason === 'HIT_NOT_ALLOWED')
    && view.interaction.actions.some(entry => entry.action === 'SPLIT' && entry.enabled);
  return <section id="local-actions" className="panel local-actions" aria-label="Primary actions" tabIndex={-1}><h2>Local player</h2>
    <p>{view.human?.controlledSeat ? `You control Seat ${view.human.controlledSeat}` : 'Spectator — no card control'}</p>
    {current && <><h3>{handLabel(current.handId)} · Your current hand <span className="turn-marker">ACTIVE</span></h3><Cards cards={current.cards} /><p className="local-total">Total: {current.total} <span className="wager-chip">Wager: {credits(current.stakeUnits)}</span></p>
      {rsa && <p id="rsa-choice">Re-split Aces: choose Split with a matching wager, or Stand to keep Soft 12. This hand cannot Hit, Double or Surrender.</p>}
      <div className="button-row action-bar">{view.interaction.actions.map((entry) => <button className={`action-${entry.action.toLowerCase()}`} key={entry.action} disabled={!entry.enabled}
        aria-describedby={!entry.enabled ? `reason-${entry.action}` : rsa ? 'rsa-choice' : undefined}
        onClick={() => controller.dispatch({ type: 'ACT', action: entry.action, handId: current.handId })}>{labels[entry.action]}</button>)}</div>
      <details className="action-guidance"><summary>Action guidance{view.interaction.actions.some(entry => !entry.enabled) && ' · Unavailable actions explained'}</summary>
      {(view.interaction.actions.some((entry) => entry.enabled && (entry.action === 'DOUBLE' || entry.action === 'SPLIT'))) && <p>Matching additional wager: {credits(current.stakeUnits)} credits</p>}
      {view.interaction.actions.filter((entry) => !entry.enabled).map((entry) => <p key={entry.action} id={`reason-${entry.action}`} className="reason">
        {labels[entry.action]} unavailable — {explainReason(entry.reason)}</p>)}
      <p>Surrender returns half your original wager and ends this hand.</p>
      </details>
    </>}
    {!current && view.round && <p>No local gameplay actions available.</p>}
    {!view.playerMode && view.interaction.canAdvance && <button onClick={() => controller.dispatch({ type: 'ADVANCE' })}>Continue table</button>}
    <p className="shoe-status">{view.shoeMessage}</p>
  </section>;
}
