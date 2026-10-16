param(
    [string]$ApiKey = "",
    [int]$Port = 8080
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$envFile = Join-Path $root ".env"

if (-not $ApiKey -and (Test-Path -LiteralPath $envFile)) {
    Get-Content -LiteralPath $envFile | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) { return }
        $parts = $line.Split("=", 2)
        $name = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"').Trim("'")
        if (-not [Environment]::GetEnvironmentVariable($name, "Process")) {
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

if (-not $ApiKey) { $ApiKey = $env:DEEPSEEK_API_KEY }
if (-not $ApiKey) {
    throw "DEEPSEEK_API_KEY is empty. Copy .env.example to .env and fill in a real key."
}

$env:HELIU_AI_PROVIDER = "deepseek"
$env:DEEPSEEK_API_KEY = $ApiKey
if (-not $env:DEEPSEEK_MODEL) { $env:DEEPSEEK_MODEL = "deepseek-chat" }
if (-not $env:DEEPSEEK_BASE_URL) { $env:DEEPSEEK_BASE_URL = "https://api.deepseek.com" }

$jar = Join-Path $root "..\dist\app.jar"
if (-not (Test-Path -LiteralPath $jar)) {
    throw "Backend jar not found: $jar"
}

Write-Host "Starting Heliu AI with DeepSeek API..."
Write-Host "Provider: deepseek"
Write-Host "Model:    $env:DEEPSEEK_MODEL"
Write-Host "Port:     $Port"
Write-Host "Data dir: $(Join-Path $root 'data')"

Push-Location $root
try {
    & java -jar $jar "--server.port=$Port" "--heliu.seed-demo-data=false" "--spring.config.additional-location=optional:file:./config/" @args
} finally {
    Pop-Location
}

