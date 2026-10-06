import { expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../../src/ui/App.js';
import { DealerZone } from '../../src/ui/DealerZone.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { DEALER_PRESENTATION_STATES, dealerPresentation } from '../../src/presentation/dealerPresentation.js';
import { FORMAL_DEALER_CONFIGURATION } from '../../src/presentation/formalDealers.js';
import { GENERIC_FORMAL_DEALER } from '../../src/presentation/genericDealer.js';
import { characters } from '../../src/presentation/characters.js';

it('[PRE-T11-U01] supplied generic PNG is independently decoded and deterministic conversion reproduces exact bytes', () => {
  const audit = JSON.parse(execFileSync(process.execPath, ['scripts/verify-generic-dealer.mjs'], { encoding: 'utf8' }));
  expect(audit.status).toBe('PASS'); expect(audit.nonRoster).toBe(true);
  expect(audit.source.sha256).toBe('6d0e58c7d074fd9b38da042f8d60ff2acb44c8b0196fac5f627d8a9e0c84c65c');
  expect(audit.runtime.sha256).toBe('37a797a09a91ad59f96686a2a27f1db981c517bc4eb42bf426b0ebd62c77a6ce');
  expect([audit.runtime.width, audit.runtime.height]).toEqual([240, 320]);
  expect(audit.runtime.alphaExtrema).toEqual([0, 254]); expect(audit.runtime.transparentPixels).toBe(30900);
  expect(audit.runtime.visiblePixels).toBeGreaterThan(7680); expect(audit.runtime.chunkCrcs).toBe('PASS');
  expect(JSON.parse(execFileSync(process.execPath, ['scripts/build-generic-dealer.mjs', '--check'], { encoding: 'utf8' })).status).toBe('PASS');
});
it('[PRE-T11-U02] live guard rejects resurrected direct, aliased, dynamic or manifest references', () => {
  const guard = 'import {assertLiveDealerReferences,checkLiveDealer} from "./scripts/check-live-dealer.mjs";';
  expect(JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', guard + 'process.stdout.write(JSON.stringify(checkLiveDealer()));'], { encoding: 'utf8' })).liveLegacyDealerCallers).toBe(0);
  for (const source of ['<CasinoPerson kind="dealer" />', 'import {CasinoPerson as Portrait} from "./CasinoPerson.js";', '<CasinoPerson kind={role} />', '/legacy/dealer/cartoon.svg', 'Original illustrated female dealer']) {
    const result = execFileSync(process.execPath, ['--input-type=module', '-e', guard + `try {assertLiveDealerReferences({'src/ui/Bad.tsx':${JSON.stringify(source)}});process.stdout.write('accepted');} catch {process.stdout.write('rejected');}`], { encoding: 'utf8' });
    expect(result).toBe('rejected');
  }
});
it('[PRE-T11-U03] all six unresolved/unavailable hooks render only the approved non-roster PNG', () => {
  expect(characters).toHaveLength(12); expect(FORMAL_DEALER_CONFIGURATION.rotationPool).toHaveLength(5);
  expect(GENERIC_FORMAL_DEALER).not.toHaveProperty('characterId');
  for (const state of DEALER_PRESENTATION_STATES) for (const id of [null, 'noble_female'] as const) {
    const html = renderToStaticMarkup(<DealerZone dealer={undefined} presentation={dealerPresentation(id, state)} />);
    expect(html).toContain('src="/characters/dealer/generic_female/formal.png"');
    expect(html).toContain(`data-dealer-presentation-state="${state}"`);
    expect(html).toContain('data-dealer-avatar="generic-formal"');
    expect(html).not.toMatch(/Original illustrated female|person-dealer|<svg/);
  }
});
it.each(['FULL_MOTION', 'REDUCED_MOTION', 'IMMEDIATE'] as const)('[PRE-T11-U04] %s setup preview keeps the actual unstarted controller immutable and consumes no entropy', mode => {
  let draws = 0;
  const c = createBrowserController({ playerMode: true, deferPlayerStart: true, random: { nextInt: n => { draws++; return n - 1; } } });
  const snapshot = JSON.stringify(c.getSnapshot()), before = draws;
  const html = renderToStaticMarkup(<App controller={c} chooseCharacter={() => 0} dealerConfiguration={FORMAL_DEALER_CONFIGURATION} presentationMode={mode} />);
  expect(html).toContain('Dealer: generic formal portrait'); expect(html).toContain('Start table');
  expect(html).not.toMatch(/person-dealer|Original illustrated female|data-dealer-character=/);
  expect(JSON.stringify(c.getSnapshot())).toBe(snapshot); expect(draws).toBe(before);
  expect(readFileSync('src/ui/DealerAvatar.tsx', 'utf8')).not.toMatch(/Math\.random|crypto|dispatch|setTimeout|motion/);
});
