#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"
case "${1:-check}" in
    check)
        python3 scripts/audit_sources.py
        python3 scripts/preflight.py
        python3 -m unittest discover -s scripts -p 'test_*.py'
        ;;
    test)
        for component in davpanel davadmin; do (cd "$component" && go test ./...); done
        ;;
    audit)
        for component in davpanel davadmin; do
            (cd "$component" && go run golang.org/x/vuln/cmd/govulncheck@v1.9.0 ./...)
        done
        ;;
    build) bash scripts/build-release.sh ;;
    website)
        cd website
        [[ -d node_modules ]] || npm ci
        npm start -- --host 0.0.0.0 --port 3000
        ;;
    *) echo 'Usage: bash scripts/dev.sh [check|test|audit|build|website]' >&2; exit 2 ;;
esac
