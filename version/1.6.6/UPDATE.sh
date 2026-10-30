#!/bin/bash

echo
echo "📥 Updating features to include PostgreSQL.."
wget -O /etc/davpanel/davadmin/config/features.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json

echo
echo "Applying patches for issue #750"
wget -O /etc/davpanel/docker/daemon/rootless.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/daemon/rootless.json

for file in /home/*/.config/docker/daemon.json; do
    [ -f "$file" ] || continue
    sed -i \
        -e 's/8\.8\.8\.8/1.1.1.1/g' \
        -e 's/8\.8\.4\.4/1.0.0.1/g' \
        "$file"
done


echo "YOU NEED TO RESTART DOCKER SERVICE FOR USERS OR SIMPLY REBOOT THE SERVER"
