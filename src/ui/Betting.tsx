import { useState } from 'react';
import type { BrowserController, BrowserView } from '../browser/controller.js';
import type { WagerQuery } from '../domain/behindGame.js';
import { credits } from './presentation.js';

export function Setup({ controller, view }: { controller: BrowserController; view: BrowserView }) {
  const [localSeat, setLocalSeat] = useState(view.human?.controlledSeat ?? 1);
  const [computers, setComputers] = useState<number[]>(view.configuration.filter((seat) => seat.occupancy === 'COMPUTER').map((seat) => seat.seatNumber));
  const [sittingOut, setSittingOut] = useState(false);
  return <section className="panel" aria-label="Table setup"><h2>Set up your table</h2>
    <label htmlFor="local-seat">Your seat</label><select id="local-seat" value={localSeat} onChange={(event) => setLocalSeat(Number(event.target.value))}>
      <option value={0}>Spectator</option>{view.configuration.map((seat) => <option key={seat.seatNumber} value={seat.seatNumber}>Seat {seat.seatNumber}</option>)}
    </select>
    {localSeat > 0 && <label><input type="checkbox" checked={sittingOut} onChange={(event) => setSittingOut(event.target.checked)} />Sit out this round</label>}
    <fieldset><legend>Computer seats — deterministic Hit/Stand policy</legend>{view.configuration.map((seat) => <label key={seat.seatNumber}>
      <input type="checkbox" disabled={seat.seatNumber === localSeat} checked={computers.includes(seat.seatNumber) && seat.seatNumber !== localSeat}
        onChange={(event) => setComputers(event.target.checked ? [...computers, seat.seatNumber] : computers.filter((n) => n !== seat.seatNumber))} />Computer at Seat {seat.seatNumber}
    </label>)}</fieldset>
    <button onClick={() => {
      if (controller.dispatch({ type: 'CONFIGURE', seats: view.configuration.map((seat) => ({ seatNumber: seat.seatNumber,
        occupancy: seat.seatNumber === localSeat ? 'HUMAN' : computers.includes(seat.seatNumber) ? 'COMPUTER' : 'EMPTY',
        sittingOut: seat.seatNumber === localSeat && sittingOut })) })) controller.dispatch({ type: 'OPEN' });
    }}>Open betting</button>
    <p>Computers use their own simulation credits. Place their MAIN wagers explicitly below.</p>
  </section>;
}

function WagerForm({ controller, label, query, current, min, max }: {
  controller: BrowserController; label: string; query: WagerQuery; current: number; min: number; max: number;
}) {
  const [amount, setAmount] = useState(String(current ? current / 2 : min));
  const command = { ...query, amount: Number(amount) * 2 };
  const reason = controller.queryWager(command);
  return <form onSubmit={(event) => { event.preventDefault(); controller.dispatch(command); }}>
    <label>{label}<input type="number" min={min} max={max} step={1} required value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
    <div className="button-row wager-presets">{[min, min === 10 ? 25 : 5, min === 10 ? 100 : 10].map(value => <button type="button" key={value} aria-label={`${label}: choose ${value} credits`} aria-pressed={amount === String(value)} onClick={() => setAmount(String(value))}>{value}</button>)}</div>
    <p><span className="wager-chip">Current: {credits(current)} credits</span> · Range: {min}–{max}</p>
    <div className="button-row"><button disabled={!!reason}>Set {label}</button>
      <button type="button" disabled={current === 0 || !!controller.queryWager({ ...query, amount: 0 })} onClick={() => controller.dispatch({ ...query, amount: 0 })}>Cancel {label}</button></div>
    {reason && <p className="reason">{reason}</p>}
  </form>;
}
export function Betting({ controller, view }: { controller: BrowserController; view: BrowserView }) {
  const [target, setTarget] = useState(view.interaction.backTargets[0] ?? 0);
  const local = view.human?.controlledSeat;
  return <section className="panel" aria-label="Betting controls"><h2>Place simulated wagers</h2>
    <div className="betting-grid">{view.configuration.filter((seat) => seat.occupancy !== 'EMPTY' && !seat.sittingOut).map((seat) =>
      <WagerForm key={seat.seatNumber} controller={controller} label={`${seat.seatNumber === local ? 'Your' : 'Computer'} MAIN at Seat ${seat.seatNumber}`}
        query={{ type: 'MAIN', seat: seat.seatNumber, amount: 0 }} current={view.mainWagers.find((entry) => entry.seat === seat.seatNumber)?.amount ?? 0} min={10} max={1000} />)}
      {local && view.mainWagers.some((entry) => entry.seat === local) && (['PAIR', 'THREE_CARD'] as const).map((kind) =>
        <WagerForm key={kind} controller={controller} label={kind === 'PAIR' ? 'Pair side bet' : 'THREE_CARD side bet'} query={{ type: 'SIDE', kind, amount: 0 }}
          current={view.sideWagers.find((entry) => entry.type === kind)?.amount ?? 0} min={1} max={100} />)}
    </div>
    <h3>Bet Behind — you are a follower</h3><p>The seat controller plays the cards. You choose only your own wagers and financial decisions.</p>
    <label htmlFor="back-target">Bet Behind target</label><select id="back-target" value={target} onChange={(event) => setTarget(Number(event.target.value))}>
      <option value={0}>Choose a funded computer seat</option>{view.interaction.backTargets.map((seat) => <option key={seat} value={seat}>Seat {seat} · Computer controller</option>)}
    </select>
    {view.interaction.backTargets.includes(target) && <WagerForm key={`back-${target}`} controller={controller} label={`Bet Behind Seat ${target}`}
      query={{ type: 'BACK', seat: target, amount: 0 }} current={view.backWagers.find((entry) => entry.targetSeat === target)?.stakeUnits ?? 0} min={10} max={1000} />}
    {view.backWagers.map((wager) => <p key={wager.targetSeat}>You follow Seat {wager.targetSeat} · Computer controller · Back amount: {credits(wager.stakeUnits)}</p>)}
    <button disabled={view.mainWagers.length === 0} onClick={() => controller.dispatch({ type: 'CLOSE' })}>Close betting and deal</button>
  </section>;
}
