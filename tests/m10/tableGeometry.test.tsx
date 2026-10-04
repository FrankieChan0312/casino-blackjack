import { expect, it } from 'vitest';
import { acceptedController } from './historicalConfiguration.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { seatAnchors, TABLE_SEAT_ANCHORS, type SeatCount } from '../../src/presentation/tableGeometry.js';
import { Table } from '../../src/ui/Table.js';
import { App } from '../../src/ui/App.js';
import { createBrowserController } from '../../src/browser/controller.js';
import { createCharacterLineup } from '../../src/presentation/characters.js';

it('[M10-G01] one centred slot and two balanced shoulder slots match explicit design coordinates', () => {
  expect(seatAnchors(1)).toEqual([{ slot: 1, angle: 90, x: 50, y: 82 }]);
  const two = seatAnchors(2);
  expect(two.map(a => a.angle)).toEqual([160, 20]);
  expect(two[0].x).toBeCloseTo(12.412295, 5); expect(two[1].x).toBeCloseTo(87.587705, 5);
  expect(two[0].y).toBeCloseTo(50.416967, 5); expect(two[1].y).toBeCloseTo(50.416967, 5);
});
it('[M10-G02] three and seven slots preserve left centre right order and the canonical centre', () => {
  expect(seatAnchors(3).map(a => a.angle)).toEqual([160, 90, 20]);
  expect(TABLE_SEAT_ANCHORS.map(a => a.slot)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  expect(TABLE_SEAT_ANCHORS[3]).toEqual({ slot: 4, angle: 90, x: 50, y: 82 });
  expect(TABLE_SEAT_ANCHORS[2].x).toBeCloseTo(34.156809, 5);
  expect(TABLE_SEAT_ANCHORS[2].y).toBeCloseTo(78.074374, 5);
});
it('[M10-G03] every supported slot count stays bounded symmetric and ordered independently of gameplay', () => {
  for (const count of [1, 2, 3, 4, 5, 6, 7] as const) {
    const anchors = seatAnchors(count as SeatCount);
    expect(anchors).toHaveLength(count);
    for (let i = 0; i < count; i++) {
      expect(anchors[i].x).toBeGreaterThanOrEqual(10); expect(anchors[i].x).toBeLessThanOrEqual(90);
      expect(anchors[i].y).toBeGreaterThan(50); expect(anchors[i].y).toBeLessThanOrEqual(82);
      expect(anchors[i].x + anchors[count - 1 - i].x).toBeCloseTo(100, 10);
      expect(anchors[i].y).toBeCloseTo(anchors[count - 1 - i].y, 10);
      if (i) expect(anchors[i].x).toBeGreaterThan(anchors[i - 1].x);
    }
  }
});
it('[M10-G04] current public participants bind stable physical anchors without changing session or character identities', () => {
  const controller = createBrowserController({ playerMode: true, seed: 7 });
  const view = controller.getSnapshot(), before = JSON.stringify(view);
  const html = renderToStaticMarkup(<Table view={view} lineup={createCharacterLineup([1, 3, 6], () => 0)} />);
  expect(html).toContain('casino-table');
  for (const anchor of ['dealer', 'dealer-cards', 'table-centre']) expect(html).toContain(`data-anchor="${anchor}"`);
  expect([...html.matchAll(/data-seat-anchor="seat-(\d)"/g)].map(m => Number(m[1]))).toEqual([1, 3, 4, 6]);
  for (const label of ['Seat 1', 'Seat 3', 'Seat 4', 'Seat 6']) expect(html).toContain(`aria-label="${label}"`);
  expect(html).toContain('Your avatar: Roland'); expect(html).toContain('You · Human');
  expect(html).not.toContain('Total players'); expect(JSON.stringify(controller.getSnapshot())).toBe(before);
});
it('[M10-G05] dealt public cards hidden dealer slot and current hand retain their existing semantic rendering', () => {
  const controller = createBrowserController({ playerMode: true, seed: 7 });
  controller.dispatch({ type: 'DEAL', amount: 200 });
  const view = controller.getSnapshot();
  const html = renderToStaticMarkup(<Table view={view} />);
  expect(html).toContain('Hidden dealer card'); expect(html).toContain('Current hand');
  expect(html).toContain('id="player-hand"'); expect(html).toContain('aria-label="House rules"');
  expect([...html.matchAll(/data-hand-id="/g)]).toHaveLength(4);
  expect(html).not.toContain('deckIndex'); expect(html).not.toContain('physicalCardId');
});
it('[M10-G06] every pre-task assertion stays byte-identical except documented inventory and evidence-output adapters', () => {
  const baseline = '57443bbefddd47512104ba941c65e3ff1988cf02';
  const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).replaceAll('\r\n', '\n').trimEnd();
  const files = git('ls-tree', '-r', '--name-only', baseline, 'tests').split('\n').filter(f => /\.(test\.tsx?|spec\.ts)$/.test(f));
  expect(files.filter(f => /\.test\.tsx?$/.test(f))).toHaveLength(76);
  expect(files.filter(f => /\.spec\.ts$/.test(f))).toHaveLength(8);
  const blobs = execFileSync('git', ['cat-file', '--batch'], { input: files.map(file => `${baseline}:${file}\n`).join('') });
  let offset = 0;
  for (const file of files) {
    const newline = blobs.indexOf(10, offset), header = blobs.subarray(offset, newline).toString('ascii');
    expect(header, file).toMatch(/^[a-f0-9]{40} blob \d+$/);
    const size = Number(header.split(' ')[2]);
    const historical = blobs.subarray(newline + 1, newline + 1 + size).toString('utf8').replaceAll('\r\n', '\n').trimEnd();
    offset = newline + 1 + size + 1;
    let current = readFileSync(file, 'utf8').replaceAll('\r\n', '\n').trimEnd();
    if (file === 'tests/unit/m8Contract.test.ts') current = current
      .replace('    // M10 owns new geometry scenarios; retain the historical M8 inventory.\n', '')
      .replace("    if (file === 'm10.spec.ts') continue;\n", '')
      .replace(" && !/^m10[\\\\/]/.test(file)", '');
    if (file === 'tests/pa1/preservation.test.ts') current = current.replace(
      / {4}if \(file === 'tests\/unit\/m8Contract.test.ts'\) current = current\n {6}\.replace\(' {4}\/\/ M10[^\n]*\n {6}\.replace[^\n]*\n {6}\.replace[^\n]*\n/, '');
    if (file === 'tests/browser/pa1.spec.ts') {
      current = current.replace("import { capturePa1Evidence } from './pa1Evidence.js';\n", '');
      for (const [name, target, suffix] of [
        ['avatar-${id}', 'hand', ''],
        ['responsive-${viewport.width}', 'page', ',fullPage:true'],
        ['text-fallback-${viewport.width}', 'page', ',fullPage:true'],
      ]) {
        const dimensions = target === 'page' ? ',{width:viewport.width,minHeight:viewport.height}' : '';
        current = current.replace(
          '    await capturePa1Evidence(`docs/images/pa1-' + name + '.png`,test.info().outputPath(`pa1-' + name + '.png`),path=>' + target + '.screenshot({path' + suffix + ",animations:'disabled'})" + dimensions + ');',
          '    await ' + target + '.screenshot({path:`docs/images/pa1-' + name + '.png`' + suffix + ",animations:'disabled'});",
        );
      }
    }
    if (file === 'tests/pa1/session.test.ts') current = current
      .replace("import { acceptedController } from '../m10/historicalConfiguration.js';\n", '')
      .replace("acceptedController(readFileSync('src/browser/controller.ts','utf8'))", "readFileSync('src/browser/controller.ts','utf8')");
    expect(current, file).toBe(historical);
  }
  expect(offset).toBe(blobs.length);
  expect(acceptedController(readFileSync('src/browser/controller.ts', 'utf8')).trimEnd()).toBe(git('show', baseline + ':src/browser/controller.ts'));
  expect(git('diff', '--name-only', baseline, '--', 'src/domain', 'src/browser', 'art', 'public', 'package.json', 'package-lock.json',
    ':(exclude)src/browser/controller.ts', ':(exclude)src/browser/playerConfiguration.ts')).toBe('');
});

it('[M10-G07] the local table scene retains semantic hand-control-credit order and exact public funds without commands', () => {
  const controller = createBrowserController({ playerMode: true, seed: 7 });
  controller.dispatch({ type: 'DEAL', amount: 200 });
  const before = JSON.stringify(controller.getSnapshot());
  let notifications = 0;
  const unsubscribe = controller.subscribe(() => notifications++);
  const html = renderToStaticMarkup(<App controller={controller} chooseCharacter={() => 0} />);
  const table = html.indexOf('aria-label="Blackjack table"'), hand = html.indexOf('id="player-hand"');
  const actions = html.indexOf('id="player-decisions"'), credits = html.indexOf('aria-label="Your credits"');
  expect(html).toContain('class="table-scene"');
  expect(table).toBeGreaterThan(0); expect(hand).toBeGreaterThan(table);
  expect(actions).toBeGreaterThan(hand); expect(credits).toBeGreaterThan(actions);
  expect(html).toContain('<dt>Available</dt><dd>900</dd>');
  expect(html).toContain('<dt>Reserved / current exposure</dt><dd>100</dd>');
  expect(html).toContain('<dt>Pending return</dt><dd>0</dd>');
  for (const name of ['Hit', 'Stand', 'Double', 'Split', 'Surrender']) expect(html).toContain(`>${name}</button>`);
  expect(JSON.stringify(controller.getSnapshot())).toBe(before); expect(notifications).toBe(0);
  unsubscribe();
});

it('[M10-G08] the player-only composition preserves the manual seven-seat surface and canonical geometry source', () => {
  const controller = createBrowserController({ seed: 7 });
  const before = JSON.stringify(controller.getSnapshot());
  const html = renderToStaticMarkup(<App controller={controller} />);
  expect(html).not.toContain('class="table-scene"');
  for (let n = 1; n <= 7; n++) expect(html).toContain(`aria-label="Seat ${n}"`);
  expect(JSON.stringify(controller.getSnapshot())).toBe(before);
  const original = execFileSync('git', ['show', '9ca8082b8ce5f9ae7aa90e07356be48c3a6ca2d1:src/presentation/tableGeometry.ts'], { encoding: 'utf8' });
  expect(readFileSync('src/presentation/tableGeometry.ts', 'utf8').replaceAll('\r\n', '\n')).toBe(original.replaceAll('\r\n', '\n'));
});
