import { copyFileSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';
function harness(withTool: boolean) {
  const root=mkdtempSync(join(tmpdir(),'blackjack-m8-harness-'));
  try {
    mkdirSync(join(root,'scripts'));copyFileSync('scripts/verify.ps1',join(root,'scripts/verify.ps1'));
    writeFileSync(join(root,'package.json'),'{"name":"casino-blackjack"}');
    writeFileSync(join(root,'npm.cmd'),'@echo off\r\nexit /b 0\r\n');
    if(withTool)writeFileSync(join(root,'scripts/verify-preservation.ps1'),"Write-Host 'Preservation fixture executed'\nexit 8\n");
    const child=spawnSync(join(process.env.SystemRoot ?? 'C:\\Windows','System32/WindowsPowerShell/v1.0/powershell.exe'),
      ['-NoProfile','-ExecutionPolicy','Bypass','-File',join(root,'scripts/verify.ps1')],
      {encoding:'utf8',timeout:15000,env:{...process.env,Path:root,PATH:root,PATHEXT:'.COM;.EXE;.BAT;.CMD'}});
    expect(child.error).toBeUndefined();return {code:child.status,output:child.stdout+child.stderr};
  } finally { rmSync(root,{recursive:true,force:true}); }
}
it('[REG-M8-077] full project harness propagates independent preservation failure instead of claiming PASS',()=>{
  const result=harness(true);expect(result.code,result.output).toBe(8);expect(result.output).toContain('Preservation fixture executed');
  expect(result.output).toContain('FAIL: preservation (exit 8)');
},20000);
it('[REG-M8-078] full project harness BLOCKED when required preservation tool is missing',()=>{
  const result=harness(false);expect(result.code,result.output).toBe(1);expect(result.output).toContain('BLOCKED: Required preservation tool unavailable');
},20000);
