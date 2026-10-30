#!/bin/bash

davcli config update screenshots local

wget -O /etc/davpanel/docker/daemon/rootless.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/daemon/rootless.json

sed -i '/^SecRxPreFilter/s/^/#/' /etc/davpanel/caddy/coraza_rules.conf && docker --context=default restart caddy

timeout 5  mysql -uroot -e "SET GLOBAL event_scheduler = ON;"

timeout 5 mysql -uroot <<EOF
CREATE EVENT IF NOT EXISTS cleanup_expired_sessions
ON SCHEDULE EVERY 15 MINUTE
DO
  DELETE FROM active_sessions
  WHERE expires_at < NOW();
EOF
