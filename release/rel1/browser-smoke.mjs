/* global document, innerWidth */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import console from 'node:console';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { release, platform } from 'node:os';
import { resolve, join, relative, isAbsolute } from 'node:path';
import process from 'node:process';
import { clearTimeout, setTimeout } from 'node:timers';
import { URL } from 'node:url';

// Verification tooling belongs to the isolated builder; it is never packaged.
const require = createRequire(new URL('../../package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const [packageArg, outputArg] = process.argv.slice(2);
if (!packageArg || !outputArg || process.argv.length !== 4) {
  console.error('Usage: node release/rel1/browser-smoke.mjs <extracted-package-directory> <external-output-directory>');
  process.exit(2);
}
const packageDir = resolve(packageArg), outputDir = resolve(outputArg);
const relativeOutput = relative(packageDir, outputDir);
assert(relativeOutput.startsWith('..') || isAbsolute(relativeOutput), 'Evidence must be outside the extracted package');
await access(join(packageDir, 'start-demo.mjs'));
await access(join(packageDir, 'dist/index.html'));
await assert.rejects(access(join(packageDir, 'node_modules')), 'Extracted demo must not contain node_modules');
await assert.rejects(access(join(packageDir, '.git')), 'Extracted demo must not contain repository history');
await mkdir(outputDir, { recursive: true });
const report = {
  task: 'REL1', status: 'NOT RUN', startedAt: new Date().toISOString(),
  runtime: { node: process.version, platform: platform(), platformRelease: release(), playwright: require('@playwright/test/package.json').version },
  packageVersion: JSON.parse(await readFile(join(packageDir, 'VERSION.json'), 'utf8')),
  packageDirectory: packageDir, launcherCwd: outputDir,
  entry: 'Extracted production package only; no fixture queries, RNG overrides or application source imports',
  checks: [], rounds: [], outsideRequests: [], consoleErrors: [], pageErrors: [], failedRequests: [], errorResponses: [],
};
const server = spawn(process.execPath, [join(packageDir, 'start-demo.mjs')], {
  cwd: outputDir, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
});
let stdout = '', stderr = '', origin, browser;
server.stdout.on('data', data => { stdout += data; });
server.stderr.on('data', data => { stderr += data; });
const serverExit = new Promise(done => server.once('exit', (code, signal) => done({ code, signal })));
const startup = new Promise((done, reject) => {
  const timeout = setTimeout(() => reject(new Error('Launcher did not print its ready URL within 15 seconds')), 15000);
  function readReady() {
    const match = stdout.match(/http:\/\/127\.0\.0\.1:\d+\/?/);
    if (match) { clearTimeout(timeout); done(new URL(match[0]).origin); }
  }
  server.stdout.on('data', readReady);
  server.once('error', error => { clearTimeout(timeout); reject(error); });
  server.once('exit', (code, signal) => { clearTimeout(timeout); reject(new Error(`Launcher exited before ready: ${code}/${signal}: ${stderr}`)); });
});

async function step(name, run) {
  const check = { name, status: 'NOT RUN', startedAt: new Date().toISOString() };
  report.checks.push(check);
  try { check.observation = await run(); check.status = 'PASS'; }
  catch (error) { check.status = 'FAIL'; check.error = error.stack ?? String(error); throw error; }
  finally { check.finishedAt = new Date().toISOString(); }
}

async function freshContext(viewport = { width: 1280, height: 900 }) {
  const context = await browser.newContext({ viewport, serviceWorkers: 'block', reducedMotion: 'no-preference' });
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) await route.continue();
    else { report.outsideRequests.push({ url: url.href, type: route.request().resourceType() }); await route.abort('blockedbyclient'); }
  });
  context.on('page', page => {
    page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ page: page.url(), text: message.text() }); });
    page.on('pageerror', error => report.pageErrors.push({ page: page.url(), message: error.message }));
    page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), type: request.resourceType(), failure: request.failure() }));
    page.on('response', response => { if (response.status() >= 400) report.errorResponses.push({ url: response.url(), status: response.status() }); });
  });
  return context;
}
async function heading(page, route) {
  const title = route === '/casino' ? 'Casino Lobby' : route === '/baccarat' ? 'Baccarat' : 'Casino Blackjack';
  await page.getByRole('heading', { name: title, exact: true }).waitFor();
  assert.equal(new URL(page.url()).search, '', 'Production walkthrough must have no fixture query');
  assert.match(await page.locator('body').innerText(), /Simulation credits only/);
}
async function portraits(page) {
  await page.waitForFunction(() => [...document.images].every(img => img.complete));
  const images = await page.locator('img').evaluateAll(elements => elements.map(img => ({ src: new URL(img.src).pathname, alt: img.alt, width: img.naturalWidth, height: img.naturalHeight })));
  assert(images.length > 0, 'Expected the game portraits');
  assert(images.every(img => img.width > 0 && img.height > 0), 'Every requested portrait must decode');
  assert(images.some(img => img.alt.startsWith('Dealer:')), 'Dealer portrait must load');
  return images;
}
async function screenshot(page, filename) {
  await page.screenshot({ path: join(outputDir, filename), fullPage: true });
  return filename;
}
async function failureEvidence(page) {
  const check = report.checks.at(-1), basename = `failed-step-${report.checks.length}`;
  try {
    check.failureUrl = page.url();
    await writeFile(join(outputDir, `${basename}.html`), await page.content());
    check.failureHtml = `${basename}.html`;
    check.failureScreenshot = await screenshot(page, `${basename}.png`);
  } catch (error) {
    check.failureCaptureError = error.stack ?? String(error);
  }
}
async function keyboardEnter(locator) {
  await locator.focus();
  assert(await locator.evaluate(element => element === document.activeElement), 'Keyboard action must target the focused native control');
  await locator.press('Enter');
}
async function noHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, body: document.body.scrollWidth, document: document.documentElement.scrollWidth }));
  assert(dimensions.body <= dimensions.viewport + 1 && dimensions.document <= dimensions.viewport + 1, JSON.stringify(dimensions));
  return dimensions;
}
async function blackjackReady(page) {
  await page.waitForFunction(() => {
    const scene = document.querySelector('.game-scene');
    const motion = ['initial-deal', 'player-actions', 'dealer-actions', 'wagers'];
    return scene && motion.every(kind => scene.getAttribute(`data-${kind}-running`) === 'false')
      && (document.querySelector('#player-result') || document.querySelector('.decision') || document.querySelector('.action-stand:not([disabled])'));
  }, undefined, { timeout: 30000 });
}
const numeric = value => Number(value.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)?.[0]);
async function blackjackRound(page, label, before, wager) {
  const decisions = [];
  for (let decision = 0; decision < 8; decision += 1) {
    await blackjackReady(page);
    if (await page.locator('#player-result').count()) break;
    const decline = page.getByRole('button', { name: 'Decline', exact: true });
    if (await decline.count() && await decline.isVisible()) {
      await keyboardEnter(decline); decisions.push('DECLINE_INSURANCE');
    } else {
      const stand = page.getByRole('button', { name: 'Stand', exact: true });
      assert(await stand.isEnabled(), 'A displayed player decision must offer a legal Stand');
      await keyboardEnter(stand); decisions.push('STAND');
    }
  }
  await page.locator('#player-result').waitFor();
  await blackjackReady(page);
  const creditText = await page.getByRole('region', { name: 'Your credits', exact: true }).locator('dd').allTextContents();
  const available = numeric(creditText[0]), reserved = numeric(creditText[1]);
  const netText = await page.locator('#round-net').innerText(), net = numeric(netText);
  assert.equal(reserved, 0, 'Settled round must release all reserved credits');
  assert.equal(available, before + net, 'Displayed available credits must reconcile independently with the displayed net');
  assert(!await page.locator('.interruption').count(), 'Normal walkthrough must settle without an integrity interruption');
  const cards = await page.locator('.local-player-hud .card[role="img"]').evaluateAll(elements => elements.map(card => card.getAttribute('aria-label')));
  assert(cards.length >= 2 && cards.every(card => /^([2-9]|10|A|J|Q|K) of (clubs|diamonds|hearts|spades)$/.test(card)), 'Player cards must have actual public identities');
  assert(await page.locator('.dealer-zone .card[role="img"]').count() >= 2, 'Dealer cards must render');
  const results = await page.locator('.local-player-hud [data-result]').evaluateAll(elements => elements.map(element => element.getAttribute('data-result')));
  assert(results.some(Boolean), 'Human hand must display its actual settled result');
  const record = { game: 'Blackjack', label, wager, decisions, before, available, reserved, net, cards, results,
    branch: decisions.includes('STAND') ? 'PLAYER_ACTION' : 'INITIAL_NATURAL_RESOLUTION', status: await page.locator('#player-scene-status').innerText() };
  report.rounds.push(record);
  return record;
}
async function baccaratRound(page, label, before, wager) {
  await page.waitForFunction(() => document.querySelector('[data-game="baccarat"]')?.getAttribute('data-presentation-running') === 'false'
    && !!document.querySelector('.baccarat-result'), undefined, { timeout: 30000 });
  const creditText = await page.locator('[data-credits]').allTextContents();
  const available = numeric(creditText[0]), reserved = numeric(creditText[1]), pending = numeric(creditText[2]);
  const net = numeric(await page.locator('[data-round-net]').innerText());
  assert.equal(reserved, 0); assert.equal(pending, 0); assert.equal(available, before + net);
  const cards = await page.locator('.baccarat-hands .card[role="img"]').evaluateAll(elements => elements.map(card => card.getAttribute('aria-label')));
  assert(cards.length >= 4 && cards.length <= 6, 'A legal Baccarat round displays four through six cards');
  const totals = await page.locator('.baccarat-total').allTextContents();
  assert(totals.every(total => /^Total: [0-9]/.test(total)), 'Both Baccarat totals must display');
  const record = { game: 'Baccarat', label, wager, before, available, reserved, pending, net, cards, totals,
    result: await page.locator('.baccarat-result').innerText(), decisions: await page.locator('.baccarat-decision').allTextContents() };
  report.rounds.push(record); return record;
}

