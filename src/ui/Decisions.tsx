import type { BrowserController, BrowserView } from '../browser/controller.js';
import { credits, handLabel, resultLabel } from './presentation.js';

export function Decisions({ view, controller }: { view: BrowserView; controller: BrowserController }) {
  const ace = view.interaction.insurance;
  const follow = view.follow;
  return <>
    {ace && <section className="panel decision" aria-label="Insurance decision"><h2>Insurance / Even Money</h2>
      <p>Dealer shows Ace. Choose before the dealer checks for Blackjack.</p>
      <p>{ace.role === 'BACK' ? 'Bet Behind' : 'Your MAIN'} · Seat {ace.targetSeat} · Insurance amount: {credits(ace.amount)} credits</p>
      <div className="button-row"><button disabled={!ace.affordable} onClick={() => controller.dispatch({ type: 'ACE', choice: 'INSURANCE' })}>Buy Insurance</button>
        <button onClick={() => controller.dispatch({ type: 'ACE', choice: 'DECLINE' })}>Decline</button>
        {ace.evenMoney && <button onClick={() => controller.dispatch({ type: 'ACE', choice: 'EVEN_MONEY' })}>Take Even Money</button>}</div>
      {!ace.affordable && <p className="reason">Insurance unavailable — not enough available credits.</p>}
      <p>Insurance is a separate funded wager. Eligible Even Money locks a 1:1 profit on the original stake without another wager.</p>
    </section>}
    {follow && <section className="panel decision" aria-label="Bet Behind follow decision"><h2>{follow.kind === 'DOUBLE' ? 'Double' : 'Split / Re-split'} follow decision</h2>
      <p>Seat {follow.targetSeat} · Computer controller · {handLabel(follow.handId)}</p>
      <p>Current follower exposure: {credits(view.interaction.followAmount)} credits</p>
      <p>Matching additional amount: {credits(view.interaction.followAmount)} credits</p>
      <p>{follow.kind === 'SPLIT' ? 'NO ADD: existing exposure follows the first ordered child only. The second child has no back stake.'
        : 'NO ADD: keep your original exposure on the doubled hand; no extra stake is added.'}</p>
      <p>The controller has already chosen the card action. You choose only whether to fund your own additional stake.</p>
      <div className="button-row"><button disabled={!view.interaction.followAffordable} onClick={() => controller.dispatch({ type: 'FOLLOW', choice: 'ADD' })}>ADD</button>
        <button onClick={() => controller.dispatch({ type: 'FOLLOW', choice: 'NO_ADD' })}>NO ADD</button></div>
      {!view.interaction.followAffordable && <p className="reason">ADD unavailable — not enough available credits.</p>}
    </section>}
    {view.trackedBack.length > 0 && <section className="panel" aria-label="Your Bet Behind exposure"><h2>Your Bet Behind exposure</h2>
      <p>You are a follower; the computer controller chooses the card actions.</p>
      {view.trackedBack.map((entry) => <p key={entry.handId}>Seat {entry.seat} · {handLabel(entry.handId)} · Back stake: {credits(entry.amount)}</p>)}
      {view.lastFollow?.kind === 'SPLIT' && view.lastFollow.choice === 'NO_ADD' && <p>NO ADD applied: existing exposure follows the first ordered child only.</p>}
    </section>}
  </>;
}

export function Results({ view, controller }: { view: BrowserView; controller: BrowserController }) {
  const groups = [
    { name: 'Main hand results', records: view.ownResults.filter((entry) => entry.type === 'MAIN') },
    { name: 'Side-bet results', records: view.ownResults.filter((entry) => entry.type === 'PAIR' || entry.type === 'THREE_CARD') },
    { name: 'Insurance results', records: view.ownResults.filter((entry) => entry.type === 'INSURANCE') },
    { name: 'Bet Behind results', records: view.backResults },
  ];
  return <>
    {view.phase === 'VOID' && <section className="panel interruption" role="alert"><h2>Round interrupted</h2>
      <p>The game could not continue safely. Affected simulated stakes were refunded.</p><p>VOID / Integrity Error — no gameplay winner was assigned.</p></section>}
    {groups.some((group) => group.records.length) && <section className="panel" aria-label="Wager results"><h2>Your wager results</h2>
      <p>Each wager settles independently. Pending returns are unavailable until final table settlement.</p>
      {groups.filter((group) => group.records.length).map((group) => <section key={group.name} aria-label={group.name}><h3>{group.name}</h3>
        {group.records.map((entry, index) => <article key={index} className="result">
          <p>{entry.type === 'BACK_INSURANCE' ? 'Bet Behind Insurance' : entry.type}{'seat' in entry && ` · Seat ${entry.seat}`}{entry.handId && ` · ${handLabel(entry.handId)}`}</p>
          <strong>{resultLabel(entry.outcome)}</strong><p>Stake: {credits(entry.stake)} · Returned: {credits(entry.returned)} · Net: {credits(entry.returned - entry.stake)}</p>
          <p>{entry.status === 'PENDING' ? 'Pending return' : entry.status === 'REFUNDED' ? 'Refunded' : 'Settled'}</p>
        </article>)}</section>)}
    </section>}
    {view.interaction.nextRound && <section className="panel" aria-label="Next round"><h2>Ready for another round</h2>
      <p>The existing shoe continues unless its cut card, remaining cards or integrity status requires replacement at the next deal.</p>
      <button onClick={() => controller.dispatch({ type: 'NEXT' })}>Next round</button></section>}
  </>;
}
