#!/usr/bin/env bash
# Auto-deploy Titik Jeda: pull image GHCR terbaru, recreate HANYA stack titikjeda.
# Scope ketat: file compose + project name dikunci. Tidak menyentuh app lain.
set -uo pipefail

PROJECT_DIR="/home/aldo/titikjeda"
COMPOSE_FILE="docker-compose.prod.yml"
PROJECT_NAME="titikjeda"
LOG="$PROJECT_DIR/backups/autodeploy.log"
LOCK="/tmp/titikjeda-autodeploy.lock"

export PATH="/usr/local/bin:/usr/bin:/bin"

mkdir -p "$PROJECT_DIR/backups"

# --- single-instance lock (jangan tumpang tindih kalau pull lama) ---
exec 9>"$LOCK"
if ! flock -n 9; then
  exit 0
fi

cd "$PROJECT_DIR" || exit 1

log() { printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >> "$LOG"; }

# batasi ukuran log (max ~2000 baris terakhir)
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 4000 ]; then
  tail -n 2000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

DC="docker compose -p $PROJECT_NAME -f $COMPOSE_FILE"

# digest INDEX di registry (buildx imagetools -> sama format dgn RepoDigests).
# CATATAN: 'docker manifest inspect' mengembalikan digest manifest ANAK (per-platform),
# bukan digest index, sehingga selalu dianggap "berbeda". Pakai buildx imagetools.
remote_digest() {
  docker buildx imagetools inspect "$1" 2>/dev/null | awk '/^Digest:/{print $2; exit}'
}
local_digest() {
  docker image inspect "$1" --format '{{index .RepoDigests 0}}' 2>/dev/null | sed 's/.*@//'
}

images=$(grep -oE 'ghcr\.io/[^:[:space:]]+:main' "$COMPOSE_FILE" | sort -u)
[ -z "$images" ] && { log "SKIP: tidak ada image ghcr di $COMPOSE_FILE"; exit 0; }

need_update=0
for img in $images; do
  l_id=$(local_digest "$img")
  r_id=$(remote_digest "$img")
  if [ -z "$r_id" ]; then
    log "WARN: gagal ambil digest remote $img (skip)"
    continue
  fi
  if [ "$l_id" != "$r_id" ]; then
    log "UPDATE: $img  local=${l_id:-none}  remote=$r_id"
    need_update=1
  fi
done

if [ "$need_update" -eq 0 ]; then
  exit 0
fi

# --- pull lalu recreate (compose akan no-op kalau tidak berubah) ---
if $DC pull -q >> "$LOG" 2>&1; then
  if $DC up -d >> "$LOG" 2>&1; then
    log "OK: stack diperbarui"
  else
    log "ERROR: 'up -d' gagal, cek log di atas"
    exit 1
  fi
else
  log "ERROR: 'pull' gagal (registry tidak terjangkau?)"
  exit 1
fi
