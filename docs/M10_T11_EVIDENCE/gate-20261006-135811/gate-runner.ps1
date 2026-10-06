$Task = 'T11'
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
    $runId = Get-Date -Format 'yyyyMMdd-HHmmss'
    $evidence = "docs/M10_${Task}_EVIDENCE/gate-$runId"
    $backup = ".git/m10-animation-$Task-$runId"
    New-Item -ItemType Directory -Path $evidence, $backup -Force | Out-Null
    # Existing tests write these historical outputs. Preserve their exact bytes,
    # archive each new generated version, then restore captured originals.
    $outputs = @(git ls-files docs/images docs/M10_T01_EVIDENCE docs/M10_T06_EVIDENCE/screenshots docs/M10_T06_EVIDENCE/reduced-seven-settled.png |
        Where-Object { $_ -match '\.(png|json)$' })
    if ($LASTEXITCODE -ne 0) { throw 'Cannot capture tracked historical output inventory' }
    $originals = @{}
    foreach ($path in $outputs) {
        $bytes = [IO.File]::ReadAllBytes((Join-Path (Get-Location) $path))
        $originals[$path] = $bytes
        $target = Join-Path $backup $path
        New-Item -ItemType Directory -Path (Split-Path $target) -Force | Out-Null
        [IO.File]::WriteAllBytes($target, $bytes)
    }
    $freezePaths = @(git ls-files --cached --others --exclude-standard src tests scripts art public package.json package-lock.json tsconfig.json tsconfig.domain.json vite.config.ts playwright.config.ts eslint.config.mjs)
    if ($LASTEXITCODE -ne 0) { throw 'Executable inventory unavailable' }
    $freeze = @{}
    foreach ($path in $freezePaths) { $freeze[$path] = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash }
    ConvertTo-Json -InputObject $freeze -Depth 3 | Set-Content -LiteralPath (Join-Path $evidence 'executable-freeze.json') -Encoding UTF8
    Copy-Item -LiteralPath $PSCommandPath -Destination (Join-Path $evidence 'gate-runner.ps1')
    $receipts = @()
    $gateFailed = $false
    foreach ($stage in @('units', 'chromium', 'preservation', 'current-preservation', 'live-guard', 'dealer-assets', 'generic-assets', 'generic-reproduction', 'player-assets', 'unified')) {
        $start = Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'
        Write-Host "$start START $Task $stage"
        $log = Join-Path $evidence "$stage.txt"
        switch ($stage) {
            'units' { & cmd.exe /d /c "npm.cmd test > $log 2>&1" }
            'chromium' { & cmd.exe /d /c "npm.cmd run test:e2e > $log 2>&1" }
            'preservation' { & cmd.exe /d /c "powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/verify-preservation.ps1 > $log 2>&1" }
            'current-preservation' { & cmd.exe /d /c "npm.cmd test -- tests/m10 tests/pa1 tests/ra1 tests/m9 tests/harness.test.ts tests/unit/portfolio.test.ts > $log 2>&1" }
            'live-guard' { & cmd.exe /d /c "node scripts/check-live-dealer.mjs > $log 2>&1" }
            'generic-assets' { & cmd.exe /d /c "node scripts/verify-generic-dealer.mjs > $log 2>&1" }
            'generic-reproduction' { & cmd.exe /d /c "node scripts/build-generic-dealer.mjs --check > $log 2>&1" }
            'dealer-assets' { & cmd.exe /d /c "node scripts/verify-dealer-assets.mjs > $log 2>&1" }
            'player-assets' { & cmd.exe /d /c "node scripts/verify-character-assets.mjs > $log 2>&1" }
            'unified' { & cmd.exe /d /c "powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/verify.ps1 > $log 2>&1" }
        }
        $code = $LASTEXITCODE
        $finish = Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'
        $status = if ($code -eq 0) { 'PASS' } else { 'FAIL' }
        $receipts += @{ stage = $stage; start = $start; finish = $finish; exitCode = $code; status = $status; log = $log }
        # Native command evidence survives a later artifact I/O failure.
        ConvertTo-Json -InputObject $receipts -Depth 5 | Set-Content -LiteralPath (Join-Path $evidence 'receipts.json') -Encoding UTF8
        if ($stage -in @('chromium', 'preservation', 'unified') -and (Test-Path -LiteralPath test-results)) {
            Copy-Item -LiteralPath test-results -Destination (Join-Path $evidence "$stage-browser-artifacts") -Recurse
        }
        $generated = @()
        foreach ($path in $outputs) {
            $absolute = Join-Path (Get-Location) $path
            $current = [IO.File]::ReadAllBytes($absolute)
            $hash = [Convert]::ToBase64String([Security.Cryptography.SHA256]::Create().ComputeHash($current))
            $originalHash = [Convert]::ToBase64String([Security.Cryptography.SHA256]::Create().ComputeHash($originals[$path]))
            if ($hash -ne $originalHash) {
                $archive = Join-Path $evidence "${stage}-generated/$path"
                New-Item -ItemType Directory -Path (Split-Path $archive) -Force | Out-Null
                [IO.File]::WriteAllBytes($archive, $current)
                # Never truncate a mapped historical image. Swap captured bytes
                # on the same volume and retain the displaced generated file.
                $replacement = [IO.Path]::GetFullPath((Join-Path $backup "${stage}-replacement/$path"))
                $displaced = [IO.Path]::GetFullPath((Join-Path $backup "${stage}-displaced/$path"))
                $repoRoot = (Get-Location).Path + [IO.Path]::DirectorySeparatorChar
                foreach ($checkedPath in @($absolute, $replacement, $displaced)) {
                    $resolved = [IO.Path]::GetFullPath($checkedPath)
                    if (-not $resolved.StartsWith($repoRoot, [StringComparison]::OrdinalIgnoreCase)) { throw 'Output swap outside repository' }
                }
                New-Item -ItemType Directory -Path (Split-Path $replacement), (Split-Path $displaced) -Force | Out-Null
                [IO.File]::WriteAllBytes($replacement, $originals[$path])
                [IO.File]::Replace($replacement, $absolute, $displaced)
                $restored = [Convert]::ToBase64String([Security.Cryptography.SHA256]::Create().ComputeHash([IO.File]::ReadAllBytes($absolute)))
                if ($restored -ne $originalHash) { throw "Historical output restore failed: $path" }
                $generated += @{ path = $path; originalSHA256Base64 = $originalHash; generatedSHA256Base64 = $hash; restored = $true }
            }
        }
        ConvertTo-Json -InputObject $generated -Depth 5 | Set-Content -LiteralPath (Join-Path $evidence "$stage-output-preservation.json") -Encoding UTF8
        ConvertTo-Json -InputObject $receipts -Depth 5 | Set-Content -LiteralPath (Join-Path $evidence 'receipts.json') -Encoding UTF8
        Write-Host "$finish $status $Task $stage exit $code"
        Get-Content -LiteralPath $log -Tail 8
        if ($code -ne 0) { $gateFailed = $true; break }
    }
    if ($gateFailed) { exit 1 }
    & git diff --exit-code e7ceea652dd74ef079d933922668c782304dc31f -- src/domain src/browser src/presentation src/ui/App.tsx src/ui/Table.tsx src/ui/PresentationProvider.tsx src/ui/styles.css src/ui/CasinoPerson.tsx art public package.json package-lock.json ':(exclude)src/presentation/genericDealer.ts' ':(exclude)art/source/dealers/generic_female' ':(exclude)public/characters/dealer/generic_female'
    if ($LASTEXITCODE -ne 0) { throw 'Protected authority/assets/dependencies changed' }
    foreach ($path in $freezePaths) {
        if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash -ne $freeze[$path]) { throw "Verified executable changed: $path" }
    }
    Write-Host "PASS: $Task complete Dealer cleanup technical gate; executable freeze unchanged"
}
catch { Write-Host "BLOCKED: $($_.Exception.Message)"; exit 1 }
finally { Pop-Location }
exit 0
