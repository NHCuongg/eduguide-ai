#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Pet Manager — one-shot deploy for Ubuntu / Debian / macOS
# Usage:
#   bash scripts/deploy.sh           # build + up
#   bash scripts/deploy.sh fresh     # destroy volume, build, up (data is wiped)
#   bash scripts/deploy.sh logs      # tail compose logs
#   bash scripts/deploy.sh down      # stop containers (keep data)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

CMD="${1:-up}"

# Color helpers
if [[ -t 1 ]]; then
  C_INFO=$'\033[1;34m'; C_OK=$'\033[1;32m'; C_WARN=$'\033[1;33m'; C_ERR=$'\033[1;31m'; C_END=$'\033[0m'
else
  C_INFO=""; C_OK=""; C_WARN=""; C_ERR=""; C_END=""
fi

log_info()  { printf "%s[i]%s %s\n" "$C_INFO" "$C_END" "$*"; }
log_ok()    { printf "%s[ok]%s %s\n" "$C_OK"   "$C_END" "$*"; }
log_warn()  { printf "%s[!]%s %s\n"  "$C_WARN" "$C_END" "$*"; }
log_err()   { printf "%s[x]%s %s\n"  "$C_ERR"  "$C_END" "$*" 1>&2; }

# ─── Resolve docker compose binary ─────────────────────────────────────────
DC=""
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  log_err "Docker / Docker Compose not found. Install Docker Desktop or:"
  log_err "  Ubuntu: sudo apt install docker.io docker-compose-plugin"
  exit 1
fi

# ─── Pre-flight ────────────────────────────────────────────────────────────
preflight() {
  if ! docker info >/dev/null 2>&1; then
    log_err "Docker daemon is not running. Start Docker and retry."
    exit 1
  fi
  if [[ ! -f .env ]]; then
    log_warn ".env not found — copying from .env.example. Open it and set AUTH_SECRET / API keys."
    cp .env.example .env
    if command -v openssl >/dev/null 2>&1; then
      SECRET="$(openssl rand -base64 32)"
      # macOS BSD sed compat
      if sed --version >/dev/null 2>&1; then
        sed -i "s|please-generate-a-strong-random-value|${SECRET}|" .env
      else
        sed -i '' "s|please-generate-a-strong-random-value|${SECRET}|" .env
      fi
      log_ok "Generated AUTH_SECRET into .env"
    fi
  fi
}

wait_for_health() {
  local container="$1" timeout="${2:-120}"
  log_info "Waiting for ${container} to become healthy (max ${timeout}s)…"
  local elapsed=0
  while (( elapsed < timeout )); do
    local status
    status="$(docker inspect -f '{{.State.Health.Status}}' "$container" 2>/dev/null || echo "missing")"
    case "$status" in
      healthy)   log_ok "$container is healthy"; return 0 ;;
      unhealthy) log_err "$container reported unhealthy"; $DC logs --tail=80 "$container" || true; return 1 ;;
      missing)   sleep 2 ;;
      *)         sleep 2 ;;
    esac
    elapsed=$((elapsed + 2))
  done
  log_err "Timed out waiting for $container"
  $DC logs --tail=80 "$container" || true
  return 1
}

case "$CMD" in
  up|"")
    preflight
    log_info "Building images…"
    $DC build
    log_info "Starting services…"
    $DC up -d
    wait_for_health pet-manager-db 60 || true
    wait_for_health pet-manager-app 180 || {
      log_err "App did not become healthy. Latest logs:"
      $DC logs --tail=120 app || true
      exit 1
    }
    APP_PORT="$(grep -E '^APP_PORT=' .env | cut -d= -f2 | tr -d '"' || true)"
    APP_PORT="${APP_PORT:-3002}"
    log_ok "Deployed → http://localhost:${APP_PORT}"
    ;;

  fresh)
    preflight
    log_warn "Bringing everything down and wiping the database volume…"
    $DC down -v --remove-orphans
    $DC build --no-cache
    $DC up -d
    wait_for_health pet-manager-db 60 || true
    wait_for_health pet-manager-app 180 || true
    log_ok "Fresh deploy complete"
    ;;

  logs)
    $DC logs -f --tail=200
    ;;

  down)
    $DC down
    log_ok "Containers stopped (data volume preserved)"
    ;;

  status)
    $DC ps
    ;;

  *)
    cat <<USAGE
Usage: bash scripts/deploy.sh [up|fresh|logs|down|status]

  up       Build images and bring the stack up (default)
  fresh    Tear down + wipe DB volume + rebuild
  logs     Tail logs
  down     Stop containers (keeps data)
  status   Show service status
USAGE
    exit 1
    ;;
esac
