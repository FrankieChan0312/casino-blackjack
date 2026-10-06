import { useState, useSyncExternalStore } from 'react';
import type { BaccaratController, Intent } from './controller.js';
import { baccaratCredits, signedCredits } from './format.js';
import type { Target } from './domain/rules.js';
import { Cards } from '../ui/Cards.js';
import { DealerAvatar } from '../ui/DealerAvatar.js';
import { character, characters, type CharacterId } from '../presentation/characters.js';
import { createDealerTableIdentity, changeDealerTableHuman } from '../presentation/dealerPresentation.js';
import { FORMAL_DEALER_ASSETS, FORMAL_DEALER_POOL } from '../presentation/formalDealers.js';
import type { PresentationMode } from '../presentation/timeline.js';
import type { PublicView } from './domain/engine.js';
import { BaccaratPresentationProvider, useBaccaratAnchor, useBaccaratPresentation } from './presentation/Provider.js';
import { baccaratHandId, baccaratWagerSeat } from './presentation/facts.js';

const labels: Record<Target, string> = { PLAYER: 'Player', BANKER: 'Banker', TIE: 'Tie' };
const markings: Record<Target, string> = { PLAYER: '1:1', BANKER: '0.95:1', TIE: '8:1' };
export function BaccaratTable({ controller, presentationMode }: { controller: BaccaratController; presentationMode?: PresentationMode }) {
  return <BaccaratPresentationProvider feed={controller.presentation} mode={presentationMode}><BaccaratScene controller={controller} /></BaccaratPresentationProvider>;
}
function BaccaratCard({ card, handId, index }: { card: NonNullable<PublicView['round']>['player'][number]; handId: string; index: number }) {
  const anchor = useBaccaratAnchor(`card:${handId}:${index}`), visual = useBaccaratPresentation();
  return <div ref={anchor} className="baccarat-card-slot" data-baccarat-slot={`${handId.endsWith('/player') ? 'PLAYER' : 'BANKER'}:${index}`}>
    {visual.visible(handId, index) ? <Cards cards={[card]} /> : <div className="baccarat-card-outline" aria-hidden="true" />}</div>;
}
function BaccaratWagerChip({ target, units }: { target: Target; units: number }) {
  const anchor = useBaccaratAnchor(`wager:${baccaratWagerSeat[target]}`);
  return <span ref={anchor} className="baccarat-wager-chip" data-wager-units={units}>{units ? `${baccaratCredits(units)} credits` : 'No bet'}</span>;
}
function BaccaratScene({ controller }: { controller: BaccaratController }) {
  const view = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const visual = useBaccaratPresentation(), shoeAnchor = useBaccaratAnchor('deal-origin'), dealerAnchor = useBaccaratAnchor('dealer-hand'), creditsAnchor = useBaccaratAnchor('local-credits');
  const [selected, setSelected] = useState<Target>('PLAYER'), [amount, setAmount] = useState('25'), [error, setError] = useState('');
  const [identity, setIdentity] = useState(() => createDealerTableIdentity([], () => 0, 'knight_male', 'noble_female', FORMAL_DEALER_POOL, 0));
  const human = character(identity.lineup.human), dealer = FORMAL_DEALER_ASSETS.find(asset => asset.characterId === identity.characterId) ?? null;
  const betting = view.phase === 'BETTING', complete = view.phase === 'COMPLETE', round = view.round;
  const exposure = Object.values(view.previousWagers).reduce((sum, units) => sum + units, 0);
  const net = round?.settlements.reduce((sum, result) => sum + result.netUnits, 0) ?? 0;
  const returned = round?.settlements.reduce((sum, result) => sum + result.grossUnits, 0) ?? 0;
  const status = visual.initialRunning ? 'DEALING' : round && !visual.visible(baccaratHandId(round.id, 'PLAYER'), 2) ? 'PLAYER DRAWS'
    : visual.cardsRunning ? 'BANKER DRAWS' : view.phase === 'INTEGRITY_ERROR' ? 'ROUND INTERRUPTED' : view.voided ? 'ROUND VOIDED'
    : round ? round.outcome === 'TIE' ? 'TIE' : `${round.outcome} WINS` : 'PLACE YOUR BET';
  function dispatch(intent: Intent) {
    const result = controller.dispatch(intent, view.roundId); setError(result.ok ? '' : result.error ?? 'Unable to complete that action');
  }
  function place() {
    const credits = Number(amount);
    if (!Number.isInteger(credits) || credits < 1 || credits > 1000) { setError('Choose a whole-credit wager from 1 to 1,000.'); return; }
    dispatch({ type: 'WAGER', target: selected, amountUnits: credits * 100 });
  }
  return <main className="baccarat-page" data-game="baccarat" data-round-id={view.roundId} data-authority-digest={controller.getDigest()}
    data-baccarat-motion={visual.mode} data-cards-running={visual.cardsRunning} data-presentation-running={visual.running}>
    <header className="baccarat-header"><div><p className="eyebrow">Punto Banco · Eight decks</p><h1>Baccarat</h1></div>
      <p>Simulation credits only.<br />No real money or redemption value.</p></header>
    <section className="baccarat-table" aria-label="Baccarat table">
      <div ref={dealerAnchor} className="baccarat-dealer" data-dealer-character={identity.characterId ?? ''}>
        <DealerAvatar asset={dealer} /><p>{identity.characterId ? character(identity.characterId).name : 'Casino Dealer'} · Dealer</p>
        <div ref={shoeAnchor} className="baccarat-shoe" aria-label="Eight-deck shoe"><span className="shoe-placeholder" aria-hidden="true" /><small>{view.remainingCards} cards remaining</small></div>
      </div>
      <div className="baccarat-status" role="status" aria-live="polite"><strong>{status}</strong>
        {complete && !visual.running && <span>ROUND COMPLETE</span>}{!visual.cardsRunning && visual.settling && <span>Settling bets</span>}
        {!visual.initialRunning && round?.natural && <span>Natural · No third cards</span>}</div>
      <div className="baccarat-hands">
        {(['PLAYER','BANKER'] as const).map(zone => {
          const hand = zone === 'PLAYER' ? round?.player : round?.banker;
          const handId = baccaratHandId(view.roundId, zone);
          const total = round?.draws.filter(draw => draw.zone === zone && visual.visible(handId, draw.index)).at(-1)?.totalAfter;
          const natural = zone === 'PLAYER' ? round?.playerNatural : round?.bankerNatural;
          const decision = zone === 'PLAYER' ? round?.playerDecision : round?.bankerDecision;
          return <section key={zone} className="baccarat-hand" aria-label={`${labels[zone]} hand`} data-hand={zone}>
            <h2>{labels[zone]}</h2><p className="baccarat-total">{total === undefined ? 'Waiting for Deal' : `Total: ${total}`}{!visual.initialRunning && natural && ' · Natural'}</p>
            <div className="baccarat-hand-cards" role="group" aria-label={`${labels[zone]} cards`}>
              {hand ? hand.map((card,index) => <BaccaratCard key={`${handId}:${index}`} card={card} handId={handId} index={index} />)
                : [0,1].map(index => <div key={index} className="baccarat-card-outline" aria-hidden="true" />)}
            </div>
            <p className="baccarat-decision">{visual.initialRunning ? 'Cards arriving' : decision === 'DRAW' ? `${labels[zone]} draws a third card` : round ? `${labels[zone]} stands` : 'Cards arrive here'}</p>
          </section>;
        })}
      </div>
      <section className="baccarat-wager-zones" aria-label="Wager targets">
        {(['PLAYER','TIE','BANKER'] as const).map(target => <div className="baccarat-wager-zone" key={target} data-wager-target={target}>
          <button type="button" aria-pressed={selected === target} disabled={!betting} onClick={() => {setSelected(target);setError('');}}>{labels[target]}<small>{markings[target]}</small></button>
          <BaccaratWagerChip target={target} units={view.wagers[target]} />
          {!visual.cardsRunning && round?.settlements.find(result=>result.target===target) && <span className="baccarat-wager-result">{round.settlements.find(result=>result.target===target)!.result}</span>}
        </div>)}
      </section>
      <section className="baccarat-local-hud" aria-label="Your Baccarat credits">
        <div className="baccarat-human"><img src={human.portrait} width={72} height={96} alt={`Your character: ${human.name}, ${human.archetype}`} /><div><strong>You · {human.name}</strong><span>Human</span></div></div>
        <dl><div><dt>Available</dt><dd ref={creditsAnchor} data-credits="available">{baccaratCredits(view.availableUnits)}</dd></div>
          <div><dt>Reserved</dt><dd data-credits="reserved">{baccaratCredits(view.reservedUnits)}</dd></div>
          <div><dt>Pending return</dt><dd data-credits="pending">{baccaratCredits(view.pendingUnits)}</dd></div></dl>
      </section>
      <section className="baccarat-controls" aria-label="Baccarat controls">
        {betting ? <>
          <p className="baccarat-selected">Selected: {labels[selected]} · {view.reservedUnits ? `${baccaratCredits(view.reservedUnits)} credits reserved` : 'Choose an amount, then place your bet'}</p>
          <div className="baccarat-wager-entry"><label htmlFor="baccarat-wager-amount">Wager amount</label><input id="baccarat-wager-amount" type="number" min="1" max="1000" step="1" inputMode="numeric" value={amount} onChange={event=>setAmount(event.target.value)} />
            <button type="button" onClick={place}>Place Bet · {labels[selected]}</button></div>
          <div className="baccarat-chips" aria-label="Choose wager amount">{[1,5,25,100].map(credits=><button key={credits} type="button" aria-pressed={amount===String(credits)} onClick={()=>setAmount(String(credits))}>{credits}</button>)}</div>
          <div className="baccarat-primary-controls"><button type="button" className="baccarat-deal" disabled={view.reservedUnits===0} onClick={()=>dispatch({type:'DEAL'})}>Deal</button>
            <button type="button" disabled={view.reservedUnits===0} onClick={()=>dispatch({type:'CLEAR'})}>Clear Bets</button></div>
        </> : complete ? <>
          {!visual.cardsRunning && <div className="baccarat-result" aria-label="Round result"><strong>{status}</strong><p>Returned <b>{baccaratCredits(returned)}</b> credits · Net <b data-round-net>{signedCredits(net)}</b> credits</p></div>}
          <div className="baccarat-primary-controls"><button type="button" className="baccarat-deal" disabled={visual.running} onClick={()=>dispatch({type:'NEXT'})}>Deal Again</button>
            <button type="button" disabled={visual.running || exposure===0 || exposure>view.availableUnits} onClick={()=>dispatch({type:'REPEAT'})}>Repeat Bet</button></div>
          {exposure>view.availableUnits && <p>Not enough credits to repeat the previous bets.</p>}
        </> : view.phase==='INTEGRITY_ERROR' ? <><p>The round was interrupted. Your reserved credits can be returned.</p><button type="button" onClick={()=>dispatch({type:'VOID'})}>Void round · refund bets</button></> : <p>Resolving the round.</p>}
        {error && <p className="baccarat-error" role="alert">{error}</p>}
        <div className="baccarat-motion-controls">{visual.running && <button type="button" onClick={visual.skip}>Skip animation</button>}
          <label><input type="checkbox" checked={visual.sessionReduced || visual.systemReduced || false} disabled={visual.systemReduced} onChange={event=>visual.setSessionReduced?.(event.target.checked)} /> Reduce motion</label></div>
      </section>
    </section>
    <div className="baccarat-support"><details className="panel character-picker"><summary>Change Character · {human.name}</summary>
      <label htmlFor="baccarat-character">Your character</label><select id="baccarat-character" value={human.id} onChange={event=>setIdentity(current=>changeDealerTableHuman(current,event.target.value as CharacterId))}>
        {characters.map(entry=><option key={entry.id} value={entry.id} disabled={entry.id===identity.characterId}>{entry.name} · {entry.archetype}{entry.id===identity.characterId?' · Dealer (reserved)':''}</option>)}</select>
      <p>{identity.characterId ? character(identity.characterId).name : 'The Dealer'} is reserved for the Dealer at this table.</p></details>
      <details className="panel"><summary>Table rules</summary><p>Eight-deck Punto Banco. Player pays 1:1, Banker 0.95:1 after 5% commission, Tie 8:1. Player and Banker bets push on a Tie.</p><p>Whole-credit wagers from 1 to 1,000. No side bets.</p></details>
    </div>
  </main>;
}
