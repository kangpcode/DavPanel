#!/bin/bash

echo ""
echo "📥 Updating HTML templates for domains.."

wget -O /etc/davpanel/nginx/default_page.html https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/nginx/default_page.html
wget -O /etc/davpanel/nginx/suspended_user.html https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/nginx/suspended_user.html
wget -O /etc/davpanel/nginx/suspended_website.html https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/nginx/suspended_website.html


echo ""
echo "📥 Updating VirtualHost templates for domains.."

wget -O /etc/davpanel/nginx/vhosts/1.1/docker_nginx_domain.conf https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/nginx/vhosts/1.1/docker_nginx_domain.conf
wget -O /etc/davpanel/nginx/vhosts/1.1/docker_openresty_domain.conf https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/nginx/vhosts/1.1/docker_openresty_domain.conf
wget -O /etc/davpanel/nginx/vhosts/1.1/docker_apache_domain.conf https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/nginx/vhosts/1.1/docker_apache_domain.conf


echo ""
echo "📥 Updating docker-compose.yml file for new domains.."

cp /etc/davpanel/docker/compose/1.0/docker-compose.yml /etc/davpanel/docker/compose/1.0/127-docker-compose.yml
wget -O /etc/davpanel/docker/compose/1.0/docker-compose.yml https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/compose/1.0/docker-compose.yml


echo ""
echo "📥 Updating docker-compose.yml file for new domains.."

cp /etc/davpanel/docker/compose/1.0/.env /etc/davpanel/docker/compose/1.0/127.env
wget -O /etc/davpanel/docker/compose/1.0/.env https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/compose/1.0/.env

echo ""
echo "Changing collation to domains table to allow IDN characters.."
mysql -e "ALTER TABLE domains CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"


echo ""
echo "📥 Downloading daemon.json template for new users.."
mkdir -p /etc/davpanel/docker/daemon/
wget -O /etc/davpanel/docker/daemon/rootless.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/daemon/rootless.json

# todo: sed for existing users!