try {
  origin = await startup;
  report.launcherUrl = origin;
  browser = await chromium.launch({ headless: true });
  report.runtime.browser = `Chromium ${browser.version()}`;
  report.runtime.browserExecutable = chromium.executablePath();
  for (const route of ['/', '/casino', '/blackjack', '/baccarat']) {
    await step(`Direct entry and refresh: ${route}`, async () => {
      const context = await freshContext(), page = await context.newPage();
      try {
        const response = await page.goto(origin + route); assert.equal(response.status(), 200);
        await heading(page, route); const images = await portraits(page);
        const refreshed = await page.reload(); assert.equal(refreshed.status(), 200);
        await heading(page, route); await portraits(page);
        return { route, images, screenshot: await screenshot(page, `direct-${route === '/' ? 'root' : route.slice(1)}.png`) };
      } catch (error) { await failureEvidence(page); throw error; }
      finally { await context.close(); }
    });
  }
  await step('Native lobby and game navigation', async () => {
    const context = await freshContext(), page = await context.newPage();
    try {
      await page.goto(origin + '/casino');
      await portraits(page);
      for (const [link, route] of [['Play Blackjack', '/blackjack'], ['Casino Lobby', '/casino'], ['Play Baccarat', '/baccarat'], ['Blackjack', '/blackjack'], ['Baccarat', '/baccarat'], ['Casino Lobby', '/casino']]) {
        await page.getByRole('link', { name: new RegExp(`^${link}`) }).click();
        await heading(page, route); assert.equal(new URL(page.url()).pathname, route);
        await portraits(page);
      }
      return { routes: ['/casino', '/blackjack', '/casino', '/baccarat', '/blackjack', '/baccarat', '/casino'] };
    } catch (error) { await failureEvidence(page); throw error; }
    finally { await context.close(); }
  });
  await step('Blackjack real wager, legal action, settlement, repeat and next; native keyboard', async () => {
    const context = await freshContext(), page = await context.newPage();
    try {
      await page.goto(origin + '/blackjack'); await heading(page, '/blackjack');
      assert.equal(await page.getByLabel('Total players', { exact: true }).inputValue(), '4');
      await keyboardEnter(page.getByRole('button', { name: 'Start table', exact: true }));
      await portraits(page);
      const input = page.getByLabel('Your main wager', { exact: false });
      await input.fill('25'); await input.focus(); await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Choose 10 credits');
      await page.keyboard.press('Enter'); assert.equal(await input.inputValue(), '10');
      await input.fill('25'); await keyboardEnter(page.getByRole('button', { name: 'Deal', exact: true }));
      let round = await blackjackRound(page, 'initial', 1000, 25);
      assert.match(await page.locator('.local-player-hud .wager-chip').innerText(), /MAIN: 25 credits/);
      let observedAction = round.decisions.includes('STAND');
      await screenshot(page, 'blackjack-settled.png');
      await keyboardEnter(page.getByRole('button', { name: /^Repeat Bet · 25 credits$/ }));
      round = await blackjackRound(page, 'repeat', round.available, 25);
      observedAction ||= round.decisions.includes('STAND');
      await keyboardEnter(page.getByRole('button', { name: 'Deal Again', exact: true }));
      await input.waitFor(); assert.equal(await input.inputValue(), '25');
      // Natural outcomes legitimately offer no player action. Observe further
      // ordinary rounds, without seeds or fixtures, only if needed for this gate.
      for (let attempt = 0; !observedAction && attempt < 6; attempt += 1) {
        await input.fill('10'); await keyboardEnter(page.getByRole('button', { name: 'Deal', exact: true }));
        round = await blackjackRound(page, `action-observation-${attempt + 1}`, round.available, 10);
        observedAction ||= round.decisions.includes('STAND');
        await keyboardEnter(page.getByRole('button', { name: 'Deal Again', exact: true })); await input.waitFor();
      }
      assert(observedAction, 'A player-action scenario was not observed in eight real rounds; do not claim it passed');
      return { actionObserved: observedAction, keyboard: ['Tab to chip preset', 'Enter to choose preset', 'Enter to start/deal/stand/repeat/next'], screenshot: 'blackjack-settled.png' };
    } catch (error) { await failureEvidence(page); throw error; }
    finally { await context.close(); }
  });
  await step('Baccarat real wager, deal, settlement, repeat and next; native keyboard', async () => {
    const context = await freshContext(), page = await context.newPage();
    try {
      await page.goto(origin + '/baccarat'); await heading(page, '/baccarat'); await portraits(page);
      await page.getByLabel('Wager amount', { exact: true }).fill('25');
      await keyboardEnter(page.getByRole('button', { name: 'Place Bet · Player', exact: true }));
      assert.equal(await page.locator('[data-wager-target="PLAYER"] .baccarat-wager-chip').innerText(), '25 credits');
      assert.equal(numeric(await page.locator('[data-credits="reserved"]').innerText()), 25);
      await keyboardEnter(page.getByRole('button', { name: 'Deal', exact: true }));
      let round = await baccaratRound(page, 'initial', 1000, 25); await screenshot(page, 'baccarat-settled.png');
      await keyboardEnter(page.getByRole('button', { name: 'Repeat Bet', exact: true }));
      // Baccarat Repeat restores and reserves the previous wagers in BETTING;
      // the existing production flow requires an explicit Deal afterward.
      await page.getByLabel('Wager amount', { exact: true }).waitFor();
      assert.equal(await page.locator('[data-wager-target="PLAYER"] .baccarat-wager-chip').innerText(), '25 credits');
      assert.equal(numeric(await page.locator('[data-credits="reserved"]').innerText()), 25);
      assert.equal(numeric(await page.locator('[data-credits="available"]').innerText()), round.available - 25);
      await keyboardEnter(page.getByRole('button', { name: 'Deal', exact: true }));
      round = await baccaratRound(page, 'repeat', round.available, 25);
      await keyboardEnter(page.getByRole('button', { name: 'Deal Again', exact: true }));
      await page.getByLabel('Wager amount', { exact: true }).waitFor();
      assert.equal(numeric(await page.locator('[data-credits="reserved"]').innerText()), 0);
      assert.equal(numeric(await page.locator('[data-credits="available"]').innerText()), round.available);
      return { repeat: 'Restored Player 25-credit wager in BETTING, then explicit Deal', keyboard: ['Enter to place wager/deal/repeat/next'], screenshot: 'baccarat-settled.png' };
    } catch (error) { await failureEvidence(page); throw error; }
    finally { await context.close(); }
  });
  for (const game of ['blackjack', 'baccarat']) {
    await step(`320px viewport: ${game} real wager and completed round`, async () => {
      const context = await freshContext({ width: 320, height: 720 }), page = await context.newPage();
      try {
        await page.goto(`${origin}/${game}`); await heading(page, `/${game}`); await portraits(page);
        const entryDimensions = await noHorizontalOverflow(page);
        if (game === 'blackjack') {
          await page.getByRole('button', { name: 'Start table', exact: true }).click();
          await page.getByLabel('Your main wager', { exact: false }).fill('10');
          await page.getByRole('button', { name: 'Deal', exact: true }).click();
          await blackjackRound(page, '320px', 1000, 10);
        } else {
          await page.getByLabel('Wager amount', { exact: true }).fill('5');
          await page.getByRole('button', { name: 'Place Bet · Player', exact: true }).click();
          await page.getByRole('button', { name: 'Deal', exact: true }).click();
          await baccaratRound(page, '320px', 1000, 5);
        }
        const settledDimensions = await noHorizontalOverflow(page);
        assert(await page.getByRole('button', { name: 'Deal Again', exact: true }).isVisible());
        return { viewport: { width: 320, height: 720 }, entryDimensions, settledDimensions, screenshot: await screenshot(page, `${game}-320px.png`) };
      } catch (error) { await failureEvidence(page); throw error; }
      finally { await context.close(); }
    });
  }
  await step('Required assets, console and network independence', async () => {
    assert.deepEqual(report.outsideRequests, [], 'Gameplay requested an outside network resource');
    assert.deepEqual(report.consoleErrors, [], 'Application emitted console errors');
    assert.deepEqual(report.pageErrors, [], 'Application emitted uncaught errors');
    assert.deepEqual(report.failedRequests, [], 'A required resource failed');
    assert.deepEqual(report.errorResponses, [], 'A production resource returned an error');
    return { externalRequests: 0, consoleErrors: 0, pageErrors: 0, failedRequests: 0, errorResponses: 0 };
  });
  report.status = 'PASS';
} catch (error) {
  report.status = 'FAIL'; report.error = error.stack ?? String(error); process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  // Only the server started by this harness is terminated. Launcher Ctrl+C
  // behavior is verified separately by the release launcher test suite.
  if (server.exitCode === null && server.signalCode === null) server.kill();
  report.launcherTermination = await serverExit;
  report.finishedAt = new Date().toISOString();
  await writeFile(join(outputDir, 'launcher-stdout.txt'), stdout);
  await writeFile(join(outputDir, 'launcher-stderr.txt'), stderr);
  await writeFile(join(outputDir, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, node: report.runtime.node, browser: report.runtime.browser, checks: report.checks.map(check => ({ name: check.name, status: check.status })), rounds: report.rounds.length, report: join(outputDir, 'browser-report.json'), error: report.error }));
}
