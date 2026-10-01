import { useState } from 'react';
import type { BrowserController, BrowserView } from '../browser/controller.js';
import { CLASSIC, CHARLIE, CLASSIC_V1_2, CHARLIE_V1_2, getProfile, type ProfileId } from '../domain/profile.js';
import { credits, resultLabel } from './presentation.js';

const seatOccupancyLabels: Readonly<Record<string, string>> = {
  HUMAN: 'Human', COMPUTER: 'Computer', EMPTY: 'Empty', SITTING_OUT: 'Sitting Out',
};

export function DemoTools({ controller, view }: { controller: BrowserController; view: BrowserView }) {
  const [profile, setProfile] = useState<ProfileId>(view.profileId);
  const [seed, setSeed] = useState('');
  const [showPackage, setShowPackage] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const label = getProfile(view.profileId).charlie ? 'Five-Card Charlie Demo' : 'Classic Blackjack';
  const packageText = showPackage && view.replayAvailable ? JSON.stringify(controller.exportReplay(), null, 2) : '';
  return <section className="panel demo-tools" aria-label="Demo and audit tools">
    <h2>Demo and audit tools</h2><p>Profile: {label} · {view.seeded ? 'Reproducible seeded demo' : 'Normal random demo'}</p>
    <p>{view.playerMode ? 'Player Mode: guests and dealer progress automatically.' : 'Manual demo: configure and fund seats, then Continue table explicitly.'}</p>
    <button disabled={!view.canStartDemo} onClick={() => controller.dispatch({ type: 'MODE', playerMode: !view.playerMode })}>
      {view.playerMode ? 'Open manual demo (resets credits)' : 'Return to Player Mode (resets credits)'}</button>
    <details><summary>Advanced demo settings</summary>
      {(view.canStartDemo || getProfile(view.profileId).charlie) && <p>Five-Card Charlie is a custom demonstration profile. A legal Hit that brings the hand to exactly five cards with a total of 21 or less wins 1:1.</p>}
      <label htmlFor="demo-profile">New session profile</label><select id="demo-profile" disabled={!view.canStartDemo} value={profile}
        onChange={e => setProfile(e.target.value as ProfileId)}>
        {view.canStartDemo ? <><option value={CLASSIC_V1_2}>Classic Blackjack (v1.2 · Re-split Aces)</option><option value={CHARLIE_V1_2}>Five-Card Charlie Demo (v1.2 · Re-split Aces)</option>
          <option value={CLASSIC}>Classic Blackjack</option><option value={CHARLIE}>Five-Card Charlie Demo</option></>
          : <option value={view.profileId}>{label}</option>}
      </select>
      {view.canStartDemo && <form onSubmit={e => { e.preventDefault();
        if (controller.startDemo(profile, seed === '' ? undefined : Number(seed))) { setSeed(''); setShowPackage(false); setCopyStatus(''); }
      }}>
        <label htmlFor="demo-seed">Optional reproducible demo seed</label>
        <input id="demo-seed" type="number" min={0} max={4294967295} step={1} value={seed} onChange={e => setSeed(e.target.value)} />
        <p>Unsigned 32-bit integer for reproducible portfolio demonstrations. Blank uses normal randomness.</p>
        <button>Start new demo session</button><p>Resets all simulation credits to 1000. This is a session reset, not profit.</p>
      </form>}
      {!view.canStartDemo && <p>Profile and seed are locked until final settlement. Start a new session to change them.</p>}
    </details>
    {view.replayAvailable ? <div className="replay-tools">
      <p>Completed-session replay is available. Export includes deterministic seed information.</p>
      <div className="button-row"><button onClick={() => setShowPackage(!showPackage)}>{showPackage ? 'Hide replay package' : 'View replay package'}</button>
        <button onClick={() => { controller.replayCompleted(); }}>Replay completed session</button></div>
      {packageText && <><label htmlFor="replay-json">Completed replay JSON</label><textarea id="replay-json" readOnly value={packageText} rows={10} />
        <button onClick={async () => { try { await navigator.clipboard.writeText(packageText); setCopyStatus('Replay JSON copied.'); }
          catch { setCopyStatus('Select the replay JSON and copy with your keyboard.'); } }}>Copy replay JSON</button>
        <p role="status">{copyStatus}</p></>}
    </div> : <p>Full replay export requires a finalized seeded session.</p>}
    {view.replayResult && <section aria-label="Replay result" className="replay-result"><h3>Replay mode · completed session</h3>
      <p>Original table results are preserved. Fingerprint: {view.replayResult.digest}</p>
      {view.replayResult.outcomes.map((o, n) => <div key={n}><p>{o.publicState.round?.roundId}</p>
        {[...o.resultRecords, ...o.backRecords].map(r => <p key={r.wagerId}>{resultLabel(r.outcome)} · Stake {credits(r.stakeUnits)} · Returned {credits(r.grossReturnUnits)}</p>)}
      </div>)}
    </section>}
    <details><summary>Public audit history ({view.audit.length} events)</summary>
      <p>Ordered public actions and results. Sequence determines order; times use UTC.</p>
      <ol className="audit-list">{view.audit.map(e => <li key={e.sequence} value={e.sequence}>
        <span>#{e.sequence} {e.actorId} · {e.type} · {e.status}</span>
        <time dateTime={e.timestamp}>{e.timestamp}</time>
        {e.roundId && <span>{e.roundId}</span>}
        {e.seat !== null && <span>Seat {e.seat}</span>}
        {e.handId && <span>{e.handId}</span>}
        {e.amountUnits !== null && <span>Stake / amount: {credits(e.amountUnits)}</span>}
        {e.outcome && <span>{e.type === 'SEAT_CONFIGURED'
          ? (seatOccupancyLabels[e.outcome] ?? e.outcome)
          : resultLabel(e.outcome)}</span>}
        {e.returnedUnits !== null && <span>Returned {credits(e.returnedUnits)}</span>}
        {e.reason && <span>{e.status === 'REJECTED' ? 'Request unavailable' : 'Round interrupted'}</span>}
      </li>)}</ol>
    </details>
  </section>;
}
