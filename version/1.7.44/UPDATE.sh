#!/bin/bash

davcli config update dev_mode off

# services
curl -L -o /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py
curl -L -o /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py
curl -L -o /etc/systemd/system/admin.service https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/davadmin.service

systemctl daemon-reload

# caddy
sed -i '/interval 1h/d' /etc/davpanel/caddy/Caddyfile && docker --copntext=default restart caddy


