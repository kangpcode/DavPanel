#!/bin/bash

echo 
echo "Adding patch for FTP service"
yes yes | davcli patch 896

wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py
wget -O /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py

ln -s /usr/local/mail/openmail/mailserver.env /usr/local/mail/openmail/.env

echo
echo "Setting local screenshots.."
sed -i 's/^\(screenshots=\).*$/\1local/' /etc/davpanel/davpanel/conf/davpanel.config

docker restart davpanel




: '
mkdir -p /etc/davpanel/php/composer/
wget -O /etc/davpanel/php/composer/v2_composer.phar https://github.com/kangpcode/davpanel-configuration/raw/refs/heads/main/php/composer/v2_composer.phar
wget -O /etc/davpanel/php/composer/v1_composer.phar https://github.com/kangpcode/davpanel-configuration/raw/refs/heads/main/php/composer/v1_composer.phar

'
