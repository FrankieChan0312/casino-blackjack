import { afterEach, beforeEach, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { capturePa1Evidence } from '../browser/pa1Evidence.js';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
let directory: string, baseline: string, output: string;
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'casino-blackjack-pa1-evidence-'));
  baseline = join(directory, 'canonical.png');
  output = join(directory, 'run-one', 'canonical.png');
  mkdirSync(join(directory, 'run-one')); mkdirSync(join(directory, 'run-two'));
  writeFileSync(baseline, png);
});
afterEach(() => rmSync(directory, { recursive: true }));
const capture = async (path: string) => { writeFileSync(path, png); return png; };

it('[PA1-H01] independent run destinations retain the same canonical reference without mutation', async () => {
  const second = join(directory, 'run-two', 'canonical.png');
  expect(output).not.toBe(second); expect(output).not.toBe(baseline);
  await capturePa1Evidence(baseline, output, capture, { width: 1, minHeight: 1 });
  await capturePa1Evidence(baseline, second, capture, { width: 1, minHeight: 1 });
  for (const path of [baseline, output, second]) expect(readFileSync(path)).toEqual(png);
});
it('[PA1-H02] capture content comparison rejects a different saved file', async () => {
  await expect(capturePa1Evidence(baseline, output, async path => {
    writeFileSync(path, Buffer.concat([png, Buffer.from([0])])); return png;
  })).rejects.toThrow('Saved screenshot content mismatch');
});
it('[PA1-H03] baseline comparison rejects mutation during capture', async () => {
  await expect(capturePa1Evidence(baseline, output, async path => {
    writeFileSync(baseline, Buffer.concat([png, Buffer.from([0])])); return capture(path);
  })).rejects.toThrow('Canonical baseline changed');
});
it('[PA1-H04] missing baseline fails before capture', async () => {
  let called = false;
  await expect(capturePa1Evidence(join(directory, 'missing.png'), output, async path => {
    called = true; return capture(path);
  })).rejects.toMatchObject({ code: 'ENOENT' });
  expect(called).toBe(false);
});
it('[PA1-H05] missing fresh file fails even when the capture returns PNG bytes', async () => {
  await expect(capturePa1Evidence(baseline, output, async () => png)).rejects.toMatchObject({ code: 'ENOENT' });
});
it('[PA1-H06] malformed fresh PNG fails mechanical validation', async () => {
  await expect(capturePa1Evidence(baseline, output, async path => {
    const invalid = Buffer.from('not a PNG'); writeFileSync(path, invalid); return invalid;
  })).rejects.toThrow('Invalid PNG header');
});
it('[PA1-H07] canonical destination is rejected before the writer runs', async () => {
  let called = false;
  await expect(capturePa1Evidence(baseline, baseline, async path => {
    called = true; return capture(path);
  })).rejects.toThrow('must not overwrite canonical baseline');
  expect(called).toBe(false); expect(readFileSync(baseline)).toEqual(png);
});
it('[PA1-H08] incorrect viewport width fails rather than updating the baseline', async () => {
  await expect(capturePa1Evidence(baseline, output, capture, { width: 320 })).rejects.toThrow('Screenshot width mismatch');
  expect(readFileSync(baseline)).toEqual(png);
});
