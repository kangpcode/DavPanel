#!/bin/bash

echo
echo "Installing flask-sock for DavAdmin > Advanced > Web Terminal"
source /usr/local/admin/venv/bin/activate && pip install flask-sock && deactivate
service admin restart


echo
echo "Patching :ro bug for /run/user/ inside DavPanel UI container.."
sed -i.bak 's|/run/user/:/hostfs/run/user/:ro|/run/user/:/hostfs/run/user/:shared,rslave|g' /root/docker-compose.yml
cd /root && docker --context=default compose down davpanel && docker --context=default compose up -d davpanel


echo 
echo "Adding patch for FTP service"
yes yes | davcli patch 896
