#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
ARCH="${GOARCH:-$(go env GOARCH)}"
case "${1:-}" in
    --arch=*) ARCH="${1#*=}"; shift ;;
esac
[[ $# == 0 ]] || { echo 'Usage: bash scripts/build-release.sh [--arch=amd64|arm64]' >&2; exit 2; }
case "$ARCH" in amd64|arm64) ;; *) echo "Unsupported architecture: $ARCH" >&2; exit 2 ;; esac
python3 "$ROOT/scripts/audit_sources.py"
VERSION=$(tr -d '[:space:]' < "$ROOT/davpanel/version")
OUT="$ROOT/dist/linux-$ARCH"
mkdir -p "$OUT/bin"
for component in davpanel davadmin; do
    binary="$component"
    [[ "$component" == davadmin ]] && binary="davadmin-$ARCH"
    (cd "$ROOT/$component" && CGO_ENABLED=0 GOOS=linux GOARCH="$ARCH" go build -mod=readonly -trimpath -buildvcs=false -o "$OUT/bin/$binary" "./cmd/$component")
done
cp "$ROOT/davpanel/version" "$OUT/VERSION"
(cd "$OUT" && sha256sum bin/* > SHA256SUMS)
python3 - "$ROOT" "$ARCH" <<'PY'
import json
import sys
from pathlib import Path
root = Path(sys.argv[1])
sys.path.insert(0, str(root / "scripts"))
from audit_sources import tree_digest
architecture = sys.argv[2]
build = {"architecture": architecture, "version": (root / "davpanel/version").read_text().strip(),
         "source_sha256": {name: tree_digest(root / name)[0] for name in ("davpanel", "davadmin")}}
(root / "dist" / f"linux-{architecture}" / "BUILD.json").write_text(json.dumps(build, indent=2) + "\n")
PY
tar -czf "$ROOT/dist/davpanel-$VERSION-linux-$ARCH.tar.gz" \
    --exclude='node_modules' --exclude='__pycache__' --exclude='.git' --exclude='.expo' \
    -C "$ROOT" davpanel davadmin davcli configuration translations mailserver vsftpd mobile tests integrations \
    caddy scripts components.lock.json PODMAN_INSTALL.sh INSTALL.md LICENSE NOTICE.md README.md \
    -C "$OUT" bin VERSION SHA256SUMS BUILD.json
(cd "$ROOT/dist" && sha256sum "davpanel-$VERSION-linux-$ARCH.tar.gz" > "davpanel-$VERSION-linux-$ARCH.tar.gz.sha256")
echo "Built $ROOT/dist/davpanel-$VERSION-linux-$ARCH.tar.gz"
echo "Validate: bash PODMAN_INSTALL.sh --preflight"
