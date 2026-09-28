import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { expect, test } from 'vitest';

// Execute the actual harness in isolation. A local npm.cmd reports controlled exits;
// this tests the wrapper, while the enclosing real harness runs real project checks.
test.each([
  ['none', 0], ['typecheck', 2], ['lint', 3], ['test', 4], ['unavailable', 1],
] as const)('verify.ps1 propagates %s with exit %i', (failure, code) => {
  const root = mkdtempSync(join(tmpdir(), 'blackjack-verify-'));
  const scripts = join(root, 'scripts');
  const harness = join(scripts, 'verify.ps1');
  const npm = join(root, 'npm.cmd');
  const trace = join(root, 'trace.txt');
  mkdirSync(scripts);
  try {
    copyFileSync(new URL('../scripts/verify.ps1', import.meta.url), harness);
    if (failure !== 'unavailable') {
      writeFileSync(npm, `@echo off\r\necho %2>> "%~dp0trace.txt"\r\nif "%2"=="${failure}" exit /b ${code}\r\nexit /b 0\r\n`);
    }
    const shell = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
    const child = spawnSync(shell, ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', harness], {
      cwd: tmpdir(), encoding: 'utf8', timeout: 15000,
      env: { ...process.env, Path: root, PATH: root, PATHEXT: '.COM;.EXE;.BAT;.CMD' },
    });
    expect(child.error).toBeUndefined();
    expect(child.status, child.stdout + child.stderr).toBe(code);
    if (failure === 'unavailable') {
      expect(child.stdout).toContain('BLOCKED:');
      expect(existsSync(trace)).toBe(false);
    } else {
      expect(readFileSync(trace, 'utf8').trim().split(/\r?\n/).map((line) => line.trim())).toEqual(['typecheck', 'lint', 'test']);
    }
    expect(child.stdout).toContain(code === 0 ? 'PASS: M1 engineering verification' : 'FAIL: M1 engineering verification');
  } finally {
    // Delete only this test's known temporary files/directories, never the repository.
    for (const file of [trace, npm, harness]) if (existsSync(file)) unlinkSync(file);
    rmdirSync(scripts);
    rmdirSync(root);
  }
}, 20000);
