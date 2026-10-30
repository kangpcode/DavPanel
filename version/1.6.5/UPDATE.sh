#!/bin/bash

#wget -O /etc/davpanel/docker/compose/nodejs.yml https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/compose/nodejs.yml
#wget -O /etc/davpanel/docker/compose/python.yml https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/compose/python.yml


CONFIG_FILE="/etc/davpanel/davadmin/config/notifications.ini"
LINE="dns=yes"
grep -qxF "$LINE" "$CONFIG_FILE" || echo "$LINE" >> "$CONFIG_FILE"
