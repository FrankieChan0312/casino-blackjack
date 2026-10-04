import { useState } from 'react';
import type { BrowserController, BrowserView } from '../browser/controller.js';
import { isPlayerCount } from '../browser/playerConfiguration.js';

export function PlayerSetup({ view, controller }: { view: BrowserView; controller: BrowserController }) {
  const [count, setCount] = useState(view.playerCount);
  return <section className="player-setup" aria-label="Start your table">
    <h2>Your evening at the table</h2>
    <label htmlFor="total-players">Total players</label>
    <select id="total-players" value={count} onChange={event => {
      const value = Number(event.target.value); if (isPlayerCount(value)) setCount(value);
    }}>
      {[1, 2, 3, 4, 5, 6, 7].map(value => <option key={value} value={value}>{value}</option>)}
    </select>
    <p>1 human · {count - 1} computer {count === 2 ? 'guest' : 'guests'} · You play Seat 4</p>
    <button className="primary" onClick={() => controller.dispatch({ type: 'START', count })}>Start table</button>
    <p>Starting balance: 1000 simulation credits.</p>
  </section>;
}
