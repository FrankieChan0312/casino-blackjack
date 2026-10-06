import { createRoot } from 'react-dom/client';
import { App } from './ui/App.js';
import { createBrowserController } from './browser/controller.js';
import { FORMAL_DEALER_CONFIGURATION } from './presentation/formalDealers.js';
import { CasinoApp } from './casino/CasinoApp.js';
import { casinoRoute } from './casino/routes.js';
import { BaccaratTable } from './baccarat/BaccaratTable.js';
import { createBaccaratController } from './baccarat/controller.js';
import './ui/styles.css';
import './casino/casino.css';
import './baccarat/baccarat.css';

async function blackjackEntry() {
let controller;
// Vite replaces MODE at build time. Normal production excludes this entire
// dynamic import and its test fixtures. M8 demo tools use production commands.
if (import.meta.env.MODE === 'e2e') {
  const { createFixtureController } = await import('../tests/browser/fixtures.js');
  controller = createFixtureController(new URLSearchParams(location.search).get('fixture'));
} else controller = createBrowserController({ playerMode: true, deferPlayerStart: true });
// Explicit unconfigured fallback input for preserved historical portrait regressions; excluded from production.
const dealerConfiguration = import.meta.env.MODE === 'e2e' && new URLSearchParams(location.search).get('dealer') === 'legacy'
  ? undefined : FORMAL_DEALER_CONFIGURATION;
return <App controller={controller} dealerConfiguration={dealerConfiguration}
  presentationMode={import.meta.env.MODE === 'e2e' && new URLSearchParams(location.search).get('motion') === 'IMMEDIATE' ? 'IMMEDIATE' : undefined}
  chooseCharacter={import.meta.env.MODE === 'e2e' ? () => 0 : undefined} />;
}
async function baccaratEntry() {
  let controller;
  if (import.meta.env.MODE === 'e2e') {
    const { createBaccaratFixture } = await import('../tests/browser/baccaratFixtures.js');
    controller = createBaccaratFixture(new URLSearchParams(location.search).get('baccaratFixture'), () => root.unmount());
  } else controller = createBaccaratController();
  return <BaccaratTable controller={controller}
    presentationMode={import.meta.env.MODE === 'e2e' && new URLSearchParams(location.search).get('motion') === 'IMMEDIATE' ? 'IMMEDIATE' : undefined} />;
}
const path = location.pathname;
const root = createRoot(document.getElementById('root')!);
root.render(<CasinoApp path={path}
  blackjack={casinoRoute(path) === 'BLACKJACK' ? await blackjackEntry() : undefined}
  baccarat={casinoRoute(path) === 'BACCARAT' ? await baccaratEntry() : undefined} baccaratAvailable />);
