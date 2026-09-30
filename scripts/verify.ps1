$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$verificationExitCode = 0
$verificationLabel = 'M1 engineering verification'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
    $npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source
    $checks = @('typecheck', 'lint', 'test')
    # Historical isolated harness fixtures have no package.json. The actual
    # browser repository requires every additional check, without opt-out flags.
    if (Test-Path -LiteralPath 'package.json') {
        $checks += @('typecheck:domain', 'build', 'test:e2e')
        $verificationLabel = 'engineering verification'
    }
    foreach ($check in $checks) {
        Write-Host "Running: npm run $check"
        & $npmCommand run $check
        $checkExitCode = $LASTEXITCODE

        if ($checkExitCode -ne 0) {
            Write-Host "FAIL: $check (exit $checkExitCode)"
            if ($verificationExitCode -eq 0) {
                $verificationExitCode = $checkExitCode
            }
        }
        else {
            Write-Host "PASS: $check"
        }
    }
    # The real portfolio requires independent historical preservation. Isolated
    # harness fixtures have no project identity or Git history.
    if (Test-Path -LiteralPath 'package.json') {
        $projectName = (Get-Content -LiteralPath 'package.json' -Raw | ConvertFrom-Json).PSObject.Properties['name']
        if ($null -ne $projectName -and $projectName.Value -eq 'casino-blackjack') {
            if (-not (Test-Path -LiteralPath 'scripts/verify-preservation.ps1')) { throw 'Required preservation tool unavailable' }
            & (Join-Path $env:SystemRoot 'System32/WindowsPowerShell/v1.0/powershell.exe') -NoProfile -ExecutionPolicy Bypass -File scripts/verify-preservation.ps1
            $preservationExitCode = $LASTEXITCODE
            if ($preservationExitCode -ne 0) {
                Write-Host "FAIL: preservation (exit $preservationExitCode)"
                if ($verificationExitCode -eq 0) { $verificationExitCode = $preservationExitCode }
            } else { Write-Host 'PASS: preservation' }
        }
    }
}
catch {
    Write-Host "BLOCKED: $($_.Exception.Message)"
    $verificationExitCode = 1
}
finally {
    Pop-Location
}

if ($verificationExitCode -eq 0) {
    Write-Host "PASS: $verificationLabel"
}
else {
    Write-Host "FAIL: $verificationLabel (exit $verificationExitCode)"
}

exit $verificationExitCode
