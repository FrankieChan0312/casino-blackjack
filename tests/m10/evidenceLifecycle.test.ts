import { expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

function fixture() {
  const directory = `.git/scanner-fixture-${randomUUID()}`, root = `${directory}/evidence`;
  mkdirSync(root, { recursive: true });
  return { directory, root, result: `${directory}/result.json` };
}
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
function scan(root: string, result: string) {
  const label = `scanner-${randomUUID()}`;
  const child = spawnSync('node', ['scripts/collect-evidence.mjs', label, 'powershell.exe', '-NoProfile', '-ExecutionPolicy', 'Bypass',
    '-File', 'scripts/scan-evidence.ps1', '-Roots', root, '-ResultPath', result], {
    encoding: 'utf8', env: { ...process.env, PSModulePath: `${root}/not-a-runtime-module-path` },
  });
  return { status: child.status, receipt: read(`.git/evidence-capture/${label}.json`) };
}
it('[PRE-CLOSE-H01] scanner and open collector output stay outside actual evidence; all files are inventoried', () => {
  const { root, result } = fixture();
  writeFileSync(`${root}/actual.log`, 'Synthetic local evidence');
  writeFileSync(`${root}/actual.json`, '{"synthetic":true}');
  writeFileSync(`${root}/screenshot.png`, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==', 'base64'));
  const run = scan(root, result), record = read(result);
  expect(run.status).toBe(0); expect(run.receipt.exitCode).toBe(0); expect(run.receipt.outputClosed).toBe(true);
  expect(record.status).toBe('PASS'); expect(record.files).toHaveLength(3);
  expect(record.findings).toEqual([]); expect(record.exclusions).toEqual([]);
});
it('[PRE-CLOSE-H02] actual logs and extensionless trace resources retain credential/bearer detection', () => {
  const { directory, root, result } = fixture();
  writeFileSync(`${root}/actual.log`, ['ghp', '_', 'a'.repeat(36)].join(''));
  mkdirSync(`${directory}/zip-input`);
  writeFileSync(`${directory}/zip-input/response`, ['Bearer', ' ', 'b'.repeat(32)].join(''));
  execFileSync('powershell.exe', ['-NoProfile', '-Command', `Add-Type -AssemblyName System.IO.Compression.FileSystem; [IO.Compression.ZipFile]::CreateFromDirectory('${directory}/zip-input', '${root}/trace.zip')`]);
  const run = scan(root, result), record = read(result);
  expect(run.status).toBe(1); expect(run.receipt.exitCode).toBe(1); expect(record.status).toBe('BLOCKED');
  expect(record.files).toHaveLength(2); expect(record.zipTextEntries).toHaveLength(1);
  expect(record.findings.map((finding: { type: string }) => finding.type).sort()).toEqual(['bearer', 'credential']);
  expect(record.zipTextEntries[0].entry).toBe('response');
});
it('[PRE-CLOSE-H03] scanner refuses its own result inside input rather than silently exclude evidence', () => {
  const { root } = fixture();
  expect(scan(root, `${root}/result.json`).status).toBe(1);
});
it('[PRE-CLOSE-H04] native stderr cannot turn a successful child into a PowerShell collection failure', () => {
  const label = `stderr-${randomUUID()}`;
  const run = spawnSync('node', ['scripts/collect-evidence.mjs', label, 'powershell.exe', '-NoProfile', '-Command',
    "[Console]::Error.WriteLine('native stderr sentinel'); exit 0"], { encoding: 'utf8' });
  expect(run.status).toBe(0);
  expect(read(`.git/evidence-capture/${label}.json`)).toMatchObject({ status: 'PASS', exitCode: 0, outputClosed: true });
  expect(readFileSync(`.git/evidence-capture/${label}.txt`, 'utf8')).toContain('native stderr sentinel');
});
