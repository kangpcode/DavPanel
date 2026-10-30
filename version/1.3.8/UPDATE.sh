#!/bin/bash

mkdir -p /etc/davpanel/davpanel/features


wget --inet4-only -O /etc/davpanel/davpanel/features/default.txt https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/features/default.txt
wget --inet4-only -O /etc/davpanel/davadmin/config/features.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json


wget --inet4-only -O /etc/davpanel/caddy/templates/domain.conf_with_modsec https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/caddy/templates/domain.conf_with_modsec
wget --inet4-only -O /etc/davpanel/caddy/templates/domain.conf https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/caddy/templates/domain.conf

