#!/bin/bash

echo ""
echo "📥 Updating davadmin service.."
wget -O /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py
systemctl restart admin  > /dev/null 2>&1


echo ""
echo "📥 Updating rootless.json.."
wget -O /etc/davpanel/docker/daemon/rootless.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/daemon/rootless.json
