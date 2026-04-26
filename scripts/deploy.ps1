<#
.SYNOPSIS
    Pet Manager — one-shot deploy for Windows (PowerShell 5.1+ / 7+).

.DESCRIPTION
    Wraps `docker compose` to build and run the full stack
    (Next.js app + PostgreSQL) on a clean Windows host.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1
    powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -Command fresh
    powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -Command logs
#>

[CmdletBinding()]
param(
    [ValidateSet('up','fresh','logs','down','status')]
    [string]$Command = 'up'
)

$ErrorActionPreference = 'Stop'
$RootDir = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $RootDir

function Write-Info($m)  { Write-Host "[i] $m" -ForegroundColor Cyan }
function Write-Ok($m)    { Write-Host "[ok] $m" -ForegroundColor Green }
function Write-Warn($m)  { Write-Host "[!] $m" -ForegroundColor Yellow }
function Write-Err($m)   { Write-Host "[x] $m" -ForegroundColor Red }

# ─── Resolve docker compose ──────────────────────────────────────────────────
function Resolve-Compose {
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        try {
            docker compose version | Out-Null
            return @('docker','compose')
        } catch { }
    }
    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        return @('docker-compose')
    }
    throw "Docker / Docker Compose not found. Install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/"
}

$DC = Resolve-Compose
function Invoke-Compose([Parameter(ValueFromRemainingArguments=$true)]$ArgList) {
    & $DC[0] @($DC[1..($DC.Count-1)] + $ArgList)
}

# ─── Pre-flight ──────────────────────────────────────────────────────────────
function Invoke-Preflight {
    try { docker info | Out-Null }
    catch { Write-Err "Docker daemon is not running. Start Docker Desktop first."; exit 1 }

    if (-not (Test-Path .env)) {
        Write-Warn ".env not found — copying from .env.example."
        Copy-Item .env.example .env
        # Generate a fresh AUTH_SECRET
        $secretBytes = New-Object byte[] 32
        [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($secretBytes)
        $secret = [Convert]::ToBase64String($secretBytes)
        (Get-Content .env) -replace 'please-generate-a-strong-random-value', $secret | Set-Content .env -Encoding UTF8
        Write-Ok "Generated AUTH_SECRET into .env"
    }
}

function Wait-Health([string]$Container, [int]$TimeoutSec = 120) {
    Write-Info "Waiting for $Container to become healthy (max ${TimeoutSec}s)..."
    $elapsed = 0
    while ($elapsed -lt $TimeoutSec) {
        $status = ''
        try { $status = docker inspect -f '{{.State.Health.Status}}' $Container 2>$null } catch { }
        switch ($status) {
            'healthy'   { Write-Ok "$Container is healthy"; return $true }
            'unhealthy' {
                Write-Err "$Container reported unhealthy"
                Invoke-Compose 'logs','--tail=80',$Container
                return $false
            }
            default { Start-Sleep -Seconds 2; $elapsed += 2 }
        }
    }
    Write-Err "Timed out waiting for $Container"
    Invoke-Compose 'logs','--tail=80',$Container
    return $false
}

function Get-AppPort {
    $line = Get-Content .env -ErrorAction SilentlyContinue | Where-Object { $_ -match '^\s*APP_PORT\s*=' } | Select-Object -First 1
    if (-not $line) { return '3002' }
    $value = ($line -split '=', 2)[1].Trim().Trim('"').Trim("'")
    if ([string]::IsNullOrWhiteSpace($value)) { return '3002' }
    return $value
}

switch ($Command) {
    'up' {
        Invoke-Preflight
        Write-Info "Building images..."
        Invoke-Compose 'build'
        Write-Info "Starting services..."
        Invoke-Compose 'up','-d'
        [void](Wait-Health 'pet-manager-db' 60)
        if (-not (Wait-Health 'pet-manager-app' 180)) {
            Invoke-Compose 'logs','--tail=120','app'
            exit 1
        }
        $port = Get-AppPort
        Write-Ok "Deployed -> http://localhost:$port"
    }
    'fresh' {
        Invoke-Preflight
        Write-Warn "Bringing everything down and wiping the database volume..."
        Invoke-Compose 'down','-v','--remove-orphans'
        Invoke-Compose 'build','--no-cache'
        Invoke-Compose 'up','-d'
        [void](Wait-Health 'pet-manager-db' 60)
        [void](Wait-Health 'pet-manager-app' 180)
        Write-Ok "Fresh deploy complete"
    }
    'logs'   { Invoke-Compose 'logs','-f','--tail=200' }
    'down'   { Invoke-Compose 'down'; Write-Ok "Containers stopped (data volume preserved)" }
    'status' { Invoke-Compose 'ps' }
}
