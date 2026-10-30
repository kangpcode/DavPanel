#!/bin/bash

wget -O /usr/local/bin/davcli https://raw.githubusercontent.com/stefanpejcic/opencli/refs/heads/main/opencli && chmod +x /usr/local/bin/davcli
wget -O  /etc/davpanel/davadmin/config/features.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json

CONFIG_FILE="/etc/davpanel/davpanel/conf/davpanel.config"
cp "$CONFIG_FILE" /etc/davpanel/davpanel/conf/davpanel.config_1765BACKUP
if grep -q '^\[USERS\]' "$CONFIG_FILE" && ! grep -q '^password_strength=' "$CONFIG_FILE"; then
  awk '
  BEGIN {done=0}
  /^\[USERS\]/ {
    print
    print "password_strength=50"
    done=1
    next
  }
  {print}
  ' "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
fi
