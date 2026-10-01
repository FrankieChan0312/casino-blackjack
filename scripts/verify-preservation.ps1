$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
    $repository = (Get-Location).Path.Replace('\', '/')
    $milestones = @(
        @{ Name = 'M1'; Sha = 'd1d8966fe55af1bc2b9348e305135952b7723b70'; Files = 12 },
        @{ Name = 'M2'; Sha = 'c9f7f35bf874a0e7673505cbbea745ce035ac695'; Files = 6 },
        @{ Name = 'M3'; Sha = 'cca40d2bed3b3964a9bfb47329d49bb553fe610e'; Files = 5 },
        @{ Name = 'M4'; Sha = 'a5c6a22dd833867a6a1eff357a7462bd06fe4e0b'; Files = 7 },
        @{ Name = 'M5'; Sha = 'f4c564e8c7bebcdd546d95bd7a8718a9bc3a6a1d'; Files = 8 },
        @{ Name = 'M6'; Sha = '681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5'; Files = 9 },
        @{ Name = 'M7'; Sha = 'da6f068ffd27713848ed48f023c17ed388b8b44e'; Files = 9 }
    )
    $seen = @()
    foreach ($milestone in $milestones) {
        $all = @(& git -c "safe.directory=$repository" ls-tree -r --name-only $milestone.Sha tests)
        if ($LASTEXITCODE -ne 0) { throw 'Accepted Git objects unavailable' }
        $selected = @($all | Where-Object { $_ -match '\.test\.tsx?$' -and $_ -notin $seen })
        if ($selected.Count -ne $milestone.Files) { throw "Unexpected $($milestone.Name) suite inventory" }
        $exceptions = @('tests/integration/behindRegression.test.ts', 'tests/unit/browserShell.test.tsx', 'tests/integration/browserController.test.ts')
        $unchanged = @($selected | Where-Object { $_ -notin $exceptions })
        & git -c "safe.directory=$repository" diff --exit-code $milestone.Sha -- $unchanged
        if ($LASTEXITCODE -ne 0) { throw "$($milestone.Name) accepted assertions changed" }
        # REG-M6-095 alone has the explicitly authorized historical boundary.
        # All other M6 registrations are compared byte-for-byte with accepted M6.
        if ($milestone.Name -eq 'M6') {
            $baseline = (& git -c "safe.directory=$repository" show "$($milestone.Sha):tests/integration/behindRegression.test.ts") -join "`n"
            if ($LASTEXITCODE -ne 0) { throw 'M6 regression object unavailable' }
            $current = [IO.File]::ReadAllText((Join-Path $repository 'tests/integration/behindRegression.test.ts')).Replace("`r`n", "`n")
            foreach ($id in 1..94) {
                $pattern = '(?m)^reg\(' + $id + ',.*$'
                if ([regex]::Match($baseline, $pattern).Value -ne [regex]::Match($current, $pattern).Value -or
                    -not [regex]::IsMatch($current, $pattern)) { throw "REG-M6-$id changed" }
            }
        }
        if ($milestone.Name -eq 'M7') {
            foreach ($file in @('tests/unit/browserShell.test.tsx', 'tests/integration/browserController.test.ts')) {
                $baseline = (& git -c "safe.directory=$repository" show "$($milestone.Sha):$file") -join "`n"
                if ($LASTEXITCODE -ne 0) { throw 'M7 exception baseline unavailable' }
                $current = [IO.File]::ReadAllText((Join-Path $repository $file)).Replace("`r`n", "`n").TrimEnd()
                $current = $current.Replace("import { execFileSync } from 'node:child_process';`n", '').Replace("import ts from 'typescript';`n", '')
                if ($file -like '*browserShell*') {
                    $current = [regex]::Replace($current, '(?s)  // Authorized M8 historical absence boundary.*?  expect\(acceptedShell\)\.not\.toMatch\(/Charlie\|Replay\|Seed/\);', '  expect(html).not.toMatch(/Charlie|Replay|Seed/);')
                } else {
                    $current = [regex]::Replace($current, "(?s)  // M8 intentionally extends.*?  expect\(publicKeys.sort\(\)\)\.toEqual\(\['dispatch', 'getSnapshot', 'queryWager', 'subscribe'\]\);", "  expect(Object.keys(c).sort()).toEqual(['dispatch', 'getSnapshot', 'queryWager', 'subscribe']);")
                }
                if ($current -ne $baseline.TrimEnd()) { throw "Unapproved M7 assertion change: $file" }
            }
        }
        Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'): independently rerunning $($milestone.Name) ($($selected.Count) files)"
        $run = $selected
        if ($milestone.Name -eq 'M7') {
            $run = @($all | Where-Object { $_ -match '\.test\.tsx?$' })
            if ($run.Count -ne 56) { throw 'Accepted M7 inventory must remain 56 files' }
        }
        & npm.cmd test -- @run
        if ($LASTEXITCODE -ne 0) { throw "$($milestone.Name) preservation failed (exit $LASTEXITCODE)" }
        Write-Host "PASS: $($milestone.Name) preservation"
        $seen += $selected
        if ($milestone.Name -eq 'M7') {
            $browser = @($all | Where-Object { $_ -match '\.spec\.ts$' })
            if ($browser.Count -ne 2) { throw 'Accepted M7 browser inventory mismatch' }
            & npm.cmd run test:e2e -- @browser
            if ($LASTEXITCODE -ne 0) { throw 'Accepted M7 24 Chromium tests failed' }
            Write-Host 'PASS: M7 accepted Chromium inventory'
        }
    }
    # The owner accepted this exact M8 version before M9. Verify original
    # assertions mechanically and rerun its complete 956/44 inventory.
    & node scripts/check-m8-preservation.mjs
    if ($LASTEXITCODE -ne 0) { throw 'M8 source/assertion preservation failed' }
    $m8Sha = '8f5aca327f41f1078fc4fef20b611fd9cd494492'
    $m8Files = @(& git -c "safe.directory=$repository" ls-tree -r --name-only $m8Sha tests)
    if ($LASTEXITCODE -ne 0) { throw 'Accepted M8 Git objects unavailable' }
    $m8Unit = @($m8Files | Where-Object { $_ -match '\.test\.tsx?$' })
    $m8Browser = @($m8Files | Where-Object { $_ -match '\.spec\.ts$' })
    if ($m8Unit.Count -ne 66 -or $m8Browser.Count -ne 5) { throw 'Accepted M8 inventory mismatch' }
    Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'): independently rerunning accepted M8 (66 files / 956 tests)"
    & npm.cmd test -- @m8Unit
    if ($LASTEXITCODE -ne 0) { throw 'Accepted M8 Vitest preservation failed' }
    & npm.cmd run test:e2e -- @m8Browser
    if ($LASTEXITCODE -ne 0) { throw 'Accepted M8 44 Chromium tests failed' }
    Write-Host 'PASS: M8 accepted 956 Vitest / 44 Chromium inventory'
}
catch { Write-Host "FAIL: $($_.Exception.Message)"; exit 1 }
finally { Pop-Location }
exit 0
