import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { expect, test } from 'vitest';

test.each([['none', 0], ['typecheck:domain', 5], ['build', 6], ['test:e2e', 7]] as const)(
  'browser harness propagates %s exit %i and runs every required check', (failure, code) => {
    const root = mkdtempSync(join(tmpdir(), 'blackjack-browser-verify-'));
    try {
      mkdirSync(join(root, 'scripts'));
      const harness = join(root, 'scripts/verify.ps1');
      copyFileSync('scripts/verify.ps1', harness);
      writeFileSync(join(root, 'package.json'), '{}');
      writeFileSync(join(root, 'npm.cmd'), `@echo off\r\necho %2>> "%~dp0trace.txt"\r\nif "%2"=="${failure}" exit /b ${code}\r\nexit /b 0\r\n`);
      const child = spawnSync(join(process.env.SystemRoot ?? 'C:\\Windows', 'System32/WindowsPowerShell/v1.0/powershell.exe'),
        ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', harness],
        { encoding: 'utf8', timeout: 15000, env: { ...process.env, Path: root, PATH: root, PATHEXT: '.COM;.EXE;.BAT;.CMD' } });
      expect(child.error).toBeUndefined();
      expect(child.status, child.stdout + child.stderr).toBe(code);
      expect(readFileSync(join(root, 'trace.txt'), 'utf8').trim().split(/\r?\n/)).toEqual(['typecheck', 'lint', 'test', 'typecheck:domain', 'build', 'test:e2e']);
    } finally {
      // mkdtemp creates this test-owned directory; never target the repository.
      rmSync(root, { recursive: true, force: true });
    }
  }, 20000);
