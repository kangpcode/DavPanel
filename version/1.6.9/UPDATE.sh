#!/bin/bash

echo
echo "Updating DavPanel configuration to show errors regardless of dev_mode setting"
wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py

echo
echo "Updating WP-CLI"
wget -O /etc/davpanel/wordpress/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

chmod +x /etc/davpanel/wordpress/wp-cli.phar
