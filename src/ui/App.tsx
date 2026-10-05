import { useEffect, useState, useSyncExternalStore } from 'react';
import type { BrowserController, BrowserView } from '../browser/controller.js';
import { Table } from './Table.js';
import { credits, handLabel, roundStatus } from './presentation.js';
import { Setup, Betting, PlayerBetting } from './Betting.js';
import { Actions } from './Actions.js';
import { Decisions, Results } from './Decisions.js';
import { DemoTools } from './DemoTools.js';
import { type PresentationChooser } from '../presentation/characters.js';
import { createDealerTableIdentity, changeDealerTableHuman, dealerPresentation, dealerPresentationState,
  type DealerConfiguration } from '../presentation/dealerPresentation.js';
import { CharacterPicker } from './CharacterPicker.js';
import { PlayerSetup } from './PlayerSetup.js';
import { PresentationProvider, useDealerPresentationState, useInitialDeal, usePlayerActions, usePresentationRuntime } from './PresentationProvider.js';

export function App({ controller, chooseCharacter, dealerConfiguration }: {
  controller: BrowserController; chooseCharacter?: PresentationChooser; dealerConfiguration?: DealerConfiguration;
}) {
  return <PresentationProvider feed={controller.presentation}><Experience controller={controller} chooseCharacter={chooseCharacter} dealerConfiguration={dealerConfiguration} /></PresentationProvider>;
}
function Experience({ controller, chooseCharacter, dealerConfiguration }: {
  controller: BrowserController; chooseCharacter?: PresentationChooser; dealerConfiguration?: DealerConfiguration;
}) {
  const view = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  if (view.playerMode) return <PlayerExperience view={view} controller={controller} chooseCharacter={chooseCharacter} dealerConfiguration={dealerConfiguration} />;
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

function PlayerExperience({ view, controller, chooseCharacter, dealerConfiguration }: {
  view: BrowserView; controller: BrowserController; chooseCharacter?: PresentationChooser; dealerConfiguration?: DealerConfiguration;
}) {
  const guestSeats = view.configuration.filter(seat => seat.occupancy === 'COMPUTER').map(seat => seat.seatNumber);
  const sessionKey = view.presentationSession + ':' + view.tableStarted + ':' + guestSeats.join(',');
  const [presentation, setPresentation] = useState(() => ({ session: sessionKey, generation: view.presentationSession,
    identity: createDealerTableIdentity(guestSeats,chooseCharacter, 'knight_male', view.tableStarted ? dealerConfiguration?.preferredCharacterId : undefined,
      dealerConfiguration?.rotationPool, view.presentationSession) }));
  if (presentation.session !== sessionKey) setPresentation({ session: sessionKey, generation: view.presentationSession,
    identity: createDealerTableIdentity(guestSeats,chooseCharacter, presentation.generation === view.presentationSession ? presentation.identity.lineup.human : 'knight_male',
      view.tableStarted ? dealerConfiguration?.preferredCharacterId : undefined, dealerConfiguration?.rotationPool, view.presentationSession) });
  const lineup = presentation.identity.lineup;
  const initialDeal = useInitialDeal(), playerActions = usePlayerActions(), runtime = usePresentationRuntime();
  const dealerState = useDealerPresentationState(dealerPresentationState({
    awaitingPlayer: !!view.interaction.insurance || !!view.follow || view.interaction.actions.some(action => action.enabled),
    interrupted: view.round?.phase === 'INTEGRITY_ERROR',
  }));
  const dealer = dealerPresentation(presentation.identity.characterId, dealerState, dealerConfiguration?.assets);
  useEffect(() => {
    if (view.phase === 'CONFIGURING' || (view.phase === 'OPEN' && !view.lastBet)) return;
    const target = document.querySelector<HTMLElement>(view.phase === 'OPEN' ? '#player-wager' : view.interaction.nextRound ? '#player-result' : view.interaction.insurance || view.follow ? '.decision' : '#player-hand');
    target?.focus({ preventScroll: true }); target?.scrollIntoView({ block: 'nearest' });
  }, [view.phase, view.interaction.handId, view.interaction.insurance?.targetSeat, view.follow?.handId, view.interaction.nextRound]);
  return <main className="player-mode">
    <a className="skip-link" href="#player-decisions">Skip to your hand and actions</a>
    <section className="game-scene" aria-label="Blackjack game scene" data-initial-deal-running={String(initialDeal.running)} data-initial-deal-delivered={initialDeal.delivered} data-player-actions-running={String(playerActions.running)}>
    <header className="casino-header"><div><p className="eyebrow">An evening at the table</p><h1>Casino Blackjack</h1></div>
      <p>Simulation credits only — no real-money gambling.<br />Credits have no redemption value.</p></header>
    <div className="table-scene">
    <Table view={view} lineup={lineup} dealerPresentation={dealer} />
    <div id="player-decisions" tabIndex={-1} className="player-dock" role="region" aria-label="Your gameplay controls" aria-describedby="player-scene-status" data-scene-zone="controls"
      data-contextual-dock={view.interaction.insurance ? 'insurance' : view.interaction.nextRound ? 'result' : undefined}>
      <div className="control-context"><p id="player-scene-status" className="round-status" role="status" aria-live="polite">{initialDeal.running ? 'Dealing cards' : playerActions.running ? 'Showing player actions' : view.tableStarted ? roundStatus(view) : 'Choose your players, then start the table'}</p>
        {view.interaction.handId && view.interaction.actions.some(a => a.enabled) && <span id="player-action-hand">· {handLabel(view.interaction.handId)}</span>}</div>
      {view.feedback && <p role="alert" className="feedback">{view.feedback}</p>}
      {(initialDeal.running || playerActions.running) && <button onClick={() => runtime?.timeline.skip()}>Skip animations</button>}
      {view.interaction.actions.some(a => a.enabled) && <Actions view={view} controller={controller} />}
      <Decisions view={view} controller={controller} />
      <Results view={view} controller={controller} />
      <section className="credits panel" aria-label="Your credits"><h2>Credits</h2><dl>
        <div><dt>Available</dt><dd>{credits(view.human?.available ?? 0)}</dd></div>
        <div><dt>Reserved / current exposure</dt><dd>{credits(view.human?.reserved ?? 0)}</dd></div>
        <div><dt>Pending return</dt><dd>{credits(view.pending)}</dd></div>
      </dl></section>
      {!view.tableStarted && <PlayerSetup key={view.presentationSession} controller={controller} view={view} />}
      {view.interaction.betting && <PlayerBetting controller={controller} view={view} />}
    </div>
    </div>
    <p className="session-note">{view.shoeMessage} · Computer guests play with their own simulation credits.</p>
    </section>
    <aside className="scene-support" aria-label="Table preferences and demo tools">
    {view.tableStarted && <div className="table-preference"><p>{view.playerCount} players · 1 human · {view.playerCount - 1} computer guests</p>
      <button disabled={!view.canCreateTable} onClick={() => controller.dispatch({ type: 'NEW_TABLE' })}>New table · reset to 1000 credits</button></div>}
    <CharacterPicker selected={lineup.human} dealerCharacterId={presentation.identity.characterId}
      onSelect={id => setPresentation(current => ({ ...current, identity: changeDealerTableHuman(current.identity,id) }))} />
    <details className="panel developer-tools"><summary>Developer / demo tools</summary>
      <DemoTools key={view.profileId + String(view.seeded)} view={view} controller={controller} />
    </details>
    </aside>
  </main>;
}
