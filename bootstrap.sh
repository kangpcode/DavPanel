#!/usr/bin/env bash
set -euo pipefail

bootstrap_help() {
    cat <<'EOF'
DavPanel installer — Dhafa Nazula Permadi (kangpcode)

Usage (as root): bash <(curl -fsSL https://raw.githubusercontent.com/kangpcode/DavPanel/main/bootstrap.sh) [options]

  --from-source            Build from the complete GitHub source checkout.
  --version=<version>      Install a specific release or its source tag.
  --preflight | --dry-run  Verify a published installer without installing packages.
  --domain=<domain>        Configure public TLS (default: self-signed for IP access).
  --help                   Show this help without downloading anything.

Other options are passed to the full installer. Missing dependencies are installed
automatically; non-root accounts need sudo. If no standalone release is published,
the installer downloads the source and a verified Go toolchain, then builds it.
Install only on a clean, dedicated Linux server with internet access.
Codespaces and other containers can build releases with bash scripts/dev.sh build
from a complete source checkout; install the resulting .run on a Linux VM/VPS.
EOF
}

bootstrap_in_container() {
    local entry
    [[ "${CODESPACES:-}" == true || -f /.dockerenv || -f /run/.containerenv ]] && return 0
    if command -v systemd-detect-virt >/dev/null && systemd-detect-virt --container --quiet; then
        return 0
    fi
    if [[ -r /proc/1/environ ]]; then
        while IFS= read -r -d '' entry; do
            [[ "$entry" == container=* ]] && return 0
        done 2>/dev/null < /proc/1/environ
    fi
    return 1
}

bootstrap_download() {
    curl -fLsS --retry 2 --connect-timeout 10 --max-time 900 "$1" -o "$2"
}

bootstrap_dependencies() {
    local command missing=false
    for command in "$@"; do
        command -v "$command" >/dev/null || missing=true
    done
    [[ "$missing" == true ]] || return 0
    [[ "$read_only" == false ]] || {
        echo "Read-only verification requires these commands: $*" >&2; return 1;
    }
    echo 'Installing bootstrap dependencies...'
    if command -v apt-get >/dev/null; then
        "${root_command[@]}" apt-get update
        "${root_command[@]}" env DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends ca-certificates curl coreutils tar gzip python3 git
    elif command -v dnf >/dev/null; then
        "${root_command[@]}" dnf install -y ca-certificates curl coreutils tar gzip python3 git
    elif command -v yum >/dev/null; then
        "${root_command[@]}" yum install -y ca-certificates curl coreutils tar gzip python3 git
    else
        echo 'A supported distribution with apt-get, dnf or yum is required.' >&2; return 1
    fi
    for command in "$@"; do
        command -v "$command" >/dev/null || { echo "Missing dependency: $command" >&2; return 1; }
    done
}

bootstrap_go() {
    local source_dir=$1 arch=$2 required current filename digest
    required=$(python3 - "$source_dir" <<'PY'
import re
import sys
from pathlib import Path
versions = []
for component in ("davpanel", "davadmin"):
    text = (Path(sys.argv[1]) / component / "go.mod").read_text()
    match = re.search(r"^toolchain go(\d+\.\d+\.\d+)\s*$", text, re.M)
    if not match:
        raise SystemExit("Missing stable Go toolchain pin: " + component)
    versions.append(tuple(map(int, match[1].split("."))))
print(".".join(map(str, max(versions))))
PY
    )
    current=$(GOTOOLCHAIN=local go version 2>/dev/null || true)
    if python3 - "$current" "$required" <<'PY'
import re
import sys
match = re.fullmatch(r"go version go(\d+\.\d+\.\d+) linux/(amd64|arm64)\s*", sys.argv[1])
sys.exit(not (match and tuple(map(int, match[1].split("."))) >= tuple(map(int, sys.argv[2].split(".")))))
PY
    then
        return 0
    fi
    filename="go$required.linux-$arch.tar.gz"
    echo "Downloading Go $required for the source build..."
    bootstrap_download 'https://go.dev/dl/?mode=json&include=all' "$DP_DOWNLOAD_DIR/go.json"
    digest=$(python3 - "$DP_DOWNLOAD_DIR/go.json" "$filename" <<'PY'
import json
import re
import sys
with open(sys.argv[1]) as source:
    releases = json.load(source)
for release in releases:
    for item in release.get("files", []):
        if release.get("stable") and item.get("filename") == sys.argv[2] and re.fullmatch(r"[0-9a-f]{64}", item.get("sha256", "")):
            print(item["sha256"])
            raise SystemExit(0)
raise SystemExit("The required Go toolchain is unavailable from go.dev.")
PY
    )
    bootstrap_download "https://go.dev/dl/$filename" "$DP_DOWNLOAD_DIR/go.tar.gz"
    printf '%s  %s\n' "$digest" "$DP_DOWNLOAD_DIR/go.tar.gz" | sha256sum --check --status || {
        echo 'Go toolchain checksum mismatch; installation stopped.' >&2; return 1;
    }
    tar -xzf "$DP_DOWNLOAD_DIR/go.tar.gz" -C "$DP_DOWNLOAD_DIR"
    export PATH="$DP_DOWNLOAD_DIR/go/bin:$PATH"
    export GOTOOLCHAIN=local
}

main() {
    local repository="${DAVPANEL_REPOSITORY:-kangpcode/DavPanel}" source_ref="${DAVPANEL_SOURCE_REF:-main}"
    local tag="" version="" arch asset digest name extra status arg from_source=false read_only=false
    local -a root_command=() forwarded=()
    for arg in "$@"; do
        case "$arg" in
            --help|-h) bootstrap_help; return 0 ;;
            --from-source) from_source=true ;;
            --preflight|--dry-run) read_only=true; forwarded+=("$arg") ;;
            --version=*) version="${arg#*=}"; version="${version#v}"; forwarded+=("--version=$version") ;;
            *) forwarded+=("$arg") ;;
        esac
    done
    [[ "$repository" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || { echo 'Invalid repository.' >&2; return 1; }
    [[ -z "$version" || "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo 'Invalid release version.' >&2; return 1; }
    [[ "$source_ref" =~ ^[A-Za-z0-9][A-Za-z0-9._/-]*$ ]] || { echo 'Invalid source ref.' >&2; return 1; }
    [[ "$(uname -s)" == Linux ]] || { echo 'Use a full Linux VM for hosting; see PLATFORMS.md.' >&2; return 1; }
    case "$(uname -m)" in x86_64|amd64) arch=amd64 ;; aarch64|arm64) arch=arm64 ;; *) echo 'Unsupported CPU.' >&2; return 1 ;; esac
    if [[ "$read_only" == false ]] && bootstrap_in_container; then
        local build_ref="${version:+v$version}"
        build_ref="${build_ref:-$source_ref}"
        cat >&2 <<EOF
DavPanel hosting installation requires a clean Linux VM/VPS. Codespaces and other containers are build environments.
No dependencies, source or installers were downloaded or installed by this script.
To build in Codespaces, first obtain the complete source checkout (the bootstrap does not create it here):
  git clone --depth=1 --single-branch --branch="$build_ref" "https://github.com/$repository.git" DavPanel
  cd DavPanel
  bash scripts/dev.sh build
Copy the resulting dist/davpanel-<version>-linux-<arch>.run to the Linux VM/VPS and install it there.
--repair and --skip-requirements do not provide the required host services.
EOF
        return 1
    fi
    if [[ "$read_only" == false && "$EUID" != 0 ]]; then
        command -v sudo >/dev/null || { echo 'Run this command as root, or install sudo.' >&2; return 1; }
        root_command=(sudo)
    fi
    bootstrap_dependencies curl python3 sha256sum tar gzip
    python3 -c 'import sys; sys.exit(sys.version_info < (3, 9))' || {
        echo 'Python 3.9+ is required; use a current server distribution.' >&2; return 1;
    }
    DP_DOWNLOAD_DIR=$(mktemp -d "${TMPDIR:-/tmp}/davpanel-download.XXXXXXXX")
    trap 'rm -rf -- "$DP_DOWNLOAD_DIR"' EXIT
    if [[ "$from_source" == false ]]; then
        local endpoint="https://api.github.com/repos/$repository/releases/latest"
        [[ -z "$version" ]] || endpoint="https://api.github.com/repos/$repository/releases/tags/v$version"
        status=$(curl -LsS --retry 2 --connect-timeout 10 --max-time 60 -w '%{http_code}' "$endpoint" -o "$DP_DOWNLOAD_DIR/release.json")
        case "$status" in
            200)
                tag=$(python3 - "$DP_DOWNLOAD_DIR/release.json" "$arch" "$version" <<'PY'
import json
import re
import sys
with open(sys.argv[1]) as source:
    release = json.load(source)
tag = release.get("tag_name", "")
if not re.fullmatch(r"v?\d+\.\d+\.\d+", tag) or release.get("draft") or release.get("prerelease"):
    raise SystemExit("GitHub returned an invalid stable release.")
version = tag.removeprefix("v")
if sys.argv[3] and version != sys.argv[3]:
    raise SystemExit("GitHub returned a different release version.")
asset = f"davpanel-{version}-linux-{sys.argv[2]}.run"
names = {item["name"] for item in release.get("assets", [])}
if {asset, asset + ".sha256"} <= names:
    print(tag)
PY
                )
                ;;
            404) echo 'No standalone GitHub release is published; using the complete source.' ;;
            403|429) echo 'GitHub release API is rate limited; using the complete source.' ;;
            *) echo "Cannot check GitHub releases (HTTP $status); retry later." >&2; return 1 ;;
        esac
    fi
    if [[ -n "$tag" ]]; then
        version="${tag#v}"
        asset="davpanel-$version-linux-$arch.run"
        local base="https://github.com/$repository/releases/download/$tag"
        echo "Downloading DavPanel $version for linux/$arch..."
        bootstrap_download "$base/$asset" "$DP_DOWNLOAD_DIR/$asset"
        bootstrap_download "$base/$asset.sha256" "$DP_DOWNLOAD_DIR/checksum"
        read -r digest name extra < "$DP_DOWNLOAD_DIR/checksum"
        [[ "$digest" =~ ^[0-9a-f]{64}$ && "$name" == "$asset" && -z "$extra" ]] || { echo 'Invalid release checksum.' >&2; return 1; }
        printf '%s  %s\n' "$digest" "$DP_DOWNLOAD_DIR/$asset" | sha256sum --check --status || { echo 'Checksum mismatch; installation stopped.' >&2; return 1; }
    else
        [[ "$read_only" == false ]] || {
            echo 'Read-only verification requires a published standalone release; no build or installation was attempted.' >&2; return 1;
        }
        bootstrap_dependencies git
        [[ -z "$version" ]] || source_ref="v$version"
        echo "Downloading DavPanel source ($repository, $source_ref)..."
        git clone --depth=1 --single-branch --branch="$source_ref" "https://github.com/$repository.git" "$DP_DOWNLOAD_DIR/source"
        python3 "$DP_DOWNLOAD_DIR/source/scripts/audit_sources.py"
        bootstrap_go "$DP_DOWNLOAD_DIR/source" "$arch"
        echo 'Building the complete DavPanel installer. This can take several minutes...'
        bash "$DP_DOWNLOAD_DIR/source/scripts/build-release.sh" "--arch=$arch"
        version=$(tr -d '[:space:]' < "$DP_DOWNLOAD_DIR/source/davpanel/version")
        [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo 'Invalid source version.' >&2; return 1; }
        asset="source/dist/davpanel-$version-linux-$arch.run"
    fi
    "${root_command[@]}" bash "$DP_DOWNLOAD_DIR/$asset" "${forwarded[@]}"
    rm -rf -- "$DP_DOWNLOAD_DIR"
    trap - EXIT
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then main "$@"; fi
