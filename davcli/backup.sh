#!/bin/bash
################################################################################
# Script Name: backup.sh
# Description: Backs up (and restores) DavPanel/DavAdmin SYSTEM AND USER
#              CONFIGURATION -- panel settings, per-domain webserver/DNS
#              config, the root docker-compose.yml/.env stacks (main +
#              mailserver's compose.yml/.env/mailserver.env only -- NOT its
#              DKIM keys or mail accounts, see docker-data/dms/config),
#              PHP/MySQL/FTP/SSH config, etc. Deliberately excludes real
#              user data: website files, databases, mailbox contents, mail
#              accounts/DKIM keys, and large downloadable software assets
#              (CMS installer archives, the GeoIP database, the vendored
#              Caddy WAF ruleset, ionCube/composer caches) are never
#              touched. Destination and retention are read from
#              /etc/davpanel/davadmin/config/backups.ini -- DavAdmin's
#              System Backups page writes that file.
# Usage: davcli backup [--restore <ARCHIVE>] [--quiet]
#        davcli backup --restore <archive_filename>
#        davcli backup --quiet
# Docs: https://docs.davpanel.com
# Author: Stefan Pejcic
# Created: 20.08.2026
# Company: OpenPanel, LLC.
# Copyright (c) openpanel.com
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
################################################################################

set -o pipefail

readonly CONFIG_FILE="/etc/davpanel/davadmin/config/backups.ini"
readonly LOG_FILE="/var/log/davpanel/admin/system-backup.log"
readonly RUNS_FILE="/var/log/davpanel/admin/system-backup-runs.jsonl"
readonly ARCHIVE_PREFIX="system-backup_"

QUIET=0
RESTORE_FILE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --restore) RESTORE_FILE="$2"; shift 2 ;;
        --quiet)   QUIET=1; shift ;;
        *) echo "[ERROR] Unknown option: $1" >&2; exit 1 ;;
    esac
done

mkdir -p "$(dirname "$LOG_FILE")"

log() {
    local msg="$1" ts; ts=$(date +'%Y-%m-%d %H:%M:%S')
    if [[ $QUIET -eq 1 ]]; then
        echo "[$ts] $msg" >> "$LOG_FILE"
    else
        echo "[$ts] $msg" | tee -a "$LOG_FILE"
    fi
}

die() { log "[✘] $1"; exit "${2:-1}"; }

# writes one json-line summary to RUNS_FILE for DavAdmin's Runs tab -- LOG_FILE above has the full detail
record_run() {
    local action="$1" status="$2" archive="$3" size_bytes="$4" duration="$5" detail="$6"
    printf '{"timestamp":"%s","action":"%s","status":"%s","archive":"%s","size_bytes":%s,"duration_seconds":%s,"detail":"%s"}\n' \
        "$(date +'%Y-%m-%dT%H:%M:%S%z')" "$action" "$status" "$archive" "${size_bytes:-0}" "${duration:-0}" \
        "$(echo "$detail" | sed 's/"/\\"/g')" >> "$RUNS_FILE"
}

# hand-picked config paths relative to /, so tar -C / restores with a plain tar -xzf -C / -- a path missing on this install is just skipped
BACKUP_PATHS=(
    "root/docker-compose.yml"
    "root/.env"
    "root/davpanel_run_after_update"
    "usr/local/mail/openmail/compose.yml"
    "usr/local/mail/openmail/.env"
    "usr/local/mail/openmail/mailserver.env"
    "etc/cron.d/davpanel"
    # /etc/bind has the live named config and zone files -- etc/davpanel/bind9 below is just install-time templates
    "etc/bind"
    "etc/davpanel/davadmin/config"
    # davadmin/cluster is left out on purpose, it holds this server's cluster identity and restoring it elsewhere would clone it
    "etc/davpanel/davadmin/service"
    "etc/davpanel/davpanel/conf"
    "etc/davpanel/davpanel/features"
    "etc/davpanel/davpanel/custom_code"
    "etc/davpanel/davpanel/service"
    "etc/davpanel/csf"
    "etc/davpanel/docker/compose"
    "etc/davpanel/docker/daemon"
    "etc/davpanel/docker/templates"
    "etc/davpanel/mysql"
    "etc/davpanel/nginx/vhosts"
    "etc/davpanel/nginx/templates"
    "etc/davpanel/nginx/modsecurity"
    "etc/davpanel/nginx/error_pages"
    "etc/davpanel/nginx/certs"
    "etc/davpanel/caddy/Caddyfile"
    "etc/davpanel/caddy/domains"
    "etc/davpanel/caddy/templates"
    "etc/davpanel/caddy/deny"
    "etc/davpanel/caddy/suspended_domains"
    "etc/davpanel/caddy/ssl"
    "etc/davpanel/openlitespeed"
    "etc/davpanel/apache"
    "etc/davpanel/openresty"
    "etc/davpanel/php/ini"
    "etc/davpanel/ftp"
    "etc/davpanel/ssh"
    "etc/davpanel/ofelia"
    "etc/davpanel/skeleton"
    "etc/davpanel/varnish"
    "etc/davpanel/postgres"
    "etc/davpanel/services"
    "etc/davpanel/modules"
    "etc/davpanel/bind9"
    "etc/davpanel/backups"
    "etc/davpanel/clamav"
    "etc/davpanel/email"
)

