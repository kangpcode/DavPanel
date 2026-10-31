#!/bin/bash

davpanel_release_source() {
    local -a args=(fetch)
    [[ -z "${DAVPANEL_UPDATE_VERSION:-}" ]] || args+=(--version "$DAVPANEL_UPDATE_VERSION")
    [[ "${BETA:-false}" != true ]] || args+=(--beta)
    python3 /usr/local/share/davpanel/scripts/release_manager.py "${args[@]}"
}

davpanel_release_image() {
    local -a args=(image)
    [[ -z "${1:-}" ]] || args+=(--version "$1")
    [[ "${BETA:-false}" != true ]] || args+=(--beta)
    python3 /usr/local/share/davpanel/scripts/release_manager.py "${args[@]}" --image "${IMAGE_NAME:-ghcr.io/kangpcode/davpanel}"
}
