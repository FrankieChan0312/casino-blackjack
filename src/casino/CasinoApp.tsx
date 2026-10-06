import type { ReactNode } from 'react';
import { casinoRoute } from './routes.js';
import { DealerAvatar } from '../ui/DealerAvatar.js';
import { FORMAL_DEALER_ASSETS } from '../presentation/formalDealers.js';

export function GameNavigation() {
  return <nav className="casino-game-navigation" aria-label="Casino games">
    <a href="/casino">Casino Lobby</a><a href="/blackjack">Blackjack</a><a href="/baccarat">Baccarat</a>
  </nav>;
}
export function CasinoApp({ path, blackjack, baccarat }: { path: string; blackjack?: ReactNode; baccarat?: ReactNode }) {
  const route = casinoRoute(path);
  if (route === 'BLACKJACK') return <>{blackjack}{path !== '/' && <GameNavigation />}</>;
  if (route === 'BACCARAT' && baccarat) return <>{baccarat}<GameNavigation /></>;
  return <main className="casino-page">
    <GameNavigation />
    {route === 'LOBBY' ? <>
      <header className="casino-lobby-hero"><div><p className="eyebrow">An evening at the tables</p>
        <h1>Casino Lobby</h1><p className="casino-intro">Choose your table.<br />Make yourself at home.</p>
        <p>Simulation credits only. No real-money gambling.<br />Credits have no redemption value.</p></div>
        <div className="casino-host"><DealerAvatar asset={FORMAL_DEALER_ASSETS[0]} /><p>Celestine · Your host</p></div>
      </header>
      <section className="casino-game-cards" aria-label="Choose a game">
        <article className="casino-game-card"><p className="casino-game-symbol" aria-hidden="true">♠ ♡</p>
          <p className="casino-availability">AVAILABLE</p><h2>Blackjack</h2>
          <p>Your hand, your decision. Take a seat at a Blackjack table with one to seven players.</p>
          <p className="casino-game-detail">Six decks · Dealer stands on all 17 · Blackjack pays 3:2</p>
          <a className="casino-play" href="/blackjack">Play Blackjack <span aria-hidden="true">→</span></a>
        </article>
        <article className="casino-game-card"><p className="casino-game-symbol" aria-hidden="true">◇ ♣</p>
          <p className="casino-availability">IN DEVELOPMENT</p><h2>Baccarat</h2>
          <p>Player, Banker or Tie. A new Punto Banco table in the same casino universe.</p>
          <p className="casino-game-detail">A new table is on its way</p>
          <a className="casino-play casino-preview" href="/baccarat">Preview Baccarat <span aria-hidden="true">→</span></a>
        </article>
      </section>
      <p className="casino-session-note">Each table opens a local simulation session. No account or payment is needed.</p>
    </> : route === 'BACCARAT' ? <section className="casino-bootstrap" aria-label="Baccarat preview">
      <p className="eyebrow">Punto Banco · In development</p><h1>Baccarat</h1>
      <DealerAvatar asset={FORMAL_DEALER_ASSETS[0]} />
      <p>Player · Tie · Banker</p><p>The table is being prepared. Playable wagering is not available yet.</p>
      <p>Simulation credits only. Credits have no redemption value.</p>
      <a className="casino-play" href="/casino">Return to Casino Lobby</a>
    </section> : <section className="casino-bootstrap"><h1>Table not found</h1>
      <p>Choose an available table from the lobby.</p><a className="casino-play" href="/casino">Return to Casino Lobby</a></section>}
  </main>;
}
