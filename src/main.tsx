import { createRoot } from 'react-dom/client';
import { App } from './ui/App.js';
import { createBrowserController } from './browser/controller.js';
import './ui/styles.css';

let controller;
// Vite replaces MODE at build time. Normal production excludes this entire
// dynamic import and its test fixtures. M8 demo tools use production commands.
if (import.meta.env.MODE === 'e2e') {
  const { createFixtureController } = await import('../tests/browser/fixtures.js');
  controller = createFixtureController(new URLSearchParams(location.search).get('fixture'));
} else controller = createBrowserController({ playerMode: true });
createRoot(document.getElementById('root')!).render(<App controller={controller} />);
