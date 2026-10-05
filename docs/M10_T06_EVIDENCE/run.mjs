import { spawnSync, execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import process from 'node:process';
import { Buffer } from 'node:buffer';

const [, , name, ...parts] = process.argv;
const prefix = `docs/M10_T06_EVIDENCE/${name}`;
if (existsSync(prefix + '.json')) throw Error('Evidence already exists: ' + name);
const command = parts.join(' ');
const timestamp = () => execFileSync('powershell.exe', ['-NoProfile', '-Command', 'Get-Date -Format "yyyy-MM-dd HH:mm:ss K"']).toString().trim();
const started = timestamp();
const result = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', "$ErrorActionPreference = 'Stop'; " + command], { maxBuffer: 100 * 1024 * 1024 });
const output = Buffer.concat([result.stdout ?? Buffer.alloc(0), result.stderr ?? Buffer.alloc(0)]);
writeFileSync(prefix + '.log.gz', gzipSync(output));
const receipt = { command, started, finished: timestamp(), exit: result.status, error: result.error?.message };
writeFileSync(prefix + '.json', JSON.stringify(receipt, null, 2) + '\n');
process.stdout.write(output.toString().split(/\r?\n/).slice(-22).join('\n') + '\n' + JSON.stringify(receipt) + '\n');
process.exit(result.status ?? 1);
