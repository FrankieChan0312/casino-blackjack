import { createRoot } from 'react-dom/client';
import { App } from './ui/App.js';
import { createBrowserController } from './browser/controller.js';
import { FORMAL_DEALER_CONFIGURATION } from './presentation/formalDealers.js';
import './ui/styles.css';

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
createRoot(document.getElementById('root')!).render(<App controller={controller} dealerConfiguration={dealerConfiguration}
  chooseCharacter={import.meta.env.MODE === 'e2e' ? () => 0 : undefined} />);
