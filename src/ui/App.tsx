import { useEffect, useState, useSyncExternalStore } from 'react';
import type { BrowserController, BrowserView } from '../browser/controller.js';
import { Table } from './Table.js';
import { credits, handLabel, roundStatus } from './presentation.js';
import { Setup, Betting, PlayerBetting } from './Betting.js';
import { Actions } from './Actions.js';
import { Decisions, Results } from './Decisions.js';
import { DemoTools } from './DemoTools.js';
import { createCharacterLineup, changeHumanCharacter, type PresentationChooser } from '../presentation/characters.js';
import { CharacterPicker } from './CharacterPicker.js';

export function App({ controller, chooseCharacter }: { controller: BrowserController; chooseCharacter?: PresentationChooser }) {
  const view = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  if (view.playerMode) return <PlayerExperience view={view} controller={controller} chooseCharacter={chooseCharacter} />;
  return <main className={view.playerMode ? 'player-mode' : 'manual-mode'}>
    <a className="skip-link" href="#local-actions">Skip to your hand and actions</a>
    <header><p className="eyebrow">Seven seats · One dealer · Your table</p><h1>Casino Blackjack</h1>
      <p>Simulation credits only — no real-money gambling. Credits have no redemption value.</p></header>
    <p className="round-status" role="status" aria-live="polite">{roundStatus(view)}</p>
    {view.feedback && <p role="alert" className="feedback">{view.feedback}</p>}
    <div className="game-stage">
      <Actions view={view} controller={controller} />
      <Table view={view} />
    </div>
    <Decisions view={view} controller={controller} />
    <section className="panel credits" aria-label="Your credits"><h2>Simulation credits</h2>
      <dl><div><dt>Available</dt><dd>{credits(view.human?.available ?? 0)}</dd></div>
        <div><dt>Reserved / current exposure</dt><dd>{credits(view.human?.reserved ?? 0)}</dd></div>
        <div><dt>Pending return</dt><dd>{credits(view.pending)}</dd></div></dl></section>
    {!view.playerMode && view.interaction.configuring && <Setup controller={controller} view={view} />}
    {view.interaction.betting && <Betting controller={controller} view={view} />}
    <Results view={view} controller={controller} />
    <DemoTools key={view.profileId + String(view.seeded)} view={view} controller={controller} />
  </main>;
}

function PlayerExperience({ view, controller, chooseCharacter }: { view: BrowserView; controller: BrowserController; chooseCharacter?: PresentationChooser }) {
  const [presentation, setPresentation] = useState(() => ({ session: view.presentationSession,
    lineup: createCharacterLineup([1,3,6],chooseCharacter) }));
  if (presentation.session !== view.presentationSession) setPresentation({ session: view.presentationSession,
    lineup: createCharacterLineup([1,3,6],chooseCharacter) });
  const lineup = presentation.lineup;
  useEffect(() => {
    if (view.phase === 'OPEN' && !view.lastBet) return;
    const target = document.querySelector<HTMLElement>(view.phase === 'OPEN' ? '#player-wager' : view.interaction.nextRound ? '#player-result' : view.interaction.insurance || view.follow ? '.decision' : '#player-hand');
    target?.focus({ preventScroll: true }); target?.scrollIntoView({ block: 'nearest' });
  }, [view.phase, view.interaction.handId, view.interaction.insurance?.targetSeat, view.follow?.handId, view.interaction.nextRound]);
  return <main className="player-mode">
    <a className="skip-link" href="#player-decisions">Skip to your hand and actions</a>
    <section className="game-scene" aria-label="Blackjack game scene">
    <header className="casino-header"><div><p className="eyebrow">An evening at the table</p><h1>Casino Blackjack</h1></div>
      <p>Simulation credits only — no real-money gambling.<br />Credits have no redemption value.</p></header>
    <div className="table-scene">
    <Table view={view} lineup={lineup} />
    <div id="player-decisions" tabIndex={-1} className="player-dock" role="region" aria-label="Your gameplay controls" aria-describedby="player-scene-status" data-scene-zone="controls">
      <div className="control-context"><p id="player-scene-status" className="round-status" role="status" aria-live="polite">{roundStatus(view)}</p>
        {view.interaction.handId && view.interaction.actions.some(a => a.enabled) && <span id="player-action-hand">· {handLabel(view.interaction.handId)}</span>}</div>
      {view.feedback && <p role="alert" className="feedback">{view.feedback}</p>}
      {view.interaction.actions.some(a => a.enabled) && <Actions view={view} controller={controller} />}
      <Decisions view={view} controller={controller} />
      <section className="credits panel" aria-label="Your credits"><h2>Your simulation credits</h2><dl>
        <div><dt>Available</dt><dd>{credits(view.human?.available ?? 0)}</dd></div>
        <div><dt>Reserved / current exposure</dt><dd>{credits(view.human?.reserved ?? 0)}</dd></div>
        <div><dt>Pending return</dt><dd>{credits(view.pending)}</dd></div>
      </dl></section>
      {view.interaction.betting && <PlayerBetting controller={controller} view={view} />}
      <Results view={view} controller={controller} />
    </div>
    </div>
    <p className="session-note">{view.shoeMessage} · Computer guests play with their own simulation credits.</p>
    </section>
    <aside className="scene-support" aria-label="Table preferences and demo tools">
    <CharacterPicker selected={lineup.human} onSelect={id => setPresentation(current => ({ ...current,
      lineup: changeHumanCharacter(current.lineup,id) }))} />
    <details className="panel developer-tools"><summary>Developer / demo tools</summary>
      <DemoTools key={view.profileId + String(view.seeded)} view={view} controller={controller} />
    </details>
    </aside>
  </main>;
}
