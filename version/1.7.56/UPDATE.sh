#!/bin/bash

wget -O  /etc/davpanel/davadmin/config/features.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json

wget -O /etc/davpanel/ssh/admin_welcome.sh https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/ssh/admin_welcome.sh && chmod +x /etc/profile.d/welcome.sh

wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py

wget -O /etc/davpanel/wordpress/wp-cli.phar https://github.com/wp-cli/wp-cli/releases/download/v2.12.0/wp-cli-2.12.0.phar && chmod +x /etc/davpanel/wordpress/wp-cli.phar
