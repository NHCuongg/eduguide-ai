#!/usr/bin/env bash
# Daily Postgres backup. Dumps via `docker exec`, gzips, rotates to keep the
# last 7 days. Run from host cron — does NOT require port-mapping the DB.
#
# Install:
#   crontab -e
#   0 3 * * * /home/ubuntu/pet-manager/scripts/backup-db.sh >> /home/ubuntu/pet-manager/backups/backup.log 2>&1
set -Eeuo pipefail

CONTAINER="${CONTAINER:-pet-manager-db}"
DB="${POSTGRES_DB:-petmanager}"
USER="${POSTGRES_USER:-postgres}"
BACKUP_DIR="${BACKUP_DIR:-/home/ubuntu/pet-manager/backups}"
RETAIN_DAYS="${RETAIN_DAYS:-7}"

mkdir -p "$BACKUP_DIR"

ts="$(date -u +%Y%m%dT%H%M%SZ)"
out="$BACKUP_DIR/petmanager-$ts.sql.gz"

echo "[backup] $(date -u +%FT%TZ) starting → $out"

docker exec -e PGPASSWORD=postgres "$CONTAINER" \
    pg_dump -U "$USER" -d "$DB" --clean --if-exists --no-owner --no-privileges \
    | gzip -9 > "$out"

size=$(du -h "$out" | cut -f1)
echo "[backup] $(date -u +%FT%TZ) wrote $out ($size)"

# Rotate: delete dumps older than RETAIN_DAYS days.
find "$BACKUP_DIR" -maxdepth 1 -name 'petmanager-*.sql.gz' -mtime "+$RETAIN_DAYS" -print -delete \
    | sed 's/^/[backup] rotated /' || true
