#!/bin/bash

sed -i 's|/usr/local/admin/service/notifications.sh|/usr/local/davcli sentinel|g' /etc/cron.d/davpanel

wget -O /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py
