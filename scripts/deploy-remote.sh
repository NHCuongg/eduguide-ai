#!/usr/bin/env bash
# Deploy pet-manager to e1.chiasegpu.vn from a developer machine.
#
#   SSH_PASS=... scripts/deploy-remote.sh           # full: rsync, build, recreate
#   SSH_PASS=... scripts/deploy-remote.sh fast      # rsync + restart (no rebuild)
#   SSH_PASS=... scripts/deploy-remote.sh app       # rsync + rebuild app only
set -Eeuo pipefail

REMOTE_HOST="${REMOTE_HOST:-e1.chiasegpu.vn}"
REMOTE_USER="${REMOTE_USER:-ubuntu}"
REMOTE_PORT="${REMOTE_PORT:-19872}"
REMOTE_DIR="${REMOTE_DIR:-/home/ubuntu/pet-manager}"
SSH_PASS="${SSH_PASS:-}"
MODE="${1:-full}"

if [[ -z "$SSH_PASS" ]]; then
    echo "[deploy] SSH_PASS env var required" >&2
    exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ssh_cmd() {
    SSHPASS="$SSH_PASS" sshpass -e ssh -p "$REMOTE_PORT" \
        -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        "$REMOTE_USER@$REMOTE_HOST" "$@"
}

rsync_local() {
    SSHPASS="$SSH_PASS" sshpass -e rsync -az \
        -e "ssh -p $REMOTE_PORT -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
        --exclude '.git' --exclude 'node_modules' --exclude '.next' \
        --exclude '.env' --exclude '.env.local' --exclude 'docker-compose.override.yml' \
        --exclude '*.tsbuildinfo' --exclude '.claude' --exclude '*.log' \
        --exclude '/dist' --exclude 'backups' \
        ./ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
}

step() { echo "[deploy] $(date -u +%H:%M:%S) $*"; }

step "rsync source → $REMOTE_HOST:$REMOTE_DIR"
rsync_local

case "$MODE" in
    fast)
        step "fast mode — restart app"
        ssh_cmd "cd $REMOTE_DIR && docker compose -f docker-compose.yml restart app"
        ;;
    app)
        step "build app"
        ssh_cmd "cd $REMOTE_DIR && docker compose -f docker-compose.yml build app"
        step "recreate app"
        ssh_cmd "cd $REMOTE_DIR && docker compose -f docker-compose.yml up -d --force-recreate app"
        ;;
    full|*)
        step "build all images"
        ssh_cmd "cd $REMOTE_DIR && docker compose -f docker-compose.yml build app worker migrate"
        step "recreate stack (migrate runs as one-shot dep)"
        ssh_cmd "cd $REMOTE_DIR && docker compose -f docker-compose.yml up -d --force-recreate app worker"
        ;;
esac

step "health check"
sleep 4
ssh_cmd "curl -fsS http://localhost:3002/api/health > /dev/null && echo OK || (echo FAIL; exit 1)"

step "done"
