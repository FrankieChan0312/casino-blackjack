param(
    [string[]]$Roots = @('docs/M10_T11_EVIDENCE', 'docs/M10_PRE_CLOSE_EVIDENCE', 'src', 'tests', 'scripts'),
    [string]$ResultPath = '.git/evidence-capture/privacy-result.json'
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Add-Type -AssemblyName System.IO.Compression.FileSystem
$resolvedRoots = @($Roots | ForEach-Object { (Resolve-Path -LiteralPath $_).Path })
$result = [IO.Path]::GetFullPath((Join-Path (Get-Location).Path $ResultPath))
foreach ($root in $resolvedRoots) {
    if ($result -eq $root -or $result.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Scanner result must be outside every scan target; no evidence is excluded'
    }
}
# Same T11 privacy patterns. No path, trace-resource or finding exclusions.
$patterns = @{
    credential = '(?<![A-Za-z0-9])(?:gh[opusr]_[A-Za-z0-9]{30,}|sk-(?:proj-)?[A-Za-z0-9_-]{24,}|AIza[A-Za-z0-9_-]{30,}|AKIA[A-Z0-9]{16}|-----BEGIN [^-]*PRIVATE KEY-----)'
    bearer = '(?i)Bearer\s+[A-Za-z0-9._~+/-]{16,}'
    viteEphemeralToken = '(?i)wsToken\s*=\s*(?:\\?"|\x27)[^"\x27]{6,}'
}
$files = @(); $entries = @(); $findings = @()
function Inspect([string]$body, [string]$location) {
    foreach ($key in $patterns.Keys) {
        $matches = [regex]::Matches($body, $patterns[$key])
        if ($matches.Count -gt 0) { $script:findings += @{ path = $location; type = $key; count = $matches.Count } }
    }
}
foreach ($root in $resolvedRoots) {
    foreach ($file in Get-ChildItem -LiteralPath $root -Recurse -File) {
        $location = $file.FullName
        # Images/binary artifacts stay in the SHA inventory; synthetic screenshot
        # provenance and visual inspection supplement, rather than claim, OCR.
        $files += @{ path = $location; sha256 = (Get-FileHash -LiteralPath $location -Algorithm SHA256).Hash }
        if ($file.Extension -match '^\.(txt|log|md|json|ps1|mjs|cjs|js|ts|tsx|css|svg)$') {
            Inspect ([IO.File]::ReadAllText($location)) $location
        }
        if ($file.Extension -eq '.zip') {
            $zip = [IO.Compression.ZipFile]::OpenRead($location)
            try {
                foreach ($entry in $zip.Entries) {
                    if ($entry.Length -eq 0 -or $entry.FullName -match '\.(png|jpg|jpeg|gif|woff2?|ttf|mp4)$') { continue }
                    $reader = [IO.StreamReader]::new($entry.Open())
                    try { $body = $reader.ReadToEnd() } finally { $reader.Dispose() }
                    Inspect $body ($location + ':' + $entry.FullName)
                    $entries += @{ archive = $location; entry = $entry.FullName }
                }
            } finally { $zip.Dispose() }
        }
    }
}
$record = @{ at = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'); status = if ($findings.Count -eq 0) { 'PASS' } else { 'BLOCKED' }
    files = $files; zipTextEntries = $entries; findings = $findings; roots = $resolvedRoots; exclusions = @()
    scope = 'All artifact hashes; original privacy patterns over text and non-image/font trace resources including extensionless resources. No OCR certification. Collector/result files outside targets.' }
New-Item -ItemType Directory -Path (Split-Path -Parent $result) -Force | Out-Null
$record | ConvertTo-Json -Depth 7 | Set-Content -LiteralPath $result -Encoding UTF8
Write-Output "$($record.status): $($files.Count) files / $($entries.Count) trace entries; findings $($findings.Count)"
foreach ($finding in $findings) { Write-Output "$($finding.type): $($finding.path) count $($finding.count)" }
if ($findings.Count -gt 0) { exit 1 }; exit 0
