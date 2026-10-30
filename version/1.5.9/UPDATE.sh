#!/bin/bash



# mailserver
sed -i 's|/etc/davpanel/caddy/ssl/acme-v02.api.letsencrypt.org-directory/:/etc/letsencrypt/live/:ro|/etc/davpanel/caddy/ssl/:/etc/davpanel/caddy/ssl/:ro|g' /usr/local/mail/openmail/compose.yml


echo "Changing ScreenshotsAPI URL.."
sed -i 's|http://screenshots-api.davpanel.com/screenshot|http://screenshots-v2.davpanel.com/api/screenshot|g' /etc/davpanel/davpanel/conf/davpanel.config


echo "Adding Mautic, SSL and Docroot modules.."
wget -O /etc/davpanel/davadmin/config/features.json  https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json

echo "Fix for '/root/davpanel_restart_needed'"
wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py

wget -O /etc/davpanel/davpanel/conf/blacklist_useragents.txt  https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/conf/blacklist_useragents.txt

echo "Enabling rule ID logging for WAF.."
sed -i 's/ABIJDEFHZ/ABIJDEFHKZ/g' /etc/davpanel/caddy/templates/domain.conf_with_modsec
sed -i 's/ABIJDEFHZ/ABIJDEFHKZ/g' /etc/davpanel/caddy/templates/domain.conf

for file in /etc/davpanel/caddy/domains/*.conf; do
    sed -i 's/ABIJDEFHZ/ABIJDEFHKZ/g' "$file"
done




mkdir -p /etc/davpanel/wordpress
wget -O /etc/davpanel/wordpress/mu-plugin.php https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/wordpress/mu-plugin.php

docker restart davpanel

echo "Fix for crons page bug in DavAdmin.."
FILE="/etc/cron.d/davpanel"
sed -i 's|root /bin/bash |root |' "$FILE"
sed -i 's|/usr/local/davcli|/usr/local/bin/davcli|g' "$FILE"


echo "OpenLitespeed.."
mkdir -p /etc/davpanel/openlitespeed
wget -O /etc/davpanel/nginx/vhosts/1.1/docker_openlitespeed_domain.conf https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/nginx/vhosts/1.1/docker_openlitespeed_domain.conf
wget -O /etc/davpanel/openlitespeed/httpd_config.conf https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/openlitespeed/httpd_config.conf
wget -O /etc/davpanel/openlitespeed/start.sh https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/openlitespeed/start.sh
chmod +x /etc/davpanel/openlitespeed/start.sh

# update .env

ENV_FILE="/etc/davpanel/docker/compose/1.0/.env"
DEFAULTS='
# OPENLITESPEED
OPENLITESPEED_VERSION="latest"
OPENLITESPEED_CPU="1.0"
OPENLITESPEED_RAM="1.0G"
'

if ! grep -q "OPENLITESPEED" "$ENV_FILE"; then
    echo "$DEFAULTS" >> "$ENV_FILE"
fi

