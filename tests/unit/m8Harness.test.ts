import { copyFileSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';
async function harness(withTool: boolean) {
  const root=mkdtempSync(join(tmpdir(),'blackjack-m8-harness-'));
  try {
    mkdirSync(join(root,'scripts'));copyFileSync('scripts/verify.ps1',join(root,'scripts/verify.ps1'));
    writeFileSync(join(root,'package.json'),'{"name":"casino-blackjack"}');
    writeFileSync(join(root,'npm.cmd'),'@echo off\r\nexit /b 0\r\n');
    if(withTool)writeFileSync(join(root,'scripts/verify-preservation.ps1'),"Write-Host 'Preservation fixture executed'\nexit 8\n");
    const child=spawnSync(join(process.env.SystemRoot ?? 'C:\\Windows','System32/WindowsPowerShell/v1.0/powershell.exe'),
      ['-NoProfile','-ExecutionPolicy','Bypass','-File',join(root,'scripts/verify.ps1')],
      {encoding:'utf8',timeout:15000,env:{...process.env,Path:root,PATH:root,PATHEXT:'.COM;.EXE;.BAT;.CMD'}});
    expect(child.error).toBeUndefined();expect(child.status).not.toBeNull();return {code:child.status,output:child.stdout+child.stderr};
  } finally {
    // spawnSync has returned; Windows can briefly retain a fixture handle after process exit.
    // Await mandatory cleanup; known transient errors retry, then still reject on exhaustion.
    await rm(root,{recursive:true,force:true,maxRetries:3,retryDelay:100});
  }
}
it('[REG-M8-077] full project harness propagates independent preservation failure instead of claiming PASS',async()=>{
  const result=await harness(true);expect(result.code,result.output).toBe(8);expect(result.output).toContain('Preservation fixture executed');
  expect(result.output).toContain('FAIL: preservation (exit 8)');
},20000);
it('[REG-M8-078] full project harness BLOCKED when required preservation tool is missing',async()=>{
  const result=await harness(false);expect(result.code,result.output).toBe(1);expect(result.output).toContain('BLOCKED: Required preservation tool unavailable');
},20000);
