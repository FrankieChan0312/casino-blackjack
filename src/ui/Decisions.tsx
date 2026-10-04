import type { BrowserController, BrowserView } from '../browser/controller.js';
import { credits, handLabel, resultLabel } from './presentation.js';

export function Decisions({ view, controller }: { view: BrowserView; controller: BrowserController }) {
  const ace = view.interaction.insurance;
  const follow = view.follow;
  return <>
    {ace && <section tabIndex={-1} className="panel decision" data-control-surface={view.playerMode ? 'insurance' : undefined} aria-label="Insurance decision"
      aria-describedby={view.playerMode ? 'player-scene-status insurance-context' : undefined}>
      {!view.playerMode && <h2>Insurance / Even Money</h2>}
      {view.playerMode ? <p className="insurance-context" id="insurance-context"><span>Dealer shows Ace.</span>{' '}
        <span>{ace.role === 'BACK' ? 'Bet Behind' : 'Your MAIN'} · Seat {ace.targetSeat} · Insurance amount: {credits(ace.amount)} credits</span></p>
        : <><p id="insurance-context">Dealer shows Ace. Choose before the dealer checks for Blackjack.</p>
          <p>{ace.role === 'BACK' ? 'Bet Behind' : 'Your MAIN'} · Seat {ace.targetSeat} · Insurance amount: {credits(ace.amount)} credits</p></>}
      <div className="button-row"><button disabled={!ace.affordable} aria-describedby={!ace.affordable ? 'insurance-unavailable' : 'insurance-context'} onClick={() => controller.dispatch({ type: 'ACE', choice: 'INSURANCE' })}>Buy Insurance</button>
        <button onClick={() => controller.dispatch({ type: 'ACE', choice: 'DECLINE' })}>Decline</button>
        {ace.evenMoney && <button onClick={() => controller.dispatch({ type: 'ACE', choice: 'EVEN_MONEY' })}>Take Even Money</button>}</div>
      {!ace.affordable && <p className="reason" id="insurance-unavailable">Insurance unavailable — not enough available credits.</p>}
      {view.playerMode ? <details className="decision-explanation"><summary>Insurance and Even Money explained</summary>
        <span className="insurance-timing">Dealer shows Ace. Choose before the dealer checks for Blackjack.</span>
        <p>Insurance is a separate funded wager. Eligible Even Money locks a 1:1 profit on the original stake without another wager.</p>
      </details> : <p>Insurance is a separate funded wager. Eligible Even Money locks a 1:1 profit on the original stake without another wager.</p>}
    </section>}
    {follow && <section tabIndex={-1} className="panel decision" data-control-surface={view.playerMode ? 'follow' : undefined} aria-label="Bet Behind follow decision"><h2>{follow.kind === 'DOUBLE' ? 'Double' : 'Split / Re-split'} follow decision</h2>
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
  if (view.playerMode) return <PlayerResults view={view} controller={controller} />;
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
          <strong className={`result-badge ${entry.outcome === 'CHARLIE' ? 'charlie' : ''}`} data-result={entry.outcome}>{resultLabel(entry.outcome)}</strong><p>Stake: {credits(entry.stake)} · Returned: {credits(entry.returned)} · Net: {credits(entry.returned - entry.stake)}</p>
          <p>{entry.status === 'PENDING' ? 'Pending return' : entry.status === 'REFUNDED' ? 'Refunded' : 'Settled'}</p>
        </article>)}</section>)}
    </section>}
    {view.interaction.nextRound && <section className="panel" aria-label="Next round"><h2>Ready for another round</h2>
      <p>The existing shoe continues unless its cut card, remaining cards or integrity status requires replacement at the next deal.</p>
      <button onClick={() => controller.dispatch({ type: 'NEXT' })}>Next round</button></section>}
  </>;
}

function PlayerResults({ view, controller }: { view: BrowserView; controller: BrowserController }) {
  if (!view.interaction.nextRound) return null;
  const records = [...view.ownResults, ...view.backResults];
  const stake = records.reduce((sum, r) => sum + r.stake, 0);
  const returned = records.reduce((sum, r) => sum + r.returned, 0);
  const affordable = view.lastBet > 0 && view.lastBet <= (view.human?.available ?? 0);
  return <section id="player-result" tabIndex={-1} className="panel player-result" data-control-surface="result" aria-label="Your round result" aria-describedby="player-scene-status round-net">
    {view.phase === 'VOID' && <h2>Round interrupted — stakes refunded</h2>}
    <p className="round-net" id="round-net">{view.phase === 'VOID' ? 'Refunded' : 'Net result'}: {credits(view.phase === 'VOID' ? returned : returned - stake)} credits</p>
    <div className="button-row"><button className="primary" onClick={() => controller.dispatch({ type: 'NEXT' })}>Deal Again</button>
      <button disabled={!affordable} onClick={() => controller.dispatch({ type: 'REPEAT' })}>Repeat Bet · {credits(view.lastBet)} credits</button></div>
    {!affordable && <p className="reason">Repeat Bet unavailable: not enough credits for your original main wager.</p>}
    <details className="round-explanation"><summary>Wager result details</summary>
      <p>Deal Again opens betting. Repeat Bet deals your original main wager only. Balances and the existing shoe continue.</p>
      <p>Each wager settles independently.</p>
      {records.map((r, i) => <article key={i} className="result"><p>{r.type}{'seat' in r && ` · Seat ${r.seat}`}{r.handId && ` · ${handLabel(r.handId)}`}</p>
        <strong data-result={r.outcome}>{resultLabel(r.outcome)}</strong><p>Stake: {credits(r.stake)} · Returned: {credits(r.returned)} · Net: {credits(r.returned - r.stake)}</p><p>{r.status === 'REFUNDED' ? 'Refunded' : 'Settled'}</p></article>)}
    </details>
  </section>;
}
