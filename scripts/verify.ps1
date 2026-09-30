$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$verificationExitCode = 0
$verificationLabel = 'M1 engineering verification'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
    $npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source
    $checks = @('typecheck', 'lint', 'test')
    # Historical isolated harness fixtures have no package.json. The actual
    # browser repository requires both additional checks, without opt-out flags.
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
