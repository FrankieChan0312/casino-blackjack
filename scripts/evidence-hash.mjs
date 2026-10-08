import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { Buffer } from 'node:buffer';

export async function hashStream(stream) {
  const hash = createHash('sha256');
  let bytes = 0, maxChunkBytes = 0;
  for await (const chunk of stream) {
    hash.update(chunk);
    bytes += chunk.length;
    maxChunkBytes = Math.max(maxChunkBytes, chunk.length);
  }
  return { sha256: hash.digest('hex'), bytes, maxChunkBytes };
}

// Keep ordinary diagnostics small. Spill oversized stderr to disk without losing
// bytes; the failure reports its complete diagnostic file and a bounded preview.
async function drainStderr(stream) {
  const limit = 64 * 1024, chunks = [];
  let bytes = 0, directory, fd;
  try {
    for await (const chunk of stream) {
      if (fd === undefined && bytes + chunk.length > limit) {
        directory = fs.mkdtempSync(path.join(tmpdir(), 'blackjack-h2-git-'));
        fd = fs.openSync(path.join(directory, 'stderr'), 'wx');
        for (const previous of chunks) fs.writeFileSync(fd, previous);
      }
      if (fd !== undefined) fs.writeFileSync(fd, chunk);
      if (bytes < limit) chunks.push(chunk.subarray(0, limit - bytes));
      bytes += chunk.length;
    }
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  return { stderr: Buffer.concat(chunks).toString('utf8'), stderrBytes: bytes,
    stderrFile: directory ? path.join(directory, 'stderr') : null };
}

export async function hashGitBlob(file, { cwd } = {}) {
  const args = ['-c', 'core.safecrlf=false', 'show', ':' + file];
  const child = spawn('git', args, { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const closed = new Promise(resolve => {
    let error;
    child.on('error', failure => { error = failure; });
    child.on('close', (exitCode, signal) => resolve({ exitCode, signal, error }));
  });
  const [output, diagnostics, result] = await Promise.all([
    hashStream(child.stdout).then(value => ({ value }), error => ({ error })),
    drainStderr(child.stderr).then(value => ({ value }), error => ({ error })),
    closed,
  ]);
  if (result.error || result.exitCode !== 0 || output.error || diagnostics.error) {
    const error = new Error('Git staged SHA256 failed: ' + file +
      ' (exit ' + result.exitCode + ', signal ' + result.signal + ')\n' +
      (diagnostics.value?.stderr ?? '') +
      (diagnostics.value?.stderrFile ? '\nComplete stderr: ' + diagnostics.value.stderrFile : ''),
    { cause: result.error ?? output.error ?? diagnostics.error });
    Object.assign(error, { command: 'git', args, operation: 'staged SHA256', path: file,
      exitCode: result.exitCode, signal: result.signal, ...diagnostics.value });
    throw error;
  }
  if (diagnostics.value.stderrFile) fs.rmSync(path.dirname(diagnostics.value.stderrFile), { recursive: true });
  return output.value;
}
