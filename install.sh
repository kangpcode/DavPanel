#!/usr/bin/env bash
set -euo pipefail

# The release builder replaces these values before appending the archive.
DP_EMBEDDED_OFFSET=0
DP_EMBEDDED_SHA256=""

install_help() {
    cat <<'EOF'
DavPanel installer — Dhafa Nazula Permadi (kangpcode)

Usage: sudo bash davpanel-<version>-linux-<arch>.run [installer options]
       sudo bash install.sh [--source-dir=/path/to/extracted/release] [options]

  --preflight | --dry-run   Verify the release without changing system services.
  --source-dir=<path>       Use a local checkout or extracted release.
  --selfsigned             Generate a self-signed certificate.
  --domain=<domain>        Configure a domain with public TLS.
  --help                   Show this help.

Other options are forwarded to PODMAN_INSTALL.sh. Install only on a clean,
dedicated Linux server. Source checkouts need Go to build missing binaries;
the standalone .run includes both binaries and needs no Go compiler.
EOF
}

ensure_python() {
    if command -v python3 >/dev/null; then
        python3 -c 'import sys; sys.exit(sys.version_info < (3, 9))' || {
            echo 'Python 3.9 or newer must be available as python3; use a current server distribution.' >&2
            return 1
        }
        return 0
    fi
    [[ "$read_only" == false ]] || { echo 'Python 3.9+ is required for read-only verification.' >&2; return 1; }
    [[ "$EUID" == 0 ]] || { echo 'Run this installer with sudo.' >&2; return 1; }
    echo 'Installing Python 3 for release verification...'
    if command -v apt-get >/dev/null; then
        apt-get update
        DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends python3
    elif command -v dnf >/dev/null; then
        dnf install -y python3
    elif command -v yum >/dev/null; then
        yum install -y python3
    else
        echo 'Install Python 3.9+ using your distribution package manager.' >&2
        return 1
    fi
    python3 -c 'import sys; sys.exit(sys.version_info < (3, 9))' || {
        echo 'The distribution installed an obsolete Python; Python 3.9+ is required.' >&2
        return 1
    }
}

extract_payload() {
    python3 - "$1" "$2" <<'PY'
import shutil
import sys
import tarfile
from pathlib import Path, PurePosixPath

archive, target = Path(sys.argv[1]), Path(sys.argv[2])
target.mkdir()
with tarfile.open(archive, "r:gz") as source:
    members = source.getmembers()
    seen = set()
    for member in members:
        name = PurePosixPath(member.name)
        if name.is_absolute() or ".." in name.parts or not name.parts:
            raise SystemExit("Unsafe release archive path: " + member.name)
        if not (member.isfile() or member.isdir()):
            raise SystemExit("Release archives cannot contain links or special files: " + member.name)
        if str(name) in seen:
            raise SystemExit("Duplicate release archive path: " + member.name)
        seen.add(str(name))
    for member in members:
        path = target.joinpath(*PurePosixPath(member.name).parts)
        if member.isdir():
            path.mkdir(parents=True, exist_ok=True)
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            with source.extractfile(member) as incoming, path.open("wb") as outgoing:
                shutil.copyfileobj(incoming, outgoing)
            path.chmod(member.mode & 0o755)
PY
}

installer_bootstrap() {
    local read_only=false source_dir="" work_dir="" arg has_domain=false
    local -a forwarded=()
    for arg in "$@"; do
        case "$arg" in
            --help|-h) install_help; return 0 ;;
            --preflight|--dry-run) read_only=true ;;
            --source-dir=*) source_dir="${arg#*=}" ;;
            --domain=*) has_domain=true; forwarded+=("$arg") ;;
            *) forwarded+=("$arg") ;;
        esac
    done
    [[ "$(uname -s)" == Linux ]] || { echo 'DavPanel requires Linux.' >&2; return 1; }
    case "$(uname -m)" in x86_64|amd64|aarch64|arm64) ;; *) echo 'Unsupported CPU architecture.' >&2; return 1 ;; esac
    [[ "$read_only" == true || "$EUID" == 0 ]] || { echo 'Run this installer with sudo.' >&2; return 1; }
    if (( DP_EMBEDDED_OFFSET > 0 )); then
        [[ -z "$source_dir" ]] || { echo 'A standalone installer cannot override its embedded source.' >&2; return 1; }
        work_dir=$(mktemp -d "${TMPDIR:-/tmp}/davpanel-installer.XXXXXXXX")
        DP_WORK_DIR="$work_dir"
        trap 'rm -rf -- "$DP_WORK_DIR"' EXIT
        tail -c "+$DP_EMBEDDED_OFFSET" -- "${BASH_SOURCE[0]}" > "$work_dir/release.tar.gz"
        printf '%s  %s\n' "$DP_EMBEDDED_SHA256" "$work_dir/release.tar.gz" | sha256sum --check --status || {
            echo 'Release payload checksum mismatch; installation stopped.' >&2
            return 1
        }
        ensure_python
        extract_payload "$work_dir/release.tar.gz" "$work_dir/source"
        source_dir="$work_dir/source"
    else
        ensure_python
        source_dir="${source_dir:-$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)}"
    fi
    source_dir=$(cd -- "$source_dir" && pwd)
    [[ -f "$source_dir/PODMAN_INSTALL.sh" && -f "$source_dir/scripts/preflight.py" ]] || {
        echo 'Incomplete DavPanel source; use a complete standalone release installer.' >&2
        return 1
    }
    if [[ "$read_only" == true ]]; then
        bash "$source_dir/PODMAN_INSTALL.sh" "--source-dir=$source_dir" --preflight "${forwarded[@]}"
    else
        python3 "$source_dir/scripts/preflight.py" --root "$source_dir"
        if ! python3 "$source_dir/scripts/preflight.py" --root "$source_dir" --require-artifacts; then
            command -v go >/dev/null || { echo 'Use the standalone .run installer, or install Go 1.27.3+ to build this checkout.' >&2; return 1; }
            bash "$source_dir/scripts/build-release.sh"
        fi
        [[ "$has_domain" == true ]] || forwarded+=(--selfsigned)
        bash "$source_dir/PODMAN_INSTALL.sh" "--source-dir=$source_dir" "${forwarded[@]}"
    fi
    if [[ -n "$work_dir" ]]; then
        rm -rf -- "$work_dir"
        DP_WORK_DIR=""
        trap - EXIT
    fi
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    installer_bootstrap "$@"
fi
