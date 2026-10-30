#!/bin/bash

# install waf profiles
davcli waf plugins install

# cloudflare
CF_SNIPPET="/etc/davpanel/caddy/templates/cloudflare.only"
CADDYFILE="/etc/davpanel/caddy/Caddyfile"
if [ ! -f "$CF_SNIPPET" ]; then
    wget --timeout=15 --tries=3 -q -O "$CF_SNIPPET" https://raw.githubusercontent.com/kangpcode/davpanel-configuration/main/caddy/templates/cloudflare.only
fi
if [ -f "$CF_SNIPPET" ] && [ -f "$CADDYFILE" ] && ! grep -q "templates/cloudflare.only" "$CADDYFILE"; then
    echo "Adding cloudflare-only import to $CADDYFILE..."
    awk '/^# import all sites/ { print "# import cloudflare only IP addresses"; print "import /etc/davpanel/caddy/templates/cloudflare.only"; print "" } { print }' "$CADDYFILE" > "$CADDYFILE.tmp" && cat "$CADDYFILE.tmp" > "$CADDYFILE" && rm -f "$CADDYFILE.tmp"
    podman ps --format '{{.Names}}' | grep -qx caddy && podman exec caddy caddy reload --config /etc/caddy/Caddyfile >/dev/null 2>&1
fi

# apps shown in the Websites section on the DavPanel dashboard, new in 2.0.13
DAVPANEL_CONFIG="/etc/davpanel/davpanel/conf/davpanel.config"
if [ -f "$DAVPANEL_CONFIG" ] && ! grep -q "^applications_dashboard_items=" "$DAVPANEL_CONFIG"; then
    echo "Adding applications_dashboard_items to $DAVPANEL_CONFIG..."
    if grep -q "^\[PANEL\]" "$DAVPANEL_CONFIG"; then
        sed -i '/^\[PANEL\]/a applications_dashboard_items=websites wordpress autoinstaller' "$DAVPANEL_CONFIG"
    else
        printf '\n[PANEL]\napplications_dashboard_items=websites wordpress autoinstaller\n' >> "$DAVPANEL_CONFIG"
    fi
fi

# weakpass check uses the Weakpass top 1M list from 2.0.13, drop the old cached English dictionary
rm -f /tmp/weakpass_dictionary.txt

# waf buffered every html response for the leak checks, adding ~230ms per page, off from 2.0.13
CORAZA_RULES="/etc/davpanel/caddy/coraza_rules.conf"
if [ -f "$CORAZA_RULES" ] && grep -q "^SecResponseBodyAccess On" "$CORAZA_RULES"; then
    echo "Disabling SecResponseBodyAccess in $CORAZA_RULES..."
    sed -i 's/^SecResponseBodyAccess On/SecResponseBodyAccess Off/' "$CORAZA_RULES"
    if podman ps --format '{{.Names}}' | grep -qx caddy; then
        echo "Reloading Caddy..."
        podman exec caddy caddy reload --config /etc/caddy/Caddyfile >/dev/null 2>&1
    fi
fi

# php containers share the mysql socket from 2.0.13 so apps can use localhost, patch the templates new users are created from
COMPOSE_TEMPLATE="/etc/davpanel/docker/compose/1.0/docker-compose.yml"
if [ -f "$COMPOSE_TEMPLATE" ]; then
    echo "Adding mysql socket mount to php-fpm services in $COMPOSE_TEMPLATE..."
    cp "$COMPOSE_TEMPLATE" "${COMPOSE_TEMPLATE}.bak-2.0.13"
    awk '
        /^  [A-Za-z0-9_.-]+:[[:space:]]*$/ { fpm = ($1 ~ /^php-fpm-/); added = 0 }
        { line = $0; sub(/[[:space:]]+$/, "", line) }
        fpm && line ~ /- \.\/sockets\/mysqld:\/var\/run\/mysqld$/ { if (added) next; added = 1 }
        { print }
        fpm && !added && line ~ /^[[:space:]]*- html_data:\/var\/www\/html\/$/ {
            match($0, /^[[:space:]]*/); print substr($0, 1, RLENGTH) "- ./sockets/mysqld:/var/run/mysqld"; added = 1
        }
    ' "${COMPOSE_TEMPLATE}.bak-2.0.13" > "$COMPOSE_TEMPLATE"
fi

# only fills the empty defaults, a socket path set by the admin is left alone
for ini in /etc/davpanel/php/ini/*.ini; do
    [ -f "$ini" ] || continue
    sed -i -E \
        -e 's|^(pdo_mysql\.default_socket)[[:space:]]*=[[:space:]]*\r?$|\1 = /var/run/mysqld/mysqld.sock|' \
        -e 's|^(mysqli\.default_socket)[[:space:]]*=[[:space:]]*\r?$|\1 = /var/run/mysqld/mysqld.sock|' \
        -e 's|^(mysql\.default_socket)[[:space:]]*=[[:space:]]*\r?$|\1 = /var/run/mysqld/mysqld.sock|' \
        "$ini"
done
