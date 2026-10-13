#!/usr/bin/env bash
# Auto-deploy Titik Jeda.
#  1) Jadikan working tree VM cermin repo (reset --hard; VM tidak punya commit lokal).
#  2) Bandingkan digest image lokal vs GHCR; pull + recreate HANYA stack titikjeda.
# Scope ketat: project + file compose dikunci. Tidak menyentuh aplikasi lain.
#
# Kenapa reset --hard aman: semua state yang harus bertahan (uploads, .env,
# .env.production, backups/) di-gitignore, jadi tidak tersentuh. Yang ter-reset
# hanya file yang memang dilacak Git (kode & konfigurasi) -- itu yang kita mau.
set -uo pipefail

PROJECT_DIR="/home/aldo/titikjeda"
COMPOSE_FILE="docker-compose.prod.yml"
NGINX_CONF="deploy/nginx/default.conf"
PROJECT_NAME="titikjeda"
LOG="$PROJECT_DIR/backups/autodeploy.log"
LOCK="/tmp/titikjeda-autodeploy.lock"

export PATH="/usr/local/bin:/usr/bin:/bin"

mkdir -p "$PROJECT_DIR/backups"

exec 9>"$LOCK"
flock -n 9 || exit 0

cd "$PROJECT_DIR" || exit 1

log() { printf '%s %s\n' "$(date '+%F %T')" "$*" >> "$LOG"; }

if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 4000 ]; then
  tail -n 2000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

sha() { sha256sum "$1" 2>/dev/null | awk '{print $1}'; }
remote_digest() { docker buildx imagetools inspect "$1" 2>/dev/null | awk '/^Digest:/{print $2; exit}'; }
local_digest()  { docker image inspect "$1" --format '{{index .RepoDigests 0}}' 2>/dev/null | sed 's/.*@//'; }

DC="docker compose -p $PROJECT_NAME -f $COMPOSE_FILE"

conf_before=$(sha "$NGINX_CONF")
compose_before=$(sha "$COMPOSE_FILE")

# ---------- 1. sinkron working tree dari git ----------
if git fetch -q origin main 2>/dev/null; then
  remote_sha=$(git rev-parse origin/main)
  if [ "$(git rev-parse HEAD)" != "$remote_sha" ]; then
    if git reset --hard "$remote_sha" >> "$LOG" 2>&1; then
      log "GIT: VM disinkronkan ke ${remote_sha:0:7}"
    else
      log "WARN: git reset gagal, pakai konfigurasi saat ini"
    fi
  fi
else
  log "WARN: git fetch gagal (jaringan?), pakai konfigurasi saat ini"
fi

conf_after=$(sha "$NGINX_CONF")
compose_after=$(sha "$COMPOSE_FILE")
conf_changed=0; compose_changed=0
[ "$conf_before" != "$conf_after" ] && conf_changed=1
[ "$compose_before" != "$compose_after" ] && compose_changed=1

# ---------- 2. bandingkan digest image ----------
images=$(grep -oE 'ghcr\.io/[^:[:space:]]+:main' "$COMPOSE_FILE" | sort -u)
[ -z "$images" ] && { log "SKIP: tidak ada image ghcr di $COMPOSE_FILE"; exit 0; }

need_pull=0
for img in $images; do
  l=$(local_digest "$img"); r=$(remote_digest "$img")
  if [ -z "$r" ]; then
    log "WARN: digest remote $img tidak terbaca, skip"
    continue
  fi
  if [ "$l" != "$r" ]; then
    log "UPDATE: $img  local=${l:-none}  remote=$r"
    need_pull=1
  fi
done

if [ "$need_pull" -eq 0 ] && [ "$conf_changed" -eq 0 ] && [ "$compose_changed" -eq 0 ]; then
  exit 0
fi

# ---------- 3. pull + recreate ----------
if [ "$need_pull" -eq 1 ]; then
  if ! $DC pull -q >> "$LOG" 2>&1; then
    log "ERROR: 'pull' gagal (registry tidak terjangkau?)"
    exit 1
  fi
fi

# bind mount mengikat inode: conf berubah -> frontend WAJIB di-recreate
if [ "$conf_changed" -eq 1 ]; then
  log "CONF: nginx conf berubah, force-recreate frontend"
  $DC up -d --force-recreate frontend >> "$LOG" 2>&1
fi

if $DC up -d >> "$LOG" 2>&1; then
  log "OK: stack diperbarui (image=$need_pull conf=$conf_changed compose=$compose_changed)"
else
  log "ERROR: 'up -d' gagal"
  exit 1
fi
