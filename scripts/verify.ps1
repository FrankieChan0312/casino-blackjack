$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$verificationExitCode = 0
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
    $npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source

    foreach ($check in @('typecheck', 'lint', 'test')) {
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
    Write-Host 'PASS: M1 engineering verification'
}
else {
    Write-Host "FAIL: M1 engineering verification (exit $verificationExitCode)"
}

exit $verificationExitCode
