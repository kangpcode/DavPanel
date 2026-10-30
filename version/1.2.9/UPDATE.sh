#!/bin/bash

echo ""
echo "📥 Updating docker-compose.yml file for new domains.."

cp /etc/davpanel/docker/compose/1.0/docker-compose.yml /etc/davpanel/docker/compose/1.0/128-docker-compose.yml
wget -O /etc/davpanel/docker/compose/1.0/docker-compose.yml https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/compose/1.0/docker-compose.yml


echo ""
echo "📥 Updating .env file for new domains.."

cp /etc/davpanel/docker/compose/1.0/.env /etc/davpanel/docker/compose/1.0/128.env
wget -O /etc/davpanel/docker/compose/1.0/.env https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/compose/1.0/.env

