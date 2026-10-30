#!/bin/bash

echo
echo "📥 Updating features to include Mautic (BETA)"
wget -O /etc/davpanel/davadmin/config/features.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json

echo
echo "Updating DavPanel configuraiton to show errors regardless of dev_mode setting"
wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py

set -euo pipefail

echo
echo "Adding configuration option for SSH logins on 'DavAdmin > Notifications'."

FILE="/etc/davpanel/davadmin/config/notifications.ini"

if grep -xq 'ssh=yes' "$FILE"; then
  echo "ssh=yes already present. No changes needed."
  exit 0
fi

if grep -q '^\[DEFAULT\]' "$FILE"; then
  awk 'BEGIN{added=0}
       /^\[DEFAULT\]/ && added==0 { print; print "ssh=yes"; added=1; next }
       { print }
       END { if(added==0) print "ssh=yes" }' "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"
  echo "ssh=yes added immediately after [DEFAULT]."
else
  echo "" >> "$FILE"
  echo "ssh=yes" >> "$FILE"
  echo "DEFAULT section not found — ssh=yes appended at end of file."
fi

exit 0
