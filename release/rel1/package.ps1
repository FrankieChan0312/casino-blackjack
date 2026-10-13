param([Parameter(Mandatory=$true)][string]$OutputDirectory)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$relOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
if (Test-Path -LiteralPath $relOutput) { throw 'Use a new output directory; retain previous candidates.' }
& node (Join-Path $PSScriptRoot 'prepare-package.mjs') $relOutput
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$relZip = Join-Path $relOutput 'casino-interview-demo-v1.0.0.zip'
[System.IO.Compression.ZipFile]::CreateFromDirectory((Join-Path $relOutput 'casino-interview-demo'), $relZip, [System.IO.Compression.CompressionLevel]::Optimal, $true)
$relItem = Get-Item -LiteralPath $relZip
$relHash = (Get-FileHash -LiteralPath $relZip -Algorithm SHA256).Hash.ToLowerInvariant()
[System.IO.File]::WriteAllText((Join-Path $relOutput 'SHA256SUMS.txt'), "$relHash  casino-interview-demo-v1.0.0.zip`n", [System.Text.UTF8Encoding]::new($false))
if ($relItem.Length -gt 20MB) { throw "Compressed acceptance failed: $($relItem.Length) bytes exceeds 20 MiB. Candidate retained." }
[pscustomobject]@{status='PASS';zip=$relZip;bytes=$relItem.Length;MiB=($relItem.Length/1MB);sha256=$relHash} | ConvertTo-Json
