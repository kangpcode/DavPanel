#!/bin/bash
###
# Install desired locale for DavPanel UI
#
# Usage:
#
# Installing single locale:
#   davcli locale sr-rs
#
# Installing multiple locales at once:
#   davcli locale sr-rs tr-tr
#
###

translations_dir="${DAVPANEL_TRANSLATIONS_DIR:-/etc/davpanel/davpanel/translations}"
catalog_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
cache_key="davpanel_cache_app.get_available_locales"

if [ "$#" -lt 1 ]; then
    echo "Please provide at least one locale."
    echo
    echo "Available locales:"
    for catalog in "$catalog_dir"/??-??/messages.po; do
        [[ -f "$catalog" ]] || continue
        locale_dir="${catalog%/messages.po}"
        basename "$locale_dir"
    done
    echo
    echo "Example:"
    echo "  davcli locale de-de"
    echo "  davcli locale de-de es-es"
    exit 0
fi

validate_locale() {
    [[ "$1" =~ ^[a-z]{2}-[a-z]{2}$ ]]
}

failed=0
installed=0

for locale in "$@"; do
    formatted_locale=$(echo "$locale" | tr '[:upper:]' '[:lower:]')

    if ! validate_locale "$formatted_locale"; then
        echo "Invalid locale format: $locale. Skipping."
        failed=1
        continue
    fi

    two_letter="${formatted_locale%%-*}"
    target_dir="$translations_dir/$two_letter/LC_MESSAGES"

    echo "Installing $formatted_locale..."
    tmp_file=$(mktemp) || exit 1
    if [[ ! -s "$catalog_dir/$formatted_locale/messages.po" ]] || ! cp "$catalog_dir/$formatted_locale/messages.po" "$tmp_file"; then
        echo "Locale $formatted_locale is not included in this release."
        rm -f "$tmp_file"
        failed=1
        continue
    fi
    mkdir -p "$target_dir"
    mv "$tmp_file" "$target_dir/messages.po"
    chmod 644 "$target_dir/messages.po"

    installed=1
    echo
done

if [ "$installed" -eq 1 ]; then
    echo "Flushing cache..."
    if command -v podman >/dev/null 2>&1; then
        podman exec davpanel_redis redis-cli DEL "$cache_key" >/dev/null 2>&1
    fi
fi

if [ "$failed" -eq 1 ]; then
    echo "DONE with errors"
    exit 1
fi

echo "DONE"
