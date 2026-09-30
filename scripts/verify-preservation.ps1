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
        @{ Name = 'M6'; Sha = '681edc2bb49b5fcc221a6c4cbc2b3b26d4c81fa5'; Files = 9 }
    )
    $seen = @()
    foreach ($milestone in $milestones) {
        $all = @(& git -c "safe.directory=$repository" ls-tree -r --name-only $milestone.Sha tests)
        if ($LASTEXITCODE -ne 0) { throw 'Accepted Git objects unavailable' }
        $selected = @($all | Where-Object { $_ -match '\.test\.ts$' -and $_ -notin $seen })
        if ($selected.Count -ne $milestone.Files) { throw "Unexpected $($milestone.Name) suite inventory" }
        $unchanged = @($selected | Where-Object { $_ -ne 'tests/integration/behindRegression.test.ts' })
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
        Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'): independently rerunning $($milestone.Name) ($($selected.Count) files)"
        & npm.cmd test -- @selected
        if ($LASTEXITCODE -ne 0) { throw "$($milestone.Name) preservation failed (exit $LASTEXITCODE)" }
        Write-Host "PASS: $($milestone.Name) preservation"
        $seen += $selected
    }
}
catch { Write-Host "FAIL: $($_.Exception.Message)"; exit 1 }
finally { Pop-Location }
exit 0
