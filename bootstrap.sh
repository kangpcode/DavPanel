#!/usr/bin/env bash
set -euo pipefail

main() {
    local repository="${DAVPANEL_REPOSITORY:-kangpcode/DavPanel}" tag version arch asset digest name
    if [[ "${1:-}" == --help || "${1:-}" == -h ]]; then
        echo 'DavPanel GitHub bootstrap: sudo bash bootstrap.sh [installer options]'
        return 0
    fi
    [[ "$repository" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || { echo 'Invalid repository.' >&2; return 1; }
    [[ "$(uname -s)" == Linux ]] || { echo 'Use a full Linux VM for hosting; see PLATFORMS.md.' >&2; return 1; }
    case "$(uname -m)" in x86_64|amd64) arch=amd64 ;; aarch64|arm64) arch=arm64 ;; *) echo 'Unsupported CPU.' >&2; return 1 ;; esac
    command -v curl >/dev/null || { echo 'curl is required.' >&2; return 1; }
    tag=$(curl -fLsS --retry 2 --connect-timeout 10 --max-time 60 "https://api.github.com/repos/$repository/releases/latest" | sed -nE 's/.*"tag_name"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p')
    [[ "$tag" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo 'No stable DavPanel release is published.' >&2; return 1; }
    version="${tag#v}"
    asset="davpanel-$version-linux-$arch.run"
    DP_DOWNLOAD_DIR=$(mktemp -d "${TMPDIR:-/tmp}/davpanel-download.XXXXXXXX")
    trap 'rm -rf -- "$DP_DOWNLOAD_DIR"' EXIT
    local base="https://github.com/$repository/releases/download/$tag"
    curl -fLsS --retry 2 --connect-timeout 10 --max-time 900 "$base/$asset" -o "$DP_DOWNLOAD_DIR/$asset"
    curl -fLsS --retry 2 --connect-timeout 10 --max-time 60 "$base/$asset.sha256" -o "$DP_DOWNLOAD_DIR/checksum"
    read -r digest name < "$DP_DOWNLOAD_DIR/checksum"
    [[ "$digest" =~ ^[0-9a-f]{64}$ && "$name" == "$asset" ]] || { echo 'Invalid release checksum.' >&2; return 1; }
    printf '%s  %s\n' "$digest" "$DP_DOWNLOAD_DIR/$asset" | sha256sum --check --status || { echo 'Checksum mismatch.' >&2; return 1; }
    bash "$DP_DOWNLOAD_DIR/$asset" "$@"
    rm -rf -- "$DP_DOWNLOAD_DIR"
    trap - EXIT
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then main "$@"; fi
