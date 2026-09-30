import { useSyncExternalStore } from 'react';
import type { BrowserController } from '../browser/controller.js';
import { Table } from './Table.js';
import { credits, roundStatus } from './presentation.js';
import { Setup, Betting } from './Betting.js';
import { Actions } from './Actions.js';

export function App({ controller }: { controller: BrowserController }) {
  const view = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  return <main>
    <header><p className="eyebrow">A local Blackjack simulation</p><h1>Casino Blackjack</h1>
      <p>Simulation credits only — no real-money gambling. Credits have no redemption value.</p></header>
    <p className="round-status" role="status" aria-live="polite">{roundStatus(view)}</p>
    {view.feedback && <p role="alert" className="feedback">{view.feedback}</p>}
    {view.interaction.configuring && <Setup controller={controller} view={view} />}
    {view.interaction.betting && <Betting controller={controller} view={view} />}
    <section className="panel credits" aria-label="Your credits"><h2>Your simulated credits</h2>
      <dl><div><dt>Available</dt><dd>{credits(view.human?.available ?? 0)}</dd></div>
        <div><dt>Reserved / current exposure</dt><dd>{credits(view.human?.reserved ?? 0)}</dd></div>
        <div><dt>Pending return</dt><dd>{credits(view.pending)}</dd></div></dl></section>
    <Table view={view} />
    <Actions view={view} controller={controller} />
  </main>;
}
