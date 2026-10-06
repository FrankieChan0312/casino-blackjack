import { spawn } from 'node:child_process';
import console from 'node:console';
import { closeSync, mkdirSync, openSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

// Keep native stdout/stderr outside scan targets until the child and file close.
const [label, command, ...args] = process.argv.slice(2);
if (!label || !/^[a-zA-Z0-9-]+$/.test(label) || !command) {
  throw new Error('Usage: node scripts/collect-evidence.mjs LABEL COMMAND [ARGS]');
}
const directory = join('.git', 'evidence-capture');
mkdirSync(directory, { recursive: true });
const log = join(directory, `${label}.txt`);
const receipt = join(directory, `${label}.json`);
const fd = openSync(log, 'w');
const start = new Date().toISOString();
const env = { ...process.env };
const resetModuleVariables = [];
// Windows PowerShell must discover its own modules rather than inherit pwsh's.
if (/(^|[\\/])powershell(?:\.exe)?$/i.test(command)) {
  for (const key of Object.keys(env)) if (key.toLowerCase() === 'psmodulepath') {
    resetModuleVariables.push(key); delete env[key];
  }
}
const child = spawn(command, args, { stdio: ['ignore', fd, fd], windowsHide: true, env });
let launchError;
child.on('error', error => { launchError = error.message; });
child.on('close', (code, signal) => {
  closeSync(fd);
  const record = { start, finish: new Date().toISOString(), command, args, log,
    status: launchError || code === null ? 'BLOCKED' : code === 0 ? 'PASS' : 'FAIL',
    exitCode: code, signal, launchError, outputClosed: true, resetModuleVariables };
  writeFileSync(receipt, `${JSON.stringify(record, null, 2)}\n`);
  console.log(JSON.stringify({ ...record, receipt }));
  process.exitCode = code ?? 1;
});
