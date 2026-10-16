param(
    [string]$JarPath = "target\heliu-ai-backend-1.0.0.jar"
)

$ErrorActionPreference = "Stop"
$backendRoot = Split-Path -Parent $PSScriptRoot
$sourceJar = Join-Path $backendRoot $JarPath
$targetJar = Join-Path $backendRoot "dist\app.jar"

if (-not (Test-Path -LiteralPath $sourceJar)) {
    throw "Build output not found: $sourceJar. Run '.\mvnw.cmd clean package' first."
}

Copy-Item -LiteralPath $sourceJar -Destination $targetJar -Force
$item = Get-Item -LiteralPath $targetJar
$hash = (Get-FileHash -LiteralPath $targetJar -Algorithm SHA256).Hash
Write-Host "Updated: $($item.FullName)"
Write-Host "Size:    $([math]::Round($item.Length / 1MB, 2)) MB"
Write-Host "SHA256:  $hash"
