import { useSyncExternalStore } from 'react';
import type { BrowserController } from '../browser/controller.js';

export function App({ controller }: { controller: BrowserController }) {
  const view = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  return <main>
    <header><p className="eyebrow">A local Blackjack simulation</p><h1>Casino Blackjack</h1>
      <p>Simulation credits only — no real-money gambling. Credits have no redemption value.</p></header>
    <section className="panel" aria-label="Blackjack table"><h2>Dealer</h2>
      <p>The browser table is being prepared.</p><p>{view.human ? 'Local simulation session ready' : 'Spectator session ready'}</p></section>
  </main>;
}
