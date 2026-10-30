#!/bin/bash


wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py
wget -O /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py



echo "Adding patch for shortlived Let's Encrypt SSL certificates for IP address.."
cd /root && docker compose down caddy && docker image rm davpanel/caddy-coraza && docker compose up -d caddy