# reads a key=value line from CONFIG_FILE, ignores [section] headers since backups.ini only has one section anyway
read_ini_value() {
    local key="$1"
    grep -E "^${key}=" "$CONFIG_FILE" 2>/dev/null | tail -1 | cut -d'=' -f2- | xargs
}

do_backup() {
    [[ -f "$CONFIG_FILE" ]] || die "Config file not found: $CONFIG_FILE. Set a destination on the System Backups page first."

    local destination retention_days
    destination=$(read_ini_value "destination")
    retention_days=$(read_ini_value "retention_days")
    retention_days="${retention_days:--1}"

    [[ -n "$destination" ]] || die "No backup destination configured in $CONFIG_FILE."
    mkdir -p "$destination" || die "Could not create destination directory: $destination"

    local start_time; start_time=$(date +%s)
    log "=== System backup started ==="

    local existing_paths=()
    for p in "${BACKUP_PATHS[@]}"; do
        [[ -e "/$p" ]] && existing_paths+=("$p")
    done
    log "Including ${#existing_paths[@]}/${#BACKUP_PATHS[@]} configured paths that exist on this server."

    local timestamp archive_name archive_path
    timestamp=$(date +'%Y-%m-%d_%H-%M-%S')
    archive_name="${ARCHIVE_PREFIX}${timestamp}.tar.gz"
    archive_path="${destination%/}/${archive_name}"

    # --exclude stops tar from choking on its own archive when destination lives inside a backed-up path like /etc/davpanel/backups/
    if ! tar -czf "$archive_path" -C / --exclude="${destination#/}/*" "${existing_paths[@]}" 2>>"$LOG_FILE"; then
        record_run "backup" "failed" "$archive_name" "0" "$(( $(date +%s) - start_time ))" "tar command failed, see $LOG_FILE"
        die "Backup failed -- see $LOG_FILE for details."
    fi

    local size_bytes; size_bytes=$(stat -c '%s' "$archive_path" 2>/dev/null || echo 0)
    local duration=$(( $(date +%s) - start_time ))
    log "Backup archive created: $archive_path ($(du -h "$archive_path" | cut -f1), ${duration}s)"

    # prune backups older than retention_days, if it's set above 0
    local pruned=0
    if [[ "$retention_days" =~ ^[0-9]+$ && "$retention_days" -gt 0 ]]; then
        while IFS= read -r old_file; do
            rm -f "$old_file" && { log "Pruned old backup: $old_file"; ((pruned++)); }
        done < <(find "$destination" -maxdepth 1 -name "${ARCHIVE_PREFIX}*.tar.gz" -mtime "+${retention_days}" 2>/dev/null)
    fi

    log "=== System backup finished (${duration}s, pruned ${pruned} old backup(s)) ==="
    record_run "backup" "success" "$archive_name" "$size_bytes" "$duration" "${#existing_paths[@]} paths, pruned ${pruned}"
}

do_restore() {
    local filename="$1"
    [[ -f "$CONFIG_FILE" ]] || die "Config file not found: $CONFIG_FILE."

    local destination; destination=$(read_ini_value "destination")
    [[ -n "$destination" ]] || die "No backup destination configured in $CONFIG_FILE."

    # basename only, so a caller-supplied filename can't escape the destination dir
    filename="$(basename -- "$filename")"
    local archive_path="${destination%/}/${filename}"
    [[ -f "$archive_path" ]] || die "Backup archive not found: $archive_path"
    [[ "$filename" == ${ARCHIVE_PREFIX}*.tar.gz ]] || die "Refusing to restore a file that isn't a system-backup archive: $filename"

    local start_time; start_time=$(date +%s)
    log "=== Restoring from $filename ==="

    if ! tar -xzf "$archive_path" -C / 2>>"$LOG_FILE"; then
        record_run "restore" "failed" "$filename" "0" "$(( $(date +%s) - start_time ))" "tar extract failed, see $LOG_FILE"
        die "Restore failed -- see $LOG_FILE for details."
    fi

    local duration=$(( $(date +%s) - start_time ))
    log "=== Restore finished (${duration}s) -- affected services may need a restart to pick up restored config ==="
    record_run "restore" "success" "$filename" "$(stat -c '%s' "$archive_path" 2>/dev/null || echo 0)" "$duration" "restored"
}

if [[ -n "$RESTORE_FILE" ]]; then
    do_restore "$RESTORE_FILE"
else
    do_backup
fi
