import { spawnSync, execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import process from 'node:process';
import { Buffer } from 'node:buffer';

// Task-local evidence recorder; preserves failed output before any subsequent run.
const [, , name, ...parts] = process.argv;
const command = parts.join(' ');
const timestamp = () => execFileSync('powershell.exe', ['-NoProfile', '-Command', 'Get-Date -Format "yyyy-MM-dd HH:mm:ss K"']).toString().trim();
const started = timestamp();
const result = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', "$ErrorActionPreference = 'Stop'; " + command], { maxBuffer: 100 * 1024 * 1024 });
const output = Buffer.concat([result.stdout ?? Buffer.alloc(0), result.stderr ?? Buffer.alloc(0)]);
writeFileSync(`docs/M10_T05_EVIDENCE/${name}.log.gz`, gzipSync(output));
const receipt = { command, started, finished: timestamp(), exit: result.status, error: result.error?.message };
writeFileSync(`docs/M10_T05_EVIDENCE/${name}.json`, JSON.stringify(receipt, null, 2) + '\n');
process.stdout.write(output.toString().split(/\r?\n/).slice(-22).join('\n'));
process.stdout.write('\n' + JSON.stringify(receipt) + '\n');
process.exit(result.status ?? 1);
